import React, {useState, useEffect} from "react";
import Layout from "./Layout";
import localStorageManager from "../utils/LocalStorageManager";
import log from "../utils/Logger";
import {Link} from "react-router-dom";


const Cart = () => {
    const [items, setItems] = useState([]);
    const [update, setUpdate] = useState(false);

    const totalPrice = () => {
        let sum = 0;
        for (let i = 0; i < items.length; i++) {
            sum += items[i].price;
        }
        return sum;
    }

    const showImage = (product) => (
        <img src={`/api/product/photo/${product._id}`} alt={product.name} style={{width: "50px"}}/>
    )

    const changeProductAmount = product => event => {
        setUpdate(!update);
        let newCount = event.target.value > 1 ? event.target.value : 1;
        items.map((item, i) => {
            if(item._id === product._id){
                items[i].count = newCount;
            }
        })
        localStorageManager.saveCart(items);
    }

    const deleteProductFromCart = product => {
        items.map((item, i) => {
            if(item._id === product._id){
                items.splice(i, 1);
            }
        })
        localStorageManager.saveCart(items);
        setUpdate(!update);
    }

    useEffect(() => {
       setItems(localStorageManager.getCart())
    }, [update]);

    return (
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
                    {items.length > 0 && items.map((item, i) => (
                        <li key={i} className="list-group-item">
                            {showImage(item)}
                            {item.name} | {item.price}€
                            <div className="input-group">
                                <div className="input-group-prepend">
                                    <span className="input-group-text">Amount</span>
                                </div>
                                <input type="number" className="form-control" placeholder={item.count} onChange={changeProductAmount(item)}/>
                                <button onClick={() => {deleteProductFromCart(item)}} className="btn btn-danger">Remove</button>
                            </div>
                        </li>
                    ))}
                    {items.length === 0 && (
                        <li className="list-group-item">You have not added any items to your cart. <Link to={`/shop`}>
                            Shop now!
                        </Link>
                        </li>
                    )}
                    <li className="list-group-item">Total: {totalPrice()}€</li>
                </ul>
                <div className="card-body">
                    <Link to={`/shop`}>
                        <button className="btn btn-outline-primary mt-2 mb-2">Back to Shop</button>
                    </Link>
                    {items.length > 0 && (<Link to={`/`}>
                        <button className="btn btn-outline-primary mt-2 mb-2">Buy now</button>
                    </Link>)}
                </div>
            </div>
        </Layout>

    )
}

export default Cart;

