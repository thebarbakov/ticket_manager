const Order = require("../models/Order");
const OrderPlaces = require("../models/OrderPlaces");
const Agent = require("../models/Agent");
const CastError = require("../errors/CastError");
const ServiceUnavailableError = require("../errors/ServiceUnavailableError");
const Discount = require("../models/Discount");
const Event = require("../models/Event");
const PlacesTariff = require("../models/PlacesTariff");
const Tariff = require("../models/Tariff");

class Order {
  constructor({
    order_id,
    created_by,
    agent_id,
    promocode,
    discount,
    pay_type_id,
    first_name,
    second_name,
    phone,
    email,
    static,
    places,
    event_id,
    status,
  }) {
    this.status = status;
    this.order_id = order_id;
    this.event_id = event_id;
    this.created_by = created_by;
    this.agent_id = agent_id;
    this.promocode = promocode;
    this.discount = discount;
    this.pay_type_id = pay_type_id;
    this.first_name = first_name;
    this.second_name = second_name;
    this.phone = phone;
    this.email = email;
    this.static = static;
    this.places = places;
  }

  async _calculateDiscount(discount, calculatedPlaces, summa) {
    try {
      if (!discount.is_on) return 0;
      if (discount.limit_is_active && discount.limit < 1) return 0;
      if (
        discount.condition_min_places &&
        this.places?.length < discount.condition_min_places
      )
        return 0;
      if (
        discount.condition_max_places &&
        this.places?.length > discount.condition_max_places
      )
        return 0;

      if (this.event.type === "tariff") {
        this.places?.forEach((place) => {
          if (
            !discount.tariff_available.find((el) => {
              el.tariff_id?.toString() === place.tariff_id.toString();
            })
          )
            return 0;
        });
      } else if (this.event.type === "places") {
        const placesTariff = await PlacesTariff.find({
          event_id: this.event._id,
          places: {
            $elemMatch: { id: { $in: places?.map((el) => el.place_id) } },
          },
        });
        placesTariff?.forEach((pt) => {
          if (
            !discount.places_tariff_available.find((el) => {
              el.places_tariff_id?.toString() === pt._id.toString();
            })
          )
            return 0;
        });
      }

      if (discount.condition_min_summa && discount.condition_min_summa > summa)
        return 0;
      if (discount.condition_max_summa && discount.condition_max_summa < summa)
        return 0;

      let discount_summa = 0;

      let calculatedPlacesDiscount = calculatedPlaces.map((place, ind) => {
        if (ind + 1 > max_places) return place;
        let discount_sum = 0;

        if (discount.summa) {
          discount_sum =
            place.price.price - discount.summa / calculatedPlaces.length;
        } else if (discount.percent) {
          discount_sum = (place.price.price * discount.percent) / 100;
        }
        if (discount_sum.toString().replace(/\d*\./, "").length > 2) {
          if (ind === 0) {
            discount_sum = Math.ceil(discount_sum * 100) / 100;
            discount_summa += discount_sum;
          } else {
            discount_sum = Math.floor(discount_sum * 100) / 100;
            discount_summa += discount_sum;
          }
        } else discount_summa += discount_sum;

        return { ...place, discount_sum };
      });

      if (discount.min_summa && discount.min_summa > discount_summa) {
        discount_summa = discount.min_summa;
        calculatedPlacesDiscount = calculatedPlaces.map((place, ind) => {
          if (ind + 1 > max_places) return place;
          let discount_sum = 0;
          discount_sum =
            place.price.price - discount.min_summa / calculatedPlaces.length;
          if (discount_sum.toString().replace(/\d*\./, "").length > 2) {
            if (ind === 0) {
              discount_sum = Math.ceil(discount_sum * 100) / 100;
              discount_summa += discount_sum;
            } else {
              discount_sum = Math.floor(discount_sum * 100) / 100;
            }
          }
          return { ...place, discount_sum };
        });
      }
      if (discount.max_summa && discount.max_summa < summa) {
        discount_summa = discount.max_summa;
        calculatedPlacesDiscount = calculatedPlaces.map((place, ind) => {
          if (ind + 1 > max_places) return place;
          let discount_sum = 0;
          discount_sum =
            place.price.price - discount.max_summa / calculatedPlaces.length;
          if (discount_sum.toString().replace(/\d*\./, "").length > 2) {
            if (ind === 0) {
              discount_sum = Math.ceil(discount_sum * 100) / 100;
              discount_summa += discount_sum;
            } else {
              discount_sum = Math.floor(discount_sum * 100) / 100;
            }
          }

          return { ...place, discount_sum };
        });
      }
      return {
        calculatedPlacesDiscount,
        discount_summa,
        discount,
      };
    } catch (e) {
      return e;
    }
  }

