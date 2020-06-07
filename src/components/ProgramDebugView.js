import React from 'react';

import 'codemirror/lib/codemirror.css';
import './ProgramDebugView.css';

import { Alert, Button, ButtonGroup, Col, Collapse, InputGroup, Modal, OverlayTrigger, Row, Tooltip } from 'react-bootstrap';
import { FaBackward, FaCheck, FaMinus, FaPen, FaPlay, FaStepForward, FaTimes } from 'react-icons/fa';
import CodeMirror from 'react-codemirror';

import * as Emulator from './utils/Emulator';

import NavBar from './NavBar';

export default class ProgramDebugView extends React.Component {
// CLASS METHODS 
  constructor( props, context ) {
    super( props );

    this.state = {
      code : '',
      breakpoints : [],

      highlightedCodeChunk : true,

      alertShow : false,
      alertMessage : '',
      alertNature : 'success',

      inputModalShow : false,

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

      halted : false,

      inputRan : '',

      memoryToLine : {},
      lineToMemory : {},

      showCodeChunk : true,
      renderCodeChunk : true,

      outputModalShow : false
    };
  }

  componentDidMount() {
    var code = '';
    var breakpoints = [];
    if ( this.props.location.state ) {
      code = this.props.location.state.code;
      breakpoints = this.props.location.state.breakpoints;

      this.setState( { 
        code : this.props.location.state.code, 
        breakpoints : this.props.location.state.breakpoints, 
        input : this.props.location.state.input, 
        inputRan : this.props.location.state.input 
      } );
    } else if ( this.props.code !== undefined ) {
      code = this.props.code;
      breakpoints = this.props.breakpoints;

      this.setState( { 
        code : this.props.code, 
        breakpoints : this.props.breakpoints, 
        input : this.props.input, 
        inputRan : this.props.input 
      } );
    }
    var machineCode = this.parseCode( code, breakpoints );

    this.setState( { memory : Emulator.setMemory( machineCode ) } );

    this.parseForBreakpoints( this.state.code, breakpoints );
  }

// ALERT METHODS
  updateAlert( message, nature ) {
    this.setState( { alertMessage : message, alertNature : nature, alertShow : true } );
  }

