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
              'Conditionaljumps', // Conditional jumps
            'EXP', // EXP
              'EXP0', // EXP0
                'rfi', // rfi
              'EXP4', // EXP4
              'EXP8', // EXP8

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
          'Instructionset/EXP/EXP8', // EXP8


          'UsingtheIDE', // Using the IDE

          'UsingtheIDE/Editingaprogram', // Editing a program

          'UsingtheIDE/Runningaprogram', // Running a program

          'UsingtheIDE/Debuggingaprogram', // Debugging a program

          'UsingtheIDE/Exportingaprogram', // Exporting a program

          'UsingtheIDE/Importingaprogram', // Importing a program
        ],

        //"andold", "orold", "xorold", "invold", 
        //"jumple", "jumpne", "jumpge", "jumpnv", "jumpnvu", "jumpnco", "jumpnso", "jumplt", "jumpeq", "jumpgt", "jumpv", "jumpvu", "jumpco", "jumpso", 
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

    machineCode( command, argument, opcode ) {
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
          <code>{command + ' ' + argument}</code> := <code>{writtenCommands}</code>, since the <strong>op</strong> code of <code>{command}</code> is <strong>{opcode.toString( 16 )}</strong>
        </React.Fragment>
      );
    }

    wrongGroupings( command, is, why, groupedAs ) {
      return(
        <React.Fragment>
          <code>{command}</code> is technically an <strong>{is}</strong> command since it takes <strong>{why}</strong>, however, its <strong>machine code representation</strong> it that of an <strong>{groupedAs}</strong> command, therefore, it is grouped as such
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
                <Select
                  isSearchable={true}
                  options={subHeadings}
                  theme={{borderRadius : 7}}
                  onChange={this.searchChoose}
                />
                <InfoArea state={this.state} title={'To know before coding'} depth={1}>
                  <InfoArea state={this.state} title={'Introduction to language'} depth={2}>
                    <div className='info-bodywhite'>
                      Sigma16 is a computer architecture designed for research and teaching in computer systems. This application provides a complete environment for experimenting with the architecture<br/>
                      <br/>
                      Like other languages, Sigma16 takes the assembly code provided and compiles it to machine code which is then set to memory and iterated over to execute a program<br/>
                    </div>
                  </InfoArea>
                  <InfoArea state={this.state} title={'Introduction to machine code'} depth={2}>
                    <div className='info-bodywhite'>
                      Sigma16's machine code is comprised of 16-bit <strong>"words"</strong> ( bytes ) which are compiled from the assembly program provided<br/>
                      <br/>
                      This machine code is then set into the memory, starting at the 0th position. The memory then runs through, taking one or more words and executing functions based off of those words' associated meanings<br/>
                    </div>
                  </InfoArea>
                  <InfoArea state={this.state} title={'Overview of architecture'} depth={2}>
                    <InfoArea state={this.state} title={'CPU'} depth={3}>
                      <div className='info-bodywhite'>
                        The CPU of Sigma16 is defined by the <strong>Control registers</strong><br/>
                        <br/>
                        These control registers help the program to...<br/>
                        <ul>
                          <li>keep track of what address in memory is to be executed - the <strong>Program Counter 'pc'</strong> register</li>
                          <li>show the first machine code instruction being executed is - the <strong>Instruction 'ir'</strong> register</li>
                          <li>show the second <strong>sometimes omitted</strong> machine code instruction being executed is - the <strong>Address 'adr'</strong> register</li>
                        </ul>
                      </div>
                    </InfoArea>
                    <InfoArea state={this.state} title={'Registers'} depth={3}>
                      <div className='info-bodywhite'>
                        The registers of Sigma16 are shown by the values labelled <strong>R0 -> R15</strong><br/>
                        <br/>
                        These registers are what most instructions are affecting and relying on to produce an output of the program<br/>
                        <br/>
                        Most registers just hold a value, however, there are <strong>special registers</strong> built in that have very specific purposes :<br/>
                      </div>
                      <InfoArea state={this.state} title={'R0'} depth={4}>
                        <strong>Always holds the value 0</strong><br/>
                        <br/>
                        Can have functions set values into it, however, this register will always equal 0
                      </InfoArea>
                      <InfoArea state={this.state} title={'R15'} depth={4}>
                        <strong>Will have different values based on certain instructions</strong><br/>
                        <br/>
                        R15's value relies on different <strong>flags</strong> being set in it. These flags represent bits in the registers 16-bit word. This means that when a flag equals 1, the corresponding bit in R15 will be set to 1<br/>
                        <br/>
                        Bits in Sigma16 are counted from the most important, left-most, to the least important, right-most, sides.<br/>
                        i.e <strong>R15.0</strong> will be the <strong>left-most</strong> bit and <strong>R15.15</strong> the <strong>right-most</strong><br/>
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
                      </InfoArea>
                    </InfoArea>
                    <InfoArea state={this.state} title={'Memory'} depth={3}>
                      <div className='info-bodywhite'>
                        The memory is an array of words that are accessed by address<br/>
                        <br/>
                        <strong>A memory address is a 16-bit word</strong>, and there is one memory location corresponding to each address, so there are <strong>2^16 - 64k - memory locations</strong><br/>
                        <br/>
                        Each memory location is a 16-bit word.<br/>
                      </div>
                    </InfoArea>
                  </InfoArea>
                </InfoArea>
                <InfoArea state={this.state} title={'Instruction set'} depth={1}>
                  <InfoArea state={this.state} title={'RRR'} depth={2}>
                    <div className='info-bodywhite' style={{marginBottom : '7px'}}>
                      Compiled RRR instructions take up one word in memory, or one memory cell/location.<br/>
                      <br/>
                      Their compiled states can be broken down into :<br/>
                      <ul>
                        <li>op - the <strong>operation code</strong>, signifies which operation to execute on the passed-in arguments</li>
                        <li>d - the number of the destination register, <strong>Rd</strong></li>
                        <li>a - the number of first argument register, <strong>Ra</strong></li>
                        <li>b - the number of second argument register, <strong>Rb</strong></li>
                      </ul>
                      These components make up a machine code word by setting the <strong>first</strong> letter, <strong>0-9 and a-f</strong>, of the 4 letter hex word as the <strong>op</strong> code<br/>
                      Then the <strong>d</strong> code as the <strong>second</strong> letter<br/>
                      The <strong>a</strong> code as the <strong>third</strong> letter<br/>
                      Finally, the <strong>b</strong> code is set as the <strong>fourth</strong> letter<br/>
                    </div>
                    <InfoArea state={this.state} title={'add'} depth={3}>
                      <div className='info-bodywhite'>
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
                      <div className='info-bodywhite'>
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
                      <div className='info-bodywhite'>
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
                      <div className='info-bodywhite'>
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
                      <div className='info-bodywhite'>
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
                        {this.wrongGroupings( 'cmp', 'RR', 'two register arguments', 'RRR' )}
                      </div>
                    </InfoArea>
                    <InfoArea state={this.state} title={'cmplt'} depth={3}>
                      <div className='info-bodywhite'>
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
                      <div className='info-bodywhite'>
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
                      <div className='info-bodywhite'>
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
                      <div className='info-bodywhite'>
                        Use :<br/>
                        <code>inv Rd,Ra</code><br/>
                        Effects :<br/>
                        <ul>
                          <li>Inverts all the bits of Ra; <strong>the bitwise inverse</strong>, denoted by <strong>~</strong></li>
                          <li>Rd := ~ Ra</li>
                        </ul>
                        Machine code :<br/>
                        {this.machineCode( 'inv', 'R1,R2', 8 )}
                      </div>
                    </InfoArea>
                    <InfoArea state={this.state} title={'and'} depth={3}>
                      <div className='info-bodywhite'>
                        Use :<br/>
                        <code>and Rd,Ra,Rb</code><br/>
                        Effects :<br/>
                        <ul>
                          <li>Finds all the <strong>bits</strong> that are equal to 1 in <strong>both</strong> Ra <strong>and</strong> Rb; <strong>the bitwise and</strong>, denoted by <strong>&</strong></li>
                          <li>Rd := Ra & Rb</li>
                        </ul>
                        Machine code :<br/>
                        {this.machineCode( 'and', 'R1,R2,R3', 9 )}
                      </div>
                    </InfoArea>
                    <InfoArea state={this.state} title={'or'} depth={3}>
                      <div className='info-bodywhite'>
                        Use :<br/>
                        <code>or Rd,Ra,Rb</code><br/>
                        Effects :<br/>
                        <ul>
                          <li>Finds all the <strong>bits</strong> that are equal to 1 in <strong>either</strong> Ra <strong>or</strong> Rb; <strong>the bitwise or</strong>, denoted by <strong>|</strong></li>
                          <li>Rd := Ra | Rb</li>
                        </ul>
                        Machine code :<br/>
                        {this.machineCode( 'or', 'R1,R2,R3', 0xa )}
                      </div>
                    </InfoArea>
                    <InfoArea state={this.state} title={'xor'} depth={3}>
                      <div className='info-bodywhite'>
                        Use :<br/>
                        <code>xor Rd,Ra,Rb</code><br/>
                        Effects :<br/>
                        <ul>
                          <li>Finds all the <strong>bits</strong> that are equal to 1 in <strong>either</strong> Ra <strong>or</strong> Rb, but <strong>not both</strong>; <strong>the bitwise xor</strong>, denoted by <strong>^</strong></li>
                          <li>Rd := Ra ^ Rb</li>
                        </ul>
                        Machine code :<br/>
                        {this.machineCode( 'xor', 'R1,R2,R3', 0xb )}
                      </div>
                    </InfoArea>
                    <InfoArea state={this.state} title={'trap'} depth={3}>
                      <div className='info-bodywhite'>
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
                    <div className='info-bodywhite'>
                      RX stuff
                    </div>
                  </InfoArea>
                  <InfoArea state={this.state} title={'EXP'} depth={2}>
                    <InfoArea state={this.state} title={'EXP0'} depth={3}>
                      <InfoArea state={this.state} title={'rfi'} depth={4}>
                        Currently a nop ( no operation ) as the required system registers from the original emulator have been chosen to not be implemented.
                      </InfoArea>
                    </InfoArea>
                    <InfoArea state={this.state} title={'EXP4'} depth={3}>
                      EXP4
                    </InfoArea>
                    <InfoArea state={this.state} title={'EXP8'} depth={3}>
                      EXP8
                    </InfoArea>
                  </InfoArea>
                </InfoArea>
                <InfoArea state={this.state} title={'Using the IDE'} depth={1}>
                  <InfoArea state={this.state} title={'Editing a program'} depth={2}>
                    <div className='info-bodywhite'>
                      Editing a program
                    </div>
                  </InfoArea>
                  <InfoArea state={this.state} title={'Running a program'} depth={2}>
                    <div className='info-bodywhite'>
                      Running a program
                    </div>
                  </InfoArea>
                  <InfoArea state={this.state} title={'Debugging a program'} depth={2}>
                    <div className='info-bodywhite'>
                      Debugging a program
                    </div>
                  </InfoArea>
                  <InfoArea state={this.state} title={'Exporting a program'} depth={2}>
                    <div className='info-bodywhite'>
                      Exporting a program
                    </div>
                  </InfoArea>
                  <InfoArea state={this.state} title={'Importing a program'} depth={2}>
                    <div className='info-bodywhite'>
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
      <div className={ 'info-field' + this.props.depth }>
        <div className={ 'info-title' + this.props.depth }>
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
          <div className={ 'info-body' + this.props.depth }>
            {this.props.children}
          </div>
        </Collapse>
      </div>
    );
  }
}