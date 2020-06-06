import React from 'react';

import './DocumentationView.css';

import { Button, Col, Collapse, Row, Table } from 'react-bootstrap';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';
import Select from 'react-select';

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
            'RX', // RX
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
          'Instructionset/RX', // RX
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
        ]
      };

      for ( var i = 0; i < this.state.subHeadings.length; i++ ) {
        this.state.display[this.state.subHeadings[i].replace( /\s+/g, '' )] = false;
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
                      Sigma16's machine code is comprised of 16 bit <strong>"words"</strong> ( bytes ) which are compiled from the assembly program provided<br/>
                      <br/>
                      This machine code is then set into the memory, starting at the 0th position. The memory is then ran through, taking one or more words and executing functions based off of those words' associated meanings<br/>
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
                          <li>show the first machine code instruction being exectuted is - the <strong>Instruction 'ir'</strong> register</li>
                          <li>show the second <strong>sometimes ommitted</strong> machine code instruction being exectuted is - the <strong>Address 'adr'</strong> register</li>
                        </ul>
                      </div>
                    </InfoArea>
                    <InfoArea state={this.state} title={'Registers'} depth={3}>
                      <div className='info-bodywhite'>
                        The registers of Sigma16 are shown by the values labeled <strong>R0 -> R15</strong><br/>
                        <br/>
                        These registers are what most instructions are affecting and relying on to produce an output of the program<br/>
                        <br/>
                        Most registers just hold a value, however, there are <strong>special registers</strong> built in that have very specific purposes :<br/>
                      </div>
                      <InfoArea state={this.state} title={'R0'} depth={4}>
                        <strong>Always holds the value 0</strong><br/>
                        <br/>
                        Can have functions set values into it, however this register will always equal 0
                      </InfoArea>
                      <InfoArea state={this.state} title={'R15'} depth={4}>
                        <strong>Will have different values based on certain instructions</strong><br/>
                        <br/>
                        R15's value relies on different <strong>flags</strong> being set in it. These flags, represent bits in the registers 16 bit word. This means that when a flag equals 1, the corresponding bit in R15 will be set to 1<br/>
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
                              <td>Greater than, unsigned</td>
                            </tr>
                            <tr>
                              <td><strong>g</strong></td>
                              <td>1</td>
                              <td>Greater than, signed</td>
                            </tr>
                            <tr>
                              <td><strong>E</strong></td>
                              <td>2</td>
                              <td>Equal to, signed and unsigned</td>
                            </tr>
                            <tr>
                              <td><strong>l</strong></td>
                              <td>3</td>
                              <td>Less than, signed</td>
                            </tr>
                            <tr>
                              <td><strong>L</strong></td>
                              <td>4</td>
                              <td>Less than, unsigned</td>
                            </tr>
                            <tr>
                              <td><strong>V</strong></td>
                              <td>5</td>
                              <td>Integer overflow, unsigned</td>
                            </tr>
                            <tr>
                              <td><strong>v</strong></td>
                              <td>6</td>
                              <td>Integer overflow, signed</td>
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
                        <strong>A memory address is a 16 bit word</strong>, and there is one memory location corresponding to each address, so there are <strong>2^16 - 64k - memory locations</strong><br/>
                        <br/>
                        Each memory location is a 16-bit word.<br/>
                      </div>
                    </InfoArea>
                  </InfoArea>
                </InfoArea>
                <InfoArea state={this.state} title={'Instruction set'} depth={1}>
                  <InfoArea state={this.state} title={'RRR'} depth={2}>
                    <div className='info-bodywhite' style={{marginBottom : '7px'}}>
                      STuff
                    </div>
                    <InfoArea state={this.state} title={'add'} depth={4}>
                      Use :<br/>
                      <code className='code-snippet'>add Rd,Ra,Rb</code><br/>
                      Effects :<br/>
                      <ul>
                        <li>Rd := Ra + Rb</li>
                      </ul>
                    </InfoArea>
                    <InfoArea state={this.state} title={'sub'} depth={4}>
                      Use :<br/>
                      <code className='code-snippet'>sub Rd,Ra,Rb</code><br/>
                      Effects :<br/>
                      <ul>
                        <li>Rd := Ra - Rb</li>
                      </ul>
                    </InfoArea>
                  </InfoArea>
                  <InfoArea state={this.state} title={'RX'} depth={2}>
                    blah
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