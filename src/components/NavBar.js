/*
  Copyright Jim Carty © 2020

  This file is subject to the terms and conditions defined in file 'LICENSE.txt', which is part of this source code package.
*/

import React from 'react';

import { Nav } from 'react-bootstrap';

export default class NavBar extends React.Component {
  constructor ( props ) {
    super( props )

    this.props = props;
  }

  render() {
    return(
      <Nav onClick={this.props.onClick} fill variant="tabs" defaultActiveKey={this.props.pathname}>
        <Nav.Item>
          <Nav.Link href="/">
            Home
          </Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link href="/#/documentation">
            Documentation
          </Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link href="/#/editor">
            Editor
          </Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link href="/#/debug">
            Debug
          </Nav.Link>
        </Nav.Item>
      </Nav>
    );
  }
}