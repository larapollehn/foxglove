import React from "react";
import {Link, withRouter} from "react-router-dom";
import axios from "axios";

import log from "../utils/Logger";
import localStorageManager from "../utils/LocalStorageManager";

const isActive = (history, path) => {
    if(history.location.pathname === path){
        return {color: "#0073ff"};
    } else {
        return {color: "#5a5855"};
    }
}

/**
 * https://app.swaggerhub.com/apis/larapollehn/buchling/1.0.0#/auth/get_signout
 */
const logout = () => {
    localStorageManager.removeUser();
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
const Navbar = ({history}) => {
    return (
        <div>
            <nav className="navbar navbar-expand-lg navbar-light bg-light">
                <a className="navbar-brand" href="/">Welcome to Buchling</a>
                <button className="navbar-toggler" type="button" data-toggle="collapse"
                        data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent"
                        aria-expanded="false"
                        aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>

                {/*checks if user is authenticated/logged in based on the existence of the jwt token
                if user is authenticated only show specific nav options*/}
                {localStorageManager.getUser() && (
                    <div className="collapse navbar-collapse" id="navbarSupportedContent">
                        <ul className="navbar-nav ml-auto">
                            <li className="nav-item">
                                <Link className="nav-link" style={isActive(history, "/")} to="/">Home</Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link" style={isActive(history, "/dashboard")} to="/dashboard">Dashboard</Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link" to="/" onClick={logout}>Logout</Link>
                            </li>
                        </ul>
                    </div>
                )}

                {/*checks if user is authenticated/logged in based on the existence of the jwt token
                if user is authenticated only show specific nav options */}
                {!localStorageManager.getUser() && (
                    <div className="collapse navbar-collapse" id="navbarSupportedContent">
                        <ul className="navbar-nav ml-auto">
                            <li className="nav-item">
                                <Link className="nav-link" style={isActive(history, "/")} to="/">Home</Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link" style={isActive(history, "/signin")} to="/signin">Login</Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link" style={isActive(history, "/signup")} to="/signup">Registration</Link>
                            </li>
                        </ul>
                    </div>
                )}

            </nav>
        </div>
    )
}

export default withRouter(Navbar);
