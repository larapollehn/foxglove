import React, {useEffect, useState} from "react";
import axios from "axios";
import {Link} from "react-router-dom";

import Layout from "./Layout";
import log from "../utils/Logger";
import Search from "./Search";


/**
 * https://app.swaggerhub.com/apis/larapollehn/buchling/1.0.0#/product/get_products_listAll
 */
const Home = () => {
    const [soldProducts, setSoldProducts] = useState([]);

    useEffect(() => {
        getSoldProducts();
    }, []);

    const getSoldProducts = () => {
        axios({
            method: 'GET',
            url: `/api/products/listAll`,
        }).then((response) => {
            log.debug("Fetched products for home:", response.data.products);
            setSoldProducts(response.data.products);
        }).catch((error) => {
            log.debug("Sold products for home page could not be fetched", error);
        })
    };

    const showImage = (product) => (
        <img src={`/api/product/photo/${product._id}`} alt={product.name}/>
    )

    return (
        <div>
            <Layout title="Home Page" description="MERN Stack app">
                <Search/>
                <h2 className="mb-4">Best Sellers</h2>
                {soldProducts.map((product, i) => (
                    <div className="col-4 mb-3" key={i}>
                        <div className="card" key={i}>
                            <div className="card-header">{product.name}</div>
                            {showImage(product)}
                            <div className="card-body">
                                <p className="card-text">{product.description}</p>
                                <p>{product.price}€</p>
                                <p>{product.quantity} books left</p>
                                <Link to="/">
                                    <button className="btn btn-outline-primary mt-2 mb-2">View Button</button>
                                </Link>
                                <Link to="/">
                                    <button className="btn btn-outline-primary mt-2 mb-2">Add to Card</button>
                                </Link>
                            </div>
                        </div>
                    </div>)
                )}
            </Layout>
        </div>
    )
};

export default Home;
