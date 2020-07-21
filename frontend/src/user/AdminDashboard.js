import React from "react";
import localStorageManager from "../utils/LocalStorageManager";
import {Link} from "react-router-dom";
import Layout from "../base/Layout";

const AdminDashboard = () => {
    const {user: {name, email, role}} = localStorageManager.getUser();

    const adminLinks = () => {
        return (
            <div className="card">
                <h4 className="card-header">User Information</h4>
                <ul className="list-group">
                    <li className="list-group-item">
                        <Link className="nav-link dashboard-link" to="/create/category">Create Category</Link>
                    </li>
                    <li className="list-group-item">
                        <Link className="nav-link dashboard-link" to="/create/product">Create Product</Link>
                    </li>
                </ul>
            </div>
        )
    }

    const adminInformation = () => {
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
        <Layout title="Dashboard" description={`Hello ${name}!`} className="container">
            <div className="row">
                <div className="col-3">
                    {adminLinks()}
                </div>
                <div className="col-9">
                    {adminInformation()}
                </div>
            </div>
        </Layout>
    )
}

export default AdminDashboard;
