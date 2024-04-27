import React from "react";
import { useSelector } from "react-redux";
import { selectLoggedInUser } from "../authSlice";
import { Navigate } from "react-router-dom";

export default function Protected({ children }) {
  const user = useSelector(selectLoggedInUser);
  return (
    <>
      {user ? (
        <div>{children}</div>
      ) : (
        <Navigate to="/login" replace={true}></Navigate>
      )}
    </>
  );
}
