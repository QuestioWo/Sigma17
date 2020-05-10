import React from 'react';

import 'codemirror/lib/codemirror.css';
import './ProgramEditorView.css';

import { Alert, Button, ButtonGroup, Col, Modal, OverlayTrigger, Row, Tooltip } from 'react-bootstrap';
import { FaHammer, FaPlay, FaTimes } from 'react-icons/fa';
import CodeMirror from 'react-codemirror';

import * as CompilationUtils from './utils/CompilationUtils';

import NavBar from './NavBar';

require( './utils/mode/sigma16' );

export default class ProgramEditorView extends React.Component {
// CLASS METHODS
  constructor( props, context ) {
    super( props );

    this.state = {
      code : '',
      breakpoints : [],

      lineError : {},

      alertShow : false,
      alertMessage : '',
      alertNature : 'success',

      runModalShow : false,
      runModalRegisters : {},
      runModalMemory : {},

      machineCode : [],
      machineCodeUpdated : false,

      registers : {
        0 : 0,
        1 : 0,
        2 : 0,
        3 : 0,
        4 : 0,
        5 : 0,
        6 : 0,
        7 : 0,
        8 : 0,
        9 : 0,
        10 : 0,
        11 : 0,
        12 : 0,
        13 : 0,
        14 : 0,
        15 : 0
      },
      cpuControl : {
        'pc' : 0,
        'ir' : 0,
        'adr' : 0
      },

      memory : {}
    };
  }

  componentDidMount() {
    this.setState( { code: this.props.code } );
  }

// BREAKPOINTS
  breakpointsColumn( code ) {
    var breakpoints = [];
    var lines = code.split( '\n' );

    if ( document.getElementById( 'code-area' ) ) {
      // deal with code chunk height in this function since only column rendered
      var codeArea = document.getElementById( 'code-area' );
      codeArea.style.height = ( 25 * ( lines.length ) ) + 18 + 'px';

      for ( var i = 0; i < lines.length; i++ ) {
        var yOffset = 25 * ( i + 0.5 );
        var styleTop = yOffset + 3 +'px';

        var id = 'breakpoint ' + ( i + 1 );
        var className = 'breakpoint ' + ( i + 1 );

        if ( this.state.breakpoints.includes( i + 1 ) ) {
          className = className + ' active';
        } if ( Object.keys( this.state.lineError ).includes( String( i + 1 ) ) ) {
          className = className + ' error';

          var error = this.state.lineError[String( i + 1 )];

          breakpoints.push( 
            <OverlayTrigger
              key={className+' tooltip'}
              placement={'right'}
              overlay={
                <Tooltip>
                  {error}
                </Tooltip>
              }>
              <div 
                key={id}
                id={id} 
                className={className} 
                style={{top : styleTop}} 
                onClick={this.breakpointOnClick}/>
            </OverlayTrigger> );
        } else {
          breakpoints.push( 
            <div 
              key={id}
              id={id} 
              className={className} 
              style={{top : styleTop}} 
              onClick={this.breakpointOnClick}/>
          );
        }
      }
      return breakpoints;
    }
  }

  breakpointOnClick = breakpoint => {
    if ( breakpoint.currentTarget.classList.contains( 'active' ) ) {
      breakpoint.currentTarget.classList.remove( 'active' );
    } else {
      breakpoint.currentTarget.classList.add( 'active' );
    }

    var breakpoints = this.state.breakpoints;
    breakpoints.push( Number( breakpoint.currentTarget.id.slice( 'breakpoint '.length, breakpoint.currentTarget.id.length ) ) );
    this.setState( { breakpoints : breakpoints } );
  }

