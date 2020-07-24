import React, {useEffect, useState} from "react";
import axios from "axios";

import log from "../utils/Logger";
import localStorageManager from "../utils/LocalStorageManager";
import knitlogo from "../knit_logo.jpg";
import fox_logo from "../base/fox.png";
import {Nav, Navbar} from "react-bootstrap";
import {withRouter} from "react-router-dom";

const isActive = (history, path) => {
     if (history.location.pathname === path) {
        return {color: "#e4932c"};
    } else {
        return {color: "#5a5855"};
    }
}

/**
 * https://app.swaggerhub.com/apis/larapollehn/buchling/1.0.0#/auth/get_signout
 */
const logout = () => {
    localStorageManager.removeUser();
    localStorageManager.removeCart();
    axios({
        method: 'GET',
        url: "api/signout"
    }).then((response) => {
        log.debug("User signed out, cookie was cleared.", response.data);
    }).catch((error) => {
        log.debug("User could not be signed out, cookie was not deleted", error.response.message);
    })
}

/**
 * Navigation Menu using react-router
 * @param props comes from react-router,
 * props attribute history can be directly accessed trough destructuring
 */
const PageNavMenu = ({history}) => {
    const [totalItems, setTotalItems] = useState(0);

    const getCartItemCount = () => {
        if (localStorageManager.getCart()) {
            const itemCount = localStorageManager.getCart().length;
            log.debug("The total item count is:", itemCount);
            setTotalItems(itemCount);
        }
    }

    useEffect(() => {
        getCartItemCount();
    }, []);

    return (
        <div className="container">
            <Navbar expand="lg">
                <Navbar.Brand href="/" className="site-brand-name"><img alt="fox" className="nav-logo-fox"
                                            src={fox_logo}/> Foxglove</Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav"/>
                <Navbar.Collapse id="basic-navbar-nav">
                    {/*checks if user is authenticated/logged in based on the existence of the jwt token
                        if user is authenticated only show specific nav options*/}
                    {localStorageManager.getUser() && (
                        <Nav className="ml-auto">
                            <Nav.Link style={isActive(history, "/")} href="/">Home</Nav.Link>
                            <Nav.Link style={isActive(history, "/shop")} href="/shop">Shop</Nav.Link>
                            {localStorageManager.getUser() && localStorageManager.getUser().user.role === 0 && (
                                <Nav.Link style={isActive(history, "/user/dashboard")}
                                          href="/user/dashboard">Dashboard</Nav.Link>
                            )}
                            {localStorageManager.getUser() && localStorageManager.getUser().user.role === 1 && (
                                <Nav.Link style={isActive(history, "/admin/dashboard")}
                                          href="/admin/dashboard">Dashboard</Nav.Link>
                            )}
                            <Nav.Link style={isActive(history, "/cart")} href="/cart">Cart <sup><small
                                className="badge badge-pill badge-primary" id="cart-total-items-badge">{totalItems}</small></sup></Nav.Link>
                            <Nav.Link href="/" onClick={logout}>Logout</Nav.Link>
                        </Nav>
                    )}

                    {/*checks if user is authenticated/logged in based on the existence of the jwt token
                        if user is authenticated only show specific nav options */}
                    {!localStorageManager.getUser() && (
                        <Nav className="ml-auto">
                            <Nav.Link style={isActive(history, "/")} href="/">Home</Nav.Link>
                            <Nav.Link style={isActive(history, "/shop")} href="/shop">Shop</Nav.Link>
                            <Nav.Link style={isActive(history, "/signin")} href="/signin">Login</Nav.Link>
                            <Nav.Link style={isActive(history, "/signup")} href="/signup">Registration</Nav.Link>
                        </Nav>
                    )}
                </Navbar.Collapse>
            </Navbar>
        </div>
    )
}

export default withRouter(PageNavMenu);
