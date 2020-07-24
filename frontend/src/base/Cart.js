import React, {useState, useEffect} from "react";
import Layout from "./Layout";
import localStorageManager from "../utils/LocalStorageManager";
import {Link} from "react-router-dom";

import paypal from "./paypal.png";
import mastercard from "./mastercard.png";


const Cart = () => {
    const [items, setItems] = useState([]);
    const [update, setUpdate] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [showBuyButton, setShowBuyButton] = useState(true);
    const [error, setError] = useState(false);

    const totalPrice = () => {
        let sum = 0;
        for (let i = 0; i < items.length; i++) {
            sum += items[i].price * items[i].count;
        }
        return sum.toFixed(2);
    }

    const showImage = (product) => (
        <img src={`/api/product/photo/${product._id}`} alt={product.name} style={{width: "50px"}}/>
    )

    const changeProductAmount = product => event => {
        setUpdate(!update);
        let newCount = event.target.value > 1 ? event.target.value : 1;
        items.map((item, i) => {
            if (item._id === product._id) {
                if(items[i].quantity > newCount){
                    items[i].count = newCount;
                } else {
                    setError(true);
                    setTimeout(() => {
                        setError(false);
                    }, 3000)
                    items[i].count = items[i].quantity;
                    let input = document.getElementById(`amount${items[i]._id}`);
                    input.value = items[i].quantity;
                }
            }
        })
        localStorageManager.saveCart(items);
    }

    const showError = () => (
        <div className="alert alert-danger" role="alert" style={{display: error ? '' : "none"}}>
            Maximum amount of product reached.
        </div>
    );

    const deleteProductFromCart = product => {
        items.map((item, i) => {
            if (item._id === product._id) {
                items.splice(i, 1);
            }
        })
        localStorageManager.saveCart(items);
        let badge = document.getElementById("cart-total-items-badge");
        badge.innerText = localStorageManager.getCart().length;
        setUpdate(!update);
    }

    useEffect(() => {
        setItems(localStorageManager.getCart())
    }, [update]);

    const openPayment = () => {
        setShowBuyButton(false);
        setShowModal(true);
    }

    const emptyCart = () => {
        localStorageManager.removeCart();
        setItems([]);
    }

    return (
        <Layout
            className="container"
        >
            <div className="card">
                <div className="card-body">
                    <h3 className="card-title">Your Cart</h3>
                    {items.length > 0 &&
                    <p className="card-text">You have {items.length} product(s) in your cart.</p>
                    }
                </div>
                <ul className="list-group list-group-flush">
                    {items.length > 0 && items.map((item, i) => (
                        <li key={i} className="list-group-item">
                            {showImage(item)}
                            {item.name} | {item.price.toFixed(2)}€
                            <div className="input-group">
                                <div className="input-group-prepend">
                                    <span className="input-group-text amount-label">Amount</span>
                                </div>
                                <input id={`amount${item._id}`} type="number" className="form-control" placeholder={item.count}
                                       onChange={changeProductAmount(item)}/>
                                <button onClick={() => {
                                    deleteProductFromCart(item)
                                }} className="btn btn-danger">Remove
                                </button>
                            </div>
                        </li>
                    ))}
                    {(!items || items.length === 0) && (
                        <li className="list-group-item">You have not added any items to your cart. <Link className="dashboard-link" to={`/shop`}>
                            Shop now!
                        </Link>
                        </li>
                    )}
                    {showError()}
                    <li className="list-group-item price-list-item">Total: {totalPrice()}€</li>
                </ul>
                <div className="card-body">
                    {showBuyButton && (
                        <Link to={`/shop`}>
                            <button className="btn btn-outline-warning mt-2 mb-2">Back to Shop</button>
                        </Link>
                    )}
                    {items.length > 0 && showBuyButton && (
                        <button onClick={openPayment} className="btn btn-outline-warning mt-2 mb-2">Order now</button>
                    )}
                </div>
            </div>
            {showModal && (
                <div>
                    <h3>Shipping Address</h3>
                    <div className="form-row">
                        <div className="form-group col-md-6">
                            <label htmlFor="inputEmail4">Salutation</label>
                            <input type="text" className="form-control" placeholder="Mrs./Ms. or leave empty"/>
                        </div>
                        <div className="form-group col-md-6">
                            <label htmlFor="inputPassword4">Full Name</label>
                            <input type="text" className="form-control" id="inputPassword4"
                                   placeholder="FirstName LastName"/>
                        </div>
                    </div>
                    <div className="form-group">
                        <label htmlFor="inputAddress">Address</label>
                        <input type="text" className="form-control" id="inputAddress" placeholder="1234 Main St"/>
                    </div>
                    <div className="form-group">
                        <label htmlFor="inputAddress2">Address 2</label>
                        <input type="text" className="form-control" id="inputAddress2"
                               placeholder="Apartment, studio, or floor"/>
                    </div>
                    <div className="form-row">
                        <div className="form-group col-md-6">
                            <label htmlFor="inputCity">City</label>
                            <input type="text" className="form-control" id="inputCity" placeholder="City"/>
                        </div>
                        <div className="form-group col-md-4">
                            <label htmlFor="inputState">Country</label>
                            <input type="text" className="form-control" placeholder="DE"/>
                        </div>
                        <div className="form-group col-md-2">
                            <label htmlFor="inputZip">Postal Code</label>
                            <input type="text" className="form-control" id="inputZip" placeholder="12345"/>
                        </div>
                    </div>
                    <h3>Info! <br/>You pay after receiving your order.</h3>
                    <div className="form-row">
                        <div className="form-group col-md-4">
                            Available Payment Options will be: <br/>
                            <img src={mastercard} alt="mastercard logo"/>
                            <img src={paypal} alt="paypal logo"/>
                        </div>
                    </div>
                    <Link to={`/shop`}>
                        <button className="btn btn-outline-warning mt-2 mb-2">Back to Shop</button>
                    </Link>
                    <Link to={`/confirmation`}>
                        <button onClick={emptyCart} className="btn btn-outline-warning mt-2 mb-2">Checkout</button>
                    </Link>
                </div>
            )}
        </Layout>
    )
}

export default Cart;

