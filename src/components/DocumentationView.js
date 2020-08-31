/*
  Copyright Jim Carty © 2020

  This file is subject to the terms and conditions defined in file 'LICENSE.txt', which is part of this source code package.
*/

import React from 'react';

import './DocumentationView.css';

import { Button, Col, Collapse, Row, Table } from 'react-bootstrap';
import { FaBackward, FaBug, FaChevronDown, FaChevronUp, FaDownload, FaEye, FaEyeSlash, FaHammer, FaMinus, FaPen, FaPlay, FaStepForward, FaTimes, FaUpload } from 'react-icons/fa';
import Select from 'react-select';

import * as Emulator from './utils/Emulator';

import NavBar from './NavBar';

export default class DocumentationView extends React.Component {
// CLASS METHODS
  constructor( props, context ) {
    super( props );

    this.state = {
      code : '',
      breakpoints : [],
      input : '',

      display : {},

      searchSubHeadings : [
        'Contents', // Contents

        'To know before coding', // To know before coding

          'Toknow before coding/Introduction to language', // Introduction to language
            'Toknow before coding/Introduction to language/Constants', // Constants
            'Toknow before coding/Introduction to language/Comments', // Comments
            'Toknow before coding/Introduction to language/Labels', // Labels

          'Toknow before coding/Introduction to machine code', // Introduction to machine code

          'Toknow before coding/Overview of architecture', // Overview of architecture
            'Toknow before coding/Overview of architecture/CPU', // CPU
            'Toknow before coding/Overview of architecture/Registers', // Registers
              'Toknow before coding/Overview of architecture/Registers/R0', // R0
              'Toknow before coding/Overview of architecture/Registers/R15', // R15
            'Toknow before coding/Overview of architecture/Memory', // Memory


        'Instruction set', // Instruction set

          'Instruction set/data', // data

          'Instruction set/RRR', // RRR
            'Instruction set/RRR/add', // add
            'Instruction set/RRR/sub', // sub
            'Instruction set/RRR/mul', // mul
            'Instruction set/RRR/div', // div
            'Instruction set/RRR/cmp', // cmp
            'Instruction set/RRR/cmplt', // cmplt
            'Instruction set/RRR/cmpeq', // cmpeq
            'Instruction set/RRR/cmpgt', // cmpgt
            'Instruction set/RRR/inv', // inv
            'Instruction set/RRR/and', // and
            'Instruction set/RRR/or', // or
            'Instruction set/RRR/xor', // xor
            'Instruction set/RRR/trap', // trap

          'Instruction set/RX', // RX
            'Instruction set/RX/lea', // lea
            'Instruction set/RX/load', // load
            'Instruction set/RX/store', // store
            'Instruction set/RX/jump', // jump
            'Instruction set/RX/jumpc0', // jumpc0
            'Instruction set/RX/jumpc1', // jumpc1
            'Instruction set/RX/jumpf', // jumpf
            'Instruction set/RX/jumpt', // jumpt
            'Instruction set/RX/jal', // jal
            'Instruction set/RX/testset', // testset
            'Instruction set/RX/Conditional jumps', // Conditional jumps

          'Instruction set/EXP', // EXP
            'Instruction set/EXP/EXP0', // EXP0
              'Instruction set/EXP/EXP0/rfi', // rfi

            'Instruction set/EXP/EXP4', // EXP4
              'Instruction set/EXP/EXP4/execute', // execute
              'Instruction set/EXP/EXP4/getctl', // getctl
              'Instruction set/EXP/EXP4/putctl', // putctl
              'Instruction set/EXP/EXP4/push', // push
              'Instruction set/EXP/EXP4/pop', // pop
              'Instruction set/EXP/EXP4/top', // top
              'Instruction set/EXP/EXP4/addc', // addc
              'Instruction set/EXP/EXP4/shiftl', // shiftl
              'Instruction set/EXP/EXP4/shiftr', // shiftr
              'Instruction set/EXP/EXP4/getbit', // getbit
              'Instruction set/EXP/EXP4/getbiti', // getbiti
              'Instruction set/EXP/EXP4/putbit', // putbit
              'Instruction set/EXP/puP4i/getbit', // putbiti
              'Instruction set/EXP/EXP4/extract', // extract
              'Instruction set/EXP/EXP4/extracti', // extracti
              'Instruction set/EXP/EXP4/inject', // inject
              'Instruction set/EXP/EXP4/injecti', // injecti
              'Instruction set/EXP/EXP4/field', // field
              'Instruction set/EXP/EXP4/logicw', // logicw
              'Instruction set/EXP/EXP4/logicb', // logicb
              'Instruction set/EXP/EXP4/Logic aliases', // Logic aliases

            'Instruction set/EXP/EXP8', // EXP8
              'Instruction set/EXP/EXP8/save', // save
              'Instruction set/EXP/EXP8/restore', // restore

          'Instruction set/All instructions', // All instructions


        'Using the IDE', // Using the IDE
          'Using the IDE/Notes about the IDE that are unbelievably important', // Notes about the IDE that are unbelievably important

          'Using the IDE/Editing a program', // Editing a program
            'Using the IDE/Editing a program/Input editing', // Input editing

          'Using the IDE/Running a program', // Running a program
          
          'Using the IDE/Debugging a program', // Debugging a program
            'Using the IDE/Debugging a program/Syntax errors', // Syntax errors
            'Using the IDE/Debugging a program/Semantic errors - Debugger', // Semantic errors - Debugger
              'Using the IDE/Debugging a program/Semantic errors - Debugger/Breakpoints', // Breakpoints

          'Using the IDE/Exporting a program', // Exporting a program
            'Using the IDE/Exporting a program/Exporting - Raw', // Exporting - Raw
            'Using the IDE/Exporting a program/Exporting - Raw Compatible', // Exporting - Raw Compatible
            'Using the IDE/Exporting a program/Exporting - Binary', // Exporting - Binary
            'Using the IDE/Exporting a program/Exporting - Hex', // Exporting - Hex
            'Using the IDE/Exporting a program/Exporting - Hex Compatible', // Exporting - Hex Compatible

          'Using the IDE/Importing a program' // Importing a program
      ],

      labels : {
        'test' : 0x0010
      },

      scrollOnOpen : false,
      scrollTo : ''
    };

    for ( var i = 0; i < this.state.searchSubHeadings.length; i++ ) {
      const splat = this.state.searchSubHeadings[i].replace( /\s+/g, '' ).split( '/' );
      const showName = splat[splat.length - 1];
      this.state.display[showName] = true;
    }

    this.state.setParentState = this.setParentState.bind( this );
    this.state.infoAreaOpenCallback = this.infoAreaOpenCallback.bind( this );
  }

  componentDidMount() {
    if ( sessionStorage.getItem( 'code' ) !== null && sessionStorage.getItem( 'input' ) !== null && sessionStorage.getItem( 'breakpoints' ) !== null ) {
      this.setState( {
        code : sessionStorage.getItem( 'code' ),
        input : sessionStorage.getItem( 'input' ),
        breakpoints : sessionStorage.getItem( 'breakpoints' ).split( ',' ).map(
          breakpointString => {
            return( Number( breakpointString ) );
          }
        )
      } );
    } else if ( this.props.code !== undefined ) {
      this.setState( this.props );
    }
  }

  componentWillUnmount() {
    sessionStorage.setItem( 'code', this.state.code );
    sessionStorage.setItem( 'input', this.state.input );
    sessionStorage.setItem( 'breakpoints', this.state.breakpoints );
  }

// ABSTRACTION
  flagsSet( title, flags, renderUnless=true ) {
    return (
      <React.Fragment>
        <li>Flags set in R15
          { renderUnless &&
            <React.Fragment>
              , unless Rd is R15
            </React.Fragment> }
          {'\xa0'/**&nbsp*/}:
        </li>
        <ul>
          { flags.map( flag => {
            return ( <li key={ title + flag }>{flag}</li> );
          } ) }
        </ul>
      </React.Fragment>
    );
  }

  machineCode( command, argument, opCode, opCodeName='op' ) {
    const compiledCommands = Emulator.parseLineForMachineCode( command + ' ' + argument, this.state.labels );

    var writtenCommands = '';

    for ( var i = 0; i < compiledCommands.length; i++ ) {
      writtenCommands += '$' + Emulator.writeHex( compiledCommands[i] );
      if ( i !== compiledCommands.length - 1 ) {
        writtenCommands += ',';
      }
    }

    return (
      <React.Fragment>
        <code>{command + ' ' + argument}</code> := <code>{writtenCommands}</code>, since the <strong>{opCodeName}</strong> code of <code>{command}</code> is <strong>${opCode.toString( 16 )}</strong>
      </React.Fragment>
    );
  }

  wrongGroupings( command, is, why, groupedAs ) {
    return(
      <React.Fragment>
        <code>{command}</code> is technically <strong>{is}</strong> command since it takes <strong>{why}</strong>, however, its <strong>machine code representation</strong> it that of <strong>{groupedAs}</strong> command, therefore, it is grouped as such
      </React.Fragment>
    );
  }

  theOriginalEmulator() {
    return (
      <React.Fragment>
        the{'\xa0'/**&nbsp*/}
        <a
          href='https://jtod.github.io/home/Sigma16/'
          target='_blank'
          rel='noopener noreferrer'>
          original emulator 
        </a>
      </React.Fragment>
    );
  }

  expParsedAs( command, argument, parsedAs ) {
    return(
      <React.Fragment>        
        Since <code>{command}</code> takes <strong>{argument}</strong>, it is parsed as a <strong>{parsedAs}</strong> command
      </React.Fragment>
    );
  }

  summaryTableRow( command, func, toMc ) {
    const compiledCommands = Emulator.parseLineForMachineCode( toMc, this.state.labels );

    var writtenCommands = '';

    for ( var i = 0; i < compiledCommands.length; i++ ) {
      writtenCommands += '$' + Emulator.writeHex( compiledCommands[i] );
      if ( i !== compiledCommands.length - 1 ) {
        writtenCommands += ',';
      }
    }

    return (
      <tr>
        <td><code>{command}</code></td>
        <td>{func}</td>
        <td><code>{toMc}</code> := <code>{writtenCommands}</code></td>
      </tr>
    );
  }

// COLLAPSE METHODS
  setParentState = e => {
    this.setState( e );
  }

// CONTENTS AND SEARCH METHODS
  searchChoose = e => {
    if ( this.state.display[e.value] ) {
      this.scrollToId( e.value )
    } else {
      let displayCopy = this.state.display;

      for ( var i = 0; i < this.state.searchSubHeadings.length; i++ ) {
        var displayNameList = this.state.searchSubHeadings[i].replace( /\s+/g, '' ).split( '/' );

        if ( displayNameList[displayNameList.length - 1] === e['value'] ) {

          for ( var it = 0; it < displayNameList.length; it++ ) {
            displayCopy[displayNameList[it]] = true;
          }

        }
      }

      this.setState( { display : displayCopy, scrollOnOpen : true, scrollTo : e.value } );
    }
  }

  contentsChoose = e => {
    e.target.blur();
    const sliced = e.target.id.slice( 0, e.target.id.length - 4 ).replace( /\s+/g, '' );

    if ( this.state.display[sliced] ) {
      this.scrollToId( sliced )
    } else {
      let displayCopy = this.state.display;

      for ( var i = 0; i < this.state.searchSubHeadings.length; i++ ) {
        var displayNameList = this.state.searchSubHeadings[i].replace( /\s+/g, '' ).split( '/' );

        if ( displayNameList[displayNameList.length - 1] === sliced ) {

          for ( var it = 0; it < displayNameList.length; it++ ) {
            displayCopy[displayNameList[it]] = true;
          }

        }
      }

      this.setState( { display : displayCopy, scrollOnOpen : true, scrollTo : sliced } );
    }
  }

  scrollToId( id ) {
    const elementToScrollTo = document.getElementById( id );
    elementToScrollTo.scrollIntoView();
  }

  infoAreaOpenCallback = async e => {
    if ( this.state.scrollOnOpen ) {
      await new Promise( r => setTimeout( r, 1 ) );
      // waits one millisecond so that deeply nested InfoArea's have time for their parents to un-collapse properly, thus updating their offsetTop properly

      this.scrollToId( this.state.scrollTo );

      this.setState( { scrollOnOpen : false } );
    }
  }

// BUTTON METHODS
  setDisplaysAs( as ) {
    let displayCopy = this.state.display;

    for ( var i = 0; i < this.state.searchSubHeadings.length; i++ ) {
      const splat = this.state.searchSubHeadings[i].replace( /\s+/g, '' ).split( '/' );
      const showName = splat[splat.length - 1];
      displayCopy[showName] = as;
    }

    this.setState( { display : displayCopy } );
  }

  setDisplaysClose = e => {
    this.setDisplaysAs( false );
  }

