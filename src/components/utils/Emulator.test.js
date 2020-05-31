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
  // READSIGNEDHEX
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

  // READUNSIGNEDHEX
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

  // ISVALIDNUMBER
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

  // WRITEHEX
    test( 'UTIL writeHex', () => {
      expect( Emulator.writeHex( 0xffff ) ).toBe( 'ffff' );
      expect( Emulator.writeHex( 0x7fff ) ).toBe( '7fff' );
      expect( Emulator.writeHex( 0x1 ) ).toBe( '0001' );
      expect( Emulator.writeHex( 0x0 ) ).toBe( '0000' );
      expect( Emulator.writeHex( 0x10000 ) ).toBe( '10000' );
    } );

// CHECK METHODS
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

// PARSE METHODS
  // label recognition
    test( 'PARSE label recognise', () => {
      expect( Emulator.parseLineForLabels( 'label data 3' ) ).toStrictEqual( { 'label' : 'label', 'justLabel' : false, 'instructionWords' : 1 } );
      expect( Emulator.parseLineForLabels( 'label load r1,label2[r0]' ) ).toStrictEqual( { 'label' : 'label', 'justLabel' : false, 'instructionWords' : 2 } );
      expect( Emulator.parseLineForLabels( 'label' ) ).toStrictEqual( {'label' : 'label', 'justLabel' : true, 'instructionWords' : 1} );
      expect( Emulator.parseLineForLabels( 'label ' ) ).toStrictEqual( {'label' : 'label', 'justLabel' : true, 'instructionWords' : 1} );
    } );

  // RR
    // INV
      test( 'PARSE RR inv', () => {
        expect( Emulator.parseLineForMachineCode( 'inv r1,r2', testLabels ) ).toStrictEqual( [ 0x8112, 65536 ] );
        expect( Emulator.parseLineForMachineCode( 'inv R1,R2', testLabels ) ).toStrictEqual( [ 0x8112, 65536 ] );
      } );

    // CMP
      test( 'PARSE RR cmp', () => {
        expect( Emulator.parseLineForMachineCode( 'cmp r1,r2', testLabels ) ).toStrictEqual( [ 0x4112, 65536 ] );
        expect( Emulator.parseLineForMachineCode( 'cmp R1,R2', testLabels ) ).toStrictEqual( [ 0x4112, 65536 ] );
      } );

  // RRR
    // ADD
      test( 'PARSE RRR add', () => {
        expect( Emulator.parseLineForMachineCode( 'add r1,r2,r3', testLabels ) ).toStrictEqual( [ 0x0123, 65536 ] );
        expect( Emulator.parseLineForMachineCode( 'add R1,R2,R3', testLabels ) ).toStrictEqual( [ 0x0123, 65536 ] );
      } );

    // SUB
      test( 'PARSE RRR sub', () => {
        expect( Emulator.parseLineForMachineCode( 'sub r1,r2,r3', testLabels ) ).toStrictEqual( [ 0x1123, 65536 ] );
        expect( Emulator.parseLineForMachineCode( 'sub R1,R2,R3', testLabels ) ).toStrictEqual( [ 0x1123, 65536 ] );
      } );

    // MUL
      test( 'PARSE RRR mul', () => {
        expect( Emulator.parseLineForMachineCode( 'mul r1,r2,r3', testLabels ) ).toStrictEqual( [ 0x2123, 65536 ] );
        expect( Emulator.parseLineForMachineCode( 'mul R1,R2,R3', testLabels ) ).toStrictEqual( [ 0x2123, 65536 ] );
      } );

    // DIV
      test( 'PARSE RRR div', () => {
        expect( Emulator.parseLineForMachineCode( 'div r1,r2,r3', testLabels ) ).toStrictEqual( [ 0x3123, 65536 ] );
        expect( Emulator.parseLineForMachineCode( 'div R1,R2,R3', testLabels ) ).toStrictEqual( [ 0x3123, 65536 ] );
      } );

    // CMPLT
      test( 'PARSE RRR cmplt', () => {
        expect( Emulator.parseLineForMachineCode( 'cmplt r1,r2,r3', testLabels ) ).toStrictEqual( [ 0x5123, 65536 ] );
        expect( Emulator.parseLineForMachineCode( 'cmplt R1,R2,R3', testLabels ) ).toStrictEqual( [ 0x5123, 65536 ] );
      } );

    // CMPEQ
      test( 'PARSE RRR cmpeq', () => {
        expect( Emulator.parseLineForMachineCode( 'cmpeq r1,r2,r3', testLabels ) ).toStrictEqual( [ 0x6123, 65536 ] );
        expect( Emulator.parseLineForMachineCode( 'cmpeq R1,R2,R3', testLabels ) ).toStrictEqual( [ 0x6123, 65536 ] );
      } );

    // CMPGT
      test( 'PARSE RRR cmpgt', () => {
        expect( Emulator.parseLineForMachineCode( 'cmpgt r1,r2,r3', testLabels ) ).toStrictEqual( [ 0x7123, 65536 ] );
        expect( Emulator.parseLineForMachineCode( 'cmpgt R1,R2,R3', testLabels ) ).toStrictEqual( [ 0x7123, 65536 ] );
      } );

    // AND
      test( 'PARSE RRR and', () => {
        expect( Emulator.parseLineForMachineCode( 'and r1,r2,r3', testLabels ) ).toStrictEqual( [ 0x9123, 65536 ] );
        expect( Emulator.parseLineForMachineCode( 'and R1,R2,R3', testLabels ) ).toStrictEqual( [ 0x9123, 65536 ] );
      } );

    // OR
      test( 'PARSE RRR or', () => {
        expect( Emulator.parseLineForMachineCode( 'or r1,r2,r3', testLabels ) ).toStrictEqual( [ 0xa123, 65536 ] );
        expect( Emulator.parseLineForMachineCode( 'or R1,R2,R3', testLabels ) ).toStrictEqual( [ 0xa123, 65536 ] );
      } );

    // XOR
      test( 'PARSE RRR xor', () => {
        expect( Emulator.parseLineForMachineCode( 'xor r1,r2,r3', testLabels ) ).toStrictEqual( [ 0xb123, 65536 ] );
        expect( Emulator.parseLineForMachineCode( 'xor R1,R2,R3', testLabels ) ).toStrictEqual( [ 0xb123, 65536 ] );
      } );

    // TRAP
      test( 'PARSE RRR trap', () => {
        expect( Emulator.parseLineForMachineCode( 'trap r1,r2,r3', testLabels ) ).toStrictEqual( [ 0xd123, 65536 ] );
        expect( Emulator.parseLineForMachineCode( 'trap R1,R2,R3', testLabels ) ).toStrictEqual( [ 0xd123, 65536 ] );
      } );

  // RX
    // LEA
      test( 'PARSE RX lea', () => {
        expect( Emulator.parseLineForMachineCode( 'lea r1,test[r0]', testLabels ) ).toStrictEqual( [ 0xf100, testLabels['test'] ] );
        expect( Emulator.parseLineForMachineCode( 'lea R1,test[r0]', testLabels ) ).toStrictEqual( [ 0xf100, testLabels['test'] ] );
        expect( Emulator.parseLineForMachineCode( 'lea r1,test[r0]', testLabels ) ).toStrictEqual( [ 0xf100, testLabels['test'] ] );
        expect( Emulator.parseLineForMachineCode( 'lea R14,test[R2]', testLabels ) ).toStrictEqual( [ 0xfe20, testLabels['test'] ] );

        expect( Emulator.parseLineForMachineCode( 'lea r1,test[r0]', testLabels ) ).toStrictEqual( [ 0xf100, testLabels['test'] ] );
        expect( Emulator.parseLineForMachineCode( 'lea r1,100[r0]', testLabels ) ).toStrictEqual( [ 0xf100, 100 ] );
        expect( Emulator.parseLineForMachineCode( 'lea r1,-100[r0]', testLabels ) ).toStrictEqual( [ 0xf100, 0xff9c ] );
        expect( Emulator.parseLineForMachineCode( 'lea r1,$100[r0]', testLabels ) ).toStrictEqual( [ 0xf100, 0x0100 ] );
      } );

    // LOAD
      test( 'PARSE RX load', () => {
        expect( Emulator.parseLineForMachineCode( 'load r1,test[r0]', testLabels ) ).toStrictEqual( [ 0xf101, testLabels['test'] ] );
        expect( Emulator.parseLineForMachineCode( 'load R1,test[r0]', testLabels ) ).toStrictEqual( [ 0xf101, testLabels['test'] ] );
        expect( Emulator.parseLineForMachineCode( 'load r1,test[r0]', testLabels ) ).toStrictEqual( [ 0xf101, testLabels['test'] ] );
        expect( Emulator.parseLineForMachineCode( 'load R14,test[R2]', testLabels ) ).toStrictEqual( [ 0xfe21, testLabels['test'] ] );

        expect( Emulator.parseLineForMachineCode( 'load r1,test[r0]', testLabels ) ).toStrictEqual( [ 0xf101, testLabels['test'] ] );
        expect( Emulator.parseLineForMachineCode( 'load r1,100[r0]', testLabels ) ).toStrictEqual( [ 0xf101, 100 ] );
        expect( Emulator.parseLineForMachineCode( 'load r1,-100[r0]', testLabels ) ).toStrictEqual( [ 0xf101, 0xff9c ] );
        expect( Emulator.parseLineForMachineCode( 'load r1,$100[r0]', testLabels ) ).toStrictEqual( [ 0xf101, 0x0100 ] );
      } );

    // STORE
      test( 'PARSE RX store', () => {
        expect( Emulator.parseLineForMachineCode( 'store r1,test[r0]', testLabels ) ).toStrictEqual( [ 0xf102, testLabels['test'] ] );
        expect( Emulator.parseLineForMachineCode( 'store R1,test[r0]', testLabels ) ).toStrictEqual( [ 0xf102, testLabels['test'] ] );
        expect( Emulator.parseLineForMachineCode( 'store r1,test[r0]', testLabels ) ).toStrictEqual( [ 0xf102, testLabels['test'] ] );
        expect( Emulator.parseLineForMachineCode( 'store R14,test[R2]', testLabels ) ).toStrictEqual( [ 0xfe22, testLabels['test'] ] );

        expect( Emulator.parseLineForMachineCode( 'store r1,test[r0]', testLabels ) ).toStrictEqual( [ 0xf102, testLabels['test'] ] );
        expect( Emulator.parseLineForMachineCode( 'store r1,100[r0]', testLabels ) ).toStrictEqual( [ 0xf102, 100 ] );
        expect( Emulator.parseLineForMachineCode( 'store r1,-100[r0]', testLabels ) ).toStrictEqual( [ 0xf102, 0xff9c ] );
        expect( Emulator.parseLineForMachineCode( 'store r1,$100[r0]', testLabels ) ).toStrictEqual( [ 0xf102, 0x0100 ] );
      } );

    // JUMPF
      test( 'PARSE RX jumpf', () => {
        expect( Emulator.parseLineForMachineCode( 'jumpf r1,test[r0]', testLabels ) ).toStrictEqual( [ 0xf106, testLabels['test'] ] );
        expect( Emulator.parseLineForMachineCode( 'jumpf R1,test[r0]', testLabels ) ).toStrictEqual( [ 0xf106, testLabels['test'] ] );
        expect( Emulator.parseLineForMachineCode( 'jumpf r1,test[r0]', testLabels ) ).toStrictEqual( [ 0xf106, testLabels['test'] ] );
        expect( Emulator.parseLineForMachineCode( 'jumpf R14,test[R2]', testLabels ) ).toStrictEqual( [ 0xfe26, testLabels['test'] ] );

        expect( Emulator.parseLineForMachineCode( 'jumpf r1,test[r0]', testLabels ) ).toStrictEqual( [ 0xf106, testLabels['test'] ] );
        expect( Emulator.parseLineForMachineCode( 'jumpf r1,100[r0]', testLabels ) ).toStrictEqual( [ 0xf106, 100 ] );
        expect( Emulator.parseLineForMachineCode( 'jumpf r1,-100[r0]', testLabels ) ).toStrictEqual( [ 0xf106, 0xff9c ] );
        expect( Emulator.parseLineForMachineCode( 'jumpf r1,$100[r0]', testLabels ) ).toStrictEqual( [ 0xf106, 0x0100 ] );
      } );

    // JUMPT
      test( 'PARSE RX jumpt', () => {
        expect( Emulator.parseLineForMachineCode( 'jumpt r1,test[r0]', testLabels ) ).toStrictEqual( [ 0xf107, testLabels['test'] ] );
        expect( Emulator.parseLineForMachineCode( 'jumpt R1,test[r0]', testLabels ) ).toStrictEqual( [ 0xf107, testLabels['test'] ] );
        expect( Emulator.parseLineForMachineCode( 'jumpt r1,test[r0]', testLabels ) ).toStrictEqual( [ 0xf107, testLabels['test'] ] );
        expect( Emulator.parseLineForMachineCode( 'jumpt R14,test[R2]', testLabels ) ).toStrictEqual( [ 0xfe27, testLabels['test'] ] );

        expect( Emulator.parseLineForMachineCode( 'jumpt r1,test[r0]', testLabels ) ).toStrictEqual( [ 0xf107, testLabels['test'] ] );
        expect( Emulator.parseLineForMachineCode( 'jumpt r1,100[r0]', testLabels ) ).toStrictEqual( [ 0xf107, 100 ] );
        expect( Emulator.parseLineForMachineCode( 'jumpt r1,-100[r0]', testLabels ) ).toStrictEqual( [ 0xf107, 0xff9c ] );
        expect( Emulator.parseLineForMachineCode( 'jumpt r1,$100[r0]', testLabels ) ).toStrictEqual( [ 0xf107, 0x0100 ] );
      } );

    // JAL
      test( 'PARSE RX jal', () => {
        expect( Emulator.parseLineForMachineCode( 'jal r1,test[r0]', testLabels ) ).toStrictEqual( [ 0xf108, testLabels['test'] ] );
        expect( Emulator.parseLineForMachineCode( 'jal R1,test[r0]', testLabels ) ).toStrictEqual( [ 0xf108, testLabels['test'] ] );
        expect( Emulator.parseLineForMachineCode( 'jal r1,test[r0]', testLabels ) ).toStrictEqual( [ 0xf108, testLabels['test'] ] );
        expect( Emulator.parseLineForMachineCode( 'jal R14,test[R2]', testLabels ) ).toStrictEqual( [ 0xfe28, testLabels['test'] ] );

        expect( Emulator.parseLineForMachineCode( 'jal r1,test[r0]', testLabels ) ).toStrictEqual( [ 0xf108, testLabels['test'] ] );
        expect( Emulator.parseLineForMachineCode( 'jal r1,100[r0]', testLabels ) ).toStrictEqual( [ 0xf108, 100 ] );
        expect( Emulator.parseLineForMachineCode( 'jal r1,-100[r0]', testLabels ) ).toStrictEqual( [ 0xf108, 0xff9c ] );
        expect( Emulator.parseLineForMachineCode( 'jal r1,$100[r0]', testLabels ) ).toStrictEqual( [ 0xf108, 0x0100 ] );
      } );

    // TESTSET
      test( 'PARSE RX testset', () => {
        expect( Emulator.parseLineForMachineCode( 'testset r1,test[r0]', testLabels ) ).toStrictEqual( [ 0xf109, testLabels['test'] ] );
        expect( Emulator.parseLineForMachineCode( 'testset R1,test[r0]', testLabels ) ).toStrictEqual( [ 0xf109, testLabels['test'] ] );
        expect( Emulator.parseLineForMachineCode( 'testset r1,test[r0]', testLabels ) ).toStrictEqual( [ 0xf109, testLabels['test'] ] );
        expect( Emulator.parseLineForMachineCode( 'testset R14,test[R2]', testLabels ) ).toStrictEqual( [ 0xfe29, testLabels['test'] ] );

        expect( Emulator.parseLineForMachineCode( 'testset r1,test[r0]', testLabels ) ).toStrictEqual( [ 0xf109, testLabels['test'] ] );
        expect( Emulator.parseLineForMachineCode( 'testset r1,100[r0]', testLabels ) ).toStrictEqual( [ 0xf109, 100 ] );
        expect( Emulator.parseLineForMachineCode( 'testset r1,-100[r0]', testLabels ) ).toStrictEqual( [ 0xf109, 0xff9c ] );
        expect( Emulator.parseLineForMachineCode( 'testset r1,$100[r0]', testLabels ) ).toStrictEqual( [ 0xf109, 0x0100 ] );
      } );

  // JX
    // JUMP
      test( 'PARSE JX jump', () => {
        expect( Emulator.parseLineForMachineCode( 'jump test[r0]', testLabels ) ).toStrictEqual( [ 0xf003, testLabels['test'] ] );
        expect( Emulator.parseLineForMachineCode( 'jump test[R2]', testLabels ) ).toStrictEqual( [ 0xf023, testLabels['test'] ] );

        expect( Emulator.parseLineForMachineCode( 'jump test[r0]', testLabels ) ).toStrictEqual( [ 0xf003, testLabels['test'] ] );
        expect( Emulator.parseLineForMachineCode( 'jump 100[r0]', testLabels ) ).toStrictEqual( [ 0xf003, 100 ] );
        expect( Emulator.parseLineForMachineCode( 'jump -100[r0]', testLabels ) ).toStrictEqual( [ 0xf003, 0xff9c ] );
        expect( Emulator.parseLineForMachineCode( 'jump $100[r0]', testLabels ) ).toStrictEqual( [ 0xf003, 0x0100 ] );
      } );

  // KX
    // JUMPC0
      test( 'PARSE KX jumpc0', () => {
        expect( Emulator.parseLineForMachineCode( 'jumpc0 0,test[r0]', testLabels ) ).toStrictEqual( [ 0xf004, testLabels['test'] ] );
        expect( Emulator.parseLineForMachineCode( 'jumpc0 0,test[R2]', testLabels ) ).toStrictEqual( [ 0xf024, testLabels['test'] ] );

        expect( Emulator.parseLineForMachineCode( 'jumpc0 1,test[R2]', testLabels ) ).toStrictEqual( [ 0xf124, testLabels['test'] ] );
        expect( Emulator.parseLineForMachineCode( 'jumpc0 $f,test[R2]', testLabels ) ).toStrictEqual( [ 0xff24, testLabels['test'] ] );

        expect( Emulator.parseLineForMachineCode( 'jumpc0 0,test[r0]', testLabels ) ).toStrictEqual( [ 0xf004, testLabels['test'] ] );
        expect( Emulator.parseLineForMachineCode( 'jumpc0 0,100[r0]', testLabels ) ).toStrictEqual( [ 0xf004, 100 ] );
        expect( Emulator.parseLineForMachineCode( 'jumpc0 0,-100[r0]', testLabels ) ).toStrictEqual( [ 0xf004, 0xff9c ] );
        expect( Emulator.parseLineForMachineCode( 'jumpc0 0,$100[r0]', testLabels ) ).toStrictEqual( [ 0xf004, 0x0100 ] );
      } );

    // JUMPC1
      test( 'PARSE KX jumpc1', () => {
        expect( Emulator.parseLineForMachineCode( 'jumpc1 0,test[r0]', testLabels ) ).toStrictEqual( [ 0xf005, testLabels['test'] ] );
        expect( Emulator.parseLineForMachineCode( 'jumpc1 0,test[R2]', testLabels ) ).toStrictEqual( [ 0xf025, testLabels['test'] ] );

        expect( Emulator.parseLineForMachineCode( 'jumpc1 1,test[R2]', testLabels ) ).toStrictEqual( [ 0xf125, testLabels['test'] ] );
        expect( Emulator.parseLineForMachineCode( 'jumpc1 $f,test[R2]', testLabels ) ).toStrictEqual( [ 0xff25, testLabels['test'] ] );

        expect( Emulator.parseLineForMachineCode( 'jumpc1 0,test[r0]', testLabels ) ).toStrictEqual( [ 0xf005, testLabels['test'] ] );
        expect( Emulator.parseLineForMachineCode( 'jumpc1 0,100[r0]', testLabels ) ).toStrictEqual( [ 0xf005, 100 ] );
        expect( Emulator.parseLineForMachineCode( 'jumpc1 0,-100[r0]', testLabels ) ).toStrictEqual( [ 0xf005, 0xff9c ] );
        expect( Emulator.parseLineForMachineCode( 'jumpc1 0,$100[r0]', testLabels ) ).toStrictEqual( [ 0xf005, 0x0100 ] );
      } );

  // JUMPALIAS
    // JUMPLE
      test( 'PARSE JUMPALIAS jumple', () => {
        expect( Emulator.parseLineForMachineCode( 'jumple test[r0]', testLabels ) ).toStrictEqual( [ 0xf104, testLabels['test'] ] );
        expect( Emulator.parseLineForMachineCode( 'jumple test[R2]', testLabels ) ).toStrictEqual( [ 0xf124, testLabels['test'] ] );

        expect( Emulator.parseLineForMachineCode( 'jumple test[r0]', testLabels ) ).toStrictEqual( [ 0xf104, testLabels['test'] ] );
        expect( Emulator.parseLineForMachineCode( 'jumple 100[r0]', testLabels ) ).toStrictEqual( [ 0xf104, 100 ] );
        expect( Emulator.parseLineForMachineCode( 'jumple -100[r0]', testLabels ) ).toStrictEqual( [ 0xf104, 0xff9c ] );
        expect( Emulator.parseLineForMachineCode( 'jumple $100[r0]', testLabels ) ).toStrictEqual( [ 0xf104, 0x0100 ] );
      } );

    // JUMPNE
      test( 'PARSE JUMPALIAS jumpne', () => {
        expect( Emulator.parseLineForMachineCode( 'jumpne test[r0]', testLabels ) ).toStrictEqual( [ 0xf204, testLabels['test'] ] );
        expect( Emulator.parseLineForMachineCode( 'jumpne test[R2]', testLabels ) ).toStrictEqual( [ 0xf224, testLabels['test'] ] );

        expect( Emulator.parseLineForMachineCode( 'jumpne test[r0]', testLabels ) ).toStrictEqual( [ 0xf204, testLabels['test'] ] );
        expect( Emulator.parseLineForMachineCode( 'jumpne 100[r0]', testLabels ) ).toStrictEqual( [ 0xf204, 100 ] );
        expect( Emulator.parseLineForMachineCode( 'jumpne -100[r0]', testLabels ) ).toStrictEqual( [ 0xf204, 0xff9c ] );
        expect( Emulator.parseLineForMachineCode( 'jumpne $100[r0]', testLabels ) ).toStrictEqual( [ 0xf204, 0x0100 ] );
      } );

    // JUMPGE
      test( 'PARSE JUMPALIAS jumpge', () => {
        expect( Emulator.parseLineForMachineCode( 'jumpge test[r0]', testLabels ) ).toStrictEqual( [ 0xf304, testLabels['test'] ] );
        expect( Emulator.parseLineForMachineCode( 'jumpge test[R2]', testLabels ) ).toStrictEqual( [ 0xf324, testLabels['test'] ] );

        expect( Emulator.parseLineForMachineCode( 'jumpge test[r0]', testLabels ) ).toStrictEqual( [ 0xf304, testLabels['test'] ] );
        expect( Emulator.parseLineForMachineCode( 'jumpge 100[r0]', testLabels ) ).toStrictEqual( [ 0xf304, 100 ] );
        expect( Emulator.parseLineForMachineCode( 'jumpge -100[r0]', testLabels ) ).toStrictEqual( [ 0xf304, 0xff9c ] );
        expect( Emulator.parseLineForMachineCode( 'jumpge $100[r0]', testLabels ) ).toStrictEqual( [ 0xf304, 0x0100 ] );
      } );

    // JUMPNV
      test( 'PARSE JUMPALIAS jumpnv', () => {
        expect( Emulator.parseLineForMachineCode( 'jumpnv test[r0]', testLabels ) ).toStrictEqual( [ 0xf604, testLabels['test'] ] );
        expect( Emulator.parseLineForMachineCode( 'jumpnv test[R2]', testLabels ) ).toStrictEqual( [ 0xf624, testLabels['test'] ] );

        expect( Emulator.parseLineForMachineCode( 'jumpnv test[r0]', testLabels ) ).toStrictEqual( [ 0xf604, testLabels['test'] ] );
        expect( Emulator.parseLineForMachineCode( 'jumpnv 100[r0]', testLabels ) ).toStrictEqual( [ 0xf604, 100 ] );
        expect( Emulator.parseLineForMachineCode( 'jumpnv -100[r0]', testLabels ) ).toStrictEqual( [ 0xf604, 0xff9c ] );
        expect( Emulator.parseLineForMachineCode( 'jumpnv $100[r0]', testLabels ) ).toStrictEqual( [ 0xf604, 0x0100 ] );
      } );

    // JUMPNVU
      test( 'PARSE JUMPALIAS jumpnvu', () => {
        expect( Emulator.parseLineForMachineCode( 'jumpnvu test[r0]', testLabels ) ).toStrictEqual( [ 0xf504, testLabels['test'] ] );
        expect( Emulator.parseLineForMachineCode( 'jumpnvu test[R2]', testLabels ) ).toStrictEqual( [ 0xf524, testLabels['test'] ] );

        expect( Emulator.parseLineForMachineCode( 'jumpnvu test[r0]', testLabels ) ).toStrictEqual( [ 0xf504, testLabels['test'] ] );
        expect( Emulator.parseLineForMachineCode( 'jumpnvu 100[r0]', testLabels ) ).toStrictEqual( [ 0xf504, 100 ] );
        expect( Emulator.parseLineForMachineCode( 'jumpnvu -100[r0]', testLabels ) ).toStrictEqual( [ 0xf504, 0xff9c ] );
        expect( Emulator.parseLineForMachineCode( 'jumpnvu $100[r0]', testLabels ) ).toStrictEqual( [ 0xf504, 0x0100 ] );
      } );

    // JUMPNCO
      test( 'PARSE JUMPALIAS jumpnco', () => {
        expect( Emulator.parseLineForMachineCode( 'jumpnco test[r0]', testLabels ) ).toStrictEqual( [ 0xf704, testLabels['test'] ] );
        expect( Emulator.parseLineForMachineCode( 'jumpnco test[R2]', testLabels ) ).toStrictEqual( [ 0xf724, testLabels['test'] ] );

        expect( Emulator.parseLineForMachineCode( 'jumpnco test[r0]', testLabels ) ).toStrictEqual( [ 0xf704, testLabels['test'] ] );
        expect( Emulator.parseLineForMachineCode( 'jumpnco 100[r0]', testLabels ) ).toStrictEqual( [ 0xf704, 100 ] );
        expect( Emulator.parseLineForMachineCode( 'jumpnco -100[r0]', testLabels ) ).toStrictEqual( [ 0xf704, 0xff9c ] );
        expect( Emulator.parseLineForMachineCode( 'jumpnco $100[r0]', testLabels ) ).toStrictEqual( [ 0xf704, 0x0100 ] );
      } );

    // JUMPLT
      test( 'PARSE JUMPALIAS jumplt', () => {
        expect( Emulator.parseLineForMachineCode( 'jumplt test[r0]', testLabels ) ).toStrictEqual( [ 0xf305, testLabels['test'] ] );
        expect( Emulator.parseLineForMachineCode( 'jumplt test[R2]', testLabels ) ).toStrictEqual( [ 0xf325, testLabels['test'] ] );

        expect( Emulator.parseLineForMachineCode( 'jumplt test[r0]', testLabels ) ).toStrictEqual( [ 0xf305, testLabels['test'] ] );
        expect( Emulator.parseLineForMachineCode( 'jumplt 100[r0]', testLabels ) ).toStrictEqual( [ 0xf305, 100 ] );
        expect( Emulator.parseLineForMachineCode( 'jumplt -100[r0]', testLabels ) ).toStrictEqual( [ 0xf305, 0xff9c ] );
        expect( Emulator.parseLineForMachineCode( 'jumplt $100[r0]', testLabels ) ).toStrictEqual( [ 0xf305, 0x0100 ] );
      } );

    // JUMPEQ
      test( 'PARSE JUMPALIAS jumpeq', () => {
        expect( Emulator.parseLineForMachineCode( 'jumpeq test[r0]', testLabels ) ).toStrictEqual( [ 0xf205, testLabels['test'] ] );
        expect( Emulator.parseLineForMachineCode( 'jumpeq test[R2]', testLabels ) ).toStrictEqual( [ 0xf225, testLabels['test'] ] );

        expect( Emulator.parseLineForMachineCode( 'jumpeq test[r0]', testLabels ) ).toStrictEqual( [ 0xf205, testLabels['test'] ] );
        expect( Emulator.parseLineForMachineCode( 'jumpeq 100[r0]', testLabels ) ).toStrictEqual( [ 0xf205, 100 ] );
        expect( Emulator.parseLineForMachineCode( 'jumpeq -100[r0]', testLabels ) ).toStrictEqual( [ 0xf205, 0xff9c ] );
        expect( Emulator.parseLineForMachineCode( 'jumpeq $100[r0]', testLabels ) ).toStrictEqual( [ 0xf205, 0x0100 ] );
      } );

    // JUMPGT
      test( 'PARSE JUMPALIAS jumpgt', () => {
        expect( Emulator.parseLineForMachineCode( 'jumpgt test[r0]', testLabels ) ).toStrictEqual( [ 0xf105, testLabels['test'] ] );
        expect( Emulator.parseLineForMachineCode( 'jumpgt test[R2]', testLabels ) ).toStrictEqual( [ 0xf125, testLabels['test'] ] );

        expect( Emulator.parseLineForMachineCode( 'jumpgt test[r0]', testLabels ) ).toStrictEqual( [ 0xf105, testLabels['test'] ] );
        expect( Emulator.parseLineForMachineCode( 'jumpgt 100[r0]', testLabels ) ).toStrictEqual( [ 0xf105, 100 ] );
        expect( Emulator.parseLineForMachineCode( 'jumpgt -100[r0]', testLabels ) ).toStrictEqual( [ 0xf105, 0xff9c ] );
        expect( Emulator.parseLineForMachineCode( 'jumpgt $100[r0]', testLabels ) ).toStrictEqual( [ 0xf105, 0x0100 ] );
      } );

    // JUMPV
      test( 'PARSE JUMPALIAS jumpv', () => {
        expect( Emulator.parseLineForMachineCode( 'jumpv test[r0]', testLabels ) ).toStrictEqual( [ 0xf605, testLabels['test'] ] );
        expect( Emulator.parseLineForMachineCode( 'jumpv test[R2]', testLabels ) ).toStrictEqual( [ 0xf625, testLabels['test'] ] );

        expect( Emulator.parseLineForMachineCode( 'jumpv test[r0]', testLabels ) ).toStrictEqual( [ 0xf605, testLabels['test'] ] );
        expect( Emulator.parseLineForMachineCode( 'jumpv 100[r0]', testLabels ) ).toStrictEqual( [ 0xf605, 100 ] );
        expect( Emulator.parseLineForMachineCode( 'jumpv -100[r0]', testLabels ) ).toStrictEqual( [ 0xf605, 0xff9c ] );
        expect( Emulator.parseLineForMachineCode( 'jumpv $100[r0]', testLabels ) ).toStrictEqual( [ 0xf605, 0x0100 ] );
      } );

    // JUMPVU
      test( 'PARSE JUMPALIAS jumpvu', () => {
        expect( Emulator.parseLineForMachineCode( 'jumpvu test[r0]', testLabels ) ).toStrictEqual( [ 0xf505, testLabels['test'] ] );
        expect( Emulator.parseLineForMachineCode( 'jumpvu test[R2]', testLabels ) ).toStrictEqual( [ 0xf525, testLabels['test'] ] );

        expect( Emulator.parseLineForMachineCode( 'jumpvu test[r0]', testLabels ) ).toStrictEqual( [ 0xf505, testLabels['test'] ] );
        expect( Emulator.parseLineForMachineCode( 'jumpvu 100[r0]', testLabels ) ).toStrictEqual( [ 0xf505, 100 ] );
        expect( Emulator.parseLineForMachineCode( 'jumpvu -100[r0]', testLabels ) ).toStrictEqual( [ 0xf505, 0xff9c ] );
        expect( Emulator.parseLineForMachineCode( 'jumpvu $100[r0]', testLabels ) ).toStrictEqual( [ 0xf505, 0x0100 ] );
      } );

    // JUMPCO
      test( 'PARSE JUMPALIAS jumpco', () => {
        expect( Emulator.parseLineForMachineCode( 'jumpco test[r0]', testLabels ) ).toStrictEqual( [ 0xf705, testLabels['test'] ] );
        expect( Emulator.parseLineForMachineCode( 'jumpco test[R2]', testLabels ) ).toStrictEqual( [ 0xf725, testLabels['test'] ] );

        expect( Emulator.parseLineForMachineCode( 'jumpco test[r0]', testLabels ) ).toStrictEqual( [ 0xf705, testLabels['test'] ] );
        expect( Emulator.parseLineForMachineCode( 'jumpco 100[r0]', testLabels ) ).toStrictEqual( [ 0xf705, 100 ] );
        expect( Emulator.parseLineForMachineCode( 'jumpco -100[r0]', testLabels ) ).toStrictEqual( [ 0xf705, 0xff9c ] );
        expect( Emulator.parseLineForMachineCode( 'jumpco $100[r0]', testLabels ) ).toStrictEqual( [ 0xf705, 0x0100 ] );
      } );

  // X
    test( 'PARSE X data', () => {
      expect( Emulator.parseLineForMachineCode( 'data 100', testLabels ) ).toStrictEqual( [ 100, 65536 ] );
      expect( Emulator.parseLineForMachineCode( 'data -100', testLabels ) ).toStrictEqual( [ 0xff9c, 65536 ] );
      expect( Emulator.parseLineForMachineCode( 'data $100', testLabels ) ).toStrictEqual( [ 0x0100, 65536 ] );
    } );

  // NOEXP
    // RFI
      test( 'PARSE NOEXP rfi', () => {
        expect( Emulator.parseLineForMachineCode( 'rfi' ) ).toStrictEqual( [ 0xe000, 65536 ] );
        expect( Emulator.parseLineForMachineCode( 'rfi ' ) ).toStrictEqual( [ 0xe000, 65536 ] );
      } );

  // RREXP
    // EXECUTE
      test( 'PARSE RREXP execute', () => {
        expect( Emulator.parseLineForMachineCode( 'execute r1,r2', testLabels ) ).toStrictEqual( [ 0xe00c, 0x1200 ] );
        expect( Emulator.parseLineForMachineCode( 'execute R1,R2', testLabels ) ).toStrictEqual( [ 0xe00c, 0x1200 ] );
      } );

  // RRXEXP
    // SAVE
      test( 'PARSE RXEXP save', () => {
        expect( Emulator.parseLineForMachineCode( 'save r1,r2,20[r0]', testLabels ) ).toStrictEqual( [ 0xe008, 0x1214 ] );
        expect( Emulator.parseLineForMachineCode( 'save R1,R2,20[R0]', testLabels ) ).toStrictEqual( [ 0xe008, 0x1214 ] );
        expect( Emulator.parseLineForMachineCode( 'save R14,R14,20[R2]', testLabels ) ).toStrictEqual( [ 0xe208, 0xee14 ] );

        expect( Emulator.parseLineForMachineCode( 'save r1,r2,$ff[r0]', testLabels ) ).toStrictEqual( [ 0xe008, 0x12ff ] );
        expect( Emulator.parseLineForMachineCode( 'save r1,r2,100[r0]', testLabels ) ).toStrictEqual( [ 0xe008, 0x1264 ] );
      } );

    // RESTORE
      test( 'PARSE RXEXP restore', () => {
        expect( Emulator.parseLineForMachineCode( 'restore r1,r2,20[r0]', testLabels ) ).toStrictEqual( [ 0xe009, 0x1214 ] );
        expect( Emulator.parseLineForMachineCode( 'restore R1,R2,20[R0]', testLabels ) ).toStrictEqual( [ 0xe009, 0x1214 ] );
        expect( Emulator.parseLineForMachineCode( 'restore R14,R14,20[R2]', testLabels ) ).toStrictEqual( [ 0xe209, 0xee14 ] );

        expect( Emulator.parseLineForMachineCode( 'restore r1,r2,$ff[r0]', testLabels ) ).toStrictEqual( [ 0xe009, 0x12ff ] );
        expect( Emulator.parseLineForMachineCode( 'restore r1,r2,100[r0]', testLabels ) ).toStrictEqual( [ 0xe009, 0x1264 ] );
      } );

  // RCEXP
    // GETCTL
      test( 'PARSE RCEXP getctl', () => {
        expect( Emulator.parseLineForMachineCode( 'getctl r1,pc' ) ).toStrictEqual( [ 0xe10a, 0x0010 ] );
        expect( Emulator.parseLineForMachineCode( 'getctl R15,pc' ) ).toStrictEqual( [ 0xef0a, 0x0010 ] );

        expect( Emulator.parseLineForMachineCode( 'getctl r1,pc' ) ).toStrictEqual( [ 0xe10a, 0x0010 ] );
        expect( Emulator.parseLineForMachineCode( 'getctl r1,ir' ) ).toStrictEqual( [ 0xe10a, 0x0020 ] );
        expect( Emulator.parseLineForMachineCode( 'getctl r1,adr' ) ).toStrictEqual( [ 0xe10a, 0x0030 ] );
      } );

    // PUTCTL
      test( 'PARSE RCEXP putctl', () => {
        expect( Emulator.parseLineForMachineCode( 'putctl r1,pc' ) ).toStrictEqual( [ 0xe10b, 0x0010 ] );
        expect( Emulator.parseLineForMachineCode( 'putctl R15,pc' ) ).toStrictEqual( [ 0xef0b, 0x0010 ] );

        expect( Emulator.parseLineForMachineCode( 'putctl r1,pc' ) ).toStrictEqual( [ 0xe10b, 0x0010 ] );
        expect( Emulator.parseLineForMachineCode( 'putctl r1,ir' ) ).toStrictEqual( [ 0xe10b, 0x0020 ] );
        expect( Emulator.parseLineForMachineCode( 'putctl r1,adr' ) ).toStrictEqual( [ 0xe10b, 0x0030 ] );
      } );

  // RRREXP
    // PUSH
      test( 'PARSE RRREXP push', () => {
        expect( Emulator.parseLineForMachineCode( 'push r1,r2,r3', testLabels ) ).toStrictEqual( [ 0xe10d, 0x2300 ] );
        expect( Emulator.parseLineForMachineCode( 'push R1,R2,R3', testLabels ) ).toStrictEqual( [ 0xe10d, 0x2300 ] );
      } );

    // POP
      test( 'PARSE RRREXP pop', () => {
        expect( Emulator.parseLineForMachineCode( 'pop r1,r2,r3', testLabels ) ).toStrictEqual( [ 0xe10e, 0x2300 ] );
        expect( Emulator.parseLineForMachineCode( 'pop R1,R2,R3', testLabels ) ).toStrictEqual( [ 0xe10e, 0x2300 ] );
      } );

    // TOP
      test( 'PARSE RRREXP top', () => {
        expect( Emulator.parseLineForMachineCode( 'top r1,r2,r3', testLabels ) ).toStrictEqual( [ 0xe10f, 0x2300 ] );
        expect( Emulator.parseLineForMachineCode( 'top R1,R2,R3', testLabels ) ).toStrictEqual( [ 0xe10f, 0x2300 ] );
      } );

    // ADDC
      test( 'PARSE RRREXP addc', () => {
        expect( Emulator.parseLineForMachineCode( 'addc r1,r2,r3', testLabels ) ).toStrictEqual( [ 0xe11c, 0x2300 ] );
        expect( Emulator.parseLineForMachineCode( 'addc R1,R2,R3', testLabels ) ).toStrictEqual( [ 0xe11c, 0x2300 ] );
      } );

  // RRKEXP
    // SHIFTL
      test( 'PARSE RRKEXP shiftl', () => {
        expect( Emulator.parseLineForMachineCode( 'shiftl r1,r2,0' ) ).toStrictEqual( [ 0xe110, 0x2000 ] );
        expect( Emulator.parseLineForMachineCode( 'shiftl R1,R15,0' ) ).toStrictEqual( [ 0xe110, 0xf000 ] );

        expect( Emulator.parseLineForMachineCode( 'shiftl r1,r2,5' ) ).toStrictEqual( [ 0xe110, 0x2050 ] );
        expect( Emulator.parseLineForMachineCode( 'shiftl r1,r2,$f' ) ).toStrictEqual( [ 0xe110, 0x20f0 ] );
      } );

    // SHIFTR
      test( 'PARSE RRKEXP shiftr', () => {
        expect( Emulator.parseLineForMachineCode( 'shiftr r1,r2,0' ) ).toStrictEqual( [ 0xe111, 0x2000 ] );
        expect( Emulator.parseLineForMachineCode( 'shiftr R1,R15,0' ) ).toStrictEqual( [ 0xe111, 0xf000 ] );

        expect( Emulator.parseLineForMachineCode( 'shiftr r1,r2,5' ) ).toStrictEqual( [ 0xe111, 0x2050 ] );
        expect( Emulator.parseLineForMachineCode( 'shiftr r1,r2,$f' ) ).toStrictEqual( [ 0xe111, 0x20f0 ] );
      } );

  // RKEXP
    // GETBIT
      test( 'PARSE RKEXP getbit', () => {
        expect( Emulator.parseLineForMachineCode( 'getbit r1,0' ) ).toStrictEqual( [ 0xe118, 0x0000 ] );
        expect( Emulator.parseLineForMachineCode( 'getbit R1,0' ) ).toStrictEqual( [ 0xe118, 0x0000 ] );

        expect( Emulator.parseLineForMachineCode( 'getbit r1,5' ) ).toStrictEqual( [ 0xe118, 0x0050 ] );
        expect( Emulator.parseLineForMachineCode( 'getbit r1,$f' ) ).toStrictEqual( [ 0xe118, 0x00f0 ] );
      } );

    // GETBITI
      test( 'PARSE RKEXP getbiti', () => {
        expect( Emulator.parseLineForMachineCode( 'getbiti r1,0' ) ).toStrictEqual( [ 0xe119, 0x0000 ] );
        expect( Emulator.parseLineForMachineCode( 'getbiti R1,0' ) ).toStrictEqual( [ 0xe119, 0x0000 ] );

        expect( Emulator.parseLineForMachineCode( 'getbiti r1,5' ) ).toStrictEqual( [ 0xe119, 0x0050 ] );
        expect( Emulator.parseLineForMachineCode( 'getbiti r1,$f' ) ).toStrictEqual( [ 0xe119, 0x00f0 ] );
      } );

    // PUTBIT
      test( 'PARSE RKEXP putbit', () => {
        expect( Emulator.parseLineForMachineCode( 'putbit r1,0' ) ).toStrictEqual( [ 0xe11a, 0x0000 ] );
        expect( Emulator.parseLineForMachineCode( 'putbit R1,0' ) ).toStrictEqual( [ 0xe11a, 0x0000 ] );

        expect( Emulator.parseLineForMachineCode( 'putbit r1,5' ) ).toStrictEqual( [ 0xe11a, 0x0050 ] );
        expect( Emulator.parseLineForMachineCode( 'putbit r1,$f' ) ).toStrictEqual( [ 0xe11a, 0x00f0 ] );
      } );

    // PUTBITI
      test( 'PARSE RKEXP putbit', () => {
        expect( Emulator.parseLineForMachineCode( 'putbiti r1,0' ) ).toStrictEqual( [ 0xe11b, 0x0000 ] );
        expect( Emulator.parseLineForMachineCode( 'putbiti R1,0' ) ).toStrictEqual( [ 0xe11b, 0x0000 ] );

        expect( Emulator.parseLineForMachineCode( 'putbiti r1,5' ) ).toStrictEqual( [ 0xe11b, 0x0050 ] );
        expect( Emulator.parseLineForMachineCode( 'putbiti r1,$f' ) ).toStrictEqual( [ 0xe11b, 0x00f0 ] );
      } );

  // INJECTIALIAS
    // FIELD
      test( 'PARSE INJECTIALIAS field', () => {
        expect( Emulator.parseLineForMachineCode( 'field r1,0,15' ) ).toStrictEqual( [ 0xe115, 0x000f ] );
        expect( Emulator.parseLineForMachineCode( 'field R15,0,15' ) ).toStrictEqual( [ 0xef15, 0x000f ] );

        expect( Emulator.parseLineForMachineCode( 'field r1,1,15' ) ).toStrictEqual( [ 0xe115, 0x001f ] );
        expect( Emulator.parseLineForMachineCode( 'field r1,$a,15' ) ).toStrictEqual( [ 0xe115, 0x00af ] );

        expect( Emulator.parseLineForMachineCode( 'field r1,0,$1' ) ).toStrictEqual( [ 0xe115, 0x0001 ] );
        expect( Emulator.parseLineForMachineCode( 'field r1,0,$f' ) ).toStrictEqual( [ 0xe115, 0x000f ] );
      } );

  // RRKKEXP
    // EXTRACT
      test( 'PARSE RRKKEXP extract', () => {
        expect( Emulator.parseLineForMachineCode( 'extract r1,r2,0,0' ) ).toStrictEqual( [ 0xe112, 0x2000 ] );
        expect( Emulator.parseLineForMachineCode( 'extract R1,R15,0,0' ) ).toStrictEqual( [ 0xe112, 0xf000 ] );

        expect( Emulator.parseLineForMachineCode( 'extract r1,r2,5,0' ) ).toStrictEqual( [ 0xe112, 0x2050 ] );
        expect( Emulator.parseLineForMachineCode( 'extract r1,r2,$f,0' ) ).toStrictEqual( [ 0xe112, 0x20f0 ] );

        expect( Emulator.parseLineForMachineCode( 'extract r1,r2,0,5' ) ).toStrictEqual( [ 0xe112, 0x2005 ] );
        expect( Emulator.parseLineForMachineCode( 'extract r1,r2,0,$f' ) ).toStrictEqual( [ 0xe112, 0x200f ] );
      } );

    // EXTRACTI
      test( 'PARSE RRKKEXP extracti', () => {
        expect( Emulator.parseLineForMachineCode( 'extracti r1,r2,0,0' ) ).toStrictEqual( [ 0xe113, 0x2000 ] );
        expect( Emulator.parseLineForMachineCode( 'extracti R1,R15,0,0' ) ).toStrictEqual( [ 0xe113, 0xf000 ] );

        expect( Emulator.parseLineForMachineCode( 'extracti r1,r2,5,0' ) ).toStrictEqual( [ 0xe113, 0x2050 ] );
        expect( Emulator.parseLineForMachineCode( 'extracti r1,r2,$f,0' ) ).toStrictEqual( [ 0xe113, 0x20f0 ] );

        expect( Emulator.parseLineForMachineCode( 'extracti r1,r2,0,5' ) ).toStrictEqual( [ 0xe113, 0x2005 ] );
        expect( Emulator.parseLineForMachineCode( 'extracti r1,r2,0,$f' ) ).toStrictEqual( [ 0xe113, 0x200f ] );
      } );

  // RRRKKEXP
    // INJECT
      test( 'PARSE RRRKKEXP inject', () => {
        expect( Emulator.parseLineForMachineCode( 'inject r1,r2,r3,0,0' ) ).toStrictEqual( [ 0xe114, 0x2300 ] );
        expect( Emulator.parseLineForMachineCode( 'inject R1,R5,R15,0,0' ) ).toStrictEqual( [ 0xe114, 0x5f00 ] );

        expect( Emulator.parseLineForMachineCode( 'inject r1,r2,r3,5,0' ) ).toStrictEqual( [ 0xe114, 0x2350 ] );
        expect( Emulator.parseLineForMachineCode( 'inject r1,r2,r3,$f,0' ) ).toStrictEqual( [ 0xe114, 0x23f0 ] );

        expect( Emulator.parseLineForMachineCode( 'inject r1,r2,r3,0,5' ) ).toStrictEqual( [ 0xe114, 0x2305 ] );
        expect( Emulator.parseLineForMachineCode( 'inject r1,r2,r3,0,$f' ) ).toStrictEqual( [ 0xe114, 0x230f ] );
      } );

    // INJECTI
      test( 'PARSE RRRKKEXP injecti', () => {
        expect( Emulator.parseLineForMachineCode( 'injecti r1,r2,r3,0,0' ) ).toStrictEqual( [ 0xe115, 0x2300 ] );
        expect( Emulator.parseLineForMachineCode( 'injecti R1,R5,R15,0,0' ) ).toStrictEqual( [ 0xe115, 0x5f00 ] );

        expect( Emulator.parseLineForMachineCode( 'injecti r1,r2,r3,5,0' ) ).toStrictEqual( [ 0xe115, 0x2350 ] );
        expect( Emulator.parseLineForMachineCode( 'injecti r1,r2,r3,$f,0' ) ).toStrictEqual( [ 0xe115, 0x23f0 ] );

        expect( Emulator.parseLineForMachineCode( 'injecti r1,r2,r3,0,5' ) ).toStrictEqual( [ 0xe115, 0x2305 ] );
        expect( Emulator.parseLineForMachineCode( 'injecti r1,r2,r3,0,$f' ) ).toStrictEqual( [ 0xe115, 0x230f ] );
      } );

    // LOGICB
      test( 'PARSE RRRKKEXP logicb', () => {
        expect( Emulator.parseLineForMachineCode( 'logicb r1,r2,r3,0,0' ) ).toStrictEqual( [ 0xe117, 0x2300 ] );
        expect( Emulator.parseLineForMachineCode( 'logicb R1,R5,R15,0,0' ) ).toStrictEqual( [ 0xe117, 0x5f00 ] );

        expect( Emulator.parseLineForMachineCode( 'logicb r1,r2,r3,5,0' ) ).toStrictEqual( [ 0xe117, 0x2350 ] );
        expect( Emulator.parseLineForMachineCode( 'logicb r1,r2,r3,$f,0' ) ).toStrictEqual( [ 0xe117, 0x23f0 ] );

        expect( Emulator.parseLineForMachineCode( 'logicb r1,r2,r3,0,5' ) ).toStrictEqual( [ 0xe117, 0x2305 ] );
        expect( Emulator.parseLineForMachineCode( 'logicb r1,r2,r3,0,$f' ) ).toStrictEqual( [ 0xe117, 0x230f ] );
      } );

  // RRRKEXP
    // LOGICW
      test( 'PARSE RRRKEXP logicw', () => {
        expect( Emulator.parseLineForMachineCode( 'logicw r1,r2,r3,0' ) ).toStrictEqual( [ 0xe116, 0x2300 ] );
        expect( Emulator.parseLineForMachineCode( 'logicw R1,R5,R15,0' ) ).toStrictEqual( [ 0xe116, 0x5f00 ] );

        expect( Emulator.parseLineForMachineCode( 'logicw r1,r2,r3,5' ) ).toStrictEqual( [ 0xe116, 0x2350 ] );
        expect( Emulator.parseLineForMachineCode( 'logicw r1,r2,r3,$f' ) ).toStrictEqual( [ 0xe116, 0x23f0 ] );
      } );

  // LOGICALIASRRRK
    // ANDB
      test( 'PARSE LOGICALIASRRRK andb', () => {
        expect( Emulator.parseLineForMachineCode( 'andb r1,r2,r3,0' ) ).toStrictEqual( [ 0xe117, 0x2310 ] );
        expect( Emulator.parseLineForMachineCode( 'andb R1,R5,R15,0' ) ).toStrictEqual( [ 0xe117, 0x5f10 ] );

        expect( Emulator.parseLineForMachineCode( 'andb r1,r2,r3,5' ) ).toStrictEqual( [ 0xe117, 0x2315 ] );
        expect( Emulator.parseLineForMachineCode( 'andb r1,r2,r3,$f' ) ).toStrictEqual( [ 0xe117, 0x231f ] );
      } );

    // ORB
      test( 'PARSE LOGICALIASRRRK orb', () => {
        expect( Emulator.parseLineForMachineCode( 'orb r1,r2,r3,0' ) ).toStrictEqual( [ 0xe117, 0x2370 ] );
        expect( Emulator.parseLineForMachineCode( 'orb R1,R5,R15,0' ) ).toStrictEqual( [ 0xe117, 0x5f70 ] );

        expect( Emulator.parseLineForMachineCode( 'orb r1,r2,r3,5' ) ).toStrictEqual( [ 0xe117, 0x2375 ] );
        expect( Emulator.parseLineForMachineCode( 'orb r1,r2,r3,$f' ) ).toStrictEqual( [ 0xe117, 0x237f ] );
      } );

    // XORB
      test( 'PARSE LOGICALIASRRRK xorb', () => {
        expect( Emulator.parseLineForMachineCode( 'xorb r1,r2,r3,0' ) ).toStrictEqual( [ 0xe117, 0x2360 ] );
        expect( Emulator.parseLineForMachineCode( 'xorb R1,R5,R15,0' ) ).toStrictEqual( [ 0xe117, 0x5f60 ] );

        expect( Emulator.parseLineForMachineCode( 'xorb r1,r2,r3,5' ) ).toStrictEqual( [ 0xe117, 0x2365 ] );
        expect( Emulator.parseLineForMachineCode( 'xorb r1,r2,r3,$f' ) ).toStrictEqual( [ 0xe117, 0x236f ] );
      } );

  // LOGICALIASRRK
    // INVB
      test( 'PARSE LOGICALIASRRRK invb', () => {
        expect( Emulator.parseLineForMachineCode( 'invb r1,r2,0' ) ).toStrictEqual( [ 0xe117, 0x20c0 ] );
        expect( Emulator.parseLineForMachineCode( 'invb R1,R15,0' ) ).toStrictEqual( [ 0xe117, 0xf0c0 ] );

        expect( Emulator.parseLineForMachineCode( 'invb r1,r2,5' ) ).toStrictEqual( [ 0xe117, 0x20c5 ] );
        expect( Emulator.parseLineForMachineCode( 'invb r1,r2,$f' ) ).toStrictEqual( [ 0xe117, 0x20cf ] );
      } );

  // LOGICALIASRRR
    // ANDNEW
      test( 'PARSE LOGICALIASRRR andnew', () => {
        expect( Emulator.parseLineForMachineCode( 'andnew r1,r2,r3' ) ).toStrictEqual( [ 0xe116, 0x2310 ] );
        expect( Emulator.parseLineForMachineCode( 'andnew R1,R5,R15' ) ).toStrictEqual( [ 0xe116, 0x5f10 ] );
      } );

    // ORNEW
      test( 'PARSE LOGICALIASRRR ornew', () => {
        expect( Emulator.parseLineForMachineCode( 'ornew r1,r2,r3' ) ).toStrictEqual( [ 0xe116, 0x2370 ] );
        expect( Emulator.parseLineForMachineCode( 'ornew R1,R5,R15' ) ).toStrictEqual( [ 0xe116, 0x5f70 ] );
      } );

    // XORNEW
      test( 'PARSE LOGICALIASRRR xornew', () => {
        expect( Emulator.parseLineForMachineCode( 'xornew r1,r2,r3' ) ).toStrictEqual( [ 0xe116, 0x2360 ] );
        expect( Emulator.parseLineForMachineCode( 'xornew R1,R5,R15' ) ).toStrictEqual( [ 0xe116, 0x5f60 ] );
      } );

  // LOGICALIASRR
    // INVNEW
      test( 'PARSE LOGICALIASRR invnew', () => {
        expect( Emulator.parseLineForMachineCode( 'invnew r1,r2' ) ).toStrictEqual( [ 0xe116, 0x20c0 ] );
        expect( Emulator.parseLineForMachineCode( 'invnew R1,R15' ) ).toStrictEqual( [ 0xe116, 0xf0c0 ] );
      } );

