import React, { useEffect, useState } from "react";
import {
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { useSelector } from "react-redux";
import { selectCurrentOrderStatus } from "../features/order/orderSlice";

export default function CheckoutForm() {
  const stripe = useStripe();
  const elements = useElements();
  const currentOrder = useSelector(selectCurrentOrderStatus);
  const [message, setMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const checkPaymentIntentStatus = async () => {
      if (!stripe) {
        return;
      }

      const clientSecret = new URLSearchParams(window.location.search).get(
        "payment_intent_client_secret"
      );

      if (!clientSecret) {
        return;
      }

      try {
        const { paymentIntent } = await stripe.retrievePaymentIntent(
          clientSecret
        );
        switch (paymentIntent.status) {
          case "succeeded":
            setMessage("Payment succeeded!");
            break;
          case "processing":
            setMessage("Your payment is processing.");
            break;
          case "requires_payment_method":
            setMessage("Your payment was not successful, please try again.");
            break;
          default:
            setMessage("Something went wrong.");
            break;
        }
      } catch (error) {
        console.error("Error retrieving payment intent:", error);
        setMessage("An unexpected error occurred.");
      }
    };

    checkPaymentIntentStatus();
  }, [stripe]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!stripe || !elements) {
      // Stripe.js hasn't yet loaded.
      // Make sure to disable form submission until Stripe.js has loaded.
      return;
    }

    setIsLoading(true);

    try {
      const { error } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          // Make sure to change this to your payment completion page
          return_url: `https://mern-ekart-project.vercel.app/order-success/${currentOrder.id}`,
        },
      });

      if (error) {
        console.error("Payment confirmation error:", error);
        if (error.type === "card_error" || error.type === "validation_error") {
          setMessage(error.message);
        } else {
          setMessage("An unexpected error occurred.");
        }
      }
    } catch (error) {
      console.error("Error during payment confirmation:", error);
      setMessage(
        "An unexpected error occurred. Please check your internet connection and try again."
      );
    }

    setIsLoading(false);
  };

  const paymentElementOptions = {
    layout: "tabs",
  };

  return (
    <form id="payment-form" onSubmit={handleSubmit}>
      <PaymentElement id="payment-element" options={paymentElementOptions} />
      <button disabled={isLoading || !stripe || !elements} id="submit">
        <span id="button-text">
          {isLoading ? <div className="spinner" id="spinner"></div> : "Pay now"}
        </span>
      </button>
      {/* Show any error or success messages */}
      {message && <div id="payment-message">{message}</div>}
    </form>
  );
}
