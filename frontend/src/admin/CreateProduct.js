import React, {useEffect, useState} from "react";
import axios from "axios";

import Layout from "../base/Layout";
import localStorageManager from "../utils/LocalStorageManager";
import log from "../utils/Logger";

/**
 * https://app.swaggerhub.com/apis/larapollehn/buchling/1.0.0#/product/post_product_create__userId_
 */
const CreateProduct = () => {
    const [values, setValues] = useState({
        name: "",
        description: "",
        price: "",
        category: "",
        quantity: "",
        error: "",
        success: false,
        formData: ""
    });

    const {user, token} = localStorageManager.getUser();
    const {
        name,
        description,
        price,
        category,
        quantity,
        error,
        success,
        formData
    } = values;

    const [categories, setCategories] = useState([]);

    useEffect(() => {
        listAllCategories();
        setValues({...values, formData: new FormData(), error: false, success: false});
    }, []);

    const handleChange = targetValue => event => {
        const value =
            targetValue === "photo" ? event.target.files[0] : event.target.value;
        if (targetValue === "photo"){
            formData.set(targetValue, value);
        } else {
            formData.set(targetValue, value);
        }
        setValues({...values, [targetValue]: value});
    }

    const submitProduct = (event) => {
        event.preventDefault();
        setValues({...values, error: ""});
        log.debug(formData);
        axios({
            method: 'POST',
            url: `/api/product/create/${user._id}`,
            headers: {
                Accept: "application/json",
                "Content-Type": "multipart/form-data",
                Authorization: `Bearer ${token}`
            },
            data: formData
        }).then((response) => {
            log.debug("Created a new product:", response.data);
            setValues({
                ...values,
                name: "",
                description: "",
                photo: "",
                price: "",
                quantity: "",
                success: true,
                createdProduct: response.data.name});
        }).catch((error) => {
            log.debug("New Product could not be created:", error.response.data.error);
            setValues({...values, error: error.response.data.error, success: false})
        })
    }

    const showError = () => (
        <div className="alert alert-danger" role="alert" style={{display: error ? '' : "none"}}>
            {error}!
        </div>
    );

    const showSuccess = () => (
        <div className="alert alert-success" role="alert" style={{display: success ? '' : "none"}}>
            Product was successfully created.
        </div>
    );

    const newProductForm = () => (
        <form onSubmit={submitProduct} className="create-product-form">
            <h4>Post Photo</h4>
            <div className="form-group">
                <label className="btn btn-secondary create-product-photo">
                    <input
                        onChange={handleChange("photo")} type="file" className="form-control "
                    />
                </label>
            </div>
            <div className="form-group">
                <label className="text-muted">Product Name</label>
                <input onChange={handleChange("name")} type="text" className="form-control" value={name} required/>
            </div>
            <div className="form-group">
                <label className="text-muted">Description</label>
                <input onChange={handleChange("description")} type="text" className="form-control" value={description} required/>
            </div>
            <div className="form-group">
                <label className="text-muted">Price</label>
                <input onChange={handleChange("price")} type="number" className="form-control" value={price} required/>
            </div>
            <div className="form-group">
                <label className="text-muted">Category</label>
                <select onChange={handleChange('category')} className="form-control">
                    <option>Please select</option>
                    {categories &&
                    categories.map((c, i) => (
                        <option key={i} value={c.the_id}>
                            {c._id}
                        </option>
                    ))}
                </select>
            </div>
            <div className="form-group">
                <label className="text-muted">Quantity</label>
                <input onChange={handleChange("quantity")} type="number" className="form-control" value={quantity} required/>
            </div>
            <button type="submit" className="btn btn-primary">Create Product</button>
        </form>
    )

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

    return (
        <div>
            <Layout
                title="Create new Product"
                description="Create as many new products as needed."
                className="container col-md-8 offset-md-2">
                {showError()}
                {showSuccess()}
                {newProductForm()}
            </Layout>
        </div>
    )
}

export default CreateProduct;
