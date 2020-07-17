import React, {useEffect, useState} from "react";
import axios from "axios";

import Layout from "./Layout";
import log from "../utils/Logger";

const Shop = () => {
    const [categories, setCategories] = useState([]);
    const [checked, setChecked] = useState([]);

    const handleToggle = checkedCategory => () => {
        log.debug("Newly checked category:", checkedCategory);
        const indexCurrentCategory = checked.indexOf(checkedCategory);
        const allCheckedCategories = [...checked];

        //is category in list of checked categories remove it, else add
        if(indexCurrentCategory === -1){
            allCheckedCategories.push(checkedCategory);
            log.debug("Added new category to checked. Now:", allCheckedCategories);
        } else {
            allCheckedCategories.splice(indexCurrentCategory, 1);
            log.debug("Removed category in checked. Now:", allCheckedCategories);
        }
        setChecked(allCheckedCategories);
    }

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
                            <input onChange={handleToggle(category.the_id)} type="checkbox" className="form-check-input" value={checked.indexOf(category.the_id)}/>
                            <label className="form-check-label">{category._id}</label>
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
