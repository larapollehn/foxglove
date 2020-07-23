import React from "react";

import logo from "../knit_logo.jpg";

const Layout = ({title = "Title", description = "Description", className, children}) =>
    (
        <div id={"layout"} className="container">
            <div className={className}>{children}</div>
            <footer className="row page-footer">
                <div className="col-md-3">
                    This is a not a real shop.
                    Do not buy anything from here.
                    It is not real. Nothing will be send to you.
                </div>
                <div className="col-md-3">
                    <ul className="footer-list">
                        <li><a className="footer-list-item" href="/">FAQ</a></li>
                        <li><a className="footer-list-item" href="/">Payment Info</a></li>
                        <li><a className="footer-list-item" href="/">Shipping Info</a></li>
                    </ul>
                </div>
                <div className="col-md-3">
                    <ul className="footer-list">
                        <li><a className="footer-list-item" href="/">Gift Cards</a></li>
                        <li><a className="footer-list-item" href="/">Sale & Discount</a></li>
                        <li><a className="footer-list-item" href="/">Customer Service</a></li>
                    </ul>
                </div>
                <div className="col-md-3">
                    <ul className="footer-list">
                        <li><a className="footer-list-item" href="/">Newsletter</a></li>
                        <li><a className="footer-list-item" href="/">Warranty</a></li>
                        <li><a className="footer-list-item" href="/">Disclaimer</a></li>
                    </ul>
                </div>
            </footer>
        </div>);

export default Layout;
