import React from 'react';

import './HomeView.css';

import { Link } from 'react-router-dom';
import { Col, Row } from 'react-bootstrap';

import NavBar from './NavBar';

export default class DocumentationView extends React.Component {
  constructor( props, context ) {
    super( props );

    this.state = {
      code : '',
      breakpoints : [],
      input : ''
    };
  }

  componentDidMount() {
    if ( this.props.location.state ) {
      this.setState( { code : this.props.location.state.code } );
      this.setState( { breakpoints : this.props.location.state.breakpoints } );
      this.setState( { input : this.props.location.state.input } );
    } else if ( this.props.code !== undefined ) {
      this.setState( { code : this.props.code } );
      this.setState( { breakpoints : this.props.breakpoints } );
      this.setState( { input : this.props.input } );
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
              This web based IDE is not to be used in complete replacement the orignal written by John O'Donnel as it has properties of it which could mean that programs written using this emulator <strong>will not work</strong> with the orignal and could lead to repurcussions because of it.
            </Col>
          </Row>
        </div>
      </React.Fragment>
    );
  }
}