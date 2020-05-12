// CONSTS FOR COMMAND RECOGNITION
  const allCommands = {
    add : 'rrr', 
    sub : 'rrr', 
    mul : 'rrr', 
    div : 'rrr', 
    cmp : 'rr', 
    cmplt : 'rrr', 
    cmpeq : 'rrr', 
    cmpgt : 'rrr', 
    inv : 'rr', 
    and : 'rrr', 
    or : 'rrr', 
    xor : 'rrr', 
    trap : 'rrr',
    lea : 'rx', 
    load : 'rx', 
    store : 'rx', 
    jump : 'jx', 
    jumpc0 : 'kx', 
    jumpc1 : 'kx', 
    jumpf : 'rx', 
    jumpt : 'rx', 
    jal : 'rx', 
    testset : 'rx',
    jumplt : 'jumpAlias', 
    jumple : 'jumpAlias', 
    jumpne : 'jumpAlias', 
    jumpeq : 'jumpAlias', 
    jumpge : 'jumpAlias', 
    jumpgt : 'jumpAlias',
    data : 'x'
  };

  const firstColumn = Math.pow( 16, 3 );
  const secondColumn = Math.pow( 16, 2 );
  const thirdColumn = Math.pow( 16, 1 );
  const fourthColumn = Math.pow( 16, 0 );

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
    const jumpAliasCommands = { // 4 is jumpc0, 5 is jumpc1
      jumplt : [ 5, 11 ],
      jumple : [ 4, 15 ],
      jumpne : [ 4, 13 ],
      jumpeq : [ 5, 13 ],
      jumpge : [ 4, 11 ],
      jumpgt : [ 5, 15 ]
    };
    const kxCommands = {
      jumpc0 : 4,
      jumpc1 : 5
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

  function readConstant( argument, labels ) {
    var info = 0;

    if ( ! isNaN( argument ) ) {
      // number is in decimal
      info = readUnsignedHex( Number( argument ) );
    } else {
      // number is either hex or string
      if ( isValidNumber( argument ) ) {
        argument = argument.slice( 1, argument.length );
        info = parseInt( argument, 16);
      } else {
        if ( labels && Object.keys( labels ).includes( argument ) ) {
          info = labels[argument];
        } else {
          info = argument;
        }
      }
    }

    return info;
  }

  export function isValidNumber( numString ) {
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

    return ( num <= 15 && num >= 0 ) ? true : false;
  }

  export function writeHex( x ) {
    if ( x !== undefined ) {
      if ( !x.length ) {
        x = x.toString( 16 );
      }
      while ( x.length < 4 ) { x = '0' + x; }
      return x;
    }
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
    if ( !( /((\$(\d)|([a-f])|([A-F]))|(-(\d))|(\d)|(\w))+\[r((1[0-5])|([0-9]))\]/.test( jx ) ) ) {
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
    if ( !( /((\$(\d)|([a-f])|([A-F]))||(-(\d))|(\d)),((\$(\d)|([a-f])|([A-F]))|(\d)|(\w))+\[r((1[0-5])|([0-9]))\]/.test( kx ) ) ) {
      return 'arguments must be in the form of "k,disp[Ra]"';
    }
    var splat = kx.split( ',' );
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
    if ( !( /r((1[0-5])|([0-9])),((\$(\d)|([a-f])|([A-F]))|(-(\d))|(\d)|(\w))+\[r((1[0-5])|([0-9]))\]/.test( rx ) ) ) {
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
    var check = true;
    switch ( allCommands[command] ) {      
      case 'rr' :
        // first word is an rr command
        if ( argument ) { 
          // there is a second argument
          check = checkRRCommand( argument );
          // does follow requirements, and therefore function returns true
        } else {
          check = command + ' must be followed by 2 registers in form Rx,Rx';
        }
        break;

      case 'rrr' :
        // first word is an rrr command
        if ( argument ) { 
          // there is a second argument
          check = checkRRRCommand( argument );
          // does follow requirements, and therefore function returns true
        } else {
          check = command + ' must be followed by 3 registers in form Rx,Rx,Rx';
        }
        break;

      case 'jx' :
        // first word is an jx command
        if ( argument ) { 
          // there is a second argument
          check = checkJXCommand( argument, labels );
          // does follow requirements, and therefore function returns true
        } else {
          check = command + ' must be followed by arguments in the format of disp[Ra]';
        }
        break;

      case 'jumpAlias' :
        // first word is an jx command
        if ( argument ) { 
          // there is a second argument
          check = checkJXCommand( argument, labels );
          // does follow requirements, and therefore function returns true
        } else {
          check = command + ' must be followed by arguments in the format of disp[Ra]';
        }
        break;

      case 'kx' :
        // first word is an jx command
        if ( argument ) { 
          // there is a second argument
          check = checkKXCommand( argument, labels );
          // does follow requirements, and therefore function returns true
        } else {
          check = command + ' must be followed by arguments in the format of k,disp[Ra], where k is a bit';
        }
        break;

      case 'rx' :
        // first word is an rx command
        if ( argument ) { 
          // there is a second argument
          check = checkRXCommand( argument, labels );
          // does follow requirements, and therefore function returns true
        } else {
          check = command + ' must be followed by arguments in the format of Rd,disp[Ra]';
        }
        break;

      case 'x' :
        // first word is an x command i.e data
        if ( argument ) { 
          // there is a second argument
          check = checkXCommand( argument );
        } else {
          check = command + ' must be followed by a number, either decimal or hex ( preceeded by $ )';
        }
        break;

      default :
        check = 'not a valid rr, rrr, rx, jx, kx, or, x command';
    }
    return check;
  }

  export function checkLine( line, labels ) {
    var linesplit = line.trim().split( ';' )[0].split( /\s+/ );
    var error = true;

    if ( linesplit[0] ) {
      // lines isnt empty
      if ( Object.keys( allCommands ).includes( linesplit[0] ) ) {
        // first word is a command
        error = checkCommands( linesplit[0], linesplit[1], labels ); // will return error is arguments not present so dont have to check
      } else {
        // first word is not a command
        if ( /\w/.test( linesplit[0] ) ) {
          // first word is a label
          if ( linesplit[1] ) {
            // theres more after label
            if ( Object.keys( allCommands ).includes( linesplit[1] ) ) {
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
  function findInstuctionInfo( command, argument ) {
    var result = {
      words : 0,
      type : '',
      op : 0
    };

    switch ( allCommands[command] ) {
      case 'rr' :
        result['words'] = 1;
        result['type'] = 'rrr';
        result['op'] = rrCommands[command];
        break;
        
      case 'rrr' :
        result['words'] = 1;
        result['type'] = 'rrr';
        result['op'] = rrrCommands[command];
        break;
        
      case 'jx' :
        result['words'] = 2;
        result['type'] = 'rx';
        result['op'] = jxCommands[command];
        break;
        
      case 'jumpAlias' :
        result['words'] = 2;
        result['type'] = 'rx';
        result['op'] = jumpAliasCommands[command][0];
        break;
        
      case 'kx' :
        result['words'] = 2;
        result['type'] = 'rx';
        result['op'] = kxCommands[command];
        break;
        
      case 'rx' :
        result['words'] = 2;
        result['type'] = 'rx';
        result['op'] = rxCommands[command];
        break;
        
      case 'x' :
        result['words'] = 1;
        result['type'] = 'x';
        result['op'] = xCommands[command];
        break;

      default :
        break;
    }

    return result;
  }

  function findArgumentInfo( command, argument, labels ) {
    var result = {
      d : 0,
      a : 0,
      b : 0,
      disp : 0
    };

    switch ( allCommands[command] ) {
      case 'rr' :
        var argumentListRR = argument.split( ',' );
        result['a'] = Number( argumentListRR[0].slice( 1, argumentListRR[0].length ) );
        result['b'] = Number( argumentListRR[1].slice( 1, argumentListRR[1].length ) );
        
        result['d'] = result['a'];
        break;
        
      case 'rrr' :
        var argumentListRRR = argument.split( ',' );
        result['d'] = Number( argumentListRRR[0].slice( 1, argumentListRRR[0].length ) );
        result['a'] = Number( argumentListRRR[1].slice( 1, argumentListRRR[1].length ) );
        result['b'] = Number( argumentListRRR[2].slice( 1, argumentListRRR[2].length ) );
        break;
        
      case 'jx' :
        var argumentListJX = argument.split( '[' );
        result['a'] = Number( argumentListJX[1].slice( 1, argumentListJX[1].length - 1 ) ); // removes ']' from string
        result['disp'] = readConstant( argumentListJX[0], labels );

        result['d'] = 0;
        break;
        
      case 'jumpAlias' :
        var argumentListJumpAlias = argument.split( '[' );
        result['a'] = Number( argumentListJumpAlias[1].slice( 1, argumentListJumpAlias[1].length - 1 ) ); // removes ']' from string
        result['disp'] = readConstant( argumentListJumpAlias[0], labels );

        result['d'] = jumpAliasCommands[command][1];
        break;
        
      case 'kx' :
        var argumentListKX = argument.split( ',' );
        result['d'] = readConstant( argumentListKX[0], labels );

        argumentListKX = argumentListKX[1].split( '[' );
        result['a'] = Number( argumentListKX[1].slice( 1, argumentListKX[1].length - 1 ) ); // removes ']' from string
        result['disp'] = readConstant( argumentListKX[0], labels );
        break;
        
      case 'rx' :
        var argumentListRX = argument.split( ',' );
        result['d'] = Number( argumentListRX[0].slice( 1, argumentListRX[0].length ) );

        argumentListRX = argumentListRX[1].split( '[' );
        result['a'] = Number( argumentListRX[1].slice( 1, argumentListRX[1].length - 1 ) ); // removes ']' from string
        result['disp'] = readConstant( argumentListRX[0], labels );
        break;
        
      case 'x' :
        result['disp'] = readConstant( argument, labels );
        break;

      default :
        break;
    }

    return result;
  }

  function generateMachineCode( command, argument, labels ) {
    var machineCode = 0;
    var machineCodeSecond = 65536;

    var commandInfo = findInstuctionInfo( command, argument );
    var argumentInfo = findArgumentInfo( command, argument, labels );

    switch ( commandInfo['type'] ) {
      case 'rrr' :
        machineCode += commandInfo['op']*firstColumn + argumentInfo['d']*secondColumn + argumentInfo['a']*thirdColumn + argumentInfo['b']*fourthColumn;
        break;

      case 'rx' :
        machineCode += 0xf*firstColumn + argumentInfo['d']*secondColumn + argumentInfo['a']*thirdColumn + commandInfo['op']*fourthColumn;

        machineCodeSecond = argumentInfo['disp'];
        break;

      case 'x' :
        machineCode += argumentInfo['disp'];
        break;

      default :
        break;
    }

    return [ machineCode, machineCodeSecond ];
  }

  export function parseLineForLabels( line ) {
    var linesplit = line.trim().split( ';' )[0].split( /\s+/ );
    
    var result = {
      label : '',
      instructionWords : 0,
      justLabel : false
    };

    if ( linesplit[0] && linesplit[0] !== '' ) {
      // lines isnt empty
      if ( Object.keys( allCommands ).includes( linesplit[0] ) ) {
        // first word is a command
        result['instructionWords'] = findInstuctionInfo( linesplit[0], linesplit[1] )['words'];
      } else {
        // first word is not a command
        if ( /\w/.test( linesplit[0] ) ) {
          // first word is a label
          if ( linesplit[1] ) {
            // theres more after label
            if ( Object.keys( allCommands ).includes( linesplit[1] ) ) {
              result['label'] = linesplit[0];
              result['instructionWords'] = findInstuctionInfo( linesplit[1], linesplit[2] )['words'];
            }
          } else {
            // just a label, therefore allowed and function returns true
            result['label'] = linesplit[0];
            result['instructionWords'] = 1;
            result['justLabel'] = true;
          }
        }
      }
    }
    return result;
  }

  export function parseLineForMachineCode( line, labels ) {
    var machineCode = [ 0, 65536 ];

    var linesplit = line.trim().split( ';' )[0].split( /\s+/ );

    if ( linesplit[0] && linesplit[0] !== '' ) {
      // lines isnt empty
      if ( Object.keys( allCommands ).includes( linesplit[0] ) ) {
        // first word is a command
        machineCode = generateMachineCode( linesplit[0], linesplit[1], labels );
      } else {
        // first word is not a command
        if ( /\w/.test( linesplit[0] ) ) {
          // first word is a label
          if ( linesplit[1] ) {
            // theres more after label
            if ( Object.keys( allCommands ).includes( linesplit[1] ) ) {
              machineCode = generateMachineCode( linesplit[1], linesplit[2], labels );
            }
          } else {
            // is a just a label and must not be recognised as a seperate command so 
            // undefined is returned so that parent method can skip it from being added to machine code
            machineCode = undefined;
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

  function processTRAPInstruction( control, registers, memory, output, Rd, Ra, Rb ) {
    var halted = false;

    switch ( registers[Rd] ) {
      case 0x0 :
        halted = true;
        break;

      case 0x1 :

        break;

      case 0x2 :
        var memoryBufferStart = registers[Ra];

        var i = 0;

        for ( i; i < registers[Rb]; i++ ) {
          // if in memory, add to output, else add default memory value
          if ( memory[memoryBufferStart + i] ) {
            output += String.fromCharCode( memory[memoryBufferStart + i] );
          } else {
            output += String.fromCharCode( 0 );
          }
        }
        break;

      default :
        break;
    }

    return { 'control' : control, 'registers' : registers, 'memory' : memory, 'output' : output, 'halted' : halted };
  }

  function processRXInstruction( control, registers, memory, output, Rd, Ra, Op, adr ) {
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
        // jumpc0
        if ( ( registers[15] & Math.pow( 2, Rd ) ) === 0 ) control['pc'] = effectiveADR;

        break;

      case 0x5 :
        // jumpc1
        if ( ( registers[15] & Math.pow( 2, Rd ) ) > 0 ) control['pc'] = effectiveADR;

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
        registers[Rd] = control['pc'] + 2;
        control['pc'] = effectiveADR;
        break;

      case 0x9 :
        // testset
        registers[Rd] = effectiveADR;
        memory[effectiveADR] = 1;

        break;

      default :

        break;
    }
    return { 'control' : control, 'registers' : registers, 'memory' : memory, 'output' : output };
  }

  function processEXPInstruction( control, registers, memory, output, Rd, Ra, Rb, adr ) {
    return { 'control' : control, 'registers' : registers, 'memory' : memory, 'output' : output };
  }

  export function runMemory( control, registers, memory, output ) {
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
        registers[Rd] = RaValue + RbValue;

        if ( ( registers[Rd] & 0x10000 ) > 0 ) {
          registers[Rd] -= 0x10000;
          registers[15] = 0b00000101 * secondColumn;
        } else {
          registers[15] = 0;
        }
        
        registers[15] += compareRegisters( registers[Rd], registers[0] );

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

        registers[15] += compareRegisters( registers[Rd], registers[0] );

        break;

      case 0x2 :
        // mul
        instructionWords = 1;
        registers[Rd] = RaValue * RbValue;
        registers[15] = 0;

        if ( ( registers[Rd] >= 0x10000 ) > 0 ) registers[15] = 0b00000010 * secondColumn;
        while ( ( registers[Rd] >= 0x10000 ) > 0 ) { registers[Rd] -= 0x10000; };
        
        registers[15] += compareRegisters( registers[Rd], registers[0] );

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
        processed = processTRAPInstruction( control, registers, memory, output, Rd, Ra, Rb, instructionADR );

        control = processed['control'];
        registers = processed['registers'];
        memory = processed['memory'];
        output = processed['output'];

        halted = processed['halted'];

        break;

      case 0xe :
        instructionWords = 2;
        instructionADR = memory[control['pc'] + 1];
        processed = processEXPInstruction( control, registers, memory, output, Rd, Ra, Rb, instructionADR );

        control = processed['control'];
        registers = processed['registers'];
        memory = processed['memory'];
        output = processed['output'];

        break;

      case 0xf :
        instructionWords = 2;
        instructionADR = memory[control['pc'] + 1];
        processed = processRXInstruction( control, registers, memory, output, Rd, Ra, Rb, instructionADR );

        control = processed['control'];
        registers = processed['registers'];
        memory = processed['memory'];
        output = processed['output'];
        
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
    registers[0] = 0;

    control['ir'] = instructionIr;
    control['adr'] = instructionADR;

    if ( control['pc'] === startpc ) control['pc'] += instructionWords; 

    if ( Object.values( registers ).includes( NaN ) || Object.values( registers ).includes( undefined )  ) {
      console.log( control )
      console.log( registers )
      console.log( memory )

      output += '==== SEVERE SYSTEM ERROR ====';

      halted = true;
    }

    return { 'control' : control, 'registers' : registers, 'memory' : memory, 'output' : output, 'halted' : halted };
  }
