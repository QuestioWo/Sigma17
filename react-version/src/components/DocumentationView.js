import React from 'react';

import './DocumentationView.css';

import { Col, Row } from 'react-bootstrap';

import NavBar from './NavBar';

export default class DocumentationView extends React.Component {
  constructor( props, context ) {
    super( props );
  }

  componentDidMount() {

  }

  render() {
    return(
      <React.Fragment>
        <NavBar currentKey={this.props.location.pathname}/>   
        <div className="mainbody">
          <Row>
            <Col>
              daj
            </Col>
          </Row>
        </div>
      </React.Fragment>
    );
  }
}