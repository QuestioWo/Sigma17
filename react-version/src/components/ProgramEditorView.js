import React from 'react';

import 'codemirror/lib/codemirror.css';
import './ProgramEditorView.css';

import { Alert, Button, ButtonGroup, Col, Row, OverlayTrigger, Tooltip } from 'react-bootstrap';
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

      machineCode : []
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

// ALERT METHODS
  closeAlert = alert => {
    this.setState( { alertShow : false } );
  }

// CHECKING METHOD
  checkCode( code ) {
    var lines = code.toLowerCase().split( '\n' );
    var check = true;

    let lineErrorCopy = {};

    var ranSuccessfully = true;

    for ( var i = 0; i < lines.length; i++ ) {
      check = CompilationUtils.checkLine( lines[i] );
      if ( check.length ) {
        lineErrorCopy[Number( i + 1 )] = check;
        ranSuccessfully = false;
      }
    }

    this.setState( { lineError : lineErrorCopy } );

    return ranSuccessfully;
  }

// PARSING METHOD
  parseCode = button => {
    var lines = this.state.code.toLowerCase().split( '\n' );
    
    var currentLine = '0';

    var parsed = '';
    var labels = {};

    var machineCode = [];
    var machineCodeLine = [];

    if ( this.checkCode( this.state.code ) ) {
      for ( var i = 0; i < lines.length; i++ ) {
        parsed = CompilationUtils.parseLineForLabels( lines[i] );

        if ( parsed['label'] !== '' ) {
          labels[parsed['label']] = currentLine;
        }

        currentLine = ( parseInt( currentLine, 16 ) + parsed['instuctionWords'] ).toString( 16 );
      }

      for ( var it = 0; it < lines.length; it++ ) {
        machineCodeLine = CompilationUtils.parseLineForMachineCode( lines[it], labels ).split( '\n' );

        for ( var ite = 0; ite < machineCodeLine.length; ite++ ) {
          machineCode.push( machineCodeLine[ite] );
        }
      }
      this.setState( { machineCode : machineCode } );

      this.setState( { alertMessage : 'Built successfully' } );
      this.setState( { alertNature : 'success' } );
      this.setState( { alertShow : true } );
    } else {
      this.setState( { alertMessage : 'Built unsuccesfully, correct syntax errors' } );
      this.setState( { alertNature : 'danger' } );
      this.setState( { alertShow : true } );
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