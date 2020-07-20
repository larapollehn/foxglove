import React from "react";

import logo from "../knit_logo.jpg";

const Layout = ({title = "Title", description = "Description", className, children}) =>
    (
        <div id={"layout"}>
            <div className="jumbotron">
                <img className="jumbo-logo" src={logo}/>
                <h2 className="display-4">{title}</h2>
                <p className="lead">{description}</p>
            </div>
            <div className={className}>{children}</div>
        </div>);

export default Layout;
