/*
  Copyright Jim Carty © 2020

  This file is subject to the terms and conditions defined in file 'LICENSE.txt', which is part of this source code package.
*/

import React from 'react';

import './ProgramDebugView.css';

import { Alert, Button, ButtonGroup, Col, Collapse, Dropdown, InputGroup, Modal, OverlayTrigger, Row, Tooltip } from 'react-bootstrap';
import { FaBackward, FaEye, FaEyeSlash, FaMinus, FaPen, FaPlay, FaStepForward, FaTimes } from 'react-icons/fa';

import * as Emulator from './utils/Emulator';

import { CustomToggle, CustomMenu } from './utils/CustomDropdown';
import CodeChunk from './utils/CodeChunk';
import NavBar from './NavBar';

const _ = require( 'underscore' );

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

      memoryViewStart : 0,
      memoryViewOptions : [0, 0x500], // generic values so it doesnt break if something goes catastrophically wrong

      // special methods for debugging
      lastLine : 0,
      activeLine : 0,

      lastLineScrollPosition : 0,
      lastLineScrollPositionMemory : 0,

      updateScrollPositionCode : true,
      updateScrollPositionMemory : true,

      breakpointsMachineCode : [],

      halted : false,

      inputRan : '',

      memoryToLine : {},
      lineToMemory : {},

      changedRegisters : [],
      changedMemory : [],

      showCodeChunk : true,

      outputModalShow : false
    };

    this.inputRef = React.createRef();
    this.codeRef = React.createRef();
    this.breakpointCallback = this.breakpointCallback.bind( this );
    this.createLineNumberColumn = this.createLineNumberColumn.bind( this );
  }

  componentDidMount() {
    var propsState = {};

    if ( sessionStorage.getItem( 'code' ) !== null ) {
      propsState = {
        code : sessionStorage.getItem( 'code' ),
        input : sessionStorage.getItem( 'input' ),
        breakpoints : sessionStorage.getItem( 'breakpoints' ).split( ',' ).map(
          breakpointString => {
            return( Number( breakpointString ) );
          }
        ),
        inputRan : sessionStorage.getItem( 'input' )
      };

      this.codeRef.current.setState( propsState );
    } else if ( this.props.code !== undefined ) {
      propsState = Object.assign( {}, this.props );
      propsState['inputRan'] = this.props.input;

      this.codeRef.current.setState( this.props );
    }

    if ( propsState !== {} ) {
      const machineCode = this.parseCode( propsState['code'], propsState['breakpoints'] );
      propsState['memory'] = Emulator.setMemory( machineCode );

      this.memoryOptions( propsState['memory'] );
    }

    this.setState( propsState );
  }

  componentWillUnmount() {
    sessionStorage.setItem( 'code', this.state.code );
    sessionStorage.setItem( 'input', this.state.input );
    sessionStorage.setItem( 'breakpoints', this.state.breakpoints );
  }

// ALERT METHODS
  updateAlert( message, nature ) {
    this.setState( { alertMessage : message, alertNature : nature, alertShow : true } );
  }

  closeAlert = alert => {
    this.setState( { alertShow : false } );
  }

