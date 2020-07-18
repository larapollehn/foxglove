import React, {useEffect, useState} from "react";
import axios from "axios";

import Layout from "./Layout";
import log from "../utils/Logger";

const Product = (props) => {
    const [product, setProduct] = useState({});
    const [error, setError] = useState(false);

    // https://app.swaggerhub.com/apis/larapollehn/buchling/1.0.0#/product/get_product__productId
    const fetchProduct = productId => {
        log.debug("Showcase single product:", productId);
        axios({
            method: "GET",
            url: `/api/product/${productId}`
        }).then((response) =>{
            log.debug("Fetched Product:", response.data);
            setProduct(response.data);
        }).catch((error) => {
            log.debug("Could not fetch product based on productId", error);
        });
    }

    const showImage = (product) => (
        <img src={`/api/product/photo/${product._id}`} alt={product.name} style={{width: "100px"}}/>
    )

    useEffect(() => {
        const productId = props.match.params.productId;
        log.debug("productId", productId);
        fetchProduct(productId);
    }, []);

    return (
        <Layout
            title="Product Spotlight"
            description="Buy the book now!"
            className="container"
        >
            <p>Product Page</p>
            {JSON.stringify(product)}
        </Layout>
    )
}

export default Product;
