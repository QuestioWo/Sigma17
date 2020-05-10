// CONSTS FOR COMMAND RECOGNITION
  const allCommands = ["add", "sub", "mul", "div", "cmp", "cmplt", "cmpeq", "cmpgt", "inv", "and", "or", "xor", "trap", 
                      "lea", "load", "store", "jump", "jumpc0", "jumpc1", "jumpf", "jumpt", "jal", "testset",
                      "data"];

  const firstColumn = Math.pow( 16, 3 );
  const secondColumn = Math.pow( 16, 2 );
  const thirdColumn = Math.pow( 16, 1 );
  const fourthColumn = Math.pow( 16, 0 );

  // "jumplt", "jumple", "jumpne", "jumpeq", "jumpge", "jumpgt",

  // RRR
    const rrCommands = {
      cmp : 4,
      inv : 8
    };
    const rrrCommands = { 
      add : 0, 
      sub : 1,
      mul : 2,
      div : 3,
      cmplt : 5,
      cmpeq : 6,
      cmpgt : 7,
      and : 9,
      or : 0xa,
      xor : 0xb,
      nop : 0xc,
      trap : 0xd
    };

  // RX
    const jxCommands = {
      jump : 3
    };
    const kxCommands = {
      jumpc0 : 4,
      jumpc1 : 5,
    };
    const rxCommands = {
      lea : 0,
      load : 1,
      store : 2,
      jumpf : 6,
      jumpt : 7,
      jal : 8,
      testset : 9
    };

  // X
    const xCommands = {data : 0}; // data doesnt have an op code since it kind of isnt a command but for convention sake, its in a dictionary

// UTIL FUNCTIONS
  export function readSignedHex( a ) {
    a = Number( a );
    if ( ( a & 0x8000 ) > 0) {
      a = a - 0x10000;
    }
    return a;
  }

  export function readUnsignedHex( a ) {
    if ( a < 0 ) {
      a = a + 0x10000;
    }
    return a;
  }

  function isValidNumber( numString ) {
    var num = 0;

    if ( !isNaN( numString ) ) {
      num = parseInt( numString );
    } else if ( numString.startsWith( '$' ) ) {
      numString = numString.slice( 1, numString.length );
      num = readSignedHex( parseInt( numString, 16 ) );
    } else {
      num = 65536;
    }

    return ( num < 32768 && num >= -32768 ) ? true : false;
  }

  function isValidNumberBit( numString ) {
    var num = 0;

    if ( !isNaN( numString ) ) {
      num = parseInt( numString );
    } else if ( numString.startsWith( '$' ) ) {
      numString = numString.slice( 1, numString.length );
      num = readSignedHex( parseInt( numString, 16 ) );
    } else {
      num = 16;
    }

    return ( num <= 15 && num > 0 ) ? true : false;
  }

  export function writeHex( x ) {
    if ( !x.length ) {
      x = x.toString( 16 );
    }
    while ( x.length < 4 ) { x = '0' + x; }
    return x;
  }

