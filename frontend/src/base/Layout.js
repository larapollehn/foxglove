import React from "react";

const Layout = ({title = "Title", description = "Description", className, children}) =>
    (
        <div>
            <div className="jumbotron">
                <h2 className="display-4">{title}</h2>
                <p className="lead">{description}</p>
            </div>
            <div className={className}>{children}</div>
        </div>);

export default Layout;