// RUNNING METHODS
  // SETMEMORY
    test( 'RUN setMemory', () => {
      const machineCode = [ 0xf101, 0x0008, 0xf201, 0x0009, 0x0312, 0xf302, 0x000a, 0xd000, 0x0001, 0x0002, 0x0000 ];
      const memory = {
        0 : 0xf101,
        1 : 0x0008,
        2 : 0xf201,
        3 : 0x0009,
        4 : 0x0312,
        5 : 0xf302,
        6 : 0x000a,
        7 : 0xd000,
        8 : 0x0001,
        9 : 0x0002,
        10 : 0x0000
      };
      expect( Emulator.setMemory( machineCode ) ).toStrictEqual( memory );
    } );

  // runMemory tests are ran with the assumption that they have been checked, then parsed, and set into memory with previosuly tested functions
  // RUNMEMORY
    const runAllCommands = {
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

      jumplt : 'jumpAlias',
      jumpeq : 'jumpAlias',
      jumpgt : 'jumpAlias',
      jumpv : 'jumpAlias',
      jumpvu : 'jumpAlias',
      jumpco : 'jumpAlias',

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

    function fresh() {
      return {
        'registers' : {
          0 : 0,
          1 : 0,
          2 : 0,
          3 : 0,
          4 : 0,
          5 : 0,
          6 : 0,
          7 : 0,
          8 : 0,
          9 : 0,
          10 : 0,
          11 : 0,
          12 : 0,
          13 : 0,
          14 : 0,
          15 : 0
        },
        'memory' : {},
        'control' : {
          'pc' : 0,
          'ir' : 0,
          'adr' : 0
        }
      };
    }

    function updateControl( inputMemory, inputControl ) {
      var outputControl = {};
      outputControl['pc'] = inputControl['pc'] + 1;
      outputControl['ir'] = inputMemory[inputControl['pc']];
      outputControl['adr'] = ( Object.keys( inputMemory ).includes( '' + outputControl['pc'] ) ) ? inputMemory[outputControl['pc']] : 0x0000;

      return outputControl;
    }

    function testFromChanges( inputs, outputs ) {
      // INPUTS
        var testControl = fresh()['control'];
        var testMemory = fresh()['memory'];
        var testRegisters = fresh()['registers'];
        var testInput = 'Hello, Computer!';
        var testOutput = '';

        var i;

        if ( inputs['control'] !== undefined ) {
          for ( i = 0; i < Object.keys( inputs['control'] ).length; i++ ) {
            testControl[ Object.keys( inputs['control'] )[i] ] = inputs['control'][ Object.keys( inputs['control'] )[i] ];
          }
        }

        if ( inputs['registers'] !== undefined ) {
          for ( i = 0; i < Object.keys( inputs['registers'] ).length; i++ ) {
            testRegisters[ Object.keys( inputs['registers'] )[i] ] = inputs['registers'][ Object.keys( inputs['registers'] )[i] ];
          }
        }

        if ( inputs['memory'] !== undefined ) {
          for ( i = 0; i < Object.keys( inputs['memory'] ).length; i++ ) {
            testMemory[ Object.keys( inputs['memory'] )[i] ] = inputs['memory'][ Object.keys( inputs['memory'] )[i] ];
          }
        }

        if ( inputs['input'] !== undefined ) {
          testInput = inputs['input'];
        }

        if ( inputs['output'] !== undefined ) {
          testOutput = inputs['output'];
        }

      // OUTPUTS
        var resultControl = Object.assign( {}, testControl );
        var resultRegisters = Object.assign( {}, testRegisters );
        var resultMemory = Object.assign( {}, testMemory );
        var resultInput = testInput;
        var resultOutput = testOutput;
        var resultHalted = false;

        if ( outputs['registers'] !== undefined ) {
          for ( i = 0; i < Object.keys( outputs['registers'] ).length; i ++ ) {
            resultRegisters[ Object.keys( outputs['registers'] )[i] ] = outputs['registers'][ Object.keys( outputs['registers'] )[i] ];
          }
        }

        if ( outputs['memory'] !== undefined ) {
          for ( i = 0; i < Object.keys( outputs['memory'] ).length; i ++ ) {
            resultMemory[ Object.keys( outputs['memory'] )[i] ] = outputs['memory'][ Object.keys( outputs['memory'] )[i] ];
          }
        }

        if ( outputs['control'] !== undefined ) {
          for ( i = 0; i < Object.keys( outputs['control'] ).length; i ++ ) {
            resultControl[ Object.keys( outputs['control'] )[i] ] = outputs['control'][ Object.keys( outputs['control'] )[i] ];
          }
        }

        if ( outputs['input'] !== undefined ) {
          resultInput = outputs['input'];
        }

        if ( outputs['output'] !== undefined ) {
          resultOutput = outputs['output'];
        }

        if ( outputs['halted'] !== undefined ) {
          resultHalted = outputs['halted'];
        }

      // TESTING
        var parsed = Emulator.runMemory( testControl, testRegisters, testMemory, testInput, testOutput );
        expect( parsed['control'] ).toStrictEqual( resultControl );
        expect( parsed['registers'] ).toStrictEqual( resultRegisters );
        expect( parsed['memory'] ).toStrictEqual( resultMemory );
        expect( parsed['input'] ).toBe( resultInput );
        expect( parsed['output'] ).toBe( resultOutput );
        expect( parsed['halted'] ).toBe( resultHalted );

      return parsed;
    }

    // RR
      test( 'RUN RR inv', () => {
        var inputMemory = fresh()['memory'];
        var inputRegisters = fresh()['registers'];

        inputMemory[0] = 0x8331; // inv r3,r1 <- inv 3,0x0f0f <- r3 := 0xf0f0
        inputMemory[1] = 0x8332; // inv r3,r2 <- inv 3,0x00ff <- r3 := 0xff00

        inputRegisters[1] = 0x0f0f;
        inputRegisters[2] = 0x00ff;

        var results = [
          0xf0f0,
          0xff00
        ];

        var outputControl = updateControl( inputMemory, fresh()['memory'] );
        
        var parsed = {
          'control' : fresh()['control'],
          'registers' : inputRegisters,
          'memory' : inputMemory
        };

        for ( var i = 0; i < Object.keys( inputMemory ).length; i++ ) {
          outputControl = updateControl( inputMemory, parsed['control'] );

          parsed = testFromChanges( parsed,
          {
            'control' : outputControl,
            'registers' : {
              3 : results[i]
            }
          } );
        }
      } );

      test( 'RUN RR cmp', () => {
        var inputMemory = fresh()['memory'];
        var inputRegisters = fresh()['registers'];

        inputMemory[0] = 0x4112; // cmp r1,r2 <- cmp 1,2 <- r15 := 0x1800
        inputMemory[1] = 0x4111; // cmp r1,r1 <- cmp 1,1 <- r15 := 0x2000
        inputMemory[2] = 0x4110; // cmp r1,r0 <- cmp 1,0 <- r15 := 0xc000

        inputMemory[3] = 0x4330; // cmp r3,r0 <- cmp 0xffff,0 <- r15 := 0x9000
        inputMemory[4] = 0x4333; // cmp r3,r3 <- cmp 0xffff,0xffff <- r15 := 0x2000
        inputMemory[5] = 0x4334; // cmp r3,r4 <- cmp 0xffff,0xfffe <- r15 := 0xc000

        inputMemory[6] = 0x4332; // cmp r3,r2 <- cmp 0xffff,2 <- r15 := 0x9000
        inputMemory[7] = 0x4000; // cmp r0,r0 <- cmp 0,0 <- r15 := 0x2000
        inputMemory[8] = 0x4223; // cmp r2,r3 <- cmp 0xffff,2 <- r15 := 0x4800

        inputMemory[9] = 0x4003; // cmp r0,r3 <- cmp 0,0xffff <- r15 := 0x4800

        inputRegisters[1] = 0x0001;
        inputRegisters[2] = 0x0002;
        inputRegisters[3] = 0xffff;
        inputRegisters[4] = 0xfffe;

        var results = [
          0x1800,
          0x2000,
          0xc000,
          0x9000,
          0x2000,
          0xc000,
          0x9000,
          0x2000,
          0x4800,
          0x4800
        ];

        var outputControl = updateControl( inputMemory, fresh()['control'] );
        
        var parsed = {
          'control' : fresh()['control'],
          'registers' : inputRegisters,
          'memory' : inputMemory
        };

        for ( var i = 0; i < Object.keys( inputMemory ).length; i++ ) {
          outputControl = updateControl( inputMemory, parsed['control'] );

          parsed = testFromChanges( parsed,
          {
            'control' : outputControl,
            'registers' : {
              15 : results[i]
            }
          } );
        }
      } );

    // RRR
      test( 'RUN RRR add', () => {
        var inputMemory = fresh()['memory'];
        var inputRegisters = fresh()['registers'];

        inputMemory[0] = 0x0511; // add r5,r1,r1 <- add 5,1,1 <- r5 := 2, r15 := 0xc000
        inputMemory[1] = 0x0500; // add r5,r0,r0 <- add 5,0,0 <- r5 := 0, r15 := 0x2000
        inputMemory[2] = 0x0503; // add r5,r0,r3 <- add 5,0,0xffff <- r5 := 0xffff, r15 := 0x9000

        inputMemory[3] = 0x0531; // add r5,r3,r1 <- add 5,0xffff,1 <- r5 := 0, r15 := 0x2500 <- ccC, ccV, ccE

        inputMemory[4] = 0x0532; // add r5,r3,r2 <- add 5,0xffff,2 <- r5 := 1, r15 := 0xc500 <- ccC, ccV, ccG, ccg

        inputMemory[5] = 0x0534; // add r5,r3,r4 <- add 5,0xffff,0xfffe <- r5 := 0xfffd, r15 := 0x9500 <- ccC, ccV, ccG, ccl

        inputRegisters[1] = 0x0001;
        inputRegisters[2] = 0x0002;
        inputRegisters[3] = 0xffff;
        inputRegisters[4] = 0xfffe;

        var results = [
          [ 0x0002, 0xc000 ],
          [ 0x0000, 0x2000 ],
          [ 0xffff, 0x9000 ],
          [ 0x0000, 0x2500 ],
          [ 0x0001, 0xc500 ],
          [ 0xfffd, 0x9500 ]
        ];

        var outputControl = updateControl( inputMemory, fresh()['control'] );
        
        var parsed = {
          'control' : fresh()['control'],
          'registers' : inputRegisters,
          'memory' : inputMemory
        };

        for ( var i = 0; i < Object.keys( inputMemory ).length; i++ ) {
          outputControl = updateControl( inputMemory, parsed['control'] );

          parsed = testFromChanges( parsed,
          {
            'control' : outputControl,
            'registers' : {
              5 : results[i][0],
              15 : results[i][1]
            }
          } );
        }
      } );
  
      test( 'RUN RRR sub', () => {
        var inputMemory = fresh()['memory'];
        var inputRegisters = fresh()['registers'];

        inputMemory[0] = 0x1411; // sub r4,r1,r1 <- sub 4,1,1 <- r4 := 0, r15 := 0x2000
        inputMemory[1] = 0x1400; // sub r4,r0,r0 <- sub 4,0,0 <- r4 := 0, r15 := 0x2000
        inputMemory[2] = 0x1402; // sub r4,r0,r2 <- sub 4,0,0xffff <- r4 := 1, r15 := 0xc000

        inputMemory[3] = 0x1422; // sub r4,r2,r2 <- sub 4,0xffff,0xffff <- r4 := 0, r15 := 0x2000
        inputMemory[4] = 0x1423; // sub r4,r2,r3 <- sub 4,0xffff,0xfffe <- r4 := 1, r15 := 0xc000

        inputMemory[5] = 0x1421; // sub r4,r2,r1 <- sub 4,0xffff,1 <- r4 := fffe, r15 := 0x9200 <- ccv, ccG, ccl
        inputMemory[6] = 0x1432; // sub r4,r3,r2 <- sub 4,0xfffe,0xffff <- r4 := ffff, r15 := 0x9200 <- ccv, ccG, ccl

        inputRegisters[1] = 0x0001;
        inputRegisters[2] = 0xffff;
        inputRegisters[3] = 0xfffe;

        var results = [
          [ 0x0000, 0x2000 ],
          [ 0x0000, 0x2000 ],
          [ 0x0001, 0xc000 ],
          [ 0x0000, 0x2000 ],
          [ 0x0001, 0xc000 ],
          [ 0xfffe, 0x9200 ],
          [ 0xffff, 0x9200 ]
        ];

        var outputControl = updateControl( inputMemory, fresh()['control'] );
        
        var parsed = {
          'control' : fresh()['control'],
          'registers' : inputRegisters,
          'memory' : inputMemory
        };

        for ( var i = 0; i < Object.keys( inputMemory ).length; i++ ) {
          outputControl = updateControl( inputMemory, parsed['control'] );

          parsed = testFromChanges( parsed,
          {
            'control' : outputControl,
            'registers' : {
              4 : results[i][0],
              15 : results[i][1]
            }
          } );
        }
      } );

      test( 'RUN RRR mul', () => {
        var inputMemory = fresh()['memory'];
        var inputRegisters = fresh()['registers'];

        inputMemory[0] = 0x2511; // mul r5,r1,r1 <- mul 5,1,1 <- r5 := 1, r15 := 0xc000
        inputMemory[1] = 0x2500; // mul r5,r0,r0 <- mul 5,0,0 <- r5 := 0, r15 := 0x2000
        inputMemory[2] = 0x2501; // mul r5,r0,r1 <- mul 5,0,1 <- r5 := 0, r15 := 0x2000
        inputMemory[3] = 0x2512; // mul r5,r1,r2 <- mul 5,1,2 <- r5 := 2, r15 := 0xc000
        inputMemory[4] = 0x2513; // mul r5,r1,r3 <- mul 5,1,3 <- r5 := 0xffff, r15 := 0x9000
        inputMemory[5] = 0x2523; // mul r5,r2,r3 <- mul 5,2,3 <- r5 := 0xfffe, r15 := 0x9400

        inputMemory[6] = 0x2533; // mul r5,r3,r3 <- mul 5,3,3 <- r5 := 1, r15 := 0xc400 <- ccG, ccg, ccV
        inputMemory[7] = 0x2543; // mul r5,r4,r3 <- mul 5,4,3 <- r5 := 0x0012, r15 := 0xc400 <- ccG, ccg, ccV

        inputRegisters[1] = 0x0001;
        inputRegisters[2] = 0x0002;
        inputRegisters[3] = 0xffff;
        inputRegisters[4] = 0xffee;

        var results = [
          [ 0x0001, 0xc000 ],
          [ 0x0000, 0x2000 ],
          [ 0x0000, 0x2000 ],
          [ 0x0002, 0xc000 ],
          [ 0xffff, 0x9000 ],
          [ 0xfffe, 0x9400 ],
          [ 0x0001, 0xc400 ],
          [ 0x0012, 0xc400 ]
        ];

        var outputControl = updateControl( inputMemory, fresh()['control'] );
        
        var parsed = {
          'control' : fresh()['control'],
          'registers' : inputRegisters,
          'memory' : inputMemory
        };

        for ( var i = 0; i < Object.keys( inputMemory ).length; i++ ) {
          outputControl = updateControl( inputMemory, parsed['control'] );

          parsed = testFromChanges( parsed,
          {
            'control' : outputControl,
            'registers' : {
              5 : results[i][0],
              15 : results[i][1]
            }
          } );
        }
      } );

      test( 'RUN RRR div', () => {
        var inputMemory = fresh()['memory'];
        var inputRegisters = fresh()['registers'];

        inputMemory[0] = 0x3611; // div r6,r1,r1 <- div 6,1,1 <- r6 := 1, r15 := 0x0
        inputMemory[1] = 0x3600; // div r6,r0,r0 <- div 6,0,0 <- r6 := 0, r15 := 0x0
        inputMemory[2] = 0x3610; // div r6,r1,r0 <- div 6,1,0 <- r6 := 1, r15 := 0x0

        inputMemory[3] = 0x3623; // div r6,r2,r3 <- div 6,0x0011,3 <- r6 := 5, r15 := 2
        inputMemory[4] = 0x3f23; // div r15,r2,r3 <- div 15,0x0011,2 <- r6 := 5, r15 := 5

        inputMemory[5] = 0x3643; // div r6,r4,r3 <- div 6,0xffef,3 <- r6 := 0xfffa, r15 := 0xfffe

        inputMemory[6] = 0x3645; // div r6,r4,r5 <- div 6,0xffef,0xfffd <- r6 := 5, r15 := 0xfffe

        inputRegisters[1] = 1;
        inputRegisters[2] = 17;
        inputRegisters[3] = 3;
        inputRegisters[4] = 0xffef;
        inputRegisters[5] = 0xfffd;

        var results = [
          [ 0x0001, 0x0000 ],
          [ 0x0000, 0x0000 ],
          [ 0x0001, 0x0000 ],
          [ 0x0005, 0x0002 ],
          [ 0x0005, 0x0005 ],
          [ 0xfffa, 0xfffe ],
          [ 0x0005, 0xfffe ]
        ];

        var outputControl = updateControl( inputMemory, fresh()['control'] );
        
        var parsed = {
          'control' : fresh()['control'],
          'registers' : inputRegisters,
          'memory' : inputMemory
        };

        for ( var i = 0; i < Object.keys( inputMemory ).length; i++ ) {
          outputControl = updateControl( inputMemory, parsed['control'] );

          parsed = testFromChanges( parsed,
          {
            'control' : outputControl,
            'registers' : {
              6 : results[i][0],
              15 : results[i][1]
            }
          } );
        }
      } );

      test( 'RUN RRR cmplt', () => {
        var inputMemory = fresh()['memory'];
        var inputRegisters = fresh()['registers'];

        inputMemory[0] = 0x5512; // cmplt r5,r1,r2 <- cmplt 5,1,2 <- r5 := 1
        inputMemory[1] = 0x5511; // cmplt r5,r1,r1 <- cmplt 5,1,1 <- r5 := 0
        inputMemory[2] = 0x5521; // cmplt r5,r2,r1 <- cmplt 5,2,1 <- r5 := 0

        inputMemory[3] = 0x5534; // cmplt r5,r3,r4 <- cmplt 5,0xffff,0xfffe <- r5 := 0
        inputMemory[4] = 0x5533; // cmplt r5,r3,r3 <- cmplt 5,0xffff,0xffff <- r5 := 0
        inputMemory[5] = 0x5543; // cmplt r5,r4,r3 <- cmplt 5,0xfffe,0xffff <- r5 := 1
        inputMemory[6] = 0x5530; // cmplt r5,r3,r0 <- cmplt 5,0xffff,0 <- r5 := 1

        inputRegisters[1] = 1;
        inputRegisters[2] = 2;
        inputRegisters[3] = 0xffff;
        inputRegisters[4] = 0xfffe;

        var results = [
          0x0001,
          0x0000,
          0x0000,
          0x0000,
          0x0000,
          0x0001,
          0x0001
        ];

        var outputControl = updateControl( inputMemory, fresh()['control'] );
        
        var parsed = {
          'control' : fresh()['control'],
          'registers' : inputRegisters,
          'memory' : inputMemory
        };

        for ( var i = 0; i < Object.keys( inputMemory ).length; i++ ) {
          outputControl = updateControl( inputMemory, parsed['control'] );

          parsed = testFromChanges( parsed,
          {
            'control' : outputControl,
            'registers' : {
              5 : results[i]
            }
          } );
        }
      } );

      test( 'RUN RRR cmpeq', () => {
        var inputMemory = fresh()['memory'];
        var inputRegisters = fresh()['registers'];

        inputMemory[0] = 0x6512; // cmpeq r5,r1,r2 <- cmpeq 5,1,2 <- r5 := 0
        inputMemory[1] = 0x6511; // cmpeq r5,r1,r1 <- cmpeq 5,1,1 <- r5 := 1
        inputMemory[2] = 0x6521; // cmpeq r5,r2,r1 <- cmpeq 5,2,1 <- r5 := 0

        inputMemory[3] = 0x6534; // cmpeq r5,r3,r4 <- cmpeq 5,0xffff,0xfffe <- r5 := 0
        inputMemory[4] = 0x6533; // cmpeq r5,r3,r3 <- cmpeq 5,0xffff,0xffff <- r5 := 1
        inputMemory[5] = 0x6543; // cmpeq r5,r4,r3 <- cmpeq 5,0xfffe,0xffff <- r5 := 0
        inputMemory[6] = 0x6530; // cmpeq r5,r3,r0 <- cmpeq 5,0xffff,0 <- r5 := 0

        inputRegisters[1] = 1;
        inputRegisters[2] = 2;
        inputRegisters[3] = 0xffff;
        inputRegisters[4] = 0xfffe;

        var results = [
          0x0000,
          0x0001,
          0x0000,
          0x0000,
          0x0001,
          0x0000,
          0x0000
        ];

        var outputControl = updateControl( inputMemory, fresh()['control'] );
        
        var parsed = {
          'control' : fresh()['control'],
          'registers' : inputRegisters,
          'memory' : inputMemory
        };

        for ( var i = 0; i < Object.keys( inputMemory ).length; i++ ) {
          outputControl = updateControl( inputMemory, parsed['control'] );

          parsed = testFromChanges( parsed,
          {
            'control' : outputControl,
            'registers' : {
              5 : results[i]
            }
          } );
        }
      } );

      test( 'RUN RRR cmpgt', () => {
        var inputMemory = fresh()['memory'];
        var inputRegisters = fresh()['registers'];

        inputMemory[0] = 0x7512; // cmpgt r5,r1,r2 <- cmpgt 5,1,2 <- r5 := 0
        inputMemory[1] = 0x7511; // cmpgt r5,r1,r1 <- cmpgt 5,1,1 <- r5 := 0
        inputMemory[2] = 0x7521; // cmpgt r5,r2,r1 <- cmpgt 5,2,1 <- r5 := 1

        inputMemory[3] = 0x7534; // cmpgt r5,r3,r4 <- cmpgt 5,0xffff,0xfffe <- r5 := 1
        inputMemory[4] = 0x7533; // cmpgt r5,r3,r3 <- cmpgt 5,0xffff,0xffff <- r5 := 0
        inputMemory[5] = 0x7543; // cmpgt r5,r4,r3 <- cmpgt 5,0xfffe,0xffff <- r5 := 0
        inputMemory[6] = 0x7530; // cmpgt r5,r3,r0 <- cmpgt 5,0xffff,0 <- r5 := 0

        inputRegisters[1] = 1;
        inputRegisters[2] = 2;
        inputRegisters[3] = 0xffff;
        inputRegisters[4] = 0xfffe;

        var results = [
          0x0000,
          0x0000,
          0x0001,
          0x0001,
          0x0000,
          0x0000,
          0x0000
        ];

        var outputControl = updateControl( inputMemory, fresh()['control'] );
        
        var parsed = {
          'control' : fresh()['control'],
          'registers' : inputRegisters,
          'memory' : inputMemory
        };

        for ( var i = 0; i < Object.keys( inputMemory ).length; i++ ) {
          outputControl = updateControl( inputMemory, parsed['control'] );

          parsed = testFromChanges( parsed,
          {
            'control' : outputControl,
            'registers' : {
              5 : results[i]
            }
          } );
        }
      } );

      test( 'RUN RRR and', () => {
        var inputMemory = fresh()['memory'];
        var inputRegisters = fresh()['registers'];

        inputMemory[0] = 0x9412; // and r4,r1,r2 <- and 4,0x00ff,0x0f0f <- r4 := 0x000f
        inputMemory[1] = 0x9413; // and r4,r1,r3 <- and 4,0x00ff,0xffff <- r4 := 0x00ff
        inputMemory[2] = 0x9410; // and r4,r1,r0 <- and 4,0x00ff,0 <- r4 := 0x0000
        inputMemory[3] = 0x9433; // and r4,r3,r0 <- and 4,0xffff,0xffff <- r4 := 0xffff

        inputRegisters[1] = 0x00ff;
        inputRegisters[2] = 0x0f0f;
        inputRegisters[3] = 0xffff;

        var results = [
          0x000f,
          0x00ff,
          0x0000,
          0xffff
        ];

        var outputControl = updateControl( inputMemory, fresh()['control'] );
        
        var parsed = {
          'control' : fresh()['control'],
          'registers' : inputRegisters,
          'memory' : inputMemory
        };

        for ( var i = 0; i < Object.keys( inputMemory ).length; i++ ) {
          outputControl = updateControl( inputMemory, parsed['control'] );

          parsed = testFromChanges( parsed,
          {
            'control' : outputControl,
            'registers' : {
              4 : results[i]
            }
          } );
        }
      } );

      test( 'RUN RRR or', () => {
        var inputMemory = fresh()['memory'];
        var inputRegisters = fresh()['registers'];

        inputMemory[0] = 0xa412; // or r4,r1,r2 <- or 4,0x00ff,0x0f0f <- r4 := 0x0fff
        inputMemory[1] = 0xa413; // or r4,r1,r3 <- or 4,0x00ff,0xffff <- r4 := 0xffff
        inputMemory[2] = 0xa410; // or r4,r1,r0 <- or 4,0x00ff,0 <- r4 := 0x00ff
        inputMemory[3] = 0xa433; // or r4,r3,r0 <- or 4,0xffff,0xffff <- r4 := 0xffff

        inputRegisters[1] = 0x00ff;
        inputRegisters[2] = 0x0f0f;
        inputRegisters[3] = 0xffff;

        var results = [
          0x0fff,
          0xffff,
          0x00ff,
          0xffff
        ];

        var outputControl = updateControl( inputMemory, fresh()['control'] );
        
        var parsed = {
          'control' : fresh()['control'],
          'registers' : inputRegisters,
          'memory' : inputMemory
        };

        for ( var i = 0; i < Object.keys( inputMemory ).length; i++ ) {
          outputControl = updateControl( inputMemory, parsed['control'] );

          parsed = testFromChanges( parsed,
          {
            'control' : outputControl,
            'registers' : {
              4 : results[i]
            }
          } );
        }
      } );

      test( 'RUN RRR xor', () => {
        var inputMemory = fresh()['memory'];
        var inputRegisters = fresh()['registers'];

        inputMemory[0] = 0xb412; // xor r4,r1,r2 <- xor 4,0x00ff,0x0f0f <- r4 := 0x0ff0
        inputMemory[1] = 0xb413; // xor r4,r1,r3 <- xor 4,0x00ff,0xffff <- r4 := 0xff00
        inputMemory[2] = 0xb410; // xor r4,r1,r0 <- xor 4,0x00ff,0 <- r4 := 0x00ff
        inputMemory[3] = 0xb433; // xor r4,r3,r0 <- xor 4,0xffff,0xffff <- r4 := 0x0000

        inputRegisters[1] = 0x00ff;
        inputRegisters[2] = 0x0f0f;
        inputRegisters[3] = 0xffff;

        var results = [
          0x0ff0,
          0xff00,
          0x00ff,
          0x0000
        ];

        var outputControl = updateControl( inputMemory, fresh()['control'] );
        
        var parsed = {
          'control' : fresh()['control'],
          'registers' : inputRegisters,
          'memory' : inputMemory
        };

        for ( var i = 0; i < Object.keys( inputMemory ).length; i++ ) {
          outputControl = updateControl( inputMemory, parsed['control'] );

          parsed = testFromChanges( parsed,
          {
            'control' : outputControl,
            'registers' : {
              4 : results[i]
            }
          } );
        }
      } );

      test( 'RUN RRR nop', () => {
        var inputMemory = fresh()['memory'];
        var inputRegisters = fresh()['registers'];

        inputMemory[0] = 0xc123; // nop r1,r2,r3 <- nop 1,0x0f0f,0xffff <- NO CHANGE

        inputRegisters[2] = 0x0f0f;
        inputRegisters[3] = 0xffff;

        var outputControl = updateControl( inputMemory, fresh()['control'] );

        var parsed = {
          'control' : fresh()['control'],
          'registers' : inputRegisters,
          'memory' : inputMemory
        };

        for ( var i = 0; i < Object.keys( inputMemory ).length; i++ ) {
          outputControl = updateControl( inputMemory, parsed['control'] );

          parsed = testFromChanges( parsed,
          {
            'control' : outputControl
          } );
        }
      } );

      test( 'RUN RRR trap', () => {
        var inputMemory = fresh()['memory'];
        var inputRegisters = fresh()['registers'];

        inputMemory[0] = 0xd123; // trap r1,r2,r3 <- trap 1,23,16 <- input := '', output := '>>Hello, Computer!', mem[16 -> 31] = charcodes
        inputMemory[1] = 0xd456; // trap r4,r5,r6 <- trap 2,10,13 <- output := '>>Hello, Computer!Hello, World!'
        inputMemory[2] = 0xd000; // trap r0,r0,r0 <- trap 0,0,0 <- halted = true
        inputMemory[3] = 0xd123; // trap r1,r2,r3 <- trap 1,23,16 <- mem[16 -> 31] = 0

        inputMemory[10] = 0x0048; // outputbuffer start -> H
        inputMemory[11] = 0x0065; // -> e
        inputMemory[12] = 0x006c; // -> l
        inputMemory[13] = 0x006c; // -> l
        inputMemory[14] = 0x006f; // -> o
        inputMemory[15] = 0x002c; // -> ,
        inputMemory[16] = 0x0020; // ->  
        inputMemory[17] = 0x0057; // -> W
        inputMemory[18] = 0x006f; // -> o
        inputMemory[19] = 0x0072; // -> r
        inputMemory[20] = 0x006c; // -> l
        inputMemory[21] = 0x0064; // -> d
        inputMemory[22] = 0x0021; // -> !

        inputMemory[23] = 0x0000; // inputbuffer start -> *blank*

        inputRegisters[1] = 1;
        inputRegisters[2] = 23;
        inputRegisters[3] = 16;
        inputRegisters[4] = 2;
        inputRegisters[5] = 10;
        inputRegisters[6] = 13;

        var outputControl = updateControl( inputMemory, fresh()['control'] );

        var parsed = {
          'control' : fresh()['control'],
          'registers' : inputRegisters,
          'memory' : inputMemory,
          'input' : 'Hello, Computer!',
          'output' : ''
        };

        // trap r1,r2,r3
          outputControl = updateControl( inputMemory, parsed['control'] );

          var outputMemory = {
            23 : 0x0048, // -> H
            24 : 0x0065, // -> e
            25 : 0x006c, // -> l
            26 : 0x006c, // -> l
            27 : 0x006f, // -> o
            28 : 0x002c, // -> ,
            29 : 0x0020, // ->  
            30 : 0x0043, // -> C
            31 : 0x006f, // -> o
            32 : 0x006d, // -> m
            33 : 0x0070, // -> p
            34 : 0x0075, // -> u
            35 : 0x0074, // -> t
            36 : 0x0065, // -> e
            37 : 0x0072, // -> r
            38 : 0x0021 // -> !
          };

          parsed = testFromChanges( parsed,
          {
            'control' : outputControl,
            'memory' : outputMemory,
            'input' : '',
            'output' : '>>Hello, Computer!'
          } );

        // trap r4,r5,r6
          outputControl = updateControl( inputMemory, parsed['control'] );

          parsed = testFromChanges( parsed,
          {
            'control' : outputControl,
            'output' : '>>Hello, Computer!Hello, World!'
          } );

        // trap r0,r0,r0
          outputControl = updateControl( inputMemory, parsed['control'] );

          parsed = testFromChanges( parsed,
          {
            'control' : outputControl,
            'halted' : true
          } );

        // trap r1,r2,r3
          outputControl = updateControl( inputMemory, parsed['control'] );

          var outputMemory = {
            23 : 0x0,
            24 : 0x0,
            25 : 0x0,
            26 : 0x0,
            27 : 0x0,
            28 : 0x0,
            29 : 0x0,
            30 : 0x0,
            31 : 0x0,
            32 : 0x0,
            33 : 0x0,
            34 : 0x0,
            35 : 0x0,
            36 : 0x0,
            37 : 0x0,
            38 : 0x0
          };

          console.log( parsed['input'] )

          parsed = testFromChanges( parsed,
          {
            'control' : outputControl,
            'memory' : outputMemory,
            'output' : '>>Hello, Computer!Hello, World!>>'
          } );
      } );