  setDisplaysOpen = e => {
    this.setDisplaysAs( true );
  }

// RENDER
  render() {
    if ( localStorage.getItem( 'theme' ) !== null ) {
      document.body.classList.replace( localStorage.getItem( 'theme' ) === 'light' ? 'dark' : 'light', localStorage.getItem( 'theme' ) );
    } else {
      document.body.classList.add( 'light' );

      localStorage.setItem( 'theme', 'light' );
    }
    
    var subHeadings = [];
    for ( var i = 0; i < this.state.searchSubHeadings.length; i++ ) {
      var indent = '';
      const splat = this.state.searchSubHeadings[i].split( '/' );
      while ( splat.length - 1 > ( indent.length / 2 ) ) { indent += '->' };
      indent += '  ';
      const showName = splat[splat.length - 1].replace( /\s+/g, '' );
      subHeadings.push( {value : showName, label : indent + splat[splat.length - 1]} );
    }

    return(
      <React.Fragment>
        <NavBar pathname={'/#' + this.props.location.pathname} />
        <div className="mainbody">
          <Row>
            <Col>
              Original documentation of the Sigma16 language can be found{`\xa0`/**&nbsp*/}
              <a 
                href='https://jtod.github.io/home/Sigma16/releases/3.1.3/docs/html/userguide/userguide.html' 
                target='_blank' 
                rel='noopener noreferrer'>
                  here
                </a>
              . All of this emulator and command set works the same, except anything to do with the linker, e.g modules.
              <Row>
                <Col md={10}>
                  <Select
                    isSearchable={true}
                    options={subHeadings}
                    theme={{borderRadius : 7}}
                    onChange={this.searchChoose}
                    placeholder='Search section titles...'
                  />
                </Col>
                <Col md={2}>
                  <Button variant='outline-secondary' size='md' onClick={this.setDisplaysClose}>
                    <FaChevronUp/>
                  </Button>
                  <div style={{float : 'right'}}>
                    <Button variant='outline-secondary' size='md' onClick={this.setDisplaysOpen}>
                      <FaChevronDown/>
                    </Button>
                  </div>
                </Col>
              </Row>
              <InfoArea state={this.state} title={'Contents'} depth={1}>
                <div className='info-body white'>
                  {
                    this.state.searchSubHeadings.map( ( subHeading, index ) => {
                      var indent = '';
                      const splat = subHeading.split( '/' );
                      const indentor = '\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0';
                      while ( splat.length - 1 > ( indent.length / indentor.length ) ) { indent += indentor };
                      return(
                        <div key={subHeading + ' con'}>
                          {indent}
                          <span
                            className='documentation-page-link'
                            id={splat[splat.length - 1] + ' con'}
                            onClick={this.contentsChoose}>
                            {splat[splat.length - 1]}
                          </span>
                          <br/>
                        </div>
                      );
                    } )
                  }
                </div>
              </InfoArea>
              <InfoArea state={this.state} title={'To know before coding'} depth={1}>
                <InfoArea state={this.state} title={'Introduction to language'} depth={2}>
                  <div className='info-body white'>
                    Sigma16 is a computer <strong>architecture</strong> designed for <strong>research</strong> and <strong>teaching</strong> in computer systems. This application provides a <strong>complete environment</strong> for <strong>experimenting</strong> with the architecture<br/>
                    <br/>
                    Like other languages, Sigma16 <strong>takes</strong> the <strong>code</strong> provided and <strong>compiles</strong> it to <strong>machine code</strong> which is then <strong>iterated over</strong> to <strong>execute</strong> a program<br/>
                  </div>
                  <InfoArea state={this.state} title={'Constants'} depth={3}>
                    <div className='info-body white'>
                      Constants in Sigma16 can either be written as <strong>decimal</strong>, <strong>hexadecimal</strong> - hex for short - or, <strong>binary</strong><br/>
                      <br/>
                      <strong>Decimal</strong> representation in Sigma16 comes as just regular numbers with <strong>no prefix</strong> :<br/>
                      <code>10</code> represents <strong>decimal</strong> 10<br/> 
                      <br/>
                      <strong>Hexadecimal</strong> representation in Sigma16 comes as a <strong>hex</strong> number, number characters <strong>0-9</strong> and <strong>a-f</strong>, with a <strong>$</strong> prefix :<br/>
                      <code>$10</code> represents <strong>decimal</strong> 16<br/>
                      <br/>
                      <strong>Binary</strong> representation in Sigma16 comes as a <strong>binary</strong> number, number characters <strong>0</strong> or <strong>1</strong>, with a <strong>#</strong> prefix :<br/>
                      <code>#10</code> represents <strong>decimal</strong> 2<br/>
                    </div>
                  </InfoArea>
                  <InfoArea state={this.state} title={'Comments'} depth={3}>
                    <div className='info-body white'>
                      <strong>Comments</strong> in Sigma16 are defined as <strong>anything after</strong> a <strong>semi-colon</strong> - <code>;</code><br/>
                      <br/>
                      <strong>Comments</strong> are <strong>ignored</strong> by the <strong>compiler</strong><br/>
                      This means that the <strong>contents</strong> of comments <strong>do not</strong> have to be in a specific <strong>format</strong> as they are <strong>not parsed</strong> at all<br/>
                      <br/>
                      In another way, <code>add R1,R2,R3</code> and <code>add R1,R2,R3; R1 := R2 + R3</code> will be <strong>compiled</strong> to be the <strong>same machine code</strong>; <code>$0123</code>
                    </div>
                  </InfoArea>
                  <InfoArea state={this.state} title={'Labels'} depth={3}>
                    <div className='info-body white'>
                      <strong>Labels</strong> can be made up of <strong>any alphanumerical</strong> characters including the underscore character - <strong>_</strong><br/>
                      <br/>
                      Labels <strong>must start</strong> with an <strong>alphabet</strong> character or an <strong>underscore</strong> character - <strong>_</strong><br/>
                      <br/>
                      Labels are <strong>case-sensitive</strong><br/>
                      <br/>
                      Labels <strong>cannot contain</strong> either a dollar sign - <strong>$</strong> - or a hash sign - <strong>#</strong>. This is because both of <strong>these</strong> are used to <strong>represent</strong> hex and binary <strong>constants</strong> repectively<br/>
                    </div>
                  </InfoArea>
                </InfoArea>
                <InfoArea state={this.state} title={'Introduction to machine code'} depth={2}>
                  <div className='info-body white'>
                    Sigma16's <strong>machine code</strong> is comprised of <strong>16-bit "words"</strong> ( 2 bytes ) which are <strong>compiled</strong> from the assembly <strong>program provided</strong><br/>
                    <br/>
                    This <strong>machine code</strong> is then <strong>set</strong> into the <strong>memory</strong>, starting at the <strong>0</strong>th position. The <strong>memory</strong> then <strong>runs</strong> through, taking one or more words and <strong>executing functions</strong> based off of those words' <strong>associated meanings</strong><br/>
                  </div>
                </InfoArea>
                <InfoArea state={this.state} title={'Overview of architecture'} depth={2}>
                  <InfoArea state={this.state} title={'CPU'} depth={3}>
                    <div className='info-body white'>
                      The CPU of Sigma16 is defined by the <strong>Control registers</strong><br/>
                      <br/>
                      These control registers help the program to...<br/>
                      <ul>
                        <li>keep track of what address in memory is to be executed - the <strong>Program Counter 'pc'</strong> register</li>
                        <li>show the first machine code instruction being executed is - the <strong>Instruction 'ir'</strong> register</li>
                        <li>show the second <strong>sometimes omitted</strong> machine code instruction being executed is - the <strong>Address 'adr'</strong> register</li>
                      </ul>
                      These control registers are sometimes <strong>accessed</strong> or <strong>altered</strong> by instructions and in such cases, the <strong>psuedo-code</strong> representation for this will be <strong>control[control register name]</strong><br/>
                      i.e, <strong>control[pc]</strong> for accessing the Program Counter register

                    </div>
                  </InfoArea>
                  <InfoArea state={this.state} title={'Registers'} depth={3}>
                    <div className='info-body white'>
                      The registers of Sigma16 are shown by the values labelled <strong>R0 -> R15</strong><br/>
                      <br/>
                      These registers are what <strong>most</strong> instructions are <strong>affecting</strong> and <strong>relying</strong> on to produce an <strong>output</strong> of the program<br/>
                      <br/>
                      Sometimes only specific <strong>bits</strong> of these registers will be required though<br/>
                      In Sigma16, bits are counted from the most important, <strong>left-most</strong>, to the least important, <strong>right-most</strong>, sides<br/>
                      i.e <strong>R15.0</strong> will be the <strong>left-most</strong> bit and <strong>R15.15</strong> the <strong>right-most</strong><br/>
                      <br/>
                      Most registers just hold a value, however, there are <strong>special registers</strong> built in that have very specific purposes :<br/>
                    </div>
                    <InfoArea state={this.state} title={'R0'} depth={4}>
                      <div className='info-body white'>
                        <strong>Always holds the value 0</strong><br/>
                        <br/>
                        <strong>Can</strong> have functions <strong>set values</strong> into it, however, this register <strong>will always</strong> equal <strong>0</strong>
                      </div>
                    </InfoArea>
                    <InfoArea state={this.state} title={'R15'} depth={4}>
                      <div className='info-body white'>
                        <strong>Will have different values based on certain instructions</strong><br/>
                        <br/>
                        R15's value relies on different <strong>flags</strong> being set in it. These <strong>flags represent bits</strong> in the registers <strong>16-bit</strong> word. This means that when a <strong>flag</strong> equals <strong>1</strong>, the <strong>corresponding</strong> bit in R15 will be set to <strong>1</strong><br/>
                        <br/>
                        The <strong>flags</strong>, their <strong>corresponding bits</strong> and the <strong>meanings</strong> behind the flags are :<br/>
                        <Table bordered hover size='sm'>
                          <thead>
                            <tr>
                              <th>Flag</th>
                              <th>Bit</th>
                              <th>Meaning</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr>
                              <td><strong>G</strong></td>
                              <td>0</td>
                              <td>Unsigned greater than ( or greater than 0 )</td>
                            </tr>
                            <tr>
                              <td><strong>g</strong></td>
                              <td>1</td>
                              <td>Signed greater than ( or greater than 0 )</td>
                            </tr>
                            <tr>
                              <td><strong>E</strong></td>
                              <td>2</td>
                              <td>Equal to ( or equal to 0 )</td>
                            </tr>
                            <tr>
                              <td><strong>l</strong></td>
                              <td>3</td>
                              <td>Signed less than ( or less than 0 )</td>
                            </tr>
                            <tr>
                              <td><strong>L</strong></td>
                              <td>4</td>
                              <td>Unsigned less than ( or less than 0 )</td>
                            </tr>
                            <tr>
                              <td><strong>V</strong></td>
                              <td>5</td>
                              <td>Unsigned integer overflow</td>
                            </tr>
                            <tr>
                              <td><strong>v</strong></td>
                              <td>6</td>
                              <td>Signed integer overflow</td>
                            </tr>
                            <tr>
                              <td><strong>C</strong></td>
                              <td>7</td>
                              <td>Carry output</td>
                            </tr>
                            <tr>
                              <td><strong>S</strong></td>
                              <td>8</td>
                              <td>Stack overflow ( only implemented in this emulator )</td>
                            </tr>
                          </tbody>
                        </Table>
                      </div>
                    </InfoArea>
                  </InfoArea>
                  <InfoArea state={this.state} title={'Memory'} depth={3}>
                    <div className='info-body white'>
                      The memory is an array of words that are accessed by address<br/>
                      <br/>
                      <strong>A memory address is a 16-bit word</strong>, and there is one memory location corresponding to each address, so there are <strong>2^16 - 64k - memory locations</strong><br/>
                      These memory addresses can be used to <strong>access</strong> and <strong>update</strong> memory values by the <strong>psuedo-code</strong> notation of <strong>memory[address]</strong><br/>
                      <br/>
                      Each memory location is also a <strong>16-bit word</strong><br/>
                    </div>
                  </InfoArea>
                </InfoArea>
              </InfoArea>
              <InfoArea state={this.state} title={'Instruction set'} depth={1}>
                <InfoArea state={this.state} title={'data'} depth={2}>
                  <div className='info-body white'>
                    Use :<br/>
                    <code>data constant[,constant,constant,...]</code><br/>
                    Effects :<br/>
                    <ul>
                      <li>The value in memory corresponding to the line is set as the passed-in constants</li>
                    </ul>

                    Machine code :<br/>
                    <code>data $0010</code> := <code>$0010</code>, since <code>data</code> is parsed so that the <strong>constant</strong> is set into the line's <strong>corresponding memory cell/location</strong><br/>
                    <br/>
                    Note :<br/>
                    <strong>Multiple</strong> constants can be <strong>optionally</strong> passed-in to the <code>data</code> command as arguments to fill <strong>subsequent</strong> memory <strong>cells</strong>, however, this <strong>feature</strong> is not supported in {this.theOriginalEmulator()}
                  </div>
                </InfoArea>
                <InfoArea state={this.state} title={'RRR'} depth={2}>
                  <div className='info-body white' style={{marginBottom : '7px'}}>
                    Compiled RRR instructions take up one word in memory, or one memory cell/location<br/>
                    <br/>
                    Their compiled states can be broken down into :<br/>
                    <ul>
                      <li>op - the <strong>operation code</strong>, signifies which operation to execute on the passed-in arguments</li>
                      <li>d - the number of the <strong>destination register</strong>, <strong>Rd</strong></li>
                      <li>a - the number of <strong>first argument</strong> register, <strong>Ra</strong></li>
                      <li>b - the number of <strong>second argument</strong> register, <strong>Rb</strong></li>
                    </ul>
                    These components make up a machine code word by setting the <strong>first</strong> letter, <strong>0-9 and a-f</strong>, of the 4 letter hex word as the <strong>op</strong> code<br/>
                    Then the <strong>d</strong> code as the <strong>second</strong> letter<br/>
                    The <strong>a</strong> code as the <strong>third</strong> letter<br/>
                    Finally, the <strong>b</strong> code is set as the <strong>fourth</strong> letter<br/>
                    <br/>
                    <div className='machine-code-template'>
                      <pre>
                        ---------------------<br/>
                        | op |  d |  a |  b |<br/>
                        ---------------------
                      </pre>
                    </div>
                  </div>
                  <InfoArea state={this.state} title={'add'} depth={3}>
                    <div className='info-body white'>
                      Use :<br/>
                      <code>add Rd,Ra,Rb</code><br/>
                      Effects :<br/>
                      <ul>
                        <li>Rd := Ra + Rb</li>
                        {this.flagsSet( 'add', [ 'G', 'g', 'E', 'l', 'L', 'V', 'C' ] )}
                      </ul>

                      Machine code :<br/>
                      {this.machineCode( 'add', 'R1,R2,R3', 0 )}
                    </div>
                  </InfoArea>
                  <InfoArea state={this.state} title={'sub'} depth={3}>
                    <div className='info-body white'>
                      Use :<br/>
                      <code>sub Rd,Ra,Rb</code><br/>
                      Effects :<br/>
                      <ul>
                        <li>Rd := Ra - Rb</li>
                        {this.flagsSet( 'sub', [ 'G', 'g', 'E', 'l', 'L', 'v' ] )}
                      </ul>

                      Machine code :<br/>
                      {this.machineCode( 'sub', 'R1,R2,R3', 1 )}
                    </div>
                  </InfoArea>
                  <InfoArea state={this.state} title={'mul'} depth={3}>
                    <div className='info-body white'>
                      Use :<br/>
                      <code>mul Rd,Ra,Rb</code><br/>
                      Effects :<br/>
                      <ul>
                        <li>Rd := Ra * Rb</li>
                        {this.flagsSet( 'mul', [ 'G', 'g', 'E', 'l', 'L', 'V' ] )}
                      </ul>
                      Machine code :<br/>
                      {this.machineCode( 'mul', 'R1,R2,R3', 2 )}
                    </div>
                  </InfoArea>
                  <InfoArea state={this.state} title={'div'} depth={3}>
                    <div className='info-body white'>
                      Use :<br/>
                      <code>div Rd,Ra,Rb</code><br/>
                      Effects :<br/>
                      <ul>
                        <li>Rd := Ra / Rb</li>
                        <li>R15 := Ra % Rb, unless Rd is R15</li>
                      </ul>
                      Machine code :<br/>
                      {this.machineCode( 'div', 'R1,R2,R3', 3 )}<br/>
                      <br/>
                      Note :<br/>
                      <strong>Floor</strong> division is <strong>always</strong> performed, even on <strong>negative</strong> numbers. i.e -10 / 3 := <strong>-4</strong>
                    </div>
                  </InfoArea>
                  <InfoArea state={this.state} title={'cmp'} depth={3}>
                    <div className='info-body white'>
                      Use :<br/>
                      <code>cmp Ra,Rb</code><br/>
                      Effects :<br/>
                      <ul>
                        <li>Compares Ra and Rb</li>
                        {this.flagsSet( 'cmp', [ 'G', 'g', 'E', 'l', 'L' ], false )}
                      </ul>
                      Machine code :<br/>
                      {this.machineCode( 'cmp', 'R1,R2', 4 )}
                      <br/>
                      Note :<br/>
                      {this.wrongGroupings( 'cmp', 'an RR', 'two register arguments', 'an RRR' )}
                    </div>
                  </InfoArea>
                  <InfoArea state={this.state} title={'cmplt'} depth={3}>
                    <div className='info-body white'>
                      Use :<br/>
                      <code>cmplt Rd,Ra,Rb</code><br/>
                      Effects :<br/>
                      <ul>
                        <li>Checks if is Ra {'<'} Rb, using their <strong>signed</strong> values</li>
                        <li>Rd := 1 <strong>or</strong> 0, based on the result of the comparison</li>
                      </ul>
                      Machine code :<br/>
                      {this.machineCode( 'cmplt', 'R1,R2,R3', 5 )}
                    </div>
                  </InfoArea>
                  <InfoArea state={this.state} title={'cmpeq'} depth={3}>
                    <div className='info-body white'>
                      Use :<br/>
                      <code>cmpeq Rd,Ra,Rb</code><br/>
                      Effects :<br/>
                      <ul>
                        <li>Checks if is Ra == Rb</li>
                        <li>Rd := 1 <strong>or</strong> 0, based on the result of the comparison</li>
                      </ul>
                      Machine code :<br/>
                      {this.machineCode( 'cmpeq', 'R1,R2,R3', 6 )}
                    </div>
                  </InfoArea>
                  <InfoArea state={this.state} title={'cmpgt'} depth={3}>
                    <div className='info-body white'>
                      Use :<br/>
                      <code>cmpgt Rd,Ra,Rb</code><br/>
                      Effects :<br/>
                      <ul>
                        <li>Checks if is Ra {'>'} Rb, using their <strong>signed</strong> values</li>
                        <li>Rd := 1 <strong>or</strong> 0, based on the result of the comparison</li>
                      </ul>
                      Machine code :<br/>
                      {this.machineCode( 'cmpgt', 'R1,R2,R3', 7 )}
                    </div>
                  </InfoArea>
                  <InfoArea state={this.state} title={'inv'} depth={3}>
                    <div className='info-body white'>
                      Use :<br/>
                      <code>inv Rd,Ra</code><br/>
                      Effects :<br/>
                      <ul>
                        <li>Inverts all the bits of Ra; <strong>the bitwise inverse</strong>, denoted by <strong>~</strong></li>
                        <li>Rd := ~ Ra</li>
                      </ul>
                      Machine code :<br/>
                      {this.machineCode( 'inv', 'R1,R2', 8 )}<br/>
                      <br/>
                      Note :<br/>
                      This command has an <strong>alias</strong> of <code>invold</code> so that it is compatible with {this.theOriginalEmulator()}. It is in the <strong>same RR</strong> format and was only added for <strong>backwards compatibility</strong><br/>
                    </div>
                  </InfoArea>
                  <InfoArea state={this.state} title={'and'} depth={3}>
                    <div className='info-body white'>
                      Use :<br/>
                      <code>and Rd,Ra,Rb</code><br/>
                      Effects :<br/>
                      <ul>
                        <li>Finds all the <strong>bits</strong> that are equal to 1 in <strong>both</strong> Ra <strong>and</strong> Rb; <strong>the bitwise and</strong>, denoted by <strong>&</strong></li>
                        <li>Rd := Ra & Rb</li>
                      </ul>
                      Machine code :<br/>
                      {this.machineCode( 'and', 'R1,R2,R3', 9 )}<br/>
                      <br/>
                      Note :<br/>
                      This command has an <strong>alias</strong> of <code>andold</code> so that it is compatible with {this.theOriginalEmulator()}. It is in the <strong>same RRR</strong> format and was only added for <strong>backwards compatibility</strong><br/>
                    </div>
                  </InfoArea>
                  <InfoArea state={this.state} title={'or'} depth={3}>
                    <div className='info-body white'>
                      Use :<br/>
                      <code>or Rd,Ra,Rb</code><br/>
                      Effects :<br/>
                      <ul>
                        <li>Finds all the <strong>bits</strong> that are equal to 1 in <strong>either</strong> Ra <strong>or</strong> Rb; <strong>the bitwise or</strong>, denoted by <strong>|</strong></li>
                        <li>Rd := Ra | Rb</li>
                      </ul>
                      Machine code :<br/>
                      {this.machineCode( 'or', 'R1,R2,R3', 0xa )}<br/>
                      <br/>
                      Note :<br/>
                      This command has an <strong>alias</strong> of <code>orold</code> so that it is compatible with {this.theOriginalEmulator()}. It is in the <strong>same RRR</strong> format and was only added for <strong>backwards compatibility</strong><br/>
                    </div>
                  </InfoArea>
                  <InfoArea state={this.state} title={'xor'} depth={3}>
                    <div className='info-body white'>
                      Use :<br/>
                      <code>xor Rd,Ra,Rb</code><br/>
                      Effects :<br/>
                      <ul>
                        <li>Finds all the <strong>bits</strong> that are equal to 1 in <strong>either</strong> Ra <strong>or</strong> Rb, but <strong>not both</strong>; <strong>the bitwise xor</strong>, denoted by <strong>^</strong></li>
                        <li>Rd := Ra ^ Rb</li>
                      </ul>
                      Machine code :<br/>
                      {this.machineCode( 'xor', 'R1,R2,R3', 0xb )}<br/>
                      <br/>
                      Note :<br/>
                      This command has an <strong>alias</strong> of <code>xorold</code> so that it is compatible with {this.theOriginalEmulator()}. It is in the <strong>same RRR</strong> format and was only added for <strong>backwards compatibility</strong><br/>
                    </div>
                  </InfoArea>
                  <InfoArea state={this.state} title={'trap'} depth={3}>
                    <div className='info-body white'>
                      Use :<br/>
                      <code>trap Rd,Ra,Rb</code><br/>
                      Effects :<br/>
                      <ul>
                        <li>If Rd := 0 :</li>
                        <ul>
                          <li>Program execution <strong>terminated</strong>, no matter what</li>
                          <li>Ra and Rb have <strong>no effect</strong> on this operation but, are expected to be R0</li>
                          <li>Running a program at full speed <strong>requires</strong> a <code>trap R0,R0,R0</code> command, to prevent the IDE from hanging</li>
                        </ul>
                        <li>If Rd := 1 :</li>
                        <ul>
                          <li>Rb, <strong>the buffer's size</strong>, number of characters of the input are <strong>read</strong> in</li>
                          <li>These characters are then <strong>stored</strong> in memory <strong>starting</strong> at Ra, <strong>the buffer address</strong></li>
                        </ul>
                        <li>If Rd := 2 :</li>
                        <ul>
                          <li>Rb, <strong>the buffer's size</strong>, number of characters <strong>from</strong> the <strong>buffer's start</strong>, Ra are <strong>outputted</strong></li>
                        </ul>
                      </ul>
                      Machine code :<br/>
                      {this.machineCode( 'trap', 'R1,R2,R3', 0xd )}
                    </div>
                  </InfoArea>
                </InfoArea>
                <InfoArea state={this.state} title={'RX'} depth={2}>
                  <div className='info-body white' style={{marginBottom : '7px'}}>
                    Compiled RX instructions take up two word in memory, or two memory cells/locations<br/>
                    <br/>
                    Their compiled states can be broken down into :<br/>
                    <ul>
                      <li>op - the <strong>operation code</strong>, like RRR instructions, however, <strong>is always f</strong> for RX instructions</li>
                      <li>d - has <strong>several uses</strong>, depending on the function being performed</li>
                      <li>a - the number of the <strong>index register</strong>, <strong>Ra</strong></li>
                      <li>b - the <strong>secondary operation code</strong>, like the op code for RRR instructions, this specifies which function to perform, based on the passed-in arguments</li>
                      <li>disp - the <strong>displacement</strong>, the second word of the RX instruction</li>
                    </ul>
                    These components make up the machine code words by setting the <strong>first</strong> letter, <strong>0-9 and a-f</strong>, of the <strong>first</strong> 4 letter hex word as the <strong>op</strong> code<br/>
                    Then the <strong>d</strong> code as the <strong>second</strong> letter<br/>
                    The <strong>a</strong> code as the <strong>third</strong> letter<br/>
                    And, the <strong>b</strong> code is set as the <strong>fourth</strong> letter<br/>
                    <br/>
                    Next, the second word is set to the <strong>memory value</strong> of the <strong>label</strong> in the <strong>disp</strong> field, or to the <strong>constant</strong> in its place<br/>
                    <br/>
                    RX instructions all access memory. They do this through <strong>effective addresses</strong>. Effective addresses are calculated by <strong>adding</strong> the <strong>value of Ra</strong> and the <strong>disp field</strong> before any RX instruction is run. If this addition <strong>exceeds</strong> $ffff, it wraps around to <strong>0</strong>.<br/>
                    i.e, <strong>effective address := Ra + disp</strong><br/>
                    <br/>
                    Note :<br/>
                    All machine code examples will involve passing in 'test' as the disp argument. 'test' has an <strong>arbitrary</strong> memory <strong>address</strong> of $0010.<br/>
                    <br/>
                    <div className='machine-code-template'>
                      <pre>
                        ---------------------<br/>
                        | op |  d |  a |  b |<br/>
                        ---------------------<br/>
                        |    displacement   |<br/>
                        ---------------------
                      </pre>
                    </div>
                  </div>
                  <InfoArea state={this.state} title={'lea'} depth={3}>
                    <div className='info-body white'>
                      Use:<br/>
                      <code>lea Rd,disp[Ra]</code><br/>
                      Effects:<br/>
                      <ul>
                        <li>Rd := effective address</li>
                      </ul>
                      Machine code :<br/>
                      {this.machineCode( 'lea', 'R1,test[R2]', 0, 'b' )}<br/>
                      <br/>
                      Note :<br/>
                      <code>lea</code> stands for <strong>load effective address</strong>
                    </div>
                  </InfoArea>
                  <InfoArea state={this.state} title={'load'} depth={3}>
                    <div className='info-body white'>
                      Use:<br/>
                      <code>load Rd,disp[Ra]</code><br/>
                      Effects:<br/>
                      <ul>
                        <li>Rd := memory[effective address]</li>
                      </ul>
                      Machine code :<br/>
                      {this.machineCode( 'load', 'R1,test[R2]', 1, 'b' )}<br/>
                    </div>
                  </InfoArea>
                  <InfoArea state={this.state} title={'store'} depth={3}>
                    <div className='info-body white'>
                      Use:<br/>
                      <code>store Rd,disp[Ra]</code><br/>
                      Effects:<br/>
                      <ul>
                        <li>memory[effective address] := Rd</li>
                      </ul>
                      Machine code :<br/>
                      {this.machineCode( 'store', 'R1,test[R2]', 2, 'b' )}<br/>
                    </div>
                  </InfoArea>
                  <InfoArea state={this.state} title={'jump'} depth={3}>
                    <div className='info-body white'>
                      Use:<br/>
                      <code>jump disp[Ra]</code><br/>
                      Effects:<br/>
                      <ul>
                        <li>control[pc] := memory[effective address]</li>
                      </ul>
                      Machine code :<br/>
                      {this.machineCode( 'jump', 'test[R2]', 3, 'b' )}<br/>
                      <br/>
                      Note :<br/>
                      {this.wrongGroupings( 'jump', 'a JX', 'a disp field and an Ra argument', 'an RX' )}
                    </div>
                  </InfoArea>
                  <InfoArea state={this.state} title={'jumpc0'} depth={3}>
                    <div className='info-body white'>
                      Use:<br/>
                      <code>jumpc0 d,disp[Ra]</code><br/>
                      Effects:<br/>
                      <ul>
                        <li>Gets the value of the <strong>bit</strong> R15.d</li>
                        <li>If this bit is equal to <strong>0</strong>, control[pc] := memory[effective address]</li>
                      </ul>
                      Machine code :<br/>
                      {this.machineCode( 'jumpc0', '1,test[R2]', 4, 'b' )}<br/>
                      <br/>
                      Note :<br/>
                      {this.wrongGroupings( 'jumpc0', 'a KX', 'a 4-bit constant ( 0 - 15 ), a disp field, and, an Ra argument', 'an RX' )}
                    </div>
                  </InfoArea>
                  <InfoArea state={this.state} title={'jumpc1'} depth={3}>
                    <div className='info-body white'>
                      Use:<br/>
                      <code>jumpc1 d,disp[Ra]</code><br/>
                      Effects:<br/>
                      <ul> 
                        <li>Gets the value of the <strong>bit</strong> R15.d</li>
                        <li>If this bit is equal to <strong>1</strong>, control[pc] := memory[effective address]</li>
                      </ul>
                      Machine code :<br/>
                      {this.machineCode( 'jumpc1', '1,test[R2]', 5, 'b' )}<br/>
                      <br/>
                      Note :<br/>
                      {this.wrongGroupings( 'jumpc1', 'a KX', 'a 4-bit constant ( 0 - 15 ), a disp field, and, an Ra argument', 'an RX' )}
                    </div>
                  </InfoArea>
                  <InfoArea state={this.state} title={'jumpf'} depth={3}>
                    <div className='info-body white'>
                      Use:<br/>
                      <code>jumpf Rd,disp[Ra]</code><br/>
                      Effects:<br/>
                      <ul>
                        <li>If the value of Rd is equal to <strong>0</strong>, control[pc] := memory[effective address]</li>
                      </ul>
                      Machine code :<br/>
                      {this.machineCode( 'jumpf', 'R1,test[R2]', 6, 'b' )}<br/>
                    </div>
                  </InfoArea>
                  <InfoArea state={this.state} title={'jumpt'} depth={3}>
                    <div className='info-body white'>
                      Use:<br/>
                      <code>jumpt Rd,disp[Ra]</code><br/>
                      Effects:<br/>
                      <ul>
                        <li>If the value of Rd is equal to <strong>1</strong>, control[pc] := memory[effective address]</li>
                      </ul>
                      Machine code :<br/>
                      {this.machineCode( 'jumpt', 'R1,test[R2]', 7, 'b' )}<br/>
                    </div>
                  </InfoArea>
                  <InfoArea state={this.state} title={'jal'} depth={3}>
                    <div className='info-body white'>
                      Use:<br/>
                      <code>jal Rd,disp[Ra]</code><br/>
                      Effects:<br/>
                      <ul>
                        <li>Rd := control[pc] <strong>+ 2</strong></li>
                        <li>control[pc] := memory[effective address]</li>
                      </ul>
                      Machine code :<br/>
                      {this.machineCode( 'jal', 'R13,test[R2]', 8, 'b' )}<br/>
                      <br/>
                      Note :<br/>
                      <code>jal</code> stands for <strong>jump and link</strong><br/>
                      <br/>
                      It is also standard to use R13 as the destination register for <code>jal</code> commands.<br/>
                    </div>
                  </InfoArea>
                  <InfoArea state={this.state} title={'testset'} depth={3}>
                    <div className='info-body white'>
                      Use:<br/>
                      <code>testset Rd,disp[Ra]</code><br/>
                      Effects:<br/>
                      <ul>
                        <li>Rd := memory[effective address]</li>
                        <li>memory[effective address] := 1</li>
                      </ul>
                      Machine code :<br/>
                      {this.machineCode( 'testset', 'R1,test[R2]', 9, 'b' )}<br/>
                      <br/>
                      Note :<br/>
                      <code>testset</code> is not implemented in {this.theOriginalEmulator()}, however, this implementation does fulfil its intended purpose as per the{'\xa0'/**&nbsp*/}
                      <a 
                        href='https://jtod.github.io/home/Sigma16/releases/3.1.3/docs/html/userguide/userguide.html' 
                        target='_blank' 
                        rel='noopener noreferrer'>
                        original documentation
                      </a>
                      .
                    </div>
                  </InfoArea>
                  <InfoArea state={this.state} title={'Conditional jumps'} depth={3}>
                    <div className='info-body white'>
                      There are a number of <strong>conditional jumps</strong> that act as <strong>aliases</strong> of the <code>jumpc0</code> and <code>jumpc1</code> commands :<br/>
                      <br/>
                      <Table bordered hover size='sm'>
                        <thead>
                          <tr>
                            <th>Command</th>
                            <th>Jumps to effective address if...</th>
                            <th>Alias of</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td><code>jumple disp[Ra]</code></td>
                            <td>...signed <strong>less than</strong> or <strong>equal to</strong></td>
                            <td><code>jumpc0 1,disp[Ra]</code></td>
                          </tr>
                          <tr>
                            <td><code>jumplt disp[Ra]</code></td>
                            <td>...signed <strong>less than</strong></td>
                            <td><code>jumpc1 3,disp[Ra]</code></td>
                          </tr>

                          <tr>
                            <td><code>jumpne disp[Ra]</code></td>
                            <td>...not <strong>equal to</strong></td>
                            <td><code>jumpc0 2,disp[Ra]</code></td>
                          </tr>
                          <tr>
                            <td><code>jumpeq disp[Ra]</code></td>
                            <td>...<strong>equal to</strong></td>
                            <td><code>jumpc1 2,disp[Ra]</code></td>
                          </tr>

                          <tr>
                            <td><code>jumpgt disp[Ra]</code></td>
                            <td>...signed <strong>greater than</strong></td>
                            <td><code>jumpc1 1,disp[Ra]</code></td>
                          </tr>
                          <tr>
                            <td><code>jumpge disp[Ra]</code></td>
                            <td>...signed <strong>greater than</strong> or <strong>equal to</strong></td>
                            <td><code>jumpc0 3,disp[Ra]</code></td>
                          </tr>

                          <tr>
                            <td><code>jumpvu disp[Ra]</code></td>
                            <td>...<strong>unsigned overflow</strong></td>
                            <td><code>jumpc1 5,disp[Ra]</code></td>
                          </tr>
                          <tr>
                            <td><code>jumpnvu disp[Ra]</code></td>
                            <td>...no <strong>unsigned overflow</strong></td>
                            <td><code>jumpc0 5,disp[Ra]</code></td>
                          </tr>

                          <tr>
                            <td><code>jumpv disp[Ra]</code></td>
                            <td>...<strong>signed overflow</strong></td>
                            <td><code>jumpc1 6,disp[Ra]</code></td>
                          </tr>
                          <tr>
                            <td><code>jumpnv disp[Ra]</code></td>
                            <td>...no <strong>signed overflow</strong></td>
                            <td><code>jumpc0 6,disp[Ra]</code></td>
                          </tr>

                          <tr>
                            <td><code>jumpco disp[Ra]</code></td>
                            <td>...<strong>carry output</strong></td>
                            <td><code>jumpc1 7,disp[Ra]</code></td>
                          </tr>
                          <tr>
                            <td><code>jumpnco disp[Ra]</code></td>
                            <td>...no <strong>carry output</strong></td>
                            <td><code>jumpc0 7,disp[Ra]</code></td>
                          </tr>

                          <tr>
                            <td><code>jumpso disp[Ra]</code></td>
                            <td>...<strong>stack overflow</strong></td>
                            <td><code>jumpc1 8,disp[Ra]</code></td>
                          </tr>
                          <tr>
                            <td><code>jumpnso disp[Ra]</code></td>
                            <td>...no <strong>stack overflow</strong></td>
                            <td><code>jumpc0 8,disp[Ra]</code></td>
                          </tr>                            
                        </tbody>
                      </Table>
                      Note :<br/>
                      <code>jumpso</code> and <code>jumpnso</code> are not a part of {this.theOriginalEmulator()} as the associated flags in R15 are not implemented either.
                    </div>
                  </InfoArea>
                </InfoArea>
                <InfoArea state={this.state} title={'EXP'} depth={2}>
                  <div className='info-body white' style={{marginBottom : '7px'}}>
                    The compiled states of EXP commands differ between each <strong>sub-type</strong> : <strong>EXP0</strong>, <strong>EXP4</strong>, or, <strong>EXP8</strong>. However, the element that <strong>does not differ</strong> between different sub-types is the <strong>op code</strong> which is <strong>always e</strong><br/>
                    <br/>
                    Note :<br/>
                    <strong>EXP</strong> stands for both <strong>EXPanded</strong> and <strong>EXPerimental</strong> :<br/>
                    <strong>Expanded</strong> since the <strong>secondary operation code</strong>, <strong>ab</strong>, allows for up to <strong>256</strong> different <strong>functions</strong> to be performed on the arguments<br/>
                    <strong>Experimental</strong> since <q>it allows for experimental instructions for research purposes</q>, from {this.theOriginalEmulator()}.
                  </div>
                  <InfoArea state={this.state} title={'EXP0'} depth={3}>
                    <div className='info-body white'>
                      Compiled <strong>EXP0</strong> instructions take up <strong>one</strong> word in memory, or one memory cell/location<br/>
                      <br/>
                      EXP0 commands' compiled states can be broken down into :<br/>
                      <ul>
                        <li>op - the <strong>operation code</strong>, <strong>is always e</strong> for EXP commands</li>
                        <li>d - has <strong>no uses</strong> in <strong>any</strong> of the implemented EXP0 commands, <strong>will be ignored</strong></li>
                        <li>ab - the <strong>secondary operation code</strong>, like the op code for RRR instructions, this specifies which function to perform, based on the passed-in arguments. This field also takes up <strong>two hex numbers</strong>, i.e <strong>8-bits</strong>. This allows for <strong>256</strong> different EXP commands to be implemented</li>
                      </ul>
                      These components make up a machine code word by setting the <strong>first</strong> letter, <strong>0-9 and a-f</strong>, of the 4 letter hex word as the <strong>op</strong> code<br/>
                      Then the <strong>d</strong> code as the <strong>second</strong> letter<br/>
                      And finally, the <strong>ab</strong> code is set as the <strong>third and fourth</strong> letters<br/>
                      <br/>
                      <div className='machine-code-template'>
                        <pre>
                          ---------------------<br/>
                          | op |  d |    ab   |<br/>
                          ---------------------
                        </pre>
                      </div>
                      Note :<br/>
                      EXP0 commands are named so as they are <strong>EXP</strong> commands that have an <strong>argument constant field length</strong> of <strong>0</strong>, since they have <strong>no</strong> argument constants, i.e no <strong>g</strong> or <strong>h</strong> field.
                    </div>
                    <InfoArea state={this.state} title={'rfi'} depth={4}>
                      <div className='info-body white'>
                        Use :<br/>
                        <code>rfi</code><br/>
                        Effects :<br/>
                        <ul>
                          <li>None</li>
                        </ul>

                        Machine code :<br/>
                        {this.machineCode( 'rfi', '', 0, 'ab' )}<br/>
                        <br/>
                        Note :<br/>
                        Currently a nop, <strong>no operation</strong>, as the required <strong>control registers</strong> from {this.theOriginalEmulator()} have been chosen to not be implemented.<br/>
                        <br/>
                        {this.expParsedAs( 'rfi', 'no arguments', 'noEXP' )}. So, <strong>even when given</strong> arguments, i.e <code>rfi R1,R2,R3</code>, the resultant machine code will still be parsed as <code>$e000</code>
                      </div>
                    </InfoArea>
                  </InfoArea>
                  <InfoArea state={this.state} title={'EXP4'} depth={3}>
                    <div className='info-body white'>
                      Compiled <strong>EXP4</strong> instructions take up <strong>two</strong> words in memory, or two memory cells/locations<br/>
                      <br/>
                      EXP4 commands' compiled states can be broken down into :<br/>
                      <ul>
                        <li>op - the <strong>operation code</strong>, <strong>is always e</strong> for EXP commands</li>
                        <li>d - the number of <strong>a register</strong> which has <strong>several uses</strong> depending on which function is being performed, however, is <strong>mostly</strong> treated as a <strong>destination</strong> register</li>
                        <li>ab - the <strong>secondary operation code</strong>, like the op code for RRR instructions, this specifies which function to perform, based on the passed-in arguments. This field also takes up <strong>two hex numbers</strong>, i.e <strong>8-bits</strong>. This allows for <strong>256</strong> different EXP commands to be implemented</li>
                        <li>e - the number of the <strong>first argument register</strong></li>
                        <li>f - the number of the <strong>second argument register</strong></li>
                        <li>g - the first <strong>4-bit</strong> argument <strong>constant</strong></li>
                        <li>h - the second <strong>4-bit</strong> argument <strong>constant</strong></li>
                      </ul>
                      These components make up the machine code words by setting the <strong>first</strong> letter, <strong>0-9 and a-f</strong>, of the first 4 letter hex word as the <strong>op</strong> code<br/>
                      Then the <strong>d</strong> code as the <strong>second</strong> letter<br/>
                      And, the <strong>ab</strong> code is set as the <strong>third and fourth</strong> letters of the first word<br/>
                      For the <strong>second</strong> word, the <strong>first</strong> to <strong>fourth</strong> letters of the hex word are set as the <strong>e field</strong> to the <strong>h field</strong> respectively<br/>
                      <br/>
                      <div className='machine-code-template'>
                        <pre>
                          ---------------------<br/>
                          | op |  d |    ab   |<br/>
                          ---------------------<br/>
                          |  e |  f |  g |  h |<br/>
                          ---------------------
                        </pre>
                      </div>
                      Note :<br/>
                      EXP4 commands are named so as they are <strong>EXP</strong> commands that have an <strong>argument constant field length</strong> of <strong>4</strong>, since they have <strong>two</strong> argument constants, both <strong>4</strong>-bits long
                    </div>
                    <InfoArea state={this.state} title={'getctl'} depth={4}>
                      <div className='info-body white'>
                        Use :<br/>
                        <code>getctl Rd,cR</code><br/>
                        Effects :<br/>
                        <ul>
                          <li>Rd := control[cR], where cR is a control register; <strong>pc</strong>, <strong>ir</strong>, or, <strong>adr</strong></li>
                        </ul>

                        Machine code :<br/>
                        {this.machineCode( 'getctl', 'R1,pc', 0xa, 'ab' )}<br/>
                        <br/>
                        Note :<br/>
                        This command is also <strong>not fully implemented</strong> like {this.theOriginalEmulator()} as many control registers are not the same. This may make the command perform unpredictably between this emulator and {this.theOriginalEmulator()}<br/>
                        <br/>
                        The <strong>control register</strong> argument is parsed such that the <strong>g field</strong> will be set as a corresponding constant; <strong>pc</strong> := <strong>1</strong>, <strong>ir</strong> := <strong>2</strong>, <strong>adr</strong> := <strong>3</strong><br/>
                        <br/>
                        {this.expParsedAs( 'getctl', 'a register and a control register', 'rcEXP' )}
                      </div>
                    </InfoArea>
                    <InfoArea state={this.state} title={'putctl'} depth={4}>
                      <div className='info-body white'>
                        Use :<br/>
                        <code>putctl Rd,cR</code><br/>
                        Effects :<br/>
                        <ul>
                          <li>Rd := control[cR], where cR is a control register; <strong>pc</strong>, <strong>ir</strong>, or, <strong>adr</strong></li>
                        </ul>

                        Machine code :<br/>
                        {this.machineCode( 'putctl', 'R1,pc', 0xb, 'ab' )}<br/>
                        <br/>
                        Note :<br/>
                        This command is also <strong>not fully implemented</strong> like {this.theOriginalEmulator()} as many control registers are not the same. This may make the command perform unpredictably between this emulator and {this.theOriginalEmulator()}<br/>
                        <br/>
                        The <strong>control register</strong> argument is parsed such that the <strong>g field</strong> will be set as a corresponding constant; <strong>pc</strong> := <strong>1</strong>, <strong>ir</strong> := <strong>2</strong>, <strong>adr</strong> := <strong>3</strong><br/>
                        <br/>
                        {this.expParsedAs( 'putctl', 'a register and a control register', 'rcEXP' )}
                      </div>
                    </InfoArea>
                    <InfoArea state={this.state} title={'execute'} depth={4}>
                      <div className='info-body white'>
                        Use :<br/>
                        <code>execute Re,Rf</code><br/>
                        Effects :<br/>
                        <ul>
                          <li>Runs the machine code present in Re and Rf</li>
                          <li>Will terminate program execution if the passed-in values of Re and Rf are infinitely recursive</li>
                        </ul>

                        Machine code :<br/>
                        {this.machineCode( 'execute', 'R1,R2', 0xc, 'ab' )}<br/>
                        <br/>
                        Note :<br/>
                        If the command <strong>represented</strong> by the machine code in Re is an <strong>RRR</strong> or an <strong>EXP0</strong> command, i.e <strong>one word</strong>, then Rf is ignored<br/>
                        <br/>
                        This command is also <strong>not implemented</strong> in {this.theOriginalEmulator()} so edge cases such as infinite recursion have been handled as seen appropriate. The command does assemble however, not as per {this.theOriginalEmulator()}'s documentation, and it has no functionality<br/>
                        <br/>
                        {this.expParsedAs( 'execute', 'two registers', 'rrEXP' )}
                      </div>
                    </InfoArea>
                    <InfoArea state={this.state} title={'push'} depth={4}>
                      <div className='info-body white'>
                        Use :<br/>
                        <code>push Rd,Re,Rf</code><br/>
                        Effects :<br/>
                        <ul>
                          <li>Pushes to the defined stack, or more precisely :</li>
                          <li>If Re, the <strong>stack top</strong>, is <strong>less than</strong> Rf, the <strong>stack bottom</strong>, i.e the <strong>stack</strong> is <strong>not full</strong>, then :</li>
                          <ul>
                            <li>Re := Re + 1</li>
                            <li>memory[Re] := Rd</li>
                          </ul>
                          <li>else :</li>
                          <ul>
                            {this.flagsSet( 'push', [ 'S' ], false )}
                          </ul>
                        </ul>

                        Machine code :<br/>
                        {this.machineCode( 'push', 'R1,R2,R3', 0xd, 'ab' )}<br/>
                        <br/>
                        Note :<br/>
                        This command is also <strong>not implemented</strong> in {this.theOriginalEmulator()} as even though it parses, it does not have <strong>any functionality</strong><br/>
                        <br/>
                        {this.expParsedAs( 'push', 'three registers', 'rrrEXP' )}
                      </div>
                    </InfoArea>
                    <InfoArea state={this.state} title={'pop'} depth={4}>
                      <div className='info-body white'>
                        Use :<br/>
                        <code>pop Rd,Re,Rf</code><br/>
                        Effects :<br/>
                        <ul>
                          <li>Pops the defined stack, or more precisely :</li>
                          <li>If Re, the <strong>stack top</strong>, is <strong>less then</strong> or <strong>equal to</strong> Rf, the <strong>stack bottom</strong>, i.e the <strong>stack</strong> is <strong>defined properly</strong> and is <strong>either full</strong> or <strong>not</strong>, then :</li>
                          <ul>
                            <li>Rd := memory[Re]</li>
                            <li>Re := Re - 1</li>
                          </ul>
                        </ul>

                        Machine code :<br/>
                        {this.machineCode( 'pop', 'R1,R2,R3', 0xe, 'ab' )}<br/>
                        <br/>
                        Note :<br/>
                        This command is also <strong>not implemented</strong> in {this.theOriginalEmulator()} as even though it parses, it does not have <strong>any functionality</strong><br/>
                        <br/>
                        {this.expParsedAs( 'pop', 'three registers', 'rrrEXP' )}
                      </div>
                    </InfoArea>
                    <InfoArea state={this.state} title={'top'} depth={4}>
                      <div className='info-body white'>
                        Use :<br/>
                        <code>top Rd,Re,Rf</code><br/>
                        Effects :<br/>
                        <ul>
                          <li>Rd := memory[Re], i.e loads the stack top without popping the stack</li>
                        </ul>

                        Machine code :<br/>
                        {this.machineCode( 'top', 'R1,R2,R3', 0xf, 'ab' )}<br/>
                        <br/>
                        Note :<br/>
                        This command is also <strong>not implemented</strong> in {this.theOriginalEmulator()} as even though it parses, it does not have <strong>any functionality</strong><br/>
                        <br/>
                        {this.expParsedAs( 'top', 'three registers', 'rrrEXP' )}
                      </div>
                    </InfoArea>
                    <InfoArea state={this.state} title={'addc'} depth={4}>
                      <div className='info-body white'>
                        Use :<br/>
                        <code>addc Rd,Re,Rf</code><br/>
                        Effects :<br/>
                        <ul>
                          <li><strong>Adds</strong> Re and Rf along with the <strong>carry</strong> output <strong>bit</strong> in R15</li>
                          <li>Rd := Re + Rf + R15.7</li>
                          {this.flagsSet( 'addc', [ 'G', 'g', 'E', 'l', 'L', 'V', 'C' ] )}
                        </ul>

                        Machine code :<br/>
                        {this.machineCode( 'addc', 'R1,R2,R3', 0xf, 'ab' )}<br/>
                        <br/>
                        Note :<br/>
                        This command is also <strong>not implemented</strong> in {this.theOriginalEmulator()} at all and <strong>will</strong> cause an assembler error<br/>
                        <br/>
                        {this.expParsedAs( 'addc', 'three registers', 'rrrEXP' )}
                      </div>
                    </InfoArea>
                    <InfoArea state={this.state} title={'shiftl'} depth={4}>
                      <div className='info-body white'>
                        Use :<br/>
                        <code>shiftl Rd,Re,g</code><br/>
                        Effects :<br/>
                        <ul>
                          <li><strong>Bit shifts</strong> Re, g number of bits <strong>left</strong></li>
                          {this.flagsSet( 'shiftl', [ 'V' ], false )}
                          <li>Rd := Re {'<<'} g</li>
                        </ul>

                        Machine code :<br/>
                        {this.machineCode( 'shiftl', 'R1,R2,3', 0x10, 'ab' )}<br/>
                        <br/>
                        Note :<br/>
                        {this.expParsedAs( 'shiftl', 'two registers and a constant', 'rrkEXP' )}
                      </div>
                    </InfoArea>
                    <InfoArea state={this.state} title={'shiftr'} depth={4}>
                      <div className='info-body white'>
                        Use :<br/>
                        <code>shiftr Rd,Re,g</code><br/>
                        Effects :<br/>
                        <ul>
                          <li><strong>Bit shifts</strong> Re, g number of bits <strong>right</strong>, adding padding <strong>0</strong>s to the <strong>start</strong> of the result to keep it <strong>16-bits long</strong></li>
                          {this.flagsSet( 'shiftr', [ 'V' ], false )}
                          <li>Rd := Re {'>>'} g</li>
                        </ul>

                        Machine code :<br/>
                        {this.machineCode( 'shiftr', 'R1,R2,3', 0x11, 'ab' )}<br/>
                        <br/>
                        Note :<br/>
                        {this.expParsedAs( 'shiftr', 'two registers and a constant', 'rrkEXP' )}
                      </div>
                    </InfoArea>
                    <InfoArea state={this.state} title={'getbit'} depth={4}>
                      <div className='info-body white'>
                        Use :<br/>
                        <code>getbit Rd,g</code><br/>
                        Effects :<br/>
                        <ul>
                          <li><strong>Updates</strong> the <strong>g</strong>th bit of Rd to the <strong>g</strong>th of R15</li>
                          <li>Rd.g := R15.g</li>
                        </ul>

                        Machine code :<br/>
                        {this.machineCode( 'getbit', 'R1,2', 0x18, 'ab' )}<br/>
                        <br/>
                        Note :<br/>
                        This command is also <strong>not implemented</strong> in {this.theOriginalEmulator()} at all and <strong>will</strong> cause an assembler error<br/>
                        <br/>
                        {this.expParsedAs( 'getbit', 'a register and a constant', 'rkEXP' )}
                      </div>
                    </InfoArea>
                    <InfoArea state={this.state} title={'getbiti'} depth={4}>
                      <div className='info-body white'>
                        Use :<br/>
                        <code>getbiti Rd,g</code><br/>
                        Effects :<br/>
                        <ul>
                          <li><strong>Updates</strong> the <strong>g</strong>th bit of Rd to the <strong>inverted g</strong>th of R15</li>
                          <li>Rd.g := ~ R15.g</li>
                        </ul>

                        Machine code :<br/>
                        {this.machineCode( 'getbiti', 'R1,2', 0x19, 'ab' )}<br/>
                        <br/>
                        Note :<br/>
                        This command is also <strong>not implemented</strong> in {this.theOriginalEmulator()} at all and <strong>will</strong> cause an assembler error<br/>
                        <br/>
                        {this.expParsedAs( 'getbiti', 'a register and a constant', 'rkEXP' )}
                      </div>
                    </InfoArea>
                    <InfoArea state={this.state} title={'putbit'} depth={4}>
                      <div className='info-body white'>
                        Use :<br/>
                        <code>putbit Rd,g</code><br/>
                        Effects :<br/>
                        <ul>
                          <li><strong>Updates</strong> the <strong>g</strong>th bit of R15 to the <strong>g</strong>th of Rd</li>
                          <li>R15.g := Rd.g</li>
                        </ul>

                        Machine code :<br/>
                        {this.machineCode( 'putbit', 'R1,2', 0x1a, 'ab' )}<br/>
                        <br/>
                        Note :<br/>
                        This command is also <strong>not implemented</strong> in {this.theOriginalEmulator()} at all and <strong>will</strong> cause an assembler error<br/>
                        <br/>
                        {this.expParsedAs( 'putbit', 'a register and a constant', 'rkEXP' )}
                      </div>
                    </InfoArea>
                    <InfoArea state={this.state} title={'putbiti'} depth={4}>
                      <div className='info-body white'>
                        Use :<br/>
                        <code>putbiti Rd,g</code><br/>
                        Effects :<br/>
                        <ul>
                          <li><strong>Updates</strong> the <strong>g</strong>th bit of R15 to the <strong>inverted g</strong>th of Rd</li>
                          <li>R15.g := Rd.g</li>
                        </ul>

                        Machine code :<br/>
                        {this.machineCode( 'putbiti', 'R1,2', 0x1b, 'ab' )}<br/>
                        <br/>
                        Note :<br/>
                        This command is also <strong>not implemented</strong> in {this.theOriginalEmulator()} at all and <strong>will</strong> cause an assembler error<br/>
                        <br/>
                        {this.expParsedAs( 'putbiti', 'a register and a constant', 'rkEXP' )}
                      </div>
                    </InfoArea>
                    <InfoArea state={this.state} title={'extract'} depth={4}>
                      <div className='info-body white'>
                        Use :<br/>
                        <code>extract Rd,Re,g,h</code><br/>
                        Effects :<br/>
                        <ul>
                          <li>Finds the bits in Re <strong>from</strong> g <strong>to</strong> h, and sets Rd to the <strong>value</strong> of these bits. This can be performed with <strong>two bit shifts</strong> :</li>
                          <ul>
                            <li>Rd := Re {'<<'} g</li>
                            <li>Rd := Rd {'>>'} 15 - h + g</li>
                          </ul>
                        </ul>

                        Machine code :<br/>
                        {this.machineCode( 'extract', 'R1,R2,3,4', 0x12, 'ab' )}<br/>
                        <br/>
                        Note :<br/>
                        {this.expParsedAs( 'extract', 'two registers and two constants', 'rrkkEXP' )}
                      </div>
                    </InfoArea>
                    <InfoArea state={this.state} title={'extracti'} depth={4}>
                      <div className='info-body white'>
                        Use :<br/>
                        <code>extracti Rd,Re,g,h</code><br/>
                        Effects :<br/>
                        <ul>
                          <li><strong>Inverts</strong> Re and <strong>then</strong>, finds the bits <strong>from</strong> g <strong>to</strong> h, and sets Rd to the <strong>value</strong> of these inverted bits. This can be performed with <strong>one inversion</strong> and <strong>two bit shifts</strong> :</li>
                          <ul>
                            <li>Rd := ~ Re </li>
                            <li>Rd := Rd {'<<'} g</li>
                            <li>Rd := Rd {'>>'} 15 - h + g</li>
                          </ul>
                        </ul>

                        Machine code :<br/>
                        {this.machineCode( 'extracti', 'R1,R2,3,4', 0x13, 'ab' )}<br/>
                        <br/>
                        Note :<br/>
                        {this.expParsedAs( 'extracti', 'two registers and two constants', 'rrkkEXP' )}
                      </div>
                    </InfoArea>
                    <InfoArea state={this.state} title={'inject'} depth={4}>
                      <div className='info-body white'>
                        Use :<br/>
                        <code>inject Rd,Re,Rf,g,h</code><br/>
                        Effects :<br/>
                        <ul>
                          <li>Sets the bits <strong>from</strong> g <strong>to</strong> h <strong>in</strong> Rf to the <strong>same</strong> bits in Re and <strong>sets</strong> the result into Rd</li>
                        </ul>

                        Machine code :<br/>
                        {this.machineCode( 'inject', 'R1,R2,R3,4,5', 0x14, 'ab' )}<br/>
                        <br/>
                        Note :<br/>
                        {this.expParsedAs( 'inject', 'three registers and two constants', 'rrrkkEXP' )}
                      </div>
                    </InfoArea>
                    <InfoArea state={this.state} title={'injecti'} depth={4}>
                      <div className='info-body white'>
                        Use :<br/>
                        <code>injecti Rd,Re,Rf,g,h</code><br/>
                        Effects :<br/>
                        <ul>
                          <li><strong>Inverts</strong> Rf's bits</li>
                          <li>Sets these <strong>inverted</strong> bits <strong>from</strong> g <strong>to</strong> h <strong>in</strong> Rf to the <strong>same</strong> bits in Re and <strong>sets</strong> the result into Rd</li>
                        </ul>

                        Machine code :<br/>
                        {this.machineCode( 'injecti', 'R1,R2,R3,4,5', 0x15, 'ab' )}<br/>
                        <br/>
                        Note :<br/>
                        {this.expParsedAs( 'injecti', 'three registers and two constants', 'rrrkkEXP' )}
                      </div>
                    </InfoArea>
                    <InfoArea state={this.state} title={'field'} depth={4}>
                      <div className='info-body white'>
                        <code>field</code> is an <strong>alias</strong> for the <code>injecti</code> command.<br/>
                        It allows a range of bits to be set, from <strong>g</strong> to <strong>h</strong>, as <strong>1</strong>, creating a <strong>field</strong> of bits, hence the name<br/>
                        <br/>
                        Use :<br/>
                        <code>field Rd,g,h</code><br/>
                        Effects :<br/>
                        <ul>
                          <li>Sets a <strong>field</strong> of bits from <strong>g</strong> to <strong>h</strong> into Rd</li>
                        </ul>

                        Machine code :<br/>
                        {this.machineCode( 'field', 'R1,2,3', 0x15, 'ab' )}<br/>
                        The same <strong>op code</strong> as <code>injecti</code> as that is what its an <strong>alias</strong> of<br/>
                        Note how the <strong>f field</strong> is <strong>0</strong> as that is the what is being <strong>injected from</strong>, <strong>R0</strong><br/>
                        <br/>
                        Note :<br/>
                        This command is also <strong>not implemented</strong> in {this.theOriginalEmulator()}. It <strong>will not cause</strong> an assembler <strong>error</strong>, however, it <strong>will not compile</strong> with machine code translations and therefore <strong>not work</strong> as a command<br/>
                        <br/>
                        Since <code>field</code> is an <strong>alias</strong> of <code>injecti</code>, it is parsed as an <strong>injectIAlias</strong> command, similar to an <strong>rkkEXP</strong> command, but specifically for <code>injecti</code> aliases<br/>
                      </div>
                    </InfoArea>
                    <InfoArea state={this.state} title={'logicw'} depth={4}>
                      <div className='info-body white'>
                        Use :<br/>
                        <code>logicw Rd,Re,Rf,g</code><br/>
                        Effects :<br/>
                        <ul>
                          <li>Depending on the <strong>value</strong> of the constant <strong>g</strong>, different <strong>logic operations</strong> get performed on the <strong>argument registers</strong>, setting the result into <strong>Rd</strong> :</li>
                          <li>g := <strong>1</strong> :</li>
                            <ul>
                              <li>Bitwise and</li>
                              <li>Rd := Re & Rf</li>
                            </ul>
                          <li>g := <strong>6</strong> :</li>
                            <ul>
                              <li>Bitwise exclusive or</li>
                              <li>Rd := Re ^ Rf</li>
                            </ul>
                          <li>g := <strong>7</strong> :</li>
                            <ul>
                              <li>Bitwise or</li>
                              <li>Rd := Re | Rf</li>
                            </ul>
                          <li>g := <strong>$c</strong> :</li>
                            <ul>
                              <li>Bitwise inverse</li>
                              <li>Rd := ~ Re</li>
                            </ul>
                        </ul>

                        Machine code :<br/>
                        {this.machineCode( 'logicw', 'R1,R2,R3,4', 0x16, 'ab' )}<br/>
                        <br/>
                        Note :<br/>
                        {this.expParsedAs( 'logicw', 'three registers and a constant', 'rrrkEXP' )}
                      </div>
                    </InfoArea>
                    <InfoArea state={this.state} title={'logicb'} depth={4}>
                      <div className='info-body white'>
                        Use :<br/>
                        <code>logicb Rd,Re,Rf,g,h</code><br/>
                        Effects :<br/>
                        <ul>
                          <li>Depending on the <strong>value</strong> of the constant <strong>g</strong>, different <strong>logic operations</strong> get performed on the <strong>argument registers h</strong>th bit, setting the result into <strong>Rd</strong>'s <strong>h</strong>th bit :</li>
                          <li>g := <strong>1</strong> :</li>
                            <ul>
                              <li>Bit and</li>
                              <li>Rd.h := Re.h & Rf.h</li>
                            </ul>
                          <li>g := <strong>6</strong> :</li>
                            <ul>
                              <li>Bit exclusive or</li>
                              <li>Rd.h := Re.h ^ Rf.h</li>
                            </ul>
                          <li>g := <strong>7</strong> :</li>
                            <ul>
                              <li>Bit or</li>
                              <li>Rd.h := Re.h | Rf.h</li>
                            </ul>
                          <li>g := <strong>$c</strong> :</li>
                            <ul>
                              <li>Bit inverse</li>
                              <li>Rd.h := ~ Re.h</li>
                            </ul>
                        </ul>

                        Machine code :<br/>
                        {this.machineCode( 'logicb', 'R1,R2,R3,4,5', 0x17, 'ab' )}<br/>
                        <br/>
                        Note :<br/>
                        {this.expParsedAs( 'logicb', 'three registers and two constants', 'rrrkkEXP' )}
                      </div>
                    </InfoArea>
                    <InfoArea state={this.state} title={'Logic aliases'} depth={4}>
                      <div className='info-body white'>
                        There are a number of <strong>aliases</strong> of the <code>logicw</code> and <code>logicb</code> commands :<br/>
                        <br/>
                        <Table bordered hover size='sm'>
                          <thead>
                            <tr>
                              <th>Command</th>
                              <th>Meaning</th>
                              <th>Alias of</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr>
                              <td><code>invnew Rd,Re</code></td>
                              <td>Rd := <strong>~</strong> Re</td>
                              <td><code>logicw Rd,Re,R0,$c</code></td>
                            </tr>
                            <tr>
                              <td><code>andnew R1,Re,Rf</code></td>
                              <td>Rd := Re <strong>&</strong> Rf</td>
                              <td><code>logicw Rd,Re,Rf,1</code></td>
                            </tr>
                            <tr>
                              <td><code>ornew Rd,Re,Rf</code></td>
                              <td>Rd := Re <strong>|</strong> Rf</td>
                              <td><code>logicw Rd,Re,Rf,7</code></td>
                            </tr>
                            <tr>
                              <td><code>xornew Rd,Re,Rf</code></td>
                              <td>Rd := Re <strong>^</strong> Rf</td>
                              <td><code>logicw Rd,Re,Rf,6</code></td>
                            </tr>

                            <tr>
                              <td><code>invb Rd,Re,h</code></td>
                              <td>Rd<strong>.h</strong> := <strong>~</strong> Re<strong>.h</strong></td>
                              <td><code>logicb Rd,Re,R0,$c,h</code></td>
                            </tr>
                            <tr>
                              <td><code>andb Rd,Re,Rf,h</code></td>
                              <td>Rd<strong>.h</strong> := Re<strong>.h &</strong> Rf<strong>.h</strong></td>
                              <td><code>logicb Rd,Re,Rf,1,h</code></td>
                            </tr>
                            <tr>
                              <td><code>orb Rd,Re,Rf,h</code></td>
                              <td>Rd<strong>.h</strong> := Re<strong>.h |</strong> Rf<strong>.h</strong></td>
                              <td><code>logicb Rd,Re,Rf,7,h</code></td>
                            </tr>
                            <tr>
                              <td><code>xorb Rd,Re,Rf,h</code></td>
                              <td>Rd<strong>.h</strong> := Re<strong>.h ^</strong> Rf<strong>.h</strong></td>
                              <td><code>logicb Rd,Re,Rf,6,h</code></td>
                            </tr>
                          </tbody>
                        </Table>
                        Note :<br/>
                        <code>invnew</code>, <code>andnew</code>, <code>ornew</code>, and, <code>xornew</code> are <strong>no longer</strong> a part of {this.theOriginalEmulator()}, however, the <strong>same functionality</strong> can be had with <strong>replacing</strong> them with their <strong>non-new</strong> variants, i.e <code>andnew</code> becomes <code>and</code>
                      </div>
                    </InfoArea>
                  </InfoArea>
                  <InfoArea state={this.state} title={'EXP8'} depth={3}>
                    <div className='info-body white'>
                      Compiled <strong>EXP8</strong> instructions take up <strong>two</strong> words in memory, or two memory cells/locations<br/>
                      <br/>
                      EXP8 commands' compiled states can be broken down into :<br/>
                      <ul>
                        <li>op - the <strong>operation code</strong>, <strong>is always e</strong> for EXP commands</li>
                        <li>d - the number of <strong>a register</strong> which has <strong>several uses</strong> depending on which function is being performed, however, is <strong>mostly</strong> treated as a <strong>destination</strong> register</li>
                        <li>ab - the <strong>secondary operation code</strong>, like the op code for RRR instructions, this specifies which function to perform, based on the passed-in arguments. This field also takes up <strong>two hex numbers</strong>, i.e <strong>8-bits</strong>. This allows for <strong>256</strong> different EXP commands to be implemented</li>
                        <li>e - the number of the <strong>first argument register</strong></li>
                        <li>f - the number of the <strong>second argument register</strong></li>
                        <li>gh - the <strong>8-bit</strong> argument <strong>constant</strong></li>
                      </ul>
                      These components make up the machine code words by setting the <strong>first</strong> letter, <strong>0-9 and a-f</strong>, of the first 4 letter hex word as the <strong>op</strong> code<br/>
                      Then the <strong>d</strong> code as the <strong>second</strong> letter<br/>
                      And, the <strong>ab</strong> code is set as the <strong>third and fourth</strong> letters of the first word<br/>
                      For the <strong>second</strong> word, the <strong>first</strong> and <strong>second</strong> letters of the hex word are set as the <strong>e field</strong> and the <strong>f field</strong> respectively<br/>
                      Then lastly, the <strong>third and fourth</strong> letters are set as the <strong>gh field</strong> to complete the second word<br/>
                      <br/>
                      <div className='machine-code-template'>
                        <pre>
                          ---------------------<br/>
                          | op |  d |    ab   |<br/>
                          ---------------------<br/>
                          |  e |  f |    gh   |<br/>
                          ---------------------
                        </pre>
                      </div>
                      Note :<br/>
                      EXP8 commands are named so as they are <strong>EXP</strong> commands that have an <strong>argument constant field length</strong> of <strong>8</strong>, since they have <strong>one</strong> argument constant which is <strong>8</strong>-bits long
                    </div>
                    <InfoArea state={this.state} title={'save'} depth={4}>
                      <div className='info-body white'>
                        Use :<br/>
                        <code>save Re,Rf,disp[Rd]</code><br/>
                        Effects :<br/>
                        <ul>
                          <li>For each register between and including Re and Rf :</li>
                            <ul>
                              <li>memory[disp + Rd + iteration] := R(e + iteration)</li>
                            </ul>
                          <li>i.e, <code>save R1,R4,10[Rd]</code> is equivalent to :</li>
                          <ul>
                            <li><code>store R1,10[Rd]</code></li>
                            <li><code>store R2,11[Rd]</code></li>
                            <li><code>store R3,12[Rd]</code></li>
                            <li><code>store R4,13[Rd]</code></li>
                          </ul>
                        </ul>

                        Machine code :<br/>
                        {this.machineCode( 'save', 'R1,R2,3[R4]', 0x8, 'ab' )}<br/>
                        <br/>
                        Note :<br/>
                        the <strong>disp</strong> field takes a constant value from <strong>0</strong> to <strong>255</strong><br/>
                        <br/>
                        If <strong>Re</strong> is <strong>greater than Rf</strong>, then the registers are <strong>iterated</strong> through normally, <strong>wraps around</strong> to <strong>R0</strong> after reaching <strong>R15</strong><br/>
                        <br/>
                        {this.expParsedAs( 'save', 'two registers, a disp field, and, an index register', 'rrxEXP' )}
                      </div>
                    </InfoArea>
                    <InfoArea state={this.state} title={'restore'} depth={4}>
                      <div className='info-body white'>
                        Use :<br/>
                        <code>restore Re,Rf,disp[Rd]</code><br/>
                        Effects :<br/>
                        <ul>
                          <li>For each register between and including Re and Rf :</li>
                            <ul>
                              <li>R(e + iteration) := memory[disp + Rd + iteration]</li>
                            </ul>
                          <li>i.e, <code>restore R1,R4,10[Rd]</code> is equivalent to :</li>
                          <ul>
                            <li><code>load R1,10[Rd]</code></li>
                            <li><code>load R2,11[Rd]</code></li>
                            <li><code>load R3,12[Rd]</code></li>
                            <li><code>load R4,13[Rd]</code></li>
                          </ul>
                        </ul>

                        Machine code :<br/>
                        {this.machineCode( 'restore', 'R1,R2,3[R4]', 0x9, 'ab' )}<br/>
                        <br/>
                        Note :<br/>
                        the <strong>disp</strong> field takes a constant value from <strong>0</strong> to <strong>255</strong><br/>
                        <br/>
                        If <strong>Re</strong> is <strong>greater than Rf</strong>, then the registers are <strong>iterated</strong> through normally, <strong>wraps around</strong> to <strong>R0</strong> after reaching <strong>R15</strong><br/>
                        <br/>
                        {this.expParsedAs( 'restore', 'two registers, a disp field, and, an index register', 'rrxEXP' )}
                      </div>
                    </InfoArea>
                  </InfoArea>
                </InfoArea>
                <InfoArea state={this.state} title={'All instructions'} depth={2}>
                  <div className='info-body white'>
                    <Table bordered hover size='sm'>
                      <thead>
                        <tr>
                          <th>Command</th>
                          <th>Summary of function</th>
                          <th>Example and Machine Code</th>
                        </tr>
                      </thead>
                      <tbody>
                        {this.summaryTableRow( 'data', 'Memory cell of line := constant', 'data $001f' )}
                        {this.summaryTableRow( 'add', 'Rd := Ra + Rb; R15 flags set', 'add R1,R2,R3' )}
                        {this.summaryTableRow( 'sub', 'Rd := Ra - Rb; R15 flags set', 'sub R1,R2,R3' )}
                        {this.summaryTableRow( 'mul', 'Rd := Ra * Rb; R15 flags set', 'mul R1,R2,R3' )}
                        {this.summaryTableRow( 'div', 'Rd := Ra / Rb; R15 := Ra % Rb', 'div R1,R2,R3' )}
                        {this.summaryTableRow( 'cmp', 'R15 flags set', 'cmp R1,R2' )}
                        {this.summaryTableRow( 'cmplt', 'Rd := Ra < Rb', 'cmplt R1,R2,R3' )}
                        {this.summaryTableRow( 'cmpeq', 'Rd := Ra == Rb', 'cmpeq R1,R2,R3' )}
                        {this.summaryTableRow( 'cmpgt', 'Rd := Ra > Rb', 'cmpgt R1,R2,R3' )}
                        {this.summaryTableRow( 'inv', 'Rd := ~ Ra', 'inv R1,R2' )}
                        {this.summaryTableRow( 'invold', 'Rd := ~ Ra', 'invold R1,R2' )}
                        {this.summaryTableRow( 'and', 'Rd := Ra & Rb', 'and R1,R2,R3' )}
                        {this.summaryTableRow( 'andold', 'Rd := Ra & Rb', 'andold R1,R2,R3' )}
                        {this.summaryTableRow( 'or', 'Rd := Ra | Rb', 'or R1,R2,R3' )}
                        {this.summaryTableRow( 'orold', 'Rd := Ra | Rb', 'orold R1,R2,R3' )}
                        {this.summaryTableRow( 'xor', 'Rd := Ra ^ Rb', 'xor R1,R2,R3' )}
                        {this.summaryTableRow( 'xorold', 'Rd := Ra ^ Rb', 'xorold R1,R2,R3' )}
                        {this.summaryTableRow( 'trap', 'Terminates, reads in, or, writes out', 'trap R1,R2,R3' )}

                        {this.summaryTableRow( 'rfi', 'nop', 'rfi' )}
                        {this.summaryTableRow( 'save', 'Stores registers Re -> Rf in memory[disp + Rd + iteration]', 'save R1,R2,3[R4]' )}
                        {this.summaryTableRow( 'restore', 'Loads registers Re -> Rf with memory[disp + Rd + iteration]', 'restore R1,R2,3[R4]' )}
                        {this.summaryTableRow( 'getctl', 'Rd := control[cR]', 'getctl R1,pc' )}
                        {this.summaryTableRow( 'putctl', 'control[cR] := Rd', 'putctl R1,pc' )}
                        {this.summaryTableRow( 'execute', 'Executes Re and Rf as machine code', 'execute R1,R2' )}
                        {this.summaryTableRow( 'push', 'Pushes to defined stack; R15 flags set', 'push R1,R2,R3' )}
                        {this.summaryTableRow( 'pop', 'Pops from defined stack', 'pop R1,R2,R3' )}
                        {this.summaryTableRow( 'top', 'Peeks at top of defined stack', 'top R1,R2,R3' )}
                        {this.summaryTableRow( 'shiftl', 'Rd := Re << g', 'shiftl R1,R2,3' )}
                        {this.summaryTableRow( 'shiftr', 'Rd := Re >> g', 'shiftr R1,R2,3' )}
                        {this.summaryTableRow( 'extract', 'Rd := Re >> g; Rd := Rd << 15 - h + g', 'extract R1,R2,3,4' )}
                        {this.summaryTableRow( 'extracti', 'Rd := ~ Re; Rd := Rd >> g; Rd := Rd << 15 - h + g', 'extracti R1,R2,3,4' )}
                        {this.summaryTableRow( 'inject', 'Rd := Re injected with bits g -> h from Rf', 'inject R1,R2,R3,4,5' )}
                        {this.summaryTableRow( 'injecti', 'Rd := Re injected with inverted bits g -> h from Rf', 'injecti R1,R2,R3,4,5' )}
                        {this.summaryTableRow( 'field', 'Rd.g -> Rd.h := 1', 'field R1,2,3' )}
                        {this.summaryTableRow( 'logicw', 'Bit-wise logic operation performed on Re and Rf based on g', 'logicw R1,R2,R3,4' )}
                        {this.summaryTableRow( 'invnew', 'Rd := ~ Re', 'invnew R1,R2' )}
                        {this.summaryTableRow( 'andnew', 'Rd := Re & Rf', 'andnew R1,R2,R3' )}
                        {this.summaryTableRow( 'ornew', 'Rd := Re | Rf', 'ornew R1,R2,R3' )}
                        {this.summaryTableRow( 'xornew', 'Rd := Re ^ Rf', 'xornew R1,R2,R3' )}
                        {this.summaryTableRow( 'logicb', 'Bit logic operation performed on Re.h and Rf.h based on g', 'logicb R1,R2,R3,4,5' )}
                        {this.summaryTableRow( 'invb', 'Rd.h := ~ Re.h', 'invb R1,R2,3' )}
                        {this.summaryTableRow( 'andb', 'Rd.h := Re.h & Rf.h', 'andb R1,R2,R3,4' )}
                        {this.summaryTableRow( 'orb', 'Rd.h := Re.h | Rf.h', 'orb R1,R2,R3,4' )}
                        {this.summaryTableRow( 'xorb', 'Rd.h := Re.h ^ Rf.h', 'xorb R1,R2,R3,4' )}
                        {this.summaryTableRow( 'getbit', 'Rd.g := R15.g', 'getbit R1,2' )}
                        {this.summaryTableRow( 'getbiti', 'Rd.g := ~ R15.g', 'getbiti R1,2' )}
                        {this.summaryTableRow( 'putbit', 'R15.g := Rd.g', 'putbit R1,2' )}
                        {this.summaryTableRow( 'putbiti', 'R15.g := ~ Rd.g', 'putbiti R1,2' )}
                        {this.summaryTableRow( 'addc', 'Rd := Re + Rf + R15.7; R15 flags set', 'addc R1,R2,R3' )}

                        {this.summaryTableRow( 'lea', 'Rd := disp + Ra', 'lea R1,test[R3]' )}
                        {this.summaryTableRow( 'load', 'Rd := memory[disp + Ra]', 'load R1,test[R3]' )}
                        {this.summaryTableRow( 'store', 'memory[disp + Ra] := Rd', 'store R1,test[R3]' )}
                        {this.summaryTableRow( 'jump', 'control[pc] := disp + Ra', 'jump test[R1]' )}
                        {this.summaryTableRow( 'jumpc0', 'If R15.d := 0, control[pc] := disp + Ra', 'jumpc0 1,test[R2]' )}
                        {this.summaryTableRow( 'jumple', 'If R15.1 := 0, control[pc] := disp + Ra', 'jumple test[R1]' )}
                        {this.summaryTableRow( 'jumpne', 'If R15.2 := 0, control[pc] := disp + Ra', 'jumpne test[R1]' )}
                        {this.summaryTableRow( 'jumpge', 'If R15.3 := 0, control[pc] := disp + Ra', 'jumpge test[R1]' )}
                        {this.summaryTableRow( 'jumpnvu', 'If R15.5 := 0, control[pc] := disp + Ra', 'jumpnvu test[R1]' )}
                        {this.summaryTableRow( 'jumpnv', 'If R15.6 := 0, control[pc] := disp + Ra', 'jumpnv test[R1]' )}
                        {this.summaryTableRow( 'jumpnco', 'If R15.7 := 0, control[pc] := disp + Ra', 'jumpnco test[R1]' )}
                        {this.summaryTableRow( 'jumpnso', 'If R15.8 := 0, control[pc] := disp + Ra', 'jumpnso test[R1]' )}
                        {this.summaryTableRow( 'jumpc1', 'If R15.d := 1, control[pc] := disp + Ra', 'jumpc1 1,test[R2]' )}
                        {this.summaryTableRow( 'jumpgt', 'If R15.1 := 1, control[pc] := disp + Ra', 'jumpgt test[R1]' )}
                        {this.summaryTableRow( 'jumpeq', 'If R15.2 := 1, control[pc] := disp + Ra', 'jumpeq test[R1]' )}
                        {this.summaryTableRow( 'jumplt', 'If R15.3 := 1, control[pc] := disp + Ra', 'jumplt test[R1]' )}
                        {this.summaryTableRow( 'jumpvu', 'If R15.5 := 1, control[pc] := disp + Ra', 'jumpvu test[R1]' )}
                        {this.summaryTableRow( 'jumpv', 'If R15.6 := 1, control[pc] := disp + Ra', 'jumpv test[R1]' )}
                        {this.summaryTableRow( 'jumpco', 'If R15.7 := 1, control[pc] := disp + Ra', 'jumpco test[R1]' )}
                        {this.summaryTableRow( 'jumpso', 'If R15.8 := 1, control[pc] := disp + Ra', 'jumpso test[R1]' )}
                        {this.summaryTableRow( 'jumpf', 'If Rd := 0, control[pc] := disp + Ra', 'jumpf R1,test[R2]' )}
                        {this.summaryTableRow( 'jumpt', 'If Rd := 1, control[pc] := disp + Ra', 'jumpt R1,test[R2]' )}
                        {this.summaryTableRow( 'jal', 'Rd := control[pc] + 2; control[pc] := disp + Ra', 'jal R1,test[R2]' )}
                        {this.summaryTableRow( 'testset', 'Rd := memory[disp + Ra]; memory[disp + Ra] := 1', 'testset R1,test[R2]' )}
                      </tbody>
                    </Table>
                  </div>
                </InfoArea>
              </InfoArea>
              <InfoArea state={this.state} title={'Using the IDE'} depth={1}>
                <InfoArea state={this.state} title={'Notes about the IDE that are unbelievably important'} depth={2}>
                  <div className='info-body white'>
                    Code <strong>persists</strong> between <strong>webpages</strong>. So the Editor and Documentation can be <strong>navigated between</strong> and the <strong>code in the Editor</strong> will be the <strong>same</strong>. However, code can <strong>only</strong> persist if the <strong>tab being used</strong> is open. This means that using the <strong>brower's history</strong> will result in <strong>code being lost</strong><br/>
                    <strong>Breakpoints</strong> and program <strong>input</strong> works in the <strong>same</strong> way and <strong>will persist</strong> so long as the <strong>tab</strong> is <strong>not closed</strong><br/>
                    
                    <br/>
                    
                    When writing out <strong>registers</strong> in arguments for commands, the <strong>capitalisation</strong> of the <q>R</q> is <strong>not needed</strong>. Therefore <code>add r1,r2,r3</code> and <code>add R1,R2,R3</code> and <strong>any variation</strong> is <strong>100% allowed</strong> and will produce the <strong>same machine code</strong> as their capitalised counterparts<br/>
                    
                    <br/>
                    
                    Unlike {this.theOriginalEmulator()}, <strong>white space</strong> before commands is <strong>not needed</strong>. This means that <code>add R1,R2,R3</code> and <code>{'\xa0\xa0\xa0\xa0'/** 4 * &nbsp */}add R1,R2,R3</code> will be <strong>parsed</strong> the <strong>exact same</strong> and produce the <strong>same machine code</strong>.
                  </div>
                </InfoArea>
                <InfoArea state={this.state} title={'Editing a program'} depth={2}>
                  <div className='info-body white'>
                    A program can be <strong>edited</strong> by updating the text in the <strong>code chunk</strong> provided in the <strong>Editor tab</strong><br/>
                    
                    <img style={{width : '100%', height : '100%'}} src={`${process.env.PUBLIC_URL}/docs/editing1.jpg`} alt='Red box around code chunk in Editor pane'/>
                  </div>
                  <InfoArea state={this.state} title={'Input editing'} depth={3}>
                    <div className='info-body white'>
                      The <strong>input</strong> of a program can be edited by pressing the <FaPen/> icon at the <strong>far left</strong> of the button toolbar and updating the <strong>text box</strong> of the resulting modal. The input will then be set by either clicking the <strong>Set Input</strong> button or by clicking off the modal<br/>
                      
                      <img style={{width : '100%', height : '100%'}} src={`${process.env.PUBLIC_URL}/docs/editing2.jpg`} alt='Red box around text box of set input modal'/>
                    </div>
                  </InfoArea>
                </InfoArea>
                <InfoArea state={this.state} title={'Running a program'} depth={2}>
                  <div className='info-body white'>
                    The current program <strong>can be run</strong> by simply pressing the <FaPlay/> icon in the <strong>far-left</strong> grouping in the button toolbar<br/>
                    
                    <br/>
                    
                    This will cause an <strong>implicit</strong> build - a <strong>compilation of the program</strong> - setting into the memory, and, running through of said memory<br/>
                    A program can however <strong>only</strong> be <strong>run</strong> in this way if it has a <code>trap R0,R0,R0</code>, <strong>halt</strong>, instruction as this helps <strong>prevent</strong> the website from <strong>hanging</strong><br/>
                    The <strong>resultant</strong> registers, control registers, memory, and, the output from a successful execution will then be displayed in <strong>modal</strong><br/>
                    
                    <img style={{width : '100%', height : '100%'}} src={`${process.env.PUBLIC_URL}/docs/running1.jpg`} alt='Modal showing program results'/>
                    
                    To see <strong>more memory</strong> values, the memory can be <strong>scrolled</strong> through when mousing over it and to <strong>display lower</strong> down memory values<br/>

                    <br/>

                    When a program's <strong>used</strong> memory values <strong>exceeds <code>$500</code>, 1280, </strong>, the memory values will be rendered in <strong>different</strong> memory <strong>windows</strong>. This is done as <strong>rendering more</strong> memory values <strong>at one time</strong> significantly <strong>effects performance</strong><br/>

                    <br/>

                    To <strong>view</strong> these other memory windows, the <strong>tab</strong> at the <strong>top</strong> of the <strong>memory</strong> column can be used, either to view the <strong>previous</strong> or <strong>next</strong> windows<br/>

                    <img style={{width : '100%', height : '100%'}} src={`${process.env.PUBLIC_URL}/docs/running4.jpg`} alt='Modal with arrows in memory column outlined in red'/>

                    <strong>Rather</strong> than using the arrows, a selection from the <strong>dropdown</strong>, displayed after <strong>clicking</strong> the <strong>currently shown</strong> memory values, can be made. This dropdown also displays which memory window is currently being viewed<br/>

                    <img style={{width : '100%', height : '100%'}} src={`${process.env.PUBLIC_URL}/docs/running5.jpg`} alt='Modal with dropdown open'/>

                    With the <strong>provided</strong> <q>Hello, World!</q> program, this <strong>memory window navigating cannot</strong> be <strong>used</strong> as there is only <strong>one</strong> memory <strong>window</strong>. However, trying again with a <strong>larger program</strong> such as{'\xa0'/**&nbsp*/}
                    <a 
                      target='_blank' 
                      rel='noopener noreferrer' 
                      href='https://github.com/QuestioWo/Sigma17#memory-performance-test-'>
                      this one
                    </a> 
                    {'\xa0'/**&nbsp*/}which uses all the memory cells<br/>

                    <img style={{width : '100%', height : '100%'}} src={`${process.env.PUBLIC_URL}/docs/running6.jpg`} alt='Modal after running memory performance test and scrolling to $e721'/>

                    Also, the <strong>output</strong> can be <strong>double-clicked</strong> to make it larger to get a better view as well. <strong>Another</strong> double click can be used to return the modal to <strong>how it was</strong><br/>
                    The results modal can also be <strong>closed</strong> by simply <strong>clicking off</strong> of it<br/>
                    
                    <img style={{width : '100%', height : '100%'}} src={`${process.env.PUBLIC_URL}/docs/running2.jpg`} alt='Modal with larger output field'/>
                    
                    With the <strong>default</strong> program on launching the website, a <q>Hello, World!</q> program, the previously shown results will appear, printing <strong>Hello, World!</strong> into the output<br/>
                    
                    <br/>
                    
                    When <strong>hovering over</strong> memory and register values, their <strong>decimal</strong> and <strong>two's complement</strong> values will be shown to help make hex values <strong>more readable</strong><br/>
                    
                    <img style={{width : '100%', height : '100%'}} src={`${process.env.PUBLIC_URL}/docs/running3.jpg`} alt='Modal while mousing over a value to show decimal representation'/><br/>

                    Also <strong>after running</strong> a program <strong>successfully</strong>, the <strong>raw execution time</strong>, <strong>without displaying the results</strong> modal, will be <strong>printed</strong> out in the <strong>console</strong> as <q>Time to run : <i>*execution time*</i></q>
                  </div>
                </InfoArea>
                <InfoArea state={this.state} title={'Debugging a program'} depth={2}>
                  <InfoArea state={this.state} title={'Syntax errors'} depth={3}>
                    <div className='info-body white'>
                      If you attempt to run a program with a command with an <strong>error</strong>, such as a <strong>syntax error</strong>, it will not run as it will <strong>fail to compile</strong><br/>
                      The <strong>IDE</strong> will then <strong>display</strong> that an error has occurred at the <strong>top of the Editor tab</strong> with <strong>information</strong> about the said error<br/>
                      A <strong>syntax error</strong> will produce this error<br/>
                      
                      <img style={{width : '100%', height : '100%'}} src={`${process.env.PUBLIC_URL}/docs/debugging1.jpg`} alt='Red box around build unsuccessful alert'/><br/>
                      
                      <strong>Along</strong> with an alert at the top of the window displaying, the <strong>line</strong> in which error has occurred will have a <strong>red box</strong> replacing nothing in the <strong>column</strong> to the <strong>left</strong> of the <strong>line numbers</strong> in the <strong>code chunk</strong><br/>
                      When <strong>hovering over</strong> this <strong>red box</strong>, details about why the error occurred will appear<br/>
                      
                      <img style={{width : '100%', height : '100%'}} src={`${process.env.PUBLIC_URL}/docs/debugging2.jpg`} alt='Red box around error details tooltip'/><br/>
                      
                      To help <strong>prevent errors</strong> occurring, <strong>checks</strong> will be performed <strong>during editing</strong> of a program so that the run button <strong>doesn't have</strong> to be pressed <strong>each time</strong> to find <strong>errors</strong><br/>
                      
                      <br/>
                      
                      On top of this, the program can be <strong>just compiled</strong> with the <strong>build</strong> button, shown by the <FaHammer/> icon<br/>
                      This will <strong>call</strong> for a <strong>build</strong> to be made which will also result in an <strong>alert</strong> of the <strong>status</strong> of the <strong>build</strong> being shown<br/>
                      If there are <strong>no errors</strong> with building, a <strong>success</strong> alert will be displayed once the program has <strong>finished</strong> been <strong>built</strong><br/>
                      
                      <img style={{width : '100%', height : '100%'}} src={`${process.env.PUBLIC_URL}/docs/debugging3.jpg`} alt='Red box around success alert'/><br/>
                    </div>
                  </InfoArea>
                  <InfoArea state={this.state} title={'Semantic errors - Debugger'} depth={3}>
                    <div className='info-body white'>
                      More <strong>semantic</strong> or <strong>logic</strong> errors, such as programs producing an <strong>unintended</strong> sets of <strong>results</strong>, have to have more <strong>powerful tools</strong> used than just syntax checking used on them in order to <strong>debug</strong> them<br/>
                      
                      <br/>
                      
                      This IDE's <strong>Debugger</strong> can be accessed either by <strong>navigating</strong> to the <q>Debug</q> tab <strong>or</strong> by <strong>pressing</strong> the <FaBug/> icon in the Editor tab<br/>
                      
                      <br/>
                      
                      This view will show you the programs <strong>current</strong> registers, control registers, memory, input, and, output <strong>values</strong><br/>
                      It will also show you <strong>which lines</strong> of code is being <strong>executed</strong> in the <strong>code chunk</strong> next to these values<br/>
                      
                      <img style={{width : '100%', height : '100%'}} src={`${process.env.PUBLIC_URL}/docs/debugging4.jpg`} alt='Red box around success alert'/><br/>
                      
                      <strong>Unlike</strong> the Editor tab, the code chunk can be <strong>hidden completely</strong> using the <FaMinus/> icon<br/>
                      
                      <img style={{width : '100%', height : '100%'}} src={`${process.env.PUBLIC_URL}/docs/debugging5.jpg`} alt='Red box around success alert'/><br/>
                      
                      To make sure that the <strong>expected</strong> machine code is being <strong>compiled</strong>, <strong>hovering over</strong> the <strong>line numbers</strong> will show the <strong>memory addresses</strong> of the lines corresponding machine code and the <strong>values</strong> of said <strong>memory</strong> addresses<br/>
                      
                      <img style={{width : '100%', height : '100%'}} src={`${process.env.PUBLIC_URL}/docs/debugging10.jpg`} alt='Red box around memory info tooltip'/><br/>
                      
                      The program can also be <strong>executed</strong> by either running through at <strong>full speed</strong> - like in the Editor tab - or, by <strong>stepping-through</strong> it<br/>
                      <strong>Full speed</strong> running can be performed by pressing the <FaPlay/><br/>
                      <strong>Stepping-Through</strong> can be performed by pressing the <FaStepForward/><br/>
                      Stepping-Through executes <strong>one line</strong> of code at a time and <strong>updates</strong> the registers, control registers, memory, input, and, output <strong>accordingly</strong><br/>
                      
                      <img style={{width : '100%', height : '100%'}} src={`${process.env.PUBLIC_URL}/docs/debugging6.jpg`} alt='Red box around step-forward button after one press'/><br/>
                      
                      Also stepping-through the program shows the different <strong>line overlays</strong>. The <span style={{color : 'blue'}}><strong>blue</strong></span> overlay indicates the line that <strong>has</strong> just been <strong>executed</strong>. The <span style={{color : 'green'}}><strong>green</strong></span> overlay shows the line that is <strong>currently being</strong>/<strong>will</strong> be <strong>executed</strong><br/>
                      This same <strong>format</strong> of highlighting is used to show the corresponding <strong>cells</strong> in <strong>memory</strong> are <strong>being</strong>/<strong>have</strong> been executed<br/>

                      <br/>

                      <strong>Memory</strong> cells and <strong>registers</strong> coloured <span style={{color : 'darkorange'}}><strong>dark orange</strong></span> denote values that have been <strong>changed</strong><br/>
                      
                      <br/>

                      <strong>Executed lines</strong> and corresponding <strong>memory values</strong> are also by default <strong>followed</strong><br/>
                      This functionality can be <strong>disabled</strong> by pressing the <FaEye/> icon to make it become a <FaEyeSlash/> icon<br/>
                      There are options to <strong>toggle</strong> this <strong>following of execution</strong> for <strong>both memory</strong> and <strong>code</strong> by the <strong>different</strong> buttons above <strong>each column</strong><br/>

                      <img style={{width : '100%', height : '100%'}} src={`${process.env.PUBLIC_URL}/docs/debugging11.jpg`} alt='Red box around follow memory and follow code buttons after code follow toggled'/><br/>
                      
                      A program can be <strong>stepped-through</strong> or <strong>run</strong> through up until it is <strong>halted</strong>. This is <strong>most commonly</strong> done with a <code>trap R0,R0,R0</code> instruction<br/>
                      <strong>After</strong> a program is <strong>halted</strong>, the buttons for running and stepping will become <strong>disabled</strong>. Also, the <span style={{color : 'green'}}><strong>green</strong></span> overlay will <strong>disappear</strong> as there will be <strong>no next</strong> line to <strong>execute</strong><br/>
                      Execution of the program can be <strong>restarted</strong> by pressing the <FaBackward/> icon in the middle of the button toolbar<br/>
                      
                      <img style={{width : '100%', height : '100%'}} src={`${process.env.PUBLIC_URL}/docs/debugging7.jpg`} alt='Red box around disabled run, step-forward, and, restart buttons'/><br/>
                    </div>
                    <InfoArea state={this.state} title={'Breakpoints'} depth={4}>
                      <div className='info-body white'>
                        On top of the <strong>stepping-through</strong> functionality, <strong>breakpoints</strong> have been implemented<br/>
                        
                        <br/>
                        
                        Breakpoints can be <strong>activated</strong> by <strong>clicking</strong> on the <strong>line number</strong> to the <strong>left</strong> of the <strong>code</strong><br/>
                        This will then show a <strong>filled circle</strong> to indicate the breakpoint has been activated. Also, in the Debugger window, the <strong>corresponding</strong> memory cell to the line will become <strong>underlined</strong> to show <strong>where</strong> in <strong>memory</strong> the program's <strong>execution</strong> will <strong>pause</strong><br/>
                        
                        <img style={{width : '100%', height : '100%'}} src={`${process.env.PUBLIC_URL}/docs/debugging8.jpg`} alt='Red box around activated breakpoint and underlined memory value'/><br/>
                        
                        To <strong>disable</strong> breakpoints, they can either be <strong>clicked</strong> again or, to disable <strong>all</strong> breakpoints, the <FaTimes/> icon can be pressed<br/>
                        This can be done to the <strong>disable</strong> breakpoints in either the <strong>Editor</strong> or the <strong>Debugger</strong> tabs<br/>

                        <br/>
                        
                        When breakpoints are <strong>activated</strong>, program execution in the <strong>Debugger</strong> tab will <strong>pause</strong> when a line with a breakpoint is <strong>reached</strong><br/>
                        
                        <img style={{width : '100%', height : '100%'}} src={`${process.env.PUBLIC_URL}/docs/debugging9.jpg`} alt='Red box around activated breakpoint and underlined memory value with program executed to the breakpoint'/><br/>
                        
                        Program execution can be <strong>resumed</strong> by just using the <strong>run</strong> or <strong>step-through</strong> buttons<br/>
                        
                        <br/>
                        
                        It is important to note that breakpoints <strong>only</strong> halt execution in the <strong>Debugger</strong> tab and have <strong>no effect</strong> on <strong>execution</strong> in the regular <strong>Editor</strong> tab<br/>
                      </div>
                    </InfoArea>
                  </InfoArea>
                </InfoArea>
                <InfoArea state={this.state} title={'Exporting a program'} depth={2}>
                  <div className='info-body white'>
                    Programs can be <strong>exported</strong> from the Editor in a number of ways<br/>

                    <br/>

                    The <strong>easiest</strong> method is to press the <FaDownload/> icon<br/>
                    This will start the <strong>download</strong> a file that is the code exactly <strong>as-is</strong> in the <strong>code chunk</strong><br/>

                    <br/>

                    If you want to <strong>change</strong> the <strong>file name</strong> that the file downloads as, <strong>or</strong>, want to download the file in <strong>another format</strong>, pressing the <FaChevronDown/> icon will display a modal with <strong>more options</strong><br/>

                    <img style={{width : '100%', height : '100%'}} src={`${process.env.PUBLIC_URL}/docs/exporting1.jpg`} alt='Red box around export modal'/><br/>

                    From the modal, the <strong>options</strong> for how to download the <strong>current</strong> code chunk is displayed. These options <strong>include</strong> :
                    <ul>
                      <li>the <strong>default</strong> option of <strong>as-is</strong>,</li>
                      <li>the <strong>current code</strong> but in a format which makes it <strong>compatible</strong> with {this.theOriginalEmulator()},</li>
                      <li>the <strong>pure binary</strong> values of the <strong>compiled</strong> current program,</li>
                      <li>the current program but in a <strong>'data $' + machine code</strong> format,</li>
                      <li>the current program but in a <strong>'data $' + machine code</strong> format, that is also <strong>compatible</strong> with {this.theOriginalEmulator()}</li>
                    </ul>
                    
                    Also displayed by the modal is the <strong>file name</strong> field that <strong>chosen file option</strong> will download as, <strong>along with</strong> the displayed appended <strong>extension</strong><br/>
                  </div>
                  <InfoArea state={this.state} title={'Exporting - Raw'} depth={3}>
                    <div className='info-body white'>
                      Exporting using the <strong>Raw</strong> option of the code chunk will produce a file filled with <strong>exactly</strong> the <strong>contents</strong> of the <strong>code chunk</strong> and <strong>nothing else</strong><br/>

                      If the download can be <strong>completed successfully</strong>, an <strong>alert</strong> will be displayed saying so at the <strong>top of the tab</strong><br/>

                      <img style={{width : '100%', height : '100%'}} src={`${process.env.PUBLIC_URL}/docs/exporting2.jpg`} alt='Raw file'/>
                    </div>
                  </InfoArea>
                  <InfoArea state={this.state} title={'Exporting - Raw Compatible'} depth={3}>
                    <div className='info-body white'>
                      Exporting using the <strong>Raw Compatible</strong> option of the code chunk will produce a file filled with the current code chunk with compatible <strong>register arguments</strong>, <strong>indenting before lines with no labels</strong>, and, <strong>indenting before lines with labels</strong><br/>

                      If the current program in the code chunk contains <strong>commands</strong> that would cause an <strong>error</strong> in the <strong>assembler</strong> {this.theOriginalEmulator()}, then an <strong>alert</strong> will display at the top of the page outlining <strong>which lines</strong> have <strong>incompatibilities</strong><br/>

                      <img style={{width : '100%', height : '100%'}} src={`${process.env.PUBLIC_URL}/docs/exporting3.jpg`} alt='Red box around failed download alert'/><br/>

                      Along with the <strong>alert</strong>, a <strong>red triangle</strong> will appear in the column <strong>next</strong> to the <strong>line numbers</strong><br/>
                      <strong>Hovering over</strong> this triangle will display information for why this line is <strong>incompatible</strong><br/>

                      <img style={{width : '100%', height : '100%'}} src={`${process.env.PUBLIC_URL}/docs/exporting4.jpg`} alt='Red box around failed download tooltip'/><br/>

                      If the current program in the code chunk contains <strong>commands</strong> that do not either <strong>compile</strong> or <strong>function</strong> the same between this and {this.theOriginalEmulator()}, then an <strong>alert</strong> will display at the top of the page containing <strong>which lines</strong> may cause these <strong>discrepancies</strong><br/>

                      <br/>

                      The <strong>download</strong>, however, will still <strong>continue</strong> as these are seen as <strong>minor</strong> errors as they <strong>will not</strong> cause {this.theOriginalEmulator()}'s assembler to <strong>error</strong><br/>

                      <img style={{width : '100%', height : '100%'}} src={`${process.env.PUBLIC_URL}/docs/exporting5.jpg`} alt='Red box around warning download alert'/><br/>

                      Along with the <strong>alert</strong>, an <strong>orange triangle</strong> will appear in the column <strong>next</strong> to the <strong>line numbers</strong><br/>
                      <strong>Hovering over</strong> this triangle will display information for why this line may cause <strong>discrepancies</strong><br/>

                      <img style={{width : '100%', height : '100%'}} src={`${process.env.PUBLIC_URL}/docs/exporting6.jpg`} alt='Red box around warning download tooltip'/><br/>

                      However, if <strong>both</strong> commands that will cause <strong>discrepancies</strong> and <strong>errors</strong> are present, then <strong>only</strong> the <strong>error alert</strong> will show, however, <strong>all</strong> the <strong>triangles</strong> of each type will <strong>show</strong><br/>

                      <br/>

                      It is also important to note that the <strong>triangles</strong> will <strong>only</strong> update <strong>after re-attempting</strong> a download of the <strong>same type</strong><br/>

                      <br/>

                      Downloading a <strong>Raw Compatible</strong> file may also disrupt neat indenting, and when downloaded will look like<br/>
                      Also, <strong>all</strong> constants - decimal, hex, and, binary - <strong>get changed</strong> from their orignal form <strong>to</strong> their <strong>decimal value</strong><br/>

                      <img style={{width : '100%', height : '100%'}} src={`${process.env.PUBLIC_URL}/docs/exporting7.jpg`} alt='Raw Compatible file'/>
                    </div>
                  </InfoArea>
                  <InfoArea state={this.state} title={'Exporting - Binary'} depth={3}>
                    <div className='info-body white'>
                      Exporting using the <strong>Binary</strong> option will produce a file filled with purely the binary values of the compiled program<br/>
                      This will produce a <strong>.bin</strong> file and will need a special file viewer to view<br/>

                      <img style={{width : '100%', height : '100%'}} src={`${process.env.PUBLIC_URL}/docs/exporting8.jpg`} alt='Binary file'/><br/>
                      
                      The <strong>advantages</strong> of this file type are that it takes <strong>very little space</strong> and it <strong>doesn't</strong> have to <strong>worry</strong> about <strong>syntax</strong> across <strong>other emulators</strong> that follow the <strong>Sigma16 ISA</strong> - <strong>Industry Standard Architecture</strong> - as {this.theOriginalEmulator()}<br/>
                    </div>
                  </InfoArea>
                  <InfoArea state={this.state} title={'Exporting - Hex'} depth={3}>
                    <div className='info-body white'>
                      Exporting using the <strong>Hex</strong> option will produce a file filled with <strong>'data $' + machine code</strong><br/>
                      
                      <img style={{width : '100%', height : '100%'}} src={`${process.env.PUBLIC_URL}/docs/exporting9.jpg`} alt='Hex file'/><br/>
                      
                      The <strong>advantage</strong> of this file type is that it <strong>doesn't</strong> have to <strong>worry</strong> about <strong>syntax</strong> across <strong>other emulators</strong> that follow the <strong>Sigma16 ISA</strong> - <strong>Industry Standard Architecture</strong> - as {this.theOriginalEmulator()}<br/>
                      This is because <strong>all</strong> Sigma16 emulators <strong>should</strong> have the <strong>same functionality</strong> for the <strong>same machine code</strong> for them<br/>
                    </div>
                  </InfoArea>
                  <InfoArea state={this.state} title={'Exporting - Hex Compatible'} depth={3}>
                    <div className='info-body white'>
                      Exporting using the <strong>Hex Compatible</strong> option will produce a file filled with <strong>' data $' + machine code</strong><br/>
                      
                      <img style={{width : '100%', height : '100%'}} src={`${process.env.PUBLIC_URL}/docs/exporting10.jpg`} alt='Hex Compatible file'/><br/>
                      
                      This file has been made to be <strong>compatible</strong> with {this.theOriginalEmulator()} as {this.theOriginalEmulator()} requires <strong>white space before</strong> commands to <strong>recognise</strong> them properly<br/>

                      <br/>

                      Before this file is downloaded, the <strong>same checks</strong> as the <strong>Raw Compatible</strong> occur, meaning that is there are <strong>commands</strong> that will cause <strong>errors</strong> or <strong>discrepancies</strong> with {this.theOriginalEmulator()} then the appropriate <strong>alerts</strong> and <strong>tooltips</strong> will be displayed<br/>
                    </div>
                  </InfoArea>
                </InfoArea>
                <InfoArea state={this.state} title={'Importing a program'} depth={2}>
                  <div className='info-body white'>
                    For <strong>most</strong> files, <strong>importing</strong> is as easy as <strong>copying</strong> the contents of them and <strong>pasting</strong> the contents into the <strong>code chunk</strong><br/>

                    <br/>

                    However, for importing <strong>binary</strong>, <strong>.bin</strong>, files, they <strong>cannot</strong> be <strong>copied</strong> and <strong>pasted</strong> into the code chunk<br/>
                    To import binary files, press the <FaUpload/> icon and <strong>open</strong>/<strong>select</strong> the <strong>.bin</strong> file to upload from the file <strong>dialogue</strong> that appears<br/>

                    <br/>

                    This will then <strong>import</strong> the <strong>selected</strong> program and <strong>format</strong> it so that it is in the layout of <strong>'data $' + machine code</strong><br/>

                    <img style={{width : '100%', height : '100%'}} src={`${process.env.PUBLIC_URL}/docs/importing1.jpg`} alt='Red box around imported code and upload button'/><br/>

                    This code may <strong>look significantly different</strong>, however, it is the same <q>Hello, World!</q> program that <strong>all</strong> the other examples use<br/>

                    <img style={{width : '100%', height : '100%'}} src={`${process.env.PUBLIC_URL}/docs/importing2.jpg`} alt='Red box around imported code and results modal'/><br/>
                  </div>
                </InfoArea>
              </InfoArea>
            </Col>
          </Row>
        </div>
      </React.Fragment>
    );
  }
}

