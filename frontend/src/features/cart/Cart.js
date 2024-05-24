import React, { Fragment, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { Link, Navigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { deleteCartAsync, selectItems, updateCartAsync } from "./cartSlice";
import { selectUserInfo } from "../user/userSlice";
import { discountPercentage } from "../../app/constants";
import Modal from "../common/Modal";

export default function Cart() {
  const [open, setOpen] = useState(true);
  const [openModal, setOpenModal] = useState(-1);
  const dispatch = useDispatch();
  const items = useSelector(selectItems);
  const user = useSelector(selectUserInfo);
  const totalAmount = items.reduce(
    (amount, item) => discountPercentage(item.product) * item.quantity + amount,
    0
  );
  const totalItems = items.reduce((amount, item) => item.quantity + amount, 0);

  const handleQuantity = (e, item) => {
    const newItem = {
      quantity: +e.target.value,
      _id: item.id,
    };
    dispatch(updateCartAsync(newItem));
  };
  const handleDelete = (item) => {
    dispatch(deleteCartAsync(item.id));
  };

  return (
    <>
      {items.length === 0 && <Navigate to="/" replace={true}></Navigate>}

      <div>
        <div className="mx-auto mt-20 bg-white max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mt-8">
            <div className="flow-root">
              <h1 className="text-4xl font-bold tracking-tight text-gray-900 text-left">
                Cart
              </h1>
              <ul role="list" className="-my-6 divide-y divide-gray-200">
                {items.map((product) => (
                  <li key={product.id} className="flex py-6">
                    <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                      <img
                        src={product.product.thumbnail}
                        alt={product.title}
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
                            Qty
                          </label>
                          <select
                            value={product.quantity}
                            onChange={(e) => handleQuantity(e, product)}
                          >
                            <option value="1">1</option>
                            <option value="2">2</option>
                            <option value="3">3</option>
                            <option value="4">4</option>
                          </select>
                        </div>

                        <div className="flex">
                          <Modal
                            title={`Delete ${product.product.title}`}
                            message="Are you sure you want to delete this Cart Item"
                            DangerOption="Delete"
                            CancelOption="Cancel"
                            dangerAction={() => handleDelete(product)}
                            cancelAction={() => setOpenModal(-1)}
                            showModal={openModal === product.id}
                          ></Modal>
                          <button
                            onClick={(e) => setOpenModal(product.id)}
                            type="button"
                            className="font-medium text-indigo-600 hover:text-indigo-500"
                          >
                            Remove
                          </button>
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
              <p>${totalAmount}</p>
            </div>
            <div className="flex justify-between text-base font-medium text-gray-900">
              <p>Total Items in cart</p>
              <p>{totalItems}</p>
            </div>
            <p className="mt-0.5 text-sm text-gray-500">
              Shipping and taxes calculated at checkout.
            </p>
            <div className="mt-6">
              <Link
                to="/checkout"
                className="flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-6 py-3 text-base font-medium text-white shadow-sm hover:bg-indigo-700"
              >
                Checkout
              </Link>
            </div>
            <div className="mt-6 flex justify-center text-center text-sm text-gray-500">
              <p>
                or{" "}
                <Link to="/">
                  <button
                    type="button"
                    className="font-medium text-indigo-600 hover:text-indigo-500"
                    onClick={() => setOpen(false)}
                  >
                    Continue Shopping
                    <span aria-hidden="true"> &rarr;</span>
                  </button>
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
