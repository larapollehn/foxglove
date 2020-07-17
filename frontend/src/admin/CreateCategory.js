import React, {useState} from "react";
import axios from "axios";

import Layout from "../base/Layout";
import localStorageManager from "../utils/LocalStorageManager";
import log from "../utils/Logger";

/**
 * https://app.swaggerhub.com/apis/larapollehn/buchling/1.0.0#/category/post_category_create__userId_
 */
const CreateCategory = () => {
    const [name, setName] = useState("");
    const [error, setError] = useState(false);
    const [success, setSuccess] = useState(false);

    const {user, token} = localStorageManager.getUser();

    const handleChange = (event) => {
        setError(false);
        setName(event.target.value);
    }

    const submitCategory = (event) => {
        event.preventDefault();
        log.debug("Name of new Category", name);
        setError(false);
        setSuccess(false);
        axios({
            method: 'POST',
            url: `/api/category/create/${user._id}`,
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            },
            data: {
                name: name
            }
        }).then((response) => {
            setError(false);
            setSuccess(true);
            log.debug("Created a new category:", response.data);
        }).catch((error) => {
            setError(true);
            setSuccess(false);
            log.debug("New Category could not be created:", error.response.data.error);
        })
    }

    const showError = () => (
        <div className="alert alert-danger" role="alert" style={{display: error ? '' : "none"}}>
            No duplicate categories allowed!
        </div>
    );

    const showSuccess = () => (
        <div className="alert alert-success" role="alert" style={{display: success ? '' : "none"}}>
            Wonderful. The new Category "{name}" was created.
        </div>
    );


    const newCategoryForm = () => (
        <form>
            <div className="form-group">
                <label className="text-muted">Category Name</label>
                <input onChange={handleChange} type="text" className="form-control" value={name} autoFocus required/>
            </div>
            <button onClick={submitCategory} className="btn btn-primary">Create Category</button>
        </form>
    )

    return(
        <div>
            <Layout
                title="Create new Category"
                description="Create as many new categories as needed."
                className="container col-md-8 offset-md-2">
                {showError()}
                {showSuccess()}
                {newCategoryForm()}
            </Layout>
        </div>
    )
}

export default CreateCategory;
