import React from 'react';

import './ProgramDebugView.css';

import { Col, Row } from 'react-bootstrap';

import NavBar from './NavBar';

export default class ProgramDebugView extends React.Component {
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
              Empty for now
            </Col>
          </Row>
        </div>
      </React.Fragment>
    );
  }
}