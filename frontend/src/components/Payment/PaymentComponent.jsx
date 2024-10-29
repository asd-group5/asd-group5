import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getValidToken } from "../../utils/auth";

const PaymentComponent = () => {
  const BASE_URL = "http://localhost:8000/api";
  const navigate = useNavigate();

  // Validation helper functions
  const validateCardNumber = (number) => {
    const cardRegex = /^[0-9]{16}$/;
    return cardRegex.test(number);
  };

  const validateExpiryDate = (date) => {
    const dateRegex = /^(0[1-9]|1[0-2])\/([0-9]{2})$/;
    if (!dateRegex.test(date)) return false;

    const [month, year] = date.split("/");
    const expiry = new Date(2000 + parseInt(year), parseInt(month) - 1);
    const today = new Date();
    return expiry > today;
  };

  const validateCVV = (cvv) => {
    const cvvRegex = /^[0-9]{3,4}$/;
    return cvvRegex.test(cvv);
  };

  const validateAmount = (amount) => {
    return amount > 0;
  };

  const validateNotEmpty = (value) => {
    return value.trim().length > 0;
  };

  // States
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
  const [paymentAmount, setPaymentAmount] = useState("");
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("");
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [fieldErrors, setFieldErrors] = useState({
    card_holder_name: "",
    card_number: "",
    expiry_date: "",
    cvv: "",
    amount: "",
    payment_method: "",
  });

  useEffect(() => {
    getPaymentMethods();
  }, []);

  const validatePaymentMethodForm = () => {
    const errors = {};

    if (!validateNotEmpty(newPaymentMethod.card_holder_name)) {
      errors.card_holder_name = "Card holder name is required";
    }

    if (!validateCardNumber(newPaymentMethod.card_number)) {
      errors.card_number = "Please enter a valid 16-digit card number";
    }

    if (!validateExpiryDate(newPaymentMethod.expiry_date)) {
      errors.expiry_date =
        "Please enter a valid expiry date (MM/YY) in the future";
    }

    if (!validateCVV(newPaymentMethod.cvv)) {
      errors.cvv = "Please enter a valid CVV (3-4 digits)";
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const validatePaymentForm = () => {
    const errors = {};

    if (!validateAmount(parseFloat(paymentAmount))) {
      errors.amount = "Please enter a valid amount greater than 0";
    }

    if (!selectedPaymentMethod) {
      errors.payment_method = "Please select a payment method";
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };
  const getPaymentMethods = async () => {
    try {
      const token = await getValidToken();
      const response = await fetch(`${BASE_URL}/payment/methods/`, {
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
        `${BASE_URL}/payment/methods/${id}/set-default/`,
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
      const response = await fetch(`${BASE_URL}/payment/methods/${id}/`, {
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

    if (!validatePaymentMethodForm()) {
      setError("Please correct the errors in the form");
      return;
    }

    try {
      const token = await getValidToken();
      const response = await fetch(`${BASE_URL}/payment/methods/add/`, {
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
      setFieldErrors({});
      setSuccess("Payment method added successfully");
      setTimeout(() => setSuccess(null), 3000);
    } catch (error) {
      setError(error.message || "Failed to add payment method");
      console.error("Error adding payment method:", error);
    }
  };

  const processPayment = async (e) => {
    e.preventDefault();

    if (!validatePaymentForm()) {
      setError("Please correct the errors in the form");
      return;
    }

    try {
      const token = await getValidToken();
      const response = await fetch(`${BASE_URL}/payment/process/`, {
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
        {/* Error and Success Messages */}
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

          <form onSubmit={addPaymentMethod}>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "1.5rem",
                marginBottom: "1.5rem",
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
                  onChange={(e) => {
                    setNewPaymentMethod({
                      ...newPaymentMethod,
                      card_holder_name: e.target.value,
                    });
                    setFieldErrors({
                      ...fieldErrors,
                      card_holder_name: "",
                    });
                  }}
                  style={{
                    width: "100%",
                    padding: "0.75rem",
                    borderRadius: "0.375rem",
                    border: `2px solid ${
                      fieldErrors.card_holder_name ? "#ef4444" : "#d1d5db"
                    }`,
                    backgroundColor: "white",
                    color: "#111827",
                    fontSize: "1rem",
                    boxSizing: "border-box",
                  }}
                  required
                />
                {fieldErrors.card_holder_name && (
                  <div
                    style={{
                      color: "#ef4444",
                      fontSize: "0.875rem",
                      marginTop: "0.375rem",
                    }}
                  >
                    {fieldErrors.card_holder_name}
                  </div>
                )}
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
                  <option value="CREDIT" style={{ color: "#111827" }}>
                    Credit Card
                  </option>
                  <option value="DEBIT" style={{ color: "#111827" }}>
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
                  onChange={(e) => {
                    setNewPaymentMethod({
                      ...newPaymentMethod,
                      card_number: e.target.value,
                    });
                    setFieldErrors({
                      ...fieldErrors,
                      card_number: "",
                    });
                  }}
                  style={{
                    width: "100%",
                    padding: "0.75rem",
                    borderRadius: "0.375rem",
                    border: `2px solid ${
                      fieldErrors.card_number ? "#ef4444" : "#d1d5db"
                    }`,
                    backgroundColor: "white",
                    color: "#111827",
                    fontSize: "1rem",
                    boxSizing: "border-box",
                  }}
                  maxLength="16"
                  required
                />
                {fieldErrors.card_number && (
                  <div
                    style={{
                      color: "#ef4444",
                      fontSize: "0.875rem",
                      marginTop: "0.375rem",
                    }}
                  >
                    {fieldErrors.card_number}
                  </div>
                )}
              </div>

              {/* Expiry Date */}
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
                  onChange={(e) => {
                    setNewPaymentMethod({
                      ...newPaymentMethod,
                      expiry_date: e.target.value,
                    });
                    setFieldErrors({
                      ...fieldErrors,
                      expiry_date: "",
                    });
                  }}
                  style={{
                    width: "100%",
                    padding: "0.75rem",
                    borderRadius: "0.375rem",
                    border: `2px solid ${
                      fieldErrors.expiry_date ? "#ef4444" : "#d1d5db"
                    }`,
                    backgroundColor: "white",
                    color: "#111827",
                    fontSize: "1rem",
                    boxSizing: "border-box",
                  }}
                  maxLength="5"
                  required
                />
                {fieldErrors.expiry_date && (
                  <div
                    style={{
                      color: "#ef4444",
                      fontSize: "0.875rem",
                      marginTop: "0.375rem",
                    }}
                  >
                    {fieldErrors.expiry_date}
                  </div>
                )}
              </div>

              {/* CVV */}
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
                  onChange={(e) => {
                    setNewPaymentMethod({
                      ...newPaymentMethod,
                      cvv: e.target.value,
                    });
                    setFieldErrors({
                      ...fieldErrors,
                      cvv: "",
                    });
                  }}
                  style={{
                    width: "100%",
                    padding: "0.75rem",
                    borderRadius: "0.375rem",
                    border: `2px solid ${
                      fieldErrors.cvv ? "#ef4444" : "#d1d5db"
                    }`,
                    backgroundColor: "white",
                    color: "#111827",
                    fontSize: "1rem",
                    boxSizing: "border-box",
                  }}
                  maxLength="4"
                  required
                />
                {fieldErrors.cvv && (
                  <div
                    style={{
                      color: "#ef4444",
                      fontSize: "0.875rem",
                      marginTop: "0.375rem",
                    }}
                  >
                    {fieldErrors.cvv}
                  </div>
                )}
              </div>
            </div>

            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
              }}
            >
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

        {/* Make Payment Form */}
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

          <form onSubmit={processPayment}>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "1.5rem",
                marginBottom: "1.5rem",
              }}
            >
              {/* Amount */}
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
                  onChange={(e) => {
                    setPaymentAmount(e.target.value);
                    setFieldErrors({
                      ...fieldErrors,
                      amount: "",
                    });
                  }}
                  style={{
                    width: "100%",
                    padding: "0.75rem",
                    borderRadius: "0.375rem",
                    border: `2px solid ${
                      fieldErrors.amount ? "#ef4444" : "#d1d5db"
                    }`,
                    backgroundColor: "white",
                    color: "#111827",
                    fontSize: "1rem",
                    boxSizing: "border-box",
                  }}
                  required
                />
                {fieldErrors.amount && (
                  <div
                    style={{
                      color: "#ef4444",
                      fontSize: "0.875rem",
                      marginTop: "0.375rem",
                    }}
                  >
                    {fieldErrors.amount}
                  </div>
                )}
              </div>
              
              {/* Select Payment Method */}
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
                  onChange={(e) => {
                    setSelectedPaymentMethod(e.target.value);
                    setFieldErrors({
                      ...fieldErrors,
                      payment_method: "",
                    });
                  }}
                  style={{
                    width: "100%",
                    padding: "0.75rem",
                    borderRadius: "0.375rem",
                    border: `2px solid ${
                      fieldErrors.payment_method ? "#ef4444" : "#d1d5db"
                    }`,
                    backgroundColor: "white",
                    color: "#111827",
                    fontSize: "1rem",
                    boxSizing: "border-box",
                    cursor: "pointer",
                  }}
                  required
                >
                  <option value="">Select a payment method</option>
                  {paymentMethods.map((method) => (
                    <option
                      key={method.id}
                      value={method.id}
                      style={{ color: "#111827" }}
                    >
                      {method.card_type} - {method.card_number_masked}
                    </option>
                  ))}
                </select>
                {fieldErrors.payment_method && (
                  <div
                    style={{
                      color: "#ef4444",
                      fontSize: "0.875rem",
                      marginTop: "0.375rem",
                    }}
                  >
                    {fieldErrors.payment_method}
                  </div>
                )}
              </div>
            </div>

            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
              }}
            >
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
        {/* Saved Payment Methods */}
        {paymentMethods.map((method) => (
          <div
            key={method.id}
            style={{
              padding: "1.5rem",
              borderRadius: "0.5rem",
              border: `2px solid ${method.is_default ? "#2563eb" : "#e5e7eb"}`,
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
                  {method.card_type} - {method.card_number_masked}
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
                  <span style={{ color: "#4b5563", fontWeight: "500" }}>
                    {method.name}
                  </span>{" "}
                  | Expires: {method.expiry_date}
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
                      transition: "all 0.2s",
                      hover: {
                        backgroundColor: "#bfdbfe",
                      },
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
                    transition: "all 0.2s",
                    hover: {
                      backgroundColor: "#fee2e2",
                    },
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
  );
};

export default PaymentComponent;