// CHECKING METHODS
  function checkRRCommand( rr ) {
    // check that rrr is in the form of rd,ra,rb
    if ( !( /r((1[0-5])|([0-9])),r((1[0-5])|([0-9]))/.test( rr ) ) ) {
      return 'arguments must be in the form of "Ra,Rb"';
    }
    return true;
  }

  function checkRRRCommand( rrr ) {
    // check that rrr is in the form of rd,ra,rb
    if ( !( /r((1[0-5])|([0-9])),r((1[0-5])|([0-9])),r((1[0-5])|([0-9]))/.test( rrr ) ) ) {
      return 'arguments must be in the form of "Rd,Ra,Rb"';
    }
    return true;
  }

  function checkJXCommand( jx, labels ) {
    // check that rx is in the form of rd,disp[ra], where disp can be either hex, decimal, or a variable 
    if ( !( /((\$(\d)|([a-f])|([A-F]))|(\d)|(\w))+\[r((1[0-5])|([0-9]))\]/.test( jx ) ) ) {
      return 'arguments must be in the form of "disp[Ra]"';
    }
    var disp = jx.split( '[' )[0];

    if ( isValidNumber( disp ) ) {
      return true;
    } else if ( Object.keys( labels ).includes( disp ) ) {
      return true;
    } else {
      return 'disp argument must either be a decimal, a hex or an initailised label';
    }
  }

  function checkKXCommand( kx, labels ) {
    // check that rx is in the form of rd,disp[ra], where disp can be either hex, decimal, or a variable 
    if ( !( /((\$(\d)|([a-f])|([A-F]))|(\d)),((\$(\d)|([a-f])|([A-F]))|(\d)|(\w))+\[r((1[0-5])|([0-9]))\]/.test( kx ) ) ) {
      return 'arguments must be in the form of "k,disp[Ra]"';
    }
    var splat = kx.split;
    var k = splat[0];
    var disp = splat[1].split( '[' )[0];

    if ( ! isValidNumberBit( k ) ) {
      return 'k argument must either be a decimal, a hex bit';
    }

    if ( isValidNumber( disp ) ) {
      return true;
    } else if ( Object.keys( labels ).includes( disp ) ) {
      return true;
    } else {
      return 'disp argument must either be a decimal, a hex or an initailised label';
    }
  }

  function checkRXCommand( rx, labels ) {
    // check that rx is in the form of rd,disp[ra], where disp can be either hex, decimal, or a variable 
    if ( !( /r((1[0-5])|([0-9])),((\$(\d)|([a-f])|([A-F]))|(\d)|(\w))+\[r((1[0-5])|([0-9]))\]/.test( rx ) ) ) {
      return 'arguments must be in the form of "Rd,disp[Ra]"';
    }
    var disp = rx.split( ',' )[1].split( '[' )[0];

    if ( isValidNumber( disp ) ) {
      return true;
    } else if ( Object.keys( labels ).includes( disp ) ) {
      return true;
    } else {
      return 'disp argument must either be a decimal, a hex or an initailised label';
    }
  }

  function checkXCommand( x ) {
    // check that x is a number, either hex or decimal
    if ( !( isValidNumber( x ) ) ) {
      return 'data must be followed by either a decimal or hex number <= 65535';
    }
    return true;
  }

  function checkCommands( command, argument, labels ) {
    var check = '';
    if ( Object.keys( rrCommands ).includes( command ) ) {
      // first word is an rr command
      if ( argument ) { 
        // there is a second argument
        check = checkRRCommand( argument );
        if ( check.length ) {
          // if rr command doesnt follow requirements 
          return check;
        }
        // does follow requirements, and therefore function returns true
      } else {
        return command + ' must be followed by 2 registers in form Rx,Rx';
      }
    } else if ( Object.keys( rrrCommands ).includes( command ) ) {
      // first word is an rrr command
      if ( argument ) { 
        // there is a second argument
        check = checkRRRCommand( argument );
        if ( check.length ) {
          // if rrr command doesnt follow requirements 
          return check;
        }
        // does follow requirements, and therefore function returns true
      } else {
        return command + ' must be followed by 3 registers in form Rx,Rx,Rx';
      }
    } else if( Object.keys( jxCommands ).includes( command ) ) {
      // first word is an jx command
      if ( argument ) { 
        // there is a second argument
        check = checkJXCommand( argument, labels );
        if ( check.length ) {
          // if jx command doesnt follow requirements 
          return check;
        }
        // does follow requirements, and therefore function returns true
      } else {
        return command + ' must be followed by arguments in the format of disp[Ra]';
      }
    } else if ( Object.keys( kxCommands ).includes( command ) ) {
      // first word is an jx command
      if ( argument ) { 
        // there is a second argument
        check = checkKXCommand( argument, labels );
        if ( check.length ) {
          // if jx command doesnt follow requirements 
          return check;
        }
        // does follow requirements, and therefore function returns true
      } else {
        return command + ' must be followed by arguments in the format of k,disp[Ra], where k is a bit';
      }
    } else if ( Object.keys( rxCommands ).includes( command ) ) {
      // first word is an rx command
      if ( argument ) { 
        // there is a second argument
        check = checkRXCommand( argument, labels );
        if ( check.length ) {
          // if rx command doesnt follow requirements 
          return check;
        }
        // does follow requirements, and therefore function returns true
      } else {
        return command + ' must be followed by arguments in the format of Rd,disp[Ra]';
      }
    } else if ( Object.keys( xCommands ).includes( command ) ) {
      // first word is an x command i.e data
      if ( argument ) { 
        // there is a second argument
        check = checkXCommand( argument );
        if ( check.length ) {
          // if data command doesnt follow requirements 
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

  export function checkLine( line, labels ) {
    var linesplit = line.trim().split( ';' )[0].split( /\s+/ );
    var error = true;

    if ( linesplit[0] ) {
      // lines isnt empty
      if ( allCommands.includes( linesplit[0] ) ) {
        // first word is a command
        error = checkCommands( linesplit[0], linesplit[1], labels ); // will return error is arguments not present so dont have to check
      } else {
        // first word is not a command
        if ( /\w/.test( linesplit[0] ) ) {
          // first word is a label
          if ( linesplit[1] ) {
            // theres more after label
            if ( allCommands.includes( linesplit[1] ) ) {
              error = checkCommands( linesplit[1], linesplit[2], labels );
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

// PARSING METHODS
  function findInstuctionInfo( command ) {
    var result = {
      words : 0,
      type : '',
      op : 0
    };

    if ( Object.keys( rrCommands ).includes( command ) ) {
      result['words'] = 1;
      result['type'] = 'rr';
      result['op'] = rrCommands[command];
    } else if ( Object.keys( rrrCommands ).includes( command ) ) {
      result['words'] = 1;
      result['type'] = 'rrr';
      result['op'] = rrrCommands[command];
    } else if ( Object.keys( jxCommands ).includes( command ) ) {
      result['words'] = 2;
      result['type'] = 'jx';
      result['op'] = jxCommands[command];
    } else if ( Object.keys( rxCommands ).includes( command ) ) {
      result['words'] = 2;
      result['type'] = 'rx';
      result['op'] = rxCommands[command];
    } else if ( Object.keys( xCommands ).includes( command ) ) {
      result['words'] = 1;
      result['type'] = 'x';
      result['op'] = xCommands[command];
    }

    return result;
  }

  function findArgumentInfo( argument, type ) {
    var info = {
      'd' : 0,
      'a' : 0,
      'b' : 0,
      'disp' : 0
    };

    if ( type === 'rr' ) {
      var argumentListRR = argument.split( ',' );
      info['a'] = Number( argumentListRR[0].slice( 1, argumentListRR[0].length ) );
      info['b'] = Number( argumentListRR[1].slice( 1, argumentListRR[1].length ) );
      
      info['d'] = info['a'];
    } else if ( type === 'rrr' ) {
      var argumentListRRR = argument.split( ',' );
      info['d'] = Number( argumentListRRR[0].slice( 1, argumentListRRR[0].length ) );
      info['a'] = Number( argumentListRRR[1].slice( 1, argumentListRRR[1].length ) );
      info['b'] = Number( argumentListRRR[2].slice( 1, argumentListRRR[2].length ) );
    } else if ( type === 'jx' ) {
      var argumentListJX = argument.split( '[' );
      info['a'] = Number( argumentListJX[1].slice( 1, argumentListJX[1].length - 1 ) ); // removes ']' from string
      if ( argumentListJX[0].startsWith( '$' ) ) {
        info['disp'] = argumentListJX[0].slice( 1, argumentListJX[0].length );
      } else {
        info['disp'] = argumentListJX[0];
      }

      info['d'] = 0;
    } else if ( type === 'hx' ) {
      var argumentListHX = argument.split( ',' );
      info['d'] = Number( argumentListHX[0].slice( 1, argumentListHX[0].length ) );

      argumentListHX = argumentListHX[1].split( '[' );
      info['a'] = Number( argumentListHX[1].slice( 1, argumentListHX[1].length - 1 ) ); // removes ']' from string
      if ( argumentListHX[0].startsWith( '$' ) ) {
        info['disp'] = argumentListHX[0].slice( 1, argumentListHX[0].length );
      } else {
        info['disp'] = argumentListHX[0];
      }
    } else if ( type === 'rx' ) {
      var argumentListRX = argument.split( ',' );
      info['d'] = Number( argumentListRX[0].slice( 1, argumentListRX[0].length ) );

      argumentListRX = argumentListRX[1].split( '[' );
      info['a'] = Number( argumentListRX[1].slice( 1, argumentListRX[1].length - 1 ) ); // removes ']' from string
      if ( argumentListRX[0].startsWith( '$' ) ) {
        info['disp'] = argumentListRX[0].slice( 1, argumentListRX[0].length );
      } else {
        info['disp'] = argumentListRX[0];
      }
    } else if ( type === 'x' ) {
      if ( ! isNaN( argument ) ) {
        // number is in decimal
        info['disp'] = readUnsignedHex( Number( argument ) );
      } else {
        // number is in hex
        argument = argument.slice( 1, argument.length );
        info['disp'] = parseInt( argument, 16);
      }
    }

    return info;
  }

  function generateMachineCode( command, argument, labels ) {
    var machineCode = 0;
    var machineCodeSecond = -1;

    var commandInfo = findInstuctionInfo( command );
    var argumentInfo = findArgumentInfo( argument, commandInfo['type'] );

    if ( commandInfo['type'] === 'rr' || commandInfo['type'] === 'rrr' ) {
      machineCode += commandInfo['op']*firstColumn + argumentInfo['d']*secondColumn + argumentInfo['a']*thirdColumn + argumentInfo['b']*fourthColumn;
    } else if ( commandInfo['type'] === 'jx' || commandInfo['type'] === 'rx' ) {
      machineCode += ( 0xf*firstColumn + argumentInfo['d']*secondColumn + argumentInfo['a']*thirdColumn + commandInfo['op']*fourthColumn );

      if ( Object.keys( labels ).includes( argumentInfo['disp'] ) ) {
        machineCodeSecond = labels[argumentInfo['disp']];
      } else {
        machineCodeSecond = argumentInfo['disp'];
      }
    } else if ( commandInfo['type'] === 'x' ) {
      machineCode += argumentInfo['disp'];
    }

    return [ machineCode, machineCodeSecond ];
  }

  export function parseLineForLabels( line ) {
    var linesplit = line.trim().split( ';' )[0].split( /\s+/ );
    
    var result = {
      label : '',
      instructionWords : 0
    };

    if ( linesplit[0] ) {
      // lines isnt empty
      if ( allCommands.includes( linesplit[0] ) ) {
        // first word is a command
        result['instructionWords'] = findInstuctionInfo( linesplit[0] )['words'];
      } else {
        // first word is not a command
        if ( /\w/.test( linesplit[0] ) ) {
          // first word is a label
          if ( linesplit[1] ) {
            // theres more after label
            if ( allCommands.includes( linesplit[1] ) ) {
              result['instructionWords'] = findInstuctionInfo( linesplit[1] )['words'];
            }
          }
          // just a label, therefore allowed and function returns true
          result['label'] = linesplit[0];
          result['instructionWords'] = 1; // returns nop on this line which is an RRR instruction with length 1
        }
      }
    }
    return result;
  }

  export function parseLineForMachineCode( line, labels ) {
    var machineCode = 0;

    var linesplit = line.trim().split( ';' )[0].split( /\s+/ );

    if ( linesplit[0] ) {
      // lines isnt empty
      if ( allCommands.includes( linesplit[0] ) ) {
        // first word is a command
        machineCode = generateMachineCode( linesplit[0], linesplit[1], labels );
      } else {
        // first word is not a command
        if ( /\w/.test( linesplit[0] ) ) {
          // first word is a label
          if ( linesplit[1] ) {
            // theres more after label
            if ( allCommands.includes( linesplit[1] ) ) {
              machineCode = generateMachineCode( linesplit[1], linesplit[2], labels );
            }
          } else {
            machineCode = [ 0xc000 ];
          }
        }
      }
    }

    return machineCode;
  }

// RUNNING FUNCTIONS
  export function setMemory( machineCode ) {
    var memory = {};

    for ( var i = 0; i < machineCode.length; i++ ) {
      memory[i] = machineCode[i];
    }

    return memory;
  }

  function compareRegisters( RaValue, RbValue ) {
    var RaValueSigned = readSignedHex( RaValue );
    var RbValueSigned = readSignedHex( RbValue );

    var result = 0;
    var signedEquals = false;

    // signed comparisons
    if ( RaValueSigned > RbValueSigned ) {
      result += 0b01000000;
    } else if ( RaValueSigned < RbValueSigned ) {
      result += 0b00010000;
    } else {
      signedEquals = true;
    }
    
    // unsigned comparisons
    if ( RaValue > RbValue ) {
      result += 0b10000000;
    } else if ( RaValue < RbValue ) {
      result += 0b00001000;
    } else {
      if ( signedEquals ) {
        result += 0b00100000;
      }
    }

    result = result * secondColumn;

    return result;
  }

  function processRXInstruction( control, registers, memory, Rd, Ra, Op, adr ) {
    // Ra == ir[1]
    // Rd == ir[2]
    var effectiveADR = registers[Ra] + adr;

    switch ( Op ) {
      case 0x0 :
        // lea
        registers[Rd] = effectiveADR;
        break;

      case 0x1 :
        // load
        registers[Rd] = memory[ effectiveADR ];
        break;

      case 0x2 :
        // store
        memory[ effectiveADR ] = registers[Rd];
        break;

      case 0x3 :
        // jump
        control['pc'] = effectiveADR;
        break;

      case 0x4 :
        /* jumpc0 */

        break;

      case 0x5 :
        /* jumpc1 */

        break;

      case 0x6 :
        // jumpf
        if ( !( registers[Rd] === 1 ) ) control['pc'] = effectiveADR;
        break;

      case 0x7 :
        // jumpt
        if ( registers[Rd] === 1 ) control['pc'] = effectiveADR;
        break;

      case 0x8 :
        // jal
        registers[Rd] = control['pc'];
        control['pc'] = effectiveADR;
        break;

      case 0x9 :
        // testset
        registers[Rd] = effectiveADR;
        memory[effectiveADR] = 1;

      default :

        break;
    }
    return { 'control' : control, 'registers' : registers, 'memory' : memory };
  }

  function processEXPInstruction( control, registers, memory, Rd, Ra, Rb, adr ) {
    return { 'control' : control, 'registers' : registers, 'memory' : memory };
  }

  export function runMemory( control, registers, memory ) {
    var halted = false;
    var processed = {};

    var startpc = control['pc'];

    var instructionWords = 0;

    var instructionIr = memory[startpc];
    var instructionADR = 0;

    var Op = Math.floor( memory[startpc] / firstColumn );
    var Rd = Math.floor( ( memory[startpc] - ( Op * firstColumn ) ) / secondColumn );
    var Ra = Math.floor( ( memory[startpc] - ( Rd * secondColumn ) - ( Op * firstColumn ) ) / thirdColumn );
    var Rb = Math.floor( ( memory[startpc] - ( Ra * thirdColumn ) - ( Rd * secondColumn ) - ( Op * firstColumn ) ) / fourthColumn );

    var RaValue = registers[Ra];    
    var RbValue = registers[Rb];

    if ( ( RaValue & 0x8000 ) > 0 ) RaValue = readSignedHex( RaValue );
    if ( ( RbValue & 0x8000 ) > 0 ) RbValue = readSignedHex( RbValue );

    switch ( Op ) {
      case 0x0 :
        // add
        instructionWords = 1;
        registers[Ra] = RaValue + RbValue;

        if ( ( registers[Rd] & 0x10000 ) > 0 ) {
          registers[Rd] -= 0x10000;
          registers[15] = 0b00000101 * secondColumn;
        } else {
          registers[15] = 0;
        }

        break;

      case 0x1 :
        // sub
        instructionWords = 1;
        
        if ( RaValue < RbValue ) {
          registers[Rd] = ( RaValue + 0x10000 );
          registers[15] = 0b00000010 * secondColumn;
        } else {
          registers[Rd] = RaValue;
          registers[15] = 0;
        }

        registers[Rd] -= RbValue;

        break;

      case 0x2 :
        // mul
        instructionWords = 1;
        registers[Rd] = RaValue * RbValue;

        if ( ( registers[Rd] >= 0x10000 ) > 0 ) registers[15] = 0b00000010 * secondColumn;
        while ( ( registers[Rd] >= 0x10000 ) > 0 ) { registers[Rd] -= 0x10000; };
        
        break;

      case 0x3 :
        // div
        instructionWords = 1;

        if ( RbValue !== 0 ) {          
          registers[Rd] = Math.floor( RaValue / RbValue );
          registers[15] = RaValue % RbValue
        } else {
          registers[Rd] = RaValue;
          registers[15] = 0
        }

        break;

      case 0x4 :
        // cmp
        instructionWords = 1;
        registers[15] = compareRegisters( registers[Ra], registers[Rb] );

        break;

      case 0x5 :
        // cmplt
        instructionWords = 1;
        ( RaValue < RbValue ) ? registers[Rd] = 1 : registers[Rd] = 0;
        
        break;

      case 0x6 :
        // cmpeq
        instructionWords = 1;
        ( RaValue === RbValue ) ? registers[Rd] = 1 : registers[Rd] = 0;
        break;

      case 0x7 :
        // cmpgt
        instructionWords = 1;
        ( RaValue > RbValue ) ? registers[Rd] = 1 : registers[Rd] = 0;
        break;

      case 0x8 :
        // inv
        instructionWords = 1;
        registers[Ra] = RbValue ^ 0xffff;

        break;

      case 0x9 :
        // and
        instructionWords = 1;
        RaValue = ( RaValue === 1 );
        RbValue = ( RbValue === 1 );
        ( RaValue && RbValue ) ? registers[Rd] = 1 : registers[Rd] = 0;
        break;

      case 0xa :
        // or
        instructionWords = 1;
        RaValue = ( RaValue === 1 );
        RbValue = ( RbValue === 1 );
        ( RaValue || RbValue ) ? registers[Rd] = 1 : registers[Rd] = 0;
        break;

      case 0xb :
        // xor
        instructionWords = 1;
        RaValue = ( RaValue === 1 );
        RbValue = ( RbValue === 1 );
        ( RaValue ^ RbValue ) ? registers[Rd] = 1 : registers[Rd] = 0;
        break;

      case 0xc :
        // nop
        instructionWords = 1;

        break;

      case 0xd :
        // trap
        instructionWords = 1;
        halted = true;

        break;

      case 0xe :
        instructionWords = 2;
        instructionADR = memory[control['pc'] + 1];
        processed = processEXPInstruction( control, registers, memory, Rd, Ra, Rb, instructionADR );

        control = processed['control'];
        registers = processed['registers'];
        memory = processed['memory'];
        
        break;

      case 0xf :
        instructionWords = 2;
        instructionADR = memory[control['pc'] + 1];
        processed = processRXInstruction( control, registers, memory, Rd, Ra, Rb, instructionADR );

        control = processed['control'];
        registers = processed['registers'];
        memory = processed['memory'];
        
        break;

      default :
        instructionWords = 1;
        halted = true;
        break;
    }

    for ( var it = 0; it < 16; it++ ) {
      if ( registers[it] < 0 ) {
        registers[it] = readUnsignedHex( registers[it] );
      }
    }

    // R0 holds constant 0
    registers['r0'] = 0;

    control['ir'] = instructionIr;
    control['adr'] = instructionADR;

    if ( control['pc'] === startpc ) control['pc'] += instructionWords;

    return { 'control' : control, 'registers' : registers, 'memory' : memory, 'halted' : halted };
  }
