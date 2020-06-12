import React from 'react';

import './DocumentationView.css';

import { Button, Col, Collapse, Row, Table } from 'react-bootstrap';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';
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

        subHeadings : [
          'To know before coding', // To know before coding
            'Introduction to language', // Introduction to language
            'Introduction to machine code', // Introduction to machine code
            'Overview of architecture', // Overview of architecture
              'CPU', // CPU
              'Registers', // Registers
                'R0', // R0
                'R15', // R15
              'Memory', // Memory

          'Instruction set', // Instruction set
            'RRR', // RRR
              'add', // add
              'sub', // sub
              'mul', // mul
              'div', // div
              'cmp', // cmp
              'cmplt', // cmplt
              'cmpeq', // cmpeq
              'cmpgt', // cmpgt
              'inv', // inv
              'and', // and
              'or', // or
              'xor', // xor
              'trap', // trap
            'RX', // RX
              'lea', // lea
              'load', // load
              'store', // store
              'jump', // jump
              'jumpc0', // jumpc0
              'jumpc1', // jumpc1
              'jumpf', // jumpf
              'jumpt', // jumpt
              'jal', // jal
              'testset', // testset
              'Conditional jumps', // Conditional jumps
            'EXP', // EXP
              'EXP0', // EXP0
                'rfi', // rfi
              'EXP4', // EXP4

                'execute', // execute
                'getctl', // getctl
                'putctl', // putctl
                'push', // push
                'pop', // pop
                'top', // top
                'addc', // addc
                'shiftl', // shiftl
                'shiftr', // shiftr
                'getbit', // getbit
                'getbiti', // getbiti
                'putbit', // putbit
                'putbiti', // putbiti
                'extract', // extract
                'extracti', // extracti
                'inject', // inject
                'injecti', // injecti
                'field', // field
                'logicw', // logicw
                'logicb', // logicb
                'Logic aliases', // Logic aliases
              'EXP8', // EXP8
                'save', // save
                'restore', // restore

          'Using the IDE', // Using the IDE
            'Editing a program', // Editing a program
            'Running a program', // Running a program
            'Debugging a program', // Debugging a program
            'Exporting a program', // Exporting a program
            'Importing a program', // Importing a program
        ],

        searchSubHeadings : [
          'Toknowbeforecoding', // To know before coding

          'Toknowbeforecoding/Introductiontolanguage', // Introduction to language

          'Toknowbeforecoding/Introductiontomachinecode', // Introduction to machine code

          'Toknowbeforecoding/Overviewofarchitecture', // Overview of architecture
          'Toknowbeforecoding/Overviewofarchitecture/CPU', // CPU
          'Toknowbeforecoding/Overviewofarchitecture/Registers', // Registers
          'Toknowbeforecoding/Overviewofarchitecture/Registers/R0', // R0
          'Toknowbeforecoding/Overviewofarchitecture/Registers/R15', // R15
          'Toknowbeforecoding/Overviewofarchitecture/Memory', // Memory


          'Instructionset', // Instruction set

          'Instructionset/RRR', // RRR
          'Instructionset/RRR/add', // add
          'Instructionset/RRR/sub', // sub
          'Instructionset/RRR/mul', // mul
          'Instructionset/RRR/div', // div
          'Instructionset/RRR/cmp', // cmp
          'Instructionset/RRR/cmplt', // cmplt
          'Instructionset/RRR/cmpeq', // cmpeq
          'Instructionset/RRR/cmpgt', // cmpgt
          'Instructionset/RRR/inv', // inv
          'Instructionset/RRR/and', // and
          'Instructionset/RRR/or', // or
          'Instructionset/RRR/xor', // xor
          'Instructionset/RRR/trap', // trap

          'Instructionset/RX', // RX
          'Instructionset/RX/lea', // lea
          'Instructionset/RX/load', // load
          'Instructionset/RX/store', // store
          'Instructionset/RX/jump', // jump
          'Instructionset/RX/jumpc0', // jumpc0
          'Instructionset/RX/jumpc1', // jumpc1
          'Instructionset/RX/jumpf', // jumpf
          'Instructionset/RX/jumpt', // jumpt
          'Instructionset/RX/jal', // jal
          'Instructionset/RX/testset', // testset
          'Instructionset/RX/Conditionaljumps', // Conditional jumps

          'Instructionset/EXP', // EXP
          'Instructionset/EXP/EXP0', // EXP0
          'Instructionset/EXP/EXP0/rfi', // rfi

          'Instructionset/EXP/EXP4', // EXP4
          'Instructionset/EXP/EXP4/execute', // execute
          'Instructionset/EXP/EXP4/getctl', // getctl
          'Instructionset/EXP/EXP4/putctl', // putctl
          'Instructionset/EXP/EXP4/push', // push
          'Instructionset/EXP/EXP4/pop', // pop
          'Instructionset/EXP/EXP4/top', // top
          'Instructionset/EXP/EXP4/addc', // addc
          'Instructionset/EXP/EXP4/shiftl', // shiftl
          'Instructionset/EXP/EXP4/shiftr', // shiftr
          'Instructionset/EXP/EXP4/getbit', // getbit
          'Instructionset/EXP/EXP4/getbiti', // getbiti
          'Instructionset/EXP/EXP4/putbit', // putbit
          'Instructionset/EXP/puP4i/getbit', // putbiti
          'Instructionset/EXP/EXP4/extract', // extract
          'Instructionset/EXP/EXP4/extracti', // extracti
          'Instructionset/EXP/EXP4/inject', // inject
          'Instructionset/EXP/EXP4/injecti', // injecti
          'Instructionset/EXP/EXP4/field', // field
          'Instructionset/EXP/EXP4/logicw', // logicw
          'Instructionset/EXP/EXP4/logicb', // logicb
          'Instructionset/EXP/EXP4/Logicaliases', // Logic aliases

          'Instructionset/EXP/EXP8', // EXP8
          'Instructionset/EXP/EXP8/save', // save
          'Instructionset/EXP/EXP8/restore', // restore

          'UsingtheIDE', // Using the IDE

          'UsingtheIDE/Editingaprogram', // Editing a program

          'UsingtheIDE/Runningaprogram', // Running a program

          'UsingtheIDE/Debuggingaprogram', // Debugging a program

          'UsingtheIDE/Exportingaprogram', // Exporting a program

          'UsingtheIDE/Importingaprogram', // Importing a program
        ],

        //"andold", "orold", "xorold", "invold", 
        //"data", 
        //"rfi", "execute", "save", "restore", "getctl", "putctl", "push", "pop", "top", "addc", "shiftl", "shiftr", "getbit", "getbiti", "putbit", "putbiti", "field", "extract", "extracti", "inject", "injecti", "logicb", "logicw", "andb", "orb", "xorb", "invb", "andnew", "ornew", "xornew", "invnew"

        labels : {
          'test' : 0x0010
        }
      };

      for ( var i = 0; i < this.state.subHeadings.length; i++ ) {
        this.state.display[this.state.subHeadings[i].replace( /\s+/g, '' )] = true;
      }

      this.state.setParentState = this.setParentState.bind( this );
    }

    componentDidMount() {
      if ( this.props.location.state ) {
        this.setState( { 
          code : this.props.location.state.code,
          breakpoints : this.props.location.state.breakpoints,
          input : this.props.location.state.input
        } );
      } else if ( this.props.code !== undefined ) {
        this.setState( { 
          code : this.props.code,
          breakpoints : this.props.breakpoints,
          input : this.props.input
        } );
      }
    }

  // RENDER ABSTRACTION
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
          writtenCommands += ', ';
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

  // COLLAPSE METHODS
    setParentState = e => {
      this.setState( e );
    }

  // SEARCH METHODS
    searchChoose = e => {
      let displayCopy = this.state.display;

      for ( var i = 0; i < this.state.searchSubHeadings.length; i++ ) {
        var displayNameList = this.state.searchSubHeadings[i].split( '/' );

        if ( displayNameList[displayNameList.length - 1] === e['value'] ) {

          for ( var it = 0; it < displayNameList.length; it++ ) {
            displayCopy[displayNameList[it]] = true;
          }

        } else {
          displayCopy[displayNameList[displayNameList.length - 1]] = false;
        }
      }

      this.setState( displayCopy );
    }

    setDisplaysAs( as ) {
      let displayCopy = this.state.display;

      for ( var i = 0; i < this.state.subHeadings.length; i++ ) {
        displayCopy[this.state.subHeadings[i].replace( /\s+/g, '' )] = as;
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
      var subHeadings = [];
      for ( var i = 0; i < this.state.subHeadings.length; i++ ) {
        var indent = '';
        while ( this.state.searchSubHeadings[i].split( '/' ).length - 1 > ( indent.length / 2 ) ) { indent += '->' };
        indent += '  ';
        subHeadings.push( {value : this.state.subHeadings[i].replace( /\s+/g, '' ), label : indent + this.state.subHeadings[i]} );
      }

      return(
        <React.Fragment>
          <NavBar state={this.state}/>
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
                <InfoArea state={this.state} title={'To know before coding'} depth={1}>
                  <InfoArea state={this.state} title={'Introduction to language'} depth={2}>
                    <div className='info-body white'>
                      Sigma16 is a computer architecture designed for research and teaching in computer systems. This application provides a complete environment for experimenting with the architecture<br/>
                      <br/>
                      Like other languages, Sigma16 takes the assembly code provided and compiles it to machine code which is then set to memory and iterated over to execute a program<br/>
                    </div>
                  </InfoArea>
                  <InfoArea state={this.state} title={'Introduction to machine code'} depth={2}>
                    <div className='info-body white'>
                      Sigma16's machine code is comprised of 16-bit <strong>"words"</strong> ( bytes ) which are compiled from the assembly program provided<br/>
                      <br/>
                      This machine code is then set into the memory, starting at the 0th position. The memory then runs through, taking one or more words and executing functions based off of those words' associated meanings<br/>
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
                        These registers are what most instructions are affecting and relying on to produce an output of the program<br/>
                        <br/>
                        Sometimes only specific bits of these registers will be required though.<br/>
                        In Sigma16, bits are counted from the most important, <strong>left-most</strong>, to the least important, <strong>right-most</strong>, sides.<br/>
                        i.e <strong>R15.0</strong> will be the <strong>left-most</strong> bit and <strong>R15.15</strong> the <strong>right-most</strong><br/>
                        <br/>
                        Most registers just hold a value, however, there are <strong>special registers</strong> built in that have very specific purposes :<br/>
                      </div>
                      <InfoArea state={this.state} title={'R0'} depth={4}>
                        <div className='info-body white'>
                          <strong>Always holds the value 0</strong><br/>
                          <br/>
                          Can have functions set values into it, however, this register will always equal 0
                        </div>
                      </InfoArea>
                      <InfoArea state={this.state} title={'R15'} depth={4}>
                        <div className='info-body white'>
                          <strong>Will have different values based on certain instructions</strong><br/>
                          <br/>
                          R15's value relies on different <strong>flags</strong> being set in it. These flags represent bits in the registers 16-bit word. This means that when a flag equals 1, the corresponding bit in R15 will be set to 1<br/>
                          <br/>
                          The flags, their corresponding bits and the meanings behind the flags are :<br/>
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
                        Each memory location is also a 16-bit word.<br/>
                      </div>
                    </InfoArea>
                  </InfoArea>
                </InfoArea>
                <InfoArea state={this.state} title={'Instruction set'} depth={1}>
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
                          <li>Rd := Ra * Rb</li>
                          <li>R15 := Ra % Rb, unless Rd is R15</li>
                        </ul>
                        Machine code :<br/>
                        {this.machineCode( 'div', 'R1,R2,R3', 3 )}
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
                          This command is also <strong>not implemented</strong> in {this.theOriginalEmulator()} so edge cases such as infinite recursion have been handled as seen appropriate. The command does assemble however, not as per the documentation, and it has no functionality<br/>
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
                          <li>d - the number of <strong>a register</strong> which has <strong>several uses</strong> depending on which function is being perfomed, however, is <strong>mostly</strong> treated as a <strong>destination</strong> register</li>
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
                </InfoArea>
                <InfoArea state={this.state} title={'Using the IDE'} depth={1}>
                  <InfoArea state={this.state} title={'Editing a program'} depth={2}>
                    <div className='info-body white'>
                      Editing a program
                    </div>
                  </InfoArea>
                  <InfoArea state={this.state} title={'Running a program'} depth={2}>
                    <div className='info-body white'>
                      Running a program
                    </div>
                  </InfoArea>
                  <InfoArea state={this.state} title={'Debugging a program'} depth={2}>
                    <div className='info-body white'>
                      Debugging a program
                    </div>
                  </InfoArea>
                  <InfoArea state={this.state} title={'Exporting a program'} depth={2}>
                    <div className='info-body white'>
                      Exporting a program
                    </div>
                  </InfoArea>
                  <InfoArea state={this.state} title={'Importing a program'} depth={2}>
                    <div className='info-body white'>
                      Importing a program
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

  render() {
    return (
      <div className={ 'info-field depth' + this.props.depth }>
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
        <Collapse in={this.props.state.display[this.state.showName]}>
          <div className='info-body'>
            {this.props.children}
          </div>
        </Collapse>
      </div>
    );
  }
}