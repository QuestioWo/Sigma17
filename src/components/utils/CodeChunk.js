/*
  Copyright Jim Carty © 2020

  This file is subject to the terms and conditions defined in file 'LICENSE.txt', which is part of this source code package.
*/

import React from 'react';

import 'codemirror/lib/codemirror.css';

import { OverlayTrigger, Tooltip } from 'react-bootstrap';

import * as Emulator from './Emulator';

import { Controlled as CodeMirror } from 'react-codemirror2';

require( './mode/sigma16' );

export default class CodeMirrorComponent extends React.Component {
// CLASS METHODS
  constructor( props, context ) {
    super( props, context );

    this.state = {
      code : props.code,
      breakpoints : props.breakpoints,

      lineError : {}
    };
  }

  componentDidMount() {
    this.checkCode( this.state.code, 0, Infinity, true );
  }

// CHECKING METHODS
  checkCode( code, changedLineFrom, changedLineTo, updateState=false ) {
    var lines = code.split( '\n' );
    var check;

    var lineErrorCopy = this.state.lineError;

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

    for ( i = changedLineFrom; i < lines.length && i <= changedLineTo; i++ ) {
      check = Emulator.checkLine( lines[i], labels );
      if ( check.length ) {
        lineErrorCopy[i + 1] = check;
        ranSuccessfully = false;
      } else {
        delete lineErrorCopy[i + 1]
      }
    }

    if ( updateState ) {
      this.setState( { code : code, lineError : lineErrorCopy } );
    } else {
      return [ranSuccessfully, lineErrorCopy];
    }
  }

// BREAKPOINTS
  breakpointsColumn() {
    var breakpoints = [];
    var linesDotted = [];

    if ( this.props.lineToScrollTo ) {
      const codeAreaParent = document.getElementById( 'code-area' );
      codeAreaParent.scrollTo( 0, this.props.lineToScrollTo );
    }

    const lines = this.state.code.split( '\n' );

    var lineCompWarnKeys = [];
    var lineCompErrorKeys = [];

    if ( this.props.lineCompWarn ) { 
      lineCompWarnKeys = Object.keys( this.props.lineCompWarn );
      lineCompErrorKeys = Object.keys( this.props.lineCompError );
    }

    if ( this.props.lineCompError ) {
      for ( var i = 0; i < lineCompErrorKeys.length; i++ ) {
        const lineI = lineCompErrorKeys[i] - 1;

        if ( !( linesDotted.includes( lineI ) ) && lineI <= lines.length ) {
          const styleTop = ( 25 * ( lineI + 0.75 ) ) + 3 +'px';

          breakpoints.push( 
            <OverlayTrigger
              key={'breakpoint ' + ( lineI + 1 ) + ' comperror tooltip'}
              placement={'right'}
              overlay={
                <Tooltip>
                  {this.props.lineCompError[lineI + 1]['error']}
                </Tooltip>
              }>
              <div 
                key={'breakpoint ' + ( lineI + 1 )}
                id={'breakpoint ' + ( lineI + 1 )} 
                className={'breakpoint ' + ( lineI + 1 ) + ' comperror'} 
                style={{top : styleTop}} 
                onClick={this.breakpointOnClick}/>
            </OverlayTrigger>
          );

          linesDotted.push( lineI );
        }
      }
    }

    if ( this.props.lineCompWarn ) {
      for ( var it = 0; it < lineCompWarnKeys.length; it++ ) {
        const lineI = lineCompWarnKeys[it] - 1;

        if ( !( linesDotted.includes( lineI ) ) && lineI <= lines.length ) {
          const styleTop = ( 25 * ( lineI + 0.75 ) ) + 3 +'px';

          breakpoints.push( 
            <OverlayTrigger
              key={'breakpoint ' + ( lineI + 1 ) + ' compwarn tooltip'}
              placement={'right'}
              overlay={
                <Tooltip>
                  {this.props.lineCompWarn[lineI + 1]['warn']}
                </Tooltip>
              }>
              <div 
                key={'breakpoint ' + ( lineI + 1 )}
                id={'breakpoint ' + ( lineI + 1 )} 
                className={'breakpoint ' + ( lineI + 1 ) + ' compwarn'} 
                style={{top : styleTop}} 
                onClick={this.breakpointOnClick}/>
            </OverlayTrigger>
          );

          linesDotted.push( lineI );
        }
      }
    }
    
    for ( var ite = 0; ite < this.state.breakpoints.length; ite++ ) {
      const lineI = this.state.breakpoints[ite] - 1;

      if ( !( linesDotted.includes( lineI ) ) && lineI <= lines.length ) {
        const styleTop = ( 25 * ( lineI + 0.75 ) ) + 3 +'px';

        breakpoints.push( 
          <div 
            key={'breakpoint ' + ( lineI + 1 )}
            id={'breakpoint ' + ( lineI + 1 )} 
            className={'breakpoint active'} 
            style={{top : styleTop}} 
            onClick={this.breakpointOnClick}/>
        );
      }
    }
 
    return( breakpoints );
  }
  //
  breakpointOnClick = breakpoint => {
    var breakpointsCopy = this.state.breakpoints;

    const lineNo =  Number( breakpoint.currentTarget.id.slice( 'breakpoint '.length, breakpoint.currentTarget.id.length ) );

    const index = breakpointsCopy.indexOf( lineNo );
    breakpointsCopy.splice( index, 1 );

    if ( this.props.breakpointCallback ) {
      this.props.breakpointCallback( lineNo, false );
    }

    this.setState( { breakpoints : breakpointsCopy } );
  }

