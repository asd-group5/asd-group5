import React, { useState, useEffect } from 'react';
import 'frontend/src/OrderHistory.css'; // Link to CSS for styling

function OrderHistory() {
  const [orders, setOrders] = useState([]);

  // Fetch order history (can replace with actual API call)
  useEffect(() => {
    const mockOrders = [
      { id: 1, date: '2024-09-01', item: 'Pizza', price: '$12.99' },
      { id: 2, date: '2024-09-05', item: 'Pasta', price: '$9.99' },
      { id: 3, date: '2024-09-08', item: 'Salad', price: '$7.99' },
    ];
    setOrders(mockOrders);
  }, []);

  return (
    <div className="order-history">
      <h2>Your Order History</h2>
      <ul>
        {orders.map(order => (
          <li key={order.id}>
            <span>{order.date} - {order.item} - {order.price}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default OrderHistory;
