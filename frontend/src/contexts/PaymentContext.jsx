import React, { createContext, useState } from 'react';
import axios from 'axios';

export const PaymentContext = createContext();

export const PaymentProvider = ({ children }) => {
    const [paymentMethods, setPaymentMethods] = useState([]);

    const getPaymentMethods = async () => {
        try {
            const response = await axios.get('/api/payment/methods/');
            setPaymentMethods(response.data);
        } catch (error) {
            console.error('Error fetching payment methods:', error);
        }
    };

    const addPaymentMethod = async (newMethod) => {
        try {
            const response = await axios.post('/api/payment/methods/add/', newMethod);
            setPaymentMethods([...paymentMethods, response.data]);
        } catch (error) {
            console.error('Error adding payment method:', error);
        }
    };

    const processPayment = async (paymentData) => {
        try {
            const response = await axios.post('/api/payment/process/', paymentData);
            console.log('Payment processed:', response.data);
        } catch (error) {
            console.error('Error processing payment:', error);
        }
    };

    return (
        <PaymentContext.Provider value={{ paymentMethods, getPaymentMethods, addPaymentMethod, processPayment }}>
            {children}
        </PaymentContext.Provider>
    );
};