  disableBreakpoints = button => {
    this.setState( { breakpoints : [] } );
  }

// REGISTER/MEMORY METHODS
  controlColumn() {
    var controls = [];
    var controlKeys = Object.keys( this.state.cpuControl );

    for ( var i = 0; i < controlKeys.length; i++ ) {
      controls.push( <div 
                        key={'control ' + controlKeys[i]}
                        id={'control ' + controlKeys[i]}
                        className={'systeminfo-column-elem'}>
                        <Row>
                          <Col>
                            <strong>{controlKeys[i]}</strong>
                          </Col>
                          <Col style={{textAlign:'right'}}>
                              ${CompilationUtils.writeHex( this.state.cpuControl[controlKeys[i]] )}
                          </Col>
                        </Row>
                      </div> );
    }

    return controls;
  }
  //
  registerColumn() {
    var registers = [];

    for ( var i = 0; i < 16; i++ ) {
      registers.push( <div 
                        key={'register ' + i}
                        id={'register ' + i}
                        className={'systeminfo-column-elem'}>
                        <Row>
                          <Col>
                            <strong>{'R'+i}</strong>
                          </Col>
                          <Col style={{textAlign:'right'}}>
                            <OverlayTrigger
                              key={'left'}
                              placement={'left'}
                              overlay={
                                <Tooltip>
                                  { CompilationUtils.readUnsignedHex( this.state.registers[i] )}/{ CompilationUtils.readSignedHex( this.state.registers[i] ) }
                                </Tooltip>
                              }>
                              <span>
                                ${CompilationUtils.writeHex( this.state.registers[i] )}
                              </span>
                            </OverlayTrigger>
                          </Col>
                        </Row>
                      </div> );
    }

    return registers;
  }
  //
  memoryColumn() {
    var memoryValues = [];
    var memoryKeys = Object.keys( this.state.memory ).map( key => Number( key ) );

    for ( var i = 0; i < memoryKeys.length; i++ ) {
      memoryValues.push( <div 
                          key={'memory ' + memoryKeys[i]}
                          id={'memory ' + memoryKeys[i]}
                          className={'systeminfo-column-elem'}>
                          <Row>
                            <Col>
                              <strong>${CompilationUtils.writeHex( memoryKeys[i] )}</strong>
                            </Col>
                            <Col style={{textAlign:'right'}}>
                              <OverlayTrigger
                                key={'left'}
                                placement={'left'}
                                overlay={
                                  <Tooltip>
                                    { CompilationUtils.readUnsignedHex( this.state.memory[memoryKeys[i]] ) }/{ CompilationUtils.readSignedHex( this.state.memory[memoryKeys[i]] ) }
                                  </Tooltip>
                                }>
                                <span>
                                  ${CompilationUtils.writeHex( this.state.memory[memoryKeys[i]] )}
                                </span>
                              </OverlayTrigger>
                            </Col>
                          </Row>
                        </div> );
    }

    return memoryValues;
  }

// ALERT METHODS
  updateAlert( message, nature ) {
    this.setState( { alertMessage : message } );
    this.setState( { alertNature : nature } );
    this.setState( { alertShow : true } );
  }

  closeAlert = alert => {
    this.setState( { alertShow : false } );
  }

// MODAL METHODS
  onModalClose = modal => {
    this.resetCPUandMemory();
    this.setState( { runModalShow : false } );
  }

// CHECKING METHOD
  checkCode( code ) {
    var lines = code.toLowerCase().split( '\n' );
    var check = true;

    var lineErrorCopy = {};

    var currentLine = '0';

    var parsed = '';
    var labels = {};

    var ranSuccessfully = true;

    for ( var i = 0; i < lines.length; i++ ) {
      parsed = CompilationUtils.parseLineForLabels( lines[i] );

      if ( parsed['label'] !== '' ) {
        labels[parsed['label']] = currentLine;
      }

      currentLine = ( parseInt( currentLine, 16 ) + parsed['instructionWords'] ).toString( 16 );
    }

    for ( var it = 0; it < lines.length; it++ ) {
      check = CompilationUtils.checkLine( lines[it], labels );
      if ( check.length ) {
        lineErrorCopy[Number( it + 1 )] = check;
        ranSuccessfully = false;
      }
    }

    this.setState( { lineError : lineErrorCopy } );

    return ranSuccessfully;
  }

// PARSING METHOD
  parseCode = button => {
    var lines = this.state.code.toLowerCase().split( '\n' );
    
    var currentLine = 0;

    var parsed = {};
    var labels = {};

    var machineCode = [];

    var parsedSuccessfully = true;

    if ( this.checkCode( this.state.code ) ) {
      for ( var i = 0; i < lines.length; i++ ) {
        parsed = CompilationUtils.parseLineForLabels( lines[i] );

        if ( parsed['label'] !== '' ) {
          labels[parsed['label']] = currentLine;
        }

        currentLine += parsed['instructionWords'];
      }

      for ( var it = 0; it < lines.length; it++ ) {
        if ( lines[it].trim() !== '' ) {
          parsed = CompilationUtils.parseLineForMachineCode( lines[it], labels );
          machineCode.push( parsed[0] );
          
          // if two word instruction
          if ( parsed[1] && parsed[1] !== -1 ) {
            machineCode.push( parsed[1] );
          }
        }
      }
      this.setState( { machineCode : machineCode } );
      this.setState( { machineCodeUpdated : true } );

      // console.log( machineCode )

      this.updateAlert( 'Built successfully', 'success' );
    } else {
      this.updateAlert( 'Built unsuccesfully, correct syntax errors', 'danger' );
      
      parsedSuccessfully = false;
    }

    return parsedSuccessfully;
  }

// RUNNING METHODS
  resetCPUandMemory() {
    var registersNew = {
      0 : 0,
      1 : 0,
      2 : 0,
      3 : 0,
      4 : 0,
      5 : 0,
      6 : 0,
      7 : 0,
      8 : 0,
      9 : 0,
      10 : 0,
      11 : 0,
      12 : 0,
      13 : 0,
      14 : 0,
      15 : 0
    };

    var cpuControlNew = {
      'pc' : 0,
      'ir' : 0,
      'adr' : 0
    };

    this.setState( { registers : registersNew } );
    this.setState( { cpuControl : cpuControlNew } );
  }

