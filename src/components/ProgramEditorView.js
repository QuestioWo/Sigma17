/*
  Copyright Jim Carty © 2020

  This file is subject to the terms and conditions defined in file 'LICENSE.txt', which is part of this source code package.
*/

import React from 'react';

import './ProgramEditorView.css';

import { Link } from 'react-router-dom';
import { Alert, Button, ButtonGroup, Col, Dropdown, FormControl, InputGroup, Modal, OverlayTrigger, Row, ToggleButton, ToggleButtonGroup, Tooltip } from 'react-bootstrap';
import { FaBug, FaChevronDown, FaDownload, FaHammer, FaPen, FaPlay, FaTimes, FaUpload } from 'react-icons/fa';

import * as Emulator from './utils/Emulator';

import { CustomToggle, CustomMenu } from './utils/CustomDropdown';
import CodeChunk from './utils/CodeChunk';
import NavBar from './NavBar';

export default class ProgramEditorView extends React.PureComponent {
// CLASS METHODS
  constructor( props, context ) {
    super( props );

    this.state = {
      code : '',
      breakpoints : [],

      alertShow : false,
      alertMessage : '',
      alertNature : 'success',

      runModalShow : false,
      outputZoomed : false,
      memoryViewStart : 0,
      memoryViewOptions : [0, 0x500], // generic values so it doesnt break if something goes catastrophically wrong

      inputModalShow : false,

      downloadModalShow : false,
      downloadAs : 0,
      fileName : 'S16DownloadFile',

      lineCompWarn : {},
      lineCompError : {},

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

    // this.codeChunkMounted = this.codeChunkMounted.bind( this );

    this.inputRef = React.createRef();
    this.codeRef = React.createRef();
  }

  componentDidMount() {
    if ( sessionStorage.getItem( 'code' ) !== null ) {
      const sessionProps = {
        code : sessionStorage.getItem( 'code' ),
        input : sessionStorage.getItem( 'input' ),
        breakpoints : sessionStorage.getItem( 'breakpoints' ).split( ',' ).map(
          breakpointString => {
            return( Number( breakpointString ) );
          }
        )
      };

      this.setState( sessionProps );
      this.codeRef.current.setState( sessionProps );
    } else if ( this.props.code !== undefined ) {
      this.setState( this.props );

      this.codeRef.current.setState( this.props );
    }
  }

  componentWillUnmount() {
    sessionStorage.setItem( 'code', this.codeRef.current.state.code );
    sessionStorage.setItem( 'input', this.state.input );
    sessionStorage.setItem( 'breakpoints', this.codeRef.current.state.breakpoints );
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
      <div
        className='output-area'
        onDoubleClick={this.resizeOutput}>
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

    return (
      <div id='memory-column-small' className='memory-column small'>
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
    const target = outputColumn.currentTarget;

    // if currently zoomed and are setting to smaller
    if ( this.state.outputZoomed ) {
      target.style.height = '72px';
    } else {
      target.style.height = '508px';
    }

    this.setState( prevState => ( { 
        outputZoomed : !( prevState.outputZoomed ) 
      } 
    ) );
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
        // document.getElementById( 'breakpoint ' + ( it + 1 ) ).className = document.getElementById( 'breakpoint ' + ( it + 1 ) ).className + ' error';
        ranSuccessfully = false;
      }
    }

    return [ranSuccessfully, lineErrorCopy];
  }

// PARSING METHOD
  parseCode = button => {    
    const code = this.codeRef.current.state.code;

    this.codeRef.current.checkCode( code, 0, Infinity );

    const lines = code.split( '\n' );
    
    var currentLine = 0;

    var parsed = {};
    var labels = {};
    var justLabelOffset = 0;

    var machineCode = [];

    const check = this.checkCode( code );

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
    console.time( 'Time to run' );

    const code = this.codeRef.current.state.code;

    const check = this.checkCode( code );
    if ( check[0] ) {
      // implicit build if needed
      var machineCode = [];
      machineCode = this.parseCode();

      var canRun = this.canRunCode( code, machineCode );
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

        this.memoryOptions( localMemory );

        this.setState( { 
          cpuControl : localControl, 
          registers : localRegisters,
          memory : localMemory, 
          output : localOutput, 
          
          outputZoomed : false, 
          runModalShow : true,
          
          memoryViewStart : 0
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
    console.timeEnd( 'Time to run' );
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
    const check = this.checkCode( this.codeRef.current.state.code );

    if ( check[0] ) {
      var textValue = this.state.fileName;
      if ( !( textValue.endsWith( '.asm.txt' ) ) ) {
        textValue += '.asm.txt';
      }

      this.downloadFile( textValue, this.codeRef.current.state.code );
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
    const check = this.checkCode( this.codeRef.current.state.code );

    var i = 0;
    var keys;
    var keysString;

    if ( check[0] ) {
      const checkCompatible = Emulator.checkCodeIsCompatible( this.codeRef.current.state.code );
      if ( checkCompatible[0] ) {
        var textValue = this.state.fileName;
        if ( !( textValue.endsWith( '.asm.txt' ) ) ) {
          textValue += '.asm.txt';
        }

        this.downloadFile( textValue, Emulator.parseCodeToCompatible( this.codeRef.current.state.code ) );

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
    const check = this.checkCode( this.codeRef.current.state.code );

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
    const check = this.checkCode( this.codeRef.current.state.code );

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
    const check = this.checkCode( this.codeRef.current.state.code );

    var i = 0;
    var keys;
    var keysString;

    if ( check[0] ) {
      const checkCompatible = Emulator.checkCodeIsCompatible( this.codeRef.current.state.code );
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

      this.codeRef.current.setState( { code : newCode } );
    }

    reader.readAsArrayBuffer( e.target.files[0] );
  }

// RENDER
  render() {
    if ( localStorage.getItem( 'theme' ) !== null ) {
      document.body.classList.replace( localStorage.getItem( 'theme' ) === 'light' ? 'dark' : 'light', localStorage.getItem( 'theme' ) );
    } else {
      document.body.classList.add( 'light' );

      localStorage.setItem( 'theme', 'light' );
    }
    
    return(
      <React.Fragment>
        <NavBar pathname={'/#' + this.props.location.pathname} />
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
                  <React.Fragment>
                    {this.memoryColumn()}
                  </React.Fragment>
                }
                <div id='output-column' className='output-column'>
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
              <Link to={{pathname : '/debug'}}>
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
              <CodeChunk 
                ref={this.codeRef}
                code={this.state.code} 
                breakpoints={this.state.breakpoints}
                lineCompWarn={this.state.lineCompWarn} 
                lineCompError={this.state.lineCompError}
                alertShow={this.state.alertShow}
                readOnly={false} />
            </Col>
          </Row>
        </div>
      </React.Fragment>
    );
  }
}