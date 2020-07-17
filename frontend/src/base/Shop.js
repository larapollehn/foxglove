import React, {useEffect, useState} from "react";
import axios from "axios";

import Layout from "./Layout";
import log from "../utils/Logger";

const Shop = () => {
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        listAllCategories();
    }, []);

    const listAllCategories = () => {
        axios({
            method: 'GET',
            url: "/api/category"
        }).then((response) => {
            log.debug("List of all distinct categories:", response.data);
            setCategories(response.data);
        }).catch((error) => {
            log.debug("Could not fetch list of categories", error.message);
        })
    };

    return (
        <Layout
            title="Shop"
            description="Shop all the good, dreamy books"
            className="container-fluid"
        >
            <div className="row">
                <div className="col-4">Left Sidebar</div>
                <div className="col-8">Right Side</div>
            </div>
        </Layout>
    )
}

export default Shop;
