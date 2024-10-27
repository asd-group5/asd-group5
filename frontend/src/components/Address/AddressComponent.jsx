import React, { useState, useEffect } from "react";
import { getValidToken } from "../../utils/auth";

const BASE_URL = "http://localhost:8000/";

const AddressComponent = () => {
  // Validation helper functions
  const validatePhoneNumber = (phone) => {
    const phoneRegex = /^[0-9]{10,11}$/;
    return phoneRegex.test(phone.replace(/-/g, ""));
  };

  const validatePostalCode = (code) => {
    const postalRegex = /^[0-9]{4}$/;
    return postalRegex.test(code);
  };

  const validateNotEmpty = (value) => {
    return value.trim().length > 0;
  };

  // States
  const [addresses, setAddresses] = useState([]);
  const [newAddress, setNewAddress] = useState({
    name: "",
    phone_number: "",
    street_address: "",
    detail_address: "",
    city: "",
    state: "",
    postal_code: "",
    country: "Ausatalia",
    address_type: "HOME",
    delivery_instructions: "",
    is_default: false,
  });
  const [editingAddressId, setEditingAddressId] = useState(null);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [fieldErrors, setFieldErrors] = useState({
    name: "",
    phone_number: "",
    street_address: "",
    detail_address: "",
    city: "",
    state: "",
    postal_code: "",
  });

  useEffect(() => {
    fetchAddresses();
  }, []);

  const validateForm = () => {
    const errors = {};

    // Name validation
    if (!validateNotEmpty(newAddress.name)) {
      errors.name = "Recipient name is required";
    }

    // Phone number validation
    if (!validatePhoneNumber(newAddress.phone_number)) {
      errors.phone_number = "Please enter a valid phone number (10-11 digits)";
    }

    // Street address validation
    if (!validateNotEmpty(newAddress.street_address)) {
      errors.street_address = "Street address is required";
    }

    // Detail address validation
    if (!validateNotEmpty(newAddress.detail_address)) {
      errors.detail_address = "Detail address is required";
    }

    // City validation
    if (!validateNotEmpty(newAddress.city)) {
      errors.city = "City is required";
    }

    // State validation
    if (!validateNotEmpty(newAddress.state)) {
      errors.state = "State is required";
    }

    // Postal code validation
    if (!validatePostalCode(newAddress.postal_code)) {
      errors.postal_code = "Please enter a valid 4-digit postal code";
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const fetchAddresses = async () => {
    try {
      const token = await getValidToken();
      const response = await fetch(`${BASE_URL}/api/address/`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) throw new Error("Failed to fetch addresses");
      const data = await response.json();
      setAddresses(data);
    } catch (error) {
      setError("Failed to load addresses. Please try again.");
      console.error("Error fetching addresses:", error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setNewAddress((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    // Clear error for the field being edited
    if (fieldErrors[name]) {
      setFieldErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate form before submission
    if (!validateForm()) {
      setError("Please correct the errors in the form.");
      return;
    }

    try {
      const token = await getValidToken();
      const url = editingAddressId
        ? `${BASE_URL}/api/address/${editingAddressId}/`
        : `${BASE_URL}/api/address/`;
      const method = editingAddressId ? "PUT" : "POST";

      const response = await fetch(url, {
        method: method,
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newAddress),
      });
      if (!response.ok) throw new Error("Failed to save address");
      await fetchAddresses();
      resetForm();
      setSuccess(
        editingAddressId
          ? "Address updated successfully!"
          : "Address added successfully!"
      );
      setTimeout(() => setSuccess(null), 3000);
    } catch (error) {
      setError("Failed to save address. Please try again.");
      console.error("Error saving address:", error);
    }
  };

  const resetForm = () => {
    setNewAddress({
      name: "",
      phone_number: "",
      street_address: "",
      detail_address: "",
      city: "",
      state: "",
      postal_code: "",
      country: "South Korea",
      address_type: "HOME",
      delivery_instructions: "",
      is_default: false,
    });
    setEditingAddressId(null);
    setFieldErrors({});
  };

  const handleSetDefault = async (id) => {
    try {
      const token = await getValidToken();
      const response = await fetch(
        `${BASE_URL}/api/address/set-default/${id}/`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      if (!response.ok) throw new Error("Failed to set default address");
      await fetchAddresses();
      setSuccess("Default address updated successfully!");
      setTimeout(() => setSuccess(null), 3000);
    } catch (error) {
      setError("Failed to set default address. Please try again.");
      console.error("Error setting default address:", error);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this address?"))
      return;

    try {
      const token = await getValidToken();
      const response = await fetch(`${BASE_URL}/api/address/${id}/`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) throw new Error("Failed to delete address");
      await fetchAddresses();
      setSuccess("Address deleted successfully!");
      setTimeout(() => setSuccess(null), 3000);
    } catch (error) {
      setError("Failed to delete address. Please try again.");
      console.error("Error deleting address:", error);
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
            {editingAddressId ? "Edit Address" : "Add New Address"}
          </h2>

          <form onSubmit={handleSubmit}>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "1.5rem",
                marginBottom: "1.5rem",
              }}
            >
              {/* Recipient Name */}
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
                  Recipient Name:
                </label>
                <input
                  type="text"
                  name="name"
                  value={newAddress.name}
                  onChange={handleInputChange}
                  style={{
                    width: "100%",
                    padding: "0.75rem",
                    borderRadius: "0.375rem",
                    border: `2px solid ${
                      fieldErrors.name ? "#ef4444" : "#d1d5db"
                    }`,
                    backgroundColor: "white",
                    color: "#111827",
                    fontSize: "1rem",
                    boxSizing: "border-box",
                  }}
                  required
                />
                {fieldErrors.name && (
                  <div
                    style={{
                      color: "#ef4444",
                      fontSize: "0.875rem",
                      marginTop: "0.375rem",
                    }}
                  >
                    {fieldErrors.name}
                  </div>
                )}
              </div>

              {/* Phone Number */}
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
                  Phone Number:
                </label>
                <input
                  type="tel"
                  name="phone_number"
                  value={newAddress.phone_number}
                  onChange={handleInputChange}
                  style={{
                    width: "100%",
                    padding: "0.75rem",
                    borderRadius: "0.375rem",
                    border: `2px solid ${
                      fieldErrors.phone_number ? "#ef4444" : "#d1d5db"
                    }`,
                    backgroundColor: "white",
                    color: "#111827",
                    fontSize: "1rem",
                    boxSizing: "border-box",
                  }}
                  required
                />
                {fieldErrors.phone_number && (
                  <div
                    style={{
                      color: "#ef4444",
                      fontSize: "0.875rem",
                      marginTop: "0.375rem",
                    }}
                  >
                    {fieldErrors.phone_number}
                  </div>
                )}
              </div>

              {/* Street Address */}
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
                  Street Address:
                </label>
                <input
                  type="text"
                  name="street_address"
                  value={newAddress.street_address}
                  onChange={handleInputChange}
                  style={{
                    width: "100%",
                    padding: "0.75rem",
                    borderRadius: "0.375rem",
                    border: `2px solid ${
                      fieldErrors.street_address ? "#ef4444" : "#d1d5db"
                    }`,
                    backgroundColor: "white",
                    color: "#111827",
                    fontSize: "1rem",
                    boxSizing: "border-box",
                  }}
                  required
                />
                {fieldErrors.street_address && (
                  <div
                    style={{
                      color: "#ef4444",
                      fontSize: "0.875rem",
                      marginTop: "0.375rem",
                    }}
                  >
                    {fieldErrors.street_address}
                  </div>
                )}
              </div>

              {/* Detail Address */}
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
                  Detail Address:
                </label>
                <input
                  type="text"
                  name="detail_address"
                  value={newAddress.detail_address}
                  onChange={handleInputChange}
                  style={{
                    width: "100%",
                    padding: "0.75rem",
                    borderRadius: "0.375rem",
                    border: `2px solid ${
                      fieldErrors.detail_address ? "#ef4444" : "#d1d5db"
                    }`,
                    backgroundColor: "white",
                    color: "#111827",
                    fontSize: "1rem",
                    boxSizing: "border-box",
                  }}
                  required
                />
                {fieldErrors.detail_address && (
                  <div
                    style={{
                      color: "#ef4444",
                      fontSize: "0.875rem",
                      marginTop: "0.375rem",
                    }}
                  >
                    {fieldErrors.detail_address}
                  </div>
                )}
              </div>

              {/* City */}
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
                  City:
                </label>
                <input
                  type="text"
                  name="city"
                  value={newAddress.city}
                  onChange={handleInputChange}
                  style={{
                    width: "100%",
                    padding: "0.75rem",
                    borderRadius: "0.375rem",
                    border: `2px solid ${
                      fieldErrors.city ? "#ef4444" : "#d1d5db"
                    }`,
                    backgroundColor: "white",
                    color: "#111827",
                    fontSize: "1rem",
                    boxSizing: "border-box",
                  }}
                  required
                />
                {fieldErrors.city && (
                  <div
                    style={{
                      color: "#ef4444",
                      fontSize: "0.875rem",
                      marginTop: "0.375rem",
                    }}
                  >
                    {fieldErrors.city}
                  </div>
                )}
              </div>

              {/* State/Province */}
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
                  State/Province:
                </label>
                <input
                  type="text"
                  name="state"
                  value={newAddress.state}
                  onChange={handleInputChange}
                  style={{
                    width: "100%",
                    padding: "0.75rem",
                    borderRadius: "0.375rem",
                    border: `2px solid ${
                      fieldErrors.state ? "#ef4444" : "#d1d5db"
                    }`,
                    backgroundColor: "white",
                    color: "#111827",
                    fontSize: "1rem",
                    boxSizing: "border-box",
                  }}
                  required
                />
                {fieldErrors.state && (
                  <div
                    style={{
                      color: "#ef4444",
                      fontSize: "0.875rem",
                      marginTop: "0.375rem",
                    }}
                  >
                    {fieldErrors.state}
                  </div>
                )}
              </div>

              {/* Postal Code */}
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
                  Postal Code:
                </label>
                <input
                  type="text"
                  name="postal_code"
                  value={newAddress.postal_code}
                  onChange={handleInputChange}
                  style={{
                    width: "100%",
                    padding: "0.75rem",
                    borderRadius: "0.375rem",
                    border: `2px solid ${
                      fieldErrors.postal_code ? "#ef4444" : "#d1d5db"
                    }`,
                    backgroundColor: "white",
                    color: "#111827",
                    fontSize: "1rem",
                    boxSizing: "border-box",
                  }}
                  required
                />
                {fieldErrors.postal_code && (
                  <div
                    style={{
                      color: "#ef4444",
                      fontSize: "0.875rem",
                      marginTop: "0.375rem",
                    }}
                  >
                    {fieldErrors.postal_code}
                  </div>
                )}
              </div>

              {/* Address Type */}
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
                  Address Type:
                </label>
                <select
                  name="address_type"
                  value={newAddress.address_type}
                  onChange={handleInputChange}
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
                  <option value="HOME" style={{ color: "#111827" }}>
                    Home
                  </option>
                  <option value="OFFICE" style={{ color: "#111827" }}>
                    Office
                  </option>
                  <option value="OTHER" style={{ color: "#111827" }}>
                    Other
                  </option>
                </select>
              </div>

              {/* Delivery Instructions */}
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
                  Delivery Instructions:
                </label>
                <textarea
                  name="delivery_instructions"
                  value={newAddress.delivery_instructions}
                  onChange={handleInputChange}
                  style={{
                    width: "100%",
                    padding: "0.75rem",
                    borderRadius: "0.375rem",
                    border: "2px solid #d1d5db",
                    backgroundColor: "white",
                    color: "#111827",
                    fontSize: "1rem",
                    boxSizing: "border-box",
                    minHeight: "100px",
                    resize: "vertical",
                  }}
                />
              </div>
            </div>

            {/* Submit Button */}
            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                gap: "1rem",
                marginTop: "2rem",
              }}
            >
              {editingAddressId && (
                <button
                  type="button"
                  onClick={resetForm}
                  style={{
                    padding: "0.75rem 1.5rem",
                    backgroundColor: "#f3f4f6",
                    color: "#374151",
                    border: "2px solid #d1d5db",
                    borderRadius: "0.375rem",
                    fontSize: "1rem",
                    fontWeight: "500",
                    cursor: "pointer",
                  }}
                >
                  Cancel
                </button>
              )}
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
                {editingAddressId ? "Update" : "Save"} Address
              </button>
            </div>
          </form>
        </div>

        {/* Existing Addresses List */}
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
            Your Addresses
          </h2>

          <div
            style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
          >
            {addresses.map((address) => (
              <div
                key={address.id}
                style={{
                  padding: "1.5rem",
                  borderRadius: "0.5rem",
                  border: `2px solid ${
                    address.is_default ? "#2563eb" : "#e5e7eb"
                  }`,
                  backgroundColor: address.is_default ? "#f0f7ff" : "white",
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
                      {address.name}
                      {address.is_default && (
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
                    <p style={{ color: "#4b5563", margin: "0.25rem 0" }}>
                      {address.phone_number}
                    </p>
                    <p style={{ color: "#4b5563", margin: "0.25rem 0" }}>
                      {address.street_address}
                    </p>
                    {address.detail_address && (
                      <p style={{ color: "#4b5563", margin: "0.25rem 0" }}>
                        {address.detail_address}
                      </p>
                    )}
                    <p style={{ color: "#4b5563", margin: "0.25rem 0" }}>
                      {address.city}, {address.state} {address.postal_code}
                    </p>
                    {address.delivery_instructions && (
                      <p
                        style={{
                          color: "#6b7280",
                          margin: "0.75rem 0 0",
                          padding: "0.75rem",
                          backgroundColor: "#f9fafb",
                          borderRadius: "0.375rem",
                          fontSize: "0.875rem",
                        }}
                      >
                        Note: {address.delivery_instructions}
                      </p>
                    )}
                  </div>
                  <div
                    style={{
                      display: "flex",
                      gap: "0.75rem",
                    }}
                  >
                    {!address.is_default && (
                      <button
                        onClick={() => handleSetDefault(address.id)}
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
                      onClick={() => {
                        setNewAddress(address);
                        setEditingAddressId(address.id);
                        window.scrollTo({ top: 0, behavior: "smooth" });
                      }}
                      style={{
                        padding: "0.5rem 1rem",
                        backgroundColor: "#f3f4f6",
                        color: "#4b5563",
                        border: "none",
                        borderRadius: "0.375rem",
                        fontSize: "0.875rem",
                        fontWeight: "500",
                        cursor: "pointer",
                      }}
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(address.id)}
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
            {addresses.length === 0 && (
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
                  No addresses added yet.
                </p>
                <p style={{ fontSize: "0.875rem" }}>
                  Add your first address above.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddressComponent;