  closeAlert = alert => {
    this.setState( { alertShow : false } );
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
  inputColumn() {
    return ( 
      <div style={{height:'100%', width:'100%'}}>
        <InputGroup 
          className='input-area'
          as='textarea'
          value={this.state.inputRan}
          disabled/>
      </div>
    );
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
      <div style={{height:'100%', width:'100%'}} onDoubleClick={this.outputModalOpen}>
        <InputGroup 
          className='output-area'
          as='textarea'
          value={this.state.output}
          onDoubleClick={this.outputModalOpen}
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
      
      if ( i === this.state.lastLine && this.state.lastLine !== this.state.activeLine ) classNameMemory = 'systeminfo-column-elem last';
      if ( i === this.state.activeLine && !( this.state.halted ) ) classNameMemory = 'systeminfo-column-elem active';
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

// BREAKPOINTS
  breakpointsColumn( code ) {
    var breakpoints = [];
    var lines = code.split( '\n' );

    var codeAreaWrapper = document.getElementById( 'code-area-wrapper' );

    if ( codeAreaWrapper ) {
      codeAreaWrapper.style.height = ( 25 * ( lines.length ) ) + 8 + 'px';

      for ( var i = 0; i < lines.length; i++ ) {
        var yOffset = 25 * ( i + 0.75 );
        var styleTop = yOffset + 3 +'px';

        var id = 'breakpoint ' + ( i + 1 );
        var className = 'breakpoint ' + ( i + 1 );

        if ( this.state.breakpoints.includes( i + 1 ) ) {
          className = className + ' active';
        }
        
        breakpoints.push( 
          <div 
            key={id}
            id={id} 
            className={className} 
            style={{top : styleTop}} 
            onClick={this.breakpointOnClick}/>
        );
      }
      return breakpoints;
    }
  }

  breakpointOnClick = breakpoint => {
    var breakpoints = this.state.breakpoints;

    if ( breakpoint.currentTarget.classList.contains( 'active' ) ) {
      breakpoint.currentTarget.classList.remove( 'active' );
      var index = breakpoints.indexOf( Number( breakpoint.currentTarget.id.slice( 'breakpoint '.length, breakpoint.currentTarget.id.length ) ) );
      breakpoints.splice( index, 1 );
    } else {
      breakpoint.currentTarget.classList.add( 'active' );
      breakpoints.push( Number( breakpoint.currentTarget.id.slice( 'breakpoint '.length, breakpoint.currentTarget.id.length ) ) );
    }

    this.setState( { breakpoints : breakpoints } );
    this.parseForBreakpoints( this.state.code, breakpoints );
  }

  disableBreakpoints = button => {
    this.setState( { breakpoints : [], breakpointsMachineCode : [] } );
    this.parseForBreakpoints( this.state.code, [] );
  }

// CODE CHUNK METHODS
  createLineNumberColumn() {
    var linesOfCode = this.state.code.split( '\n' ).length;
    var result = [];

    var lineNoWidth = 21;
    var lineNoWidthLength = ( Math.log( linesOfCode ) * Math.LOG10E + 1 ) | 0;

    if ( lineNoWidthLength > 2 ) {
      lineNoWidth = ( ( lineNoWidthLength * 7 ) + 7 );
    }

    lineNoWidth += 'px';

    for ( var i = 0; i < linesOfCode; i++ ) {
      var yOffset = 25 * ( i + 0.5 );

      if ( this.state.lineToMemory[i] ) {
        var parsedMachineCodeStringStart = Emulator.writeHex( this.state.lineToMemory[i][0] );
        var parsedMachineCodeStringCodes = Emulator.writeHex( this.state.memory[ this.state.lineToMemory[i][0] ] );

        if ( this.state.lineToMemory[i][1] ) {
          parsedMachineCodeStringStart += ', ' + Emulator.writeHex( this.state.lineToMemory[i][1] );
          parsedMachineCodeStringCodes += ', ' + Emulator.writeHex( this.state.memory[ this.state.lineToMemory[i][1] ] );
        }

        var parsedMachineCodeString = parsedMachineCodeStringStart + ' | ' + parsedMachineCodeStringCodes;

        result.push(
          <OverlayTrigger
            key={'line-number-tooltip' + ( i + 1 )}
            placement={'right'}
            overlay={
              <Tooltip>
                {parsedMachineCodeString}
              </Tooltip>
            }>
            <div
              key={'line-number ' + ( i + 1 )} 
              className='line-number'
              style={{top:{yOffset}, width:lineNoWidth}}>
              {i + 1}
            </div>
          </OverlayTrigger>
        );

      } else {
        // if an empty line in memory, don't create a tooltip
        result.push(
          <div
            key={'line-number ' + ( i + 1 )} 
            className='line-number'
            style={{top:{yOffset}, width:lineNoWidth}}>
            {i + 1}
          </div>
        );
      }
    }

    return result;
  }
  //
  noHighlightCodeChunk() {
    return(
      <div style={{display:'grid'}}>
        <pre className="code-chunk-column viewing">
        {this.state.code}
        </pre>
      </div>
    );
  }

  toggleHighlighting = button => {
    this.setState( { highlightedCodeChunk : !( this.state.highlightedCodeChunk ) } );
  }

  toggleCodeChunk = button => {
    this.setState( { showCodeChunk : !( this.state.showCodeChunk ), renderCodeChunk : false } );
  }

// LINE OVERLAY METHODS
  activeLineOverlay() {
    if ( !( this.state.halted ) ) {
      var linesOfCode = this.state.code.split( '\n' ).length;
      var activeLineInCode = this.state.memoryToLine[ this.state.activeLine ];

      var heightOfOverlay = -( ( linesOfCode - ( activeLineInCode + 1 ) ) * 25 ) + -( 29 );

      var lineNoWidth = 21;
      var lineNoWidthLength = ( Math.log( linesOfCode ) * Math.LOG10E + 1 ) | 0;

      if ( lineNoWidthLength > 2 ) {
        lineNoWidth = ( ( lineNoWidthLength * 7 ) + 7 );
      }

      lineNoWidth = ( lineNoWidth + 25 ) + 'px'; //25 because 16 for breakpoint column, 8 for number padding and 1 for number column border
      
      return(
        <div style={{marginTop : heightOfOverlay, marginLeft : lineNoWidth}} className='line-overlay active'/>
      );
    }
  }

  lastLineOverlay() {
    if ( this.state.lastLine !== this.state.activeLine ) {
      // if program has at least been stepped through

      var linesOfCode = this.state.code.split( '\n' ).length;
      var lastLineInCode = this.state.memoryToLine[ this.state.lastLine ];

      var heightOfOverlay = -( ( linesOfCode - ( lastLineInCode + 1 ) ) * 25 ) + -( 29 );

      var lineNoWidth = 21;
      var lineNoWidthLength = ( Math.log( linesOfCode ) * Math.LOG10E + 1 ) | 0;

      if ( lineNoWidthLength > 2 ) {
        lineNoWidth = ( ( lineNoWidthLength * 7 ) + 7 );
      }

      lineNoWidth = ( lineNoWidth + 25 ) + 'px'; //25 because 16 for breakpoint column, 8 for number padding and 1 for number column border

      return(
        <div style={{marginTop : heightOfOverlay, marginLeft : lineNoWidth}} className='line-overlay last'/>
      );
    }
  }

// COLLAPSE CALLBACK METHOD
  collapseOnEntered = collapse => {
    this.setState( { renderCodeChunk : true } );
  }

// CHECKING METHOD
  checkCode( code ) {
    var lines = code.toLowerCase().split( '\n' );
    var check;

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

      for ( var it = 0; it < lines.length; it++ ) {
        var trimmed = lines[it].trim();

        if ( trimmed !== '' && trimmed.split( ';' )[0] !== '' ) {
          parsed = Emulator.parseLineForMachineCode( lines[it], labels );
          if ( parsed ) {
            for ( var iter = 0; iter < parsed.length; iter++ ) {
              if ( Emulator.isValidNumber( Emulator.readSignedHex( parsed[iter] ) ) ) {
                machineCode.push( parsed[iter] );
              } else {
                break;
              }
            }
          }
        }
      }

      this.setState( { machineCode : machineCode } );
    } else {
      var keys = Object.keys( check[1] );
      var keysString = '';

      for ( var ite = 0; ite < keys.length; ite++ ) {
        if ( ite !== 0 ) {
          keysString += ', ';
        }

        keysString += keys[ite];
      }

      this.updateAlert( 'Built unsuccesfully, correct syntax errors at line(s): ' + keysString, 'danger' );
      this.setState( { halted : true } );
    }

    return machineCode;
  }

  parseForBreakpoints( code, breakpoints ) {
    var check = this.checkCode( code );

    if ( check[0] ) {
      var linesOfCode = code.split( '\n' ).length;

      var breakpointsMachineCode = [];

      for ( var i = 0; i < breakpoints.length; i++ ) {
        for ( var it = 0; it < linesOfCode; it++ ) {
          if ( ( it + 1 ) >= breakpoints[i] && this.state.lineToMemory[it] ) {
            breakpointsMachineCode.push( this.state.lineToMemory[it][0] );
            break;
          }
        }
      }

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
      this.setState( { halted : true } );
    }
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

    var memoryNew = Emulator.setMemory( this.state.machineCode );

    this.setState( { registers : registersNew, cpuControl : cpuControlNew, output : outputNew, memory : memoryNew } );
  }

  canRunCode( code, machineCode ) {
    var error = true;

    if ( machineCode.length !== 0 ) {
      if ( !machineCode.includes( 0xd000 ) ) {
        error = 'Cannot run code without a "trap R0,R0,R0" instruction. Can step-through. Restart execution to do so';
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
      var localMemory = this.state.memory;
      var localInput = this.state.inputRan;
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

      this.setState( { 
        cpuControl : localControl, 
        registers : localRegisters, 
        memory : localMemory, 
        inputRan : localInput, 
        output : localOutput, 
        lastLine : lastRanLine,
        activeLine : localControl['pc'],
        halted : ran['halted']
      } );
    } else {
      this.updateAlert( canRun, 'danger' );
      this.setState( { halted : true } );
    }
  }

  stepForward = button => {
    var ran;

    if ( this.state.machineCode.length !== 0 ) {
      var localControl = this.state.cpuControl;
      var localRegisters = this.state.registers;
      var localMemory = this.state.memory;
      var localInput = this.state.inputRan;
      var localOutput = this.state.output;

      ran = Emulator.runMemory( localControl, localRegisters, localMemory, localInput, localOutput );

      localControl = ran['control'];
      localRegisters = ran['registers'];
      localMemory = ran['memory'];
      localInput = ran['input'];
      localOutput = ran['output'];

      // if ran out of commands
      if ( !( Object.keys( localMemory ).includes( String( localControl['pc'] ) ) ) ) ran['halted'] = true;

      this.setState( { 
        cpuControl : localControl, 
        registers : localRegisters, 
        memory : localMemory, 
        inputRan : localInput, 
        output : localOutput, 
        lastLine : this.state.activeLine ,
        activeLine : localControl['pc'],
        halted : ran['halted']
      } );
    } else {
      // machine language is blank
      this.updateAlert( 'Cannot run no code. Try building then running', 'danger' );
      this.setState( { halted : true } );
    }
  }

  resetDebug = button => {
    this.resetCPUandMemory();

    this.setState( { 
      memory : Emulator.setMemory( this.state.machineCode ),
      inputRan : this.state.input ,
      lastLine : 0,
      activeLine : 0,
      halted : false
    } );
  }

// MODAL METHODS
  setInput = button => {
    this.setState( { inputModalShow : true } );
  }

  inputUpdate = textarea => {
    this.setState( { input : textarea.target.value, inputRan : textarea.target.value } );

    this.resetDebug();
  }

  inputModalClose = modal => {
    this.setState( { inputModalShow : false } );
  }

  outputModalOpen = textarea => {
    this.setState( { outputModalShow : true } );
  }

  outputModalClose = modal => {
    this.setState( { outputModalShow : false } );
  }

// RENDER
  render() {
    return(
      <React.Fragment>
        <NavBar state={{code : this.state.code, breakpoints : this.state.breakpoints, input : this.state.input}}/>

        <Modal
          show={this.state.inputModalShow}
          onHide={this.inputModalClose}
          dialogClassName="inputmodal"
          animation={false} >
          <Modal.Header closeButton>
            <Modal.Title>
              Set Input
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className='input-modal-column'>
              <InputGroup
                as='textarea'
                className='input-modal-input'
                value={this.state.input}
                onChange={this.inputUpdate}
                autoFocus/>
            </div>
            <div style={{paddingTop : '15px'}}>
              <Button variant='outline-secondary' onClick={this.inputModalClose} style={{float : 'right'}}>
                Set Input
              </Button>
            </div>
          </Modal.Body>
        </Modal>

        <Modal
          show={this.state.outputModalShow}
          onHide={this.outputModalClose}
          dialogClassName="outputmodal"
          animation={false} >
          <Modal.Header closeButton>
            <Modal.Title>
              Output
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div onDoubleClick={this.outputModalClose} className='output-column' style={{height:'518px', width:'100%'}}>
              <InputGroup
                as='textarea'
                className='output-area'
                value={this.state.output}
                disabled/>
            </div>
          </Modal.Body>
        </Modal>

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
                      {`Set input`}
                    </Tooltip>
                  }>
                  <Button variant='outline-secondary' size='sm' onClick={this.setInput}>
                    <FaPen/>
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
            <Col>
              <OverlayTrigger
                key={`highlighting-tooltip`}
                placement={'top'}
                overlay={
                  <Tooltip>
                    {`Toggle highlighting
                    improves speed if disabled`}
                  </Tooltip>
                }>
                <Button variant='outline-secondary' size='sm' onClick={this.toggleHighlighting} active={this.state.highlightedCodeChunk}>
                  <FaCheck/>
                </Button>
              </OverlayTrigger>
              {' '}
              <OverlayTrigger
                key={`hide-code-tooltip`}
                placement={'top'}
                overlay={
                  <Tooltip>
                    {`Hide the codechunk`}
                  </Tooltip>
                }>
                <Button variant='outline-secondary' size='sm' onClick={this.toggleCodeChunk} active={!(this.state.showCodeChunk)}>
                  <FaMinus/>
                </Button>
              </OverlayTrigger>
            </Col>
          </Row>
          <Row>
            <Col>
              <h6>
                Control/Registers/Input
              </h6>
            </Col>
            <Col>
              <h6>
                Memory/Output
              </h6>
            </Col>
            { this.state.showCodeChunk &&
              <Col>
                <h6>
                  Code ( read-only )
                </h6>
              </Col>
            }
          </Row>
          <Row>
            <Col className='runmodal-left-col'>
              <div id='control-column' className='control-column'>
                {this.controlColumn()}
              </div>
              <div id='register-column' className='register-column'>
                {this.registerColumn()}
              </div>
              <div id='input-column' className='input-column'>
                {this.inputColumn()}
              </div>
            </Col>
            <Col style={{borderRight:'2px solid #eaeef3'}}>
              <div id='memory-column-big' className='memory-column big'>
                {this.memoryColumn()}
              </div>
              <div id='output-column' className='output-column' onDoubleClick={this.resizeOutput}>
                {this.outputColumn()}
              </div>
            </Col>
            <Collapse in={this.state.showCodeChunk} onEntered={this.collapseOnEntered}>
              <Col>
                <div id='code-area-viewing' className='code-area viewing'> 
                  <div id='code-area-wrapper' className='code-area-wrapper'>
                    { this.state.showCodeChunk &&
                      <React.Fragment>
                        <div id='breakpoint-column' className='breakpoint-column'>
                          {this.breakpointsColumn(this.state.code)}
                        </div>
                        <div className='line-number-column'>
                          {this.createLineNumberColumn()}
                        </div>
                        { this.state.code && this.state.renderCodeChunk &&
                          <React.Fragment>
                            { this.state.highlightedCodeChunk ?
                              <CodeMirror
                                className=' debug'
                                mode='sigma16'
                                value={this.state.code} 
                                options={{ readOnly : true, lineNumbers : false }}/>
                            : 
                              <React.Fragment>
                                {this.noHighlightCodeChunk()}
                                {/**<InputGroup
                                  as='textarea'
                                  className='code-chunk-column viewing'
                                  value={this.state.code}
                                  disabled/>
                                */}
                              </React.Fragment>
                            }
                            {this.activeLineOverlay()}
                            {this.lastLineOverlay()}
                          </React.Fragment>
                        }
                      </React.Fragment>
                    }
                  </div>
                </div>
              </Col>
            </Collapse>
          </Row>
        </div>
      </React.Fragment>
    );
  }
}