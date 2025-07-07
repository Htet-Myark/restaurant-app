// client/src/AdminDashboard.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../style/AdminDashboard.css';

function AdminDashboard() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:5000/api/admin/orders')
      .then(res => setOrders(res.data))
      .catch(err => {
        console.error(err);
        alert("Failed to load admin orders");
      });
  }, []);

  return (
    <div className="admin-container">
      <h2>📊 Admin Dashboard</h2>
      {orders.length === 0 ? (
        <p>No orders yet.</p>
      ) : (
        <ul className="admin-order-list">
          {orders.map((order, i) => (
            <li key={i} className="admin-order">
              <div>
                🪑 Table {order.table} | 🕒 {new Date(order.createdAt).toLocaleString()}
              </div>
              <ul>
                {order.items.map((item, j) => (
                  <li key={j}>
                    {item.menuItem.name} × {item.quantity}
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default AdminDashboard;
