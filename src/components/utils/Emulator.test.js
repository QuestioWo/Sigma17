import React from 'react';

import * as Emulator from './Emulator';

const allCommands = ["add", "sub", "mul", "div", "cmp", "cmplt", "cmpeq", "cmpgt", "inv", "and", "or", "xor", "trap", 
                    "lea", "load", "store", "jump", "jumpc0", "jumpc1", "jumpf", "jumpt", "jal", "testset", "jumplt", "jumple", "jumpne", "jumpeq", "jumpge", "jumpgt",
                    "data",
                    "rfi", "save", "restore", "getctl", "putctl", "execute", "push", "pop", "top", "shiftl", "shiftr", "extract", "extracti", "inject", "injecti", "logicw", "logicb", "getbit", "getbiti", "putbit", "putbiti", "field", "andb", "orb", "xorb", "invb", "andnew", "ornew", "xornew", "invnew", "addc"];

const testLabels = { 
  test : 0x0010,
  Test : 0x0011
};

// UTIL FUNCTIONS
  test( 'UTIL readSignedHex', () => {
    expect( Emulator.readSignedHex( 0xffff ) ).toBe( -1 );
    expect( Emulator.readSignedHex( 0x8000 ) ).toBe( -32768 );
    expect( Emulator.readSignedHex( 0x0000 ) ).toBe( 0 );
    expect( Emulator.readSignedHex( 0x7fff ) ).toBe( 32767 );

    expect( Emulator.readSignedHex( 0x1234 ) ).toBe( 4660 );

    expect( Emulator.readSignedHex( 0xedcb ) ).toBe( -4661 );

    // outputs signed when recieving negatives
    expect( Emulator.readUnsignedHex( -1 ) ).toBe( 0xffff );
    expect( Emulator.readUnsignedHex( -32768 ) ).toBe( 0x8000 );
    expect( Emulator.readUnsignedHex( 0 ) ).toBe( 0x0000 );
    expect( Emulator.readUnsignedHex( 32767 ) ).toBe( 0x7fff );

    // out of bounds
    expect( Emulator.readUnsignedHex( 65536 ) ).toBe( 0x10000 );
    expect( Emulator.readUnsignedHex( 65537 ) ).toBe( 0x10000 );
    expect( Emulator.readUnsignedHex( -32769 ) ).toBe( 0x10000 );
  } );

  test( 'UTIL readUnsignedHex', () => {
    expect( Emulator.readUnsignedHex( 0xffff ) ).toBe( 65535 );
    expect( Emulator.readUnsignedHex( 0x8000 ) ).toBe( 32768 );
    expect( Emulator.readUnsignedHex( 0x0000 ) ).toBe( 0 );
    expect( Emulator.readUnsignedHex( 0x7fff ) ).toBe( 32767 );

    expect( Emulator.readUnsignedHex( 0x1234 ) ).toBe( 4660 );

    expect( Emulator.readUnsignedHex( 0xedcb ) ).toBe( 60875 );

    // outputs signed when recieving negatives
    expect( Emulator.readUnsignedHex( -1 ) ).toBe( 0xffff );
    expect( Emulator.readUnsignedHex( -32768 ) ).toBe( 0x8000 );
    expect( Emulator.readUnsignedHex( 0 ) ).toBe( 0x0000 );
    expect( Emulator.readUnsignedHex( 32767 ) ).toBe( 0x7fff );

    // out of bounds
    expect( Emulator.readUnsignedHex( 65536 ) ).toBe( 0x10000 );
    expect( Emulator.readUnsignedHex( 65537 ) ).toBe( 0x10000 );
    expect( Emulator.readUnsignedHex( -32769 ) ).toBe( 0x10000 );
  } );

  test( 'UTIL isValidNumber true' , () => {
    expect( Emulator.isValidNumber( '0' ) ).toBe( true );
    expect( Emulator.isValidNumber( '-1' ) ).toBe( true );
    expect( Emulator.isValidNumber( '-0' ) ).toBe( true );
    expect( Emulator.isValidNumber( '-32768' ) ).toBe( true );
    expect( Emulator.isValidNumber( '65535' ) ).toBe( true );

    expect( Emulator.isValidNumber( '$0' ) ).toBe( true );
    expect( Emulator.isValidNumber( '$ffff' ) ).toBe( true );
    expect( Emulator.isValidNumber( '$8000' ) ).toBe( true );
    expect( Emulator.isValidNumber( '$1' ) ).toBe( true );
    expect( Emulator.isValidNumber( '$0001' ) ).toBe( true );
    expect( Emulator.isValidNumber( '$000001' ) ).toBe( true );
  } );

  test( 'UTIL isValidNumber false' , () => {
    expect( Emulator.isValidNumber( 'blah' ) ).toBe( false );
    expect( Emulator.isValidNumber( '-32769' ) ).toBe( false );
    expect( Emulator.isValidNumber( '65536' ) ).toBe( false );

    expect( Emulator.isValidNumber( '$h' ) ).toBe( false );
    expect( Emulator.isValidNumber( '$10000' ) ).toBe( false );
    expect( Emulator.isValidNumber( '1$8000' ) ).toBe( false );
    expect( Emulator.isValidNumber( '-$1' ) ).toBe( false );
  } );

  test( 'UTIL writeHex', () => {
    expect( Emulator.writeHex( 0xffff ) ).toBe( 'ffff' );
    expect( Emulator.writeHex( 0x7fff ) ).toBe( '7fff' );
    expect( Emulator.writeHex( 0x1 ) ).toBe( '0001' );
    expect( Emulator.writeHex( 0x0 ) ).toBe( '0000' );
    expect( Emulator.writeHex( 0x10000 ) ).toBe( '10000' );
  } );

