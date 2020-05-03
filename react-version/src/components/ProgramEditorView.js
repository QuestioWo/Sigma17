import React from 'react';

import 'codemirror/lib/codemirror.css';
import './ProgramEditorView.css';

import { Button, ButtonGroup, Col, Row } from 'react-bootstrap';
import { FaHammer, FaPlay } from 'react-icons/fa';
import CodeMirror from 'react-codemirror';

import NavBar from './NavBar';

require('codemirror/mode/sigma16/sigma16'); // doesnt point to local sigma16 so wont work when being pulled or used on github TODO: fix so points at local or is included in master

export default class ProgramEditorView extends React.Component {
  constructor( props, context ) {
    super( props );

    this.state = {
      code : ''
    };
  }

  componentDidMount() {
    this.setState( { code: this.props.code } );
  }

  componentDidUpdate() {
    
  }

  breakpoints( code ) {
    if ( document.getElementById( 'breakpoint-column' ) ) {

      //TODO: include so breakpoints dont reset on rerender
      var lines = code.split( '\n' );

      var column = document.getElementById( 'breakpoint-column' );

      // deal with code chunk height in this function since only column rendered
      var codeArea = document.getElementById( 'code-area' );
      codeArea.style.height = ( 25 * ( lines.length ) ) + 18 + 'px';

      column.innerHTML = '';

      for ( var i = 0; i < lines.length; i++ ) {
        var yOffset = 25 * ( i + 0.5 );

        var ev = document.createElement( 'div' );
        ev.className = 'breakpoint';
        ev.style.top = yOffset + 3 +'px';

        ev.onclick = ( function(i) {
          return function() {
            var breakPoints = this.children;

            if ( breakPoints[i].classList.contains( 'active' ) ) {
              breakPoints[i].classList.remove( 'active' );
            } else {
              breakPoints[i].classList.add( 'active' );
            }
          }.bind(column);
        })(i);

        column.appendChild(ev);
      }
    }
  }

  // parseLine( ev, line ) {
  //   var parsed = {
  //     'label' : '',
  //     'command' : '',
  //     'address' : '',
  //     'comment' : ''
  //   };  

  //   var elementsOfLine = line.split(';');

  //   for ( var it = 0; it < elementsOfLine.length; it++ ) {
  //     if ( line === '' ) {
  //       parsed.comment += '\xa0';
  //     } else if ( elementsOfLine[it] === '' && it !== 0 ) {
  //       parsed.comment += ';';
  //     } else {
  //       // elementOfLine is not a comment;

  //       if ( it !== 0 ) {
  //         parsed.comment += ';'+elementsOfLine[it];
  //       } else {
  //         var elementsOfLineBeforeComment = elementsOfLine[it].split( ' ' );

  //         var instructionIndex = 0;          
          
  //         for ( var ite = 0; ite < elementsOfLineBeforeComment.length; ite++ ) {
  //           if ( elementsOfLine[it] === '' ) {
  //             parsed.comment += '';
  //           } else if ( elementsOfLineBeforeComment[ite] === '' ) {
  //             parsed[instructionLayout[instructionIndex]] += '\xa0';
  //             instructionIndex++;
  //             //// TODO: fix so that multiple spaces work
  //           } else if ( elementsOfLineBeforeComment[ite] === '\n' ) {
  //             parsed.comment += '\n';
  //           } else {
  //             parsed[instructionLayout[instructionIndex]] += elementsOfLineBeforeComment[ite];
  //             if ( ite !== ( elementsOfLineBeforeComment.length - 1 ) ) {
  //               parsed[instructionLayout[instructionIndex]] += ' ';
  //             }
  //             instructionIndex++;
  //           }
  //         }
  //       }



  //     }
  //   }
  //   return parsed
  // }

  // createCodeLine( columnelem, i, line ) {
  //   var yOffset = 25 * ( i + 0.5 );

  //   var ev = document.createElement( 'div' );
  //   ev.id= 'code-chunk-line ' + (i+1);
  //   ev.className = 'code-chunk-line';
  //   ev.style.top = yOffset+'px';

  //   //TODO: make highlight when cursor on line not just when clicking on line
  //   ev.onclick = ( function(i) {
  //     return function() {
  //       // console.log('click');
  //       var lineNumbersList = document.getElementById( 'line-number-column' ).children;

  //       for ( var ite = 0; ite < lineNumbersList.length; ite++ ) {
  //         lineNumbersList[ite].classList.remove( 'active' );
  //       }
  //       lineNumbersList[i].classList.add( 'active' );
  //     };
  //   })(i);

  //   var parsed = this.parseLine( ev, line );

  //   for ( var it = 0; it < instructionLayout.length; it++ ) {
  //     var evElem = document.createElement( 'span' );
  //     evElem.id = evElem.className = 'code-chunk-line-element ' + ( i + 1 )  + ' ' + instructionLayout[it];
  //     evElem.innerText = parsed[instructionLayout[it]];
      
  //     ev.appendChild( evElem );
  //   }

  //   columnelem.appendChild( ev );
  //   columnelem.style.height = ( columnelem.children.length * 25 ) + 'px';
  // }

