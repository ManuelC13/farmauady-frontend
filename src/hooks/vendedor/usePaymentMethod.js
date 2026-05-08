import { useState } from "react";

export function usePaymentMethod() {
  const [paymentMethod, setPaymentMethod] = useState("efectivo");

  return {
    paymentMethod,
    setPaymentMethod,
  };
}
