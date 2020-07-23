import React, {useEffect, useState} from "react";
import axios from "axios";

import Layout from "./Layout";
import log from "../utils/Logger";
import {Link} from "react-router-dom";

const Product = (props) => {
    const [product, setProduct] = useState({});
    const [relatedProducts, setRelatedProducts] = useState([]);

    // https://app.swaggerhub.com/apis/larapollehn/buchling/1.0.0#/product/get_product__productId
    const fetchProduct = productId => {
        log.debug("Showcase single product:", productId);
        axios({
            method: "GET",
            url: `/api/product/${productId}`
        }).then((response) => {
            log.debug("Fetched Product:", response.data);
            setProduct(response.data);
        }).catch((error) => {
            log.debug("Could not fetch product based on productId", error);
        });
    };

    // https://app.swaggerhub.com/apis/larapollehn/buchling/1.0.0#/product/get_product_related__productId
    const fetchRelatedProducts = productId => {
        axios({
            method: "GET",
            url: `/api/product/related/${productId}`
        }).then((response) => {
            log.debug("Fetched related products:", response.data);
            setRelatedProducts(response.data.products);
        }).catch((error) => {
            log.debug("Could not fetch related Products", error);
        })
    };

    const showImage = (product) => (
        <img src={`/api/product/photo/${product._id}`} alt={product.name} className="single-product-photo"/>
    );

    const availability = (product) => {
        if (product.quantity >= 1) {
            return (
                <span className="badge badge-primary">In Stock</span>
            )
        } else {
            return (
                <span className="badge badge-danger">Sold Out</span>
            )
        }
    }

    const buyIfAvailable = (product) => {
        if (product.quantity >= 1) {
            return (
                <Link to="/">
                    <button className="btn btn-outline-warning mt-2 mb-2">Add to Card</button>
                </Link>
            )
        } else {
            return (
                <span className="badge badge-danger">Sold Out</span>
            )
        }
    }

    const showRelatedProducts = () => {
        if (relatedProducts && relatedProducts.length > 0) {
            return (
                relatedProducts.map((product, i) => (
                    <div className="card" key={i}>
                        <div className="card-header">{product.name}</div>
                        {showImage(product)}
                        <div className="card-body">
                            <p className="card-text">{product.description}...</p>
                            <p className="price-tag">{product.price}€</p>
                            <Link to={`/product/${product._id}`}>
                                <button className="btn btn-outline-warning mt-2 mb-2">View Product</button>
                            </Link>
                            {buyIfAvailable(product)}
                        </div>
                    </div>
                ))
            )
        }
    }

    const addToCartButton = (product) => {
        if (product.quantity >= 1) {
            return (
                <Link to="/cart">
                    <button className="btn btn-outline-warning mt-2 mb-2">Add to Card</button>
                </Link>
            )
        }
    }

    useEffect(() => {
        const productId = props.match.params.productId;
        log.debug("productId", productId);
        fetchProduct(productId);
        fetchRelatedProducts(productId);
    }, [props]);

    return (
        <Layout
            title={product.name}
            description={""}
            className="container"
        >
            <div className="row">
                <div className="card col-md-8">
                    <div className="card-header">{product.name}</div>
                    {showImage(product)}
                    <div className="card-body">
                        <p className="card-text">{product.description}</p>
                        <p className="price-tag">{product.price}€</p>
                        {availability(product)}
                        {addToCartButton(product)}
                    </div>
                </div>
                <div className="col-md-4">
                    {relatedProducts.length > 0 && (
                        <h4>Related products you might like</h4>
                    )}
                    {showRelatedProducts()}
                </div>
            </div>

        </Layout>
    )
}

export default Product;
