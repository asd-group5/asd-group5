import React, { useState, useEffect } from "react";

const PaymentComponent = () => {
  const BASE_URL = "http://localhost:8000";

  const [paymentMethods, setPaymentMethods] = useState([]);
  const [newPaymentMethod, setNewPaymentMethod] = useState({
    name: "",
    cardNumber: "",
    expiryDate: "",
    cvv: "",
  });
  const [paymentAmount, setPaymentAmount] = useState("");
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("");

  useEffect(() => {
    getPaymentMethods();
  }, []);

  const getPaymentMethods = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      const response = await fetch(`${BASE_URL}/api/payment/methods/`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      setPaymentMethods(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error fetching payment methods:", error);
      // 임시 더미 데이터 사용
      setPaymentMethods([
        { id: 1, name: "Visa", cardNumber: "4111111111111111" },
        { id: 2, name: "MasterCard", cardNumber: "5555555555554444" },
      ]);
    }
  };

  const addPaymentMethod = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("accessToken");
      const response = await fetch(`${BASE_URL}/api/payment/methods/add/`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newPaymentMethod),
      });
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      setPaymentMethods([...paymentMethods, data]);
      setNewPaymentMethod({
        name: "",
        cardNumber: "",
        expiryDate: "",
        cvv: "",
      });
    } catch (error) {
      console.error("Error adding payment method:", error);
    }
  };

  const processPayment = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("accessToken");
      const response = await fetch(`${BASE_URL}/api/payment/process/`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: paymentAmount,
          paymentMethodId: selectedPaymentMethod,
        }),
      });
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      console.log("Payment processed:", data);
      alert("Payment processed successfully!");
      setPaymentAmount("");
      setSelectedPaymentMethod("");
    } catch (error) {
      console.error("Error processing payment:", error);
      alert("Error processing payment. Please try again.");
    }
  };

  return (
    <div>
      <h2>Add Payment Method</h2>
      <form onSubmit={addPaymentMethod}>
        <div>
          <label htmlFor="cardName">Name on Card:</label>
          <input
            type="text"
            id="cardName"
            value={newPaymentMethod.name}
            onChange={(e) =>
              setNewPaymentMethod({ ...newPaymentMethod, name: e.target.value })
            }
            required
          />
        </div>
        <div>
          <label htmlFor="cardNumber">Card Number:</label>
          <input
            type="text"
            id="cardNumber"
            value={newPaymentMethod.cardNumber}
            onChange={(e) =>
              setNewPaymentMethod({
                ...newPaymentMethod,
                cardNumber: e.target.value,
              })
            }
            required
          />
        </div>
        <div>
          <label htmlFor="expiryDate">Expiry Date:</label>
          <input
            type="text"
            id="expiryDate"
            placeholder="MM/YY"
            value={newPaymentMethod.expiryDate}
            onChange={(e) =>
              setNewPaymentMethod({
                ...newPaymentMethod,
                expiryDate: e.target.value,
              })
            }
            required
          />
        </div>
        <div>
          <label htmlFor="cvv">CVV:</label>
          <input
            type="text"
            id="cvv"
            value={newPaymentMethod.cvv}
            onChange={(e) =>
              setNewPaymentMethod({ ...newPaymentMethod, cvv: e.target.value })
            }
            required
          />
        </div>
        <button type="submit">Add Payment Method</button>
      </form>

      <h2>Make Payment</h2>
      <form onSubmit={processPayment}>
        <div>
          <label htmlFor="amount">Amount:</label>
          <input
            type="number"
            id="amount"
            min="0"
            step="0.01"
            value={paymentAmount}
            onChange={(e) => setPaymentAmount(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="paymentMethod">Select Payment Method:</label>
          <select
            id="paymentMethod"
            value={selectedPaymentMethod}
            onChange={(e) => setSelectedPaymentMethod(e.target.value)}
            required
          >
            <option value="">Select a payment method</option>
            {Array.isArray(paymentMethods) &&
              paymentMethods.map((method) => (
                <option key={method.id} value={method.id}>
                  {method.name} -{" "}
                  {method.cardNumber ? method.cardNumber.slice(-4) : "****"}
                </option>
              ))}
          </select>
        </div>
        <button type="submit">Process Payment</button>
      </form>
    </div>
  );
};

export default PaymentComponent;
