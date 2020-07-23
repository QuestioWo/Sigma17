/*
  Copyright Jim Carty © 2020

  This file is subject to the terms and conditions defined in file 'LICENSE.txt', which is part of this source code package.
*/

import React from 'react';

import 'codemirror/lib/codemirror.css';
import './ProgramEditorView.css';

import { Link } from 'react-router-dom';
import { Alert, Button, ButtonGroup, Col, FormControl, InputGroup, Modal, OverlayTrigger, Row, ToggleButton, ToggleButtonGroup, Tooltip } from 'react-bootstrap';
import { FaBug, FaCheck, FaChevronDown, FaDownload, FaHammer, FaPen, FaPlay, FaTimes, FaUpload } from 'react-icons/fa';
import CodeMirror from 'react-codemirror';

import * as Emulator from './utils/Emulator';

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
      outputZoomed : false,

      inputModalShow : false,

      downloadModalShow : false,
      downloadAs : 0,
      fileName : 'S16DownloadFile',

      lineCompWarn : {},
      lineCompError : {},

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

      output : '',

      input : ''
    };

    this.inputRef = React.createRef();
  }

  componentDidMount() {
    if ( this.props.location.state ) {
      this.setState( this.props.location.state );
    } else if ( this.props.code !== undefined ) {
      this.setState( this.props );
    }
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
        var yOffset = 25 * ( i + 0.75 );
        var styleTop = yOffset + 3 +'px';

        var id = 'breakpoint ' + ( i + 1 );
        var className = 'breakpoint ' + ( i + 1 );

        if ( this.state.breakpoints.includes( i + 1 ) ) {
          className = className + ' active';
        } 

        var error = '';

        if ( Object.keys( this.state.lineError ).includes( String( i + 1 ) ) ) {
          className = className + ' error';

          error = this.state.lineError[String( i + 1 )];

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
        } else if ( Object.keys( this.state.lineCompWarn ).includes( String( i + 1 ) ) ) {
          className = className + ' compwarn';

          error = this.state.lineCompWarn[String( i + 1 )]['warn'];

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
        } else if ( Object.keys( this.state.lineCompError ).includes( String( i + 1 ) ) ) {
          className = className + ' comperror';

          error = this.state.lineCompError[String( i + 1 )]['error'];

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
  }

  disableBreakpoints = button => {
    this.setState( { breakpoints : [], lineError : {}, lineCompWarn : {}, lineCompError : {} } );
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
      memoryValues.push( 
        <div 
          key={'memory ' + memoryKeys[i]}
          id={'memory ' + memoryKeys[i]}
          className={'systeminfo-column-elem'}>
          <Row>
            <Col>
              <strong>${Emulator.writeHex( memoryKeys[i] )}</strong>
            </Col>
            <Col style={{textAlign:'right'}}>
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
    this.setState( { alertMessage : message, alertNature : nature, alertShow : true } );
  }

  closeAlert = alert => {
    this.setState( { alertShow : false } );
  }

// RUN MODAL METHODS
  runModalClose = modal => {
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
    var lines = code.split( '\n' );
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

    this.setState( { lineError : lineErrorCopy } );

    return [ranSuccessfully, lineErrorCopy];
  }

// PARSING METHOD
  parseCode = button => {
    var lines = this.state.code.split( '\n' );
    
    var currentLine = 0;

    var parsed = {};
    var labels = {};
    var justLabelOffset = 0;

    var machineCode = [];

    var check = this.checkCode( this.state.code );

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
      this.setState( { machineCode : machineCode, machineCodeUpdated : true } );

      this.updateAlert( 'Built successfully', 'success' );
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

    this.setState( { registers : registersNew, cpuControl : cpuControlNew, output : outputNew } );
  }

  canRunCode( code, machineCode ) {
    var error = true;

    if ( machineCode.length !== 0 ) {
      if ( !machineCode.includes( 0xd000 ) ) {
        error = 'Cannot run code without a "trap R0,R0,R0" instruction';
      }
    } else {
      // machine language is blank
      error = 'Cannot run no code. Try building then running';
    }
    return error;
  }

  runCode = button => {
    var check = this.checkCode( this.state.code );

    if ( check[0] ) {
      // implicit build if needed
      var machineCode = [];
      if ( this.state.machineCodeUpdated ) {
        machineCode = this.state.machineCode;
      } else {
        machineCode = this.parseCode();
      }

      var canRun = this.canRunCode( this.state.code, machineCode );
      var ran = {
        halted : false
      };

      if ( !canRun.length ) {
        var localControl = this.state.cpuControl;
        var localRegisters = this.state.registers;
        var localMemory = Emulator.setMemory( machineCode );
        var localInput = this.state.input;
        var localOutput = this.state.output;

        while ( !( ran['halted'] ) ) {
          ran = Emulator.runMemory( localControl, localRegisters, localMemory, localInput, localOutput );

          localInput = ran['input'];
          localOutput = ran['output'];
        }

        this.setState( { 
          cpuControl : localControl, 
          registers : localRegisters,
          memory : localMemory, 
          output : localOutput, 
          outputZoomed : false, 
          runModalShow : true 
        } );
      } else {
        this.updateAlert( canRun, 'danger' );
      }
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
    }
  }

// INPUT MODAL METHODS
  setInput = button => {
    this.setState( { inputModalShow : true } );
  }

  inputUpdate = textarea => {
    this.setState( { input : this.inputRef.value } );
  }

  inputModalClose = modal => {
    this.setState( { inputModalShow : false } );
  }

// DOWNLOADING METHODS
  downloadFile( name, content, mimeType='text/plain' ) {
    var element = document.createElement( 'a' );
    element.setAttribute( 'href', 'data:' + mimeType + ';charset=utf-8,' + encodeURIComponent( content ) );
    element.setAttribute( 'download', name );

    element.style.display = 'none';
    document.body.appendChild( element );

    element.click();

    document.body.removeChild( element );
  }

  downloadRaw = button => {
    const check = this.checkCode( this.state.code );

    if ( check[0] ) {
      var textValue = this.state.fileName;
      if ( !( textValue.endsWith( '.asm.txt' ) ) ) {
        textValue += '.asm.txt';
      }

      this.downloadFile( textValue, this.state.code );
      this.updateAlert( 'Download successful', 'success' );
    } else {
      var keys = Object.keys( check[1] );
      var keysString = '';

      for ( var i = 0; i < keys.length; i++ ) {
        if ( i !== 0 ) {
          keysString += ', ';
        }

        keysString += keys[i];
      }

      this.updateAlert( 'Download cannot continue as code does not build and therefore will be uncompatible. Errors at line(s): ' + keysString, 'danger' );
    }
  }

  downloadRawCompatible() {
    const check = this.checkCode( this.state.code );

    var i = 0;
    var keys;
    var keysString;

    if ( check[0] ) {
      const checkCompatible = Emulator.checkCodeIsCompatible( this.state.code );
      if ( checkCompatible[0] ) {
        var textValue = this.state.fileName;
        if ( !( textValue.endsWith( '.asm.txt' ) ) ) {
          textValue += '.asm.txt';
        }

        this.downloadFile( textValue, Emulator.parseCodeToCompatible( this.state.code ) );

        keys = Object.keys( checkCompatible[1] );
        if ( keys.length ) {
          keysString = '';

          for ( i = 0; i < keys.length; i++ ) {
            if ( i !== 0 ) {
              keysString += ', ';
            }

            keysString += keys[i];
          }

          this.setState( { lineCompWarn : checkCompatible[1], lineCompError : checkCompatible[2] } );
          this.updateAlert( 'Download shall continue however, some only partially compatible commands in code at line(s): ' + keysString, 'warning' );
        } else {
          this.setState( { lineCompWarn : {}, lineCompError : {} } );
          this.updateAlert( 'Download successful', 'success' );
        }
      } else {
        keys = Object.keys( checkCompatible[2] );
        keysString = '';

        for ( i = 0; i < keys.length; i++ ) {
          if ( i !== 0 ) {
            keysString += ', ';
          }

          keysString += keys[i];
        }

        this.setState( { lineCompWarn : checkCompatible[1], lineCompError : checkCompatible[2] } );
        this.updateAlert( 'Download cannot continue as some fully non compatible commands in code at line(s): ' + keysString, 'danger' );
      }
    } else {
      keys = Object.keys( check[1] );
      keysString = '';

      for ( i = 0; i < keys.length; i++ ) {
        if ( i !== 0 ) {
          keysString += ', ';
        }

        keysString += keys[i];
      }

      this.updateAlert( 'Download cannot continue as code does not build and therefore will be uncompatible. Errors at line(s): ' + keysString, 'danger' );
    }
  }

  downloadBinary() {
    const check = this.checkCode( this.state.code );

    if ( check[0] ) {
      var machineCode = this.parseCode();

      var textValue = this.state.fileName;
      textValue += '.bin';

      var stream = new Uint16Array( machineCode.length );
      for ( var i = 0; i < machineCode.length; i++ ) {
        const hiByte = ( machineCode[i] & 0xff00 ) >> 8;
        const loByte = machineCode[i] & 0x00ff;

        stream[i] = ( loByte << 8 ) | hiByte;
      }

      var blob = new Blob( [stream] ),
        url = window.URL.createObjectURL(blob);
      
      var element = document.createElement( 'a' );
      element.setAttribute( 'href', url );
      element.setAttribute( 'download', textValue );

      element.style.display = 'none';

      document.body.appendChild(element);

      element.click();
      
      document.body.removeChild( element );

      this.updateAlert( 'Download successful', 'success' );
    } else {
      var keys = Object.keys( check[1] );
      var keysString = '';

      for ( var it = 0; it < keys.length; it++ ) {
        if ( it !== 0 ) {
          keysString += ', ';
        }

        keysString += keys[it];
      }

      this.updateAlert( 'Download cannot continue as code does not build and therefore will be uncompatible. Errors at line(s): ' + keysString, 'danger' );
    }
  }

  downloadHex() {
    const check = this.checkCode( this.state.code );

    if ( check[0] ) {
      var machineCode = this.parseCode();
      var stream = '';

      for ( var i = 0; i < machineCode.length; i++ ) {
        stream += 'data $' + Emulator.writeHex( machineCode[i] ) + '\n';
      }

      var textValue = this.state.fileName;
      if ( !( textValue.endsWith( '.asm.txt' ) ) ) {
        textValue += '.asm.txt';
      }

      this.downloadFile( textValue, stream );
      this.updateAlert( 'Download successful', 'success' );
    } else {
      var keys = Object.keys( check[1] );
      var keysString = '';

      for ( var it = 0; it < keys.length; it++ ) {
        if ( it !== 0 ) {
          keysString += ', ';
        }

        keysString += keys[it];
      }

      this.updateAlert( 'Download cannot continue as code does not build and therefore will be uncompatible. Errors at line(s): ' + keysString, 'danger' );
    }
  }

  downloadHexCompatible() {
    const check = this.checkCode( this.state.code );

    var i = 0;
    var keys;
    var keysString;

    if ( check[0] ) {
      const checkCompatible = Emulator.checkCodeIsCompatible( this.state.code );
      if ( checkCompatible[0] ) {
        var machineCode = this.parseCode();
        var stream = '';

        for ( i = 0; i < machineCode.length; i++ ) {
          stream += ' data $' + Emulator.writeHex( machineCode[i] ) + '\n';
        }

        var textValue = this.state.fileName;
        if ( !( textValue.endsWith( '.asm.txt' ) ) ) {
          textValue += '.asm.txt';
        }

        this.downloadFile( textValue, stream );
        this.updateAlert( 'Download successful', 'success' );

        keys = Object.keys( checkCompatible[1] );
        if ( keys.length ) {
          keysString = '';

          for ( i = 0; i < keys.length; i++ ) {
            if ( i !== 0 ) {
              keysString += ', ';
            }

            keysString += keys[i];
          }

          this.setState( { lineCompWarn : checkCompatible[1], lineCompError : checkCompatible[2] } );
          this.updateAlert( 'Download can continue however, some only partially compatible commands in code at line(s): ' + keysString, 'warning' );
        } else {
          this.setState( { lineCompWarn : {}, lineCompError : {} } );
          this.updateAlert( 'Download successful', 'success' );
        }
      } else {
        keys = Object.keys( checkCompatible[2] );
        keysString = '';

        for ( i = 0; i < keys.length; i++ ) {
          if ( i !== 0 ) {
            keysString += ', ';
          }

          keysString += keys[i];
        }

        this.setState( { lineCompWarn : checkCompatible[1], lineCompError : checkCompatible[2] } );
        this.updateAlert( 'Download cannot continue as some fully non compatible commands in code at line(s): ' + keysString, 'danger' );
      }
    } else {
      keys = Object.keys( check[1] );
      keysString = '';

      for ( i = 0; i < keys.length; i++ ) {
        if ( i !== 0 ) {
          keysString += ', ';
        }

        keysString += keys[i];
      }

      this.updateAlert( 'Download cannot continue as code does not build and therefore will be uncompatible. Errors at line(s): ' + keysString, 'danger' );
    }
  }

  fileNameUpdate = textarea => {
    this.setState( { fileName : textarea.target.value } );
  }

  fileNameHandleKeyDown = e => {
    if (e.key === 'Enter') {
      this.downloadModalClose();
    }
  }

  downloadModalClose = modal => {
    switch ( this.state.downloadAs ) {
      case 0 :
        this.downloadRaw();
        break;

      case 1 :
        this.downloadRawCompatible();
        break;

      case 2 :
        this.downloadBinary();
        break;

      case 3 :
        this.downloadHex();
        break;

      case 4 :
        this.downloadHexCompatible();
        break;

      default :
        this.updateAlert( 'Download cannot continue due to internal website error. Try to contact Jim Carty.', 'danger' );
        break;
    }

    this.setState( { downloadModalShow : false } );
  }

  downloadModalCloseNon = modal => {
    this.setState( { downloadModalShow : false } );
  }

  downloadModalOpen = button => {
    this.setState( { downloadModalShow : true } );
  }

  downloadModalRadio = value => {
    this.setState( { downloadAs : value } );
  }

  getExtension() {
    var result = '';

    switch ( this.state.downloadAs ) {
      case 0 :
        result = '.asm.txt';
        break;

      case 1 :
        result = '.asm.txt';
        break;

      case 2 :
        result = '.bin';
        break;

      case 3 :
        result = '.asm.txt';
        break;

      case 4 :
        result = '.asm.txt';
        break;

      default :
        this.updateAlert( 'Download cannot continue due to internal website error. Try to contact Jim Carty.', 'danger' );
    }

    return result;
  }

// UPLOADING METHODS
  uploadDisplay = button => {
    document.getElementById( 'binary-upload' ).click();
  }

  uploadFile = e => {
    var reader = new FileReader();
    reader.onload = () => {
      var array = new Uint16Array( reader.result )
      var newCode = '';

      for ( var i = 0; i < array.length; i++ ) {
        const hiByte = ( array[i] & 0xff00 ) >> 8;
        const loByte = array[i] & 0x00ff;

        newCode += 'data $' + Emulator.writeHex( ( loByte << 8 ) | hiByte );
        if ( i !== ( array.length - 1 ) ) {
          newCode += '\n'
        }
      }

      this.updateCode( newCode );

      // highlighting toggles required as CodeMirror component does not update properly
      if ( this.state.highlightedCodeChunk ) {
        this.toggleHighlighting();
        this.toggleHighlighting();
      }
    }

    reader.readAsArrayBuffer( e.target.files[0] );
  }

// CODEMIRROR METHODS
  updateCode = newCode => {
    if ( !( newCode.split( '\n' ).length > 500 ) ) {
      this.checkCode( newCode );
    }

    // updating code based on contents of codemirror
    if ( newCode ) {
      this.setState( { code : newCode, machineCodeUpdated : false } );
    } else {
      this.setState( { code : ' ', machineCodeUpdated : false } );
    }
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
    if ( !( divContent.target.value.split( '\n' ).length > 500 ) ) {
      this.checkCode( divContent.target.value );
    }

    if ( divContent.target.value ) {
      this.setState( { code : divContent.target.value, machineCodeUpdated : false } );
    } else {
      this.setState( { code : ' ', machineCodeUpdated : false } );
    }
  }

  toggleHighlighting = button => {
    this.setState( { highlightedCodeChunk : !( this.state.highlightedCodeChunk ) } );
  }

  codeChunkHandleKeyDown = e => {
    var element = document.getElementById( 'code-chunk-column' );
    var text = element.value;
    var handled = false;

    // Enter Key?
    if ( e.keyCode === 13 ) {
      // selection?
      if ( element.selectionStart === element.selectionEnd ) {
        // find start of the current line
        var sel = element.selectionStart;
        while ( sel > 0 && text[sel-1] !== '\n' ) sel--;

        var lineStart = sel;
        while ( text[sel] === ' ' || text[sel] === '\t' ) sel++;

        if ( sel > lineStart ) {
          // Insert carriage return and indented text
          document.execCommand( 'insertText', false, "\n" + text.substr( lineStart, sel - lineStart ) );

          // Scroll caret visible
          element.blur();
          handled = true;
        }
      }
    }

    // Tab key?
    if( e.keyCode === 9 ) {
      // selection?
      if ( element.selectionStart === element.selectionEnd ) {
        // These single character operations are undoable
        if ( !e.shiftKey ) {
          document.execCommand( 'insertText', false, "  " );
          handled = true;
        } else {
          if ( element.selectionStart > 0 && text[element.selectionStart-1] === '\t' ) {
            document.execCommand( 'delete' );
            handled = true;
          } else if ( element.selectionStart > 0 && text.slice( element.selectionStart - 2, element.selectionStart ) === '  ' ) {
            document.execCommand( 'delete' );
            document.execCommand( 'delete' );
            handled = true;
          }
        }
      } else {
        // Block indent/unindent trashes undo stack.
        // Select whole lines
        var selStart = element.selectionStart;
        var selEnd = element.selectionEnd;
        while ( selStart > 0 && text[selStart-1] !== '\n' ) selStart--;
        while ( selEnd > 0 && text[selEnd-1] !== '\n' && selEnd < text.length ) selEnd++;

        // Get selected text
        var lines = text.substr( selStart, selEnd - selStart ).split( '\n' );

        // Insert tabs
        for ( var i = 0; i < lines.length; i++ ) {
          // Don't indent last line if cursor at start of line
          if ( i === lines.length - 1 && lines[i].length === 0) continue;

          // Tab or Shift+Tab?
          if ( e.shiftKey ) {
            if ( lines[i].startsWith( '\t' ) ) {
              lines[i] = lines[i].substr( 1 );
            } else if ( lines[i].startsWith( "  " ) ) {
              lines[i] = lines[i].substr( 2 );
            }
          } else {
            lines[i] = "  " + lines[i];
          }
        }
        lines = lines.join( '\n' );

        // Update the text area
        element.value = text.substr( 0, selStart ) + lines + text.substr( selEnd );
        element.selectionStart = selStart;
        element.selectionEnd = selStart + lines.length; 
        handled = true;
      }
    }

    if ( handled ) e.preventDefault();

    element.focus();
  }

// RENDER
  render() {
    return(
      <React.Fragment>
        <NavBar state={{code : this.state.code, breakpoints : this.state.breakpoints, input : this.state.input}}/>
        <Modal
          show={this.state.runModalShow}
          onHide={this.runModalClose}
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
                  <div id='memory-column-small' className='memory-column small'>
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
          show={this.state.downloadModalShow}
          onHide={this.downloadModalCloseNon}
          dialogClassName="downloadmodal"
          animation={false} >
          <Modal.Header closeButton>
            <Modal.Title>
              Export As...
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className='export-choices' style={{paddingBottom : '15px'}}>
              <ToggleButtonGroup 
                type='radio' 
                name='export-choices' 
                defaultValue={this.state.downloadAs} 
                onChange={this.downloadModalRadio}>
                <ToggleButton variant='outline-secondary' value={0}>
                  Raw
                </ToggleButton>
                <ToggleButton variant='outline-secondary' value={1}>
                  Raw compatible
                </ToggleButton>
                <ToggleButton variant='outline-secondary' value={2}>
                  Binary
                </ToggleButton>
                <ToggleButton variant='outline-secondary' value={3}>
                  Hex
                </ToggleButton>
                <ToggleButton variant='outline-secondary' value={4}>
                  Hex compatible
                </ToggleButton>
              </ToggleButtonGroup>
            </div>
            <InputGroup className='download-modal-column'>
              <FormControl
                id='download-modal-download'
                value={this.state.fileName}
                onChange={this.fileNameUpdate}
                onKeyDown={this.fileNameHandleKeyDown}
                autoFocus/>
              <InputGroup.Append>
                <InputGroup.Text>{this.getExtension()}</InputGroup.Text>
              </InputGroup.Append>
            </InputGroup>
            <div style={{paddingTop : '15px'}}>
              <OverlayTrigger
                key={`download-tooltip`}
                placement={'left'}
                overlay={
                  <Tooltip>
                    {`Download also started by pressing enter in file name field`}
                  </Tooltip>
                }>
                <Button variant='outline-secondary' onClick={this.downloadModalClose} style={{float : 'right'}}>
                  <FaDownload/> Download 
                </Button>
              </OverlayTrigger>
            </div>
          </Modal.Body>
        </Modal>

        <div className='mainbody'>
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
                      {`Build`}
                    </Tooltip>
                  }>
                  <Button variant='outline-secondary' size='sm' onClick={this.parseCode}>
                    <FaHammer/>
                  </Button>
                </OverlayTrigger>
                <OverlayTrigger
                  placement={'top'}
                  overlay={
                    <Tooltip>
                      {`Run`}
                    </Tooltip>
                  }>
                  <Button variant='outline-secondary' size='sm' onClick={this.runCode}>
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
              
              <Link to={{
                pathname : "/debug",
                state : {code : this.state.code, breakpoints : this.state.breakpoints, input : this.state.input}
                }}>
                <OverlayTrigger
                  placement={'top'}
                  overlay={
                    <Tooltip>
                      {`Run in debug mode`}
                    </Tooltip>
                  }>
                  <Button variant='outline-secondary' size='sm'>
                    <FaBug/>
                  </Button>
                </OverlayTrigger>
              </Link>
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
              <ButtonGroup>
                <OverlayTrigger
                  key={`export-tooltip`}
                  placement={'top'}
                  overlay={
                    <Tooltip>
                      {`Download current code as is`}
                    </Tooltip>
                  }>
                  <Button variant='outline-secondary' size ='sm' onClick={this.downloadRaw}>
                    <FaDownload/>
                  </Button>
                </OverlayTrigger>
                <OverlayTrigger
                  key={`export-choices-tooltip`}
                  placement={'top'}
                  overlay={
                    <Tooltip>
                      {`Download current code 
                      chunk in different formats`}
                    </Tooltip>
                  }>
                  <Button variant='outline-secondary' size ='sm' onClick={this.downloadModalOpen}>
                    <FaChevronDown/>
                  </Button>
                </OverlayTrigger>
              </ButtonGroup>
              {' '}
              <input
                type='file'
                id='binary-upload'
                onChange={this.uploadFile}
                style={{display : 'none'}}
                accept='.bin'/>
              <OverlayTrigger
                key={`upload-tooltip`}
                placement={'top'}
                overlay={
                  <Tooltip>
                    {`Upload a .bin file`}
                  </Tooltip>
                }>
                <Button variant='outline-secondary' size='sm' onClick={this.uploadDisplay}>
                  <FaUpload/>
                </Button>
              </OverlayTrigger>
            </Col>
          </Row>
          <Row>
            <Col>
              <div id="code-area" className='code-area'> 
                <div id='breakpoint-column' className='breakpoint-column'>
                  {this.breakpointsColumn( this.state.code )}
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
                      <InputGroup
                        as='textarea'
                        id='code-chunk-column'
                        className='code-chunk-column'
                        value={this.state.code}
                        onChange={this.codeBlockEdit}
                        onKeyDown={this.codeChunkHandleKeyDown}
                        autoFocus/>
                    }
                  </React.Fragment>
                }
              </div>
            </Col>
          </Row>
        </div>
      </React.Fragment>
    );
  }
}