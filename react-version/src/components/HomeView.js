import React from 'react';

import './HomeView.css';

import { Col, Row } from 'react-bootstrap';

import NavBar from './NavBar';

export default class DocumentationView extends React.Component {
  constructor( props, context ) {
    super( props );
  }

  render() {
    return(
      <React.Fragment>
        <NavBar currentKey={this.props.location.pathname}/>   
        <div className="mainbody">
          <Row>
            <Col>
              <h1>Sigma16 home page</h1>
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
                <a href='./editor'>
                  Click Here To Run IDE
                </a>
              </div>
            </Col>
          </Row>
        </div>
      </React.Fragment>
    );
  }
}