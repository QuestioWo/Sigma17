import React from 'react';

import './DocumentationView.css';

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
      this.setState( { 
        code : this.props.location.state.code,
        breakpoints : this.props.location.state.breakpoints,
        input : this.props.location.state.input
      } );
    } else if ( this.props.code !== undefined ) {
      this.setState( { 
        code : this.props.code,
        breakpoints : this.props.breakpoints,
        input : this.props.input
      } );
    }
  }

  render() {
    return(
      <React.Fragment>
        <NavBar state={this.state}/>
        <div className="mainbody">
          <Row>
            <Col>
              Empty for now
            </Col>
          </Row>
        </div>
      </React.Fragment>
    );
  }
}