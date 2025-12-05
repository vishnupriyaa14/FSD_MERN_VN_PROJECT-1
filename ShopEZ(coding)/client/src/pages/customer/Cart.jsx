import React, { useEffect, useState, useContext } from 'react';
import '../../styles/Cart.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { GeneralContext } from '../../context/GeneralContext';



const Cart = () => {
  const { cartCount, setCartCount } = useContext(GeneralContext);
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      };
      const response = await axios.get('http://localhost:6001/api/cart/fetch-cart', config);

      // Ensure cartItems is always an array
      const items = Array.isArray(response.data) ? response.data : [];
      setCartItems(items);

      // Update navbar count using total quantity
      const count = items.reduce((acc, item) => acc + (parseInt(item.quantity) || 0), 0);
      setCartCount(count);
    } catch (error) {
      console.error('Error fetching cart:', error);
      setCartItems([]);
    } finally {
      setLoading(false);
    }
  };

  const removeItem = async (itemId) => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      };
      await axios.delete(`http://localhost:6001/api/cart/remove-item/${itemId}`, config);
      fetchCart(); // refresh cart after deletion
    } catch (error) {
      console.error('Error removing item:', error);
    }
  };

  const [totalPrice, setTotalPrice] = useState(0);
  const [totalDiscount, setTotalDiscount] = useState(0);
  const [deliveryCharges, setDeliveryCharges] = useState(0);

  const calculateTotalPrice = () => {
    const total = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const discount = cartItems.reduce((sum, item) => sum + ((item.price * item.discount) / 100) * item.quantity, 0);
    setTotalPrice(total);
    setTotalDiscount(Math.floor(discount));
    setDeliveryCharges(total > 1000 || cartItems.length === 0 ? 0 : 50);
  };

  useEffect(() => {
    calculateTotalPrice();
  }, [cartItems]);

  // Checkout form states
  const [name, setName] = useState('');
  const [mobile, setMobile] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [pincode, setPincode] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('');

  const userId = localStorage.getItem('userId');

  const placeOrder = async () => {
    if (cartItems.length === 0) return;

    try {
      await axios.post('http://localhost:6001/api/orders/place-cart-order', {
        userId,
        name,
        mobile,
        email,
        address,
        pincode,
        paymentMethod,
        orderDate: new Date(),
      });
      alert('Order placed!');
      setName('');
      setMobile('');
      setEmail('');
      setAddress('');
      setPincode('');
      setPaymentMethod('');
      navigate('/profile');
    } catch (error) {
      console.error('Error placing order:', error);
    }
  };

  if (loading) return <p style={{ textAlign: 'center', marginTop: '20vh' }}>Loading cart...</p>;

  return (
    <div className="cartPage">
      <div className="cartContents">
        {cartItems.length === 0 && <p style={{ textAlign: 'center', marginTop: '20vh' }}>Cart is empty...</p>}

        {cartItems.map((item) => (
          <div className="cartItem" key={item._id}>
            <img src={item.mainImg} alt={item.title} />
            <div className="cartItem-data">
              <h4>{item.title}</h4>
              <p>{item.description}</p>
              <div className="cartItem-inputs">
                <span>
                  <p>
                    <b>Size: </b> {item.size}
                  </p>
                </span>
                <span>
                  <p>
                    <b>Quantity: </b> {item.quantity}
                  </p>
                </span>
              </div>
              <span>
                <h5>
                  <b>Price: </b> &#8377; {parseInt(item.price - (item.price * item.discount) / 100) * item.quantity}
                </h5>
              </span>
              <button className="btn" onClick={() => removeItem(item._id)}>
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="cartPriceBody">
        <h4>Price Details</h4>
        <span>
          <b>Total MRP: </b> <p>&#8377; {totalPrice}</p>
        </span>
        <span>
          <b>Discount on MRP: </b> <p style={{ color: 'rgb(7, 156, 106)' }}> - &#8377; {totalDiscount}</p>
        </span>
        <span>
          <b>Delivery Charges: </b> <p style={{ color: 'red' }}> + &#8377; {deliveryCharges}</p>
        </span>
        <hr />
        <h5>
          <b>Final Price: </b> &#8377; {totalPrice - totalDiscount + deliveryCharges}
        </h5>
        <button data-bs-toggle="modal" data-bs-target="#staticBackdrop">
          Place order
        </button>
      </div>

      {/* Checkout Modal */}
<div className="modal fade" id="staticBackdrop" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
  <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable">
    <div className="modal-content">
      
      <div className="modal-header">
        <h5 className="modal-title" id="staticBackdropLabel">Checkout</h5>
        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>

      <div className="modal-body">
        
        {/* Checkout Form */}
        <div className="checkout-address">
          <h4>Checkout Details</h4>

          {/* Name */}
          <div className="form-floating mb-5">
            <input 
              type="text" 
              className="form-control" 
              value={name} 
              onChange={(e) => setName(e.target.value)} 
            />
            <label>Name</label>
          </div>

          {/* Mobile */}
          <div className="form-floating mb-5">
            <input 
              type="text" 
              className="form-control" 
              value={mobile} 
              onChange={(e) => setMobile(e.target.value)} 
            />
            <label>Mobile</label>
          </div>

          {/* Email */}
          <div className="form-floating mb-5">
            <input 
              type="text" 
              className="form-control" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
            />
            <label>Email</label>
          </div>

          {/* Address */}
          <div className="form-floating mb-5">
            <input 
              type="text" 
              className="form-control" 
              value={address} 
              onChange={(e) => setAddress(e.target.value)} 
            />
            <label>Address</label>
          </div>

          {/* Pincode */}
          <div className="form-floating mb-5">
            <input 
              type="text" 
              className="form-control" 
              value={pincode} 
              onChange={(e) => setPincode(e.target.value)} 
            />
            <label>Pincode</label>
          </div>
        </div>

        {/* Payment */}
        <div className="checkout-payment-method mt-4">
          <h4>Payment Method</h4>
          <div className="form-floating mb-3">
            <select 
              className="form-select" 
              value={paymentMethod} 
              onChange={(e) => setPaymentMethod(e.target.value)}
            >
              <option value="">choose payment method</option>
              <option value="netbanking">netbanking</option>
              <option value="card">card payments</option>
              <option value="upi">upi</option>
              <option value="cod">cash on delivery</option>
            </select>
            <label>Choose Payment method</label>
          </div>
        </div>

      </div>

      <div className="modal-footer">
        <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
        <button type="button" className="btn btn-primary" data-bs-dismiss="modal" onClick={placeOrder}>
          Order
        </button>
      </div>

    </div>
  </div>
</div>

    </div>
  );
};

export default Cart;
