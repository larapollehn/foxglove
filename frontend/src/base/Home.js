import React from "react";

import Layout from "./Layout";

/**
 * https://app.swaggerhub.com/apis/larapollehn/buchling/1.0.0#/product/get_products_listAll
 */
const Home = () => {
    const getSoldProducts = () => {
        axios({
            method: 'GET',
            url: `/api/products?sortBy=${sortBy}&order=desc&limit=6`,
        }).then((response) => {

        }).catch((error) => {

        })
    }

    return (
        <div><Layout title="Home Page" description="MERN Stack app"/></div>
    )
};

export default Home;
