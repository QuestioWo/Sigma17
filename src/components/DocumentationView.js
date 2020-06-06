import React from 'react';

import './DocumentationView.css';

import { Button, Col, Collapse, Row } from 'react-bootstrap';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';

import NavBar from './NavBar';

export default class DocumentationView extends React.Component {
  // CLASS METHODS
    constructor( props, context ) {
      super( props );

      this.state = {
        code : '',
        breakpoints : [],
        input : '',

        displayToknowbeforecoding : true, // To know before coding
          displayOverview : true, // Overview

        displayInstructionset : true, // Instruction set
          displayRRR : true, // RRR
            displayAdd : true, // Add
            displaySub : true, // Sub

        displayUsingtheIDE : true, // Using the IDE
      };

      this.state.setParentState = this.setParentState.bind( this );
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

  // COLLAPSE METHODS
    setParentState = e => {
      this.setState( e );
    }

  // RENDER
    render() {
      return(
        <React.Fragment>
          <NavBar state={this.state}/>
          <div className="mainbody">
            <Row>
              <Col>
                Original documentation of the Sigma16 language can be found{`\xa0`/**&nbsp*/}
                <a 
                  href='https://jtod.github.io/home/Sigma16/releases/3.1.3/docs/html/userguide/userguide.html' 
                  target='_blank' 
                  rel='noopener noreferrer'>
                    here
                  </a>
                . All of this emulator and command set works the same, except anything to do with the linker, e.g modules.
                <InfoArea state={this.state} title={'To know before coding'} depth={1}>
                  <InfoArea state={this.state} title={'Overview'} depth={3}>
                    overview
                  </InfoArea>
                </InfoArea>
                <InfoArea state={this.state} title={'Instruction set'} depth={1}>
                  <InfoArea state={this.state} title={'RRR'} depth={2}>
                    <InfoArea state={this.state} title={'Add'} depth={3}>
                      <React.Fragment>
                        Use :<br/>
                        <code className='code-snippet'>add Rd,Ra,Rb</code><br/>
                        Effects :<br/>
                        <ul>
                          <li>calculates Ra + Rb</li>
                          <li>stores Ra + Rb into Rd</li>
                        </ul>
                      </React.Fragment>
                    </InfoArea>
                    <InfoArea state={this.state} title={'Sub'} depth={3}>
                      <React.Fragment>
                        Use :<br/>
                        <code className='code-snippet'>sub Rd,Ra,Rb</code><br/>
                        Effects :<br/>
                        <ul>
                          <li>calculates Ra - Rb</li>
                          <li>stores Ra - Rb into Rd</li>
                        </ul>
                      </React.Fragment>
                    </InfoArea>
                  </InfoArea>
                </InfoArea>
                <InfoArea state={this.state} title={'Using the IDE'} depth={1}>
                  cry
                </InfoArea>
              </Col>
            </Row>
          </div>
        </React.Fragment>
      );
    }
}

//
class InfoArea extends React.Component {
  constructor( props, context ) {
    super( props, context );

    this.state = {
      display : 'display' + props.title.replace( /\s+/g, '' )
    };
  }

  toggleCollapse = e => {
    var passed = {};
    passed[this.state.display] = !( this.props.state[this.state.display] );
    this.props.state.setParentState( passed );
  }

  render() {
    return (
      <div className={ 'info-field' + this.props.depth }>
        <div className={ 'info-title' + this.props.depth }>
          <Row>
            <Col>
              <h4>
                {this.props.title}
              </h4>
            </Col>
            <Col>
              <Button size='sm' variant='outline-secondary' style={{float : 'right'}} onClick={this.toggleCollapse}>
                { this.props.state[this.state.display] ?
                  <FaChevronUp/>
                  :
                  <FaChevronDown/>
                }
              </Button>
            </Col>
          </Row>
        </div>
        <Collapse in={this.props.state[this.state.display]}>
          <div className={ 'info-body' + this.props.depth }>
            {this.props.children}
          </div>
        </Collapse>
      </div>
    );
  }
}