// BREAKPOINT CALLBACK
  async breakpointCallback( breakpoints ) {
    this.setState( { breakpoints : breakpoints } );

    this.parseForBreakpoints( this.state.code, breakpoints );
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
      var classNameRegister = 'systeminfo-column-elem';

      if ( this.state.changedRegisters.includes( String( i ) ) ) classNameRegister += ' changed';

      registers.push( 
        <div 
          key={'register ' + i}
          id={'register ' + i}
          className={classNameRegister}>
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
    // called here since after 'memory-column-big' is made
    if ( this.state.updateScrollPositionMemory && document.getElementById( 'memory-column-big' ) ) {
      const memoryParent = document.getElementById( 'memory-column-big' );
      memoryParent.scrollTo( 0, this.state.lastLineScrollPositionMemory );
    }

    return ( 
      <div
        className='output-area debug'
        onDoubleClick={this.outputModalOpen}>
        {this.state.output}
      </div>
    );
  }
  //
  memoryOptions( memory ) {
    const memoryKeys = Object.keys( memory ).map( key => Number( key ) );

    const interval = 0x500;

    var memoryViewOptions = [0];
    var memorykeyindex = 0;

    while ( true ) {
      if ( memoryKeys[memorykeyindex + interval] ) {
        memoryViewOptions.push( memoryKeys[memorykeyindex + interval] );
        memorykeyindex += interval;
      } else {
        if ( !( memoryViewOptions.includes( memoryKeys[memoryKeys.length - 1] + 1 ) ) ) {
          memoryViewOptions.push( memoryKeys[memoryKeys.length - 1] + 1 );
        }
        break;
      }
    }

    this.setState( { memoryViewOptions : memoryViewOptions } );
  }

  memoryViewPrev = e => {
    this.setState( prevState => ( { 
      memoryViewStart : prevState.memoryViewStart - 1
    } ) );
  }

  memoryViewNext = e => {
    this.setState( prevState => ( { 
      memoryViewStart : prevState.memoryViewStart + 1
    } ) );
  }

  handleMemoryViewChange = e => {
    this.setState( { 
      memoryViewStart : Number( e )
    } );
  }

  memoryColumn() {
    var memoryValues = [];
    var memoryKeys = Object.keys( this.state.memory ).map( key => Number( key ) );

    for ( var i = memoryKeys.indexOf( this.state.memoryViewOptions[this.state.memoryViewStart] ); i < memoryKeys.length && memoryKeys[i] < this.state.memoryViewOptions[this.state.memoryViewStart + 1]; i++ ) {
      var classNameMemory = 'systeminfo-column-elem';
      var decoration = '';
      
      if ( memoryKeys[i] === this.state.lastLine && this.state.lastLine !== this.state.activeLine ) { 
        classNameMemory = 'systeminfo-column-elem last';
      } else if ( memoryKeys[i] === this.state.activeLine && !( this.state.halted ) ) { 
        classNameMemory = 'systeminfo-column-elem active';
      }

      if ( this.state.breakpointsMachineCode.includes( memoryKeys[i] ) ) decoration = 'underline';
      if ( this.state.changedMemory.includes( String( memoryKeys[i] ) ) ) classNameMemory += ' changed';

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

    return (
      <div id='memory-column-big' className='memory-column big'>
        <div className='memory-search'>
          <Row>
            <Col>
              { this.state.memoryViewStart === 0 ?
                <span className='documentation-page-link disabled'>
                  &#x25C0;
                </span>
              :
                <span className='documentation-page-link' onClick={this.memoryViewPrev}>
                  &#x25C0;
                </span>
              }
            </Col>
            <Col style={{ display : 'contents' }}>
              <Dropdown onSelect={this.handleMemoryViewChange}>
                <Dropdown.Toggle as={CustomToggle} id='dropdown-custom-components'>
                  {Emulator.writeHex( this.state.memoryViewOptions[this.state.memoryViewStart] )}-{Emulator.writeHex( this.state.memoryViewOptions[this.state.memoryViewStart + 1] - 1 )}
                </Dropdown.Toggle>

                <Dropdown.Menu as={CustomMenu}>
                  { this.state.memoryViewOptions.map( 
                      option => {
                        const index = this.state.memoryViewOptions.indexOf( option );

                        if ( index !== ( this.state.memoryViewOptions.length - 1 ) ) {
                          return (
                            <Dropdown.Item key={option} eventKey={index} active={index === this.state.memoryViewStart} className='text-center'>
                              {Emulator.writeHex( option )}-{Emulator.writeHex( this.state.memoryViewOptions[index + 1] - 1 )}
                            </Dropdown.Item>
                          );
                        } else {
                          return ( 
                            <React.Fragment key={option} />
                          );
                        }
                      }
                    )
                  }
                </Dropdown.Menu>
              </Dropdown>
            </Col>
            <Col>
              <div style={{ float : 'right' }}>
                { this.state.memoryViewStart + 1 === ( this.state.memoryViewOptions.length - 1 ) ?
                  <span className='documentation-page-link disabled'>
                    &#x25B6;
                  </span>
                :
                  <span className='documentation-page-link' onClick={this.memoryViewNext}>
                    &#x25B6;
                  </span>
                }
              </div>
            </Col>
          </Row>
        </div>
        <div style={{ height : '25px' }} />
        <div>
          {memoryValues}
        </div>
      </div>
    );
  }

// CODE CHUNK METHODS
  createLineNumberColumn( onClickHandler ) {
    var linesOfCode = this.state.code.split( '\n' ).length;
    var result = [];

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
              style={{top : yOffset}}
              onClick={onClickHandler}>
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
            style={{top : yOffset}}
            onClick={onClickHandler}>
            {i + 1}
          </div>
        );
      }
    }

    return result;
  }

  toggleCodeChunk = button => {
    this.setState( prevState => ( {
      showCodeChunk : !( prevState.showCodeChunk )
    } ) );
  }

