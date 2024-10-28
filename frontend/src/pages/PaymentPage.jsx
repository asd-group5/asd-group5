// PaymentPage.jsx
import React from "react";
import PaymentComponent from "../components/Payment/PaymentComponent";

const PaymentPage = () => {
  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#f3f4f6",
        padding: "2rem 1rem",
      }}
    >
      <div
        style={{
          maxWidth: "64rem",
          margin: "0 auto",
        }}
      >
        <h1
          style={{
            fontSize: "2.5rem",
            fontWeight: "700",
            color: "#111827",
            textAlign: "center",
            marginBottom: "2rem",
            textShadow: "0 0 1px rgba(0,0,0,0.1)",
          }}
        >
          Payment Management
        </h1>
        <PaymentComponent />
      </div>
    </div>
  );
};

export default PaymentPage;
