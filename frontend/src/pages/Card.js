import { StarIcon } from "@heroicons/react/24/outline";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { addToCartAsync, selectItems } from "../features/cart/cartSlice";

const truncateDescription = (description, wordLimit) => {
  const words = description.split(" ");
  if (words.length > wordLimit) {
    return words.slice(0, wordLimit).join(" ") + "...";
  }
  return description;
};

const Card = ({
  image,
  description,
  title,
  href,
  price,
  rating,
  id,
  handleCart,
  buttonName,
}) => {
  return (
    <div className="bg-white p-4 rounded-lg shadow-lg  transition-transform transform hover:scale-105">
      <Link to={`/product-detail/${id}`}>
        <div className="h-48 overflow-hidden mb-4 rounded-lg">
          <img src={image} alt={title} className="w-full h-full object-cover" />
        </div>
        <div className="text-center">
          <div>
            <h3 className="text-xl h-14 font-bold mb-2">{title}</h3>
          </div>
          <div className="text-center h-auto overflow-hidden mb-4">
            <p className="text-gray-700">
              {truncateDescription(description, 8)}
            </p>
          </div>
        </div>
      </Link>
      <div className="pt-4 border-t border-gray-300 flex justify-between items-center">
        <div className="relative flex items-center">
          <StarIcon className="w-5 h-5 text-yellow-500 mr-1" />
          <span className="text-lg font-bold text-gray-900">{rating}</span>
        </div>
        <div className="text-lg font-bold text-gray-900">${price}</div>
        <div>
          {buttonName === "Edit Product" ? (
            <Link
              type="button"
              to={`/admin/product-form/edit/${id}`}
              className="px-4 py-2 border border-gray-800 bg-gray-900 text-white rounded-full shadow-lg transition-all duration-200 hover:bg-yellow-500"
            >
              Edit Product
            </Link>
          ) : (
            <button
              onClick={() => handleCart(id)}
              className="px-4 py-2 border border-gray-800 bg-gray-900 text-white rounded-full shadow-lg transition-all duration-200 hover:bg-yellow-500"
            >
              {buttonName}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Card;
