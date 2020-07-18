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
            data:{
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
                    <button onClick={searchByUserInput}>Search</button>
                </div>
            </span>

        </form>
    )

    const showImage = (product) => (
        <img src={`/api/product/photo/${product._id}`} alt={product.name} style={{width: "100px"}}/>
    )

    useEffect(() => {
        listAllCategories()
    }, [])

    return (
        <div className="row">
            <div className="container">{searchForm()}</div>
            <div className="row">
                {results.map((product, i) => (
                    <div className="card" key={i}>
                        <div className="card-header">{product.name}</div>
                        {showImage(product)}
                        <div className="card-body">
                            <p className="card-text">{product.description.substring(0,50)}...</p>
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
                ))}
            </div>
        </div>
    )
}

export default Search;
