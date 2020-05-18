import React from 'react';

import 'codemirror/lib/codemirror.css';
import './ProgramDebugView.css';

import { Alert, Button, ButtonGroup, Col, InputGroup, OverlayTrigger, Row, Tooltip } from 'react-bootstrap';
import { FaPlay, FaBackward, FaStepForward, FaTimes } from 'react-icons/fa';

import * as Emulator from './utils/Emulator';

import NavBar from './NavBar';

export default class ProgramDebugView extends React.Component {
// CLASS METHODS 
  constructor( props, context ) {
    super( props );

    this.state = {
      code : '',
      breakpoints : [],

      alertShow : false,
      alertMessage : '',
      alertNature : 'success',

      machineCode : [],

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

      output : '',

      input : '',

      // special methods for debugging
      lastLine : 0,
      activeLine : 0,

      breakpointsMachineCode : [],

      halted : false
    };
  }

  componentDidMount() {
    var code = '';
    var breakpoints = [];
    if ( this.props.location.state ) {
      code = this.props.location.state.code;
      breakpoints = this.props.location.state.breakpoints;

      this.setState( { code : this.props.location.state.code } );
      this.setState( { breakpoints : this.props.location.state.breakpoints } );
    } else if ( this.props.code !== undefined ) {
      code = this.props.code;
      code = this.props.code;

      this.setState( { code : this.props.code } );
      this.setState( { breakpoints : this.props.breakpoints } );
    }
    var machineCode = this.parseCode( code, breakpoints );

    this.setState( { memory : Emulator.setMemory( machineCode ) } )
  }

// BREAKPOINTS
  disableBreakpoints = button => {
    this.setState( { breakpoints : [] } );
    this.setState( { breakpointsMachineCode : [] } );
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
                ${Emulator.writeHex( this.state.cpuControl[controlKeys[i]] )}
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
                    { Emulator.readUnsignedHex( this.state.registers[i] )}/{ Emulator.readSignedHex( this.state.registers[i] ) }
                  </Tooltip>
                }>
                <span>
                  ${Emulator.writeHex( this.state.registers[i] )}
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
      var classNameMemory = 'systeminfo-column-elem';
      var decoration = '';
      
      if ( i === this.state.lastLine ) classNameMemory = 'systeminfo-column-elem last';
      if ( i === this.state.activeLine ) classNameMemory = 'systeminfo-column-elem active';
      if ( this.state.breakpointsMachineCode.includes( i ) ) decoration = 'underline';

      memoryValues.push( 
        <div 
          key={'memory ' + memoryKeys[i]}
          id={'memory ' + memoryKeys[i]}
          className={classNameMemory}>
          <Row style={{textDecoration : decoration}}>
            <Col className={classNameMemory}>
              <strong>${Emulator.writeHex( memoryKeys[i] )}</strong>
            </Col>
            <Col className={classNameMemory} style={{textAlign:'right'}}>
              <OverlayTrigger
                key={'left'}
                placement={'left'}
                overlay={
                  <Tooltip>
                    { Emulator.readUnsignedHex( this.state.memory[memoryKeys[i]] ) }/{ Emulator.readSignedHex( this.state.memory[memoryKeys[i]] ) }
                  </Tooltip>
                }>
                <span>
                  ${Emulator.writeHex( this.state.memory[memoryKeys[i]] )}
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
      parsed = Emulator.parseLineForLabels( lines[i] );

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
      check = Emulator.checkLine( lines[it], labels );
      if ( check.length ) {
        lineErrorCopy[it + 1] = check;
        ranSuccessfully = false;
      }
    }

    this.setState( { lineError : lineErrorCopy } );

    return [ranSuccessfully, lineErrorCopy];
  }

