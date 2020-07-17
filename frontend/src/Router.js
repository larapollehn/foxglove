import React from "react";
import {BrowserRouter, Switch, Route, Redirect} from "react-router-dom";

import Registration from "./user/Registration";
import Login from "./user/Login";
import Home from "./base/Home";
import Navbar from "./base/Navbar";
import Dashboard from "./user/Dashboard";
import localStorageManager from "./utils/LocalStorageManager";
import AdminDashboard from "./user/AdminDashboard";
import CreateCategory from "./admin/CreateCategory";
import CreateProduct from "./admin/CreateProduct";

const Router = () => {
    return (
        <BrowserRouter>
            <Navbar/>
            <Switch>
                <Route path="/" exact component={Home}/>
                <Route path="/signin" exact component={Login}/>
                <Route path="/signup" exact component={Registration}/>
                <ProtectedRoute path="/user/dashboard" exact component={Dashboard}/>
                <AdminRoute path="/admin/dashboard" exact component={AdminDashboard}/>
                <AdminRoute path="/create/category" exact component={CreateCategory}/>
                <AdminRoute path="/create/product" exact component={CreateProduct}/>
            </Switch>
        </BrowserRouter>
    )
}

/**
 * Route that only renders given Component if user is logged in
 * redirects to login page if not
 */
const ProtectedRoute = ({component: Component, ...rest}) => (
    <Route
        {...rest}
        render={props =>
            localStorageManager.getUser() ? (
                <Component {...props} />
            ) : (
                <Redirect to={{pathname: "/signin", state: {from: props.location}}}/>
            )
        }
    />
)

/**
 * Route that only renders given Component if user is logged in
 * redirects to login page if not
 */
const AdminRoute = ({component: Component, ...rest}) => (
    <Route
        {...rest}
        render={props =>
            localStorageManager.getUser() && localStorageManager.getUser().user.role === 1 ? (
                <Component {...props} />
            ) : (
                <Redirect to={{pathname: "/signin", state: {from: props.location}}}/>
            )
        }
    />
)


export default Router;
