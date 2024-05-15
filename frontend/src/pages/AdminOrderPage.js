import React from "react";
import Navbar from "../features/navbar/Navbar";
import AdminOrder from "../features/admin/components/AdminOrder";

export default function AdminOrderPage() {
  return (
    <div>
      <Navbar>
        <AdminOrder></AdminOrder>
      </Navbar>
    </div>
  );
}