// PARSING METHOD
  parseCode( code, breakpoints ) {
    var lines = code.split( '\n' );
    
    var currentLine = 0;

    var parsed = {};
    var labels = {};
    var justLabelOffset = 0;

    var machineCode = [];

    var check = this.checkCode( code );

    if ( check[0] ) {
      for ( var i = 0; i < lines.length; i++ ) {
        parsed = Emulator.parseLineForLabels( lines[i] );

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

      var nextLineBreakpoint = false;
      var breakpointsMachineCode = [];

      for ( var it = 0; it < lines.length; it++ ) {
        var trimmed = lines[it].trim();

        if ( breakpoints.includes( it+1 ) ) nextLineBreakpoint = true; 

        if ( trimmed !== '' && trimmed.split( ';' )[0] !== '' ) {
          parsed = Emulator.parseLineForMachineCode( lines[it], labels );
          if ( parsed ) {
            if ( nextLineBreakpoint ) {
              breakpointsMachineCode.push( machineCode.length );
              nextLineBreakpoint = false;
            }

            machineCode.push( parsed[0] );
            
            // if two word instruction
            if ( Emulator.isValidNumber( Emulator.readSignedHex( parsed[1] ) ) ) {
              machineCode.push( parsed[1] );
            }
          }
        }
      }

      this.setState( { machineCode : machineCode } );
      this.setState( { breakpointsMachineCode : breakpointsMachineCode } );
    } else {
      var keys = Object.keys( check[1] )
      var keysString = '';

      for ( var ite = 0; ite < keys.length; ite++ ) {
        if ( ite !== 0 ) {
          keysString += ', '
        }

        keysString += keys[ite];
      }

      this.updateAlert( 'Built unsuccesfully, correct syntax errors at line(s): ' + keysString, 'danger' );
    }

    return machineCode;
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

  canRunCode( code, machineCode ) {
    var error = true;

    if ( machineCode.length !== 0 ) {
      if ( !machineCode.includes( 0xd000 ) ) {
        error = 'Cannot run code without a "trap R0,R0,R0" instruction. Can step-through.';
      }
    } else {
      // machine language is blank
      error = 'Cannot run no code. Try building then running';
    }
    return error;
  }

  runCode = button => {
    var canRun = this.canRunCode( this.state.code, this.state.machineCode );
    var ran = {
      halted : false
    };

    if ( !canRun.length ) {
      var localControl = this.state.cpuControl;
      var localRegisters = this.state.registers;
      var localMemory = Emulator.setMemory( this.state.machineCode );
      var localInput = this.state.input;
      var localOutput = this.state.output;

      var lastRanLine = this.state.activeLine;

      var encounteredBreakpoint = false;

      while ( !( ran['halted'] ) && !encounteredBreakpoint ) {
        if ( ran['control'] !== undefined ) {
          lastRanLine = ran['control']['pc'];
        }

        ran = Emulator.runMemory( localControl, localRegisters, localMemory, localInput, localOutput );

        localControl = ran['control'];
        localRegisters = ran['registers'];
        localMemory = ran['memory'];
        localInput = ran['input'];
        localOutput = ran['output'];

        // if ran out of commands
        if ( !( Object.keys( localMemory ).includes( String( localControl['pc'] ) ) ) ) ran['halted'] = true;
        
        if ( this.state.breakpointsMachineCode.includes( ran['control']['pc'] ) ) {
          encounteredBreakpoint = true;
        }
      }

      this.setState( { cpuControl : localControl } );
      this.setState( { registers : localRegisters } );
      this.setState( { memory : localMemory } );
      this.setState( { output : localOutput } );

      this.setState( { lastLine : lastRanLine } );
      this.setState( { activeLine : localControl['pc'] } );
      this.setState( { halted : ran['halted'] } );
    } else {
      this.updateAlert( canRun, 'danger' );
    }
  }

  stepForward = button => {
    var ran = {
      halted : false
    };

    var localControl = this.state.cpuControl;
    var localRegisters = this.state.registers;
    var localMemory = Emulator.setMemory( this.state.machineCode );
    var localInput = this.state.input;
    var localOutput = this.state.output;

    ran = Emulator.runMemory( localControl, localRegisters, localMemory, localInput, localOutput );

    localControl = ran['control'];
    localRegisters = ran['registers'];
    localMemory = ran['memory'];
    localInput = ran['input'];
    localOutput = ran['output'];

    // if ran out of commands
    if ( !( Object.keys( localMemory ).includes( String( localControl['pc'] ) ) ) ) ran['halted'] = true;

    this.setState( { cpuControl : localControl } );
    this.setState( { registers : localRegisters } );
    this.setState( { memory : localMemory } );
    this.setState( { output : localOutput } );

    this.setState( { lastLine : this.state.activeLine } );
    this.setState( { activeLine : localControl['pc'] } );
    this.setState( { halted : ran['halted'] } );
  }

  resetDebug = button => {
    this.resetCPUandMemory();

    this.setState( { memory : Emulator.setMemory( this.state.machineCode ) } );
    
    this.setState( { lastLine : 0 } );
    this.setState( { activeLine : 0 } );
    this.setState( { halted : false } );
  }

// RENDER
  render() {
    return(
      <React.Fragment>
        <NavBar state={{code : this.state.code, breakpoints : this.state.breakpoints}}/>
        <div className="mainbody">
          <Alert variant={this.state.alertNature} onClose={this.closeAlert} show={this.state.alertShow} dismissible>
            <p className='alertbody'>
              {this.state.alertMessage}
            </p>
          </Alert>
          <Row className='buttontoolbar'>
            <Col>
              <ButtonGroup>
                <OverlayTrigger
                  placement={'top'}
                  overlay={
                    <Tooltip>
                      {`Run till next breakpoint`}
                    </Tooltip>
                  }>
                  <Button variant='outline-secondary' size='sm' onClick={this.runCode} disabled={this.state.halted}>
                    <FaPlay/>
                  </Button>
                </OverlayTrigger>
                <OverlayTrigger
                  placement={'top'}
                  overlay={
                    <Tooltip>
                      {`Step Forward`}
                    </Tooltip>
                  }>
                  <Button variant='outline-secondary' size='sm' onClick={this.stepForward} disabled={this.state.halted}>
                    <FaStepForward/>
                  </Button>
                </OverlayTrigger>
              </ButtonGroup>
            </Col>
            <Col>
              <OverlayTrigger
                placement={'top'}
                overlay={
                  <Tooltip>
                    {`Disable all breakpoints`}
                  </Tooltip>
                }>
                <Button variant='outline-secondary' size='sm' onClick={this.disableBreakpoints}>
                  <FaTimes/>
                </Button>
              </OverlayTrigger>
              {' '}
              <OverlayTrigger
                placement={'top'}
                overlay={
                  <Tooltip>
                    {`Rerun`}
                  </Tooltip>
                }>
                <Button variant='outline-secondary' size='sm' onClick={this.resetDebug}>
                  <FaBackward/>
                </Button>
              </OverlayTrigger>
            </Col>
          </Row>
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
              <div id='output-column' className='output-column' onDoubleClick={this.resizeOutput}>
                {this.outputColumn()}
              </div>
            </Col>
          </Row>
        </div>
      </React.Fragment>
    );
  }
}