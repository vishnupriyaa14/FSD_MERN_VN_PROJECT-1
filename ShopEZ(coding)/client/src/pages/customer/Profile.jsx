import React, { useContext, useEffect, useState } from 'react';
import '../../styles/Profile.css';
import { GeneralContext } from '../../context/GeneralContext';
import axios from 'axios';

const Profile = () => {
  const { logout } = useContext(GeneralContext);

  // Get user info from localStorage
  const username = localStorage.getItem('username');
  const email = localStorage.getItem('email');
  const token = localStorage.getItem('token'); // JWT token

  const [orders, setOrders] = useState([]);

  // Fetch only logged-in user's orders
  const fetchOrders = async () => {
    try {
      const { data } = await axios.get('http://localhost:6001/api/orders/fetch-orders', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setOrders(data.reverse()); // latest orders first
    } catch (error) {
      console.error("Error fetching orders:", error);
      alert("Failed to fetch your orders. Please try again.");
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // Cancel order
  const cancelOrder = async (orderId) => {
    if (!orderId) {
      alert("Order ID is required");
      return;
    }

    try {
      const { data } = await axios.put(
        "http://localhost:6001/api/orders/cancel-order",
        { orderId },
        { headers: { Authorization: `Bearer ${token}` } } // send token
      );

      console.log("Order cancelled:", data);
      alert("Order cancelled successfully!");

      // Update local state
      setOrders(prevOrders =>
        prevOrders.map(order =>
          order._id === orderId ? { ...order, orderStatus: "Cancelled" } : order
        )
      );
    } catch (error) {
      console.error("Cancel order error:", error);
      alert(error.response?.data?.message || "Error cancelling order");
    }
  };

  return (
    <div className="profilePage">

      <div className="profileCard">
        <span>
          <h5>Username: </h5>
          <p>{username}</p>
        </span>
        <span>
          <h5>Email: </h5>
          <p>{email}</p>
        </span>
        <span>
          <h5>Orders: </h5>
          <p>{orders.length}</p>
        </span>
        <button className='btn btn-danger' onClick={logout}>Logout</button>
      </div>

      <div className="profileOrders-container">
        <h3>Your Orders</h3>
        <div className="profileOrders">
          {orders.length === 0 ? (
            <p style={{ padding: '20px', color: 'gray' }}>You have no orders yet.</p>
          ) : (
            orders.map(order => (
              <div className="profileOrder" key={order._id}>
                <img src={order.mainImg} alt={order.title} />
                <div className="profileOrder-data">
                  <h4>{order.title}</h4>
                  <p>{order.description}</p>
                  <div>
                    <span><p><b>Size:</b> {order.size}</p></span>
                    <span><p><b>Quantity:</b> {order.quantity}</p></span>
                    <span><p><b>Price:</b> &#8377; {parseInt(order.price - (order.price * order.discount) / 100) * order.quantity}</p></span>
                    <span><p><b>Payment method:</b> {order.paymentMethod}</p></span>
                  </div>
                  <div>
                    <span><p><b>Address:</b> {order.address}</p></span>
                    <span><p><b>Pincode:</b> {order.pincode}</p></span>
                    <span><p><b>Ordered on:</b> {order.orderDate.slice(0, 10)}</p></span>
                  </div>
                  <div>
                    <span><p><b>Order status:</b> {order.orderStatus}</p></span>
                  </div>
                  {(order.orderStatus === 'order placed' || order.orderStatus === 'In-transit') && (
                    <button className='btn btn-danger' onClick={() => cancelOrder(order._id)}>Cancel</button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
