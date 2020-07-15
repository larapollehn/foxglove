import React, {useState} from "react";
import {Link} from "react-router-dom";
import Layout from "../base/Layout";
import log from "../utils/Logger";
import axios from "axios";

/**
 * https://app.swaggerhub.com/apis/larapollehn/buchling/1.0.0#/auth/post_signup
 */
const Registration = () => {
    const [values, setValues] = useState({
        name: "",
        email: "",
        password: "",
        error: "",
        success: false
    });

    const {name, email, password, error, success} = values;

    // the following is the arrow version of a higher order function
    const handleChange = targetValue => event => {
        setValues({...values, error: false, [targetValue]: event.target.value})
    };

    // send User registration data to backend to register new user account
    const submitUser = (event) => {
        event.preventDefault();
        log.debug("User wants to register new account.", name, email)
        axios({
            method: "POST",
            url: "/api/signup",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json"
            },
            data: {
                name: name,
                email: email,
                password: password
            }
        }).then((response) => {
            log.debug("User registration successful.", response.data);
            setValues({...values, name: "", email: "", password: "", error: "", success: true})
        }).catch((error) => {
            log.debug("Failed: User registration.", error.response.data);
            setValues({...values, error: error.response.data, success: false});
        })
    };

    const showError = () => (
        <div className="alert alert-danger" role="alert" style={{display: error ? '' : "none"}}>
            {error}!
        </div>
    );

    const showSuccess = () => (
        <div className="alert alert-success" role="alert" style={{display: success ? '' : "none"}}>
            User account was successfully created. You can <Link to="/singin">Login</Link> now.
        </div>
    );

    const registrationForm = () => (
        <form>
            <div className="form-group">
                <label className="text-muted">Name</label>
                <input onChange={handleChange("name")} type="text" className="form-control" value={name}/>
            </div>
            <div className="form-group">
                <label className="text-muted">Email</label>
                <input onChange={handleChange("email")}  type="email" className="form-control" value={email}/>
            </div>
            <div className="form-group">
                <label className="text-muted">Password</label>
                <input onChange={handleChange("password")}  type="password" className="form-control" value={password}/>
            </div>
            <button onClick={submitUser} className="btn btn-primary">Register</button>
        </form>
    );

    return (
        <div>
            <Layout
                title="Registration"
                description="To start going on book adventures create a user account"
                className="container col-md-8 offset-md-2">
                {showSuccess()}
                {showError()}
                {registrationForm()}
            </Layout>
        </div>
    )
};

export default Registration;
