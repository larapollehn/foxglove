import React, {useEffect, useState} from "react";
import axios from "axios";

import Layout from "./Layout";
import log from "../utils/Logger";

const Shop = () => {
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        listAllCategories();
    }, []);

    // lists all distinct categories
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

    return (
        <Layout
            title="Shop"
            description="Shop all the good, dreamy books"
            className="container"
        >
            <div className="row">
                <div className="col-4">
                    <h4>Filter by categories</h4>
                    {categories.map((category, i) => (
                        <li className="list-unstyled" key={i}>
                            <input type="checkbox" className="form-check-input"/>
                            <label className="form-check-label">{category}</label>
                        </li>
                        )
                    )}
                </div>
                <div className="col-8">Right Side</div>
            </div>
        </Layout>
    )
}

export default Shop;
