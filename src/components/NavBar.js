/*
  Copyright Jim Carty © 2020

  This file is subject to the terms and conditions defined in file 'LICENSE.txt', which is part of this source code package.
*/

import React from 'react';

import { NavLink } from 'react-router-dom';
import { Nav } from 'react-bootstrap';

export default class NavBar extends React.Component {
  constructor ( props ) {
    super( props )

    this.props = props;
  }

  render() {
    return(
      <Nav fill variant="tabs">
        <Nav.Item>
          <NavLink 
            className="nav-link" 
            to={{
              pathname : "/",
              state : this.props.state
              }}>
              Home
            </NavLink>
        </Nav.Item>
        <Nav.Item>
          <NavLink 
            className="nav-link" 
            activeClassName="nav-link active" 
            to={{
              pathname : "/documentation",
              state : this.props.state
              }}>
              Documentation
          </NavLink>
        </Nav.Item>
        <Nav.Item>
          <NavLink 
            className="nav-link" 
            activeClassName="nav-link active" 
            to={{
              pathname : "/editor",
              state : this.props.state
              }}>
              Editor
          </NavLink>
        </Nav.Item>
        <Nav.Item>
          <NavLink 
            className="nav-link" 
            activeClassName="nav-link active" 
            to={{
              pathname : "/debug",
              state : this.props.state
              }}>
              Debug
          </NavLink>
        </Nav.Item>
      </Nav>
    );
  }
}