// LINE OVERLAY METHODS
  setLastLineScrollPosition( lastLine ) {
    const lastLineInCode = this.state.memoryToLine[ lastLine ];

    const heightOfOverlay = lastLineInCode * 25;

    var i = this.state.memoryViewStart;

    if ( this.state.memoryViewStart !== this.state.memoryViewOptions.length - 1 && lastLine > this.state.memoryViewOptions[this.state.memoryViewStart + 1] ) {
      for ( i = this.state.memoryViewStart; i < this.state.memoryViewOptions.length - 1; i++ ) {
        if ( lastLine <= this.state.memoryViewOptions[i + 1] ) {
          break;
        }
      }
    }

    this.setState( { 
      lastLineScrollPosition : heightOfOverlay,
      lastLineScrollPositionMemory : lastLine * 24,
      memoryViewStart : i
    } );
  }

  toggleFollowCode = e => {
    this.setState( prevState => ( { 
      updateScrollPositionCode : !( prevState.updateScrollPositionCode ) 
    } ) );
  }

  toggleFollowMemory = e => {
    this.setState( prevState => ( { 
      updateScrollPositionMemory : !( prevState.updateScrollPositionMemory ) 
    } ) );
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

      var nextLineBreakpoint = false;
      var breakpointsMachineCode = [];

      var memoryToLine = {};
      var lineToMemory = {};

      for ( var it = 0; it < lines.length; it++ ) {
        var trimmed = lines[it].trim();

        if ( breakpoints.includes( it+1 ) ) nextLineBreakpoint = true; 

        if ( trimmed !== '' && trimmed.split( ';' )[0] !== '' ) {
          parsed = Emulator.parseLineForMachineCode( lines[it], labels );
          if ( parsed ) {
            var mcLengthBefore = machineCode.length;
            for ( var iter = 0; iter < parsed.length; iter++ ) {
              if ( Emulator.isValidNumber( Emulator.readSignedHex( parsed[iter] ) ) ) {
                if ( nextLineBreakpoint ) {
                  breakpointsMachineCode.push( mcLengthBefore );
                  nextLineBreakpoint = false;
                }

                memoryToLine[mcLengthBefore] = it;
                if ( lineToMemory[it] === undefined ) lineToMemory[it] = [];
                lineToMemory[it].push( machineCode.length );

                machineCode.push( parsed[iter] );
              } else {
                break;
              }
            }
          }
        }
      }

      this.setState( { 
        machineCode : machineCode, 
        breakpointsMachineCode : breakpointsMachineCode, 
        memoryToLine : memoryToLine, 
        lineToMemory : lineToMemory
      } );
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

    this.memoryOptions( memoryNew );

    this.setState( { 
      cpuControl : cpuControlNew,
      registers : registersNew,
      memory : memoryNew,
      output : outputNew,
      changedRegisters : [],
      changedMemory : []
    } );
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

      const initialRegisters = Object.assign( {}, this.state.registers );
      const initialMemory = Object.assign( {}, this.state.memory );

      var encounteredBreakpoint = false;

      while ( !( ran['halted'] ) && !encounteredBreakpoint ) {
        if ( ran['control'] !== undefined ) {
          lastRanLine = ran['control']['pc'];
        }

        ran = Emulator.runMemory( localControl, localRegisters, localMemory, localInput, localOutput );

        localInput = ran['input'];
        localOutput = ran['output'];
        
        if ( this.state.breakpointsMachineCode.includes( ran['control']['pc'] ) ) {
          encounteredBreakpoint = true;
        }
      }

      this.memoryOptions( localMemory );

      this.setLastLineScrollPosition( lastRanLine );

      this.setState( prevState => ( { 
        cpuControl : localControl, 
        registers : localRegisters, 
        memory : localMemory, 
        inputRan : localInput, 
        output : localOutput, 
        lastLine : lastRanLine,
        activeLine : localControl['pc'],
        halted : ran['halted'],

        changedRegisters : Object.keys( _.omit( localRegisters, function( v, k ) { return initialRegisters[k] === v; } ) ),
        changedMemory : Object.keys( _.omit( localMemory, function( v, k ) { return initialMemory[k] === v; } ) )
      } ) );

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

      const initialRegisters = Object.assign( {}, this.state.registers );
      const initialMemory = Object.assign( {}, this.state.memory );

      ran = Emulator.runMemory( localControl, localRegisters, localMemory, localInput, localOutput );

      localInput = ran['input'];
      localOutput = ran['output'];

      this.memoryOptions( localMemory );

      this.setLastLineScrollPosition( this.state.activeLine );

      this.setState( prevState => ( { 
        cpuControl : localControl, 
        registers : localRegisters, 
        memory : localMemory, 
        inputRan : localInput, 
        output : localOutput, 
        lastLine : prevState.activeLine,
        activeLine : localControl['pc'],
        halted : ran['halted'],

        changedRegisters : Object.keys( _.omit( localRegisters, function( v, k ) { return initialRegisters[k] === v; } ) ),
        changedMemory : Object.keys( _.omit( localMemory, function( v, k ) { return initialMemory[k] === v; } ) )
      } ) );
    } else {
      // machine language is blank
      this.updateAlert( 'Cannot run no code. Try building then running', 'danger' );
      this.setState( { halted : true } );
    }
  }

  resetDebug = button => {
    this.resetCPUandMemory();

    this.setLastLineScrollPosition( 0 );

    this.setState( prevState => ( { 
      memory : Emulator.setMemory( prevState.machineCode ),
      inputRan : prevState.input,
      lastLine : 0,
      activeLine : 0,
      halted : false,
      memoryViewStart : 0
    } ) );
  }

