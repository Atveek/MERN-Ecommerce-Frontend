import React from "react";
import Navbar from "../features/navbar/Navbar";
import UserOrders from "../features/user/components/UserOrders";

export default function UserOrderPage() {
  return (
    <Navbar>
      <h1 className="mx-auto text-2xl">My order:</h1>
      <UserOrders></UserOrders>
    </Navbar>
  );
}
