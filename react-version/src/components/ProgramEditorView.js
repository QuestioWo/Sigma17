import React from 'react';

import 'codemirror/lib/codemirror.css';
import './ProgramEditorView.css';

import { Button, ButtonGroup, Col, Row, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { FaHammer, FaPlay, FaTimes } from 'react-icons/fa';
import CodeMirror from 'react-codemirror';

import NavBar from './NavBar';

require('./mode/sigma16');

const allCommands = ["add", "sub", "mul", "div", "cmp", "cmplt", "cmpeq", "cmpgt", "inv", "and", "or", "xor", "nop", "trap", 
                    "lea", "load", "store", "jump", "jumpc0", "jumpc1", "jumpf", "jumpt", "jal", 
                    "data"];

const rrrCommands = ["add", "sub", "mul", "div", "cmp", "cmplt", "cmpeq", "cmpgt", "inv", "and", "or", "xor", "nop", "trap"];
const rxCommands = ["lea", "load", "store", "jump", "jumpc0", "jumpc1", "jumpf", "jumpt", "jal"];
const xCommands = ["data"];

export default class ProgramEditorView extends React.Component {
// CLASS METHODS
  constructor( props, context ) {
    super( props );

    this.state = {
      code : '',
      breakpoints : [],

      lineError : {}
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

    let breakpoints = this.state.breakpoints;
    breakpoints.push( Number( breakpoint.currentTarget.id.slice( 'breakpoint '.length, breakpoint.currentTarget.id.length ) ) );
    this.setState( { breakpoints : breakpoints } );
  }

  disableBreakpoints = button => {
    this.setState( { breakpoints : [] } );
  }

// CHECKING METHODS
  isValidNumber( numString ) {
    var num = 0;

    if ( !isNaN( numString ) ) {
      num = parseInt( numString );
    } else if ( numString.startsWith( '$' ) ) {
      numString = numString.slice( 1, numString.length );
      num = parseInt( numString, 16 );
    }

    return ( num <= 65535 ) ? true : false;
  }

  checkXCommand( x ) {
    // check that x is a number, either hex or decimal
    if ( isNaN( x ) && !( this.isValidNumber( x ) ) ) {
      return 'data must be followed by either a decimal or hex number <= 65535';
    }
    return true;
  }

  checkRXCommand( rx ) {
    // check that rx is in the form of rd,disp[ra], where disp can be either hex, decimal, or a variable 
    if ( !( /r((1[0-5])|([0-9])),((\$(\d)|([a-f])|([A-F]))|(\d)|(\w))+\[r((1[0-5])|([0-9]))\]/.test( rx ) ) ) {
      return 'arguments must be in the form of "Rd,disp[Ra]"';
    }
    return true;
  }

  checkRRRCommand( rrr ) {
    // check that rrr is in the form of rd,ra,rb
    if ( !( /r((1[0-5])|([0-9])),r((1[0-5])|([0-9])),r((1[0-5])|([0-9]))/.test( rrr ) ) ) {
      return 'arguments must be in the form of "Rd,Ra,Rb"';
    }
    return true;
  }

  checkCommands( command, argument ) {
    var check = '';
    if ( rrrCommands.includes( command ) ) {
      // first word is an rrr command
      if ( argument ) { 
        // there is a second argument
        check = this.checkRRRCommand( argument );
        if ( check.length ) {
          // if rrr command doesnt follow requirements 
          return check;
        }
        // does follow requirements, and therefore function returns true
      } else {
        return command + ' must be followed by 3 registers in form Rx,Rx,Rx';
      }
    } else if ( rxCommands.includes( command ) ) {
      // first word is an rx command
      if ( argument ) { 
        // there is a second argument
        check = this.checkRXCommand( argument );
        if ( check.length ) {
          // if rrr command doesnt follow requirements 
          return check;
        }
        // does follow requirements, and therefore function returns true
      } else {
        return command + ' must be followed by arguments in the format of Rd,disp[Ra]';
      }
    } else if ( xCommands.includes( command ) ) {
      // first word is an x command i.e data
      if ( argument ) { 
        // there is a second argument
        check = this.checkXCommand( argument );
        if ( check.length ) {
          // 
          return check;
        }
      } else {
        return command + ' must be followed by a number, either decimal or hex ( preceeded by $ )';
      }
    } else {
      return 'not a valid rrr, rx or x command';
    }
    return true
  }

  checkLine( line ) {
    var linesplit = line.trim().split( ';' )[0].split( /\s+/ );
    var error = true;

    if ( linesplit[0] ) {
      // lines isnt empty
      if ( allCommands.includes( linesplit[0] ) ) {
        // first word is a command
        error = this.checkCommands( linesplit[0], linesplit[1] ); // will return error is arguments not present so dont have to check
      } else {
        // first word is not a command
        if ( /\w/.test( linesplit[0] ) ) {
          // first word is a label
          if ( linesplit[1] ) {
            // theres more after label
            if ( allCommands.includes( linesplit[1] ) ) {
              error = this.checkCommands( linesplit[1], linesplit[2] );
            } else {
              error = 'not a valid command following label';
            }
          }
          // just a label, therefore allowed and function returns true
        } else {
          error = 'first element of an instruction must be either a label or a command';
        }
      }
    }

    // return error, as it woud have updated to error message if probelm, otherwise, will have stayed positive
    return error;
  }

  checkCode( code ) {
    var lines = code.toLowerCase().split( '\n' );
    var check = true;

    let lineErrorCopy = {};

    var ranSuccessfully = true;

    for ( var i = 0; i < lines.length; i++ ) {
      check = this.checkLine( lines[i] );
      if ( check.length ) {
        lineErrorCopy[Number( i + 1 )] = check;
        ranSuccessfully = false;
      }
    }

    this.setState( { lineError : lineErrorCopy } );

    return ranSuccessfully;
  }

// PARSING METHODS
  parseLine( line ) {
    var machineCode = '';

    // if ( this.checkLine( line ).length ) return this.checkLine( line );

    // var linesplit = line.trim().split( ';' )[0].split( /\s+/ );

    return machineCode;
  }

  parseCode = button => {
    var lines = this.state.code.toLowerCase().split( '\n' );
    var machineCodeLine = '';

    if ( this.checkCode( this.state.code ) ) {
      for ( var i = 0; i < lines.length; i++ ) {
        machineCodeLine = this.parseLine( lines[i] );
      }



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
  }

  render() {
    return(
      <React.Fragment>
        <NavBar currentKey={ this.props.location.pathname }/>
        <div className='buttonstoolbar'>
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
                  <Button variant='outline-secondary' size='sm'>
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