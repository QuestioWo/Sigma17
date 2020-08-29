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
// CLASS METHODS
  constructor( props, context ) {
    super( props );

    this.state = {};
  }

  componentDidMount() {
    if ( sessionStorage.getItem( 'code' ) !== null && sessionStorage.getItem( 'input' ) !== null && sessionStorage.getItem( 'breakpoints' ) !== null ) {
      this.setState( {
        code : sessionStorage.getItem( 'code' ),
        input : sessionStorage.getItem( 'input' ),
        breakpoints : sessionStorage.getItem( 'breakpoints' ).split( ',' ).map(
          breakpointString => {
            return( Number( breakpointString ) );
          }
        )
      } );
    } else if ( this.props.code !== undefined ) {
      this.setState( this.props );
    }
  }

  saveStorage = e => {
    sessionStorage.setItem( 'code', this.state.code );
    sessionStorage.setItem( 'input', this.state.input );
    sessionStorage.setItem( 'breakpoints', this.state.breakpoints );
  }

// DARK MODE
  toggleDarkMode = e => {
    localStorage.setItem( 'theme', localStorage.getItem( 'theme' ) === 'light' ? 'dark' : 'light' );
    
    document.body.classList.replace( localStorage.getItem( 'theme' ) === 'light' ? 'dark' : 'light', localStorage.getItem( 'theme' ) );
  }

// RENDER
  render() {
    if ( localStorage.getItem( 'theme' ) !== null ) {
      document.body.classList.replace( localStorage.getItem( 'theme' ) === 'light' ? 'dark' : 'light', localStorage.getItem( 'theme' ) );
    } else {
      document.body.classList.add( 'light' );

      localStorage.setItem( 'theme', 'light' );
    }

    return(
      <React.Fragment>
        <NavBar onClick={this.saveStorage} pathname={this.props.location.pathname} />
        <div className="mainbody">
          <Row>
            <Col>
              <h1>Sigma17 home page</h1>
            </Col>
            <Col>
              <div className='dark-mode-container' >
                <label className="switch">
                  <input 
                    type="checkbox" 
                    onClick={this.toggleDarkMode}
                    defaultChecked={localStorage.getItem( 'theme' ) !== null ? localStorage.getItem( 'theme' ) === 'dark' : false }
                  />
                  <span className="slider round"></span>
                </label>
                <div style={{display : 'inline-block', marginLeft : '10px'}}>
                  <strong>Dark Mode</strong>
                </div>
              </div>
            </Col>
          </Row>
          <Row>
            <Col>
              Sigma16 is a computer architecture designed for research and teaching in computer systems. This application provides a complete environment for experimenting with the architecture.
            </Col>
          </Row>
          <Row>
            <Col>
              Currently, this emulator and IDE runs <strong>fully functional</strong> on, but not limited to, <strong>Google Chrome</strong>, <strong>Safari</strong>, and, <strong>Firefox</strong>
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