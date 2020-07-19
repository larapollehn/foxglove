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
        const indexCurrentCategory = checkedCategories.indexOf(checkedCategory);
        const allCheckedCategories = [...checkedCategories];

        //is category in list of checkedCategories categories remove it, else add
        if (indexCurrentCategory === -1) {
            allCheckedCategories.push(checkedCategory);
            log.debug("Added new category to checkedCategories. Now:", allCheckedCategories);
        } else {
            allCheckedCategories.splice(indexCurrentCategory, 1);
            log.debug("Removed category in checkedCategories. Now:", allCheckedCategories);
        }
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
                <button className="btn btn-primary" onClick={loadMore}>Load More</button>
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
        <img src={`/api/product/photo/${product._id}`} alt={product.name} style={{width: "100px"}}/>
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
        if(products.length > 0) {
            return (
                <div style={{display: showShoppingCart ? '' : "none"}}>
                    <div className="card">
                        <div className="card-body">
                            <h5 className="card-title">Your Shopping Cart</h5>
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
                                <button className="btn btn-outline-primary mt-2 mb-2">View Cart</button>
                            </Link>
                        </div>
                    </div>
                </div>
            )
        }
    }

    const addToCartButton = (product) => {
        if (product.quantity >= 1) {
            return (
                <Link to="/">
                    <button className="btn btn-outline-primary mt-2 mb-2">Add to Card</button>
                </Link>
            )
        }
    }

    return (
        <Layout
            title="Shop"
            description="Shop all the good, dreamy books"
            className="container"
        >
            <div className="row">
                <div className="col-4">
                    {shoppingCart()}
                    <h4>Filter by categories</h4>
                    {categories.map((category, i) => (
                            <li className="list-unstyled" key={i}>
                                <input onChange={handleCategoryToggle(category.the_id)} type="checkbox"
                                       className="form-check-input" value={checkedCategories.indexOf(category.the_id)}/>
                                <label className="form-check-label">{category._id}</label>
                            </li>
                        )
                    )}
                    <h4>Filter by price</h4>
                    {prices.map((range, i) => (
                            <li className="list-unstyled" key={i}>
                                <input onChange={handelPriceChoice(range.array)} name={"price"} type="radio"
                                       className="form-check-input" value={range._id}/>
                                <label className="form-check-label">{range.name}</label>
                            </li>
                        )
                    )}
                    <button onClick={fetchProducts} className="btn btn-primary">Apply Filters</button>
                </div>
                <div className="col-8">
                    <h2>Products</h2>
                    <p>Available Products: {productAmount}</p>
                    <div className="row">
                        {filteredProducts.slice(0, limit).map((product, i) => (
                            <div className="card" key={i}>
                                <div className="card-header">{product.name}</div>
                                {showImage(product)}
                                <div className="card-body">
                                    <p className="card-text">{product.description.substring(0, 50)}...</p>
                                    <p>{product.price}€</p>
                                    <p>{product.quantity} books left</p>
                                    <Link to={`/product/${product._id}`}>
                                        <button className="btn btn-outline-primary mt-2 mb-2">View Product</button>
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
