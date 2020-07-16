import React, {useState} from "react";
import Layout from "../base/Layout";
import axios from "axios";
import {Redirect} from "react-router-dom";

import log from "../utils/Logger";
import localStorageManager from "../utils/LocalStorageManager";


/**
 * https://app.swaggerhub.com/apis/larapollehn/buchling/1.0.0#/auth/post_signin
 */
const Login = () => {
    const [values, setValues] = useState({
        email: "",
        password: "",
        error: "",
        loading: false,
        redirectTo: false
    });

    const {email, password, error, loading, redirectTo} = values;

    // the following is the arrow version of a higher order function
    const handleChange = targetValue => event => {
        setValues({...values, error: false, [targetValue]: event.target.value})
    };

    // send User registration data to backend to register new user account
    const submitUser = (event) => {
        event.preventDefault();
        log.debug("User wants to login.", email)
        axios({
            method: "POST",
            url: "/api/signin",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json"
            },
            data: {
                email: email,
                password: password
            }
        }).then((response) => {
            log.debug("User login successful.", response.data);
            localStorageManager.saveUser(response.data);
            setValues({...values, redirectTo: true})
        }).catch((error) => {
            log.debug("Failed: User login.", error.response.data.error);
            setValues({...values, error: error.response.data.error, loading: false});
        })
    };

    const showError = () => (
        <div className="alert alert-danger" role="alert" style={{display: error ? '' : "none"}}>
            {error}!
        </div>
    );

    const showLoading = () => (
        <div className="alert alert-info" role="alert" style={{display: loading ? '' : "none"}}>
            Please wait a second. Page is loading...
        </div>
    );

    const redirectUser = () => {
        if(redirectTo) {
            return <Redirect to="/"/>
        }
    };

    const loginForm = () => (
        <form>
            <div className="form-group">
                <label className="text-muted">Email</label>
                <input onChange={handleChange("email")} type="email" className="form-control" value={email}/>
            </div>
            <div className="form-group">
                <label className="text-muted">Password</label>
                <input onChange={handleChange("password")} type="password" className="form-control" value={password}/>
            </div>
            <button onClick={submitUser} className="btn btn-primary">Register</button>
        </form>
    );

    return (
        <div>
            <Layout
                title="Login"
                description="Login to your user account please."
                className="container col-md-8 offset-md-2">
                {showError()}
                {showLoading()}
                {loginForm()}
                {redirectUser()}
            </Layout>
        </div>
    )
};
export default Login;
