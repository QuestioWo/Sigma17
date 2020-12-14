/*
  Copyright Jim Carty © 2020

  This file is subject to the terms and conditions defined in file 'LICENSE.txt', which is part of this source code package.
*/

import React from 'react';

import 'codemirror/lib/codemirror.css';

import { OverlayTrigger, Tooltip } from 'react-bootstrap';

import * as Emulator from './Emulator';

import { Controlled as CodeMirror } from 'react-codemirror2';

require( 'codemirror/theme/dracula.css' );
require( './mode/sigma16' );

export default class CodeMirrorComponent extends React.Component {
// CLASS METHODS
  constructor( props, context ) {
    super( props, context );

    this.state = {
      code : props.code,
      breakpoints : props.breakpoints,

      lineError : new Map(),

      lineComp : new Map()
    };
  }

  componentDidMount() {
    this.checkCode( this.state.code, 0, Infinity, true );

    if ( this.props.lineComp ) {
      this.setState( prevState => ( { 
        lineComp : this.props.lineComp
      } ) );
    }
  }

// CHECKING METHODS
  checkCode( code, changedLineFrom, changedLineTo, updateState=false ) {
    var lines = code.split( '\n' );
    var check;

    var lineErrorCopy = this.state.lineError;
    var lineCompCopy = new Map();
    if ( this.props.lineComp ) lineCompCopy = this.state.lineComp;

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
        lineErrorCopy.set( i + 1, check );
        ranSuccessfully = false;
      } else {
        lineErrorCopy.delete( i + 1 );

        if ( this.props.lineComp ) {
          const checkCompatible = Emulator.checkCodeIsCompatible( lines[i] );
          
          if ( checkCompatible.get( 1 ) !== undefined ) {
            lineCompCopy.set( i + 1, checkCompatible.get( 1 ) );
          } else {
            lineCompCopy.delete( i + 1 );
          }
        }
      }
    }

    if ( updateState ) {
      this.setState( { code : code, lineError : lineErrorCopy, lineComp : lineCompCopy } );
    } else {
      return [ranSuccessfully, lineErrorCopy, lineCompCopy];
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

    const lineErrorKeys = Array.from( this.state.lineError.keys() );

    for ( var i = 0; i < lineErrorKeys.length; i++ ) {
      const lineI = lineErrorKeys[i] - 1;

      if ( !( linesDotted.includes( lineI ) ) && lineI <= lines.length ) {
        const styleTop = ( 25 * ( lineI + 0.75 ) ) + 3 +'px';

        var className = 'breakpoint ' + ( lineI + 1 ) + ' error';
        if ( this.state.breakpoints.includes( lineI + 1 ) ) {
          className = className + ' active';
        }

        breakpoints.push( 
          <OverlayTrigger
            key={'breakpoint ' + ( lineI + 1 ) + ' error tooltip'}
            placement={'right'}
            overlay={
              <Tooltip>
                {this.state.lineError.get( lineI + 1 )}
              </Tooltip>
            }>
            <div 
              key={'breakpoint ' + ( lineI + 1 )}
              id={'breakpoint ' + ( lineI + 1 )} 
              className={className} 
              style={{top : styleTop}} 
              onClick={this.breakpointOnClick}/>
          </OverlayTrigger>
        );

        linesDotted.push( lineI );
      }
    }
    
    for ( var ite = 0; ite < this.state.breakpoints.length; ite++ ) {
      const lineI = this.state.breakpoints[ite] - 1;

      if ( !( linesDotted.includes( lineI ) ) && lineI <= lines.length ) {
        const styleTop = ( 25 * ( lineI + 0.75 ) ) + 3 +'px';

        if ( this.props.lineComp && this.state.lineComp.get( lineI + 1 ) ) {
          const classExtension = this.state.lineComp.get( ( lineI + 1 ) ).startsWith( 'Compatibility error : ' ) ? ' comperror' : ' compwarn';

          breakpoints.push( 
            <OverlayTrigger
              key={'breakpoint ' + ( lineI + 1 ) + classExtension + ' tooltip'}
              placement={'right'}
              overlay={
                <Tooltip>
                  {this.state.lineComp.get( ( lineI + 1 ) )}
                </Tooltip>
              }>
              <div 
                key={'breakpoint ' + ( lineI + 1 )}
                id={'breakpoint ' + ( lineI + 1 )} 
                className={'breakpoint active'} 
                style={{top : styleTop}} 
                onClick={this.breakpointOnClick}/>
            </OverlayTrigger>
          );

          linesDotted.push( lineI );
        
        } else {
          breakpoints.push( 
            <div 
              key={'breakpoint ' + ( lineI + 1 )}
              id={'breakpoint ' + ( lineI + 1 )} 
              className={'breakpoint active'} 
              style={{top : styleTop}} 
              onClick={this.breakpointOnClick}/>
          );

          linesDotted.push( lineI );
        }
      }
    }

    // comp have less priority than regular breakpoints as they will have an overlay trigger to show the comp warning when a break point is activated

    if ( this.props.lineComp ) {
      for ( const key of this.state.lineComp.keys() ) {
        const lineI = key - 1;
        const classExtension = this.state.lineComp.get( key ).startsWith( 'Compatibility error : ' ) ? ' comperror' : ' compwarn';

        if ( !( linesDotted.includes( lineI ) ) && lineI <= lines.length ) {
          const styleTop = ( 25 * ( lineI + 0.75 ) ) + 3 +'px';

          breakpoints.push( 
            <OverlayTrigger
              key={'breakpoint ' + key + classExtension + ' tooltip'}
              placement={'right'}
              overlay={
                <Tooltip>
                  {this.state.lineComp.get( key )}
                </Tooltip>
              }>
              <div 
                key={'breakpoint ' + key}
                id={'breakpoint ' + key} 
                className={'breakpoint ' + key + classExtension} 
                style={{top : styleTop}} />
            </OverlayTrigger>
          );
        }
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
      lineNoWidth = ( ( lineNoWidthLength * 9 ) + 9 ); // 9 for number padding
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
      lineNoWidth = ( ( lineNoWidthLength * 9 ) + 9 );
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
    var theme;
    if ( localStorage.getItem( 'theme' ) !== null ) {
      if ( localStorage.getItem( 'theme' ) === 'light' ) {
        theme = 'default';
      } else { 
        theme = 'dracula';
      }
    } else {
      theme = 'default'; 
    }

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
              if ( data.origin === "paste" ) {
                this.checkCode( value, data.from.line, Infinity, true );
              }
              this.checkCode( value, data.from.line, data.to.line, true );
            }}
            onGutterClick={this.breakpointToggle}
            options={{mode : 'sigma16', lineNumbers : this.props.lineNumbersMethod ? false : true, readOnly : this.props.readOnly, theme : theme}}
            autoCursor/>
        </div>
      </React.Fragment>
    );
  }
}