  canRunCode( code ) {
    var error = true;

    if ( this.state.machineCode.length !== 0 ) {
      if ( !this.state.machineCode.includes( 0xd000 ) ) {
        error = 'Cannot run code without a "trap R0,R0,R0" instruction';
      }
    } else {
      // machine language is blank
      error = 'Cannot run no code. Try building then running';
    }
    return error;
  }

  runCode = button => {
    var canRun = this.canRunCode( this.state.code );
    var ran = {
      halted : false
    };

    if ( !canRun.length ) {
      var localControl = this.state.cpuControl;
      var localRegisters = this.state.registers;
      var localMemory = CompilationUtils.setMemory( this.state.machineCode );

      while ( !( ran['halted'] ) ) {
        ran = CompilationUtils.runMemory( localControl, localRegisters, localMemory );

        localControl = ran['control'];
        localRegisters = ran['registers'];
        localMemory = ran['memory'];

        // if ran out of commands
        if ( !( Object.keys( localMemory ).includes( String( localControl['pc'] ) ) ) ) ran['halted'] = true;
      }

      this.setState( { cpuControl : localControl } );
      this.setState( { registers : localRegisters } );
      this.setState( { memory : localMemory } );

      this.setState( { runModalShow : true } );
    } else {
      this.updateAlert( canRun, 'danger' );
    }

    if ( !this.state.machineCodeUpdated ) {
      this.updateAlert( 'Remember to build code after editing before running', 'warning' );
    }
  }

// CODEMIRROR METHODS
  updateCode = newCode => {
    this.checkCode( newCode );

    // updating code based on contents of codemirror
    if ( newCode ) {
      this.setState( { code : newCode } );
    } else {
      this.setState( { code : ' ' } );
    }
    this.setState( { machineCodeUpdated : false  } );
  }

// RENDER
  render() {
    return(
      <React.Fragment>
        <NavBar currentKey={ this.props.location.pathname }/>
        <Modal
          show={this.state.runModalShow}
          onHide={this.onModalClose}
          dialogClassName="runmodal"
          animation={false} >
          <Modal.Header closeButton>
            <Modal.Title>
              Program Register and Memory Values
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Row>
              <Col>
                <h6>
                  CPU
                </h6>
              </Col>
              <Col>
                <h6>
                  Memory
                </h6>
              </Col>
            </Row>
            <Row>
              <Col className='runmodal-left-col'>
                <div id='control-column' className='control-column'>
                  {this.controlColumn()}
                </div>
                <div id='register-column' className='register-column'>
                  {this.registerColumn()}
                </div>
              </Col>
              <Col>
                <div id='memory-column' className='memory-column'>
                  {this.memoryColumn()}
                </div>
              </Col>
            </Row>
            <Row>
              <Col>
                
              </Col>
            </Row>
          </Modal.Body>
        </Modal>
        <div className='buttonstoolbar'>
          <Alert variant={this.state.alertNature} onClose={this.closeAlert} show={this.state.alertShow} dismissible>
            <p className='alertbody'>
              {this.state.alertMessage}
            </p>
          </Alert>
          <Row>
            <Col>
              <OverlayTrigger
                key={'top'}
                placement={'top'}
                overlay={
                  <Tooltip>
                    Build/Run
                  </Tooltip>
                }>
                <ButtonGroup>
                  <Button variant='outline-secondary' size='sm' onClick={this.parseCode}>
                    <FaHammer/>
                  </Button>
                  <Button variant='outline-secondary' size='sm' onClick={this.runCode}>
                    <FaPlay/>
                  </Button>
                </ButtonGroup>
              </OverlayTrigger>
            </Col>
            <Col>
              <OverlayTrigger
                key={'top'}
                placement={'top'}
                overlay={
                  <Tooltip>
                    {`Disable All Breakpoints`}
                  </Tooltip>
                }>
                <Button variant='outline-secondary' size='sm' onClick={this.disableBreakpoints}>
                  <FaTimes/>
                </Button>
              </OverlayTrigger>
            </Col>
          </Row>
        </div>    
        <div className='mainbody'>
          <Row>
            <div id="code-area" className='code-area'> 
              <div id='breakpoint-column' className='breakpoint-column'>
                {this.breakpointsColumn(this.state.code)}
              </div>
              { this.state.code &&
                <CodeMirror
                  mode='sigma16'
                  value={this.state.code} 
                  onChange={this.updateCode} 
                  options={{ lineNumbers : true, scrollbarStyle: "null" }}
                  className='code-chunk-column'
                  autoFocus/>
              }
            </div>
          </Row>
        </div>
      </React.Fragment>
    );
  }
}