import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

const PaymentConfirmationPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const paymentData = location.state;

  if (!paymentData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <div className="bg-white shadow rounded-lg p-6 w-full max-w-md">
          <div className="text-center space-y-4">
            <div className="text-red-500 text-6xl mb-4">×</div>
            <h2 className="text-2xl font-bold">Invalid Access</h2>
            <p className="text-gray-600">
              No payment information found. Please try making a payment again.
            </p>
            <button
              onClick={() => navigate("/payment")}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Return to Payment
            </button>
          </div>
        </div>
      </div>
    );
  }

  const getStatusStyle = () => {
    switch (paymentData.status) {
      case "COMPLETED":
        return {
          icon: "✓",
          color: "text-green-500",
          bgColor: "bg-green-100",
          borderColor: "border-green-500",
        };
      case "PENDING":
        return {
          icon: "⏳",
          color: "text-yellow-500",
          bgColor: "bg-yellow-100",
          borderColor: "border-yellow-500",
        };
      case "FAILED":
        return {
          icon: "×",
          color: "text-red-500",
          bgColor: "bg-red-100",
          borderColor: "border-red-500",
        };
      default:
        return {
          icon: "ℹ",
          color: "text-blue-500",
          bgColor: "bg-blue-100",
          borderColor: "border-blue-500",
        };
    }
  };

  const formatAmount = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const statusStyle = getStatusStyle();

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-2xl mx-auto px-4">
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="text-center p-6 border-b">
            <div className={`text-6xl mb-4 ${statusStyle.color}`}>
              {statusStyle.icon}
            </div>
            <h1 className="text-3xl font-bold">
              Payment{" "}
              {paymentData.status.charAt(0) +
                paymentData.status.slice(1).toLowerCase()}
            </h1>
          </div>

          <div className="p-6">
            <div className={`${statusStyle.bgColor} p-6 rounded-lg mb-6`}>
              <div className="text-center">
                <div className="text-sm text-gray-600">Amount Paid</div>
                <div className="text-3xl font-bold mt-1">
                  {formatAmount(paymentData.amount)}
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between py-2 border-b">
                <span className="text-gray-600">Status</span>
                <span className={`font-medium ${statusStyle.color}`}>
                  {paymentData.status}
                </span>
              </div>
              {paymentData.transactionId && (
                <div className="flex justify-between py-2 border-b">
                  <span className="text-gray-600">Transaction ID</span>
                  <span className="font-medium">
                    {paymentData.transactionId}
                  </span>
                </div>
              )}
              <div className="flex justify-between py-2 border-b">
                <span className="text-gray-600">Payment ID</span>
                <span className="font-medium">{paymentData.paymentId}</span>
              </div>
              <div className="flex justify-between py-2 border-b">
                <span className="text-gray-600">Date</span>
                <span className="font-medium">{formatDate(new Date())}</span>
              </div>
            </div>

            <div className="mt-8 space-y-3">
              <button
                onClick={() => navigate("/payment")}
                className="w-full px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Return to Payment
              </button>
              <button
                onClick={() => window.print()}
                className="w-full px-4 py-2 border border-gray-300 rounded hover:bg-gray-50"
              >
                Print Receipt
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentConfirmationPage;
