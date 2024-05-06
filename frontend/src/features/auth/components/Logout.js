import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { SignOutAsync, selectLoggedInUser } from "../authSlice";
import { Navigate } from "react-router-dom";

export default function Logout() {
  const dispatch = useDispatch();
  const user = useSelector(selectLoggedInUser);

  useEffect(() => {
    dispatch(SignOutAsync());
  }, [dispatch]);

  // Render the Navigate component conditionally
  return <>{!user ? <Navigate to="/login" replace={true} /> : null}</>;
}