  breakpointToggle = ( editor, lineNumber ) => {
    var breakpointsCopy = this.state.breakpoints;
    
    if ( breakpointsCopy.includes( lineNumber + 1 ) ) {
      const index = breakpointsCopy.indexOf( lineNumber + 1 );
      breakpointsCopy.splice( index, 1 );

      if ( this.props.breakpointCallback ) {
        this.props.breakpointCallback( breakpointsCopy );
      }
    } else {
      breakpointsCopy.push( lineNumber + 1 );

      if ( this.props.breakpointCallback ) {
        this.props.breakpointCallback( breakpointsCopy );
      }
    }

    if ( breakpointsCopy.includes( 0 ) ) {
      const index0 = breakpointsCopy.indexOf( 0 );
      breakpointsCopy.splice( index0, 1 );

      if ( this.props.breakpointCallback ) {
        this.props.breakpointCallback( breakpointsCopy );
      }
    }

    this.setState( { breakpoints : breakpointsCopy } );
  }

  disableBreakpoints = e => {
    this.setState( { breakpoints : [] } );

    if ( this.props.breakpointCallback ) {
      this.props.breakpointCallback( [] );
    }
  }

// LINE NUMBER
  lineNumberCallBack = e => {
    this.breakpointToggle( null, Number( e.target.innerText ) - 1 );
  }

// LINE OVERLAYS
  activeLineOverlay( heightOfOverlay ) {
    var overlayDisplay = 'block';

    var lineNoWidth = 21; // min-width of 20 + 1 for border 
    var lineNoWidthLength = ( Math.log( this.state.code.split( '\n' ).length ) * Math.LOG10E + 1 ) | 0;

    if ( lineNoWidthLength >= 2 ) {
      lineNoWidth = ( ( lineNoWidthLength * 9 ) + 10 ); // 9 for number padding and 1 for number column border
    }

    lineNoWidth = ( lineNoWidth + 16 ) + 'px'; //16 for breakpoint column

    if ( isNaN( heightOfOverlay ) ) {
      overlayDisplay = 'none';
      heightOfOverlay = '0px';
    }
    
    return(
      <div 
        style={{marginTop : heightOfOverlay, marginLeft : lineNoWidth, display : overlayDisplay}} 
        className='line-overlay active'
        id='line-overlay-active'
      />
    );
  }

  lastLineOverlay( heightOfOverlay ) {
    // if program has at least been stepped through
    var overlayDisplay = 'block';

    var lineNoWidth = 21;
    var lineNoWidthLength = ( Math.log( this.state.code.split( '\n' ).length ) * Math.LOG10E + 1 ) | 0;

    if ( lineNoWidthLength >= 2 ) {
      lineNoWidth = ( ( lineNoWidthLength * 9 ) + 10 );
    }

    lineNoWidth = ( lineNoWidth + 16 ) + 'px'; // 25 because 16 for breakpoint column, 8 for number padding and 1 for number column border

    if ( isNaN( heightOfOverlay ) ) {
      overlayDisplay = 'none';
      heightOfOverlay = '0px';
    }

    return(
      <div 
        style={{marginTop : heightOfOverlay, marginLeft : lineNoWidth, display : overlayDisplay}} 
        className='line-overlay last' 
        id='line-overlay-last'
      />
    );
  }

// RENDER
  render() {
    return(
      <React.Fragment>
        <div 
          id="code-area" 
          className={ this.props.alertShow ? 'code-area squished ' : 'code-area ' + this.props.className }>
          <div id='breakpoint-column' className='breakpoint-column'>
            {this.breakpointsColumn()}
          </div>
          { this.props.lineNumbersMethod &&
            <div className='line-numbers-column'>
              {this.props.lineNumbersMethod( this.lineNumberCallBack )}
            </div>
          }
          { this.props.activeHeight &&
            <React.Fragment>
              {this.activeLineOverlay( this.props.activeHeight )}
            </React.Fragment>
          }
          { this.props.lastHeight &&
            <React.Fragment>
              {this.lastLineOverlay( this.props.lastHeight )}
            </React.Fragment>
          }
          <CodeMirror
            value={this.state.code}
            className={this.props.codeMirrorClassName}
            onBeforeChange={(editor, data, value) => {
              if ( data.origin === "paste" && data.to.line === ( this.state.code.split( '\n' ).length - 1 ) ) {
                this.checkCode( value, data.from.line, Infinity, true );
              }
              this.checkCode( value, data.from.line, data.to.line, true );
            }}
            onGutterClick={this.breakpointToggle}
            options={{mode : 'sigma16', lineNumbers : this.props.lineNumbersMethod ? false : true, readOnly : this.props.readOnly}}
            autoCursor/>
        </div>
      </React.Fragment>
    );
  }
}