  async _calculatePlaces({ places }) {
    const calculatedPlaces = [];
    let summa = 0;
    for await (const place of places) {
      if (this.event.type === "tariff") {
        const price = await Tariff.findOne({
          event_id: this.event._id,
          _id: place.tariff_id,
        });
        summa += price.price;
        calculatedPlaces.push({
          ...place,
          price,
        });
      } else if (this.event.type === "places") {
        const price = await PlacesTariff.findOne({
          event_id: this.event._id,
          places: {
            $elemMatch: {
              id: place.place_id,
            },
          },
        });
        summa += price.price;
        calculatedPlaces.push({
          ...place,
          price,
        });
      }
    }
    return { summa, calculatedPlaces };
  }

  async _checkBookedPlaces({ places }) {
    try {
      const bookedPlaces = [];
      if (this.event.places) {
        const bookedOrders = await Order.find({
          event_id: this.event_id,
          status: { $ne: "canceled" },
        });
        bookedPlaces = await OrderPlaces.find({
          place_id: { $in: places.map(({ place_id }) => place_id) },
          order_id: { $in: bookedOrders.map(({ _id }) => _id) },
        });
        if (this.event.type === "tariff") {
          let prevLimitCalc = [];
          for await (const place of places) {
            const tariff = await Tariff.findOne({ _id: place.tariff_id });
            if (!tariff.is_on_limit) continue;
            const places_tariff = await OrderPlaces.find({
              tariff_id: tariff._id,
            });
            if (prevLimitCalc.find((el) => el.tariff_id === tariff._id)) {
              prevLimitCalc = prevLimitCalc.map((el) => {
                if (el.tariff_id === tariff._id)
                  return {
                    tariff_id: el.tariff_id,
                    limit: el.limit - 1,
                  };
              });
            } else {
              prevLimitCalc.push({
                tariff_id: tariff._id,
                limit: tariff.limit - places_tariff.length - 1,
              });
            }
          }
        }
        if (this.order.places) {
          for await (const place of this.order.places) {
            const tariff = await Tariff.findOne({ _id: place.tariff_id });
            if (!tariff.is_on_limit) continue;
            const places_tariff = await OrderPlaces.find({
              tariff_id: tariff._id,
            });
            if (prevLimitCalc.find((el) => el.tariff_id === tariff._id)) {
              prevLimitCalc = prevLimitCalc.map((el) => {
                if (el.tariff_id === tariff._id)
                  return {
                    tariff_id: el.tariff_id,
                    limit: el.limit + 1,
                  };
              });
            } else {
              prevLimitCalc.push({
                tariff_id: tariff._id,
                limit: tariff.limit - places_tariff.length + 1,
              });
            }
          }
        }
        if (this.order.places) {
          bookedPlaces.filter((el) =>
            this.order.places.find((pl) => el.place_id == pl.place_id)
          );
        }
        prevLimitCalc.forEach((el) => {
          if (el.limit < 0) bookedPlaces.push(el);
        });
      } else {
        let prevLimitCalc = [];
        for await (const place of places) {
          const tariff = await Tariff.findOne({ _id: place.tariff_id });
          if (!tariff.is_on_limit) continue;
          const places_tariff = await OrderPlaces.find({
            tariff_id: tariff._id,
          });
          if (prevLimitCalc.find((el) => el.tariff_id === tariff._id)) {
            prevLimitCalc = prevLimitCalc.map((el) => {
              if (el.tariff_id === tariff._id)
                return {
                  tariff_id: el.tariff_id,
                  limit: el.limit - 1,
                };
            });
          } else {
            prevLimitCalc.push({
              tariff_id: tariff._id,
              limit: tariff.limit - places_tariff.length - 1,
            });
          }
        }
        if (this.order.places) {
          for await (const place of this.order.places) {
            const tariff = await Tariff.findOne({ _id: place.tariff_id });
            if (!tariff.is_on_limit) continue;
            const places_tariff = await OrderPlaces.find({
              tariff_id: tariff._id,
            });
            if (prevLimitCalc.find((el) => el.tariff_id === tariff._id)) {
              prevLimitCalc = prevLimitCalc.map((el) => {
                if (el.tariff_id === tariff._id)
                  return {
                    tariff_id: el.tariff_id,
                    limit: el.limit + 1,
                  };
              });
            } else {
              prevLimitCalc.push({
                tariff_id: tariff._id,
                limit: tariff.limit - places_tariff.length + 1,
              });
            }
          }
        }
        prevLimitCalc.forEach((el) => {
          if (el.limit < 0) bookedPlaces.push(el);
        });
      }
      return bookedPlaces;
    } catch (e) {
      return e;
    }
  }

