import React from 'react';
import OrderCustomisation from '../components/OrderCustomisation/OrderCustomisation';

const OrderPage = () => {
    return (
        <div style={{backgroundColor: "#242424", padding: "50px", borderRadius: "20px"}}>
            <h1>Cart</h1>
            <OrderCustomisation />
        </div>
    );
};

export default OrderPage;