import React, {useState} from "react";
import Layout from "../base/Layout";

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
    })

    // the following is the arrow version of a higher order function
    const handleChange = targetValue => event => {
        setValues({...values, error: false, [targetValue]: event.target.value})
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
                {JSON.stringify(values)}
            </Layout>
        </div>
    )
};

export default Registration;
