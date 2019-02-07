import React, { Component } from "react";
import { hot } from "react-hot-loader";
import './Header.css';
import { Container } from 'react-bootstrap';

class Header extends Component {

    render() {
        return (
          <div className="Header">
            <Container fluid="true">
                <h1 className="text-center">Do It</h1>
            </Container>
          </div>
        );
    }
}

export default hot(module)(Header);