// CONSTS FOR COMMAND RECOGNITION
  const allCommands = {
    add : 'rrr', 
    sub : 'rrr', 
    mul : 'rrr', 
    div : 'rrr', 
    cmplt : 'rrr', 
    cmpeq : 'rrr', 
    cmpgt : 'rrr', 
    and : 'rrr', 
    or : 'rrr', 
    xor : 'rrr',
    nop : 'rrr',
    trap : 'rrr',

    cmp : 'rr', 
    inv : 'rr',

    lea : 'rx', 
    load : 'rx', 
    store : 'rx', 
    jumpf : 'rx', 
    jumpt : 'rx', 
    jal : 'rx', 
    testset : 'rx',

    jump : 'jx', 

    jumpc0 : 'kx', 
    jumpc1 : 'kx', 

    jumplt : 'jumpAlias', 
    jumple : 'jumpAlias', 
    jumpne : 'jumpAlias', 
    jumpeq : 'jumpAlias', 
    jumpge : 'jumpAlias', 
    jumpgt : 'jumpAlias',

    data : 'x',

    rfi : 'noEXP',

    execute : 'rrEXP',

    save : 'rrxEXP',
    restore : 'rrxEXP',

    getctl : 'rcEXP',
    putctl : 'rcEXP',

    push : 'rrrEXP',
    pop : 'rrrEXP',
    top : 'rrrEXP',

    shiftl : 'rrkEXP',
    shiftr : 'rrkEXP',

    getbit : 'rkEXP',
    getbiti : 'rkEXP',
    putbit : 'rkEXP',
    putbiti : 'rkEXP',

    field : 'rkkEXP',

    extract : 'rrkkEXP',
    extracti : 'rrkkEXP',

    inject : 'rrrkkEXP',
    injecti : 'rrrkkEXP',
    logicb : 'rrrkkEXP',

    logicw : 'rrrkEXP',

    andb : 'logicAliasRRRK',
    orb : 'logicAliasRRRK',
    xorb : 'logicAliasRRRK',

    invb : 'logicAliasRRK',

    andnew : 'logicAliasRRR',
    ornew : 'logicAliasRRR',
    xornew : 'logicAliasRRR',

    invnew : 'logicAliasRR'
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
      jumplt : [ 5, 4 ],
      jumple : [ 4, 0 ],
      jumpne : [ 4, 2 ],
      jumpeq : [ 5, 2 ],
      jumpge : [ 4, 4 ],
      jumpgt : [ 5, 0 ]
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
    const xCommands = {
      data : 0 // data doesnt have an op code since it kind of isnt a command but for convention sake, its in a dictionary
    };

  // EXP
    const noEXPCommands = {
      rfi : 0
    }

    const rrEXPCommands = {
      execute : 0xc
    };

    const rrxEXPCommands = {
      save : 8,
      restore : 9
    };

    const rcEXPCommands = {
      getctl : 0xa,
      putctl : 0xb
    };

    const rrrEXPCommands = {
      push : 0xd,
      pop : 0xe,
      top : 0xf
    };

    const rrkEXPCommands = {
      shiftl : 0x10,
      shiftr : 0x11,
    };

    const rkEXPCommands = {
      getbit : 0x18,
      getbiti : 0x19,
      putbit : 0x1a,
      putbiti : 0x1b,
    };

    const rkkEXPCommands = {
      field : 0x1c
    };

    const rrkkEXPCommands = {
      extract : 0x12,
      extracti : 0x13
    };

    const rrrkkEXPCommands = {
      inject : 0x14,
      injecti : 0x15,
      logicb : 0x17
    };

    const rrrkEXPCommands = {
      logicw : 0x16
    };

    const logicAliasRRRKCommands = {
      andb : [ 0x17, 1 ],
      orb : [ 0x17, 7 ],
      xorb : [ 0x17, 6 ]
    };

    const logicAliasRRKCommands = {
      invb : [ 0x17, 0xc ]
    };

    const logicAliasRRRCommands = {
      andnew : [ 0x16, 1 ],
      ornew : [ 0x16, 7 ],
      xornew : [ 0x16, 6 ]
    };

    const logicAliasRRCommands = {
      invnew : [ 0x16, 0xc ]
    };

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
      num = parseInt( numString, 16 );
    } else {
      num = 16;
    }

    return ( num <= 15 && num >= 0 ) ? true : false;
  }

  function isValidNumberGH( numString ) {
    var num = 0;

    if ( !isNaN( numString ) ) {
      num = parseInt( numString );
    } else if ( numString.startsWith( '$' ) ) {
      numString = numString.slice( 1, numString.length );
      num = parseInt( numString, 16 );
    } else {
      num = 16;
    }

    return ( num <= 255 && num >= 0 ) ? true : false;
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

  function getBitFromRegister( registerValue, bitNum ) {
    // push bit to the furthest left to remove bits before
    var bit = registerValue << bitNum;
    // remove bits before
    while ( bit >= 0x10000 ) { bit -= 0x10000; };

    // bit shift back left to furthest left position to remove trailing bits and leave either 1 or 0 to return
    bit = bit >> 15;

    return bit;
  }

  function setBitInRegister( registerValue, bitValue, bitNum ) {
    // very similar to inject code as a very similar command
    const shrdist = 15; // shift ffff right to get right-adjusted field
    const shldist = 15-bitNum;   // shift left to put field into position

    var radjustedField = 0xffff >>> shrdist;
    var maskO = radjustedField << shldist; // 1s in the field
    var mask = ( ~maskO ) & 0xffff; // mask to clear field in e

    // if either bit is on in registers[15] or in x, shifted to the left to fit in correct gap to be injected into then bit is on
    return ( ( registerValue & mask ) | ( bitValue << shldist ) );
  }

  function setBitInRegisterMultiple( destRegisterValue, sourceRegisterValue, bitFrom, bitTo ) {
    // Taken from original Sigma16 emulator, from the emulator.js file
    const shrdist = 15 - bitFrom + bitTo; // shift ffff right to get right-adjusted field
    const shldist = 15 - bitFrom;   // shift left to put field into position

    var radjustedField = 0xffff >>> shrdist;
    var maskO = radjustedField << shldist; // 1s in the field
    var mask = ( ~maskO ) & 0xffff; // mask to clear field in e
    var x = sourceRegisterValue & radjustedField; // value to be injected

    // if either bit is on in registers[Re] or in x, shifted to the left to fit in correct gap to be injected into then bit is on
    return ( ( destRegisterValue & mask ) | ( x << shldist ) );
  }

// CHECKING METHODS
  function checkRRCommand( rr ) {
    // check that rrr is in the form of rd,ra,rb
    if ( !( /^r((1[0-5])|([0-9])),r((1[0-5])|([0-9]))$/.test( rr ) ) ) {
      return 'arguments must be in the form of "Ra,Rb"';
    }
    return true;
  }

  function checkRRRCommand( rrr ) {
    // check that rrr is in the form of rd,ra,rb
    if ( !( /^r((1[0-5])|([0-9])),r((1[0-5])|([0-9])),r((1[0-5])|([0-9]))$/.test( rrr ) ) ) {
      return 'arguments must be in the form of "Rd,Ra,Rb"';
    }
    return true;
  }

  function checkJXCommand( jx, labels ) {
    // check that jx is in the form of disp[ra], where disp can be either hex, decimal, or a variable 
    if ( !( /^((\$((\d)|([a-f]))+)|(-(\d))|(\d)|(\w))+\[r((1[0-5])|([0-9]))\]$/.test( jx ) ) ) {
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
    // check that kx is in the form of k,disp[ra], where disp can be either hex, decimal, or a variable 
    if ( !( /^((\$((\d)|([a-f]))+)|(\d)),((\$((\d)|([a-f]))+)|(-(\d))|(\d)|(\w))+\[r((1[0-5])|([0-9]))\]$/.test( kx ) ) ) {
      return 'arguments must be in the form of "k,disp[Ra]", negative integers not allowed for k argument';
    }
    var splat = kx.split( ',' );
    var k = splat[0];
    var disp = splat[1].split( '[' )[0];

    if ( ! isValidNumberBit( k ) ) {
      return 'k argument must either be a decimal, a hex value between 0 and 15, negative integers not allowed';
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
    if ( !( /^r((1[0-5])|([0-9])),((\$((\d)|([a-f]))+)|(-(\d))|(\d)|(\w))+\[r((1[0-5])|([0-9]))\]$/.test( rx ) ) ) {
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

  function checkNOexpCommand( no ) {
    // doesnt matter the arguments, NOexp commands evaluate in the same way
    return true;
  }

  function checkRRXexpCommand( rrx ) {
    // check that rrx is in the form of re,rf,disp[rd], where disp can be either hex, or a decimal integer 
    if ( !( /^r((1[0-5])|([0-9])),r((1[0-5])|([0-9])),((\$((\d)|([a-f]))+)|(\d))+\[r((1[0-5])|([0-9]))\]$/.test( rrx ) ) ) {
      return 'arguments must be in the form of "Re,Rf,disp[Rd]", negative integers not allowed';
    }
    var disp = rrx.split( ',' )[2].split( '[' )[0];

    if ( isValidNumberGH( disp ) ) {
      return true;
    } else {
      return 'disp argument must either be a decimal, or a hex with decimal values between 0 and 255';
    }
  }

  function checkRCexpCommand( rc ) {
    // check that rc is in the form of rd,controlRegister, where controlRegister can be pc, ir, or adr
    if ( !( /^(r((1[0-5])|([0-9])),((ir)|(pc)|(adr)))$/.test( rc ) ) ) {
      return 'arguments must be in the form of "Rd,controlRegisterName"';
    }

    return true;
  }

  function checkRRKexpCommand( rrk ) {
    // check that rrk is in the form of re,rf,gh, where gh can be either hex, or a decimal integer between 0 and 15
    if ( !( /^r((1[0-5])|([0-9])),r((1[0-5])|([0-9])),((\$((\d)|([a-f]))+)|(\d))+$/.test( rrk ) ) ) {
      return 'arguments must be in the form of "Rd,Re,g", negative integers not allowed';
    }
    var g = rrk.split( ',' )[2];

    if ( ! isValidNumberBit( g ) ) {
      return 'g argument must either be a decimal, or a hex value with decimal value between 0 and 15';
    }
    return true;
  }

  function checkRKexpCommand( rk ) {
    // check that rk is in the form of rd,g, where g can be either hex, or a decimal integer between 0 and 15
    if ( !( /^r((1[0-5])|([0-9])),((\$((\d)|([a-f]))+)|(\d))+$/.test( rk ) ) ) {
      return 'arguments must be in the form of "Rd,g", negative integers not allowed';
    }
    var g = rk.split( ',' )[1];

    if ( ! isValidNumberBit( g ) ) {
      return 'g argument must either be a decimal, or a hex value with decimal value between 0 and 15';
    }
    return true;
  }

  function checkRKKexpCommand( rkk ) {
    // check that rrk is in the form of rd,g,h where g and h can be either hex, or a decimal integer between 0 and 15
    if ( !( /^r((1[0-5])|([0-9])),((\$((\d)|([a-f]))+)|(\d))+,((\$((\d)|([a-f]))+)|(\d))+$/.test( rkk ) ) ) {
      return 'arguments must be in the form of "Rd,g,h", negative integers not allowed';
    }
    var g = rkk.split( ',' )[1];
    var h = rkk.split( ',' )[2];

    if ( ! isValidNumberBit( g ) ) {
      return 'g argument must either be a decimal, or a hex value with decimal value between 0 and 15';
    }
    if ( ! isValidNumberBit( h ) ) {
      return 'h argument must either be a decimal, or a hex value with decimal value between 0 and 15';
    }
    return true;
  }

  function checkRRKKexpCommand( rrkk ) {
    // check that rrkk is in the form of rd,re,g,h, where g and h can be either hex, or a decimal integer between 0 and 15
    if ( !( /^r((1[0-5])|([0-9])),r((1[0-5])|([0-9])),((\$((\d)|([a-f]))+)|(\d))+,((\$((\d)|([a-f]))+)|(\d))+$/.test( rrkk ) ) ) {
      return 'arguments must be in the form of "Rd,Re,g,h", negative integers not allowed';
    }
    var splat = rrkk.split( ',' );
    var g = splat[2];
    var h = splat[3];

    if ( ! isValidNumberBit( g ) ) {
      return 'g argument must either be a decimal, a hex value between 0 and 15, negative integers not allowed';
    }
    if ( ! isValidNumberBit( h ) ) {
      return 'h argument must either be a decimal, a hex value between 0 and 15, negative integers not allowed';
    }
    return true;
  }

  function checkRRRKKexpCommand( rrrkk ) {
    // check that rrrkk is in the form of rd,re,rf,g,h, where g and h can be either hex, or a decimal integer between 0 and 15
    if ( !( /^r((1[0-5])|([0-9])),r((1[0-5])|([0-9])),r((1[0-5])|([0-9])),((\$((\d)|([a-f]))+)|(\d))+,((\$((\d)|([a-f]))+)|(\d))+$/.test( rrrkk ) ) ) {
      return 'arguments must be in the form of "Rd,Re,Rf,g,h", negative integers not allowed';
    }
    var splat = rrrkk.split( ',' );
    var g = splat[3];
    var h = splat[4];

    if ( ! isValidNumberBit( g ) ) {
      return 'g argument must either be a decimal, a hex value between 0 and 15, negative integers not allowed';
    }
    if ( ! isValidNumberBit( h ) ) {
      return 'h argument must either be a decimal, a hex value between 0 and 15, negative integers not allowed';
    }
    return true;
  }

  function checkRRRKexpCommand( rrrk ) {
    // check that rrrk is in the form of rd,re,rf,gh, where gh can be either hex, or a decimal integer between 0 and 255
    if ( !( /^r((1[0-5])|([0-9])),r((1[0-5])|([0-9])),r((1[0-5])|([0-9])),((\$((\d)|([a-f]))+)|(\d))+$/.test( rrrk ) ) ) {
      return 'arguments must be in the form of "Rd,Re,Rf,g", negative integers not allowed';
    }
    var splat = rrrk.split( ',' );
    var g = splat[3];

    if ( ! isValidNumberBit( g ) ) {
      return 'g argument must either be a decimal, a hex value between 0 and 15, negative integers not allowed';
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
          check = command + ' must be followed by 2 registers in form Ra,Rb';
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

      case 'noEXP' :
        // first word is an noEXP command i.e rfi
        check = checkNOexpCommand( argument );
        break;

      case 'rrEXP' :
        // first word is an rrEXP command i.e execute
        if ( argument ) {
          check = checkRRCommand( argument ); // same format as RR commands
        } else {
          check = command + ' must be followed by 2 registers in form Rx,Rx';
        }
        break;

      case 'rrxEXP' :
        // first word is an rrxEXP command i.e save
        if ( argument ) {
          check = checkRRXexpCommand( argument );
        } else {
          check = command + ' must be followed by 2 registers then a disp in the form of Rx,Rx,disp[Rx]';
        }
        break;

      case 'rcEXP' :
        // first word is an rcEXP command i.e getctl
        if ( argument ) {
          check = checkRCexpCommand( argument );
        } else {
          check = command + ' must be followed by a register and a control register in the form Rx,(pc/ir/adr)';
        }
        break;

      case 'rrrEXP' :
        // first word is an rrrEXP command i.e push
        if ( argument ) {
          check = checkRRRCommand( argument ); // same format as RRR commands
        } else {
          check = command + ' must be followed by 3 registers in form Rx,Rx,Rx';
        }
        break;

      case 'rrkEXP' :
        // first word is an rrkEXP command i.e shiftl
        if ( argument ) {
          check = checkRRKexpCommand( argument );
        } else {
          check = command + ' must be followed by 2 registers and a constant in form Rx,Rx,k';
        }
        break;

      case 'rkEXP' :
        // first word is an rrkEXP command i.e shiftl
        if ( argument ) {
          check = checkRKexpCommand( argument );
        } else {
          check = command + ' must be followed by a register and a constant in form Rx,k';
        }
        break;

      case 'rkkEXP' :
        // first word is an rrkEXP command i.e shiftl
        if ( argument ) {
          check = checkRKKexpCommand( argument );
        } else {
          check = command + ' must be followed by a register and 2 constants in form Rx,k1,k2';
        }
        break;

      case 'rrkkEXP' :
        // first word is an rrkkEXP command i.e extract
        if ( argument ) {
          check = checkRRKKexpCommand( argument );
        } else {
          check = command + ' must be followed by 2 registers and 2 constants in form Rx,Rx,k1,k2';
        }
        break;

      case 'rrrkkEXP' :
        // first word is an rrrkkEXP command i.e inject
        if ( argument ) {
          check = checkRRRKKexpCommand( argument );
        } else {
          check = command + ' must be followed by 3 registers and 2 constants in form Rx,Rx,Rx,k1,k2';
        }
        break;

      case 'rrrkEXP' :
        // first word is an rrrkEXP command i.e logicw
        if ( argument ) {
          check = checkRRRKexpCommand( argument );
        } else {
          check = command + ' must be followed by 3 registers and 1 constants in form Rx,Rx,Rx,k';
        }
        break;

      case 'logicAliasRRRK' :
        // first word is an logicAliasRRRK command i.e andb
        if ( argument ) {
          check = checkRRRKexpCommand( argument );
        } else {
          check = command + ' must be followed by 3 registers and 1 constants in form Rx,Rx,Rx,k';
        }
        break;

      case 'logicAliasRRK' :
        // first word is an logicAliasRRK command i.e invb
        if ( argument ) {
          check = checkRRKexpCommand( argument );
        } else {
          check = command + ' must be followed by 2 registers and a constant in form Rx,Rx,k';
        }
        break;

      case 'logicAliasRRR' :
        // first word is an logicAliasRRR command i.e andnew
        if ( argument ) {
          check = checkRRRCommand( argument );
        } else {
          check = command + ' must be followed by 3 registers in form Rx,Rx,Rx';
        }
        break;

      case 'logicAliasRR' :
        // first word is an logicAliasRR command i.e invnew
        if ( argument ) {
          check = checkRRCommand( argument );
        } else {
          check = command + ' must be followed by 2 registers in form Rx,Rx';
        }
        break;

      default :
        check = 'not a valid command with known command type';
        break;
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

      case 'noEXP' :
        result['words'] = 1;
        result['type'] = 'exp0';
        result['op'] = noEXPCommands[command];
        break;

      case 'rrEXP' :
        result['words'] = 2;
        result['type'] = 'exp4'; // doesnt matter if exp4 or exp8, g, h and gh elements will be 0 either way
        result['op'] = rrEXPCommands[command];
        break;

      case 'rrxEXP' :
        result['words'] = 2;
        result['type'] = 'exp8'; // g and h arguments will be 0 and gh will carry the 8 bit disp
        result['op'] = rrxEXPCommands[command];
        break;

      case 'rcEXP' :
        result['words'] = 2;
        result['type'] = 'exp4'; // exp4 as doubt that there will be more than 16 control registers ( even if interupts are added )
        result['op'] = rcEXPCommands[command];
        break;

      case 'rrrEXP' :
        result['words'] = 2;
        result['type'] = 'exp4'; // doesnt matter if exp4 or exp8, g, h and gh elements will be 0 either way
        result['op'] = rrrEXPCommands[command];
        break;

      case 'rrkEXP' :
        result['words'] = 2;
        result['type'] = 'exp4'; // f will be 0 and h will hold k argument as k only goes upto 15
        result['op'] = rrkEXPCommands[command];
        break;

      case 'rkEXP' :
        result['words'] = 2;
        result['type'] = 'exp4'; // g and h will hold k arguments as k only goes upto 15
        result['op'] = rkEXPCommands[command];
        break;

      case 'rkkEXP' :
        result['words'] = 2;
        result['type'] = 'exp4'; // g and h will hold k arguments as k only goes upto 15
        result['op'] = rkkEXPCommands[command];
        break;

      case 'rrkkEXP' :
        result['words'] = 2;
        result['type'] = 'exp4'; // two k arguments to be held in g and h fields, needs to be a exp4
        result['op'] = rrkkEXPCommands[command];
        break;

      case 'rrrkkEXP' :
        result['words'] = 2;
        result['type'] = 'exp4'; // two k arguments to be held in g and h fields, needs to be a exp4
        result['op'] = rrrkkEXPCommands[command];
        break;

      case 'rrrkEXP' :
        result['words'] = 2;
        result['type'] = 'exp4'; // one k field to be held as a 4 bit number, needs to be a exp4
        result['op'] = rrrkEXPCommands[command];
        break;

      case 'logicAliasRRRK' :
        result['words'] = 2;
        result['type'] = 'exp4'; // one k field to be held as a 4 bit number and one constant held in g as instruction type, needs to be a exp4
        result['op'] = logicAliasRRRKCommands[command][0];
        break;

      case 'logicAliasRRK' :
        result['words'] = 2;
        result['type'] = 'exp4'; // one k field to be held as a 4 bit number and one constant held in g as instruction type, needs to be a exp4
        result['op'] = logicAliasRRKCommands[command][0];
        break;

      case 'logicAliasRRR' :
        result['words'] = 2;
        result['type'] = 'exp4'; // does matter as logic type is set in g field
        result['op'] = logicAliasRRRCommands[command][0];
        break;

      case 'logicAliasRR' :
        result['words'] = 2;
        result['type'] = 'exp4'; // does matter as logic type is set in g field
        result['op'] = logicAliasRRCommands[command][0];
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
      disp : 0,

      e : 0,
      f : 0,
      g : 0,
      h : 0,
      gh : 0
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

      case 'noEXP' :
        // no need for argument handling as exp0 takes no arguments
        break;

      case 'rrEXP' :
        // copy of 'rr' case with a and b changed to d and e respectively
        var argumentListRRexp = argument.split( ',' );
        result['d'] = Number( argumentListRRexp[0].slice( 1, argumentListRRexp[0].length ) );
        result['e'] = Number( argumentListRRexp[1].slice( 1, argumentListRRexp[1].length ) );
        break;

      case 'rrxEXP' :
        var argumentListRRXexp = argument.split( ',' );
        result['e'] = Number( argumentListRRXexp[0].slice( 1, argumentListRRXexp[0].length ) );
        result['f'] = Number( argumentListRRXexp[1].slice( 1, argumentListRRXexp[1].length ) );

        argumentListRRXexp = argumentListRRXexp[2].split( '[' );
        result['d'] = Number( argumentListRRXexp[1].slice( 1, argumentListRRXexp[1].length - 1 ) ); // removes ']' from string
        result['gh'] = readConstant( argumentListRRXexp[0], labels );
        break;

      case 'rcEXP' :
        var argumentListRCexp = argument.split( ',' );
        result['d'] = Number( argumentListRCexp[0].slice( 1, argumentListRCexp[0].length ) );
        
        switch ( argumentListRCexp[1] ) {
          case 'pc' :
            result['g'] = 1;
            break;

          case 'ir' :
            result['g'] = 2;
            break;

          case 'adr' :
            result['g'] = 3;
            break;

          default :
            result['g'] = 0;
            break;
        }
        break;

      case 'rrrEXP' :
        // copy of 'rrr' case with d, a, and b changed to d, e, and f respectively
        var argumentListRRRexp = argument.split( ',' );
        result['d'] = Number( argumentListRRRexp[0].slice( 1, argumentListRRRexp[0].length ) );
        result['e'] = Number( argumentListRRRexp[1].slice( 1, argumentListRRRexp[1].length ) );
        result['f'] = Number( argumentListRRRexp[2].slice( 1, argumentListRRRexp[2].length ) );
        break;

      case 'rrkEXP' :
        var argumentListRRKexp = argument.split( ',' );
        result['d'] = Number( argumentListRRKexp[0].slice( 1, argumentListRRKexp[0].length ) );
        result['e'] = Number( argumentListRRKexp[1].slice( 1, argumentListRRKexp[1].length ) );
        
        result['g'] = readConstant( argumentListRRKexp[2], labels );
        break;

      case 'rkEXP' :
        var argumentListRKexp = argument.split( ',' );
        result['d'] = Number( argumentListRKexp[0].slice( 1, argumentListRKexp[0].length ) );
        
        result['g'] = readConstant( argumentListRKexp[1], labels );
        break;

      case 'rkkEXP' :
        var argumentListRKKexp = argument.split( ',' );
        result['d'] = Number( argumentListRKKexp[0].slice( 1, argumentListRKKexp[0].length ) );
        
        result['g'] = readConstant( argumentListRKKexp[1], labels );
        result['h'] = readConstant( argumentListRKKexp[2], labels );
        break;

      case 'rrkkEXP' :
        var argumentListRRKKexp = argument.split( ',' );
        result['d'] = Number( argumentListRRKKexp[0].slice( 1, argumentListRRKKexp[0].length ) );
        result['e'] = Number( argumentListRRKKexp[1].slice( 1, argumentListRRKKexp[1].length ) );
        
        result['g'] = readConstant( argumentListRRKKexp[2], labels );
        result['h'] = readConstant( argumentListRRKKexp[3], labels );
        break;

      case 'rrrkkEXP' :
        var argumentListRRRKKexp = argument.split( ',' );
        result['d'] = Number( argumentListRRRKKexp[0].slice( 1, argumentListRRRKKexp[0].length ) );
        result['e'] = Number( argumentListRRRKKexp[1].slice( 1, argumentListRRRKKexp[1].length ) );
        result['f'] = Number( argumentListRRRKKexp[2].slice( 1, argumentListRRRKKexp[2].length ) );
        
        result['g'] = readConstant( argumentListRRRKKexp[3], labels );
        result['h'] = readConstant( argumentListRRRKKexp[4], labels );
        break;

      case 'rrrkEXP' :
        var argumentListRRRKexp = argument.split( ',' );
        result['d'] = Number( argumentListRRRKexp[0].slice( 1, argumentListRRRKexp[0].length ) );
        result['e'] = Number( argumentListRRRKexp[1].slice( 1, argumentListRRRKexp[1].length ) );
        result['f'] = Number( argumentListRRRKexp[2].slice( 1, argumentListRRRKexp[2].length ) );
        
        result['g'] = readConstant( argumentListRRRKexp[3], labels );
        break;

      case 'logicAliasRRRK' :
        var argumentListLogicAliasRRRKexp = argument.split( ',' );
        result['d'] = Number( argumentListLogicAliasRRRKexp[0].slice( 1, argumentListLogicAliasRRRKexp[0].length ) );
        result['e'] = Number( argumentListLogicAliasRRRKexp[1].slice( 1, argumentListLogicAliasRRRKexp[1].length ) );
        result['f'] = Number( argumentListLogicAliasRRRKexp[2].slice( 1, argumentListLogicAliasRRRKexp[2].length ) );
        
        result['g'] = logicAliasRRRKCommands[command][1];
        result['h'] = readConstant( argumentListLogicAliasRRRKexp[3], labels );
        break;

      case 'logicAliasRRK' :
        var argumentListLogicAliasRRKexp = argument.split( ',' );
        result['d'] = Number( argumentListLogicAliasRRKexp[0].slice( 1, argumentListLogicAliasRRKexp[0].length ) );
        result['e'] = Number( argumentListLogicAliasRRKexp[1].slice( 1, argumentListLogicAliasRRKexp[1].length ) );
        
        result['g'] = logicAliasRRKCommands[command][1];
        result['h'] = readConstant( argumentListLogicAliasRRKexp[2], labels );
        break;

      case 'logicAliasRRR' :
        var argumentListLogicAliasRRRexp = argument.split( ',' );
        result['d'] = Number( argumentListLogicAliasRRRexp[0].slice( 1, argumentListLogicAliasRRRexp[0].length ) );
        result['e'] = Number( argumentListLogicAliasRRRexp[1].slice( 1, argumentListLogicAliasRRRexp[1].length ) );
        result['f'] = Number( argumentListLogicAliasRRRexp[2].slice( 1, argumentListLogicAliasRRRexp[2].length ) );
        
        result['g'] = logicAliasRRRCommands[command][1];
        break;

      case 'logicAliasRR' :
        var argumentListLogicAliasRRexp = argument.split( ',' );
        result['d'] = Number( argumentListLogicAliasRRexp[0].slice( 1, argumentListLogicAliasRRexp[0].length ) );
        result['e'] = Number( argumentListLogicAliasRRexp[1].slice( 1, argumentListLogicAliasRRexp[1].length ) );
        
        result['g'] = logicAliasRRCommands[command][1];
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

      case 'exp0' :
        machineCode += 0xe*firstColumn + argumentInfo['d']*secondColumn + commandInfo['op']*fourthColumn;
        break;

      case 'exp4' :
        machineCode += 0xe*firstColumn + argumentInfo['d']*secondColumn + commandInfo['op']*fourthColumn;
        
        machineCodeSecond = argumentInfo['e']*firstColumn + argumentInfo['f']*secondColumn + argumentInfo['g']*thirdColumn + argumentInfo['h']*fourthColumn
        break;

      case 'exp8' :
        machineCode += 0xe*firstColumn + argumentInfo['d']*secondColumn + commandInfo['op']*fourthColumn;
        
        machineCodeSecond = argumentInfo['e']*firstColumn + argumentInfo['f']*secondColumn + argumentInfo['gh']*fourthColumn
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

  function processTRAPInstruction( control, registers, memory, input, output, Rd, Ra, Rb ) {
    var halted = false;

    switch ( registers[Rd] ) {
      case 0x0 :
        halted = true;
        break;

      case 0x1 :
        var memoryBufferStartInput = registers[Ra];

        for ( var i = 0; i < registers[Rb]; i++ ) {
          if ( input.length > i ) {
            memory[memoryBufferStartInput + i] = input.charCodeAt( i );
          } else {
            memory[memoryBufferStartInput + i] = 0;
          }
        }
        output += '>>' + input.slice( 0, registers[Rb] );
        input = input.slice( registers[Rb], input.length );

        break;

      case 0x2 :
        var memoryBufferStartOutput = registers[Ra];

        for ( var it = 0; it < registers[Rb]; it++ ) {
          // if in memory, add to output, else add default memory value
          if ( memory[memoryBufferStartOutput + it] ) {
            output += String.fromCharCode( memory[memoryBufferStartOutput + it] );
          } else {
            output += String.fromCharCode( 0 );
          }
        }
        break;

      default :
        break;
    }

    return { 
      'control' : control,
      'registers' : registers, 
      'memory' : memory, 
      'input': input, 
      'output' : output, 
      'halted' : halted 
    };
  }

  function processRXInstruction( control, registers, memory, Rd, Ra, Op, adr ) {
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
        if ( ( registers[15] & Math.pow( 2, ( 15 - Rd ) ) ) === 0 ) control['pc'] = effectiveADR;

        break;

      case 0x5 :
        // jumpc1
        if ( ( registers[15] & Math.pow( 2, ( 15 - Rd ) ) ) > 0 ) control['pc'] = effectiveADR;

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
    return { 
      'control' : control,
      'registers' : registers, 
      'memory' : memory
    };
  }

  function processEXPInstruction( control, registers, memory, Rd, Ra, Rb, adr ) {
    var ab = ( Ra * thirdColumn ) + Rb;

    var Re = Math.floor( adr / firstColumn );
    var Rf = Math.floor( ( adr - ( Re * firstColumn ) ) / secondColumn );

    var gh = Math.floor( adr - ( Rf * secondColumn ) - ( Re * firstColumn ) );

    var g = Math.floor( gh / thirdColumn );
    var h = Math.floor( ( gh - ( g * thirdColumn ) ) / fourthColumn );

    var instructionWords = 1;

    switch ( ab ) {
      case 0x0 :
        // rfi
        instructionWords = 1;
        // currently nop as no system registers to be affected

        break;

      case 0x8 :
        // save
        instructionWords = 2;
        var effectiveADRsave = registers[Rd] + gh;

        var diffSave = 0;
        if ( Re > Rf ) {
          diffSave = Math.abs( Re - ( Rf + 16 ) );
        } else {
          diffSave = Math.abs( Re - Rf );
        }

        for ( var iSave = Re; iSave <= ( Re + diffSave ); iSave++ ) {
          var regNoSave = iSave % 16;
          memory[effectiveADRsave + ( iSave - Re )] = registers[regNoSave];
        }

        break;

      case 0x9 :
        // restore
        instructionWords = 2;
        var effectiveADRrestore = registers[Rd] + gh;

        var diffRestore = 0;
        if ( Re > Rf ) {
          diffRestore = Math.abs( Re - ( Rf + 16 ) );
        } else {
          diffRestore = Math.abs( Re - Rf );
        }

        for ( var iRestore = Re; iRestore <= ( Re + diffRestore ); iRestore++ ) {
          var regNoRestore = iRestore % 16;
          registers[regNoRestore] = memory[effectiveADRrestore + ( iRestore - Re )];
        }

        break;

      case 0xa :
        // getctl
        instructionWords = 2;
        switch ( g ) {
          case 1 :
            registers[Rd] = control['pc'];
            break;

          case 2 :
            registers[Rd] = control['ir'];
            break;

          case 3 :
            registers[Rd] = control['adr'];
            break;

          default :
            break;
        }
        break;

      case 0xb :
        // putctl
        instructionWords = 2;
        switch ( g ) {
          case 1 :
            control['pc'] = registers[Rd];
            break;

          case 2 :
            control['ir'] = registers[Rd];
            break;

          case 3 :
            control['adr'] = registers[Rd];
            break;

          default :
            break;
        }
        break;

      case 0xc :
        // execute
        instructionWords = 2;

        // currently nop as not needed and not implemented in original emulator

        break;

      case 0xd :
        // push
        instructionWords = 2;
        if ( registers[Re] < registers[Rf] ) {
          registers[Re] += 1;

          memory[registers[Re]] = registers[Rd];
        } else {
          // stack overflow flag set and nop
          registers[15] = 0b10000000;
        }
        break;

      case 0xe :
        // pop
        instructionWords = 2;
        if ( registers[Re] <= registers[Rf] ) {
          registers[Rd] = memory[registers[Re]];

          registers[Re] -= 1;
        }
        break;

      case 0xf :
        // top
        instructionWords = 2;
        registers[Rd] = memory[registers[Re]];
        break;

      case 0x10 :
        // shiftl
        instructionWords = 2;
        registers[Rd] = registers[Re] << g;

        if ( registers[Rd] >= 0x10000 && Rd !== 15 ) {
          registers[15] = 0b00000100 * secondColumn;

          while ( registers[Rd] >= 0x10000 ) { registers[Rd] -= 0x10000; };
        } else if ( Rd !== 15 ) {
          registers[15] = 0;
        }

        break;

      case 0x11 :
        // shiftr
        instructionWords = 2;
        registers[Rd] = registers[Re] >> g;
        break;

      case 0x12 :
        // extract
        instructionWords = 2;
        var resultExtract = 0;

        // shiftl Rd,Re,g
        resultExtract = registers[Re] << g;
        while ( resultExtract >= 0x10000 ) { resultExtract -= 0x10000; }

        // shiftr Rd,Rr,15-h+g
        resultExtract = resultExtract >> ( 15 - h + g );

        registers[Rd] = resultExtract;
        break;

      case 0x13 :
        // extracti
        instructionWords = 2;
        var resultExtractI = 0;

        // inv Rd,Re
        resultExtractI = ( registers[Re] ^ 0xffff );

        // shiftl Rd,Rd,g
        resultExtractI = resultExtractI << g;
        while ( resultExtractI >= 0x10000 ) { resultExtractI -= 0x10000; }

        // shiftr Rd,Rr,15-h+g
        resultExtractI = resultExtractI >>> ( 15 - h + g );

        registers[Rd] = resultExtractI;
        break;

      case 0x14 :
        // inject
        instructionWords = 2;

        registers[Rd] = setBitInRegisterMultiple( registers[Re], registers[Rf], h, g );
        break;

      case 0x15 :
        // injecti
        instructionWords = 2;

        registers[Rd] = setBitInRegisterMultiple( registers[Re], ( registers[Rf] ^ 0xffff ), h, g );
        break;

      case 0x16 :
        // logicw
        instructionWords = 2;

        switch ( g ) {
          case 1 :
            // and
            registers[Rd] = registers[Re] & registers[Rf];
            break;

          case 6 :
            // xor
            registers[Rd] = registers[Re] ^ registers[Rf];
            break;

          case 7 :
            // or
            registers[Rd] = registers[Re] | registers[Rf];
            break;

          case 0xc :
            // inv 
            registers[Rd] = registers[Re] ^ 0xffff;
            break;

          default :
            break;
        };

        break;

      case 0x17 :
        // logicb
        instructionWords = 2;
        switch ( g ) {
          case 1 :
            // andb
            const bitToSetAnd = getBitFromRegister( registers[Re], h ) & getBitFromRegister( registers[Rf], h );

            registers[Rd] = setBitInRegister( registers[Rd], bitToSetAnd, h );
            break;

          case 6 :
            // xorb
            const bitToSetXor = getBitFromRegister( registers[Re], h ) ^ getBitFromRegister( registers[Rf], h );

            registers[Rd] = setBitInRegister( registers[Rd], bitToSetXor, h );
            break;

          case 7 :
            // orb
            const bitToSetOr = getBitFromRegister( registers[Re], h ) | getBitFromRegister( registers[Rf], h );

            registers[Rd] = setBitInRegister( registers[Rd], bitToSetOr, h );
            break;

          case 0xc :
            // invb 
            const bitToSetInv = ( getBitFromRegister( registers[Re], h ) ^ 1 );

            registers[Rd] = setBitInRegister( registers[Rd], bitToSetInv, h );
            break;

          default :
            break;
        };
        break;

      case 0x18 :
        // getbit
        instructionWords = 2;
        
        var bit = getBitFromRegister( registers[15], g );

        registers[Rd] = bit;

        break;

      case 0x19 :
        // getbiti
        instructionWords = 2;

        var bitI = getBitFromRegister( registers[15], g );

        registers[Rd] = ( bitI ^ 1 );
        
        break;

      case 0x1a :
        // putbit
        instructionWords = 2;

        const bitToSetPut = getBitFromRegister( registers[Rd], g );

        registers[15] = setBitInRegister( registers[15], bitToSetPut, g );
        break;

      case 0x1b :
        // putbiti
        instructionWords = 2;
        
        const bitToSetPutI = ( getBitFromRegister( registers[Rd], g ) ^ 1 );
        
        registers[15] = setBitInRegister( registers[15], bitToSetPutI, g );
        break;

      case 0x1c :
        // field
        instructionWords = 2;

        registers[Rd] = setBitInRegisterMultiple( 0, 0xffff, h, g );
        break;

      default :
        break;
    }

    return { 
      'control' : control,
      'registers' : registers, 
      'memory' : memory,
      'instructionWords' : instructionWords
    };
  }

  export function runMemory( control, registers, memory, input, output ) {
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

        if ( registers[Rd] >= 0x10000 ) {
          registers[Rd] -= 0x10000;
          if ( Rd !== 15 ) {
            registers[15] = 0b00000101 * secondColumn;
          }
        } else {
          if ( Rd !== 15 ) {
            registers[15] = 0
          }
        }
        
        if ( Rd !== 15 ) {
          registers[15] += compareRegisters( registers[Rd], registers[0] );
        }

        break;

      case 0x1 :
        // sub
        instructionWords = 1;
        
        if ( RaValue < RbValue ) {
          registers[Rd] = ( RaValue + 0x10000 );
          if ( Rd !== 15 ) {
            registers[15] = 0b00000010 * secondColumn;
          }
        } else {
          registers[Rd] = RaValue;
          if ( Rd !== 15 ) {
            registers[15] = 0;
          }
        }

        registers[Rd] -= RbValue;
        
        if ( Rd !== 15 ) {
          registers[15] += compareRegisters( registers[Rd], registers[0] );
        }

        break;

      case 0x2 :
        // mul
        instructionWords = 1;
        registers[Rd] = RaValue * RbValue;

        if ( registers[Rd] >= 0x10000 && Rd !== 15 ) {
          registers[15] = 0b00000010 * secondColumn;
          while ( registers[Rd] >= 0x10000 ) { registers[Rd] -= 0x10000; };
        } else if ( Rd !== 15 ) {
          registers[15] = 0
        }
        
        if ( Rd !== 15 ) {
          registers[15] += compareRegisters( registers[Rd], registers[0] );
        }

        break;

      case 0x3 :
        // div
        instructionWords = 1;

        if ( RbValue !== 0 ) {
          registers[Rd] = Math.floor( RaValue / RbValue );
          if ( Rd !== 15 ) {
            registers[15] = RaValue % RbValue
          }
        } else {
          registers[Rd] = RaValue;
          if ( Rd !== 15 ) {
            registers[15] = 0
          }
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
        registers[Rd] = registers[Ra] & registers[Rb];
        break;

      case 0xa :
        // or
        instructionWords = 1;
        registers[Rd] = registers[Ra] | registers[Rb];
        break;

      case 0xb :
        // xor
        instructionWords = 1;
        registers[Rd] = registers[Ra] ^ registers[Rb];
        break;

      case 0xc :
        // nop
        instructionWords = 1;

        break;

      case 0xd :
        // trap
        instructionWords = 1;
        processed = processTRAPInstruction( control, registers, memory, input, output, Rd, Ra, Rb, instructionADR );

        control = processed['control'];
        registers = processed['registers'];
        memory = processed['memory'];
        input = processed['input'];
        output = processed['output'];

        halted = processed['halted'];

        break;

      case 0xe :
        instructionADR = memory[control['pc'] + 1];
        processed = processEXPInstruction( control, registers, memory, Rd, Ra, Rb, instructionADR );

        control = processed['control'];
        registers = processed['registers'];
        memory = processed['memory'];
        instructionWords = processed['instructionWords'];

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

    return { 
      'control' : control, 
      'registers' : registers, 
      'memory' : memory, 
      'input': input, 
      'output' : output, 
      'halted' : halted 
    };
  }
