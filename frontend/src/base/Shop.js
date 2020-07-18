import React, {useEffect, useState} from "react";
import axios from "axios";

import Layout from "./Layout";
import log from "../utils/Logger";
import {prices} from "./helpers";
import localStorageManager from "../utils/LocalStorageManager";

const Shop = () => {
    const {user, token} = localStorageManager.getUser();
    const [categories, setCategories] = useState([]);
    const [checked, setChecked] = useState([]);
    const [filters, setFilters] = useState({
        filters: {category: [], price: []}
    });
    const [skip, setSkip] = useState(0);
    const [limit, setLimit] = useState(6);
    const [filteredProducts, setFilteredProducts] = useState([]);

    const handleCategoryToggle = checkedCategory => () => {
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

        // set the chosen category/categories in the filter object
        const categoryFilter = {...filters};
        categoryFilter.filters["category"] = allCheckedCategories;
        setFilters(categoryFilter);
    }

    const handelPriceChoice = selectedPriceRange => () =>{
        log.debug("Newly selected price range:", selectedPriceRange);
        // set the chosen price range in the filter object
        const categoryFilter = {...filters};
        categoryFilter.filters["price"] = selectedPriceRange;
        setFilters(categoryFilter);
    }

    // https://app.swaggerhub.com/apis/larapollehn/buchling/1.0.0#/product/post_product_by_search
    const fetchProducts = () => {
        log.debug("Current args for fetching products: (skip, limit, filters)", skip, limit, filters);
        axios({
            method: 'POST',
            url: "/api/product/by/search",
            headers: {
                Accept: "application/json",
                "Content-Type": "multipart/form-data",
                Authorization: `Bearer ${token}`
            },
            data: {
                skip: skip,
                limit: limit,
                filters: filters
            }
        }).then((response) => {
            log.debug("Products were fetched", response.data);
            setFilteredProducts(response.data);
        }).catch((error) => {
            log.debug("Products could not be fetched", error.response.data);
        })
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
        listAllCategories();
    }, []);

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
                            <input onChange={handleCategoryToggle(category.the_id)} type="checkbox" className="form-check-input" value={checked.indexOf(category.the_id)}/>
                            <label className="form-check-label">{category._id}</label>
                        </li>
                        )
                    )}
                    <h4>Filter by price</h4>
                    {prices.map((range, i) => (
                            <li className="list-unstyled" key={i}>
                                <input onChange={handelPriceChoice(range.array)} name={"price"} type="radio" className="form-check-input" value={range._id}/>
                                <label className="form-check-label">{range.name}</label>
                            </li>
                        )
                    )}
                    <button onClick={fetchProducts} className="btn btn-primary">Apply Filters</button>
                </div>
                <div className="col-8">Right Side
                    {JSON.stringify(filters)}
                </div>
            </div>
        </Layout>
    )
}

export default Shop;
