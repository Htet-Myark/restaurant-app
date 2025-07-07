import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import "../style/TablePage.css";


function TablePage() {
  const { tableId } = useParams();
  const [menu, setMenu] = useState([]);
  const [cart, setCart] = useState([]);
  const [message, setMessage] = useState("");
  const [orders, setOrders] = useState([]);
const [showOrders, setShowOrders] = useState(false);

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/menu")
      .then((res) => setMenu(res.data))
      .catch((err) => console.error("Failed to load menu", err));
  }, []);

  const addToCart = (item) => {
    const exists = cart.find((i) => i.menuItemId === item.id);
    if (exists) {
      setCart(
        cart.map((i) =>
          i.menuItemId === item.id ? { ...i, quantity: i.quantity + 1 } : i
        )
      );
    } else {
      setCart([...cart, { menuItemId: item.id, name: item.name, quantity: 1 }]);
    }
  };

  const placeOrder = async () => {
    if (cart.length === 0) return alert("Cart is empty.");

    try {
      await axios.post("http://localhost:5000/api/order", {
        table: parseInt(tableId),
        items: cart,
      });

      setCart([]);
      setMessage(`✅ Order placed for Table ${tableId}`);
      setTimeout(() => setMessage(""), 3000);
    } catch (error) {
      console.error(error);
      alert("❌ Failed to place order.");
    }
  };

  const viewOrders = async () => {
  try {
    const res = await axios.get(`http://localhost:5000/api/orders/${tableId}`);
    setOrders(res.data);
    setShowOrders(true);
  } catch (err) {
    alert("Failed to load orders");
    console.error(err);
  }
};

  return (
    <div className="table-container">
      <h2 className="table-title">🪑 Table {tableId}</h2>

      {message && <p className="success-message">{message}</p>}

      <div className="table-layout">
        <div className="menu-section">
          <h3>🍽️ Menu</h3>
          <ul className="menu-list">
            {menu.map((item) => (
              <li key={item.id} className="menu-item">
                <span>{item.name} - ${item.price.toFixed(2)}</span>
                <button onClick={() => addToCart(item)} className="add-btn">
                  Add
                </button>
              </li>
            ))}
          </ul>
        </div>

        <div className="cart-section">
  <h3>🛒 Cart</h3>
  {cart.length === 0 && !message ? (
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
    <button onClick={placeOrder} className="order-btn">
      ✅ Place Order
    </button>
  )}

  <button onClick={viewOrders} className="order-btn view-orders-btn">
    📋 View My Orders
  </button>
</div>
        {showOrders && (
          <div className="orders-section">
            <h3>📜 My Orders</h3>
            {orders.length === 0 ? (
              <p>No orders found.</p>
            ) : (
              <ul>
                {orders.map((order) => (
                  <li key={order.id}>
                    Order #{order.id} - {new Date(order.createdAt).toLocaleString()}
                    <ul>
                      {order.items.map((item) => (
                        <li key={item.id}>
                          {item.menuItem.name} × {item.quantity}
                        </li>
                      ))}
                    </ul>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default TablePage;