//
class InfoArea extends React.Component {
  constructor( props, context ) {
    super( props, context );

    this.state = {
      showName : props.title.replace( /\s+/g, '' )
    };
  }

  toggleCollapse = e => {
    var passed = this.props.state.display;
    passed[this.state.showName] = !( this.props.state.display[this.state.showName] );
    this.props.state.setParentState( { display : passed } );
  }

  ifCallback = e => {
    if ( this.state.showName === this.props.state.scrollTo ) this.props.state.infoAreaOpenCallback( e );
  }

  render() {
    return (
      <div id={this.state.showName} className={ 'info-field depth' + this.props.depth }>
        <div className={ 'info-title depth' + this.props.depth }>
          <Row>
            <Col>
              <h4>
                {this.props.title}
              </h4>
            </Col>
            <Col>
              <Button size='sm' variant='outline-secondary' style={{float : 'right'}} onClick={this.toggleCollapse}>
                { this.props.state.display[this.state.showName] ?
                  <FaChevronUp/>
                  :
                  <FaChevronDown/>
                }
              </Button>
            </Col>
          </Row>
        </div>
        <Collapse in={this.props.state.display[this.state.showName]} onEntered={this.ifCallback}>
          <div className='info-body'>
            {this.props.children}
          </div>
        </Collapse>
      </div>
    );
  }
}