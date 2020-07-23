import React, {useEffect, useState} from "react";
import axios from "axios";

import Layout from "./Layout";
import log from "../utils/Logger";
import {addItemToCart, prices} from "./helpers";
import localStorageManager from "../utils/LocalStorageManager";
import {Link} from "react-router-dom";

const Shop = () => {
    const {user, token} = localStorageManager.getUser();
    const [categories, setCategories] = useState([]);
    const [checkedCategories, setCheckedCategories] = useState([]);
    const [priceRange, setPriceRange] = useState([]);
    const [skip, setSkip] = useState(0);
    const [limit, setLimit] = useState(4);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [productAmount, setProductAmount] = useState(0);
    const [showShoppingCart, setShowCart] = useState(false);

    const handleCategoryToggle = checkedCategory => () => {
        log.debug("Newly checkedCategories category:", checkedCategory);
        const allCheckedCategories = [checkedCategory];
        setCheckedCategories(allCheckedCategories);
    }

    const handelPriceChoice = selectedPriceRange => () => {
        log.debug("Newly selected price range:", selectedPriceRange);
        setPriceRange(selectedPriceRange);
    }

    // https://app.swaggerhub.com/apis/larapollehn/buchling/1.0.0#/product/post_product_by_search
    const fetchProducts = () => {
        log.debug("Current args for fetching products: (skip, limit, filters)", skip, limit, priceRange[0], priceRange[1], checkedCategories);
        axios({
            method: 'POST',
            url: "/api/product/by/search",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            },
            data: {
                skip: skip,
                price_bottom: priceRange[0],
                price_top: priceRange[1],
                category: checkedCategories
            }
        }).then((response) => {
            log.debug("Products were fetched", response.data.data);
            setFilteredProducts(response.data.data);
            setProductAmount(response.data.size);
            setSkip(0);
        }).catch((error) => {
            log.debug("Products could not be fetched", error.response.data);
        })
    }

    const loadMoreButton = () => {
        return (
            productAmount > 0 && productAmount >= limit && (
                <button className="btn btn-warning load-btn" onClick={loadMore}>Load More</button>
            )
        )
    }

    const loadMore = (event) => {
        event.preventDefault();
        const newLimit = limit * 2;
        setLimit(newLimit);
    }

    // lists all distinct categories
    // _id has the names as values and the_id is the actual id
    // https://app.swaggerhub.com/apis/larapollehn/buchling/1.0.0#/category/get_category
    const listAllCategories = () => {
        axios({
            method: 'GET',
            url: "/api/category"
        }).then((response) => {
            log.debug("List of all distinct categories:", response.data.category);
            setCategories(response.data.category);
        }).catch((error) => {
            log.debug("Could not fetch list of categories", error.message);
        })
    };


    useEffect(() => {
        fetchProducts();
        listAllCategories();
    }, []);

    const showImage = (product) => (
        <img className="product-photo"  src={`/api/product/photo/${product._id}`} alt={product.name}/>
    )

    const addToCart = (product) => {
        log.debug("Clicked add to card button in Shop");
        addItemToCart(product, showCart);
    }

    const showCart = () => {
        setShowCart(true);
        setTimeout(() => {
            setShowCart(false);
        }, 3000)
    }

    const shoppingCart = () => {
        let products = localStorageManager.getCart();
        if (products.length > 0) {
            return (
                <div style={{display: showShoppingCart ? '' : "none"}}>
                    <div className="card shop-cart">
                        <div className="card-body">
                            <h5 className="card-title shop-cart-title">Your Shopping Cart</h5>
                        </div>
                        <ul className="list-group list-group-flush">
                            {
                                products.map((product, i) => (
                                    <li key={i} className="list-group-item">{product.name} - {product.price}€</li>
                                ))
                            }
                        </ul>
                        <div className="card-body">
                            <Link to={`/cart`}>
                                <button className="btn btn-outline-warning mt-2 mb-2">View Cart</button>
                            </Link>
                        </div>
                    </div>
                </div>
            )
        }
    }

    const addToCartButton = product => {
        if (product.quantity >= 1) {
            return (
                <button onClick={() => {addToCart(product)}} className="btn btn-outline-warning mt-2 mb-2">Add to Card</button>
            )
        }
    }

    return (
        <Layout
            className="container"
        >
            <div className="row">
                <div className="col-md-9 offset-md-3">
                    <h2>Products</h2>
                    <p>Available products: {productAmount}</p>
                </div>

            </div>
            <div className="row">
                <div className="col-md-3 filter-section">
                    {shoppingCart()}
                    <h4>Filter by categories</h4>
                    {categories.map((category, i) => (
                            <li className="list-unstyled" key={i}>
                                <input onChange={handleCategoryToggle(category.the_id)} name={"category"} type="radio"
                                       className="form-check-input radios-filter" value={checkedCategories.indexOf(category.the_id)}/>
                                <label className="form-check-label filter-label">{category._id}</label>
                            </li>
                        )
                    )}
                    <br/>
                    <h4>Filter by price</h4>
                    {prices.map((range, i) => (
                            <li className="list-unstyled" key={i}>
                                <input onChange={handelPriceChoice(range.array)} name={"price"} type="radio"
                                       className="form-check-input radios-filter" value={range._id}/>
                                <label className="form-check-label filter-label">{range.name}</label>
                            </li>
                        )
                    )}
                    <br/>
                    <button onClick={fetchProducts} className="btn btn-primary filter-button">Apply Filters</button>
                </div>
                <div className="col-md-9 offset-md-3">
                    <div className="row">
                        {filteredProducts.slice(0, limit).map((product, i) => (
                            <div className="card col-md-6 mb-3" key={i}>
                                <div className="card-header">{product.name}</div>
                                {showImage(product)}
                                <div className="card-body">
                                    <p className="card-text">{product.description.substring(0, 50)}...</p>
                                    <p className="price-tag">{product.price}€</p>
                                    <p>{product.quantity} items left</p>
                                    <Link to={`/product/${product._id}`}>
                                        <button className="btn btn-outline-warning mt-2 mb-2">View Product</button>
                                    </Link>
                                    {addToCartButton(product)}
                                </div>
                            </div>
                        ))}
                    </div>
                    {loadMoreButton()}
                </div>
            </div>
        </Layout>
    )
}


export default Shop;
