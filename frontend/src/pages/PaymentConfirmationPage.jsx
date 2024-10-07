import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const PaymentConfirmationPage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { amount, paymentMethod } = location.state || {};

    if (!amount || !paymentMethod) {
        return (
            <div>
                <p>No payment information available.</p>
                <button onClick={() => navigate('/payment')}>Back to Payments</button>
            </div>
        );
    }

    const lastFourDigits = paymentMethod.cardNumber 
        ? paymentMethod.cardNumber.slice(-4) 
        : 'XXXX';

    return (
        <div className="payment-confirmation">
            <h1>Payment Confirmation</h1>
            <div className="confirmation-details">
                <p>Your payment of ${amount} has been successfully processed.</p>
                <p>Payment Method: {paymentMethod.name} (ending in {lastFourDigits})</p>
                <p>Transaction Date: {new Date().toLocaleString()}</p>
                <p>Thank you for your purchase!</p>
            </div>
            <button onClick={() => navigate('/payment')}>Back to Payments</button>
        </div>
    );
};

export default PaymentConfirmationPage;