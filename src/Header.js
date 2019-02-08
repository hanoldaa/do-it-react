import React from "react";
import { hot } from "react-hot-loader";
import './Header.css';
import { Navbar, Nav } from 'react-bootstrap';
import { NavLink } from 'react-router-dom';

function Header() {
    return (
        <div className="Header">
            <Navbar>
                <Navbar.Brand className="header-brand"><h1>Do It</h1></Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav variant="pills" className="justify-content-end">
                        <Nav.Item>
                            <NavLink to='/'>Home</NavLink>
                        </Nav.Item>
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
export default hot(module)(Header);