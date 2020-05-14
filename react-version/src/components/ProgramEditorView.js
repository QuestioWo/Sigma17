import React from 'react';

import 'codemirror/lib/codemirror.css';
import './ProgramEditorView.css';

import { Alert, Button, ButtonGroup, Col, InputGroup, Modal, OverlayTrigger, Row, Tooltip } from 'react-bootstrap';
import { FaCheck, FaHammer, FaPlay, FaTimes } from 'react-icons/fa';
import CodeMirror from 'react-codemirror';

import * as CompilationUtils from './utils/CompilationUtils';

import NavBar from './NavBar';

require( './utils/mode/sigma16' );

export default class ProgramEditorView extends React.PureComponent {
// CLASS METHODS
  constructor( props, context ) {
    super( props );

    this.state = {
      code : '',
      breakpoints : [],

      lineError : {},

      highlightedCodeChunk : true,

      alertShow : false,
      alertMessage : '',
      alertNature : 'success',

      runModalShow : false,
      runModalRegisters : {},
      runModalMemory : {},

      outputZoomed : false,

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

      memory : {},

      output : ''
    };
  }

  componentDidMount() {
    this.setState( { code: this.props.code } );
  }

// BREAKPOINTS
  breakpointsColumn( code ) {
    var breakpoints = [];
    var lines = code.split( '\n' );

    var codeArea = document.getElementById( 'code-area' );

    if ( codeArea ) {
      // deal with code chunk height in this function since only column rendered
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
            </OverlayTrigger>
          );
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
      controls.push( 
        <div 
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
        </div> 
      );
    }

