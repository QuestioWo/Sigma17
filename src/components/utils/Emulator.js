/*
  Copyright Jim Carty © 2020

  This file is subject to the terms and conditions defined in file 'LICENSE.txt', which is part of this source code package.
*/

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
    andold : 'rrr', 
    or : 'rrr', 
    orold : 'rrr', 
    xor : 'rrr',
    xorold : 'rrr',
    trap : 'rrr',

    cmp : 'rr', 
    inv : 'rr',
    invold : 'rr',

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

    jumple : 'jumpAlias',
    jumpne : 'jumpAlias',
    jumpge : 'jumpAlias',
    jumpnv : 'jumpAlias',
    jumpnvu : 'jumpAlias',
    jumpnco : 'jumpAlias',
    jumpnso : 'jumpAlias',

    jumplt : 'jumpAlias',
    jumpeq : 'jumpAlias',
    jumpgt : 'jumpAlias',
    jumpv : 'jumpAlias',
    jumpvu : 'jumpAlias',
    jumpco : 'jumpAlias',
    jumpso : 'jumpAlias',

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
    addc : 'rrrEXP',

    shiftl : 'rrkEXP',
    shiftr : 'rrkEXP',

    getbit : 'rkEXP',
    getbiti : 'rkEXP',
    putbit : 'rkEXP',
    putbiti : 'rkEXP',

    field : 'injectIAlias',

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

  // const fullyCompatibleCommands = [
  //   'add',
  //   'sub',
  //   'mul',
  //   'div',
  //   'cmp',
  //   'cmplt',
  //   'cmpeq',
  //   'cmpgt',
  //   'inv',
  //   'invold',
  //   'and',
  //   'andold',
  //   'or',
  //   'orold',
  //   'xor',
  //   'xorold',
  //   'trap',

  //   'lea',
  //   'load',
  //   'store',
  //   'jump',
  //   'jumpc0',
  //   'jumpc1',
  //   'jumpf',
  //   'jumpt',
  //   'jal',

  //   'jumple',
  //   'jumpne',
  //   'jumpge',
  //   'jumpnv',
  //   'jumpnvu',
  //   'jumpnco',

  //   'jumplt',
  //   'jumpeq',
  //   'jumpgt',
  //   'jumpv',
  //   'jumpvu',
  //   'jumpco',

  //   'data',

  //   'save',
  //   'restore',

  //   'shiftl',
  //   'shiftr',

  //   'extract',
  //   'extracti',

  //   'inject',
  //   'injecti',
  //   'logicb',

  //   'logicw',

  //   'andb',
  //   'orb',
  //   'xorb',

  //   'invb'
  // ];

  const partiallyCompatibleCommands = { // recognised by assembler but has other effects
    testset : 'Assembles but no functionality',
    rfi : 'Assembles, but hangs when ran in a program',
    execute : 'Assembles, however, not as per docs and has no functionality',
    getctl : 'Assembles differently and has different range of functionality',
    putctl : 'Assembles differently and has different range of functionality',
    push : 'Assembles but no functionality',
    pop : 'Assembles but no functionality',
    top : 'Assembles but no functionality',
    field : 'Assembler accepts but does not produce any codes'
  };

  const nonCompatibleCommands = [ // not even recognised by assembler
    'addc',
    'getbit',
    'getbiti',
    'putbit',
    'putbiti',
    'jumpnso',
    'jumpso',
    'andnew',
    'ornew',
    'xornew',
    'invnew'
  ];
  
  const firstColumn = Math.pow( 16, 3 );
  const secondColumn = Math.pow( 16, 2 );
  const thirdColumn = Math.pow( 16, 1 );
  const fourthColumn = Math.pow( 16, 0 );

  // RRR
    const rrCommands = {
      cmp : 4,
      inv : 8,
      invold : 8
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
      andold : 9,
      or : 0xa,
      orold : 0xa,
      xor : 0xb,
      xorold : 0xb,
      trap : 0xd
    };

  // RX
    const jxCommands = {
      jump : 3
    };
    const jumpAliasCommands = { // 4 is jumpc0, 5 is jumpc1
      jumple : [ 4, 1 ],
      jumpne : [ 4, 2 ],
      jumpge : [ 4, 3 ],
      jumpnv : [ 4, 6 ],
      jumpnvu : [ 4, 5 ],
      jumpnco : [ 4, 7 ],
      jumpnso : [ 4, 8 ],

      jumplt : [ 5, 3 ],
      jumpeq : [ 5, 2 ],
      jumpgt : [ 5, 1 ],
      jumpv : [ 5, 6 ],
      jumpvu : [ 5, 5 ],
      jumpco : [ 5, 7 ],
      jumpso : [ 5, 8 ]
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
    };

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
      top : 0xf,
      addc : 0x1c
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

    const injectIAliasCommands = {
      field : [ 0x15, 0, 0 ]
    };

    const registerRegExp = '[rR]((1[0-5])|([0-9]))';
    const controlRegisterRegExp = '((pc)|(ir)|(adr))';

    const constantPositiveRegExp = '((\\$((\\d)|([a-fA-F]))+)|(\\#(1|0)+)|(\\d))+';
    const constantRegExp = '((\\$((\\d)|([a-fA-F]))+)|(\\#(1|0)+)|(-\\d)|(\\d))+';

    const dispAndIndexRegExp = '((\\$((\\d)|([a-fA-F]))+)|(\\#(1|0)+)|(-(\\d))|(\\d)|(\\w))+\\[' + registerRegExp + '\\]';
    const dispAndIndexEXPRegExp = '((\\$((\\d)|([a-fA-F]))+)|(\\#(1|0)+)|(\\d))+\\[' + registerRegExp + '\\]';

    // define check regexps here as called when loading file module so doesnt have to made each time the check command is ran
      const rrRegExp = new RegExp( '^' + registerRegExp + ',' + registerRegExp  + '$' );
      const rrrRegExp = new RegExp( '^' + registerRegExp + ',' + registerRegExp + ',' + registerRegExp + '$' );
      const jxRegExp = new RegExp( '^' + dispAndIndexRegExp + '$' );
      const kxRegExp = new RegExp( '^' + constantPositiveRegExp + ',' + dispAndIndexRegExp + '$' );
      const rxRegExp = new RegExp( '^' + registerRegExp + ',' + dispAndIndexRegExp + '$' );
      const xRegExp = new RegExp( '^' + constantRegExp + '$' );
      const rrxRegExp = new RegExp( '^' + registerRegExp + ',' + registerRegExp + ',' + dispAndIndexEXPRegExp + '$' );
      const rcRegExp = new RegExp( '^' + registerRegExp + ',' + controlRegisterRegExp + '$' );
      const rrkRegExp = new RegExp( '^' + registerRegExp + ',' + registerRegExp + ',' + constantPositiveRegExp + '$' );
      const rkRegExp = new RegExp( '^' + registerRegExp + ',' + constantPositiveRegExp + '$' );
      const rkkRegExp = new RegExp( '^' + registerRegExp + ',' + constantPositiveRegExp + ',' + constantPositiveRegExp + '$' );
      const rrkkRegExp = new RegExp( '^' + registerRegExp + ',' + registerRegExp + ',' + constantPositiveRegExp + ',' + constantPositiveRegExp + '$' );
      const rrrkkRegExp = new RegExp( '^' + registerRegExp + ',' + registerRegExp + ',' + registerRegExp + ',' + constantPositiveRegExp + ',' + constantPositiveRegExp + '$' );
      const rrrkRegExp = new RegExp( '^' + registerRegExp + ',' + registerRegExp + ',' + registerRegExp + ',' + constantPositiveRegExp + '$' );

