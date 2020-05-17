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
      breakpoints : []
    };
  }

  componentDidMount() {
    if ( this.props.location.state ) {
      this.setState( { code : this.props.location.state.code } );
      this.setState( { breakpoints : this.props.location.state.breakpoints } );
    } else if ( this.props.code !== undefined ) {
      this.setState( { code : this.props.code } );
      this.setState( { breakpoints : this.props.breakpoints } );
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
        </div>
      </React.Fragment>
    );
  }
}