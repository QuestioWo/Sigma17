/*
  Copyright Jim Carty © 2020

  This file is subject to the terms and conditions defined in file 'LICENSE.txt', which is part of this source code package.
*/

import React from 'react';

import './HomeView.css';

import { Link } from 'react-router-dom';
import { Col, Row } from 'react-bootstrap';

import NavBar from './NavBar';

export default class HomeView extends React.Component {
  constructor( props, context ) {
    super( props );

    this.state = {};
  }

  componentDidMount() {
    if ( this.props.location.state ) {
      this.setState( this.props.location.state );
    } else if ( this.props.code !== undefined ) {
      this.setState( this.props );
    }
  }

  render() {
    return(
      <React.Fragment>
        <NavBar state={this.state}/> 
        <div className="mainbody">
          <Row>
            <Col>
              <h1>Sigma17 home page</h1>
            </Col>
          </Row>
          <Row>
            <Col>
              Sigma16 is a computer architecture designed for research and teaching in computer systems. This application provides a complete environment for experimenting with the architecture.
            </Col>
          </Row>
          <Row>
            <Col>
              Currently, this emulator and IDE runs <strong>fully functional</strong> on <strong>Google Chrome</strong> and <strong>Safari</strong>. Minor features - limited to double-clicking to resize outputs - are unavailable on <strong>Firefox</strong> and <strong>Edge</strong>, however the core of the website - breakpoints, emulation, editing and running - are unaffected and the website will still look and operate correctly
            </Col>
          </Row>
          <Row>
            <Col>
              When using the emulator, <strong>do not</strong> navigate the pages with the browser's built-in forward and backwards buttons as <strong>code will not save.</strong> Navigate using <strong>only</strong> the nav bar at the top of the screen
            </Col>
          </Row>
          <Row>
            <Col>
              <div className="click-editor">
                <Link to={{
                  pathname : "/editor",
                  state : this.state
                  }}>
                  Click Here To Run IDE
                </Link>
              </div>
            </Col>
          </Row>
          <Row>
            <Col>
              This web-based IDE is not to be used in complete replacement the original written by John O'Donnel as it has properties of it which could mean that programs written using this emulator <strong>will not work</strong> with the original and could lead to repercussions because of it
            </Col>
          </Row>
          <Row>
            <Col>
              <div className="click-editor">
                <a href="https://github.com/QuestioWo/Sigma17" target='_blank' rel='noopener noreferrer'>
                  View Source Directory on GitHub
                </a>
              </div>
            </Col>
          </Row>
        </div>
      </React.Fragment>
    );
  }
}