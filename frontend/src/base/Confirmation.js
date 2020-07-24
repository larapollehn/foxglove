import React from "react";
import Layout from "./Layout";
import {Link} from "react-router-dom";

const Confirmation = () => (
    <Layout
        title="Wohooo"
        description="We received your order."
        className="container"
    >
        <div id="confirmation-page">
            <h1>Thanks for the order</h1>
            <Link className="dashboard-link" to={`/shop`}>Shop More</Link>
        </div>

    </Layout>
)
export default Confirmation;