// CHECK METHODS
  const checkAllCommands = {
    // add : 'rrr', 
    // sub : 'rrr', 
    // mul : 'rrr', 
    // div : 'rrr', 
    // cmplt : 'rrr', 
    // cmpeq : 'rrr', 
    // cmpgt : 'rrr', 
    // and : 'rrr', 
    // or : 'rrr', 
    // xor : 'rrr',
    // trap : 'rrr',

    // cmp : 'rr', 
    // inv : 'rr',

    // lea : 'rx', 
    // load : 'rx', 
    // store : 'rx', 
    // jumpf : 'rx', 
    // jumpt : 'rx', 
    // jal : 'rx', 
    // testset : 'rx',

    // jump : 'jx', 

    // jumpc0 : 'kx', 
    // jumpc1 : 'kx',

    // jumple : 'jumpAlias',
    // jumpne : 'jumpAlias',
    // jumpge : 'jumpAlias',
    // jumpnv : 'jumpAlias',
    // jumpnvu : 'jumpAlias',
    // jumpnco : 'jumpAlias',

    // jumplt : 'jumpAlias',
    // jumpeq : 'jumpAlias',
    // jumpgt : 'jumpAlias',
    // jumpv : 'jumpAlias',
    // jumpvu : 'jumpAlias',
    // jumpco : 'jumpAlias',

    // data : 'x',

    // rfi : 'noEXP',

    // execute : 'rrEXP',

    // save : 'rrxEXP',
    // restore : 'rrxEXP',

    // getctl : 'rcEXP',
    // putctl : 'rcEXP',

    // push : 'rrrEXP',
    // pop : 'rrrEXP',
    // top : 'rrrEXP',
    // addc : 'rrrEXP',

    // shiftl : 'rrkEXP',
    // shiftr : 'rrkEXP',

    // getbit : 'rkEXP',
    // getbiti : 'rkEXP',
    // putbit : 'rkEXP',
    // putbiti : 'rkEXP',

    // field : 'injectIAlias',

    // extract : 'rrkkEXP',
    // extracti : 'rrkkEXP',

    // inject : 'rrrkkEXP',
    // injecti : 'rrrkkEXP',
    // logicb : 'rrrkkEXP',

    // logicw : 'rrrkEXP',

    // andb : 'logicAliasRRRK',
    // orb : 'logicAliasRRRK',
    // xorb : 'logicAliasRRRK',

    // invb : 'logicAliasRRK',

    // andnew : 'logicAliasRRR',
    // ornew : 'logicAliasRRR',
    // xornew : 'logicAliasRRR',

    // invnew : 'logicAliasRR'
  };
  // recognise
    test( 'CHECK recognise-all-commands correct', () => {
      // RR
        expect( Emulator.checkLine( 'inv' ) ).toBe( 'inv must be followed by 2 registers in form Rx,Rx' );
        expect( Emulator.checkLine( 'cmp' ) ).toBe( 'cmp must be followed by 2 registers in form Rx,Rx' );

      // RRR
        expect( Emulator.checkLine( 'add' ) ).toBe( 'add must be followed by 3 registers in form Rx,Rx,Rx' );
        expect( Emulator.checkLine( 'sub' ) ).toBe( 'sub must be followed by 3 registers in form Rx,Rx,Rx' );
        expect( Emulator.checkLine( 'mul' ) ).toBe( 'mul must be followed by 3 registers in form Rx,Rx,Rx' );
        expect( Emulator.checkLine( 'div' ) ).toBe( 'div must be followed by 3 registers in form Rx,Rx,Rx' );
        expect( Emulator.checkLine( 'cmplt' ) ).toBe( 'cmplt must be followed by 3 registers in form Rx,Rx,Rx' );
        expect( Emulator.checkLine( 'cmpeq' ) ).toBe( 'cmpeq must be followed by 3 registers in form Rx,Rx,Rx' );
        expect( Emulator.checkLine( 'cmpgt' ) ).toBe( 'cmpgt must be followed by 3 registers in form Rx,Rx,Rx' );
        expect( Emulator.checkLine( 'and' ) ).toBe( 'and must be followed by 3 registers in form Rx,Rx,Rx' );
        expect( Emulator.checkLine( 'or' ) ).toBe( 'or must be followed by 3 registers in form Rx,Rx,Rx' );
        expect( Emulator.checkLine( 'xor' ) ).toBe( 'xor must be followed by 3 registers in form Rx,Rx,Rx' );
        expect( Emulator.checkLine( 'trap' ) ).toBe( 'trap must be followed by 3 registers in form Rx,Rx,Rx' );

      // RX
        expect( Emulator.checkLine( 'lea' ) ).toBe( 'lea must be followed by arguments in the format of Rd,disp[Ra]' );
        expect( Emulator.checkLine( 'load' ) ).toBe( 'load must be followed by arguments in the format of Rd,disp[Ra]' );
        expect( Emulator.checkLine( 'store' ) ).toBe( 'store must be followed by arguments in the format of Rd,disp[Ra]' );
        expect( Emulator.checkLine( 'jumpf' ) ).toBe( 'jumpf must be followed by arguments in the format of Rd,disp[Ra]' );
        expect( Emulator.checkLine( 'jumpt' ) ).toBe( 'jumpt must be followed by arguments in the format of Rd,disp[Ra]' );
        expect( Emulator.checkLine( 'jal' ) ).toBe( 'jal must be followed by arguments in the format of Rd,disp[Ra]' );
        expect( Emulator.checkLine( 'testset' ) ).toBe( 'testset must be followed by arguments in the format of Rd,disp[Ra]' );

      // JX
        expect( Emulator.checkLine( 'jump' ) ).toBe( 'jump must be followed by arguments in the format of disp[Ra]' );

      // KX
        expect( Emulator.checkLine( 'jumpc0' ) ).toBe( 'jumpc0 must be followed by arguments in the format of k,disp[Ra], where k is a bit' );
        expect( Emulator.checkLine( 'jumpc1' ) ).toBe( 'jumpc1 must be followed by arguments in the format of k,disp[Ra], where k is a bit' );

      // JUMPALIAS
        expect( Emulator.checkLine( 'jumple' ) ).toBe( 'jumple must be followed by arguments in the format of disp[Ra]' );
        expect( Emulator.checkLine( 'jumpne' ) ).toBe( 'jumpne must be followed by arguments in the format of disp[Ra]' );
        expect( Emulator.checkLine( 'jumpge' ) ).toBe( 'jumpge must be followed by arguments in the format of disp[Ra]' );
        expect( Emulator.checkLine( 'jumpnv' ) ).toBe( 'jumpnv must be followed by arguments in the format of disp[Ra]' );
        expect( Emulator.checkLine( 'jumpnvu' ) ).toBe( 'jumpnvu must be followed by arguments in the format of disp[Ra]' );
        expect( Emulator.checkLine( 'jumpnco' ) ).toBe( 'jumpnco must be followed by arguments in the format of disp[Ra]' );

        expect( Emulator.checkLine( 'jumplt' ) ).toBe( 'jumplt must be followed by arguments in the format of disp[Ra]' );
        expect( Emulator.checkLine( 'jumpeq' ) ).toBe( 'jumpeq must be followed by arguments in the format of disp[Ra]' );
        expect( Emulator.checkLine( 'jumpgt' ) ).toBe( 'jumpgt must be followed by arguments in the format of disp[Ra]' );
        expect( Emulator.checkLine( 'jumpv' ) ).toBe( 'jumpv must be followed by arguments in the format of disp[Ra]' );
        expect( Emulator.checkLine( 'jumpvu' ) ).toBe( 'jumpvu must be followed by arguments in the format of disp[Ra]' );
        expect( Emulator.checkLine( 'jumpco' ) ).toBe( 'jumpco must be followed by arguments in the format of disp[Ra]' );

      // X
        expect( Emulator.checkLine( 'data' ) ).toBe( 'data must be followed by a number, either decimal or hex ( preceeded by $ )' );

      // NOEXP
        expect( Emulator.checkLine( 'rfi' ) ).toBe( true );

      // RREXP
        expect( Emulator.checkLine( 'execute' ) ).toBe( 'execute must be followed by 2 registers in form Rx,Rx' );

      // RRXEXP
        expect( Emulator.checkLine( 'save' ) ).toBe( 'save must be followed by 2 registers then a disp in the form of Rx,Rx,disp[Rx]' );
        expect( Emulator.checkLine( 'restore' ) ).toBe( 'restore must be followed by 2 registers then a disp in the form of Rx,Rx,disp[Rx]' );

      // RCEXP
        expect( Emulator.checkLine( 'getctl' ) ).toBe( 'getctl must be followed by a register and a control register in the form Rx,(pc/ir/adr)' );
        expect( Emulator.checkLine( 'putctl' ) ).toBe( 'putctl must be followed by a register and a control register in the form Rx,(pc/ir/adr)' );

      // RRREXP
        expect( Emulator.checkLine( 'push' ) ).toBe( 'push must be followed by 3 registers in form Rx,Rx,Rx' );
        expect( Emulator.checkLine( 'pop' ) ).toBe( 'pop must be followed by 3 registers in form Rx,Rx,Rx' );
        expect( Emulator.checkLine( 'top' ) ).toBe( 'top must be followed by 3 registers in form Rx,Rx,Rx' );
        expect( Emulator.checkLine( 'addc' ) ).toBe( 'addc must be followed by 3 registers in form Rx,Rx,Rx' );

      // RRKEXP
        expect( Emulator.checkLine( 'shiftl' ) ).toBe( 'shiftl must be followed by 2 registers and a constant in form Rx,Rx,k' );
        expect( Emulator.checkLine( 'shiftr' ) ).toBe( 'shiftr must be followed by 2 registers and a constant in form Rx,Rx,k' );

      // RKEXP
        expect( Emulator.checkLine( 'getbit' ) ).toBe( 'getbit must be followed by a register and a constant in form Rx,k' );
        expect( Emulator.checkLine( 'getbiti' ) ).toBe( 'getbiti must be followed by a register and a constant in form Rx,k' );
        expect( Emulator.checkLine( 'putbit' ) ).toBe( 'putbit must be followed by a register and a constant in form Rx,k' );
        expect( Emulator.checkLine( 'putbiti' ) ).toBe( 'putbiti must be followed by a register and a constant in form Rx,k' );

      // injectIAlias
        expect( Emulator.checkLine( 'field' ) ).toBe( 'field must be followed by a register and 2 constants in form Rx,k1,k2' );

      // RRKEXP
        expect( Emulator.checkLine( 'extract' ) ).toBe( 'extract must be followed by 2 registers and 2 constants in form Rx,Rx,k1,k2' );
        expect( Emulator.checkLine( 'extracti' ) ).toBe( 'extracti must be followed by 2 registers and 2 constants in form Rx,Rx,k1,k2' );

      // RRRKKEXP
        expect( Emulator.checkLine( 'inject' ) ).toBe( 'inject must be followed by 3 registers and 2 constants in form Rx,Rx,Rx,k1,k2' );
        expect( Emulator.checkLine( 'injecti' ) ).toBe( 'injecti must be followed by 3 registers and 2 constants in form Rx,Rx,Rx,k1,k2' );
        expect( Emulator.checkLine( 'logicb' ) ).toBe( 'logicb must be followed by 3 registers and 2 constants in form Rx,Rx,Rx,k1,k2' );

      // RRRKEXP
        expect( Emulator.checkLine( 'logicw' ) ).toBe( 'logicw must be followed by 3 registers and a constant in form Rx,Rx,Rx,k' );

      // LOGICALIASRRRK
        expect( Emulator.checkLine( 'andb' ) ).toBe( 'andb must be followed by 3 registers and a constant in form Rx,Rx,Rx,k' );
        expect( Emulator.checkLine( 'orb' ) ).toBe( 'orb must be followed by 3 registers and a constant in form Rx,Rx,Rx,k' );
        expect( Emulator.checkLine( 'xorb' ) ).toBe( 'xorb must be followed by 3 registers and a constant in form Rx,Rx,Rx,k' );

      // LOGICALIASRRK
        expect( Emulator.checkLine( 'invb' ) ).toBe( 'invb must be followed by 2 registers and a constant in form Rx,Rx,k' );

      // LOGICALIASRRR
        expect( Emulator.checkLine( 'andnew' ) ).toBe( 'andnew must be followed by 3 registers in form Rx,Rx,Rx' );
        expect( Emulator.checkLine( 'ornew' ) ).toBe( 'ornew must be followed by 3 registers in form Rx,Rx,Rx' );
        expect( Emulator.checkLine( 'xornew' ) ).toBe( 'xornew must be followed by 3 registers in form Rx,Rx,Rx' );

      // LOGICALIASRR
        expect( Emulator.checkLine( 'invnew' ) ).toBe( 'invnew must be followed by 2 registers in form Rx,Rx' );
    } );

    test( 'CHECK recognise-all-commands incorrect', () => {
      for ( var i = 0; i < allCommands.length; i++ ) {
        expect( Emulator.checkLine( allCommands[i].toUpperCase() + ' R1' ) ).toBe( 'not a valid command following label' );
      }
    } );

  // RR
    test( 'CHECK RR true', () => {
      expect( Emulator.checkLine( 'inv R1,r2' ) ).toBe( true );
      expect( Emulator.checkLine( 'inv R1,R2' ) ).toBe( true );
      expect( Emulator.checkLine( 'inv r1,R2' ) ).toBe( true );

      expect( Emulator.checkLine( ' inv r1,r2' ) ).toBe( true );
      expect( Emulator.checkLine( '     inv r1,r2;comment' ) ).toBe( true );
      expect( Emulator.checkLine( '     inv r1,r2;comment;doublecomment' ) ).toBe( true );
    } );

    test( 'CHECK RR false', () => {
      expect( Emulator.checkLine( 'inv R16,r2' ) ).toBe( 'arguments must be in the form of "Ra,Rb"' );
      expect( Emulator.checkLine( 'inv R-1,R2' ) ).toBe( 'arguments must be in the form of "Ra,Rb"' );
      expect( Emulator.checkLine( 'inv r$f,R2' ) ).toBe( 'arguments must be in the form of "Ra,Rb"' );

      expect( Emulator.checkLine( 'inv R1,r16' ) ).toBe( 'arguments must be in the form of "Ra,Rb"' );
      expect( Emulator.checkLine( 'inv R1,R-1' ) ).toBe( 'arguments must be in the form of "Ra,Rb"' );
      expect( Emulator.checkLine( 'inv r1,R$f' ) ).toBe( 'arguments must be in the form of "Ra,Rb"' );

      expect( Emulator.checkLine( ' inv r1;r2' ) ).toBe( 'arguments must be in the form of "Ra,Rb"' );
      expect( Emulator.checkLine( '     inv r1,r2comment' ) ).toBe( 'arguments must be in the form of "Ra,Rb"' );
      
      expect( Emulator.checkLine( '     inv' ) ).toBe( 'inv must be followed by 2 registers in form Rx,Rx' );
    } );

  // RRR
    test( 'CHECK RRR true', () => {
      expect( Emulator.checkLine( 'add R1,r2,r3' ) ).toBe( true );
      expect( Emulator.checkLine( 'add R1,R2,r3' ) ).toBe( true );
      expect( Emulator.checkLine( 'add r1,R2,R3' ) ).toBe( true );
      expect( Emulator.checkLine( 'add r1,r2,R3' ) ).toBe( true );

      expect( Emulator.checkLine( ' add r1,r2,r3' ) ).toBe( true );
      expect( Emulator.checkLine( '     add r1,r2,r3;comment' ) ).toBe( true );
      expect( Emulator.checkLine( '     add r1,r2,r3;comment;doublecomment' ) ).toBe( true );
    } );

    test( 'CHECK RRR false', () => {
      expect( Emulator.checkLine( 'add R16,r2,r3' ) ).toBe( 'arguments must be in the form of "Rd,Ra,Rb"' );
      expect( Emulator.checkLine( 'add R-1,R2,r3' ) ).toBe( 'arguments must be in the form of "Rd,Ra,Rb"' );
      expect( Emulator.checkLine( 'add r$f,R2,R3' ) ).toBe( 'arguments must be in the form of "Rd,Ra,Rb"' );

      expect( Emulator.checkLine( 'add R1,r2,r16' ) ).toBe( 'arguments must be in the form of "Rd,Ra,Rb"' );
      expect( Emulator.checkLine( 'add R1,R2,r-1' ) ).toBe( 'arguments must be in the form of "Rd,Ra,Rb"' );
      expect( Emulator.checkLine( 'add r1,R2,R$f' ) ).toBe( 'arguments must be in the form of "Rd,Ra,Rb"' );

      expect( Emulator.checkLine( 'add R1,r16,r3' ) ).toBe( 'arguments must be in the form of "Rd,Ra,Rb"' );
      expect( Emulator.checkLine( 'add R1,R-1,r3' ) ).toBe( 'arguments must be in the form of "Rd,Ra,Rb"' );
      expect( Emulator.checkLine( 'add r1,R$f,R3' ) ).toBe( 'arguments must be in the form of "Rd,Ra,Rb"' );

      expect( Emulator.checkLine( ' add r1;r2,r3' ) ).toBe( 'arguments must be in the form of "Rd,Ra,Rb"' );
      expect( Emulator.checkLine( '     add r1,r2,r3comment' ) ).toBe( 'arguments must be in the form of "Rd,Ra,Rb"' );
      
      expect( Emulator.checkLine( '     add' ) ).toBe( 'add must be followed by 3 registers in form Rx,Rx,Rx' );
    } );

  // RX
    test( 'CHECK RX true', () => {
      expect( Emulator.checkLine( 'lea r1,test[r0]', testLabels ) ).toBe( true );
      expect( Emulator.checkLine( 'lea R1,test[R0]', testLabels ) ).toBe( true );
      expect( Emulator.checkLine( 'lea r1,test[R0]', testLabels ) ).toBe( true );
      expect( Emulator.checkLine( 'lea R1,test[r0]', testLabels ) ).toBe( true );

      expect( Emulator.checkLine( 'lea r1,-1[r0]', testLabels ) ).toBe( true );
      expect( Emulator.checkLine( 'lea R1,$ffff[R0]', testLabels ) ).toBe( true );
      expect( Emulator.checkLine( 'lea r1,14[R0]', testLabels ) ).toBe( true );
      expect( Emulator.checkLine( 'lea R1,test[r0]', testLabels ) ).toBe( true );

      expect( Emulator.checkLine( ' lea r1,test[r0]', testLabels ) ).toBe( true );
      expect( Emulator.checkLine( '     lea r1,test[r0];comment', testLabels ) ).toBe( true );
      expect( Emulator.checkLine( '     lea r1,test[r0];comment;doublecomment', testLabels ) ).toBe( true );
    } );

    test( 'CHECK RX false', () => {
      expect( Emulator.checkLine( 'lea test[]', testLabels ) ).toBe( 'arguments must be in the form of "Rd,disp[Ra]"' );
      expect( Emulator.checkLine( 'lea test[r1]', testLabels ) ).toBe( 'arguments must be in the form of "Rd,disp[Ra]"' );
      expect( Emulator.checkLine( 'lea test', testLabels ) ).toBe( 'arguments must be in the form of "Rd,disp[Ra]"' );

      expect( Emulator.checkLine( 'lea r1,test[]', testLabels ) ).toBe( 'arguments must be in the form of "Rd,disp[Ra]"' );
      expect( Emulator.checkLine( 'lea r1,test', testLabels ) ).toBe( 'arguments must be in the form of "Rd,disp[Ra]"' );

      expect( Emulator.checkLine( 'lea r16,test[r0]', testLabels ) ).toBe( 'arguments must be in the form of "Rd,disp[Ra]"' );
      expect( Emulator.checkLine( 'lea r-1,test[r0]', testLabels ) ).toBe( 'arguments must be in the form of "Rd,disp[Ra]"' );
      expect( Emulator.checkLine( 'lea r$f,test[r0]', testLabels ) ).toBe( 'arguments must be in the form of "Rd,disp[Ra]"' );

      expect( Emulator.checkLine( 'lea r1,test[r16]', testLabels ) ).toBe( 'arguments must be in the form of "Rd,disp[Ra]"' );
      expect( Emulator.checkLine( 'lea r1,test[r-1]', testLabels ) ).toBe( 'arguments must be in the form of "Rd,disp[Ra]"' );
      expect( Emulator.checkLine( 'lea r1,test[r$f]', testLabels ) ).toBe( 'arguments must be in the form of "Rd,disp[Ra]"' );

      expect( Emulator.checkLine( 'lea r1,notest[r0]', testLabels ) ).toBe( 'disp argument must either be a decimal, a hex or an initailised label' );
      expect( Emulator.checkLine( 'lea r1,65536[r0]', testLabels ) ).toBe( 'disp argument must either be a decimal, a hex or an initailised label' );
      expect( Emulator.checkLine( 'lea r1,-32769[r0]', testLabels ) ).toBe( 'disp argument must either be a decimal, a hex or an initailised label' );

      expect( Emulator.checkLine( ' lea r1;test[r0]', testLabels ) ).toBe( 'arguments must be in the form of "Rd,disp[Ra]"' );
      expect( Emulator.checkLine( '     lea r1,test[r0]comment', testLabels ) ).toBe( 'arguments must be in the form of "Rd,disp[Ra]"' );
      expect( Emulator.checkLine( '     lea r1,test[r0]comment;doublecomment', testLabels ) ).toBe( 'arguments must be in the form of "Rd,disp[Ra]"' );
    } );

  // JX
    test( 'CHECK JX true', () => {
      expect( Emulator.checkLine( 'jump test[r0]', testLabels ) ).toBe( true );
      expect( Emulator.checkLine( 'jump test[R0]', testLabels ) ).toBe( true );

      expect( Emulator.checkLine( 'jump -1[r0]', testLabels ) ).toBe( true );
      expect( Emulator.checkLine( 'jump $ffff[R0]', testLabels ) ).toBe( true );
      expect( Emulator.checkLine( 'jump 14[R0]', testLabels ) ).toBe( true );
      expect( Emulator.checkLine( 'jump test[r0]', testLabels ) ).toBe( true );

      expect( Emulator.checkLine( ' jump test[r0]', testLabels ) ).toBe( true );
      expect( Emulator.checkLine( '     jump test[r0];comment', testLabels ) ).toBe( true );
      expect( Emulator.checkLine( '     jump test[r0];comment;doublecomment', testLabels ) ).toBe( true );
    } );

    test( 'CHECK JX false', () => {
      expect( Emulator.checkLine( 'jump test[]', testLabels ) ).toBe( 'arguments must be in the form of "disp[Ra]"' );
      expect( Emulator.checkLine( 'jump test', testLabels ) ).toBe( 'arguments must be in the form of "disp[Ra]"' );

      expect( Emulator.checkLine( 'jump test[r16]', testLabels ) ).toBe( 'arguments must be in the form of "disp[Ra]"' );
      expect( Emulator.checkLine( 'jump test[r-1]', testLabels ) ).toBe( 'arguments must be in the form of "disp[Ra]"' );
      expect( Emulator.checkLine( 'jump test[r$f]', testLabels ) ).toBe( 'arguments must be in the form of "disp[Ra]"' );

      expect( Emulator.checkLine( 'jump notest[r0]', testLabels ) ).toBe( 'disp argument must either be a decimal, a hex or an initailised label' );
      expect( Emulator.checkLine( 'jump 65536[r0]', testLabels ) ).toBe( 'disp argument must either be a decimal, a hex or an initailised label' );
      expect( Emulator.checkLine( 'jump -32769[r0]', testLabels ) ).toBe( 'disp argument must either be a decimal, a hex or an initailised label' );

      expect( Emulator.checkLine( ' jump test;[r0]', testLabels ) ).toBe( 'arguments must be in the form of "disp[Ra]"' );
      expect( Emulator.checkLine( '     jump test[r0]comment', testLabels ) ).toBe( 'arguments must be in the form of "disp[Ra]"' );
      expect( Emulator.checkLine( '     jump test[r0]comment;doublecomment', testLabels ) ).toBe( 'arguments must be in the form of "disp[Ra]"' );
    } );

  // KX
    test( 'CHECK KX true', () => {
      expect( Emulator.checkLine( 'jumpc0 1,test[r0]', testLabels ) ).toBe( true );
      expect( Emulator.checkLine( 'jumpc0 1,test[R0]', testLabels ) ).toBe( true );
      expect( Emulator.checkLine( 'jumpc0 1,test[R0]', testLabels ) ).toBe( true );
      expect( Emulator.checkLine( 'jumpc0 1,test[r0]', testLabels ) ).toBe( true );

      expect( Emulator.checkLine( 'jumpc0 0,-1[r0]', testLabels ) ).toBe( true );
      expect( Emulator.checkLine( 'jumpc0 15,$ffff[R0]', testLabels ) ).toBe( true );
      expect( Emulator.checkLine( 'jumpc0 $f,14[R0]', testLabels ) ).toBe( true );
      expect( Emulator.checkLine( 'jumpc0 4,test[r0]', testLabels ) ).toBe( true );

      expect( Emulator.checkLine( ' jumpc0 1,test[r0]', testLabels ) ).toBe( true );
      expect( Emulator.checkLine( '     jumpc0 1,test[r0];comment', testLabels ) ).toBe( true );
      expect( Emulator.checkLine( '     jumpc0 1,test[r0];comment;doublecomment', testLabels ) ).toBe( true );
    } );

    test( 'CHECK KX false', () => {
      expect( Emulator.checkLine( 'jumpc0 test[]', testLabels ) ).toBe( 'arguments must be in the form of "k,disp[Ra]", negative integers not allowed for k argument' );
      expect( Emulator.checkLine( 'jumpc0 test[r1]', testLabels ) ).toBe( 'arguments must be in the form of "k,disp[Ra]", negative integers not allowed for k argument' );
      expect( Emulator.checkLine( 'jumpc0 test', testLabels ) ).toBe( 'arguments must be in the form of "k,disp[Ra]", negative integers not allowed for k argument' );

      expect( Emulator.checkLine( 'jumpc0 1,test[]', testLabels ) ).toBe( 'arguments must be in the form of "k,disp[Ra]", negative integers not allowed for k argument' );
      expect( Emulator.checkLine( 'jumpc0 1,test', testLabels ) ).toBe( 'arguments must be in the form of "k,disp[Ra]", negative integers not allowed for k argument' );

      expect( Emulator.checkLine( 'jumpc0 16,test[r0]', testLabels ) ).toBe( 'k argument must either be a decimal, a hex value between 0 and 15, negative integers not allowed' );
      expect( Emulator.checkLine( 'jumpc0 -1,test[r0]', testLabels ) ).toBe( 'arguments must be in the form of "k,disp[Ra]", negative integers not allowed for k argument' );
      expect( Emulator.checkLine( 'jumpc0 $10,test[r0]', testLabels ) ).toBe( 'k argument must either be a decimal, a hex value between 0 and 15, negative integers not allowed' );

      expect( Emulator.checkLine( 'jumpc0 1,test[r16]', testLabels ) ).toBe( 'arguments must be in the form of "k,disp[Ra]", negative integers not allowed for k argument' );
      expect( Emulator.checkLine( 'jumpc0 1,test[r-1]', testLabels ) ).toBe( 'arguments must be in the form of "k,disp[Ra]", negative integers not allowed for k argument' );
      expect( Emulator.checkLine( 'jumpc0 1,test[r$f]', testLabels ) ).toBe( 'arguments must be in the form of "k,disp[Ra]", negative integers not allowed for k argument' );

      expect( Emulator.checkLine( 'jumpc0 1,notest[r0]', testLabels ) ).toBe( 'disp argument must either be a decimal, a hex or an initailised label' );
      expect( Emulator.checkLine( 'jumpc0 1,65536[r0]', testLabels ) ).toBe( 'disp argument must either be a decimal, a hex or an initailised label' );
      expect( Emulator.checkLine( 'jumpc0 1,-32769[r0]', testLabels ) ).toBe( 'disp argument must either be a decimal, a hex or an initailised label' );

      expect( Emulator.checkLine( ' jumpc0 1;test[r0]', testLabels ) ).toBe( 'arguments must be in the form of "k,disp[Ra]", negative integers not allowed for k argument' );
      expect( Emulator.checkLine( '     jumpc0 1,test[r0]comment', testLabels ) ).toBe( 'arguments must be in the form of "k,disp[Ra]", negative integers not allowed for k argument' );
      expect( Emulator.checkLine( '     jumpc0 1,test[r0]comment;doublecomment', testLabels ) ).toBe( 'arguments must be in the form of "k,disp[Ra]", negative integers not allowed for k argument' );
    } );

  // JUMPALIAS
    test( 'CHECK JUMPALIAS true', () => {
      expect( Emulator.checkLine( 'jumple test[r0]', testLabels ) ).toBe( true );
      expect( Emulator.checkLine( 'jumple test[R0]', testLabels ) ).toBe( true );

      expect( Emulator.checkLine( 'jumple -1[r0]', testLabels ) ).toBe( true );
      expect( Emulator.checkLine( 'jumple $ffff[R0]', testLabels ) ).toBe( true );
      expect( Emulator.checkLine( 'jumple 14[R0]', testLabels ) ).toBe( true );
      expect( Emulator.checkLine( 'jumple test[r0]', testLabels ) ).toBe( true );

      expect( Emulator.checkLine( ' jumple test[r0]', testLabels ) ).toBe( true );
      expect( Emulator.checkLine( '     jumple test[r0];comment', testLabels ) ).toBe( true );
      expect( Emulator.checkLine( '     jumple test[r0];comment;doublecomment', testLabels ) ).toBe( true );
    } );

    test( 'CHECK JUMPALIAS false', () => {
      expect( Emulator.checkLine( 'jumple test[]', testLabels ) ).toBe( 'arguments must be in the form of "disp[Ra]"' );
      expect( Emulator.checkLine( 'jumple test', testLabels ) ).toBe( 'arguments must be in the form of "disp[Ra]"' );

      expect( Emulator.checkLine( 'jumple test[r16]', testLabels ) ).toBe( 'arguments must be in the form of "disp[Ra]"' );
      expect( Emulator.checkLine( 'jumple test[r-1]', testLabels ) ).toBe( 'arguments must be in the form of "disp[Ra]"' );
      expect( Emulator.checkLine( 'jumple test[r$f]', testLabels ) ).toBe( 'arguments must be in the form of "disp[Ra]"' );

      expect( Emulator.checkLine( 'jumple notest[r0]', testLabels ) ).toBe( 'disp argument must either be a decimal, a hex or an initailised label' );
      expect( Emulator.checkLine( 'jumple 65536[r0]', testLabels ) ).toBe( 'disp argument must either be a decimal, a hex or an initailised label' );
      expect( Emulator.checkLine( 'jumple -32769[r0]', testLabels ) ).toBe( 'disp argument must either be a decimal, a hex or an initailised label' );

      expect( Emulator.checkLine( ' jumple test;[r0]', testLabels ) ).toBe( 'arguments must be in the form of "disp[Ra]"' );
      expect( Emulator.checkLine( '     jumple test[r0]comment', testLabels ) ).toBe( 'arguments must be in the form of "disp[Ra]"' );
      expect( Emulator.checkLine( '     jumple test[r0]comment;doublecomment', testLabels ) ).toBe( 'arguments must be in the form of "disp[Ra]"' );
    } );

  // X
    test( 'CHECK X true', () => {
      expect( Emulator.checkLine( 'data -1' ) ).toBe( true );
      expect( Emulator.checkLine( 'data $ffff' ) ).toBe( true );
      expect( Emulator.checkLine( 'data 14' ) ).toBe( true );
      expect( Emulator.checkLine( 'data $23' ) ).toBe( true );

      expect( Emulator.checkLine( ' data $01' ) ).toBe( true );
      expect( Emulator.checkLine( '     data $01;comment' ) ).toBe( true );
      expect( Emulator.checkLine( '     data $01;comment;doublecomment' ) ).toBe( true );

      expect( Emulator.checkLine( '     data $01comment' ) ).toBe( true );
      expect( Emulator.checkLine( '     data $01comment;doublecomment' ) ).toBe( true );
    } );

    test( 'CHECK X false', () => {
      expect( Emulator.checkLine( 'data $10000' ) ).toBe( 'data must be followed by either a decimal or hex number <= 65535 and >=-32768' );
      expect( Emulator.checkLine( 'data $-12' ) ).toBe( 'arguments must be in the form of "constant" up to 65535 and down to -32768' );
      expect( Emulator.checkLine( 'data 65536' ) ).toBe( 'data must be followed by either a decimal or hex number <= 65535 and >=-32768' );
      expect( Emulator.checkLine( 'data -32769' ) ).toBe( 'data must be followed by either a decimal or hex number <= 65535 and >=-32768' );
    } );

  // NOEXP
    test( 'CHECK NOEXP true', () => {
      expect( Emulator.checkLine( 'rfi' ) ).toBe( true );
      expect( Emulator.checkLine( 'rfi -1' ) ).toBe( true );
      expect( Emulator.checkLine( 'rfi $ffff' ) ).toBe( true );
      expect( Emulator.checkLine( 'rfi 14[r0]' ) ).toBe( true );
      expect( Emulator.checkLine( 'rfi r1,r2' ) ).toBe( true );

      expect( Emulator.checkLine( ' rfi;comment' ) ).toBe( true );
      expect( Emulator.checkLine( ' rfi ;comment' ) ).toBe( true );
      expect( Emulator.checkLine( '     rfi ;comment' ) ).toBe( true );
      expect( Emulator.checkLine( '     rfi ;comment;doublecomment' ) ).toBe( true );
    } );

  // RREXP
    test( 'CHECK RREXP true', () => {
      expect( Emulator.checkLine( 'execute R1,r2' ) ).toBe( true );
      expect( Emulator.checkLine( 'execute R1,R2' ) ).toBe( true );
      expect( Emulator.checkLine( 'execute r1,R2' ) ).toBe( true );

      expect( Emulator.checkLine( ' execute r1,r2' ) ).toBe( true );
      expect( Emulator.checkLine( '     execute r1,r2;comment' ) ).toBe( true );
      expect( Emulator.checkLine( '     execute r1,r2;comment;doublecomment' ) ).toBe( true );
    } );

    test( 'CHECK RREXP false', () => {
      expect( Emulator.checkLine( 'execute R16,r2' ) ).toBe( 'arguments must be in the form of "Ra,Rb"' );
      expect( Emulator.checkLine( 'execute R-1,R2' ) ).toBe( 'arguments must be in the form of "Ra,Rb"' );
      expect( Emulator.checkLine( 'execute r$f,R2' ) ).toBe( 'arguments must be in the form of "Ra,Rb"' );

      expect( Emulator.checkLine( 'execute R1,r16' ) ).toBe( 'arguments must be in the form of "Ra,Rb"' );
      expect( Emulator.checkLine( 'execute R1,R-1' ) ).toBe( 'arguments must be in the form of "Ra,Rb"' );
      expect( Emulator.checkLine( 'execute r1,R$f' ) ).toBe( 'arguments must be in the form of "Ra,Rb"' );

      expect( Emulator.checkLine( ' execute r1;r2' ) ).toBe( 'arguments must be in the form of "Ra,Rb"' );
      expect( Emulator.checkLine( '     execute r1,r2comment' ) ).toBe( 'arguments must be in the form of "Ra,Rb"' );
      
      expect( Emulator.checkLine( '     execute' ) ).toBe( 'execute must be followed by 2 registers in form Rx,Rx' );
    } );

  // RRXEXP
    test( 'CHECK RRXEXP true', () => {
      expect( Emulator.checkLine( 'save r1,r2,$ff[r0]', testLabels ) ).toBe( true );
      expect( Emulator.checkLine( 'save R1,R2,$ff[R0]', testLabels ) ).toBe( true );
      expect( Emulator.checkLine( 'save r1,R2,$ff[R0]', testLabels ) ).toBe( true );
      expect( Emulator.checkLine( 'save R1,r2,$ff[r0]', testLabels ) ).toBe( true );

      expect( Emulator.checkLine( 'save r1,r2,0[r0]', testLabels ) ).toBe( true );
      expect( Emulator.checkLine( 'save R1,r2,$ff[R0]', testLabels ) ).toBe( true );
      expect( Emulator.checkLine( 'save r1,r2,15[R0]', testLabels ) ).toBe( true );
      expect( Emulator.checkLine( 'save R1,r2,255[r0]', testLabels ) ).toBe( true );

      expect( Emulator.checkLine( ' save r1,r2,$ff[r0]', testLabels ) ).toBe( true );
      expect( Emulator.checkLine( '     save r1,r2,$ff[r0];comment', testLabels ) ).toBe( true );
      expect( Emulator.checkLine( '     save r1,r2,$ff[r0];comment;doublecomment', testLabels ) ).toBe( true );
    } );

    test( 'CHECK RRXEXP false', () => {
      expect( Emulator.checkLine( 'save $ff[]', testLabels ) ).toBe( 'arguments must be in the form of "Re,Rf,disp[Rd]", negative integers not allowed' );
      expect( Emulator.checkLine( 'save $ff[r1]', testLabels ) ).toBe( 'arguments must be in the form of "Re,Rf,disp[Rd]", negative integers not allowed' );
      expect( Emulator.checkLine( 'save $ff', testLabels ) ).toBe( 'arguments must be in the form of "Re,Rf,disp[Rd]", negative integers not allowed' );

      expect( Emulator.checkLine( 'save r1,$ff[]', testLabels ) ).toBe( 'arguments must be in the form of "Re,Rf,disp[Rd]", negative integers not allowed' );
      expect( Emulator.checkLine( 'save r1,$ff[r0]', testLabels ) ).toBe( 'arguments must be in the form of "Re,Rf,disp[Rd]", negative integers not allowed' );
      expect( Emulator.checkLine( 'save r1,$ff', testLabels ) ).toBe( 'arguments must be in the form of "Re,Rf,disp[Rd]", negative integers not allowed' );

      expect( Emulator.checkLine( 'save r1,r2,$ff[]', testLabels ) ).toBe( 'arguments must be in the form of "Re,Rf,disp[Rd]", negative integers not allowed' );
      expect( Emulator.checkLine( 'save r1,r2,$ff', testLabels ) ).toBe( 'arguments must be in the form of "Re,Rf,disp[Rd]", negative integers not allowed' );

      expect( Emulator.checkLine( 'save r16,r2,$ff[r0]', testLabels ) ).toBe( 'arguments must be in the form of "Re,Rf,disp[Rd]", negative integers not allowed' );
      expect( Emulator.checkLine( 'save r-1,r2,$ff[r0]', testLabels ) ).toBe( 'arguments must be in the form of "Re,Rf,disp[Rd]", negative integers not allowed' );
      expect( Emulator.checkLine( 'save r$f,r2,$ff[r0]', testLabels ) ).toBe( 'arguments must be in the form of "Re,Rf,disp[Rd]", negative integers not allowed' );

      expect( Emulator.checkLine( 'save r1,r16,$ff[r0]', testLabels ) ).toBe( 'arguments must be in the form of "Re,Rf,disp[Rd]", negative integers not allowed' );
      expect( Emulator.checkLine( 'save r1,r-1,$ff[r0]', testLabels ) ).toBe( 'arguments must be in the form of "Re,Rf,disp[Rd]", negative integers not allowed' );
      expect( Emulator.checkLine( 'save r1,r$f,$ff[r0]', testLabels ) ).toBe( 'arguments must be in the form of "Re,Rf,disp[Rd]", negative integers not allowed' );

      expect( Emulator.checkLine( 'save r1,r2,$ff[r16]', testLabels ) ).toBe( 'arguments must be in the form of "Re,Rf,disp[Rd]", negative integers not allowed' );
      expect( Emulator.checkLine( 'save r1,r2,$ff[r-1]', testLabels ) ).toBe( 'arguments must be in the form of "Re,Rf,disp[Rd]", negative integers not allowed' );
      expect( Emulator.checkLine( 'save r1,r2,$ff[r$f]', testLabels ) ).toBe( 'arguments must be in the form of "Re,Rf,disp[Rd]", negative integers not allowed' );

      expect( Emulator.checkLine( 'save r1,r2,256[r0]', testLabels ) ).toBe( 'disp argument must either be a decimal, or a hex with decimal values between 0 and 255' );
      expect( Emulator.checkLine( 'save r1,r2,-1[r0]', testLabels ) ).toBe( 'arguments must be in the form of "Re,Rf,disp[Rd]", negative integers not allowed' );

      expect( Emulator.checkLine( 'save r1,r2,$100[r0]', testLabels ) ).toBe( 'disp argument must either be a decimal, or a hex with decimal values between 0 and 255' );
      expect( Emulator.checkLine( 'save r1,r2,$-1[r0]', testLabels ) ).toBe( 'arguments must be in the form of "Re,Rf,disp[Rd]", negative integers not allowed' );

      expect( Emulator.checkLine( ' save r1,r2,;$ff[r0]', testLabels ) ).toBe( 'arguments must be in the form of "Re,Rf,disp[Rd]", negative integers not allowed' );
      expect( Emulator.checkLine( '     save r1,r2,$ff[r0]comment', testLabels ) ).toBe( 'arguments must be in the form of "Re,Rf,disp[Rd]", negative integers not allowed' );
      expect( Emulator.checkLine( '     save r1,r2,$ff[r0]comment;doublecomment', testLabels ) ).toBe( 'arguments must be in the form of "Re,Rf,disp[Rd]", negative integers not allowed' );
    } );

  // RCEXP
    test( 'CHECK RCEXP true', () => {
      expect( Emulator.checkLine( 'getctl R1,pc' ) ).toBe( true );
      expect( Emulator.checkLine( 'getctl R1,ir' ) ).toBe( true );
      expect( Emulator.checkLine( 'getctl R1,adr' ) ).toBe( true );

      expect( Emulator.checkLine( 'getctl r1,pc' ) ).toBe( true );
      expect( Emulator.checkLine( 'getctl r1,ir' ) ).toBe( true );
      expect( Emulator.checkLine( 'getctl r1,adr' ) ).toBe( true );

      expect( Emulator.checkLine( ' getctl r1,pc' ) ).toBe( true );
      expect( Emulator.checkLine( '     getctl r1,ir;comment' ) ).toBe( true );
      expect( Emulator.checkLine( '     getctl r1,adr;comment;doublecomment' ) ).toBe( true );
    } );

    test( 'CHECK RCEXP false', () => {
      expect( Emulator.checkLine( 'getctl R16,pc' ) ).toBe( 'arguments must be in the form of "Rd,controlRegisterName"' );
      expect( Emulator.checkLine( 'getctl R-1,pc' ) ).toBe( 'arguments must be in the form of "Rd,controlRegisterName"' );
      expect( Emulator.checkLine( 'getctl r$f,pc' ) ).toBe( 'arguments must be in the form of "Rd,controlRegisterName"' );

      expect( Emulator.checkLine( 'getctl R1,blah' ) ).toBe( 'arguments must be in the form of "Rd,controlRegisterName"' );

      expect( Emulator.checkLine( ' getctl r1;pc' ) ).toBe( 'arguments must be in the form of "Rd,controlRegisterName"' );
      expect( Emulator.checkLine( '     getctl r1,pccomment' ) ).toBe( 'arguments must be in the form of "Rd,controlRegisterName"' );
      
      expect( Emulator.checkLine( '     getctl' ) ).toBe( 'getctl must be followed by a register and a control register in the form Rx,(pc/ir/adr)' );
    } );

  // RRREXP
    test( 'CHECK RRREXP true', () => {
      expect( Emulator.checkLine( 'push R1,r2,r3' ) ).toBe( true );
      expect( Emulator.checkLine( 'push R1,R2,r3' ) ).toBe( true );
      expect( Emulator.checkLine( 'push r1,R2,R3' ) ).toBe( true );
      expect( Emulator.checkLine( 'push r1,r2,R3' ) ).toBe( true );

      expect( Emulator.checkLine( ' push r1,r2,r3' ) ).toBe( true );
      expect( Emulator.checkLine( '     push r1,r2,r3;comment' ) ).toBe( true );
      expect( Emulator.checkLine( '     push r1,r2,r3;comment;doublecomment' ) ).toBe( true );
    } );

    test( 'CHECK RRREXP false', () => {
      expect( Emulator.checkLine( 'push R16,r2,r3' ) ).toBe( 'arguments must be in the form of "Rd,Ra,Rb"' );
      expect( Emulator.checkLine( 'push R-1,R2,r3' ) ).toBe( 'arguments must be in the form of "Rd,Ra,Rb"' );
      expect( Emulator.checkLine( 'push r$f,R2,R3' ) ).toBe( 'arguments must be in the form of "Rd,Ra,Rb"' );

      expect( Emulator.checkLine( 'push R1,r2,r16' ) ).toBe( 'arguments must be in the form of "Rd,Ra,Rb"' );
      expect( Emulator.checkLine( 'push R1,R2,r-1' ) ).toBe( 'arguments must be in the form of "Rd,Ra,Rb"' );
      expect( Emulator.checkLine( 'push r1,R2,R$f' ) ).toBe( 'arguments must be in the form of "Rd,Ra,Rb"' );

      expect( Emulator.checkLine( 'push R1,r16,r3' ) ).toBe( 'arguments must be in the form of "Rd,Ra,Rb"' );
      expect( Emulator.checkLine( 'push R1,R-1,r3' ) ).toBe( 'arguments must be in the form of "Rd,Ra,Rb"' );
      expect( Emulator.checkLine( 'push r1,R$f,R3' ) ).toBe( 'arguments must be in the form of "Rd,Ra,Rb"' );

      expect( Emulator.checkLine( ' push r1;r2,r3' ) ).toBe( 'arguments must be in the form of "Rd,Ra,Rb"' );
      expect( Emulator.checkLine( '     push r1,r2,r3comment' ) ).toBe( 'arguments must be in the form of "Rd,Ra,Rb"' );
      
      expect( Emulator.checkLine( '     push' ) ).toBe( 'push must be followed by 3 registers in form Rx,Rx,Rx' );
    } );

  // RRKEXP
    test( 'CHECK RRKEXP true', () => {
      expect( Emulator.checkLine( 'shiftl R1,R2,0', testLabels ) ).toBe( true );
      expect( Emulator.checkLine( 'shiftl r1,r2,15', testLabels ) ).toBe( true );
      expect( Emulator.checkLine( 'shiftl R1,r2,0', testLabels ) ).toBe( true );
      expect( Emulator.checkLine( 'shiftl r1,R2,15', testLabels ) ).toBe( true );

      expect( Emulator.checkLine( 'shiftl r1,r2,0', testLabels ) ).toBe( true );
      expect( Emulator.checkLine( 'shiftl r1,r2,15', testLabels ) ).toBe( true );
      expect( Emulator.checkLine( 'shiftl r1,r2,$f', testLabels ) ).toBe( true );
      expect( Emulator.checkLine( 'shiftl r1,r2,4', testLabels ) ).toBe( true );

      expect( Emulator.checkLine( ' shiftl r1,r2,1', testLabels ) ).toBe( true );
      expect( Emulator.checkLine( '     shiftl r1,r2,1;comment', testLabels ) ).toBe( true );
      expect( Emulator.checkLine( '     shiftl r1,r2,1;comment;doublecomment', testLabels ) ).toBe( true );
    } );

    test( 'CHECK RRKEXP false', () => {
      expect( Emulator.checkLine( 'shiftl 1', testLabels ) ).toBe( 'arguments must be in the form of "Rd,Re,g", negative integers not allowed' );
      expect( Emulator.checkLine( 'shiftl r2,2', testLabels ) ).toBe( 'arguments must be in the form of "Rd,Re,g", negative integers not allowed' );
      expect( Emulator.checkLine( 'shiftl r1,r2', testLabels ) ).toBe( 'arguments must be in the form of "Rd,Re,g", negative integers not allowed' );

      expect( Emulator.checkLine( 'shiftl r1,r2,16', testLabels ) ).toBe( 'g argument must either be a decimal, or a hex value between 0 and 15' );
      expect( Emulator.checkLine( 'shiftl r1,r2,-1', testLabels ) ).toBe( 'arguments must be in the form of "Rd,Re,g", negative integers not allowed' );
      expect( Emulator.checkLine( 'shiftl r1,r2,$10', testLabels ) ).toBe( 'g argument must either be a decimal, or a hex value between 0 and 15' );

      expect( Emulator.checkLine( 'shiftl r16,r2,1', testLabels ) ).toBe( 'arguments must be in the form of "Rd,Re,g", negative integers not allowed' );
      expect( Emulator.checkLine( 'shiftl r-1,r2,1', testLabels ) ).toBe( 'arguments must be in the form of "Rd,Re,g", negative integers not allowed' );
      expect( Emulator.checkLine( 'shiftl r$f,r2,1', testLabels ) ).toBe( 'arguments must be in the form of "Rd,Re,g", negative integers not allowed' );

      expect( Emulator.checkLine( 'shiftl r1,r16,1', testLabels ) ).toBe( 'arguments must be in the form of "Rd,Re,g", negative integers not allowed' );
      expect( Emulator.checkLine( 'shiftl r1,r-1,1', testLabels ) ).toBe( 'arguments must be in the form of "Rd,Re,g", negative integers not allowed' );
      expect( Emulator.checkLine( 'shiftl r1,r$f,1', testLabels ) ).toBe( 'arguments must be in the form of "Rd,Re,g", negative integers not allowed' );

      expect( Emulator.checkLine( ' shiftl r1,r2;0', testLabels ) ).toBe( 'arguments must be in the form of "Rd,Re,g", negative integers not allowed' );
      expect( Emulator.checkLine( '     shiftl r1,r2;0comment', testLabels ) ).toBe( 'arguments must be in the form of "Rd,Re,g", negative integers not allowed' );
      expect( Emulator.checkLine( '     shiftl r1,r2;0comment;doublecomment', testLabels ) ).toBe( 'arguments must be in the form of "Rd,Re,g", negative integers not allowed' );
    } );

  // RKEXP
    test( 'CHECK RKEXP true', () => {
      expect( Emulator.checkLine( 'getbit R1,0', testLabels ) ).toBe( true );
      expect( Emulator.checkLine( 'getbit r1,15', testLabels ) ).toBe( true );

      expect( Emulator.checkLine( 'getbit r1,0', testLabels ) ).toBe( true );
      expect( Emulator.checkLine( 'getbit r1,15', testLabels ) ).toBe( true );
      expect( Emulator.checkLine( 'getbit r1,$f', testLabels ) ).toBe( true );

      expect( Emulator.checkLine( ' getbit r1,1', testLabels ) ).toBe( true );
      expect( Emulator.checkLine( '     getbit r1,1;comment', testLabels ) ).toBe( true );
      expect( Emulator.checkLine( '     getbit r1,1;comment;doublecomment', testLabels ) ).toBe( true );
    } );

    test( 'CHECK RKEXP false', () => {
      expect( Emulator.checkLine( 'getbit 1', testLabels ) ).toBe( 'arguments must be in the form of "Rd,g", negative integers not allowed' );

      expect( Emulator.checkLine( 'getbit r1,16', testLabels ) ).toBe( 'g argument must either be a decimal, or a hex value between 0 and 15' );
      expect( Emulator.checkLine( 'getbit r1,-1', testLabels ) ).toBe( 'arguments must be in the form of "Rd,g", negative integers not allowed' );
      expect( Emulator.checkLine( 'getbit r1,$10', testLabels ) ).toBe( 'g argument must either be a decimal, or a hex value between 0 and 15' );

      expect( Emulator.checkLine( 'getbit r16,1', testLabels ) ).toBe( 'arguments must be in the form of "Rd,g", negative integers not allowed' );
      expect( Emulator.checkLine( 'getbit r-1,1', testLabels ) ).toBe( 'arguments must be in the form of "Rd,g", negative integers not allowed' );
      expect( Emulator.checkLine( 'getbit r$f,1', testLabels ) ).toBe( 'arguments must be in the form of "Rd,g", negative integers not allowed' );

      expect( Emulator.checkLine( ' getbit r1;0', testLabels ) ).toBe( 'arguments must be in the form of "Rd,g", negative integers not allowed' );
      expect( Emulator.checkLine( '     getbit r1;0comment', testLabels ) ).toBe( 'arguments must be in the form of "Rd,g", negative integers not allowed' );
      expect( Emulator.checkLine( '     getbit r1;0comment;doublecomment', testLabels ) ).toBe( 'arguments must be in the form of "Rd,g", negative integers not allowed' );
    } );

  // INJECTIALIAS
    test( 'CHECK INJECTIALIAS true', () => {
      expect( Emulator.checkLine( 'field R1,0,0', testLabels ) ).toBe( true );
      expect( Emulator.checkLine( 'field r1,0,0', testLabels ) ).toBe( true );

      expect( Emulator.checkLine( 'field r1,15,0', testLabels ) ).toBe( true );
      expect( Emulator.checkLine( 'field r1,$f,0', testLabels ) ).toBe( true );

      expect( Emulator.checkLine( 'field r1,0,15', testLabels ) ).toBe( true );
      expect( Emulator.checkLine( 'field r1,0,$f', testLabels ) ).toBe( true );

      expect( Emulator.checkLine( ' field r1,1,1', testLabels ) ).toBe( true );
      expect( Emulator.checkLine( '     field r1,1,1;comment', testLabels ) ).toBe( true );
      expect( Emulator.checkLine( '     field r1,1,1;comment;doublecomment', testLabels ) ).toBe( true );
    } );

    test( 'CHECK INJECTIALIAS false', () => {
      expect( Emulator.checkLine( 'field 1', testLabels ) ).toBe( 'arguments must be in the form of "Rd,g,h", negative integers not allowed' );
      expect( Emulator.checkLine( 'field 1,1', testLabels ) ).toBe( 'arguments must be in the form of "Rd,g,h", negative integers not allowed' );
      expect( Emulator.checkLine( 'field r1,1', testLabels ) ).toBe( 'arguments must be in the form of "Rd,g,h", negative integers not allowed' );

      expect( Emulator.checkLine( 'field r1,16,0', testLabels ) ).toBe( 'g argument must either be a decimal, or a hex value between 0 and 15' );
      expect( Emulator.checkLine( 'field r1,-1,0', testLabels ) ).toBe( 'arguments must be in the form of "Rd,g,h", negative integers not allowed' );
      expect( Emulator.checkLine( 'field r1,$10,0', testLabels ) ).toBe( 'g argument must either be a decimal, or a hex value between 0 and 15' );

      expect( Emulator.checkLine( 'field r1,0,16', testLabels ) ).toBe( 'h argument must either be a decimal, or a hex value between 0 and 15' );
      expect( Emulator.checkLine( 'field r1,0,-1', testLabels ) ).toBe( 'arguments must be in the form of "Rd,g,h", negative integers not allowed' );
      expect( Emulator.checkLine( 'field r1,0,$10', testLabels ) ).toBe( 'h argument must either be a decimal, or a hex value between 0 and 15' );

      expect( Emulator.checkLine( 'field r16,1,1', testLabels ) ).toBe( 'arguments must be in the form of "Rd,g,h", negative integers not allowed' );
      expect( Emulator.checkLine( 'field r-1,1,1', testLabels ) ).toBe( 'arguments must be in the form of "Rd,g,h", negative integers not allowed' );
      expect( Emulator.checkLine( 'field r$f,1,1', testLabels ) ).toBe( 'arguments must be in the form of "Rd,g,h", negative integers not allowed' );

      expect( Emulator.checkLine( ' field r1,1;0', testLabels ) ).toBe( 'arguments must be in the form of "Rd,g,h", negative integers not allowed' );
      expect( Emulator.checkLine( '     field r1,1;0comment', testLabels ) ).toBe( 'arguments must be in the form of "Rd,g,h", negative integers not allowed' );
      expect( Emulator.checkLine( '     field r1,1;0comment;doublecomment', testLabels ) ).toBe( 'arguments must be in the form of "Rd,g,h", negative integers not allowed' );
    } );

  // RRKKEXP
    test( 'CHECK RRKKEXP true', () => {
      expect( Emulator.checkLine( 'extract R1,r2,0,0' ) ).toBe( true );
      expect( Emulator.checkLine( 'extract R1,R2,0,0' ) ).toBe( true );
      expect( Emulator.checkLine( 'extract r1,R2,0,0' ) ).toBe( true );

      expect( Emulator.checkLine( 'extract R1,R2,15,0' ) ).toBe( true );
      expect( Emulator.checkLine( 'extract r1,R2,$f,0' ) ).toBe( true );

      expect( Emulator.checkLine( 'extract R1,R2,0,15' ) ).toBe( true );
      expect( Emulator.checkLine( 'extract r1,R2,0,$f' ) ).toBe( true );

      expect( Emulator.checkLine( ' extract r1,r2,0,0' ) ).toBe( true );
      expect( Emulator.checkLine( '     extract r1,r2,0,0;comment' ) ).toBe( true );
      expect( Emulator.checkLine( '     extract r1,r2,0,0;comment;doublecomment' ) ).toBe( true );
    } );

    test( 'CHECK RRKKEXP false', () => {
      expect( Emulator.checkLine( 'extract R16,r2,0,0' ) ).toBe( 'arguments must be in the form of "Rd,Re,g,h", negative integers not allowed' );
      expect( Emulator.checkLine( 'extract R-1,R2,0,0' ) ).toBe( 'arguments must be in the form of "Rd,Re,g,h", negative integers not allowed' );
      expect( Emulator.checkLine( 'extract r$f,R2,0,0' ) ).toBe( 'arguments must be in the form of "Rd,Re,g,h", negative integers not allowed' );

      expect( Emulator.checkLine( 'extract R1,r16,0,0' ) ).toBe( 'arguments must be in the form of "Rd,Re,g,h", negative integers not allowed' );
      expect( Emulator.checkLine( 'extract R1,R-1,0,0' ) ).toBe( 'arguments must be in the form of "Rd,Re,g,h", negative integers not allowed' );
      expect( Emulator.checkLine( 'extract r1,R$f,0,0' ) ).toBe( 'arguments must be in the form of "Rd,Re,g,h", negative integers not allowed' );

      expect( Emulator.checkLine( 'extract R1,r1,16,0' ) ).toBe( 'g argument must either be a decimal, or a hex value between 0 and 15, negative integers not allowed' );
      expect( Emulator.checkLine( 'extract R1,r1,$10,0' ) ).toBe( 'g argument must either be a decimal, or a hex value between 0 and 15, negative integers not allowed' );
      expect( Emulator.checkLine( 'extract r1,r1,-1,0' ) ).toBe( 'arguments must be in the form of "Rd,Re,g,h", negative integers not allowed' );

      expect( Emulator.checkLine( 'extract R1,r1,0,16' ) ).toBe( 'h argument must either be a decimal, or a hex value between 0 and 15, negative integers not allowed' );
      expect( Emulator.checkLine( 'extract R1,r1,0,$10' ) ).toBe( 'h argument must either be a decimal, or a hex value between 0 and 15, negative integers not allowed' );
      expect( Emulator.checkLine( 'extract r1,r1,0,-1' ) ).toBe( 'arguments must be in the form of "Rd,Re,g,h", negative integers not allowed' );

      expect( Emulator.checkLine( ' extract r1;r2,0,0' ) ).toBe( 'arguments must be in the form of "Rd,Re,g,h", negative integers not allowed' );
      expect( Emulator.checkLine( '     extract r1,r2,0,0comment' ) ).toBe( 'arguments must be in the form of "Rd,Re,g,h", negative integers not allowed' );
      
      expect( Emulator.checkLine( '     extract' ) ).toBe( 'extract must be followed by 2 registers and 2 constants in form Rx,Rx,k1,k2' );
    } );

  // RRRKKEXP
    test( 'CHECK RRRKKEXP true', () => {
      expect( Emulator.checkLine( 'inject R1,r2,R3,0,0' ) ).toBe( true );
      expect( Emulator.checkLine( 'inject R1,R2,R3,0,0' ) ).toBe( true );
      expect( Emulator.checkLine( 'inject r1,R2,R3,0,0' ) ).toBe( true );
      expect( Emulator.checkLine( 'inject r1,r2,R3,0,0' ) ).toBe( true );
      expect( Emulator.checkLine( 'inject R1,r2,R3,0,0' ) ).toBe( true );

      expect( Emulator.checkLine( 'inject R1,R2,r3,0,0' ) ).toBe( true );
      expect( Emulator.checkLine( 'inject r1,R2,r3,0,0' ) ).toBe( true );

      expect( Emulator.checkLine( 'inject R1,R2,r3,15,0' ) ).toBe( true );
      expect( Emulator.checkLine( 'inject r1,R2,r3,$f,0' ) ).toBe( true );

      expect( Emulator.checkLine( 'inject R1,R2,r3,0,15' ) ).toBe( true );
      expect( Emulator.checkLine( 'inject r1,R2,r3,0,$f' ) ).toBe( true );

      expect( Emulator.checkLine( ' inject r1,r2,r3,0,0' ) ).toBe( true );
      expect( Emulator.checkLine( '     inject r1,r2,r3,0,0;comment' ) ).toBe( true );
      expect( Emulator.checkLine( '     inject r1,r2,r3,0,0;comment;doublecomment' ) ).toBe( true );
    } );

    test( 'CHECK RRRKKEXP false', () => {
      expect( Emulator.checkLine( 'inject R16,r2,r3,0,0' ) ).toBe( 'arguments must be in the form of "Rd,Re,Rf,g,h", negative integers not allowed' );
      expect( Emulator.checkLine( 'inject R-1,R2,r3,0,0' ) ).toBe( 'arguments must be in the form of "Rd,Re,Rf,g,h", negative integers not allowed' );
      expect( Emulator.checkLine( 'inject r$f,R2,r3,0,0' ) ).toBe( 'arguments must be in the form of "Rd,Re,Rf,g,h", negative integers not allowed' );

      expect( Emulator.checkLine( 'inject R1,r16,r3,0,0' ) ).toBe( 'arguments must be in the form of "Rd,Re,Rf,g,h", negative integers not allowed' );
      expect( Emulator.checkLine( 'inject R1,R-1,r3,0,0' ) ).toBe( 'arguments must be in the form of "Rd,Re,Rf,g,h", negative integers not allowed' );
      expect( Emulator.checkLine( 'inject r1,R$f,r3,0,0' ) ).toBe( 'arguments must be in the form of "Rd,Re,Rf,g,h", negative integers not allowed' );

      expect( Emulator.checkLine( 'inject R1,r1,r16,0,0' ) ).toBe( 'arguments must be in the form of "Rd,Re,Rf,g,h", negative integers not allowed' );
      expect( Emulator.checkLine( 'inject R1,R1,r-1,0,0' ) ).toBe( 'arguments must be in the form of "Rd,Re,Rf,g,h", negative integers not allowed' );
      expect( Emulator.checkLine( 'inject r1,R1,r$f,0,0' ) ).toBe( 'arguments must be in the form of "Rd,Re,Rf,g,h", negative integers not allowed' );

      expect( Emulator.checkLine( 'inject R1,r1,r3,16,0' ) ).toBe( 'g argument must either be a decimal, or a hex value between 0 and 15, negative integers not allowed' );
      expect( Emulator.checkLine( 'inject R1,r1,r3,$10,0' ) ).toBe( 'g argument must either be a decimal, or a hex value between 0 and 15, negative integers not allowed' );
      expect( Emulator.checkLine( 'inject r1,r1,r3,-1,0' ) ).toBe( 'arguments must be in the form of "Rd,Re,Rf,g,h", negative integers not allowed' );

      expect( Emulator.checkLine( 'inject R1,r1,r3,0,16' ) ).toBe( 'h argument must either be a decimal, or a hex value between 0 and 15, negative integers not allowed' );
      expect( Emulator.checkLine( 'inject R1,r1,r3,0,$10' ) ).toBe( 'h argument must either be a decimal, or a hex value between 0 and 15, negative integers not allowed' );
      expect( Emulator.checkLine( 'inject r1,r1,r3,0,-1' ) ).toBe( 'arguments must be in the form of "Rd,Re,Rf,g,h", negative integers not allowed' );

      expect( Emulator.checkLine( ' inject r1;r2,r3,0,0' ) ).toBe( 'arguments must be in the form of "Rd,Re,Rf,g,h", negative integers not allowed' );
      expect( Emulator.checkLine( '     inject r1,r2,r3,0,0comment' ) ).toBe( 'arguments must be in the form of "Rd,Re,Rf,g,h", negative integers not allowed' );
      
      expect( Emulator.checkLine( '     inject' ) ).toBe( 'inject must be followed by 3 registers and 2 constants in form Rx,Rx,Rx,k1,k2' );
    } );

  // RRRKEXP
    test( 'CHECK RRRKEXP true', () => {
      expect( Emulator.checkLine( 'logicw R1,r2,R3,0' ) ).toBe( true );
      expect( Emulator.checkLine( 'logicw R1,R2,R3,0' ) ).toBe( true );
      expect( Emulator.checkLine( 'logicw r1,R2,R3,0' ) ).toBe( true );
      expect( Emulator.checkLine( 'logicw r1,r2,R3,0' ) ).toBe( true );
      expect( Emulator.checkLine( 'logicw R1,r2,R3,0' ) ).toBe( true );

      expect( Emulator.checkLine( 'logicw R1,R2,r3,0' ) ).toBe( true );
      expect( Emulator.checkLine( 'logicw r1,R2,r3,0' ) ).toBe( true );

      expect( Emulator.checkLine( 'logicw R1,R2,r3,15' ) ).toBe( true );
      expect( Emulator.checkLine( 'logicw r1,R2,r3,$f' ) ).toBe( true );

      expect( Emulator.checkLine( ' logicw r1,r2,r3,0' ) ).toBe( true );
      expect( Emulator.checkLine( '     logicw r1,r2,r3,0;comment' ) ).toBe( true );
      expect( Emulator.checkLine( '     logicw r1,r2,r3,0;comment;doublecomment' ) ).toBe( true );
    } );

    test( 'CHECK RRRKEXP false', () => {
      expect( Emulator.checkLine( 'logicw R16,r2,r3,0' ) ).toBe( 'arguments must be in the form of "Rd,Re,Rf,g", negative integers not allowed' );
      expect( Emulator.checkLine( 'logicw R-1,R2,r3,0' ) ).toBe( 'arguments must be in the form of "Rd,Re,Rf,g", negative integers not allowed' );
      expect( Emulator.checkLine( 'logicw r$f,R2,r3,0' ) ).toBe( 'arguments must be in the form of "Rd,Re,Rf,g", negative integers not allowed' );

      expect( Emulator.checkLine( 'logicw R1,r16,r3,0' ) ).toBe( 'arguments must be in the form of "Rd,Re,Rf,g", negative integers not allowed' );
      expect( Emulator.checkLine( 'logicw R1,R-1,r3,0' ) ).toBe( 'arguments must be in the form of "Rd,Re,Rf,g", negative integers not allowed' );
      expect( Emulator.checkLine( 'logicw r1,R$f,r3,0' ) ).toBe( 'arguments must be in the form of "Rd,Re,Rf,g", negative integers not allowed' );

      expect( Emulator.checkLine( 'logicw R1,r1,r16,0' ) ).toBe( 'arguments must be in the form of "Rd,Re,Rf,g", negative integers not allowed' );
      expect( Emulator.checkLine( 'logicw R1,R1,r-1,0' ) ).toBe( 'arguments must be in the form of "Rd,Re,Rf,g", negative integers not allowed' );
      expect( Emulator.checkLine( 'logicw r1,R1,r$f,0' ) ).toBe( 'arguments must be in the form of "Rd,Re,Rf,g", negative integers not allowed' );

      expect( Emulator.checkLine( 'logicw R1,r1,r3,16' ) ).toBe( 'g argument must either be a decimal, or a hex value between 0 and 15, negative integers not allowed' );
      expect( Emulator.checkLine( 'logicw R1,r1,r3,$10' ) ).toBe( 'g argument must either be a decimal, or a hex value between 0 and 15, negative integers not allowed' );
      expect( Emulator.checkLine( 'logicw r1,r1,r3,-1' ) ).toBe( 'arguments must be in the form of "Rd,Re,Rf,g", negative integers not allowed' );

      expect( Emulator.checkLine( ' logicw r1;r2,r3,0' ) ).toBe( 'arguments must be in the form of "Rd,Re,Rf,g", negative integers not allowed' );
      expect( Emulator.checkLine( '     logicw r1,r2,r3,0comment' ) ).toBe( 'arguments must be in the form of "Rd,Re,Rf,g", negative integers not allowed' );
      
      expect( Emulator.checkLine( '     logicw' ) ).toBe( 'logicw must be followed by 3 registers and a constant in form Rx,Rx,Rx,k' );
    } );

  // LOGICALIASRRRK
    test( 'CHECK LOGICALIASRRRK true', () => {
      expect( Emulator.checkLine( 'andb R1,r2,R3,0' ) ).toBe( true );
      expect( Emulator.checkLine( 'andb R1,R2,R3,0' ) ).toBe( true );
      expect( Emulator.checkLine( 'andb r1,R2,R3,0' ) ).toBe( true );
      expect( Emulator.checkLine( 'andb r1,r2,R3,0' ) ).toBe( true );
      expect( Emulator.checkLine( 'andb R1,r2,R3,0' ) ).toBe( true );

      expect( Emulator.checkLine( 'andb R1,R2,r3,0' ) ).toBe( true );
      expect( Emulator.checkLine( 'andb r1,R2,r3,0' ) ).toBe( true );

      expect( Emulator.checkLine( 'andb R1,R2,r3,15' ) ).toBe( true );
      expect( Emulator.checkLine( 'andb r1,R2,r3,$f' ) ).toBe( true );

      expect( Emulator.checkLine( ' andb r1,r2,r3,0' ) ).toBe( true );
      expect( Emulator.checkLine( '     andb r1,r2,r3,0;comment' ) ).toBe( true );
      expect( Emulator.checkLine( '     andb r1,r2,r3,0;comment;doublecomment' ) ).toBe( true );
    } );

    test( 'CHECK LOGICALIASRRRK false', () => {
      expect( Emulator.checkLine( 'andb R16,r2,r3,0' ) ).toBe( 'arguments must be in the form of "Rd,Re,Rf,g", negative integers not allowed' );
      expect( Emulator.checkLine( 'andb R-1,R2,r3,0' ) ).toBe( 'arguments must be in the form of "Rd,Re,Rf,g", negative integers not allowed' );
      expect( Emulator.checkLine( 'andb r$f,R2,r3,0' ) ).toBe( 'arguments must be in the form of "Rd,Re,Rf,g", negative integers not allowed' );

      expect( Emulator.checkLine( 'andb R1,r16,r3,0' ) ).toBe( 'arguments must be in the form of "Rd,Re,Rf,g", negative integers not allowed' );
      expect( Emulator.checkLine( 'andb R1,R-1,r3,0' ) ).toBe( 'arguments must be in the form of "Rd,Re,Rf,g", negative integers not allowed' );
      expect( Emulator.checkLine( 'andb r1,R$f,r3,0' ) ).toBe( 'arguments must be in the form of "Rd,Re,Rf,g", negative integers not allowed' );

      expect( Emulator.checkLine( 'andb R1,r1,r16,0' ) ).toBe( 'arguments must be in the form of "Rd,Re,Rf,g", negative integers not allowed' );
      expect( Emulator.checkLine( 'andb R1,R1,r-1,0' ) ).toBe( 'arguments must be in the form of "Rd,Re,Rf,g", negative integers not allowed' );
      expect( Emulator.checkLine( 'andb r1,R1,r$f,0' ) ).toBe( 'arguments must be in the form of "Rd,Re,Rf,g", negative integers not allowed' );

      expect( Emulator.checkLine( 'andb R1,r1,r3,16' ) ).toBe( 'g argument must either be a decimal, or a hex value between 0 and 15, negative integers not allowed' );
      expect( Emulator.checkLine( 'andb R1,r1,r3,$10' ) ).toBe( 'g argument must either be a decimal, or a hex value between 0 and 15, negative integers not allowed' );
      expect( Emulator.checkLine( 'andb r1,r1,r3,-1' ) ).toBe( 'arguments must be in the form of "Rd,Re,Rf,g", negative integers not allowed' );

      expect( Emulator.checkLine( ' andb r1;r2,r3,0' ) ).toBe( 'arguments must be in the form of "Rd,Re,Rf,g", negative integers not allowed' );
      expect( Emulator.checkLine( '     andb r1,r2,r3,0comment' ) ).toBe( 'arguments must be in the form of "Rd,Re,Rf,g", negative integers not allowed' );
      
      expect( Emulator.checkLine( '     andb' ) ).toBe( 'andb must be followed by 3 registers and a constant in form Rx,Rx,Rx,k' );
    } );

  // LOGICALIASRRK
    test( 'CHECK LOGICALIASRRK true', () => {
      expect( Emulator.checkLine( 'invb R1,R2,0', testLabels ) ).toBe( true );
      expect( Emulator.checkLine( 'invb r1,r2,15', testLabels ) ).toBe( true );
      expect( Emulator.checkLine( 'invb R1,r2,0', testLabels ) ).toBe( true );
      expect( Emulator.checkLine( 'invb r1,R2,15', testLabels ) ).toBe( true );

      expect( Emulator.checkLine( 'invb r1,r2,0', testLabels ) ).toBe( true );
      expect( Emulator.checkLine( 'invb r1,r2,15', testLabels ) ).toBe( true );
      expect( Emulator.checkLine( 'invb r1,r2,$f', testLabels ) ).toBe( true );
      expect( Emulator.checkLine( 'invb r1,r2,4', testLabels ) ).toBe( true );

      expect( Emulator.checkLine( ' invb r1,r2,1', testLabels ) ).toBe( true );
      expect( Emulator.checkLine( '     invb r1,r2,1;comment', testLabels ) ).toBe( true );
      expect( Emulator.checkLine( '     invb r1,r2,1;comment;doublecomment', testLabels ) ).toBe( true );
    } );

    test( 'CHECK LOGICALIASRRK false', () => {
      expect( Emulator.checkLine( 'invb 1', testLabels ) ).toBe( 'arguments must be in the form of "Rd,Re,g", negative integers not allowed' );
      expect( Emulator.checkLine( 'invb r2,2', testLabels ) ).toBe( 'arguments must be in the form of "Rd,Re,g", negative integers not allowed' );
      expect( Emulator.checkLine( 'invb r1,r2', testLabels ) ).toBe( 'arguments must be in the form of "Rd,Re,g", negative integers not allowed' );

      expect( Emulator.checkLine( 'invb r1,r2,16', testLabels ) ).toBe( 'g argument must either be a decimal, or a hex value between 0 and 15' );
      expect( Emulator.checkLine( 'invb r1,r2,-1', testLabels ) ).toBe( 'arguments must be in the form of "Rd,Re,g", negative integers not allowed' );
      expect( Emulator.checkLine( 'invb r1,r2,$10', testLabels ) ).toBe( 'g argument must either be a decimal, or a hex value between 0 and 15' );

      expect( Emulator.checkLine( 'invb r16,r2,1', testLabels ) ).toBe( 'arguments must be in the form of "Rd,Re,g", negative integers not allowed' );
      expect( Emulator.checkLine( 'invb r-1,r2,1', testLabels ) ).toBe( 'arguments must be in the form of "Rd,Re,g", negative integers not allowed' );
      expect( Emulator.checkLine( 'invb r$f,r2,1', testLabels ) ).toBe( 'arguments must be in the form of "Rd,Re,g", negative integers not allowed' );

      expect( Emulator.checkLine( 'invb r1,r16,1', testLabels ) ).toBe( 'arguments must be in the form of "Rd,Re,g", negative integers not allowed' );
      expect( Emulator.checkLine( 'invb r1,r-1,1', testLabels ) ).toBe( 'arguments must be in the form of "Rd,Re,g", negative integers not allowed' );
      expect( Emulator.checkLine( 'invb r1,r$f,1', testLabels ) ).toBe( 'arguments must be in the form of "Rd,Re,g", negative integers not allowed' );

      expect( Emulator.checkLine( ' invb r1,r2;0', testLabels ) ).toBe( 'arguments must be in the form of "Rd,Re,g", negative integers not allowed' );
      expect( Emulator.checkLine( '     invb r1,r2;0comment', testLabels ) ).toBe( 'arguments must be in the form of "Rd,Re,g", negative integers not allowed' );
      expect( Emulator.checkLine( '     invb r1,r2;0comment;doublecomment', testLabels ) ).toBe( 'arguments must be in the form of "Rd,Re,g", negative integers not allowed' );
    } );

  // LOGICALIASRRR
    test( 'CHECK LOGICALIASRRR true', () => {
      expect( Emulator.checkLine( 'andnew R1,r2,r3' ) ).toBe( true );
      expect( Emulator.checkLine( 'andnew R1,R2,r3' ) ).toBe( true );
      expect( Emulator.checkLine( 'andnew r1,R2,R3' ) ).toBe( true );
      expect( Emulator.checkLine( 'andnew r1,r2,R3' ) ).toBe( true );

      expect( Emulator.checkLine( ' andnew r1,r2,r3' ) ).toBe( true );
      expect( Emulator.checkLine( '     andnew r1,r2,r3;comment' ) ).toBe( true );
      expect( Emulator.checkLine( '     andnew r1,r2,r3;comment;doublecomment' ) ).toBe( true );
    } );

    test( 'CHECK LOGICALIASRRR false', () => {
      expect( Emulator.checkLine( 'andnew R16,r2,r3' ) ).toBe( 'arguments must be in the form of "Rd,Ra,Rb"' );
      expect( Emulator.checkLine( 'andnew R-1,R2,r3' ) ).toBe( 'arguments must be in the form of "Rd,Ra,Rb"' );
      expect( Emulator.checkLine( 'andnew r$f,R2,R3' ) ).toBe( 'arguments must be in the form of "Rd,Ra,Rb"' );

      expect( Emulator.checkLine( 'andnew R1,r2,r16' ) ).toBe( 'arguments must be in the form of "Rd,Ra,Rb"' );
      expect( Emulator.checkLine( 'andnew R1,R2,r-1' ) ).toBe( 'arguments must be in the form of "Rd,Ra,Rb"' );
      expect( Emulator.checkLine( 'andnew r1,R2,R$f' ) ).toBe( 'arguments must be in the form of "Rd,Ra,Rb"' );

      expect( Emulator.checkLine( 'andnew R1,r16,r3' ) ).toBe( 'arguments must be in the form of "Rd,Ra,Rb"' );
      expect( Emulator.checkLine( 'andnew R1,R-1,r3' ) ).toBe( 'arguments must be in the form of "Rd,Ra,Rb"' );
      expect( Emulator.checkLine( 'andnew r1,R$f,R3' ) ).toBe( 'arguments must be in the form of "Rd,Ra,Rb"' );

      expect( Emulator.checkLine( ' andnew r1;r2,r3' ) ).toBe( 'arguments must be in the form of "Rd,Ra,Rb"' );
      expect( Emulator.checkLine( '     andnew r1,r2,r3comment' ) ).toBe( 'arguments must be in the form of "Rd,Ra,Rb"' );
      
      expect( Emulator.checkLine( '     andnew' ) ).toBe( 'andnew must be followed by 3 registers in form Rx,Rx,Rx' );
    } );

  // LOGICALIASRR
    test( 'CHECK LOGICALIASRR true', () => {
      expect( Emulator.checkLine( 'invnew R1,r2' ) ).toBe( true );
      expect( Emulator.checkLine( 'invnew R1,R2' ) ).toBe( true );
      expect( Emulator.checkLine( 'invnew r1,R2' ) ).toBe( true );

      expect( Emulator.checkLine( ' invnew r1,r2' ) ).toBe( true );
      expect( Emulator.checkLine( '     invnew r1,r2;comment' ) ).toBe( true );
      expect( Emulator.checkLine( '     invnew r1,r2;comment;doublecomment' ) ).toBe( true );
    } );

    test( 'CHECK LOGICALIASRR false', () => {
      expect( Emulator.checkLine( 'invnew R16,r2' ) ).toBe( 'arguments must be in the form of "Ra,Rb"' );
      expect( Emulator.checkLine( 'invnew R-1,R2' ) ).toBe( 'arguments must be in the form of "Ra,Rb"' );
      expect( Emulator.checkLine( 'invnew r$f,R2' ) ).toBe( 'arguments must be in the form of "Ra,Rb"' );

      expect( Emulator.checkLine( 'invnew R1,r16' ) ).toBe( 'arguments must be in the form of "Ra,Rb"' );
      expect( Emulator.checkLine( 'invnew R1,R-1' ) ).toBe( 'arguments must be in the form of "Ra,Rb"' );
      expect( Emulator.checkLine( 'invnew r1,R$f' ) ).toBe( 'arguments must be in the form of "Ra,Rb"' );

      expect( Emulator.checkLine( ' invnew r1;r2' ) ).toBe( 'arguments must be in the form of "Ra,Rb"' );
      expect( Emulator.checkLine( '     invnew r1,r2comment' ) ).toBe( 'arguments must be in the form of "Ra,Rb"' );
      
      expect( Emulator.checkLine( '     invnew' ) ).toBe( 'invnew must be followed by 2 registers in form Rx,Rx' );
    } );






