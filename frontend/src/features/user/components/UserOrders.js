import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  fetchLoggedInUserOrdersAsync,
  selectUserOrders,
} from "../userSlice";
import { discountPercentage } from "../../../app/constants";
import { ThreeDots } from "react-loader-spinner";
import { selectUserInfoStatus } from "../../order/orderSlice";

export default function UserOrders() {
  const dispatch = useDispatch();
  const orders = useSelector(selectUserOrders);
  const status = useSelector(selectUserInfoStatus);

  useEffect(() => {
    dispatch(fetchLoggedInUserOrdersAsync());
  }, [dispatch]);

  return (
    <div>
      {status === "loading" ? (
        <div className="flex justify-center items-center h-full">
          <ThreeDots
            visible={true}
            height="100"
            width="100"
            margin
            color="#4fa94d"
            radius="9"
            ariaLabel="three-dots-loading"
            wrapperStyle={{}}
            wrapperClass=""
          />
        </div>
      ) : null}
      {orders &&
        orders.map((order) => (
          <div
            key={order.id}
            className="mx-auto mt-10 bg-white max-w-7xl px-4 sm:px-6 lg:px-8"
          >
            <div className="mt-8">
              <div className="flow-root">
                <h1 className="text-4xl font-bold tracking-tight text-gray-900 text-left">
                  Order # {order.id}
                </h1>
                <h3 className="text-xl font-bold tracking-tight text-red-900 text-left pb-5">
                  Order Status # {order.status}
                </h3>
                <ul role="list" className="-my-6 divide-y divide-gray-200">
                  {order.items.map((product) => (
                    <li key={product.product.id} className="flex py-6">
                      <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                        <img
                          src={product.product.thumbnail}
                          alt={product.product.title}
                          className="h-full w-full object-cover object-center"
                        />
                      </div>
                      <div className="ml-4 flex flex-1 flex-col">
                        <div>
                          <div className="flex justify-between text-base font-medium text-gray-900">
                            <h3>
                              <a href={product.product.href}>
                                {product.product.title}
                              </a>
                            </h3>
                            <p className="ml-4">
                              ${discountPercentage(product.product)}
                            </p>
                          </div>
                          <p className="mt-1 text-sm text-gray-500">
                            {product.product.brand}
                          </p>
                        </div>
                        <div className="flex flex-1 items-end justify-between text-sm">
                          <div className="text-gray-500">
                            <label
                              htmlFor="quantity"
                              className="inline-block mr-5 text-sm font-medium leading-6 text-gray-900"
                            >
                              Qty : {product.quantity}
                            </label>
                          </div>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="border-t border-gray-200 px-4 py-6 sm:px-6">
              <div className="flex justify-between text-base font-medium text-gray-900">
                <p>Subtotal</p>
                <p>${order.totalAmount}</p>
              </div>
              <div className="flex justify-between text-base font-medium text-gray-900">
                <p>Total Items in cart</p>
                <p>{order.totalItems}</p>
              </div>
              <p className="mt-0.5 text-sm text-gray-500">Shipping Address: </p>
              <div className="flex justify-between px-5 gap-x-6 py-5 border-solid border-2 border-gray-200">
                <div className="flex min-w-0 gap-x-4">
                  <div className="min-w-0 flex-auto">
                    <p className="text-sm font-semibold leading-6 text-gray-900">
                      {order.selectedAddress.name}
                    </p>
                    <p className="mt-1 truncate text-xs leading-5 text-gray-500">
                      {order.selectedAddress.street}
                    </p>
                    <p className="mt-1 truncate text-xs leading-5 text-gray-500">
                      {order.selectedAddress.pinCode}
                    </p>
                  </div>
                </div>
                <div className="hidden shrink-0 sm:flex sm:flex-col sm:items-end">
                  <p className="text-sm leading-6 text-gray-900">
                    Phone : {order.selectedAddress.phone}
                  </p>
                  <p className="text-sm leading-6 text-gray-500">
                    {order.selectedAddress.city}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))}
    </div>
  );
}
