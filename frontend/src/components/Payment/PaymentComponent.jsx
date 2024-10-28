import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getValidToken } from "../../utils/auth";

const PaymentComponent = ({params}) => {
  const BASE_URL = "http://localhost:8000";
  const navigate = useNavigate();

  const [paymentMethods, setPaymentMethods] = useState([]);
  const [newPaymentMethod, setNewPaymentMethod] = useState({
    name: "",
    card_type: "CREDIT",
    card_number: "",
    expiry_date: "",
    cvv: "",
    card_holder_name: "",
    is_default: false,
  });
  const [paymentAmount, setPaymentAmount] = useState(params.total);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("");
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    getPaymentMethods();
  }, []);

  const getPaymentMethods = async () => {
    try {
      const token = await getValidToken();
      const response = await fetch(`${BASE_URL}/api/payment/methods/`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) throw new Error("Failed to fetch payment methods");
      const data = await response.json();
      setPaymentMethods(Array.isArray(data) ? data : []);
    } catch (error) {
      setError("Failed to load payment methods");
      console.error("Error fetching payment methods:", error);
    }
  };

  const handleSetDefault = async (id) => {
    try {
      const token = await getValidToken();
      const response = await fetch(
        `${BASE_URL}/api/payment/methods/${id}/set-default/`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      if (!response.ok) throw new Error("Failed to set default payment method");
      await getPaymentMethods();
      setSuccess("Default payment method updated successfully");
      setTimeout(() => setSuccess(null), 3000);
    } catch (error) {
      setError("Failed to set default payment method");
      console.error("Error setting default payment method:", error);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this payment method?"))
      return;

    try {
      const token = await getValidToken();
      const response = await fetch(`${BASE_URL}/api/payment/methods/${id}/`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) throw new Error("Failed to delete payment method");
      await getPaymentMethods();
      setSuccess("Payment method deleted successfully");
      setTimeout(() => setSuccess(null), 3000);
    } catch (error) {
      setError("Failed to delete payment method");
      console.error("Error deleting payment method:", error);
    }
  };

  const addPaymentMethod = async (e) => {
    e.preventDefault();
    try {
      const token = await getValidToken();
      const response = await fetch(`${BASE_URL}/api/payment/methods/add/`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: newPaymentMethod.card_holder_name,
          card_type: newPaymentMethod.card_type,
          cardNumber: newPaymentMethod.card_number,
          expiryDate: newPaymentMethod.expiry_date,
          cvv: newPaymentMethod.cvv,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to add payment method");
      }

      await getPaymentMethods();
      setNewPaymentMethod({
        name: "",
        card_type: "CREDIT",
        card_number: "",
        expiry_date: "",
        cvv: "",
        card_holder_name: "",
        is_default: false,
      });
      setSuccess("Payment method added successfully");
      setTimeout(() => setSuccess(null), 3000);
    } catch (error) {
      setError(error.message || "Failed to add payment method");
      console.error("Error adding payment method:", error);
    }
  };

  const processPayment = async (e) => {
    e.preventDefault();
    try {
      const token = await getValidToken();
      const response = await fetch(`${BASE_URL}/api/payment/process/`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: paymentAmount,
          payment_method_id: selectedPaymentMethod,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Payment processing failed");
      }

      const data = await response.json();
      navigate("/payment-confirmation", {
        state: {
          paymentId: data.id,
          amount: paymentAmount,
          status: data.status,
          transactionId: data.transaction_id,
        },
      });
    } catch (error) {
      setError(error.message || "Payment processing failed. Please try again.");
      console.error("Error processing payment:", error);
    }
  };
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
          maxWidth: "56rem",
          margin: "0 auto",
          backgroundColor: "white",
          borderRadius: "0.5rem",
          padding: "2rem",
          boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1)",
        }}
      >
        {/* 알림 메시지 */}
        {error && (
          <div
            style={{
              backgroundColor: "#fee2e2",
              border: "2px solid #f87171",
              color: "#991b1b",
              padding: "1rem",
              borderRadius: "0.375rem",
              marginBottom: "1rem",
              fontSize: "1rem",
              fontWeight: "500",
            }}
          >
            {error}
          </div>
        )}

        {success && (
          <div
            style={{
              backgroundColor: "#dcfce7",
              border: "2px solid #4ade80",
              color: "#166534",
              padding: "1rem",
              borderRadius: "0.375rem",
              marginBottom: "1rem",
              fontSize: "1rem",
              fontWeight: "500",
            }}
          >
            {success}
          </div>
        )}

        {/* Add Payment Method Form */}
        <div
          style={{
            marginBottom: "2rem",
            padding: "1.5rem",
            backgroundColor: "white",
            borderRadius: "0.5rem",
            border: "1px solid #e5e7eb",
          }}
        >
          <h2
            style={{
              fontSize: "1.75rem",
              fontWeight: "700",
              marginBottom: "1.5rem",
              color: "#111827",
              paddingBottom: "0.75rem",
              borderBottom: "2px solid #e5e7eb",
            }}
          >
            Add Payment Method
          </h2>
          <form
            onSubmit={addPaymentMethod}
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "1.5rem",
            }}
          >
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "1.5rem",
              }}
            >
              {/* Card Holder Name */}
              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: "1rem",
                    fontWeight: "600",
                    color: "#1f2937",
                    marginBottom: "0.5rem",
                  }}
                >
                  Card Holder Name:
                </label>
                <input
                  type="text"
                  value={newPaymentMethod.card_holder_name}
                  onChange={(e) =>
                    setNewPaymentMethod({
                      ...newPaymentMethod,
                      card_holder_name: e.target.value,
                    })
                  }
                  style={{
                    width: "100%",
                    padding: "0.75rem",
                    borderRadius: "0.375rem",
                    border: "2px solid #d1d5db",
                    backgroundColor: "white",
                    color: "#111827",
                    fontSize: "1rem",
                    boxSizing: "border-box",
                  }}
                  required
                />
              </div>

              {/* Card Type */}
              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: "1rem",
                    fontWeight: "600",
                    color: "#1f2937",
                    marginBottom: "0.5rem",
                  }}
                >
                  Card Type:
                </label>
                <select
                  value={newPaymentMethod.card_type}
                  onChange={(e) =>
                    setNewPaymentMethod({
                      ...newPaymentMethod,
                      card_type: e.target.value,
                    })
                  }
                  style={{
                    width: "100%",
                    padding: "0.75rem",
                    borderRadius: "0.375rem",
                    border: "2px solid #d1d5db",
                    backgroundColor: "white",
                    color: "#111827",
                    fontSize: "1rem",
                    boxSizing: "border-box",
                    cursor: "pointer",
                  }}
                >
                  <option
                    value="CREDIT"
                    style={{ color: "#111827", backgroundColor: "white" }}
                  >
                    Credit Card
                  </option>
                  <option
                    value="DEBIT"
                    style={{ color: "#111827", backgroundColor: "white" }}
                  >
                    Debit Card
                  </option>
                </select>
              </div>

              {/* Card Number */}
              <div style={{ gridColumn: "1 / -1" }}>
                <label
                  style={{
                    display: "block",
                    fontSize: "1rem",
                    fontWeight: "600",
                    color: "#1f2937",
                    marginBottom: "0.5rem",
                  }}
                >
                  Card Number:
                </label>
                <input
                  type="text"
                  value={newPaymentMethod.card_number}
                  onChange={(e) =>
                    setNewPaymentMethod({
                      ...newPaymentMethod,
                      card_number: e.target.value,
                    })
                  }
                  style={{
                    width: "100%",
                    padding: "0.75rem",
                    borderRadius: "0.375rem",
                    border: "2px solid #d1d5db",
                    backgroundColor: "white",
                    color: "#111827",
                    fontSize: "1rem",
                    boxSizing: "border-box",
                  }}
                  maxLength="16"
                  required
                />
              </div>

              {/* Expiry Date & CVV */}
              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: "1rem",
                    fontWeight: "600",
                    color: "#1f2937",
                    marginBottom: "0.5rem",
                  }}
                >
                  Expiry Date:
                </label>
                <input
                  type="text"
                  placeholder="MM/YY"
                  value={newPaymentMethod.expiry_date}
                  onChange={(e) =>
                    setNewPaymentMethod({
                      ...newPaymentMethod,
                      expiry_date: e.target.value,
                    })
                  }
                  style={{
                    width: "100%",
                    padding: "0.75rem",
                    borderRadius: "0.375rem",
                    border: "2px solid #d1d5db",
                    backgroundColor: "white",
                    color: "#111827",
                    fontSize: "1rem",
                    boxSizing: "border-box",
                  }}
                  maxLength="5"
                  required
                />
              </div>
              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: "1rem",
                    fontWeight: "600",
                    color: "#1f2937",
                    marginBottom: "0.5rem",
                  }}
                >
                  CVV:
                </label>
                <input
                  type="text"
                  value={newPaymentMethod.cvv}
                  onChange={(e) =>
                    setNewPaymentMethod({
                      ...newPaymentMethod,
                      cvv: e.target.value,
                    })
                  }
                  style={{
                    width: "100%",
                    padding: "0.75rem",
                    borderRadius: "0.375rem",
                    border: "2px solid #d1d5db",
                    backgroundColor: "white",
                    color: "#111827",
                    fontSize: "1rem",
                    boxSizing: "border-box",
                  }}
                  maxLength="4"
                  required
                />
              </div>
            </div>

            <div style={{ display: "flex", justifyContent: "flex-end" }}>
              <button
                type="submit"
                style={{
                  padding: "0.75rem 1.5rem",
                  backgroundColor: "#2563eb",
                  color: "white",
                  border: "none",
                  borderRadius: "0.375rem",
                  fontSize: "1rem",
                  fontWeight: "500",
                  cursor: "pointer",
                  boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
                }}
              >
                Add Payment Method
              </button>
            </div>
          </form>
        </div>
        {/* Make Payment Section */}
        <div
          style={{
            marginBottom: "2rem",
            padding: "1.5rem",
            backgroundColor: "white",
            borderRadius: "0.5rem",
            border: "1px solid #e5e7eb",
          }}
        >
          <h2
            style={{
              fontSize: "1.75rem",
              fontWeight: "700",
              marginBottom: "1.5rem",
              color: "#111827",
              paddingBottom: "0.75rem",
              borderBottom: "2px solid #e5e7eb",
            }}
          >
            Make Payment
          </h2>
          <form
            onSubmit={processPayment}
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "1.5rem",
            }}
          >
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "1.5rem",
              }}
            >
              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: "1rem",
                    fontWeight: "600",
                    color: "#1f2937",
                    marginBottom: "0.5rem",
                  }}
                >
                  Amount:
                </label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={paymentAmount}
                  onChange={(e) => setPaymentAmount(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "0.75rem",
                    borderRadius: "0.375rem",
                    border: "2px solid #d1d5db",
                    backgroundColor: "white",
                    color: "#111827",
                    fontSize: "1rem",
                    boxSizing: "border-box",
                  }}
                  required
                />
              </div>
              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: "1rem",
                    fontWeight: "600",
                    color: "#1f2937",
                    marginBottom: "0.5rem",
                  }}
                >
                  Select Payment Method:
                </label>
                <select
                  value={selectedPaymentMethod}
                  onChange={(e) => setSelectedPaymentMethod(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "0.75rem",
                    borderRadius: "0.375rem",
                    border: "2px solid #d1d5db",
                    backgroundColor: "white",
                    color: "#111827",
                    fontSize: "1rem",
                    boxSizing: "border-box",
                    cursor: "pointer",
                  }}
                  required
                >
                  <option value="" style={{ color: "#6b7280" }}>
                    Select a payment method
                  </option>
                  {paymentMethods.map((method) => (
                    <option
                      key={method.id}
                      value={method.id}
                      style={{ color: "#111827" }}
                    >
                      {method.card_type} - ****{" "}
                      {method.card_number
                        ? method.card_number.slice(-4)
                        : "XXXX"}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div style={{ display: "flex", justifyContent: "flex-end" }}>
              <button
                type="submit"
                style={{
                  padding: "0.75rem 1.5rem",
                  backgroundColor: "#059669",
                  color: "white",
                  border: "none",
                  borderRadius: "0.375rem",
                  fontSize: "1rem",
                  fontWeight: "500",
                  cursor: "pointer",
                  boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
                }}
              >
                Process Payment
              </button>
            </div>
          </form>
        </div>

        {/* Saved Payment Methods Section */}
        <div
          style={{
            padding: "1.5rem",
            backgroundColor: "white",
            borderRadius: "0.5rem",
            border: "1px solid #e5e7eb",
          }}
        >
          <h2
            style={{
              fontSize: "1.75rem",
              fontWeight: "700",
              marginBottom: "1.5rem",
              color: "#111827",
              paddingBottom: "0.75rem",
              borderBottom: "2px solid #e5e7eb",
            }}
          >
            Saved Payment Methods
          </h2>
          <div
            style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
          >
            {paymentMethods.map((method) => (
              <div
                key={method.id}
                style={{
                  padding: "1.5rem",
                  borderRadius: "0.5rem",
                  border: `2px solid ${
                    method.is_default ? "#2563eb" : "#e5e7eb"
                  }`,
                  backgroundColor: method.is_default ? "#f0f7ff" : "white",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <div>
                    <div
                      style={{
                        fontSize: "1.125rem",
                        fontWeight: "600",
                        color: "#111827",
                        display: "flex",
                        alignItems: "center",
                        gap: "0.5rem",
                      }}
                    >
                      {method.card_type} - ****{" "}
                      {method.card_number
                        ? method.card_number.slice(-4)
                        : "XXXX"}
                      {method.is_default && (
                        <span
                          style={{
                            fontSize: "0.875rem",
                            color: "#2563eb",
                            backgroundColor: "#dbeafe",
                            padding: "0.25rem 0.5rem",
                            borderRadius: "0.25rem",
                            fontWeight: "500",
                          }}
                        >
                          Default
                        </span>
                      )}
                    </div>
                    <div
                      style={{
                        fontSize: "0.875rem",
                        color: "#6b7280",
                        marginTop: "0.25rem",
                      }}
                    >
                      {method.card_holder_name || method.name} | Expires:{" "}
                      {method.expiry_date}
                    </div>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      gap: "0.75rem",
                    }}
                  >
                    {!method.is_default && (
                      <button
                        onClick={() => handleSetDefault(method.id)}
                        style={{
                          padding: "0.5rem 1rem",
                          backgroundColor: "#dbeafe",
                          color: "#2563eb",
                          border: "none",
                          borderRadius: "0.375rem",
                          fontSize: "0.875rem",
                          fontWeight: "500",
                          cursor: "pointer",
                        }}
                      >
                        Set Default
                      </button>
                    )}
                    <button
                      onClick={() => handleDelete(method.id)}
                      style={{
                        padding: "0.5rem 1rem",
                        backgroundColor: "#fef2f2",
                        color: "#dc2626",
                        border: "none",
                        borderRadius: "0.375rem",
                        fontSize: "0.875rem",
                        fontWeight: "500",
                        cursor: "pointer",
                      }}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
            {paymentMethods.length === 0 && (
              <div
                style={{
                  textAlign: "center",
                  padding: "3rem",
                  backgroundColor: "#f9fafb",
                  borderRadius: "0.5rem",
                  color: "#6b7280",
                }}
              >
                <p style={{ fontSize: "1rem", marginBottom: "0.5rem" }}>
                  No payment methods added yet.
                </p>
                <p style={{ fontSize: "0.875rem" }}>
                  Add your first payment method above.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentComponent;
