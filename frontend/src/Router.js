import React from "react";
import {BrowserRouter, Switch, Route, Redirect} from "react-router-dom";

import Registration from "./user/Registration";
import Login from "./user/Login";
import Home from "./base/Home";
import PageNavMenu from "./base/PageNavMenu";
import Dashboard from "./user/Dashboard";
import localStorageManager from "./utils/LocalStorageManager";
import AdminDashboard from "./user/AdminDashboard";
import CreateCategory from "./admin/CreateCategory";
import CreateProduct from "./admin/CreateProduct";
import Shop from "./base/Shop";
import Product from "./base/Product";
import Cart from "./base/Cart";
import Confirmation from "./base/Confirmation";

const Router = () => {
    return (
        <BrowserRouter>
            <PageNavMenu/>
            <Switch>
                <Route path="/" exact component={Home}/>
                <Route path="/signin" exact component={Login}/>
                <Route path="/signup" exact component={Registration}/>
                <Route path="/shop" exact component={Shop}/>
                <Route path="/product/:productId" exact component={Product}/>
                <ProtectedRoute path="/user/dashboard" exact component={Dashboard}/>
                <ProtectedRoute path="/confirmation" exact component={Confirmation}/>
                <ProtectedRoute path="/cart" exact component={Cart}/>
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
