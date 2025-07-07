// client/src/TablePage.js
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

function TablePage() {
  const { tableId } = useParams();
  const [menu, setMenu] = useState([]);
  const [cart, setCart] = useState([]);
  const [message, setMessage] = useState('');

  // Fetch menu
  useEffect(() => {
    axios.get('http://localhost:5000/api/menu')
      .then(res => setMenu(res.data))
      .catch(err => console.error('Failed to load menu', err));
  }, []);

  const addToCart = (item) => {
    const exists = cart.find(i => i.menuItemId === item.id);
    if (exists) {
      setCart(cart.map(i =>
        i.menuItemId === item.id
          ? { ...i, quantity: i.quantity + 1 }
          : i
      ));
    } else {
      setCart([...cart, { menuItemId: item.id, name: item.name, quantity: 1 }]);
    }
  };

  const placeOrder = async () => {
    if (cart.length === 0) return alert('Cart is empty.');

    try {
      await axios.post('http://localhost:5000/api/order', {
        table: parseInt(tableId),
        items: cart
      });
      setCart([]);
      setMessage(`✅ Order placed for Table ${tableId}`);
    } catch (error) {
      console.error(error);
      alert("❌ Failed to place order.");
    }
  };

  return (
    <div style={{ padding: 20, fontFamily: 'Arial' }}>
      <h2>🪑 Table {tableId}</h2>

      <h3>🍽️ Menu</h3>
      <ul>
        {menu.map(item => (
          <li key={item.id}>
            {item.name} - ${item.price.toFixed(2)}
            <button onClick={() => addToCart(item)} style={{ marginLeft: 10 }}>
              Add
            </button>
          </li>
        ))}
      </ul>

      <h3>🛒 Cart</h3>
      {cart.length === 0 ? (
        <p>No items yet.</p>
      ) : (
        <ul>
          {cart.map((item, i) => (
            <li key={i}>
              {item.name} × {item.quantity}
            </li>
          ))}
        </ul>
      )}

      {cart.length > 0 && (
        <button onClick={placeOrder} style={{ marginTop: 10 }}>
          ✅ Place Order
        </button>
      )}

      {message && <p style={{ color: 'green', marginTop: 20 }}>{message}</p>}
    </div>
  );
}

export default TablePage;