  async _create() {
    try {
      const event = await Event.findOne({ _id: this.event_id });

      const bookedPlaces = this._checkBookedPlaces({ places: this.places });

      if (bookedPlaces.length !== 0)
        return new CastError("Места недоступны для оформления заказа");

      const { summa, calculatedPlaces } = this._calculatePlaces({
        places: this.places,
      });

      let calculatedDiscount = 1;

      if (this.discount) {
        const discount = await Discount.findOne({
          _id: this.discount,
        });
        calculatedDiscount = await this._calculateDiscount(
          discount,
          calculatedPlaces,
          summa,
          this.places
        );
      } else if (this.promocode) {
        const discount = await Discount.findOne({
          promocode: this.promocode,
          is_on: true,
          limit: { $gte: 1 },
        });
        if (!discount) return new CastError("Промокод недействителен");
        calculatedDiscount = await this._calculateDiscount(
          discount,
          calculatedPlaces,
          summa,
          this.places
        );
      } else {
        const discounts = await Discount.find({
          $or: [
            { condition_min_summa: { $exists: true } },
            { condition_max_summa: { $exists: true } },
            { condition_min_places: { $exists: true } },
            { condition_max_places: { $exists: true } },
          ],
        });
        const result = [];
        for await (const disc of discounts) {
          const calcDisc = await this._calculateDiscount(
            discount,
            calculatedPlaces,
            summa,
            this.places
          );
          if (calcDisc !== 0)
            result.push({
              discount_summa: calcDisc.discount_summa,
              discount_id: disc._id,
            });
        }
        if (discounts.length !== 0) {
          let max_discount;

          result.forEach((disc) => {
            if (!max_discount.discount_summa) max_discount = disc;
            if (max_discount.discount_summa < disc.discount_summa)
              max_discount = disc;
          });

          const discount = await Discount.findOne({
            _id: max_discount.discount_id,
          });
          calculatedDiscount = await this._calculateDiscount(
            discount,
            calculatedPlaces,
            summa,
            this.places
          );
        }
      }

      if (calculatedDiscount === 0)
        return new CastError("Ошибка применения скидки");
      const newOrderBlank = {
        event_id: this.event_id,
        created_date: new Date(),
        summa,
        discount_sum: 0,
        total_sum: summa,
        status: this.status,
        pay_type_id: this.pay_type_id,
        is_tickets_sent: false,
        is_tickets_print: false,
        is_payed: false,
        history: [
          {
            user_id: this.created_by ? this.created_by : null,
            date: new Date(),
            text: "Заказ создан",
          },
        ],
      };
      if (this.created_by) newOrderBlank.created_by = this.created_by;
      if (this.agent_id) newOrderBlank.agent_id = this.agent_id;
      if ((calculatedDiscount !== 0) & (calculatedDiscount !== 1)) {
        newOrderBlank.discount = calculatedDiscount.discount._id;
        this.discount = calculatedDiscount.discount._id;
        newOrderBlank.discount_sum = calculatedDiscount.discount_summa;
        newOrderBlank.discount = summa - calculatedDiscount.discount_summa;
        newOrderBlank.history.push({
          user_id: this.created_by ? this.created_by : null,
          date: new Date(),
          text: `Применина скидка ${calculatedDiscount.discount._id}`,
        });
      }
      const newOrderModel = new Order(newOrderBlank);
      const newOrder = await newOrderModel.save();
      this.places = [];
      if (
        (calculatedDiscount !== 0) &
        (calculatedDiscount !== 1) &
        (calculatedDiscount !== undefined)
      ) {
        for await (const place of calculatedDiscount.calculatedPlacesDiscount) {
          const newOrderPlace = new OrderPlaces({
            order_id: newOrder._id,
            price: place.price.price,
            discount_sum: place.discount_sum ? place.discount_sum : 0,
            total_sum: place.discount_sum
              ? place.price.price - place.discount_sum
              : place.price.price,
            name: place.name,
            phone: place.phone,
            email: place.email,
            is_scanned: false,
          });
          await newOrderPlace.save();
        }
      } else {
        for await (const place of calculatedPlaces) {
          const newOrderPlace = new OrderPlaces({
            order_id: newOrder._id,
            price: place.price.price,
            discount_sum: 0,
            total_sum: place.price.price,
            name: place.name,
            phone: place.phone,
            email: place.email,
            is_scanned: false,
          });
          await newOrderPlace.save();
        }
      }

      const newOrderPlaces = await OrderPlaces.find({ order_id: newOrder._id });

      return {
        order: newOrder,
        places: newOrderPlaces,
      };
    } catch (e) {
      new ServiceUnavailableError(JSON.stringify(e));
    }
  }

