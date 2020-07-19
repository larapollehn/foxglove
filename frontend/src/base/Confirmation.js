import React from "react";
import Layout from "./Layout";
import {Link} from "react-router-dom";

const Confirmation = () => (
    <Layout
        title="Wohooo"
        description="We received your order."
        className="container"
    >
        <h1>Thanks for the order</h1>
        <Link to={`/shop`}>Shop More</Link>
    </Layout>
)
export default Confirmation;
