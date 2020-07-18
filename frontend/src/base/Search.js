import React, {useState, useEffect} from "react";
import axios from "axios";

import log from "../utils/Logger";

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
            url: "/api/product/search",
            data:{
                category: category,
                search: search ? search : undefined
            }
        }).then((response) => {
            log.debug("Products matching search", response.data);
            //setData({...data, results: response.data,, searched: true});
        }).catch((error) => {
            log.debug("Could not find products matching the search", error);
        })
    }

    const searchForm = () => (
        <form>
            <span className="input-group-text">
                <div className="input-group input-group-lg">
                    <div className="input-group-prepend">
                        <select className="btn mr-2" onChange={handleChange("category")}>
                            <option value="All">Pick Category</option>
                            {
                                categories.map((category, i) => (
                                    <option key={i} value={category.the_id}>{category._id}</option>
                                ))
                            }
                        </select>
                    </div>
                    <input type="search" className="form-control" onChange={handleChange("search")}
                           placeholder="Search by name..."/>
                    <button onClick={searchByUserInput}>Search</button>
                </div>
            </span>

        </form>
    )

    useEffect(() => {
        listAllCategories()
    }, [])

    return (
        <div className="row">
            <div className="container">{searchForm()}</div>
            {JSON.stringify(results)}
        </div>
    )
}

export default Search;
