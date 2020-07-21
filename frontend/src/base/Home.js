import React, {useEffect, useState} from "react";
import axios from "axios";
import {Link} from "react-router-dom";

import Layout from "./Layout";
import log from "../utils/Logger";
import Search from "./Search";
import {addItemToCart} from "../base/helpers";

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
        <img className="product-photo" src={`/api/product/photo/${product._id}`} alt={product.name}/>
    )

    return (
        <div>
            <Layout title="Wool Dreams" description="shop all the handcraft essentials" className="container">
                <Search/>
                <h2 className="mb-4">Best Sellers</h2>
                <div className="row">
                    {soldProducts.map((product, i) => (
                        <div className="col-md-4 mb-3" key={i}>
                            <div className="card" key={i}>
                                <div className="card-header">{product.name}</div>
                                {showImage(product)}
                                <div className="card-body">
                                    <p className="card-text">{product.description}</p>
                                    <p>{product.price}€</p>
                                    <Link to={`/product/${product._id}`}>
                                        <button className="btn btn-outline-warning mt-2 mb-2">View Product</button>
                                    </Link>
                                </div>
                            </div>
                        </div>)
                    )}
                </div>
            </Layout>
        </div>
    )
};

export default Home;
