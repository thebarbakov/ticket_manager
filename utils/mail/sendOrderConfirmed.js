const Agent = require("../../models/Agent");
const Config = require("../../models/Config");
const Event = require("../../models/Event");
const Hall = require("../../models/Hall");
const Order = require("../../models/Order");
const OrderPlaces = require("../../models/OrderPlaces");
const PayType = require("../../models/PayType");
const Place = require("../../models/Place");
const PlacesTariff = require("../../models/PlacesTariff");
const Tariff = require("../../models/Tariff");
const sendEmail = require("./sendEmail");

const { SYSTEM_URL } = process.env;

const sendOrderConfirmed = async ({ order_id }) => {
  const orderModal = await Order.findOne({ _id: order_id });
  const payType = await PayType.findOne({ _id: orderModal.pay_type_id });
  const config = await Config.find();

  const agent = await Agent.findOne({ _id: orderModal.agent_id });

  const places = await OrderPlaces.find({ order_id: orderModal._id });

  const event = await Event.findOne({ _id: orderModal.event_id });

  const pay_type = await PayType.findOne({ _id: orderModal.pay_type_id });
  const hall = await Hall.findOne({ _id: event.hall_id });
  const placesResult = [];

  for await (const { _doc } of places) {
    let tariff;
    if (event.type === "places") {
      tariff = await PlacesTariff.findOne(
        { _id: _doc.places_tariff_id },
        { name: 1 }
      );
    } else {
      tariff = await Tariff.findOne({ _id: _doc.tariff_id }, { name: 1 });
    }

    if (event.places) {
      let place = await Place.findOne(
        { _id: _doc.place_id },
        { row: 1, place: 1 }
      );
      placesResult.push({
        ..._doc,
        tariff,
        place,
      });
    } else {
      placesResult.push({
        ..._doc,
        tariff,
      });
    }
  }
  const order = { ...orderModal._doc, event, pay_type, hall, places: placesResult };

  await sendEmail({
    to: agent.email,
    subject: `Подтверждение заказа № ${order.number}`,
    html: `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
    <html
      xmlns="http://www.w3.org/1999/xhtml"
      style="
        font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
        box-sizing: border-box;
        font-size: 14px;
        margin: 0;
      "
    >
      <head>
        <meta name="viewport" content="width=device-width" />
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
        <title>Подтверждение заказа № ${order.number}</title>
    
        <style type="text/css">
          img {
            max-width: 100%;
          }
          body {
            -webkit-font-smoothing: antialiased;
            -webkit-text-size-adjust: none;
            width: 100% !important;
            height: 100%;
            line-height: 1.6em;
          }
          body {
            background-color: #f6f6f6;
          }
          @media only screen and (max-width: 640px) {
            body {
              padding: 0 !important;
            }
            h1 {
              font-weight: 800 !important;
              margin: 20px 0 5px !important;
            }
            h2 {
              font-weight: 800 !important;
              margin: 20px 0 5px !important;
            }
            h3 {
              font-weight: 800 !important;
              margin: 20px 0 5px !important;
            }
            h4 {
              font-weight: 800 !important;
              margin: 20px 0 5px !important;
            }
            h1 {
              font-size: 22px !important;
            }
            h2 {
              font-size: 18px !important;
            }
            h3 {
              font-size: 16px !important;
            }
            .container {
              padding: 0 !important;
              width: 100% !important;
            }
            .content {
              padding: 0 !important;
            }
            .content-wrap {
              padding: 10px !important;
            }
            .invoice {
              width: 100% !important;
            }
          }
        </style>
      </head>
    
      <body
        itemscope
        itemtype="http://schema.org/EmailMessage"
        style="
          font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
          box-sizing: border-box;
          font-size: 14px;
          -webkit-font-smoothing: antialiased;
          -webkit-text-size-adjust: none;
          width: 100% !important;
          height: 100%;
          line-height: 1.6em;
          background-color: #f6f6f6;
          margin: 0;
        "
        bgcolor="#f6f6f6"
      >
        <table
          class="body-wrap"
          style="
            font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
            box-sizing: border-box;
            font-size: 14px;
            width: 100%;
            background-color: #f6f6f6;
            margin: 0;
          "
          bgcolor="#f6f6f6"
        >
          <tr
            style="
              font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
              box-sizing: border-box;
              font-size: 14px;
              margin: 0;
            "
          >
            <td
              style="
                font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
                box-sizing: border-box;
                font-size: 14px;
                vertical-align: top;
                margin: 0;
              "
              valign="top"
            ></td>
            <td
              class="container"
              width="600"
              style="
                font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
                box-sizing: border-box;
                font-size: 14px;
                vertical-align: top;
                display: block !important;
                max-width: 600px !important;
                clear: both !important;
                margin: 0 auto;
              "
              valign="top"
            >
              <div
                class="content"
                style="
                  font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
                  box-sizing: border-box;
                  font-size: 14px;
                  max-width: 600px;
                  display: block;
                  margin: 0 auto;
                  padding: 20px;
                "
              >
                <table
                  class="main"
                  width="100%"
                  cellpadding="0"
                  cellspacing="0"
                  style="
                    font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
                    box-sizing: border-box;
                    font-size: 14px;
                    border-radius: 3px;
                    background-color: #fff;
                    margin: 0;
                    border: 1px solid #e9e9e9;
                  "
                  bgcolor="#fff"
                >
                  <tr
                    style="
                      font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
                      box-sizing: border-box;
                      font-size: 14px;
                      margin: 0;
                    "
                  >
                    <td
                      class="content-wrap aligncenter"
                      style="
                        font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
                        box-sizing: border-box;
                        font-size: 14px;
                        vertical-align: top;
                        text-align: center;
                        margin: 0;
                        padding: 20px;
                      "
                      align="center"
                      valign="top"
                    >
                      <table
                        width="100%"
                        cellpadding="0"
                        cellspacing="0"
                        style="
                          font-family: 'Helvetica Neue', Helvetica, Arial,
                            sans-serif;
                          box-sizing: border-box;
                          font-size: 14px;
                          margin: 0;
                        "
                      >
                        <tr
                          style="
                            font-family: 'Helvetica Neue', Helvetica, Arial,
                              sans-serif;
                            box-sizing: border-box;
                            font-size: 14px;
                            margin: 0;
                          "
                        >
                          <td
                            class="content-block"
                            style="
                              font-family: 'Helvetica Neue', Helvetica, Arial,
                                sans-serif;
                              box-sizing: border-box;
                              font-size: 14px;
                              vertical-align: top;
                              margin: 0;
                              padding: 0 0 20px;
                            "
                            valign="top"
                          >
                            <h1
                              class="aligncenter"
                              style="
                                font-family: 'Helvetica Neue', Helvetica, Arial,
                                  'Lucida Grande', sans-serif;
                                box-sizing: border-box;
                                font-size: 32px;
                                color: #000;
                                line-height: 1.2em;
                                font-weight: 500;
                                text-align: center;
                                margin: 40px 0 0;
                              "
                              align="center"
                            >
                              Заказ №${order.number}
                            </h1>
                          </td>
                        </tr>
                        <tr
                          style="
                            font-family: 'Helvetica Neue', Helvetica, Arial,
                              sans-serif;
                            box-sizing: border-box;
                            font-size: 14px;
                            margin: 0;
                          "
                        >
                          <td
                            class="content-block"
                            style="
                              font-family: 'Helvetica Neue', Helvetica, Arial,
                                sans-serif;
                              box-sizing: border-box;
                              font-size: 14px;
                              vertical-align: top;
                              margin: 0;
                              padding: 0 0 20px;
                            "
                            valign="top"
                          >
                            <h2
                              class="aligncenter"
                              style="
                                font-family: 'Helvetica Neue', Helvetica, Arial,
                                  'Lucida Grande', sans-serif;
                                box-sizing: border-box;
                                font-size: 18px;
                                color: #000;
                                line-height: 1.2em;
                                text-align: center;
                                margin: 40px 0 0;
                              "
                              align="center"
                            >
                              ${
                                agent.first_name
                              }, недавно вы оформили заказ на сайте <a href="${SYSTEM_URL}">${SYSTEM_URL}</a>. Отправляем Вам состав Вашего заказа.
                            </h2>
                          </td>
                        </tr>
                        <tr
                          style="
                            font-family: 'Helvetica Neue', Helvetica, Arial,
                              sans-serif;
                            box-sizing: border-box;
                            font-size: 14px;
                            margin: 0;
                          "
                        >
                          <td
                            class="content-block"
                            style="
                              font-family: 'Helvetica Neue', Helvetica, Arial,
                                sans-serif;
                              box-sizing: border-box;
                              font-size: 14px;
                              vertical-align: top;
                              margin: 0;
                              padding: 0 0 20px;
                            "
                            valign="top"
                          >
                              Вы выбрали тип оплаты ${payType.name}.
                          </td>
                        </tr>
                        ${
                          payType.code === "TRANSFER"
                            ? `<tr
                            style="
                              font-family: 'Helvetica Neue', Helvetica, Arial,
                                sans-serif;
                              box-sizing: border-box;
                              font-size: 14px;
                              margin: 0;
                            "
                          >
                            <td
                              class="content-block"
                              style="
                                font-family: 'Helvetica Neue', Helvetica, Arial,
                                  sans-serif;
                                box-sizing: border-box;
                                font-size: 14px;
                                vertical-align: top;
                                margin: 0;
                                font-weight: bold;
                                padding: 0 0 20px;
                              "
                              valign="top"
                            >
                                ${
                                  config.find(
                                    (el) =>
                                      el.key ===
                                      "pay_types.transfer.card_number"
                                  ).value
                                }
                                <p><strong>${
                                  config.find(
                                    (el) =>
                                      el.key ===
                                      "pay_types.transfer.card_number"
                                  ).value
                                }</strong></p>
                            </td>
                          </tr>`
                            : payType.code === "CASH"
                            ? `<tr
                              style="
                            font-family: 'Helvetica Neue', Helvetica, Arial,
                              sans-serif;
                            box-sizing: border-box;
                            font-size: 14px;
                            margin: 0;
                          "
                            >
                              <td
                                class="content-block"
                                style="
                              font-family: 'Helvetica Neue', Helvetica, Arial,
                                sans-serif;
                              box-sizing: border-box;
                              font-size: 14px;
                              vertical-align: top;
                              font-weight: bold;
                              margin: 0;
                              padding: 0 0 20px;
                            "
                                valign="top"
                              >
                              ${
                                config.find(
                                  (el) => el.key === "pay_types.cash.descr"
                                ).value
                              }
                              </td>
                            </tr>`
                            : ""
                        }
                        <tr
                          style="
                            font-family: 'Helvetica Neue', Helvetica, Arial,
                              sans-serif;
                            box-sizing: border-box;
                            font-size: 14px;
                            margin: 0;
                          "
                        >
                          <td
                            class="content-block aligncenter"
                            style="
                              font-family: 'Helvetica Neue', Helvetica, Arial,
                                sans-serif;
                              box-sizing: border-box;
                              font-size: 14px;
                              vertical-align: top;
                              text-align: center;
                              margin: 0;
                              padding: 0 0 20px;
                            "
                            align="center"
                            valign="top"
                          >
                            <table
                              class="invoice"
                              style="
                                font-family: 'Helvetica Neue', Helvetica, Arial,
                                  sans-serif;
                                box-sizing: border-box;
                                font-size: 14px;
                                text-align: left;
                                width: 80%;
                                margin: 40px auto;
                              "
                            >
                            <tr
                             style="font-family: 'Helvetica Neue',Helvetica,Arial,sans-serif;
                             box-sizing: border-box;
                             font-size: 14px;
                             margin: 0;"
                             >
                                <td style="font-family: 'Helvetica Neue',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; vertical-align: top; margin: 0; padding: 5px 0;" valign="top">
                                    ${order.event.name} | ${new Date(
      order.event.date
    ).toLocaleDateString("ru-RU", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    })}
                                <br style="font-family: 'Helvetica Neue',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; margin: 0;" />
                                    ${order.hall.name}, ${order.hall.address}
                             </tr>
                              <tr
                                style="
                                  font-family: 'Helvetica Neue', Helvetica, Arial,
                                    sans-serif;
                                  box-sizing: border-box;
                                  font-size: 14px;
                                  margin: 0;
                                "
                              >
                                <td
                                  style="
                                    font-family: 'Helvetica Neue', Helvetica, Arial,
                                      sans-serif;
                                    box-sizing: border-box;
                                    font-size: 14px;
                                    vertical-align: top;
                                    margin: 0;
                                    padding: 5px 0;
                                  "
                                  valign="top"
                                >
                                  <table
                                    class="invoice-items"
                                    cellpadding="0"
                                    cellspacing="0"
                                    style="
                                      font-family: 'Helvetica Neue', Helvetica,
                                        Arial, sans-serif;
                                      box-sizing: border-box;
                                      font-size: 14px;
                                      width: 100%;
                                      margin: 0;
                                    "
                                  >
                                  ${order.places.map((place) => {
                                    if (order.event.places)
                                      return `<tr
                                        style="
                                        font-family: 'Helvetica Neue', Helvetica,
                                            Arial, sans-serif;
                                        box-sizing: border-box;
                                        font-size: 14px;
                                        margin: 0;
                                        "
                                        >
                                        <td
                                        style="
                                            font-family: 'Helvetica Neue', Helvetica,
                                            Arial, sans-serif;
                                            box-sizing: border-box;
                                            font-size: 14px;
                                            vertical-align: top;
                                            border-top-width: 1px;
                                            border-top-color: #eee;
                                            border-top-style: solid;
                                            margin: 0;
                                            padding: 5px 0;
                                        "
                                        valign="top"
                                        >
                                        ${place.place.row} ряд, ${
                                        place.place.place
                                      } место
                                        <br />
                                        ${place.tariff.name}
                                        </td>
                                        <td
                                        class="alignright"
                                        style="
                                            font-family: 'Helvetica Neue', Helvetica,
                                            Arial, sans-serif;
                                            box-sizing: border-box;
                                            font-size: 14px;
                                            vertical-align: top;
                                            text-align: right;
                                            border-top-width: 1px;
                                            border-top-color: #eee;
                                            border-top-style: solid;
                                            margin: 0;
                                            padding: 5px 0;
                                        "
                                        align="right"
                                        valign="top"
                                        >
                                        ${
                                          place.discount_sum
                                            ? `<s>${place.price} ${
                                                config.find(
                                                  (el) =>
                                                    el.key ===
                                                    "pay_types.currency"
                                                ).value
                                              }</s><br />${place.total_sum} ${
                                                config.find(
                                                  (el) =>
                                                    el.key ===
                                                    "pay_types.currency"
                                                ).value
                                              }`
                                            : `${place.total_sum} ${
                                                config.find(
                                                  (el) =>
                                                    el.key ===
                                                    "pay_types.currency"
                                                ).value
                                              }`
                                        }
                                        </td>
                                        </tr>`;
                                    else
                                      return `<tr
                                        style="
                                        font-family: 'Helvetica Neue', Helvetica,
                                            Arial, sans-serif;
                                        box-sizing: border-box;
                                        font-size: 14px;
                                        margin: 0;
                                        "
                                        >
                                        <td
                                        style="
                                            font-family: 'Helvetica Neue', Helvetica,
                                            Arial, sans-serif;
                                            box-sizing: border-box;
                                            font-size: 14px;
                                            vertical-align: top;
                                            border-top-width: 1px;
                                            border-top-color: #eee;
                                            border-top-style: solid;
                                            margin: 0;
                                            padding: 5px 0;
                                        "
                                        valign="top"
                                        >
                                        ${place.tariff.name}
                                        </td>
                                        <td
                                        class="alignright"
                                        style="
                                            font-family: 'Helvetica Neue', Helvetica,
                                            Arial, sans-serif;
                                            box-sizing: border-box;
                                            font-size: 14px;
                                            vertical-align: top;
                                            text-align: right;
                                            border-top-width: 1px;
                                            border-top-color: #eee;
                                            border-top-style: solid;
                                            margin: 0;
                                            padding: 5px 0;
                                        "
                                        align="right"
                                        valign="top"
                                        >
                                        ${
                                          place.discount_sum
                                            ? `<s>${place.price} ${
                                                config.find(
                                                  (el) =>
                                                    el.key ===
                                                    "pay_types.currency"
                                                ).value
                                              }</s><br />${place.total_sum} ${
                                                config.find(
                                                  (el) =>
                                                    el.key ===
                                                    "pay_types.currency"
                                                ).value
                                              }`
                                            : `${place.total_sum} ${
                                                config.find(
                                                  (el) =>
                                                    el.key ===
                                                    "pay_types.currency"
                                                ).value
                                              }`
                                        }
                                          </td>
                                        </tr>`;
                                  })}
                                    <tr
                                      class="total"
                                      style="
                                        font-family: 'Helvetica Neue', Helvetica,
                                          Arial, sans-serif;
                                        box-sizing: border-box;
                                        font-size: 14px;
                                        margin: 0;
                                      "
                                    >
                                      <td
                                        class="alignright"
                                        width="80%"
                                        style="
                                          font-family: 'Helvetica Neue', Helvetica,
                                            Arial, sans-serif;
                                          box-sizing: border-box;
                                          font-size: 14px;
                                          vertical-align: top;
                                          text-align: right;
                                          border-top-width: 2px;
                                          border-top-color: #333;
                                          border-top-style: solid;
                                          border-bottom-color: #333;
                                          border-bottom-width: 2px;
                                          border-bottom-style: solid;
                                          font-weight: 700;
                                          margin: 0;
                                          padding: 5px 0;
                                        "
                                        align="right"
                                        valign="top"
                                      >
                                        Итого
                                      </td>
                                      <td
                                        class="alignright"
                                        style="
                                          font-family: 'Helvetica Neue', Helvetica,
                                            Arial, sans-serif;
                                          box-sizing: border-box;
                                          font-size: 14px;
                                          vertical-align: top;
                                          text-align: right;
                                          border-top-width: 2px;
                                          border-top-color: #333;
                                          border-top-style: solid;
                                          border-bottom-color: #333;
                                          border-bottom-width: 2px;
                                          border-bottom-style: solid;
                                          font-weight: 700;
                                          margin: 0;
                                          padding: 5px 0;
                                        "
                                        align="right"
                                        valign="top"
                                      >
                                        ${
                                          order.discount_sum
                                            ? `<s>${order.summa} ${
                                                config.find(
                                                  (el) =>
                                                    el.key ===
                                                    "pay_types.currency"
                                                ).value
                                              }</s><br />${order.total_sum} ${
                                                config.find(
                                                  (el) =>
                                                    el.key ===
                                                    "pay_types.currency"
                                                ).value
                                              }`
                                            : `${order.total_sum} ${
                                                config.find(
                                                  (el) =>
                                                    el.key ===
                                                    "pay_types.currency"
                                                ).value
                                              }`
                                        }
                                      </td>
                                    </tr>
                                  </table>
                                </td>
                              </tr>
                            </table>
                          </td>
                        </tr>
                        <tr
                          style="
                            font-family: 'Helvetica Neue', Helvetica, Arial,
                              sans-serif;
                            box-sizing: border-box;
                            font-size: 14px;
                            margin: 0;
                          "
                        >
                          <td
                            class="content-block aligncenter"
                            style="
                              font-family: 'Helvetica Neue', Helvetica, Arial,
                                sans-serif;
                              box-sizing: border-box;
                              font-size: 14px;
                              vertical-align: top;
                              text-align: center;
                              margin: 0;
                              padding: 0 0 20px;
                            "
                            align="center"
                            valign="top"
                          >
                           Подробнее <a href="${
                             SYSTEM_URL + "/profle/orders/" + order._id
                           }">на сайте</a>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                </table>
                <div
                  class="footer"
                  style="
                    font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
                    box-sizing: border-box;
                    font-size: 14px;
                    width: 100%;
                    clear: both;
                    color: #999;
                    margin: 0;
                    padding: 20px;
                  "
                >
                </div>
              </div>
            </td>
            <td
              style="
                font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
                box-sizing: border-box;
                font-size: 14px;
                vertical-align: top;
                margin: 0;
              "
              valign="top"
            ></td>
          </tr>
        </table>
      </body>
    </html>
    `,
  });
};

module.exports = sendOrderConfirmed;
