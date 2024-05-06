import React from "react";
import { Route, Routes } from "react-router-dom";
import PayTypes from "./PayTypes/PayTypes";
import Halls from "./Halls/Halls";
import Events from "./Events/Events";
import Tariffs from "./Tariffs/Tariffs";
import PlacesTariffs from "./PlacesTariffs/PlacesTariffs";
import Discount from "./Discount/Discount";
import Order from "./Order/Order";
import User from "./User/User";
import Me from "./User/Me";
import Dashboard from "./Dashboard";
import Config from "./Config";

export default function CloseRoutes({ getMe, signOut }) {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/pay_types/*" element={<PayTypes />} />
      <Route path="/halls/*" element={<Halls />} />
      <Route path="/events/*" element={<Events />} />
      <Route path="/tariffs/*" element={<Tariffs />} />
      <Route path="/discounts/*" element={<Discount />} />
      <Route path="/places_tariffs/*" element={<PlacesTariffs />} />
      <Route path="/orders/*" element={<Order />} />
      <Route path="/users/*" element={<User />} />
      <Route path="/config" element={<Config />} />
      <Route path="/me" element={<Me getMe={getMe} signOut={signOut} />} />
    </Routes>
  );
}
