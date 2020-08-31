/*
  Copyright Jim Carty © 2020

  This file is subject to the terms and conditions defined in file 'LICENSE.txt', which is part of this source code package.
*/

import React from 'react';

import { NavLink } from 'react-router-dom';
import { Nav } from 'react-bootstrap';

export default class NavBar extends React.Component {
  render() {
    return(
      <Nav fill variant="tabs" defaultActiveKey={this.props.pathname}>
        <Nav.Item>
          <NavLink 
            className='nav-link'
            isActive={(match, location) => {
              return( location.pathname === '/' );
            }}
            activeClassName='nav-link active' 
            to={{pathname : '/'}}>
            Home
          </NavLink>
        </Nav.Item>
        <Nav.Item>
          <NavLink 
            className='nav-link'
            activeClassName='nav-link active' 
            to={{pathname : '/documentation'}}>
            Documentation
          </NavLink>
        </Nav.Item>
        <Nav.Item>
          <NavLink 
            className='nav-link'
            activeClassName='nav-link active' 
            to={{pathname : '/editor'}}>
            Editor
          </NavLink>
        </Nav.Item>
        <Nav.Item>
          <NavLink 
            className='nav-link'
            activeClassName='nav-link active' 
            to={{pathname : '/debug'}}>
            Debug
          </NavLink>
        </Nav.Item>
      </Nav>
    );
  }
}