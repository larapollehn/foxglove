import React from "react";
import {Link, withRouter} from "react-router-dom";

const isActive = (history, path) => {
    if(history.location.pathname === path){
        return {color: "#0073ff"}
    } else {
        return {color: "#5a5855"}
    }
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
                <div className="collapse navbar-collapse" id="navbarSupportedContent">
                    <ul className="navbar-nav ml-auto">
                        <li className="nav-item active">
                            <Link className="nav-link" style={isActive(history, "/")} to="/">Home</Link>
                        </li>
                        <li className="nav-item active">
                            <Link className="nav-link" style={isActive(history, "/signin")} to="/signin">Login</Link>
                        </li>
                        <li className="nav-item active">
                            <Link className="nav-link" style={isActive(history, "/signup")} to="/signup">Registration</Link>
                        </li>
                    </ul>
                </div>
            </nav>
        </div>
    )
}

export default withRouter(Navbar);
