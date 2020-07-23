import React, {useState, useEffect} from "react";
import axios from "axios";

import log from "../utils/Logger";
import {Link} from "react-router-dom";

const Search = () => {
    const [data, setData] = useState({
        categories: [],
        category: "",
        search: "",
        results: [],
        searched: false
    });
    const {categories, category, search, results, searched} = data;

    // lists all distinct categories
    // _id has the names as values and the_id is the actual id
    // https://app.swaggerhub.com/apis/larapollehn/buchling/1.0.0#/category/get_category
    const listAllCategories = () => {
        axios({
            method: 'GET',
            url: "/api/category"
        }).then((response) => {
            log.debug("List of all distinct categories:", response.data.category);
            setData({...data, categories: response.data.category});
        }).catch((error) => {
            log.debug("Could not fetch list of categories", error.message);
        })
    };

    const handleChange = (name) => (event) => {
        setData({...data, [name]: event.target.value, searched: false});
    }

    const searchByUserInput = (event) => {
        event.preventDefault();
        log.debug("User searches for product, (category, search input)", category, search);
        axios({
            method: "POST",
            url: "/api/products/search",
            data: {
                category: category,
                search: search
            }
        }).then((response) => {
            log.debug("Products matching search", response.data);
            setData({...data, results: response.data.products, searched: true});
        }).catch((error) => {
            log.debug("Could not find products matching the search", error);
        })
    }

    const searchForm = () => (
        <form>
            <span className="input-group-text">
                <div className="input-group input-group-lg">
                    <input type="search" className="form-control" onChange={handleChange("search")}
                           placeholder="Search by name..."/>
                    <button className="btn btn-outline-warning search-btn" onClick={searchByUserInput}>Search</button>
                </div>
            </span>

        </form>
    )

    const showImage = (product) => (
        <img className="product-photo" src={`/api/product/photo/${product._id}`} alt={product.name} />
    )

    const searchMessage = () => {
        if (searched && results.length > 0) {
            return `Found ${results.length} product(s) that match your search`;
        } else if (searched && results.length < 1) {
            return "No Products found";
        }
    }

    useEffect(() => {
        listAllCategories()
    }, [])

    return (
        <div className="row">
            <div className="container">
                {searchForm()}
                <h2 className="mt-4 mb-4">{searchMessage(searched, results)}</h2>
                <div className="row search-result">
                    {results.map((product, i) => (
                        <div className="card col-md-4 mb-3 searched-product" key={i}>
                            <div className="card-header">{product.name}</div>
                            {showImage(product)}
                            <div className="card-body">
                                <p className="card-text">{product.description.substring(0, 50)}...</p>
                                <p className="price-tag">{product.price}€</p>
                                <Link to={`/product/${product._id}`}>
                                    <button className="btn btn-outline-warning mt-2 mb-2">View Product</button>
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default Search;