  async init() {
    this.event = await Event.findOne({ _id: this.event_id });
    if (order_id) {
      this.order = await Order.findOne({ _id: this.order_id });
      this.order.places = await OrderPlaces.find({ order_id: this.order_id });
      if (this.order.agent_id)
        this.agent = await Agent.find({ _id: this.order.agent_id });
    } else {
      try {
        if (!Boolaean(this.agent_id) & Boolaean(this.email)) {
          const newAgent = new Agent({
            first_name: this.first_name,
            second_name: this.second_name,
            phone: this.phone,
            email: this.email,
            ...this.static,
          });
          this.agent = await newAgent.save();
        } else if (Boolaean(this.agent_id) & Boolaean(this.email)) {
          await Agent.updateOne(
            { _id: this.agent_id },
            {
              first_name: this.first_name,
              second_name: this.second_name,
              phone: this.phone,
              email: this.email,
              ...this.static,
            }
          );
          this.agent = await Agent.find({ _id: this.order.agent_id });
        } else {
          this.agent = await Agent.find({ _id: this.order.agent_id });
        }
        const { order, places } = await this._create();
        this.order = order;
        this.order.places = places;
      } catch (e) {
        return e;
      }
    }
  }

  async update({ discount, places, user_id }) {
    if (places) {
      const bookedPlaces = this._checkBookedPlaces({ places });

      if (bookedPlaces.length !== 0)
        return new CastError("Места недоступны для оформления заказа");

      this.places = places;
    }

    const { summa, calculatedPlaces } = this._calculatePlaces({
      places: this.places,
    });

    let calculatedDiscount = 1;

    if (discount) {
      const discount = await Discount.findOne({
        _id: this.discount,
      });
      calculatedDiscount = await this._calculateDiscount(
        discount,
        calculatedPlaces,
        summa,
        this.places
      );
    } else {
      const discounts = await Discount.find({
        $or: [
          { condition_min_summa: { $exists: true } },
          { condition_max_summa: { $exists: true } },
          { condition_min_places: { $exists: true } },
          { condition_max_places: { $exists: true } },
        ],
      });
      const result = [];
      for await (const disc of discounts) {
        const calcDisc = await this._calculateDiscount(
          discount,
          calculatedPlaces,
          summa,
          this.places
        );
        if (calcDisc !== 0)
          result.push({
            discount_summa: calcDisc.discount_summa,
            discount_id: disc._id,
          });
      }
      if (discounts.length !== 0) {
        let max_discount;

        result.forEach((disc) => {
          if (!max_discount.discount_summa) max_discount = disc;
          if (max_discount.discount_summa < disc.discount_summa)
            max_discount = disc;
        });

        const discount = await Discount.findOne({
          _id: max_discount.discount_id,
        });
        calculatedDiscount = await this._calculateDiscount(
          discount,
          calculatedPlaces,
          summa
        );
      }
    }

    if (calculatedDiscount === 0)
      return new CastError("Ошибка применения скидки");

    const updatedOrderBlank = {
      summa,
      discount_sum: 0,
      total_sum: summa,
    };

    if ((calculatedDiscount !== 0) & (calculatedDiscount !== 1)) {
      updatedOrderBlank.discount = calculatedDiscount.discount._id;
      this.discount = calculatedDiscount.discount._id;
      updatedOrderBlank.discount_sum = calculatedDiscount.discount_summa;
      updatedOrderBlank.discount = summa - calculatedDiscount.discount_summa;
    }

    await Order.updateOne({ _id: this.order._id }, updatedOrderBlank);

    this.places = [];

    await OrderPlaces.deleteMany({ _id: this.order._id });

    const history = {
      $push: {
        history: {
          $each: [
            {
              user_id: user_id ? user_id : null,
              date: new Date(),
              text: "Заказ изменен",
            },
          ],
        },
      },
    };

    if (
      (calculatedDiscount !== 0) &
      (calculatedDiscount !== 1) &
      (calculatedDiscount !== undefined)
    ) {
      history.$push.history.$each.push({
        user_id: user_id ? user_id : null,
        date: new Date(),
        text: "Применена скидка " + calculatedDiscount.discount.name,
      });
      for await (const place of calculatedDiscount.calculatedPlacesDiscount) {
        const newOrderPlace = new OrderPlaces({
          order_id: this.order._id,
          price: place.price.price,
          discount_sum: place.discount_sum ? place.discount_sum : 0,
          total_sum: place.discount_sum
            ? place.price.price - place.discount_sum
            : place.price.price,
          name: place.name,
          phone: place.phone,
          email: place.email,
          is_scanned: false,
        });
        await newOrderPlace.save();
      }
    } else {
      for await (const place of calculatedPlaces) {
        const newOrderPlace = new OrderPlaces({
          order_id: this.order._id,
          price: place.price.price,
          discount_sum: 0,
          total_sum: place.price.price,
          name: place.name,
          phone: place.phone,
          email: place.email,
          is_scanned: false,
        });
        await newOrderPlace.save();
      }
    }

    const newOrderPlaces = await OrderPlaces.find({ order_id: this.order._id });

    await Order.updateOne({ _id: this.order._id }, history);

    const editedOrder = await Order.findOne({ _id: this.order._id });

    this.order = editedOrder;
    this.order.places = newOrderPlaces;

    return {
      order: editedOrder,
      places: newOrderPlaces,
    };
  }
}

module.exports = Order;