    return controls;
  }
  //
  registerColumn() {
    var registers = [];

    for ( var i = 0; i < 16; i++ ) {
      registers.push( 
        <div 
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
        </div> 
      );
    }

    return registers;
  }
  //
  outputColumn() {
    return ( 
      <div style={{height:'100%', width:'100%'}}>
        <InputGroup 
          className='output-area'
          as='textarea'
          value={this.state.output}
          onClick={this.resizeOutput}
          disabled/>
      </div>
    );
  }
  //
  memoryColumn() {
    var memoryValues = [];
    var memoryKeys = Object.keys( this.state.memory ).map( key => Number( key ) );

    for ( var i = 0; i < memoryKeys.length; i++ ) {
      memoryValues.push( 
        <div 
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
        </div> 
      );
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

  resizeOutput = outputColumn => {
    var target = outputColumn.currentTarget;

    // if currently zoomed and are setting to smaller
    if ( this.state.outputZoomed ) {
      target.style.height = '82px';
    } else {
      target.style.height = '518px';
    }

    this.setState( { outputZoomed : !( this.state.outputZoomed ) } );
  }

// CHECKING METHOD
  checkCode( code ) {
    var lines = code.toLowerCase().split( '\n' );
    var check = true;

    var lineErrorCopy = {};

    var currentLine = 0;

    var parsed = {};
    var labels = {};
    var justLabelOffset = 0;

    var ranSuccessfully = true;

    for ( var i = 0; i < lines.length; i++ ) {
      parsed = CompilationUtils.parseLineForLabels( lines[i] );

      if ( parsed['label'] !== '' ) {
        if ( parsed['justLabel'] ) {
          justLabelOffset += 1;
          labels[parsed['label']] = currentLine - justLabelOffset + 1;
        } else {
          labels[parsed['label']] = currentLine - justLabelOffset;
        }
      }

      currentLine += parsed['instructionWords'];
    }

    for ( var it = 0; it < lines.length; it++ ) {
      check = CompilationUtils.checkLine( lines[it], labels );
      if ( check.length ) {
        lineErrorCopy[it + 1] = check;
        ranSuccessfully = false;
      }
    }

    this.setState( { lineError : lineErrorCopy } );

    return ranSuccessfully;
  }

// PARSING METHOD
  parseCode = button => {
    var lines = this.state.code.split( '\n' );
    
    var currentLine = 0;

    var parsed = {};
    var labels = {};
    var justLabelOffset = 0;

    var machineCode = [];

    var parsedSuccessfully = true;

    if ( this.checkCode( this.state.code ) ) {
      for ( var i = 0; i < lines.length; i++ ) {
        parsed = CompilationUtils.parseLineForLabels( lines[i] );

        if ( parsed['label'] !== '' ) {
          if ( parsed['justLabel'] ) {
            justLabelOffset += 1;
            labels[parsed['label']] = currentLine - justLabelOffset + 1;
          } else {
            labels[parsed['label']] = currentLine - justLabelOffset;
          }
        }

        currentLine += parsed['instructionWords'];
      }

      for ( var it = 0; it < lines.length; it++ ) {
        var trimmed = lines[it].trim();
        if ( trimmed !== '' && trimmed.split( ';' )[0] !== '' ) {
          parsed = CompilationUtils.parseLineForMachineCode( lines[it], labels );
          if ( parsed ) {
            machineCode.push( parsed[0] );
            
            // if two word instruction
            if ( CompilationUtils.isValidNumber( CompilationUtils.readSignedHex( parsed[1] ) ) ) {
              machineCode.push( parsed[1] );
            }
          }
        }
      }
      this.setState( { machineCode : machineCode } );
      this.setState( { machineCodeUpdated : true } );

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

    var outputNew = '';

    this.setState( { registers : registersNew } );
    this.setState( { cpuControl : cpuControlNew } );
    this.setState( { output : outputNew } );
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
      var localOutput = this.state.output;

      while ( !( ran['halted'] ) ) {
        ran = CompilationUtils.runMemory( localControl, localRegisters, localMemory, localOutput );

        localControl = ran['control'];
        localRegisters = ran['registers'];
        localMemory = ran['memory'];
        localOutput = ran['output'];

        // if ran out of commands
        if ( !( Object.keys( localMemory ).includes( String( localControl['pc'] ) ) ) ) ran['halted'] = true;
      }

      this.setState( { cpuControl : localControl } );
      this.setState( { registers : localRegisters } );
      this.setState( { memory : localMemory } );
      this.setState( { output : localOutput } );

      this.setState( { outputZoomed : false } );
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

// CODE CHUNK METHODS
  createLineNumberColumn() {
    var linesOfCode = this.state.code.split( '\n' ).length;
    var result = [];

    var lineNoWidth = '21px';

    var lineNoWidthLength = ( Math.log( linesOfCode ) * Math.LOG10E + 1 ) | 0;

    if ( lineNoWidthLength > 2 ) {
      lineNoWidth = ( ( lineNoWidthLength * 7 ) + 7 ) + 'px';
    }

    for ( var i = 0; i < linesOfCode; i++ ) {
      var yOffset = 25 * ( i + 0.5 );

      result.push(
        <div
          key={'line-number ' + ( i + 1 )} 
          className='line-number'
          style={{top:{yOffset}, width:lineNoWidth}}>
          {i + 1}
        </div>
      );
    }

    return result;
  }
  //
  codeBlockEdit = divContent => {
    this.checkCode( divContent.target.value );

    if ( divContent.target.value ) {
      this.setState( { code : divContent.target.value } );
    } else {
      this.setState( { code : ' ' } );
    }
    this.setState( { machineCodeUpdated : false  } );
  }

  toggleHighlighting = button => {
    this.setState( { highlightedCodeChunk : !( this.state.highlightedCodeChunk ) } );
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
            { !( this.state.outputZoomed ) &&
              <Row>
                <Col>
                  <h6>
                    Control/Registers
                  </h6>
                </Col>
                <Col>
                  <h6>
                    Memory/Output
                  </h6>
                </Col>
              </Row>
            }
            <Row>
              { !( this.state.outputZoomed ) &&
                <Col className='runmodal-left-col'>
                  <div id='control-column' className='control-column'>
                    {this.controlColumn()}
                  </div>
                  <div id='register-column' className='register-column'>
                    {this.registerColumn()}
                  </div>
                </Col>
              }
              <Col>
                { !( this.state.outputZoomed ) &&
                  <div id='memory-column' className='memory-column'>
                    {this.memoryColumn()}
                  </div>
                }
                <div id='output-column' className='output-column' onDoubleClick={this.resizeOutput}>
                  {this.outputColumn()}
                </div>
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
            <Col>
              <OverlayTrigger
                key={'top'}
                placement={'top'}
                overlay={
                  <Tooltip>
                    Toggle Highlighting
                    Improves speed if disabled
                  </Tooltip>
                }>
                <Button variant='outline-secondary' size='sm' onClick={this.toggleHighlighting} active={this.state.highlightedCodeChunk}>
                  <FaCheck/>
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
              <div className='line-number-column'>
                {this.createLineNumberColumn()}
              </div>
              { this.state.code &&
                <React.Fragment>
                  { this.state.highlightedCodeChunk ?
                    <CodeMirror
                      mode='sigma16'
                      value={this.state.code} 
                      onChange={this.updateCode} 
                      options={{ lineNumbers : false, scrollbarStyle: "null" }}
                      autoFocus/>
                  : 
                    <React.Fragment>
                      
                      <InputGroup
                        as='textarea'
                        className='code-chunk-column'
                        value={this.state.code}
                        onChange={this.codeBlockEdit}
                        autoFocus/>
                    </React.Fragment>
                  }
                </React.Fragment>
              }
            </div>
          </Row>
        </div>
      </React.Fragment>
    );
  }
}