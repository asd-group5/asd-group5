import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getValidToken } from "../../utils/auth";

const PaymentComponent = () => {
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
        is_default: false
    });
    const [paymentAmount, setPaymentAmount] = useState("");
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
            const response = await fetch(`${BASE_URL}/api/payment/methods/${id}/set-default/`, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            });
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
                method: 'DELETE',
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
                is_default: false
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
                    transactionId: data.transaction_id
                },
            });
        } catch (error) {
            setError(error.message || "Payment processing failed. Please try again.");
            console.error("Error processing payment:", error);
        }
    };

    return (
        <div className="max-w-4xl mx-auto p-4">
            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                    {error}
                </div>
            )}
            
            {success && (
                <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
                    {success}
                </div>
            )}

            <div className="bg-white shadow rounded-lg p-6 mb-6">
                <h2 className="text-2xl font-bold mb-4">Add Payment Method</h2>
                <form onSubmit={addPaymentMethod} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">Card Holder Name:</label>
                            <input
                                type="text"
                                value={newPaymentMethod.card_holder_name}
                                onChange={(e) => setNewPaymentMethod({
                                    ...newPaymentMethod,
                                    card_holder_name: e.target.value
                                })}
                                className="w-full p-2 border rounded"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Card Type:</label>
                            <select
                                value={newPaymentMethod.card_type}
                                onChange={(e) => setNewPaymentMethod({
                                    ...newPaymentMethod,
                                    card_type: e.target.value
                                })}
                                className="w-full p-2 border rounded"
                            >
                                <option value="CREDIT">Credit Card</option>
                                <option value="DEBIT">Debit Card</option>
                            </select>
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium mb-1">Card Number:</label>
                            <input
                                type="text"
                                value={newPaymentMethod.card_number}
                                onChange={(e) => setNewPaymentMethod({
                                    ...newPaymentMethod,
                                    card_number: e.target.value
                                })}
                                className="w-full p-2 border rounded"
                                maxLength="16"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Expiry Date:</label>
                            <input
                                type="text"
                                placeholder="MM/YY"
                                value={newPaymentMethod.expiry_date}
                                onChange={(e) => setNewPaymentMethod({
                                    ...newPaymentMethod,
                                    expiry_date: e.target.value
                                })}
                                className="w-full p-2 border rounded"
                                maxLength="5"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">CVV:</label>
                            <input
                                type="text"
                                value={newPaymentMethod.cvv}
                                onChange={(e) => setNewPaymentMethod({
                                    ...newPaymentMethod,
                                    cvv: e.target.value
                                })}
                                className="w-full p-2 border rounded"
                                maxLength="4"
                                required
                            />
                        </div>
                    </div>
                    <button
                        type="submit"
                        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                    >
                        Add Payment Method
                    </button>
                </form>
            </div>

            <div className="bg-white shadow rounded-lg p-6 mb-6">
                <h2 className="text-2xl font-bold mb-4">Make Payment</h2>
                <form onSubmit={processPayment} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">Amount:</label>
                            <input
                                type="number"
                                min="0"
                                step="0.01"
                                value={paymentAmount}
                                onChange={(e) => setPaymentAmount(e.target.value)}
                                className="w-full p-2 border rounded"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Select Payment Method:</label>
                            <select
                                value={selectedPaymentMethod}
                                onChange={(e) => setSelectedPaymentMethod(e.target.value)}
                                className="w-full p-2 border rounded"
                                required
                            >
                                <option value="">Select a payment method</option>
                                {paymentMethods.map((method) => (
                                    <option key={method.id} value={method.id}>
                                        {method.card_type} - **** {method.card_number ? method.card_number.slice(-4) : 'XXXX'}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                    <button
                        type="submit"
                        className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                    >
                        Process Payment
                    </button>
                </form>
            </div>

            <div className="bg-white shadow rounded-lg p-6">
                <h2 className="text-2xl font-bold mb-4">Saved Payment Methods</h2>
                <div className="space-y-4">
                    {paymentMethods.map((method) => (
                        <div
                            key={method.id}
                            className={`p-4 border rounded ${
                                method.is_default ? 'border-blue-500' : 'border-gray-200'
                            }`}
                        >
                            <div className="flex items-center justify-between">
                                <div>
                                    <div className="font-medium">
                                        {method.card_type} - **** {method.card_number ? method.card_number.slice(-4) : 'XXXX'}
                                        {method.is_default && (
                                            <span className="ml-2 text-sm text-blue-500">(Default)</span>
                                        )}
                                    </div>
                                    <div className="text-sm text-gray-600">
                                        {method.card_holder_name || method.name} | Expires: {method.expiry_date}
                                    </div>
                                </div>
                                <div className="flex space-x-2">
                                    {!method.is_default && (
                                        <button
                                            onClick={() => handleSetDefault(method.id)}
                                            className="p-2 text-blue-500 hover:bg-blue-50 rounded"
                                        >
                                            Set Default
                                        </button>
                                    )}
                                    <button
                                        onClick={() => handleDelete(method.id)}
                                        className="p-2 text-red-500 hover:bg-red-50 rounded"
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                    {paymentMethods.length === 0 && (
                        <div className="text-center py-6 text-gray-500">
                            No payment methods added yet.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default PaymentComponent;