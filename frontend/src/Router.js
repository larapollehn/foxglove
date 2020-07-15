import React from "react";
import {BrowserRouter, Switch, Route} from "react-router-dom";

import Registration from "./user/Registration";
import Login from "./user/Login";
import Home from "./base/Home";
import Navbar from "./base/Navbar";

const Router = () => {
    return (
        <BrowserRouter>
            <Navbar/>
            <Switch>
                <Route path="/" exact component={Home}/>
                <Route path="/signin" exact component={Login}/>
                <Route path="/signup" exact component={Registration}/>
            </Switch>
        </BrowserRouter>
    )
}

export default Router;