// UTIL FUNCTIONS
  export function readSignedHex( a ) {
    a = Number( a );
    if ( a < 65536 && a >= -32768 ) {
      if ( ( a & 0x8000 ) > 0) {
        a = a - 0x10000;
      }
      return a;
    }
    return 65536;
  }

  export function readUnsignedHex( a ) {
    if ( a < 65536 && a >= -32768 ) {
      if ( a < 0 ) {
        a = a + 0x10000;
      }
      return a;
    }
    return 65536;
  }

  function readConstant( argument, labels ) {
    var info = 0;

    if ( ! isNaN( argument ) ) {
      // number is in decimal
      info = readUnsignedHex( Number( argument ) );
    } else {
      // number is either hex, binary, or, string
      if ( isValidNumber( argument ) ) {
        var parseBy = 16;
        if ( argument.startsWith( '$' ) ) {          
          parseBy = 16;
        } else if ( argument.startsWith( '#' ) ) {
          parseBy = 2;
        }

        argument = argument.slice( 1, argument.length );
        info = parseInt( argument, parseBy );
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

  function readCompatibleConstant( argument ) {
    var info = 0;

    if ( ! isNaN( argument ) ) {
      // number is in decimal
      info = argument;
    } else {
      // number is either hex, binary, or, string
      if ( isValidNumber( argument ) ) {
        info = readConstant( argument, {} );
      } else {
        info = argument;
      }
    }

    return info;
  }

  export function isValidNumber( numString ) {
    var num = 0;

    if ( !isNaN( numString ) ) {
      num = readUnsignedHex( parseInt( numString ) );
    } else if ( numString.startsWith( '$' ) ) {
      numString = numString.slice( 1, numString.length );
      num = readUnsignedHex( parseInt( numString, 16 ) );
    } else if ( numString.startsWith( '#' ) ) {
      numString = numString.slice( 1, numString.length );
      num = readUnsignedHex( parseInt( numString, 2 ) );
    } else {
      num = 65536;
    }

    return ( num < 65536 && num >= 0 ) ? true : false;
  }

  function isValidNumberBit( numString ) {
    var num = 0;

    if ( !isNaN( numString ) ) {
      num = parseInt( numString );
    } else if ( numString.startsWith( '$' ) ) {
      numString = numString.slice( 1, numString.length );
      num = parseInt( numString, 16 );
    } else if ( numString.startsWith( '#' ) ) {
      numString = numString.slice( 1, numString.length );
      num = readUnsignedHex( parseInt( numString, 2 ) );
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
    } else if ( numString.startsWith( '#' ) ) {
      numString = numString.slice( 1, numString.length );
      num = readUnsignedHex( parseInt( numString, 2 ) );
    } else {
      num = 256;
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
    return ( ( registerValue >> ( 15 - bitNum ) ) % 2 );
  }

  function setBitInRegister( registerValue, bitValue, bitNum ) {
    const shiftLDist = 15 - bitNum;

    const mask = 0xffff - ( 1 << shiftLDist );
    
    return ( ( registerValue & mask ) | ( bitValue << shiftLDist ) );
  }

  function setBitInRegisterMultiple( destRegisterValue, sourceRegisterValue, bitFrom, bitTo ) {
    const shiftRDist = 15 - bitFrom + bitTo;
    const shiftLDist = 15 - bitFrom;

    const radjustedField = 0xffff >> shiftRDist;
    const mask = ~( radjustedField << shiftLDist ) & 0xffff;
    const x = sourceRegisterValue & radjustedField;

    // if either bit is on in registers[Re] or in x, shifted to the left to fit in correct gap to be injected into then bit is on
    return ( ( destRegisterValue & mask ) | ( x << shiftLDist ) );
  }

  function getR15Dict() {
    return {
      'G' : 0,
      'g' : 0,
      'E' : 0,
      'l' : 0,
      'L' : 0,
      'V' : 0,
      'v' : 0,
      'C' : 0,
      'S' : 0
    };
  }

  function setR15Flags( flagDict ) {
    var r15 = 0;

    if ( flagDict['G'] === 1 ) r15 += ( 0b1000000000000000 );
    if ( flagDict['g'] === 1 ) r15 += ( 0b0100000000000000 );
    if ( flagDict['E'] === 1 ) r15 += ( 0b0010000000000000 );
    if ( flagDict['l'] === 1 ) r15 += ( 0b0001000000000000 );
    if ( flagDict['L'] === 1 ) r15 += ( 0b0000100000000000 );
    if ( flagDict['V'] === 1 ) r15 += ( 0b0000010000000000 );
    if ( flagDict['v'] === 1 ) r15 += ( 0b0000001000000000 );
    if ( flagDict['C'] === 1 ) r15 += ( 0b0000000100000000 );
    if ( flagDict['S'] === 1 ) r15 += ( 0b0000000010000000 );

    return r15;
  }

// CHECKING METHODS
  function checkRRCommand( rr ) {
    // check that rrr is in the form of rd,ra,rb
    if ( !( rrRegExp.test( rr ) ) ) {
      return 'arguments must be in the form of "Ra,Rb"';
    }
    return true;
  }

  function checkRRRCommand( rrr ) {
    // check that rrr is in the form of rd,ra,rb
    if ( !( rrrRegExp.test( rrr ) ) ) {
      return 'arguments must be in the form of "Rd,Ra,Rb"';
    }
    return true;
  }

  function checkJXCommand( jx, labels ) {
    // check that jx is in the form of disp[ra], where disp can be either hex, decimal, or a variable 
    if ( !( jxRegExp.test( jx ) ) ) {
      return 'arguments must be in the form of "disp[Ra]"';
    }
    var disp = jx.split( '[' )[0];

    if ( isValidNumber( disp ) ) {
      return true;
    } else if ( Object.keys( labels ).includes( disp ) ) {
      return true;
    } else {
      return 'disp argument must either be a decimal, a hex, binary, or, an initailised label';
    }
  }

  function checkKXCommand( kx, labels ) {
    // check that kx is in the form of k,disp[ra], where disp can be either hex, decimal, or a variable 
    if ( !( kxRegExp.test( kx ) ) ) {
      return 'arguments must be in the form of "k,disp[Ra]", negative integers not allowed for k argument';
    }
    var splat = kx.split( ',' );
    var k = splat[0];
    var disp = splat[1].split( '[' )[0];

    if ( ! isValidNumberBit( k ) ) {
      return 'k argument must either be a decimal, hex, or, binary value between 0 and 15, negative integers not allowed';
    }

    if ( isValidNumber( disp ) ) {
      return true;
    } else if ( Object.keys( labels ).includes( disp ) ) {
      return true;
    } else {
      return 'disp argument must either be a decimal, hex, binary, or, an initailised label';
    }
  }

  function checkRXCommand( rx, labels ) {
    // check that rx is in the form of rd,disp[ra], where disp can be either hex, decimal, or a variable 
    if ( !( rxRegExp.test( rx ) ) ) {
      return 'arguments must be in the form of "Rd,disp[Ra]"';
    }
    var disp = rx.split( ',' )[1].split( '[' )[0];

    if ( isValidNumber( disp ) ) {
      return true;
    } else if ( Object.keys( labels ).includes( disp ) ) {
      return true;
    } else {
      return 'disp argument must either be a decimal, a hex, binary, or, an initailised label';
    }
  }

  function checkXCommand( x ) {
    // check that x is a number, either hex, binary, or, decimal
    const xsplit = x.split( ',' );
    for ( var i = 0; i < xsplit.length; i++ ) {
      var xtest = xsplit[i];

      if ( !( xRegExp.test( xtest ) ) ) {
        return 'arguments must be in the form of "constant" up to 65535 and down to -32768';
      }

      if ( !( isValidNumber( xtest ) ) ) {
        return 'data must be followed by either a decimal or hex number <= 65535 and >=-32768';
      }
    }
    return true;
  }

  function checkNOexpCommand( no ) {
    // doesnt matter the arguments, NOexp commands evaluate in the same way
    return true;
  }

  function checkRRXexpCommand( rrx ) {
    // check that rrx is in the form of re,rf,disp[rd], where disp can be either hex, or a decimal integer 
    if ( !( rrxRegExp.test( rrx ) ) ) {
      return 'arguments must be in the form of "Re,Rf,disp[Rd]", negative integers not allowed';
    }
    var disp = rrx.split( ',' )[2].split( '[' )[0];

    if ( isValidNumberGH( disp ) ) {
      return true;
    } else {
      return 'disp argument must either be a decimal, hex, or, binary with decimal values between 0 and 255';
    }
  }

  function checkRCexpCommand( rc ) {
    // check that rc is in the form of rd,controlRegister, where controlRegister can be pc, ir, or adr
    if ( !( rcRegExp.test( rc ) ) ) {
      return 'arguments must be in the form of "Rd,controlRegisterName"';
    }

    return true;
  }

  function checkRRKexpCommand( rrk ) {
    // check that rrk is in the form of re,rf,gh, where gh can be either hex, or a decimal integer between 0 and 15
    if ( !( rrkRegExp.test( rrk ) ) ) {
      return 'arguments must be in the form of "Rd,Re,g", negative integers not allowed';
    }
    var g = rrk.split( ',' )[2];

    if ( ! isValidNumberBit( g ) ) {
      return 'g argument must either be a decimal, hex, or, binary value between 0 and 15';
    }
    return true;
  }

  function checkRKexpCommand( rk ) {
    // check that rk is in the form of rd,g, where g can be either hex, or a decimal integer between 0 and 15
    if ( !( rkRegExp.test( rk ) ) ) {
      return 'arguments must be in the form of "Rd,g", negative integers not allowed';
    }
    var g = rk.split( ',' )[1];

    if ( ! isValidNumberBit( g ) ) {
      return 'g argument must either be a decimal, hex, or, binary value between 0 and 15';
    }
    return true;
  }

  function checkRKKexpCommand( rkk ) {
    // check that rrk is in the form of rd,g,h where g and h can be either hex, or a decimal integer between 0 and 15
    if ( !( rkkRegExp.test( rkk ) ) ) {
      return 'arguments must be in the form of "Rd,g,h", negative integers not allowed';
    }
    var g = rkk.split( ',' )[1];
    var h = rkk.split( ',' )[2];

    if ( ! isValidNumberBit( g ) ) {
      return 'g argument must either be a decimal, hex, or, binary value between 0 and 15';
    }
    if ( ! isValidNumberBit( h ) ) {
      return 'h argument must either be a decimal, hex, or, binary value between 0 and 15';
    }
    return true;
  }

  function checkRRKKexpCommand( rrkk ) {
    // check that rrkk is in the form of rd,re,g,h, where g and h can be either hex, or a decimal integer between 0 and 15
    if ( !( rrkkRegExp.test( rrkk ) ) ) {
      return 'arguments must be in the form of "Rd,Re,g,h", negative integers not allowed';
    }
    var splat = rrkk.split( ',' );
    var g = splat[2];
    var h = splat[3];

    if ( ! isValidNumberBit( g ) ) {
      return 'g argument must either be a decimal, hex, or, binary value between 0 and 15, negative integers not allowed';
    }
    if ( ! isValidNumberBit( h ) ) {
      return 'h argument must either be a decimal, hex, or, binary value between 0 and 15, negative integers not allowed';
    }
    return true;
  }

  function checkRRRKKexpCommand( rrrkk ) {
    // check that rrrkk is in the form of rd,re,rf,g,h, where g and h can be either hex, or a decimal integer between 0 and 15
    if ( !( rrrkkRegExp.test( rrrkk ) ) ) {
      return 'arguments must be in the form of "Rd,Re,Rf,g,h", negative integers not allowed';
    }
    var splat = rrrkk.split( ',' );
    var g = splat[3];
    var h = splat[4];

    if ( ! isValidNumberBit( g ) ) {
      return 'g argument must either be a decimal, hex, or, binary value between 0 and 15, negative integers not allowed';
    }
    if ( ! isValidNumberBit( h ) ) {
      return 'h argument must either be a decimal, hex, or, binary value between 0 and 15, negative integers not allowed';
    }
    return true;
  }

  function checkRRRKexpCommand( rrrk ) {
    // check that rrrk is in the form of rd,re,rf,gh, where gh can be either hex, or a decimal integer between 0 and 255
    if ( !( rrrkRegExp.test( rrrk ) ) ) {
      return 'arguments must be in the form of "Rd,Re,Rf,g", negative integers not allowed';
    }
    var splat = rrrk.split( ',' );
    var g = splat[3];

    if ( ! isValidNumberBit( g ) ) {
      return 'g argument must either be a decimal, hex, or, binary value between 0 and 15, negative integers not allowed';
    }
    return true;
  }

  function checkCommands( command, argument, labels ) {
    var check;
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
          check = command + ' must be followed by 3 registers and a constant in form Rx,Rx,Rx,k';
        }
        break;

      case 'logicAliasRRRK' :
        // first word is an logicAliasRRRK command i.e andb
        if ( argument ) {
          check = checkRRRKexpCommand( argument );
        } else {
          check = command + ' must be followed by 3 registers and a constant in form Rx,Rx,Rx,k';
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

      case 'injectIAlias' :
        // first word is an rrkEXP command i.e shiftl
        if ( argument ) {
          check = checkRKKexpCommand( argument );
        } else {
          check = command + ' must be followed by a register and 2 constants in form Rx,k1,k2';
        }
        break;

      default :
        check = 'not a valid command with known command type';
        break;
    }
    return check;
  }

  function checkLabel( label ) {
    if ( !( /^[a-zA-Z_]/.test( label ) ) ) {
      return 'label must start with an alphabet character';
    }

    if ( label.includes( '$' ) || label.includes( '#' ) ) {
      return 'label must not contain "$" or "#" symbols as these denote constants';
    }

    if ( !( /^\w+$/.test( label ) ) ) {
      return 'label must be made up of purely alphanumerical characters';
    }

    return true;
  }

  export function checkLine( line, labels ) {
    var linesplit = line.split( ';' )[0].trim().split( /\s+/ );
    var error = true;

    if ( linesplit[0] ) {
      // lines isnt empty
      if ( Object.keys( allCommands ).includes( linesplit[0] ) ) {
        // first word is a command
        if ( linesplit.length <= 2 ) {
          error = checkCommands( linesplit[0], linesplit[1], labels ); // will return error is arguments not present so dont have to check
        } else {
          error = 'non-comment after arguments';
        }
      } else {
        // first word is not a command
        if ( /\w/.test( linesplit[0] ) ) {
          // first word is a label
          error = checkLabel( linesplit[0] );

          if ( !( error.length ) ) {
            // label is valid
            if ( linesplit[1] ) {
              // theres more after label
              if ( Object.keys( allCommands ).includes( linesplit[1] ) ) {
                if ( linesplit.length <= 3 ) {
                  error = checkCommands( linesplit[1], linesplit[2], labels );
                } else {
                  error = 'non-comment after arguments';
                }
              } else {
                error = 'not a valid command following label';
              }
            }
          }
          // just a label, therefore allowed and function returns label error check
        }
      }
    }

    // return error, as it woud have updated to error message if probelm, otherwise, will have stayed positive
    return error;
  }

  function checkCommandIsCompatible( command, argument ) {
    var result = {
      warn : '',
      error : ''
    };

    if ( Object.keys( partiallyCompatibleCommands ).includes( command ) ) {
      result['warn'] = partiallyCompatibleCommands[command];
    } else if ( nonCompatibleCommands.includes( command ) ) {
      result['error'] = 'Assembler does not recognise command at all and will return an error';
    } else if ( command === 'data' ) {
      if ( argument && argument.split( ',' ).length > 1 ) {
        result['warn'] = 'Multiple data constants is not supported by the original emulator';
      }
    }
    // else, is fully compatible

    return result;
  }

  function checkLineIsComaptible( line ) {
    var linesplit = line.trim().split( ';' )[0].split( /\s+/ );
    var parsed = {
      warn : '',
      error : ''
    };

    if ( linesplit[0] ) {
      // lines isnt empty
      if ( Object.keys( allCommands ).includes( linesplit[0] ) ) {
        // first word is a command
        parsed = checkCommandIsCompatible( linesplit[0], linesplit[1] ); // will return error is arguments not present so dont have to check
      } else if ( /\w/.test( linesplit[0] ) && linesplit[1] && Object.keys( allCommands ).includes( linesplit[1] ) ) {    
        parsed = checkCommandIsCompatible( linesplit[1], linesplit[2] );
      }
    }

    // return error, as it woud have updated to error message if problem, otherwise, will have stayed positive
    return parsed;
  }

  export function checkCodeIsCompatible( code ) {
    var lines = code.split( '\n' );
    var check;

    var lineWarn = {};
    var lineError = {};

    var compatible = true;

    for ( var i = 0; i < lines.length; i++ ) {
      check = checkLineIsComaptible( lines[i] );

      if ( check['warn'].length ) {
        lineWarn[i + 1] = check;
      } else if ( check['error'].length ) {
        lineError[i + 1] = check;
        compatible = false;
      } 
    }

    return [compatible, lineWarn, lineError];
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

      case 'injectIAlias' :
        result['words'] = 2;
        result['type'] = 'exp4'; // does matter as bitStart and bitEnd are set in g and h fields as 4 bit numbers
        result['op'] = injectIAliasCommands[command][0];
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

    var argumentList = [];

    switch ( allCommands[command] ) {
      case 'rr' :
        argumentList = argument.split( ',' );
        result['a'] = Number( argumentList[0].slice( 1, argumentList[0].length ) );
        result['b'] = Number( argumentList[1].slice( 1, argumentList[1].length ) );
        
        result['d'] = result['a'];
        break;
        
      case 'rrr' :
        argumentList = argument.split( ',' );
        result['d'] = Number( argumentList[0].slice( 1, argumentList[0].length ) );
        result['a'] = Number( argumentList[1].slice( 1, argumentList[1].length ) );
        result['b'] = Number( argumentList[2].slice( 1, argumentList[2].length ) );
        break;
        
      case 'jx' :
        argumentList = argument.split( '[' );
        result['a'] = Number( argumentList[1].slice( 1, argumentList[1].length - 1 ) ); // removes ']' from string
        result['disp'] = readConstant( argumentList[0], labels );

        result['d'] = 0;
        break;
        
      case 'jumpAlias' :
        argumentList = argument.split( '[' );
        result['a'] = Number( argumentList[1].slice( 1, argumentList[1].length - 1 ) ); // removes ']' from string
        result['disp'] = readConstant( argumentList[0], labels );

        result['d'] = jumpAliasCommands[command][1];
        break;
        
      case 'kx' :
        argumentList = argument.split( ',' );
        result['d'] = readConstant( argumentList[0], labels );

        argumentList = argumentList[1].split( '[' );
        result['a'] = Number( argumentList[1].slice( 1, argumentList[1].length - 1 ) ); // removes ']' from string
        result['disp'] = readConstant( argumentList[0], labels );
        break;
        
      case 'rx' :
        argumentList = argument.split( ',' );
        result['d'] = Number( argumentList[0].slice( 1, argumentList[0].length ) );

        argumentList = argumentList[1].split( '[' );
        result['a'] = Number( argumentList[1].slice( 1, argumentList[1].length - 1 ) ); // removes ']' from string
        result['disp'] = readConstant( argumentList[0], labels );
        break;
        
      case 'x' :
        result['disp'] = [];
        const xsplit = argument.split( ',' );

        for ( var i = 0; i < xsplit.length; i++ ) {
          var x = xsplit[i];

          result['disp'].push( readConstant( x, labels ) );
        }
        break;

      case 'noEXP' :
        // no need for argument handling as exp0 takes no arguments
        break;

      case 'rrEXP' :
        // copy of 'rr' case with a and b changed to d and e respectively
        argumentList = argument.split( ',' );
        result['e'] = Number( argumentList[0].slice( 1, argumentList[0].length ) );
        result['f'] = Number( argumentList[1].slice( 1, argumentList[1].length ) );
        break;

      case 'rrxEXP' :
        argumentList = argument.split( ',' );
        result['e'] = Number( argumentList[0].slice( 1, argumentList[0].length ) );
        result['f'] = Number( argumentList[1].slice( 1, argumentList[1].length ) );

        argumentList = argumentList[2].split( '[' );
        result['d'] = Number( argumentList[1].slice( 1, argumentList[1].length - 1 ) ); // removes ']' from string
        result['gh'] = readConstant( argumentList[0], labels );
        break;

      case 'rcEXP' :
        argumentList = argument.split( ',' );
        result['d'] = Number( argumentList[0].slice( 1, argumentList[0].length ) );
        
        switch ( argumentList[1] ) {
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
        argumentList = argument.split( ',' );
        result['d'] = Number( argumentList[0].slice( 1, argumentList[0].length ) );
        result['e'] = Number( argumentList[1].slice( 1, argumentList[1].length ) );
        result['f'] = Number( argumentList[2].slice( 1, argumentList[2].length ) );
        break;

      case 'rrkEXP' :
        argumentList = argument.split( ',' );
        result['d'] = Number( argumentList[0].slice( 1, argumentList[0].length ) );
        result['e'] = Number( argumentList[1].slice( 1, argumentList[1].length ) );
        
        result['g'] = readConstant( argumentList[2], labels );
        break;

      case 'rkEXP' :
        argumentList = argument.split( ',' );
        result['d'] = Number( argumentList[0].slice( 1, argumentList[0].length ) );
        
        result['g'] = readConstant( argumentList[1], labels );
        break;

      case 'rrkkEXP' :
        argumentList = argument.split( ',' );
        result['d'] = Number( argumentList[0].slice( 1, argumentList[0].length ) );
        result['e'] = Number( argumentList[1].slice( 1, argumentList[1].length ) );
        
        result['g'] = readConstant( argumentList[2], labels );
        result['h'] = readConstant( argumentList[3], labels );
        break;

      case 'rrrkkEXP' :
        argumentList = argument.split( ',' );
        result['d'] = Number( argumentList[0].slice( 1, argumentList[0].length ) );
        result['e'] = Number( argumentList[1].slice( 1, argumentList[1].length ) );
        result['f'] = Number( argumentList[2].slice( 1, argumentList[2].length ) );
        
        result['g'] = readConstant( argumentList[3], labels );
        result['h'] = readConstant( argumentList[4], labels );
        break;

      case 'rrrkEXP' :
        argumentList = argument.split( ',' );
        result['d'] = Number( argumentList[0].slice( 1, argumentList[0].length ) );
        result['e'] = Number( argumentList[1].slice( 1, argumentList[1].length ) );
        result['f'] = Number( argumentList[2].slice( 1, argumentList[2].length ) );
        
        result['g'] = readConstant( argumentList[3], labels );
        break;

      case 'logicAliasRRRK' :
        argumentList = argument.split( ',' );
        result['d'] = Number( argumentList[0].slice( 1, argumentList[0].length ) );
        result['e'] = Number( argumentList[1].slice( 1, argumentList[1].length ) );
        result['f'] = Number( argumentList[2].slice( 1, argumentList[2].length ) );
        
        result['g'] = logicAliasRRRKCommands[command][1];
        result['h'] = readConstant( argumentList[3], labels );
        break;

      case 'logicAliasRRK' :
        argumentList = argument.split( ',' );
        result['d'] = Number( argumentList[0].slice( 1, argumentList[0].length ) );
        result['e'] = Number( argumentList[1].slice( 1, argumentList[1].length ) );
        
        result['g'] = logicAliasRRKCommands[command][1];
        result['h'] = readConstant( argumentList[2], labels );
        break;

      case 'logicAliasRRR' :
        argumentList = argument.split( ',' );
        result['d'] = Number( argumentList[0].slice( 1, argumentList[0].length ) );
        result['e'] = Number( argumentList[1].slice( 1, argumentList[1].length ) );
        result['f'] = Number( argumentList[2].slice( 1, argumentList[2].length ) );
        
        result['g'] = logicAliasRRRCommands[command][1];
        break;

      case 'logicAliasRR' :
        argumentList = argument.split( ',' );
        result['d'] = Number( argumentList[0].slice( 1, argumentList[0].length ) );
        result['e'] = Number( argumentList[1].slice( 1, argumentList[1].length ) );
        
        result['g'] = logicAliasRRCommands[command][1];
        break;

      case 'injectIAlias' :
        argumentList = argument.split( ',' );
        result['d'] = Number( argumentList[0].slice( 1, argumentList[0].length ) );
        
        result['e'] = injectIAliasCommands[command][1];
        result['f'] = injectIAliasCommands[command][2];
        
        result['g'] = readConstant( argumentList[1], labels );
        result['h'] = readConstant( argumentList[2], labels );
        break;

      default :
        break;
    }

    return result;
  }

  function generateMachineCode( command, argument, labels ) {
    var result = [];

    var commandInfo = findInstuctionInfo( command, argument );
    var argumentInfo = findArgumentInfo( command, argument, labels );

    switch ( commandInfo['type'] ) {
      case 'rrr' :
        result.push( commandInfo['op']*firstColumn + argumentInfo['d']*secondColumn + argumentInfo['a']*thirdColumn + argumentInfo['b']*fourthColumn );
        break;

      case 'rx' :
        result.push( 0xf*firstColumn + argumentInfo['d']*secondColumn + argumentInfo['a']*thirdColumn + commandInfo['op']*fourthColumn );

        result.push( argumentInfo['disp'] );
        break;

      case 'x' :
        for ( var i = 0; i < argumentInfo['disp'].length; i++ ) {
          result.push( argumentInfo['disp'][i] );
        }
        break;

      case 'exp0' :
        result.push( 0xe*firstColumn + argumentInfo['d']*secondColumn + commandInfo['op']*fourthColumn );
        break;

      case 'exp4' :
        result.push( 0xe*firstColumn + argumentInfo['d']*secondColumn + commandInfo['op']*fourthColumn );
        
        result.push( argumentInfo['e']*firstColumn + argumentInfo['f']*secondColumn + argumentInfo['g']*thirdColumn + argumentInfo['h']*fourthColumn );
        break;

      case 'exp8' :
        result.push( 0xe*firstColumn + argumentInfo['d']*secondColumn + commandInfo['op']*fourthColumn );
        
        result.push( argumentInfo['e']*firstColumn + argumentInfo['f']*secondColumn + argumentInfo['gh']*fourthColumn );
        break;

      default :
        break;
    }

    return result;
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
    var machineCode;

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

  function findLineInfo( line ) {
    var linesplit = line.trim().split( ';' )[0].split( /\s+/ );
    var lineResult = {
      label : ' ',
      command : '',
      argument : '',
      comment : ''
    };

    if ( line.includes( ';' ) ) lineResult['comment'] = ';' + line.trim().split( ';' )[1];

    if ( linesplit[0] && linesplit[0] !== '' ) {
      // lines isnt empty
      if ( Object.keys( allCommands ).includes( linesplit[0] ) ) {
        // first word is a command
        lineResult['command'] = linesplit[0];
        lineResult['argument'] = linesplit[1];
      } else {
        // first word is not a command
        if ( /\w/.test( linesplit[0] ) ) {
          // first word is a label
          lineResult['label'] = linesplit[0] + ' ';
          if ( linesplit[1] ) {
            // theres more after label
            if ( Object.keys( allCommands ).includes( linesplit[1] ) ) {
              lineResult['command'] = linesplit[1];
              lineResult['argument'] = linesplit[2];
            }
          } else {
            // is just a label
            lineResult['label'] = linesplit[0] + ' ';
          }
        }
      }
    }

    return lineResult;
  }

  function infoToLine( lineResult ) {
    var line = lineResult['label'];

    var argumentList = [];

    if ( lineResult['command'].length ) {
      line += lineResult['command'] + ' ';

      switch ( allCommands[lineResult['command']] ) {
        case 'rr' :
          argumentList = lineResult['argument'].split( ',' );
          line += 'R' + argumentList[0].slice( 1, argumentList[0].length );
          line += ',';
          line += 'R' + argumentList[1].slice( 1, argumentList[1].length );
          break;
          
        case 'rrr' :
          argumentList = lineResult['argument'].split( ',' );
          line += 'R' + argumentList[0].slice( 1, argumentList[0].length );
          line += ',';
          line += 'R' + argumentList[1].slice( 1, argumentList[1].length );
          line += ',';
          line += 'R' + argumentList[2].slice( 1, argumentList[2].length );
          break;
          
        case 'jx' :
          argumentList = lineResult['argument'].split( '[' );
          line += readCompatibleConstant( argumentList[0] );
          line += '[';
          line += 'R' + argumentList[1].slice( 1, argumentList[1].length );
          break;
          
        case 'jumpAlias' :
          argumentList = lineResult['argument'].split( '[' );
          line += readCompatibleConstant( argumentList[0] );
          line += '[';
          line += 'R' + argumentList[1].slice( 1, argumentList[1].length );
          break;
          
        case 'kx' :
          argumentList = lineResult['argument'].split( ',' );
          line += argumentList[0];
          line += ',';

          argumentList = argumentList[1].split( '[' );
          line += readCompatibleConstant( argumentList[0] );
          line += '[';
          line += 'R' + argumentList[1].slice( 1, argumentList[1].length );
          break;
          
        case 'rx' :
          argumentList = lineResult['argument'].split( ',' );
          line += 'R' + argumentList[0].slice( 1, argumentList[0].length );
          line += ',';

          argumentList = argumentList[1].split( '[' );
          line += readCompatibleConstant( argumentList[0] );
          line += '[';
          line += 'R' + argumentList[1].slice( 1, argumentList[1].length );
          break;
          
        case 'x' :
          const splat = lineResult['argument'].split( ',' );
          for ( var i = 0; i < splat.length; i++ ) {
            line += readCompatibleConstant( splat[i] );

            if ( i !== splat.length - 1 ) {
              line += lineResult['comment'];
              line += '\n';
              line += ' ' + lineResult['command'] + ' ';
            }
          }
          break;

        case 'noEXP' :
          // no need for lineResult['argument'] handling as exp0 takes no arguments
          break;

        case 'rrEXP' :
          // copy of 'rr' case with a and b changed to d and e respectively
          argumentList = lineResult['argument'].split( ',' );
          line += 'R' + argumentList[0].slice( 1, argumentList[0].length );
          line += ',';
          line += 'R' + argumentList[1].slice( 1, argumentList[1].length );
          break;

        case 'rrxEXP' :
          argumentList = lineResult['argument'].split( ',' );
          line += 'R' + argumentList[0].slice( 1, argumentList[0].length );
          line += ',';
          line += 'R' + argumentList[1].slice( 1, argumentList[1].length );
          line += ',';

          argumentList = argumentList[2].split( '[' );
          line += readCompatibleConstant( argumentList[0] );
          line += '[';
          line += 'R' + argumentList[1].slice( 1, argumentList[1].length );
          break;

        case 'rcEXP' :
          argumentList = lineResult['argument'].split( ',' );
          line += 'R' + argumentList[0].slice( 1, argumentList[0].length );
          line += ',';
          line += argumentList[1];
          break;

        case 'rrrEXP' :
          // copy of 'rrr' case with d, a, and b changed to d, e, and f respectively
          argumentList = lineResult['argument'].split( ',' );
          line += 'R' + argumentList[0].slice( 1, argumentList[0].length );
          line += ',';
          line += 'R' + argumentList[1].slice( 1, argumentList[1].length );
          line += ',';
          line += 'R' + argumentList[2].slice( 1, argumentList[2].length );
          break;

        case 'rrkEXP' :
          argumentList = lineResult['argument'].split( ',' );
          line += 'R' + argumentList[0].slice( 1, argumentList[0].length );
          line += ',';
          line += 'R' + argumentList[1].slice( 1, argumentList[1].length );
          line += ',';
          line += readCompatibleConstant( argumentList[2] );
          break;

        case 'rkEXP' :
          argumentList = lineResult['argument'].split( ',' );
          line += 'R' + argumentList[0].slice( 1, argumentList[0].length );
          line += ',';
          line += readCompatibleConstant( argumentList[1] );
          break;

        case 'rrkkEXP' :
          argumentList = lineResult['argument'].split( ',' );
          line += 'R' + argumentList[0].slice( 1, argumentList[0].length );
          line += ',';
          line += 'R' + argumentList[1].slice( 1, argumentList[1].length );
          line += ',';
          line += readCompatibleConstant( argumentList[2] );
          line += ',';
          line += readCompatibleConstant( argumentList[3] );
          break;

        case 'rrrkkEXP' :
          argumentList = lineResult['argument'].split( ',' );
          line += 'R' + argumentList[0].slice( 1, argumentList[0].length );
          line += ',';
          line += 'R' + argumentList[1].slice( 1, argumentList[1].length );
          line += ',';
          line += 'R' + argumentList[2].slice( 1, argumentList[2].length );
          line += ',';
          line += readCompatibleConstant( argumentList[3] );
          line += ',';
          line += readCompatibleConstant( argumentList[4] );
          break;

        case 'rrrkEXP' :
          argumentList = lineResult['argument'].split( ',' );
          line += 'R' + argumentList[0].slice( 1, argumentList[0].length );
          line += ',';
          line += 'R' + argumentList[1].slice( 1, argumentList[1].length );
          line += ',';
          line += 'R' + argumentList[2].slice( 1, argumentList[2].length );
          line += ',';
          line += readCompatibleConstant( argumentList[3] );
          break;

        case 'logicAliasRRRK' :
          argumentList = lineResult['argument'].split( ',' );
          line += 'R' + argumentList[0].slice( 1, argumentList[0].length );
          line += ',';
          line += 'R' + argumentList[1].slice( 1, argumentList[1].length );
          line += ',';
          line += 'R' + argumentList[2].slice( 1, argumentList[2].length );
          line += ',';
          line += readCompatibleConstant( argumentList[3] );
          break;

        case 'logicAliasRRK' :
          argumentList = lineResult['argument'].split( ',' );
          line += 'R' + argumentList[0].slice( 1, argumentList[0].length );
          line += ',';
          line += 'R' + argumentList[1].slice( 1, argumentList[1].length );
          line += ',';
          line += readCompatibleConstant( argumentList[2] );
          break;

        case 'logicAliasRRR' :
          argumentList = lineResult['argument'].split( ',' );
          line += 'R' + argumentList[0].slice( 1, argumentList[0].length );
          line += ',';
          line += 'R' + argumentList[1].slice( 1, argumentList[1].length );
          line += ',';
          line += 'R' + argumentList[2].slice( 1, argumentList[2].length );
          break;

        case 'logicAliasRR' :
          argumentList = lineResult['argument'].split( ',' );
          line += 'R' + argumentList[0].slice( 1, argumentList[0].length );
          line += ',';
          line += 'R' + argumentList[1].slice( 1, argumentList[1].length );
          break;

        case 'injectIAlias' :
          argumentList = lineResult['argument'].split( ',' );
          line += 'R' + argumentList[0].slice( 1, argumentList[0].length );
          line += ',';
          line += readCompatibleConstant( argumentList[1] );
          line += ',';
          line += readCompatibleConstant( argumentList[2] );
          break;

        default :
          break;
      }
    }

    line += lineResult['comment'];

    return line;
  }

  export function parseCodeToCompatible( code ) {
    var lines = code.split( '\n' );

    var codeResult = '';

    for ( var i = 0; i < lines.length; i++ ) {
      codeResult += infoToLine( findLineInfo( lines[i] ) ) + '\n';
    }

    return codeResult;
  }

// RUNNING FUNCTIONS
  export function setMemory( machineCode ) {
    var memory = {};

    for ( var i = 0; i < machineCode.length; i++ ) {
      memory[i] = machineCode[i];
    }

    return memory;
  }

  function compareRegisters( RaValue, RbValue, flagDict ) {
    var RaValueSigned = readSignedHex( RaValue );
    var RbValueSigned = readSignedHex( RbValue );

    var signedEquals = false;

    // signed comparisons
    if ( RaValueSigned > RbValueSigned ) {
      flagDict['g'] = 1;
    } else if ( RaValueSigned < RbValueSigned ) {
      flagDict['l'] = 1;
    } else {
      signedEquals = true;
    }
    
    // unsigned comparisons
    if ( RaValue > RbValue ) {
      flagDict['G'] = 1;
    } else if ( RaValue < RbValue ) {
      flagDict['L'] = 1;
    } else if ( signedEquals ) {
      flagDict['E'] = 1;
    }

    return flagDict;
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

    while ( effectiveADR >= 0x10000 ) { effectiveADR -= 0x10000; };

    var jumped = false;

    switch ( Op ) {
      case 0x0 :
        // lea
        registers[Rd] = effectiveADR;
        break;

      case 0x1 :
        // load
        if ( memory[ effectiveADR ] ) {
          registers[Rd] = memory[ effectiveADR ];
        } else {
          registers[Rd] = 0;
        }
        break;

      case 0x2 :
        // store
        memory[ effectiveADR ] = registers[Rd];
        break;

      case 0x3 :
        // jump
        control['pc'] = effectiveADR;
        jumped = true;
        break;

      case 0x4 :
        // jumpc0
        if ( getBitFromRegister( registers[15], Rd ) === 0 ) {
          control['pc'] = effectiveADR;
          jumped = true;
        }

        break;

      case 0x5 :
        // jumpc1
        if ( getBitFromRegister( registers[15], Rd ) > 0 ) {
          control['pc'] = effectiveADR;
          jumped = true;
        }

        break;

      case 0x6 :
        // jumpf
        if ( registers[Rd] === 0 ) {
          control['pc'] = effectiveADR;
          jumped = true;
        }
        break;

      case 0x7 :
        // jumpt
        if ( registers[Rd] === 1 ) {
          control['pc'] = effectiveADR;
          jumped = true;
        }
        break;

      case 0x8 :
        // jal
        registers[Rd] = control['pc'] + 2;
        control['pc'] = effectiveADR;
        jumped = true;
        break;

      case 0x9 :
        // testset
        registers[Rd] = memory[effectiveADR];
        memory[effectiveADR] = 1;

        break;

      default :

        break;
    }
    return { 
      'control' : control,
      'registers' : registers, 
      'memory' : memory,
      'jumped' : jumped
    };
  }

  function processEXPInstruction( control, registers, memory, input, output, Rd, Ra, Rb, adr ) {
    var halted = false;
    var jumped = false;

    var flagDict = getR15Dict();
    var setR15 = false;

    var ab = ( Ra * thirdColumn ) + Rb;

    var Re = Math.floor( adr / firstColumn );
    var Rf = Math.floor( ( adr - ( Re * firstColumn ) ) / secondColumn );

    var gh = Math.floor( adr - ( Rf * secondColumn ) - ( Re * firstColumn ) );

    var g = Math.floor( gh / thirdColumn );
    var h = Math.floor( ( gh - ( g * thirdColumn ) ) / fourthColumn );

    var instructionWords;

    switch ( ab ) {
      case 0x0 :
        // rfi
        instructionWords = 1;
        // currently nop as no interrupt registers to be affected

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
          var validMemorySave = effectiveADRsave + ( iSave - Re );
          if ( validMemorySave >= 0x10000 ) validMemorySave -= 0x10000;
          memory[validMemorySave] = registers[regNoSave];
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

          var validMemoryRestore = effectiveADRrestore + ( iRestore - Re );
          if ( validMemoryRestore >= 0x10000 ) validMemoryRestore -= 0x10000;

          if ( memory[validMemoryRestore] ) {
            registers[regNoRestore] = memory[validMemoryRestore];
          } else {
            registers[regNoRestore] = 0;
          }
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
            jumped = true;
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

        if ( !( registers[Re] === 0xe00c && registers[Rf] === adr ) ) {

          var processed = runFromInstruction( control, registers, memory, input, output, registers[Re], registers[Rf] );

          control = processed['control'];
          registers = processed['registers'];
          memory = processed['memory'];
          input = processed['input'];
          output = processed['output'];
          halted = processed['halted'];
          jumped = processed['jumped'];

          // do not update control registers ir and adr as can make reading executed program confusing
          // control['ir'] = registers[Re];
          // control['adr'] = registers[Rf];

          control['ir'] = 0xe00c;
          control['adr'] = adr;

          setR15 = true;
        } else {
          halted = true;
        }

        break;

      case 0xd :
        // push
        instructionWords = 2;
        if ( registers[Re] < registers[Rf] ) {
          registers[Re] += 1;

          memory[registers[Re]] = registers[Rd];
        } else {
          // stack overflow flag set and nop
          flagDict['S'] = 1;
          setR15 = true;
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
          flagDict['V'] = 1;

          while ( registers[Rd] >= 0x10000 ) { registers[Rd] -= 0x10000; };
        }
        setR15 = true;
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
            const bitToSetAnd = getBitFromRegister( registers[Re] & registers[Rf], h );

            registers[Rd] = setBitInRegister( registers[Rd], bitToSetAnd, h );
            break;

          case 6 :
            // xorb
            const bitToSetXor = getBitFromRegister( registers[Re] ^ registers[Rf], h );

            registers[Rd] = setBitInRegister( registers[Rd], bitToSetXor, h );
            break;

          case 7 :
            // orb
            const bitToSetOr = getBitFromRegister( registers[Re] | registers[Rf], h );

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
        
        const bit = getBitFromRegister( registers[15], g );

        registers[Rd] = bit;

        break;

      case 0x19 :
        // getbiti
        instructionWords = 2;

        const bitI = getBitFromRegister( registers[15], g );

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
        // addc
        instructionWords = 2;

        const R15CarryBit = getBitFromRegister( registers[15], 7 );
        registers[Rd] = registers[Re] + registers[Rf] + R15CarryBit;

        if ( registers[Rd] >= 0x10000 ) {
          registers[Rd] -= 0x10000;
          flagDict['V'] = 1;
          flagDict['C'] = 1;
        }
        
        flagDict = compareRegisters( registers[Rd], registers[0], flagDict );
        setR15 = true;
        break;

      default :
        instructionWords = 1;
        // unrecognised so nop
        break;
    }

    return { 
      'control' : control,
      'registers' : registers, 
      'memory' : memory,
      'input' : input,
      'output' : output,
      'instructionWords' : instructionWords,
      'halted' : halted,
      'jumped' : jumped,
      'flagDict' : flagDict,
      'setR15' : setR15
    };
  }

  function runFromInstruction( control, registers, memory, input, output, instructionIr, instructionADR ) {
    var halted = false;
    var processed = {};

    var jumped = false;

    var instructionWords = 0;

    var Op = Math.floor( instructionIr / firstColumn );
    var Rd = Math.floor( ( instructionIr - ( Op * firstColumn ) ) / secondColumn );
    var Ra = Math.floor( ( instructionIr - ( Rd * secondColumn ) - ( Op * firstColumn ) ) / thirdColumn );
    var Rb = Math.floor( ( instructionIr - ( Ra * thirdColumn ) - ( Rd * secondColumn ) - ( Op * firstColumn ) ) / fourthColumn );

    var RaValue = registers[Ra];
    var RbValue = registers[Rb];

    var flagDict = getR15Dict();
    var setR15 = false;

    control['ir'] = instructionIr;
    control['adr'] = instructionADR;

    switch ( Op ) {
      case 0x0 :
        // add
        instructionWords = 1;
        registers[Rd] = RaValue + RbValue;

        if ( registers[Rd] >= 0x10000 ) {
          registers[Rd] -= 0x10000;
          flagDict['V'] = 1;
          flagDict['C'] = 1;
        }
        
        flagDict = compareRegisters( registers[Rd], registers[0], flagDict );
        setR15 = true;

        break;

      case 0x1 :
        // sub
        instructionWords = 1;

        RaValue = readSignedHex( RaValue );
        RbValue = readSignedHex( RbValue );
        
        registers[Rd] = RaValue;

        if ( RaValue < RbValue ) {
          flagDict['v'] = 1;
        }

        registers[Rd] -= RbValue;
        
        flagDict = compareRegisters( readUnsignedHex( registers[Rd] ), registers[0], flagDict );
        setR15 = true;

        break;

      case 0x2 :
        // mul
        instructionWords = 1;
        registers[Rd] = RaValue * RbValue;

        if ( registers[Rd] >= 0x10000 ) {
          flagDict['V'] = 1;
          while ( registers[Rd] >= 0x10000 ) { registers[Rd] -= 0x10000; };
        }
        
        flagDict = compareRegisters( registers[Rd], registers[0], flagDict );
        setR15 = true;

        break;

      case 0x3 :
        // div
        instructionWords = 1;

        RaValue = readSignedHex( RaValue );
        RbValue = readSignedHex( RbValue );

        if ( RbValue !== 0 ) {
          registers[Rd] = Math.floor( RaValue / RbValue );
          if ( Rd !== 15 ) {
            registers[15] = RaValue % RbValue;
          }
        } else {
          registers[Rd] = RaValue;
          if ( Rd !== 15 ) {
            registers[15] = 0;
          }
        }

        // no flags being set in r15 as div works differently

        break;

      case 0x4 :
        // cmp
        instructionWords = 1;
        flagDict = compareRegisters( RaValue, RbValue, flagDict );
        setR15 = true;

        break;

      case 0x5 :
        // cmplt
        instructionWords = 1;
        ( readSignedHex( RaValue ) < readSignedHex( RbValue ) ) ? registers[Rd] = 1 : registers[Rd] = 0;
        
        break;

      case 0x6 :
        // cmpeq
        instructionWords = 1;
        ( readSignedHex( RaValue ) === readSignedHex( RbValue ) ) ? registers[Rd] = 1 : registers[Rd] = 0;
        break;

      case 0x7 :
        // cmpgt
        instructionWords = 1;
        ( readSignedHex( RaValue ) > readSignedHex( RbValue ) ) ? registers[Rd] = 1 : registers[Rd] = 0;
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
        processed = processTRAPInstruction( control, registers, memory, input, output, Rd, Ra, Rb );

        control = processed['control'];
        registers = processed['registers'];
        memory = processed['memory'];
        input = processed['input'];
        output = processed['output'];

        halted = processed['halted'];

        break;

      case 0xe :
        processed = processEXPInstruction( control, registers, memory, input, output, Rd, Ra, Rb, instructionADR );

        control = processed['control'];
        registers = processed['registers'];
        memory = processed['memory'];
        input = processed['input'];
        output = processed['output'];
        instructionWords = processed['instructionWords'];
        halted = processed['halted'];
        jumped = processed['jumped'];
        flagDict = processed['flagDict'];
        setR15 = processed['setR15'];

        break;

      case 0xf :
        instructionWords = 2;
        processed = processRXInstruction( control, registers, memory, Rd, Ra, Rb, instructionADR );

        control = processed['control'];
        registers = processed['registers'];
        memory = processed['memory'];
        jumped = processed['jumped'];
        
        break;

      default :
        instructionWords = 1;
        halted = true;
        break;
    }

    if ( Rd !== 15 && setR15 ) {
      registers[15] = setR15Flags( flagDict );
    }

    for ( var it = 0; it < 16; it++ ) {
      if ( registers[it] < 0 ) {
        registers[it] = readUnsignedHex( registers[it] );
      }
    }

    // R0 holds constant 0
    registers[0] = 0;

    return {
      'control' : control,
      'registers' : registers,
      'memory' : memory,
      'input' : input,
      'output' : output,
      'halted' : halted,
      'instructionWords' : instructionWords,
      'jumped' : jumped
    };
  }

  export function runMemory( control, registers, memory, input, output ) {
    var instructionIr = memory[control['pc']];
    var instructionADR = 0;
    if ( memory[control['pc'] + 1] && instructionIr >=0xe008 ) instructionADR = memory[control['pc'] + 1]; // 0xe008 as this is the start of the EXP4, EXP8, and, RX commands which are all two words

    // run the ir with adr
    var ran = runFromInstruction( control, registers, memory, input, output, instructionIr, instructionADR );

    control = ran['control'];
    registers = ran['registers'];
    memory = ran['memory'];
    input = ran['input'];
    output = ran['output'];
    var halted = ran['halted'];
    var instructionWords = ran['instructionWords'];
    var jumped = ran['jumped'];

    if ( !jumped ) control['pc'] += instructionWords;

    // checking that happens outwith running that would break the emulator during next execution
    if ( Object.values( registers ).includes( NaN ) || Object.values( registers ).includes( undefined )  ) {
      console.log( control );
      console.log( registers );
      console.log( memory );

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
