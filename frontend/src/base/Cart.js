import React, {useState, useEffect} from "react";
import Layout from "./Layout";
import localStorageManager from "../utils/LocalStorageManager";
import log from "../utils/Logger";
import {Link} from "react-router-dom";


const Cart = () => {
    const [items, setItems] = useState([]);

    const getCartItems = () => {
        if(localStorageManager.getCart()){
            const itemsInCart = localStorageManager.getCart();
            log.debug("Got all items in cart:", itemsInCart);
            setItems(itemsInCart);
        }
    }

    const totalPrice = () => {
        let sum = 0;
        for (let i = 0; i < items.length; i++){
            sum += items[i].price;
        }
        return sum;
    }

    const showImage = (product) => (
        <img src={`/api/product/photo/${product._id}`} alt={product.name} style={{width: "50px"}}/>
    )


    useEffect(() => {
        getCartItems();
    }, []);

    return(
        <Layout
            title="Cart"
            description="Buy them books now!"
            className="container"
        >
            <div className="card">
                    <div className="card-body">
                        <h5 className="card-title">Your Cart</h5>
                        <p className="card-text">You have {items.length} products in your cart.</p>
                    </div>
                    <ul className="list-group list-group-flush">
                        {items.map((item, i) => (
                            <li key={i} className="list-group-item">
                                {showImage(item)}
                                {item.name} | {item.price}€
                            </li>
                        ))}
                        <li className="list-group-item">Total: {totalPrice()}€</li>
                    </ul>
                    <div className="card-body">
                        <Link to={`/shop`}>
                            <button className="btn btn-outline-primary mt-2 mb-2">Back to Shop</button>
                        </Link>
                        <Link to={`/`}>
                            <button className="btn btn-outline-primary mt-2 mb-2">Buy now</button>
                        </Link>
                    </div>
            </div>
        </Layout>

    )
}

export default Cart;

