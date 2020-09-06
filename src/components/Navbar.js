import React from 'react';
import { Link } from 'react-router-dom';
//import { connect } from 'react-redux';

const Navbar = () => {
    return (
        <nav className="navbar bg-danger">
            <h1>
                <i className="fas fa-viruses"></i>
                COVID-19 Tracker
            </h1>
        </nav>
    );
};

export default Navbar;
