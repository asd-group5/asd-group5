import React from 'react';
import PaymentComponent from '../components/Payment/PaymentComponent';
import { PaymentProvider } from '../contexts/PaymentContext';

const PaymentPage = () => {
    return (
        <PaymentProvider>
            <div className="payment-page">
                <h1>Payment Management</h1>
                <PaymentComponent />
            </div>
        </PaymentProvider>
    );
};

export default PaymentPage;