import React, {useState} from "react";
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

    const {name, email, password} = values;

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
        }).catch((error) => {
            log.debug("Failed: User registration.", error.response.data);
        })
    }

    const registrationForm = () => (
        <form>
            <div className="form-group">
                <label className="text-muted">Name</label>
                <input onChange={handleChange("name")} type="text" className="form-control"/>
            </div>
            <div className="form-group">
                <label className="text-muted">Email</label>
                <input onChange={handleChange("email")}  type="email" className="form-control"/>
            </div>
            <div className="form-group">
                <label className="text-muted">Password</label>
                <input onChange={handleChange("password")}  type="password" className="form-control"/>
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
                {registrationForm()}
                {JSON.stringify(values)}
            </Layout>
        </div>
    )
};

export default Registration;
