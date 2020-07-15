import React from "react";
import Layout from "../base/Layout";

/**
 * https://app.swaggerhub.com/apis/larapollehn/buchling/1.0.0#/auth/post_signup
 */
const Registration = () => {

    const registrationForm = () => (
        <form>
            <div className="form-group">
                <label className="text-muted">Name</label>
                <input type="text" className="form-control"/>
            </div>
            <div className="form-group">
                <label className="text-muted">Email</label>
                <input type="email" className="form-control"/>
            </div>
            <div className="form-group">
                <label className="text-muted">Password</label>
                <input type="password" className="form-control"/>
            </div>
            <button className="btn btn-primary">Register</button>
        </form>
    );

    return (
        <div>
            <Layout
                title="Registration"
                description="To start going on book adventures create a user account"
                className="container col-md-8 offset-md-2">
                {registrationForm()}
            </Layout>
        </div>
    )
};

export default Registration;
