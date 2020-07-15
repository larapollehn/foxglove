import React from "react";
import {BrowserRouter, Switch, Route} from "react-router-dom";

import Registration from "./Registration";
import Login from "./Login";

const UserRouter = () => {
    return (
        <BrowserRouter>
            <Switch>
                <Route path="/signin" exact component={Login}/>
                <Route path="/signup" exact component={Registration}/>
            </Switch>
        </BrowserRouter>
    )
}

export default UserRouter;
