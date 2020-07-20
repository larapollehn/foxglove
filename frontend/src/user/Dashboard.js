import React from "react";
import {Link} from "react-router-dom";

import Layout from "../base/Layout";
import localStorageManager from "../utils/LocalStorageManager";

const Dashboard = () => {
    const {user: {name, email, role}} = localStorageManager.getUser();

    const userLinks = () => {
        return (
            <div className="card">
                <h4 className="card-header">User Information</h4>
                <ul className="list-group">
                    <li className="list-group-item">
                        <Link className="nav-link" to="/cart">Shopping Cart</Link>
                    </li>
                    <li className="list-group-item">
                        <Link className="nav-link" to="/profile/update">Profile Settings</Link>
                    </li>
                </ul>
            </div>
        )
    }

    const userInformation = () => {
        return (
            <div className="card mb-5">
                <h3 className="card-header">User Information</h3>
                <ul className="list-group">
                    <li className="list-group-item">{name}</li>
                    <li className="list-group-item">{email}</li>
                    <li className="list-group-item">{role === 1 ? "Admin" : "Shopper"}</li>
                </ul>
            </div>
        )
    }
    return(
        <Layout title="Dashboard" description={`Hello ${name}! Glad you are back.`} className="container">
            <div className="row">
                <div className="col-3">
                    {userLinks()}
                </div>
                <div className="col-9">
                    {userInformation()}
                </div>
            </div>
        </Layout>
    )
}

export default Dashboard;
