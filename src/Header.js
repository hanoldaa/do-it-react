import React, { Component } from "react";
import { hot } from "react-hot-loader";
import './Header.css';
import { Navbar, Nav } from 'react-bootstrap';
import { NavLink } from 'react-router-dom';
import { withRouter } from 'react-router-dom';

class Header extends Component {

    constructor(props) {
        super(props);
    }

    homeClicked() {
        this.props.history.push('/');
    }

    render(){
        return (
            <div className="Header">
                <Navbar>
                    <Navbar.Brand className="header-brand" onClick={this.homeClicked.bind(this)}><h1>Do It</h1></Navbar.Brand>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav variant="pills" className="justify-content-end">
                            <Nav.Item>
                                <NavLink to='/newTask'>New Task</NavLink>
                            </Nav.Item>
                            <Nav.Item>
                                <NavLink to='/login' className="disabled">Login</NavLink>
                            </Nav.Item>
                        </Nav>
                    </Navbar.Collapse>
                </Navbar>
            </div>
        );
    }
}
export default hot(module)(withRouter(Header));