  // removeCodeLine( columnelem, i ) {
  //   var ev = document.getElementById( 'code-chunk-line ' + i );
    
  //   columnelem.removeChild( ev );

  //   var count = 0;

  //   while ( ev && ev !== null ) {
  //     ev = document.getElementById( 'code-chunk-line ' + ( i + count ) ); 

  //     ev.id = ev.className = 'code-chunk-line ' + ( i + count ) - 1;
  //   }
  //   columnelem.style.height = ( columnelem.children.length * 25 ) + 'px';
  // }

  // updateCodeLine( columnelem, i, line ) {
  //   /** called a lot for first time reunning with set code since &nbsp / \xa0's replace spaces at start of strings and blank lines, 
  //   can try to reduce when addin in file imports and not just using a set string */
  //   var ev = document.getElementById( 'code-chunk-line ' + ( i + 1 ) );

  //   console.log( line );
  //   console.log( this.state.oldCode.split('\n')[i] );

  //   console.log('update');

  //   var parsed = this.parseLine( ev, line );

  //   for ( var it = 0; it < instructionLayout.length; it++ ) {
  //     var evElem = document.getElementById( 'code-chunk-line-element ' + ( i + 1 )  + ' ' + instructionLayout[it] );
  //     evElem.innerText = parsed[instructionLayout[it]];
  //   }
  // }

  // codeChunk( oldCode, code ) {
  //   if ( document.getElementById( 'code-chunk-column' ) ) {
  //     var lines = code.split( '\n' );
  //     var oldlines = oldCode.split( '\n' );

  //     var columnelem = document.getElementById( 'code-chunk-column' );

  //     if ( document.getElementsByClassName( 'code-chunk-line' ).length > 0 ) {
  //       // When editing
  //       var linesElems = document.getElementsByClassName( 'code-chunk-line' );

  //       while ( linesElems.length !== lines.length ) {
  //         if ( linesElems.length < lines.length ) {
  //           // too few lines
  //           this.createCodeLine( columnelem, linesElems.length, lines[(linesElems.length)] );
  //         } else {
  //           // too many lines
  //           this.removeCodeLine( columnelem, linesElems.length );
  //         }
  //       }

  //       for ( var i = 0; i < lines.length; i++ ) {
  //         var ev = document.getElementById( 'code-chunk-line ' + ( i + 1 ) );

  //         if ( ev ) {
  //           if ( !(oldlines[i]) || ( oldlines[i] && lines[i] !== oldlines[i] ) ) {
  //             this.updateCodeLine( columnelem, i, lines[i] );
  //           }
  //         }
  //       }
  //     } else {
  //       // Creating lines that are needed initially
  //       for ( var it = 0; it < lines.length; it++ ) {
          
  //         this.createCodeLine( columnelem, it, lines[it] );

  //         // '<div id='code-chunk-line '+(it+1)+'' className='code-chunk-line' style={{top:'+yOffset+'px}}>';

  //         // var evLabel = '<span id='code-chunk-line-element '+(it+1)+'' class='code-chunk-line-element label'>'+parsed.label+'</span>';
  //         // var evCommand = '<span id='code-chunk-line-element '+(it+1)+'' class='code-chunk-line-element command'>'+parsed.command+'</span>';
  //         // var evAddress = '<span id='code-chunk-line-element '+(it+1)+'' class='code-chunk-line-element address'>'+parsed.address+'</span>';
  //         // var evComment = '<span id='code-chunk-line-element '+(it+1)+'' class='code-chunk-line-element comment'>'+parsed.comment+'</span>';

  //         // ev += evLabel + evCommand + evAddress + evComment + '</div>';
  //       }
  //       // return column;
  //     }
  //   }
  // }

  // codeBlockEdit = divContent => {
  //   // console.log(divContent.target)
  //   console.log(divContent.target.innerText)
  //   // this.state.code = divContent.target.innerText;
  //   this.setState( { oldCode : this.state.code } );
  //   this.setState( { code : divContent.target.innerText } );
  // }

  updateCode = newCode => {
    this.setState( { code : newCode } );
  }

  render() {
    return(
      <React.Fragment>
        <NavBar currentKey={ this.props.location.pathname }/>
        <div className='buttonstoolbar'>
          <Row>
            <Col>
              <ButtonGroup>
                <Button variant='outline-secondary' size='sm'>
                  <FaHammer/>
                </Button>
                <Button variant='outline-secondary' size='sm'>
                  <FaPlay/>
                </Button>
              </ButtonGroup>
            </Col>
          </Row>
        </div>    
        <div className='mainbody'>
          <Row>
            <div id="code-area" className='code-area'> 
              <div id='breakpoint-column' className='breakpoint-column'>
                {this.breakpoints(this.state.code)}
              </div>
              <CodeMirror
                mode='sigma16'
                value={this.state.code} 
                onChange={this.updateCode} 
                options={{ lineNumbers : true, scrollbarStyle: "null" }}
                className='code-chunk-column'
                autoFocus
              />
            </div>
          </Row>
        </div>
      </React.Fragment>
    );
  }
}