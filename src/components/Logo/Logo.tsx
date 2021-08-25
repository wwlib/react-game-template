import React from 'react';

// import logoImage from './logo.png';
import './Logo.css';

const logo = (props: any) => (
    <div className="Logo" onClick={props.clicked}>
        {/* <img src={logoImage} alt="App Logo" /> */}
        <div className="Title">
            React Game Template
        </div>
    </div>
);

export default logo;
