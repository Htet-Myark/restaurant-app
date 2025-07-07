// client/src/TablePage.js
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

function TablePage() {
  const { tableId } = useParams();
  const [menu, setMenu] = useState([]);
  const [cart, setCart] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:5000/api/menu')
      .then(res => setMenu(res.data));
  }, []);

  const addToCart = (item) => {
    const existing = cart.find(i => i.menuItemId === item.id);
    if (existing) {
      setCart(cart.map(i =>
        i.menuItemId === item.id ? { ...i, quantity: i.quantity + 1 } : i
      ));
    } else {
      setCart([...cart, { menuItemId: item.id, quantity: 1, name: item.name }]);
    }
  };

  const placeOrder = () => {
    if (cart.length === 0) return alert("Cart is empty!");
    axios.post('http://localhost:5000/api/order', {
      table: parseInt(tableId),
      items: cart
    }).then(() => {
      alert("✅ Order placed for Table " + tableId);
      setCart([]);
    });
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>🪑 Ordering for Table {tableId}</h2>
      <h3>Menu</h3>
      <ul>
        {menu.map(item => (
          <li key={item.id}>
            {item.name} - ${item.price.toFixed(2)}
            <button onClick={() => addToCart(item)} style={{ marginLeft: 10 }}>Add</button>
          </li>
        ))}
      </ul>

      <h3>🛒 Cart</h3>
      <ul>
        {cart.map((item, i) => (
          <li key={i}>{item.name} x {item.quantity}</li>
        ))}
      </ul>

      {cart.length > 0 && <button onClick={placeOrder}>Place Order</button>}
    </div>
  );
}

export default TablePage;
