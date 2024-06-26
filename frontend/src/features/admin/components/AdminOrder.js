import React, { useEffect, useState } from "react";
import { ITEMS_PER_PAGE, discountPercentage } from "../../../app/constants";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchAllOrdersAsync,
  selectAllOrders,
  selectTotalOrders,
  updateOrderAsync,
} from "../../order/orderSlice";
import {
  XMarkIcon,
  EyeIcon,
  PencilIcon,
  ArrowUpIcon,
  ArrowDownIcon,
} from "@heroicons/react/24/outline";
import { Pagination } from "../../common/Pagination";

export default function AdminOrder() {
  const dispatch = useDispatch();
  const [page, setPage] = useState(1);
  const [editableOrderId, setEditableOrderId] = useState(-1);
  const [sort, setSort] = useState({});

  const orders = useSelector(selectAllOrders);
  const totalOrders = useSelector(selectTotalOrders);

  useEffect(() => {
    const pagination = { _page: page, _limit: ITEMS_PER_PAGE };
    dispatch(fetchAllOrdersAsync({ sort, pagination }));
  }, [dispatch, page, sort]);

  const handleShow = () => {
    console.log("handleShow");
  };
  const handleEdit = (order) => {
    setEditableOrderId(order.id);
  };
  const handleOrderStatus = (e, order) => {
    const updateOrder = { ...order, status: e.target.value };
    console.log(e.target.value);
    dispatch(updateOrderAsync(updateOrder));
    setEditableOrderId(-1);
  };
  const handleOrderPaymentStatus = (e, order) => {
    const updateOrder = { ...order, paymentStatus: e.target.value };
    console.log(e.target.value);
    dispatch(updateOrderAsync(updateOrder));
    setEditableOrderId(-1);
  };

  const handleSort = (sortOption) => {
    const newSort = {
      _sort: sortOption.sort,
      _order: sortOption.order,
    };
    console.log(newSort);
    setSort(newSort);
  };

  const handlePage = (page) => {
    setPage(page);
    const pagination = { _page: page, _limit: ITEMS_PER_PAGE };
    dispatch(fetchAllOrdersAsync(pagination));
  };
  const chooseColor = (orderStatus) => {
    switch (orderStatus) {
      case "pending":
        return "bg-purple-200 text-purple-600";
      case "dispatched":
        return "bg-yellow-200 text-yellow-600";
      case "delivered":
        return "bg-green-200 text-green-600";
      case "received":
        return "bg-green-200 text-green-600";
      case "cancelled":
        return "bg-red-200 text-red-600";
      default:
        return;
    }
  };
  return (
    <>
      <div className="overflow-x-auto">
        <div className="bg-gray-100 flex items-center justify-center  font-sans overflow-hidden">
          <div className="w-full">
            <div className="bg-white shadow-md rounded my-6">
              <table className="w-full table-auto">
                <thead>
                  <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
                    <th
                      className="py-3 px-3 text-left"
                      onClick={(e) =>
                        handleSort({
                          sort: "id",
                          order: sort._order === "asc" ? "desc" : "asc",
                        })
                      }
                    >
                      Orders#{" "}
                      {sort._sort === "id" && sort._order === "asc" ? (
                        <ArrowUpIcon className="w-4 h-4 inline"></ArrowUpIcon>
                      ) : (
                        <ArrowDownIcon className="w-4 h-4 inline"></ArrowDownIcon>
                      )}
                    </th>
                    <th className="py-3 px-3 text-left">Items</th>
                    <th
                      className="py-3 px-3 text-center"
                      onClick={(e) =>
                        handleSort({
                          sort: "totalAmount",
                          order: sort._order === "asc" ? "desc" : "asc",
                        })
                      }
                    >
                      Total Amount#
                      {sort._sort === "totalAmount" && sort._order === "asc" ? (
                        <ArrowUpIcon className="w-4 h-4 inline"></ArrowUpIcon>
                      ) : (
                        <ArrowDownIcon className="w-4 h-4 inline"></ArrowDownIcon>
                      )}
                    </th>
                    <th className="py-3 px-3 text-center">Shipping Address</th>
                    <th className="py-3 px-3 text-center">Order Status</th>
                    <th className="py-3 px-3 text-center">Payment</th>
                    <th className="py-3 px-3 text-center">Payment Status</th>
                    <th
                      className="py-3 px-3 text-center"
                      onClick={(e) =>
                        handleSort({
                          sort: "createdAt",
                          order: sort._order === "asc" ? "desc" : "asc",
                        })
                      }
                    >
                      Order Time#
                      {sort._sort === "createdAt" && sort._order === "asc" ? (
                        <ArrowUpIcon className="w-4 h-4 inline"></ArrowUpIcon>
                      ) : (
                        <ArrowDownIcon className="w-4 h-4 inline"></ArrowDownIcon>
                      )}
                    </th>
                    <th
                      className="py-3 px-3 text-center"
                      onClick={(e) =>
                        handleSort({
                          sort: "updatedAt",
                          order: sort._order === "asc" ? "desc" : "asc",
                        })
                      }
                    >
                      Last Update Time#
                      {sort._sort === "updatedAt" && sort._order === "asc" ? (
                        <ArrowUpIcon className="w-4 h-4 inline"></ArrowUpIcon>
                      ) : (
                        <ArrowDownIcon className="w-4 h-4 inline"></ArrowDownIcon>
                      )}
                    </th>
                    <th className="py-3 px-3 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="text-gray-600 text-sm font-light">
                  {orders?.map((order) => (
                    <tr className="border-b border-gray-200 hover:bg-gray-100">
                      <td className="py-3 px-3 text-left whitespace-nowrap">
                        <div className="flex items-center">
                          <span className="font-medium">{order.id}</span>
                        </div>
                      </td>
                      <td className="py-3 px-3 text-left">
                        {order.items.map((item) => {
                          return (
                            <div
                              className="flex items-center"
                              key={item.product.id}
                            >
                              <div className="mr-2">
                                <img
                                  className="w-10 h-10 rounded-xl"
                                  src={item.product.thumbnail}
                                  alt={item.product.title}
                                />
                              </div>
                              <span>
                                {item.product.title} - {item.quantity} - $
                                {discountPercentage(item.product)}
                              </span>
                            </div>
                          );
                        })}
                      </td>

                      <td className="py-3 px-3 text-center">
                        <div className="flex items-center justify-center text-md font-semibold">
                          {order.totalAmount}
                        </div>
                      </td>
                      <td className="py-3 px-3 text-center">
                        <div className=" items-center justify-center text-md font-semibold">
                          <div>
                            <strong>{order.selectedAddress.name}</strong>
                          </div>
                          <div>{order.selectedAddress.phone}</div>
                          <div>{order.selectedAddress.street}</div>
                          <div>{order.selectedAddress.city}</div>
                          <div>{order.selectedAddress.state}</div>
                          <div>{order.selectedAddress.pinCode}</div>
                        </div>
                      </td>
                      <td className="py-3 px-3 text-center">
                        {order.id === editableOrderId ? (
                          <select onChange={(e) => handleOrderStatus(e, order)}>
                            <option value="pending">Pending</option>
                            <option value="dispatched">Dispatched</option>
                            <option value="delivered">Delivered</option>
                            <option value="cancelled">cancelled</option>
                          </select>
                        ) : (
                          <span
                            className={`${chooseColor(
                              order.status
                            )} py-1 px-3 rounded-full text-xs`}
                          >
                            {order.status}
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-3 text-center">
                        <div className="flex items-center justify-center text-md font-semibold">
                          {order.paymentMethod}
                        </div>
                      </td>
                      <td className="py-3 px-3 text-center">
                        {order.id === editableOrderId &&
                        order.paymentMethod === "cash" ? (
                          <select
                            onChange={(e) => handleOrderPaymentStatus(e, order)}
                          >
                            <option value="pending">Pending</option>
                            <option value="received">Received</option>
                          </select>
                        ) : (
                          <span
                            className={`${chooseColor(
                              order.paymentStatus
                            )} py-1 px-3 rounded-full text-xs`}
                          >
                            {order.paymentStatus}
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-3 text-center">
                        <div className="flex items-center justify-center text-md font-semibold">
                          {order.createdAt
                            ? new Date(order.createdAt).toLocaleString()
                            : null}
                        </div>
                      </td>
                      <td className="py-3 px-3 text-center">
                        <div className="flex items-center justify-center text-md font-semibold">
                          {order.updatedAt
                            ? new Date(order.updatedAt).toLocaleString()
                            : null}{" "}
                        </div>
                      </td>
                      <td className="py-3 px-3 text-center">
                        <div className="flex item-center justify-center">
                          <div className="w-4 mr-2 transform hover:text-purple-500 hover:scale-110">
                            <EyeIcon
                              className="w-5 h-5"
                              onClick={handleShow}
                            ></EyeIcon>
                          </div>
                          <div className="w-4 mr-2 transform hover:text-purple-500 hover:scale-110">
                            <PencilIcon
                              className="w-5 h-5"
                              onClick={() => handleEdit(order)}
                            ></PencilIcon>
                          </div>
                          <div className="w-4 mr-2 transform hover:text-purple-500 hover:scale-110"></div>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
        <Pagination
          page={page}
          handlepage={handlePage}
          totalItems={totalOrders}
        ></Pagination>
      </div>
    </>
  );
}
