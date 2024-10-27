import React, { useState, useEffect } from "react";
import { getValidToken } from "../../utils/auth";

const BASE_URL = "http://localhost:8000";

const AddressComponent = () => {
  const [addresses, setAddresses] = useState([]);
  const [newAddress, setNewAddress] = useState({
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
  const [editingAddressId, setEditingAddressId] = useState(null);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    fetchAddresses();
  }, []);

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
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
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
          maxWidth: "64rem",
          margin: "0 auto",
        }}
      >
        {/* 알림 메시지 */}
        {error && (
          <div
            style={{
              backgroundColor: "#fee2e2",
              borderColor: "#f87171",
              color: "#b91c1c",
              padding: "1rem",
              borderRadius: "0.375rem",
              marginBottom: "1rem",
            }}
          >
            {error}
          </div>
        )}

        {success && (
          <div
            style={{
              backgroundColor: "#dcfce7",
              borderColor: "#4ade80",
              color: "#15803d",
              padding: "1rem",
              borderRadius: "0.375rem",
              marginBottom: "1rem",
            }}
          >
            {success}
          </div>
        )}

        {/* 주소 추가/수정 폼 */}
        <div
          style={{
            backgroundColor: "white",
            boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1)",
            borderRadius: "0.5rem",
            padding: "1.5rem",
            marginBottom: "2rem",
          }}
        >
          <h2
            style={{
              fontSize: "1.5rem",
              fontWeight: "600",
              marginBottom: "1.5rem",
              paddingBottom: "0.5rem",
              borderBottom: "1px solid #e5e7eb",
            }}
          >
            {editingAddressId ? "Edit Address" : "Add New Address"}
          </h2>

          <form onSubmit={handleSubmit}>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(2, 1fr)",
                gap: "1rem",
                marginBottom: "1.5rem",
              }}
            >
              {/* Recipient Name */}
              <div style={{ gridColumn: "1 / 2" }}>
                <label
                  style={{
                    display: "block",
                    fontSize: "0.875rem",
                    fontWeight: "500",
                    color: "#374151",
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
                    border: "1px solid #d1d5db",
                    outline: "none",
                  }}
                  required
                />
              </div>

              {/* Phone Number */}
              <div style={{ gridColumn: "2 / 3" }}>
                <label
                  style={{
                    display: "block",
                    fontSize: "0.875rem",
                    fontWeight: "500",
                    color: "#374151",
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
                    border: "1px solid #d1d5db",
                    outline: "none",
                  }}
                  required
                />
              </div>

              {/* Street Address */}
              <div style={{ gridColumn: "1 / 3" }}>
                <label
                  style={{
                    display: "block",
                    fontSize: "0.875rem",
                    fontWeight: "500",
                    color: "#374151",
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
                    border: "1px solid #d1d5db",
                    outline: "none",
                  }}
                  required
                />
              </div>

              {/* Detail Address */}
              <div style={{ gridColumn: "1 / 3" }}>
                <label
                  style={{
                    display: "block",
                    fontSize: "0.875rem",
                    fontWeight: "500",
                    color: "#374151",
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
                    border: "1px solid #d1d5db",
                    outline: "none",
                  }}
                  required
                />
              </div>

              {/* City and State */}
              <div style={{ gridColumn: "1 / 2" }}>
                <label
                  style={{
                    display: "block",
                    fontSize: "0.875rem",
                    fontWeight: "500",
                    color: "#374151",
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
                    border: "1px solid #d1d5db",
                    outline: "none",
                  }}
                  required
                />
              </div>

              <div style={{ gridColumn: "2 / 3" }}>
                <label
                  style={{
                    display: "block",
                    fontSize: "0.875rem",
                    fontWeight: "500",
                    color: "#374151",
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
                    border: "1px solid #d1d5db",
                    outline: "none",
                  }}
                  required
                />
              </div>

              {/* Postal Code and Address Type */}
              <div style={{ gridColumn: "1 / 2" }}>
                <label
                  style={{
                    display: "block",
                    fontSize: "0.875rem",
                    fontWeight: "500",
                    color: "#374151",
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
                    border: "1px solid #d1d5db",
                    outline: "none",
                  }}
                  required
                />
              </div>

              <div style={{ gridColumn: "2 / 3" }}>
                <label
                  style={{
                    display: "block",
                    fontSize: "0.875rem",
                    fontWeight: "500",
                    color: "#374151",
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
                    border: "1px solid #d1d5db",
                    outline: "none",
                  }}
                >
                  <option value="HOME">Home</option>
                  <option value="OFFICE">Office</option>
                  <option value="OTHER">Other</option>
                </select>
              </div>

              {/* Delivery Instructions */}
              <div style={{ gridColumn: "1 / 3" }}>
                <label
                  style={{
                    display: "block",
                    fontSize: "0.875rem",
                    fontWeight: "500",
                    color: "#374151",
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
                    border: "1px solid #d1d5db",
                    outline: "none",
                    minHeight: "100px",
                  }}
                />
              </div>
            </div>

            {/* Form Buttons */}
            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                gap: "1rem",
              }}
            >
              {editingAddressId && (
                <button
                  type="button"
                  onClick={resetForm}
                  style={{
                    padding: "0.75rem 1.5rem",
                    borderRadius: "0.375rem",
                    backgroundColor: "#f3f4f6",
                    color: "#374151",
                    border: "1px solid #d1d5db",
                  }}
                >
                  Cancel
                </button>
              )}
              <button
                type="submit"
                style={{
                  padding: "0.75rem 1.5rem",
                  borderRadius: "0.375rem",
                  backgroundColor: "#3b82f6",
                  color: "white",
                  border: "none",
                  cursor: "pointer",
                }}
              >
                {editingAddressId ? "Update" : "Save"} Address
              </button>
            </div>
          </form>
        </div>

        {/* Address List */}
        <div
          style={{
            backgroundColor: "white",
            boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1)",
            borderRadius: "0.5rem",
            padding: "1.5rem",
          }}
        >
          <h2
            style={{
              fontSize: "1.5rem",
              fontWeight: "600",
              marginBottom: "1.5rem",
              paddingBottom: "0.5rem",
              borderBottom: "1px solid #e5e7eb",
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
                    address.is_default ? "#3b82f6" : "#e5e7eb"
                  }`,
                  backgroundColor: address.is_default ? "#f0f9ff" : "white",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                  }}
                >
                  <div>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "0.5rem",
                        marginBottom: "0.5rem",
                      }}
                    >
                      <span
                        style={{
                          fontSize: "1.125rem",
                          fontWeight: "600",
                        }}
                      >
                        {address.name}
                      </span>
                      {address.is_default && (
                        <span
                          style={{
                            backgroundColor: "#dbeafe",
                            color: "#1e40af",
                            padding: "0.25rem 0.5rem",
                            borderRadius: "0.25rem",
                            fontSize: "0.75rem",
                            fontWeight: "500",
                          }}
                        >
                          Default
                        </span>
                      )}
                    </div>
                    <p style={{ color: "#4b5563", marginBottom: "0.25rem" }}>
                      {address.street_address}
                    </p>
                    {address.detail_address && (
                      <p style={{ color: "#4b5563", marginBottom: "0.25rem" }}>
                        {address.detail_address}
                      </p>
                    )}
                    <p style={{ color: "#4b5563", marginBottom: "0.25rem" }}>
                      {address.city}, {address.state} {address.postal_code}
                    </p>
                    <p style={{ color: "#4b5563", marginBottom: "0.25rem" }}>
                      {address.phone_number}
                    </p>
                    {address.delivery_instructions && (
                      <p
                        style={{
                          color: "#6b7280",
                          marginTop: "0.5rem",
                          backgroundColor: "#f9fafb",
                          padding: "0.5rem",
                          borderRadius: "0.375rem",
                        }}
                      >
                        Note: {address.delivery_instructions}
                      </p>
                    )}
                  </div>

                  <div
                    style={{
                      display: "flex",
                      gap: "0.5rem",
                    }}
                  >
                    {!address.is_default && (
                      <button
                        onClick={() => handleSetDefault(address.id)}
                        style={{
                          padding: "0.5rem 1rem",
                          color: "#3b82f6",
                          borderRadius: "0.375rem",
                          border: "none",
                          backgroundColor: "#f0f9ff",
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
                        color: "#4b5563",
                        borderRadius: "0.375rem",
                        border: "none",
                        backgroundColor: "#f3f4f6",
                        cursor: "pointer",
                      }}
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(address.id)}
                      style={{
                        padding: "0.5rem 1rem",
                        color: "#dc2626",
                        borderRadius: "0.375rem",
                        border: "none",
                        backgroundColor: "#fef2f2",
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
                  padding: "3rem 0",
                  color: "#6b7280",
                }}
              >
                <p>No addresses added yet.</p>
                <p>Add your first address above.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddressComponent;