// MODAL METHODS
  setInput = e => {
    this.setState( { inputModalShow : true } );
  }

  inputUpdate = e => {
    this.setState( { input : this.inputRef.value, inputRan : this.inputRef.value } );
  }

  inputModalClose = e => {
    this.setState( { inputModalShow : false } );
  }

  outputModalOpen = e => {
    this.setState( { outputModalShow : true } );
  }

  outputModalClose = e => {
    this.setState( { outputModalShow : false } );
  }

// RENDER
  render() {
    if ( localStorage.getItem( 'theme' ) !== null ) {
      document.body.classList.replace( localStorage.getItem( 'theme' ) === 'light' ? 'dark' : 'light', localStorage.getItem( 'theme' ) );
    } else {
      document.body.classList.add( 'light' );

      localStorage.setItem( 'theme', 'light' );
    }
    
    const activeLineInCode = this.state.memoryToLine[ this.state.activeLine ];
    const lastLineInCode = this.state.memoryToLine[ this.state.lastLine ];
    
    var activeHeightOfOverlay = undefined;
    var lastHeightOfOverlay = undefined;

    if ( this.state.lastLine !== this.state.activeLine ) {
      lastHeightOfOverlay = ( ( lastLineInCode ) * 25 ) + ( 4 ); // 4 for border
    }

    if ( !( this.state.halted ) ) {
      activeHeightOfOverlay = ( ( activeLineInCode ) * 25 ) + ( 4 ); // 4 for border
    }

    return(
      <React.Fragment>
        <NavBar pathname={'/#' + this.props.location.pathname} />
        
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
                ref={ ref => { this.inputRef = ref; } }
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
              <div className='output-area' style={{height : '508px'}}>
                {this.state.output}
              </div>
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
              { this.codeRef.current &&
                <OverlayTrigger
                  placement={'top'}
                  overlay={
                    <Tooltip>
                      {`Disable all breakpoints`}
                    </Tooltip>
                  }>
                  <Button variant='outline-secondary' size='sm' onClick={this.codeRef.current.disableBreakpoints}>
                    <FaTimes/>
                  </Button>
                </OverlayTrigger>
              }
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
              {' '}
              <OverlayTrigger
                key={`follow-memory-tooltip`}
                placement={'top'}
                overlay={
                  <Tooltip>
                    {`Follow memory execution`}
                  </Tooltip>
                }>
                <Button variant='outline-secondary' size='sm' onClick={this.toggleFollowMemory}>
                  { this.state.updateScrollPositionMemory ?
                    <FaEye/>
                  :
                    <FaEyeSlash/>
                  }
                </Button>
              </OverlayTrigger>
            </Col>
            <Col>
              <OverlayTrigger
                key={`hide-code-tooltip`}
                placement={'top'}
                overlay={
                  <Tooltip>
                    {`Hide the code chunk`}
                  </Tooltip>
                }>
                <Button variant='outline-secondary' size='sm' onClick={this.toggleCodeChunk} active={!(this.state.showCodeChunk)}>
                  <FaMinus/>
                </Button>
              </OverlayTrigger>
              {' '}
              <OverlayTrigger
                key={`follow-code-tooltip`}
                placement={'top'}
                overlay={
                  <Tooltip>
                    {`Follow code execution`}
                  </Tooltip>
                }>
                <Button variant='outline-secondary' size='sm' onClick={this.toggleFollowCode}>
                  { this.state.updateScrollPositionCode ?
                    <FaEye/>
                  :
                    <FaEyeSlash/>
                  }
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
              <div id='input-column-viewing' className='input-column viewing'>
                {this.inputColumn()}
              </div>
            </Col>
            <Col style={{borderRight:'2px solid #eaeef3'}}>
              {this.memoryColumn()}
              <div id='output-column-viewing' className='output-column viewing' onDoubleClick={this.resizeOutput}>
                {this.outputColumn()}
              </div>
            </Col>
            <Collapse in={this.state.showCodeChunk}>
              <Col>
                  <div id='code-area-wrapper' className='code-area-wrapper'>
                    <CodeChunk 
                      ref={this.codeRef}
                      code={this.state.code} 
                      breakpoints={this.state.breakpoints}
                      alertShow={this.state.alertShow}
                      readOnly={true}
                      className=' viewing'
                      codeMirrorClassName=' debug'
                      breakpointCallback={this.breakpointCallback}
                      lineNumbersMethod={this.createLineNumberColumn}
                      activeHeight={activeHeightOfOverlay}
                      lastHeight={lastHeightOfOverlay}
                      lineToScrollTo={this.state.updateScrollPositionCode ? this.state.lastLineScrollPosition : undefined} />
                  </div>
              </Col>
            </Collapse>
          </Row>
        </div>
      </React.Fragment>
    );
  }
}