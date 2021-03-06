/*
  Copyright Jim Carty © 2020

  This file is subject to the terms and conditions defined in file 'LICENSE.txt', which is part of this source code package.
*/

import React from 'react';

import * as Emulator from './Emulator';

// RUN TESTS USING `npm run test` in the `Sigma17/` directory

// SETUP
  const allCommands = ["add", "sub", "mul", "div", "cmp", "cmplt", "cmpeq", "cmpgt", "inv", "and", "or", "xor", "trap", 
                      "lea", "load", "store", "jump", "jumpc0", "jumpc1", "jumpf", "jumpt", "jal", "testset", "jumplt", "jumple", "jumpne", "jumpeq", "jumpge", "jumpgt",
                      "data",
                      "rfi", "save", "restore", "getctl", "putctl", "execute", "push", "pop", "top", "shiftl", "shiftr", "extract", "extracti", "inject", "injecti", "logicw", "logicb", "getbit", "getbiti", "putbit", "putbiti", "field", "andb", "orb", "xorb", "invb", "andnew", "ornew", "xornew", "invnew", "addc"];

  const testLabels = { 
    test : 0x0010,
    Test : 0x0011
  };

  const fullyCompatibleCommands = [
    'add',
    'sub',
    'mul',
    'div',
    'cmp',
    'cmplt',
    'cmpeq',
    'cmpgt',
    'inv',
    'invold',
    'and',
    'andold',
    'or',
    'orold',
    'xor',
    'xorold',
    'trap',

    'lea',
    'load',
    'store',
    'jump',
    'jumpc0',
    'jumpc1',
    'jumpf',
    'jumpt',
    'jal',

    'jumple',
    'jumpne',
    'jumpge',
    'jumpnv',
    'jumpnvu',
    'jumpnco',

    'jumplt',
    'jumpeq',
    'jumpgt',
    'jumpv',
    'jumpvu',
    'jumpco',

    'data',

    'save',
    'restore',

    'shiftl',
    'shiftr',

    'extract',
    'extracti',

    'inject',
    'injecti',
    'logicb',

    'logicw',

    'andb',
    'orb',
    'xorb',

    'invb'
  ];

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

// UTIL FUNCTIONS
  // readSignedHex
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

  // readUnsignedHex
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

  // isValidNumber
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

      expect( Emulator.isValidNumber( '#0' ) ).toBe( true );
      expect( Emulator.isValidNumber( '#1111111111111111' ) ).toBe( true );
      expect( Emulator.isValidNumber( '#11111111' ) ).toBe( true );
      expect( Emulator.isValidNumber( '#1' ) ).toBe( true );
      expect( Emulator.isValidNumber( '#0001' ) ).toBe( true );
      expect( Emulator.isValidNumber( '#00000000000000001' ) ).toBe( true );
    } );

    test( 'UTIL isValidNumber false' , () => {
      expect( Emulator.isValidNumber( 'blah' ) ).toBe( false );
      expect( Emulator.isValidNumber( '-32769' ) ).toBe( false );
      expect( Emulator.isValidNumber( '65536' ) ).toBe( false );

      expect( Emulator.isValidNumber( '$h' ) ).toBe( false );
      expect( Emulator.isValidNumber( '$10000' ) ).toBe( false );
      expect( Emulator.isValidNumber( '1$8000' ) ).toBe( false );
      expect( Emulator.isValidNumber( '-$1' ) ).toBe( false );

      expect( Emulator.isValidNumber( '#2' ) ).toBe( false );
      expect( Emulator.isValidNumber( '#11111111111111111' ) ).toBe( false );
      expect( Emulator.isValidNumber( '1#11111111' ) ).toBe( false );
      expect( Emulator.isValidNumber( '-#1' ) ).toBe( false );
    } );

  // writeHex
    test( 'UTIL writeHex', () => {
      expect( Emulator.writeHex( 0xffff ) ).toBe( 'ffff' );
      expect( Emulator.writeHex( 0x7fff ) ).toBe( '7fff' );
      expect( Emulator.writeHex( 0x1 ) ).toBe( '0001' );
      expect( Emulator.writeHex( 0x0 ) ).toBe( '0000' );
      expect( Emulator.writeHex( 0x10000 ) ).toBe( '10000' );
    } );

// CHECK METHODS
  // checkLine
    // LABELS
      test( 'CHECK label true', () => {
        expect( Emulator.checkLine( 'label' ) ).toBe( true );
        expect( Emulator.checkLine( 'LABEL' ) ).toBe( true );
        expect( Emulator.checkLine( 'label1' ) ).toBe( true );
        expect( Emulator.checkLine( 'LABEL1' ) ).toBe( true );

        expect( Emulator.checkLine( '_label1' ) ).toBe( true );
        expect( Emulator.checkLine( '_LABEL1' ) ).toBe( true );

        expect( Emulator.checkLine( 'lab3l' ) ).toBe( true );
        expect( Emulator.checkLine( 'LAB3L' ) ).toBe( true );
      } );

      test( 'CHECK label false', () => {
        expect( Emulator.checkLine( '1label' ) ).toBe( 'label must start with an alphabet character' );
        expect( Emulator.checkLine( '1LABEL' ) ).toBe( 'label must start with an alphabet character' );

        expect( Emulator.checkLine( '$1label' ) ).toBe( 'label must start with an alphabet character' );
        expect( Emulator.checkLine( '#1label' ) ).toBe( 'label must start with an alphabet character' );
        expect( Emulator.checkLine( '$1LABEL' ) ).toBe( 'label must start with an alphabet character' );
        expect( Emulator.checkLine( '#1LABEL' ) ).toBe( 'label must start with an alphabet character' );

        expect( Emulator.checkLine( 'label$1' ) ).toBe( 'label must not contain "$" or "#" symbols as these denote constants' );
        expect( Emulator.checkLine( 'label#1' ) ).toBe( 'label must not contain "$" or "#" symbols as these denote constants' );
        expect( Emulator.checkLine( 'LABEL$1' ) ).toBe( 'label must not contain "$" or "#" symbols as these denote constants' );
        expect( Emulator.checkLine( 'LABEL#1' ) ).toBe( 'label must not contain "$" or "#" symbols as these denote constants' );

        expect( Emulator.checkLine( 'LABEL<1' ) ).toBe( 'label must be made up of purely alphanumerical characters' );
        expect( Emulator.checkLine( 'LABEL>1' ) ).toBe( 'label must be made up of purely alphanumerical characters' );
      } );

    // COMMANDS
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
          expect( Emulator.checkLine( 'inv R1,r2', testLabels ) ).toBe( true );
          expect( Emulator.checkLine( 'inv R1,R2', testLabels ) ).toBe( true );
          expect( Emulator.checkLine( 'inv r1,R2', testLabels ) ).toBe( true );

          expect( Emulator.checkLine( ' inv r1,r2', testLabels ) ).toBe( true );
          expect( Emulator.checkLine( '     inv r1,r2;comment', testLabels ) ).toBe( true );
          expect( Emulator.checkLine( '     inv r1,r2;comment;doublecomment', testLabels ) ).toBe( true );
        } );

        test( 'CHECK RR false', () => {
          expect( Emulator.checkLine( 'inv R16,r2', testLabels ) ).toBe( 'arguments must be in the form of "Ra,Rb"' );
          expect( Emulator.checkLine( 'inv R-1,R2', testLabels ) ).toBe( 'arguments must be in the form of "Ra,Rb"' );
          expect( Emulator.checkLine( 'inv r$f,R2', testLabels ) ).toBe( 'arguments must be in the form of "Ra,Rb"' );
          expect( Emulator.checkLine( 'inv r#1111,R2', testLabels ) ).toBe( 'arguments must be in the form of "Ra,Rb"' );

          expect( Emulator.checkLine( 'inv R1,r16', testLabels ) ).toBe( 'arguments must be in the form of "Ra,Rb"' );
          expect( Emulator.checkLine( 'inv R1,R-1', testLabels ) ).toBe( 'arguments must be in the form of "Ra,Rb"' );
          expect( Emulator.checkLine( 'inv r1,R$f', testLabels ) ).toBe( 'arguments must be in the form of "Ra,Rb"' );
          expect( Emulator.checkLine( 'inv r1,R#1111', testLabels ) ).toBe( 'arguments must be in the form of "Ra,Rb"' );

          expect( Emulator.checkLine( ' inv r1;r2', testLabels ) ).toBe( 'arguments must be in the form of "Ra,Rb"' );
          expect( Emulator.checkLine( '     inv r1,r2comment', testLabels ) ).toBe( 'arguments must be in the form of "Ra,Rb"' );
          
          expect( Emulator.checkLine( '     inv', testLabels ) ).toBe( 'inv must be followed by 2 registers in form Rx,Rx' );
        } );

      // RRR
        test( 'CHECK RRR true', () => {
          expect( Emulator.checkLine( 'add R1,r2,r3', testLabels ) ).toBe( true );
          expect( Emulator.checkLine( 'add R1,R2,r3', testLabels ) ).toBe( true );
          expect( Emulator.checkLine( 'add r1,R2,R3', testLabels ) ).toBe( true );
          expect( Emulator.checkLine( 'add r1,r2,R3', testLabels ) ).toBe( true );

          expect( Emulator.checkLine( ' add r1,r2,r3' ) ).toBe( true );
          expect( Emulator.checkLine( '     add r1,r2,r3;comment' ) ).toBe( true );
          expect( Emulator.checkLine( '     add r1,r2,r3;comment;doublecomment' ) ).toBe( true );
        } );

        test( 'CHECK RRR false', () => {
          expect( Emulator.checkLine( 'add R16,r2,r3', testLabels ) ).toBe( 'arguments must be in the form of "Rd,Ra,Rb"' );
          expect( Emulator.checkLine( 'add R-1,R2,r3', testLabels ) ).toBe( 'arguments must be in the form of "Rd,Ra,Rb"' );
          expect( Emulator.checkLine( 'add r$f,R2,R3', testLabels ) ).toBe( 'arguments must be in the form of "Rd,Ra,Rb"' );
          expect( Emulator.checkLine( 'add r#1111,R2,R3', testLabels ) ).toBe( 'arguments must be in the form of "Rd,Ra,Rb"' );

          expect( Emulator.checkLine( 'add R1,r2,r16', testLabels ) ).toBe( 'arguments must be in the form of "Rd,Ra,Rb"' );
          expect( Emulator.checkLine( 'add R1,R2,r-1', testLabels ) ).toBe( 'arguments must be in the form of "Rd,Ra,Rb"' );
          expect( Emulator.checkLine( 'add r1,R2,R$f', testLabels ) ).toBe( 'arguments must be in the form of "Rd,Ra,Rb"' );
          expect( Emulator.checkLine( 'add r1,R2,R#1111', testLabels ) ).toBe( 'arguments must be in the form of "Rd,Ra,Rb"' );

          expect( Emulator.checkLine( 'add R1,r16,r3', testLabels ) ).toBe( 'arguments must be in the form of "Rd,Ra,Rb"' );
          expect( Emulator.checkLine( 'add R1,R-1,r3', testLabels ) ).toBe( 'arguments must be in the form of "Rd,Ra,Rb"' );
          expect( Emulator.checkLine( 'add r1,R$f,R3', testLabels ) ).toBe( 'arguments must be in the form of "Rd,Ra,Rb"' );
          expect( Emulator.checkLine( 'add r1,R#1111,R3', testLabels ) ).toBe( 'arguments must be in the form of "Rd,Ra,Rb"' );

          expect( Emulator.checkLine( ' add r1;r2,r3', testLabels ) ).toBe( 'arguments must be in the form of "Rd,Ra,Rb"' );
          expect( Emulator.checkLine( '     add r1,r2,r3comment', testLabels ) ).toBe( 'arguments must be in the form of "Rd,Ra,Rb"' );
          
          expect( Emulator.checkLine( '     add', testLabels ) ).toBe( 'add must be followed by 3 registers in form Rx,Rx,Rx' );
        } );

      // RX
        test( 'CHECK RX true', () => {
          expect( Emulator.checkLine( 'lea r1,test[r0]', testLabels ) ).toBe( true );
          expect( Emulator.checkLine( 'lea R1,test[R0]', testLabels ) ).toBe( true );
          expect( Emulator.checkLine( 'lea r1,test[R0]', testLabels ) ).toBe( true );
          expect( Emulator.checkLine( 'lea R1,test[r0]', testLabels ) ).toBe( true );

          expect( Emulator.checkLine( 'lea r1,-1[r0]', testLabels ) ).toBe( true );
          expect( Emulator.checkLine( 'lea R1,$ffff[R0]', testLabels ) ).toBe( true );
          expect( Emulator.checkLine( 'lea R1,#1111111111111111[R0]', testLabels ) ).toBe( true );
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
          expect( Emulator.checkLine( 'lea r#1111,test[r0]', testLabels ) ).toBe( 'arguments must be in the form of "Rd,disp[Ra]"' );

          expect( Emulator.checkLine( 'lea r1,test[r16]', testLabels ) ).toBe( 'arguments must be in the form of "Rd,disp[Ra]"' );
          expect( Emulator.checkLine( 'lea r1,test[r-1]', testLabels ) ).toBe( 'arguments must be in the form of "Rd,disp[Ra]"' );
          expect( Emulator.checkLine( 'lea r1,test[r$f]', testLabels ) ).toBe( 'arguments must be in the form of "Rd,disp[Ra]"' );
          expect( Emulator.checkLine( 'lea r1,test[r#1111]', testLabels ) ).toBe( 'arguments must be in the form of "Rd,disp[Ra]"' );

          expect( Emulator.checkLine( 'lea r1,notest[r0]', testLabels ) ).toBe( 'disp argument must either be a decimal, a hex, binary, or, an initailised label' );
          expect( Emulator.checkLine( 'lea r1,65536[r0]', testLabels ) ).toBe( 'disp argument must either be a decimal, a hex, binary, or, an initailised label' );
          expect( Emulator.checkLine( 'lea r1,-32769[r0]', testLabels ) ).toBe( 'disp argument must either be a decimal, a hex, binary, or, an initailised label' );
          expect( Emulator.checkLine( 'lea r1,$10000[r0]', testLabels ) ).toBe( 'disp argument must either be a decimal, a hex, binary, or, an initailised label' );
          expect( Emulator.checkLine( 'lea r1,#11111111111111111[r0]', testLabels ) ).toBe( 'disp argument must either be a decimal, a hex, binary, or, an initailised label' );

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
          expect( Emulator.checkLine( 'jump #1111111111111111[R0]', testLabels ) ).toBe( true );
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
          expect( Emulator.checkLine( 'jump test[r$#1111]', testLabels ) ).toBe( 'arguments must be in the form of "disp[Ra]"' );

          expect( Emulator.checkLine( 'jump notest[r0]', testLabels ) ).toBe( 'disp argument must either be a decimal, a hex, binary, or, an initailised label' );
          expect( Emulator.checkLine( 'jump 65536[r0]', testLabels ) ).toBe( 'disp argument must either be a decimal, a hex, binary, or, an initailised label' );
          expect( Emulator.checkLine( 'jump -32769[r0]', testLabels ) ).toBe( 'disp argument must either be a decimal, a hex, binary, or, an initailised label' );
          expect( Emulator.checkLine( 'jump $10000[r0]', testLabels ) ).toBe( 'disp argument must either be a decimal, a hex, binary, or, an initailised label' );
          expect( Emulator.checkLine( 'jump #11111111111111111[r0]', testLabels ) ).toBe( 'disp argument must either be a decimal, a hex, binary, or, an initailised label' );

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
          expect( Emulator.checkLine( 'jumpc0 15,#1111111111111111[R0]', testLabels ) ).toBe( true );
          expect( Emulator.checkLine( 'jumpc0 $f,14[R0]', testLabels ) ).toBe( true );
          expect( Emulator.checkLine( 'jumpc0 #1111,14[R0]', testLabels ) ).toBe( true );
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

          expect( Emulator.checkLine( 'jumpc0 16,test[r0]', testLabels ) ).toBe( 'k argument must either be a decimal, hex, or, binary value between 0 and 15, negative integers not allowed' );
          expect( Emulator.checkLine( 'jumpc0 -1,test[r0]', testLabels ) ).toBe( 'arguments must be in the form of "k,disp[Ra]", negative integers not allowed for k argument' );
          expect( Emulator.checkLine( 'jumpc0 $10,test[r0]', testLabels ) ).toBe( 'k argument must either be a decimal, hex, or, binary value between 0 and 15, negative integers not allowed' );
          expect( Emulator.checkLine( 'jumpc0 #10000,test[r0]', testLabels ) ).toBe( 'k argument must either be a decimal, hex, or, binary value between 0 and 15, negative integers not allowed' );

          expect( Emulator.checkLine( 'jumpc0 1,test[r16]', testLabels ) ).toBe( 'arguments must be in the form of "k,disp[Ra]", negative integers not allowed for k argument' );
          expect( Emulator.checkLine( 'jumpc0 1,test[r-1]', testLabels ) ).toBe( 'arguments must be in the form of "k,disp[Ra]", negative integers not allowed for k argument' );
          expect( Emulator.checkLine( 'jumpc0 1,test[r$f]', testLabels ) ).toBe( 'arguments must be in the form of "k,disp[Ra]", negative integers not allowed for k argument' );
          expect( Emulator.checkLine( 'jumpc0 1,test[r#1111]', testLabels ) ).toBe( 'arguments must be in the form of "k,disp[Ra]", negative integers not allowed for k argument' );

          expect( Emulator.checkLine( 'jumpc0 1,notest[r0]', testLabels ) ).toBe( 'disp argument must either be a decimal, hex, binary, or, an initailised label' );
          expect( Emulator.checkLine( 'jumpc0 1,65536[r0]', testLabels ) ).toBe( 'disp argument must either be a decimal, hex, binary, or, an initailised label' );
          expect( Emulator.checkLine( 'jumpc0 1,-32769[r0]', testLabels ) ).toBe( 'disp argument must either be a decimal, hex, binary, or, an initailised label' );
          expect( Emulator.checkLine( 'jumpc0 1,$10000[r0]', testLabels ) ).toBe( 'disp argument must either be a decimal, hex, binary, or, an initailised label' );
          expect( Emulator.checkLine( 'jumpc0 1,#11111111111111111[r0]', testLabels ) ).toBe( 'disp argument must either be a decimal, hex, binary, or, an initailised label' );

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
          expect( Emulator.checkLine( 'jumple #1111111111111111[R0]', testLabels ) ).toBe( true );
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
          expect( Emulator.checkLine( 'jumple test[r#1111]', testLabels ) ).toBe( 'arguments must be in the form of "disp[Ra]"' );

          expect( Emulator.checkLine( 'jumple notest[r0]', testLabels ) ).toBe( 'disp argument must either be a decimal, a hex, binary, or, an initailised label' );
          expect( Emulator.checkLine( 'jumple 65536[r0]', testLabels ) ).toBe( 'disp argument must either be a decimal, a hex, binary, or, an initailised label' );
          expect( Emulator.checkLine( 'jumple -32769[r0]', testLabels ) ).toBe( 'disp argument must either be a decimal, a hex, binary, or, an initailised label' );
          expect( Emulator.checkLine( 'jumple $10000[r0]', testLabels ) ).toBe( 'disp argument must either be a decimal, a hex, binary, or, an initailised label' );
          expect( Emulator.checkLine( 'jumple #11111111111111111[r0]', testLabels ) ).toBe( 'disp argument must either be a decimal, a hex, binary, or, an initailised label' );

          expect( Emulator.checkLine( ' jumple test;[r0]', testLabels ) ).toBe( 'arguments must be in the form of "disp[Ra]"' );
          expect( Emulator.checkLine( '     jumple test[r0]comment', testLabels ) ).toBe( 'arguments must be in the form of "disp[Ra]"' );
          expect( Emulator.checkLine( '     jumple test[r0]comment;doublecomment', testLabels ) ).toBe( 'arguments must be in the form of "disp[Ra]"' );
        } );

      // X
        test( 'CHECK X true', () => {
          expect( Emulator.checkLine( 'data -1' ) ).toBe( true );
          expect( Emulator.checkLine( 'data $ffff' ) ).toBe( true );
          expect( Emulator.checkLine( 'data #1111111111111111' ) ).toBe( true );
          expect( Emulator.checkLine( 'data 14' ) ).toBe( true );
          expect( Emulator.checkLine( 'data $23' ) ).toBe( true );

          expect( Emulator.checkLine( ' data $01' ) ).toBe( true );
          expect( Emulator.checkLine( '     data $01;comment' ) ).toBe( true );
          expect( Emulator.checkLine( '     data $01;comment;doublecomment' ) ).toBe( true );
        } );

        test( 'CHECK X false', () => {
          expect( Emulator.checkLine( 'data #11111111111111111' ) ).toBe( 'data must be followed by either a decimal or hex number <= 65535 and >=-32768' );
          expect( Emulator.checkLine( 'data $10000' ) ).toBe( 'data must be followed by either a decimal or hex number <= 65535 and >=-32768' );
          expect( Emulator.checkLine( 'data $-12' ) ).toBe( 'arguments must be in the form of "constant" up to 65535 and down to -32768' );
          expect( Emulator.checkLine( 'data 65536' ) ).toBe( 'data must be followed by either a decimal or hex number <= 65535 and >=-32768' );
          expect( Emulator.checkLine( 'data -32769' ) ).toBe( 'data must be followed by either a decimal or hex number <= 65535 and >=-32768' );

          expect( Emulator.checkLine( '     data $01comment' ) ).toBe( 'arguments must be in the form of "constant" up to 65535 and down to -32768' );
          expect( Emulator.checkLine( '     data $01comment;doublecomment' ) ).toBe( 'arguments must be in the form of "constant" up to 65535 and down to -32768' );
        } );

      // NOEXP
        test( 'CHECK NOEXP true', () => {
          expect( Emulator.checkLine( 'rfi' ) ).toBe( true );
          expect( Emulator.checkLine( 'rfi -1' ) ).toBe( true );
          expect( Emulator.checkLine( 'rfi $ffff' ) ).toBe( true );
          expect( Emulator.checkLine( 'rfi #1111111111111111' ) ).toBe( true );
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
          expect( Emulator.checkLine( 'execute r1,R#1111' ) ).toBe( 'arguments must be in the form of "Ra,Rb"' );

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
          expect( Emulator.checkLine( 'save R1,r2,#11111111[R0]', testLabels ) ).toBe( true );
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
          expect( Emulator.checkLine( 'save r#1111,r2,$ff[r0]', testLabels ) ).toBe( 'arguments must be in the form of "Re,Rf,disp[Rd]", negative integers not allowed' );

          expect( Emulator.checkLine( 'save r1,r16,$ff[r0]', testLabels ) ).toBe( 'arguments must be in the form of "Re,Rf,disp[Rd]", negative integers not allowed' );
          expect( Emulator.checkLine( 'save r1,r-1,$ff[r0]', testLabels ) ).toBe( 'arguments must be in the form of "Re,Rf,disp[Rd]", negative integers not allowed' );
          expect( Emulator.checkLine( 'save r1,r$f,$ff[r0]', testLabels ) ).toBe( 'arguments must be in the form of "Re,Rf,disp[Rd]", negative integers not allowed' );
          expect( Emulator.checkLine( 'save r1,r#1111,$ff[r0]', testLabels ) ).toBe( 'arguments must be in the form of "Re,Rf,disp[Rd]", negative integers not allowed' );

          expect( Emulator.checkLine( 'save r1,r2,$ff[r16]', testLabels ) ).toBe( 'arguments must be in the form of "Re,Rf,disp[Rd]", negative integers not allowed' );
          expect( Emulator.checkLine( 'save r1,r2,$ff[r-1]', testLabels ) ).toBe( 'arguments must be in the form of "Re,Rf,disp[Rd]", negative integers not allowed' );
          expect( Emulator.checkLine( 'save r1,r2,$ff[r$f]', testLabels ) ).toBe( 'arguments must be in the form of "Re,Rf,disp[Rd]", negative integers not allowed' );
          expect( Emulator.checkLine( 'save r1,r2,$ff[r#1111]', testLabels ) ).toBe( 'arguments must be in the form of "Re,Rf,disp[Rd]", negative integers not allowed' );

          expect( Emulator.checkLine( 'save r1,r2,256[r0]', testLabels ) ).toBe( 'disp argument must either be a decimal, hex, or, binary with decimal values between 0 and 255' );
          expect( Emulator.checkLine( 'save r1,r2,-1[r0]', testLabels ) ).toBe( 'arguments must be in the form of "Re,Rf,disp[Rd]", negative integers not allowed' );

          expect( Emulator.checkLine( 'save r1,r2,$100[r0]', testLabels ) ).toBe( 'disp argument must either be a decimal, hex, or, binary with decimal values between 0 and 255' );
          expect( Emulator.checkLine( 'save r1,r2,$-1[r0]', testLabels ) ).toBe( 'arguments must be in the form of "Re,Rf,disp[Rd]", negative integers not allowed' );

          expect( Emulator.checkLine( 'save r1,r2,#100000000[r0]', testLabels ) ).toBe( 'disp argument must either be a decimal, hex, or, binary with decimal values between 0 and 255' );
          expect( Emulator.checkLine( 'save r1,r2,#-1[r0]', testLabels ) ).toBe( 'arguments must be in the form of "Re,Rf,disp[Rd]", negative integers not allowed' );

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
          expect( Emulator.checkLine( 'getctl r#1111,pc' ) ).toBe( 'arguments must be in the form of "Rd,controlRegisterName"' );

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
          expect( Emulator.checkLine( 'push r#1111,R2,R3' ) ).toBe( 'arguments must be in the form of "Rd,Ra,Rb"' );

          expect( Emulator.checkLine( 'push R1,r2,r16' ) ).toBe( 'arguments must be in the form of "Rd,Ra,Rb"' );
          expect( Emulator.checkLine( 'push R1,R2,r-1' ) ).toBe( 'arguments must be in the form of "Rd,Ra,Rb"' );
          expect( Emulator.checkLine( 'push r1,R2,R$f' ) ).toBe( 'arguments must be in the form of "Rd,Ra,Rb"' );
          expect( Emulator.checkLine( 'push r1,R2,R#1111' ) ).toBe( 'arguments must be in the form of "Rd,Ra,Rb"' );

          expect( Emulator.checkLine( 'push R1,r16,r3' ) ).toBe( 'arguments must be in the form of "Rd,Ra,Rb"' );
          expect( Emulator.checkLine( 'push R1,R-1,r3' ) ).toBe( 'arguments must be in the form of "Rd,Ra,Rb"' );
          expect( Emulator.checkLine( 'push r1,R$f,R3' ) ).toBe( 'arguments must be in the form of "Rd,Ra,Rb"' );
          expect( Emulator.checkLine( 'push r1,R#1111,R3' ) ).toBe( 'arguments must be in the form of "Rd,Ra,Rb"' );

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
          expect( Emulator.checkLine( 'shiftl r1,r2,#1111', testLabels ) ).toBe( true );
          expect( Emulator.checkLine( 'shiftl r1,r2,4', testLabels ) ).toBe( true );

          expect( Emulator.checkLine( ' shiftl r1,r2,1', testLabels ) ).toBe( true );
          expect( Emulator.checkLine( '     shiftl r1,r2,1;comment', testLabels ) ).toBe( true );
          expect( Emulator.checkLine( '     shiftl r1,r2,1;comment;doublecomment', testLabels ) ).toBe( true );
        } );

        test( 'CHECK RRKEXP false', () => {
          expect( Emulator.checkLine( 'shiftl 1', testLabels ) ).toBe( 'arguments must be in the form of "Rd,Re,g", negative integers not allowed' );
          expect( Emulator.checkLine( 'shiftl r2,2', testLabels ) ).toBe( 'arguments must be in the form of "Rd,Re,g", negative integers not allowed' );
          expect( Emulator.checkLine( 'shiftl r1,r2', testLabels ) ).toBe( 'arguments must be in the form of "Rd,Re,g", negative integers not allowed' );

          expect( Emulator.checkLine( 'shiftl r1,r2,16', testLabels ) ).toBe( 'g argument must either be a decimal, hex, or, binary value between 0 and 15' );
          expect( Emulator.checkLine( 'shiftl r1,r2,-1', testLabels ) ).toBe( 'arguments must be in the form of "Rd,Re,g", negative integers not allowed' );
          expect( Emulator.checkLine( 'shiftl r1,r2,$10', testLabels ) ).toBe( 'g argument must either be a decimal, hex, or, binary value between 0 and 15' );
          expect( Emulator.checkLine( 'shiftl r1,r2,#10000', testLabels ) ).toBe( 'g argument must either be a decimal, hex, or, binary value between 0 and 15' );

          expect( Emulator.checkLine( 'shiftl r16,r2,1', testLabels ) ).toBe( 'arguments must be in the form of "Rd,Re,g", negative integers not allowed' );
          expect( Emulator.checkLine( 'shiftl r-1,r2,1', testLabels ) ).toBe( 'arguments must be in the form of "Rd,Re,g", negative integers not allowed' );
          expect( Emulator.checkLine( 'shiftl r$f,r2,1', testLabels ) ).toBe( 'arguments must be in the form of "Rd,Re,g", negative integers not allowed' );
          expect( Emulator.checkLine( 'shiftl r#1111,r2,1', testLabels ) ).toBe( 'arguments must be in the form of "Rd,Re,g", negative integers not allowed' );

          expect( Emulator.checkLine( 'shiftl r1,r16,1', testLabels ) ).toBe( 'arguments must be in the form of "Rd,Re,g", negative integers not allowed' );
          expect( Emulator.checkLine( 'shiftl r1,r-1,1', testLabels ) ).toBe( 'arguments must be in the form of "Rd,Re,g", negative integers not allowed' );
          expect( Emulator.checkLine( 'shiftl r1,r$f,1', testLabels ) ).toBe( 'arguments must be in the form of "Rd,Re,g", negative integers not allowed' );
          expect( Emulator.checkLine( 'shiftl r1,r#1111,1', testLabels ) ).toBe( 'arguments must be in the form of "Rd,Re,g", negative integers not allowed' );

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
          expect( Emulator.checkLine( 'getbit r1,#1111', testLabels ) ).toBe( true );

          expect( Emulator.checkLine( ' getbit r1,1', testLabels ) ).toBe( true );
          expect( Emulator.checkLine( '     getbit r1,1;comment', testLabels ) ).toBe( true );
          expect( Emulator.checkLine( '     getbit r1,1;comment;doublecomment', testLabels ) ).toBe( true );
        } );

        test( 'CHECK RKEXP false', () => {
          expect( Emulator.checkLine( 'getbit 1', testLabels ) ).toBe( 'arguments must be in the form of "Rd,g", negative integers not allowed' );

          expect( Emulator.checkLine( 'getbit r1,16', testLabels ) ).toBe( 'g argument must either be a decimal, hex, or, binary value between 0 and 15' );
          expect( Emulator.checkLine( 'getbit r1,-1', testLabels ) ).toBe( 'arguments must be in the form of "Rd,g", negative integers not allowed' );
          expect( Emulator.checkLine( 'getbit r1,$10', testLabels ) ).toBe( 'g argument must either be a decimal, hex, or, binary value between 0 and 15' );
          expect( Emulator.checkLine( 'getbit r1,#10000', testLabels ) ).toBe( 'g argument must either be a decimal, hex, or, binary value between 0 and 15' );

          expect( Emulator.checkLine( 'getbit r16,1', testLabels ) ).toBe( 'arguments must be in the form of "Rd,g", negative integers not allowed' );
          expect( Emulator.checkLine( 'getbit r-1,1', testLabels ) ).toBe( 'arguments must be in the form of "Rd,g", negative integers not allowed' );
          expect( Emulator.checkLine( 'getbit r$f,1', testLabels ) ).toBe( 'arguments must be in the form of "Rd,g", negative integers not allowed' );
          expect( Emulator.checkLine( 'getbit r#1111,1', testLabels ) ).toBe( 'arguments must be in the form of "Rd,g", negative integers not allowed' );

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
          expect( Emulator.checkLine( 'field r1,#1111,0', testLabels ) ).toBe( true );

          expect( Emulator.checkLine( 'field r1,0,15', testLabels ) ).toBe( true );
          expect( Emulator.checkLine( 'field r1,0,$f', testLabels ) ).toBe( true );
          expect( Emulator.checkLine( 'field r1,0,#1111', testLabels ) ).toBe( true );

          expect( Emulator.checkLine( ' field r1,1,1', testLabels ) ).toBe( true );
          expect( Emulator.checkLine( '     field r1,1,1;comment', testLabels ) ).toBe( true );
          expect( Emulator.checkLine( '     field r1,1,1;comment;doublecomment', testLabels ) ).toBe( true );
        } );

        test( 'CHECK INJECTIALIAS false', () => {
          expect( Emulator.checkLine( 'field 1', testLabels ) ).toBe( 'arguments must be in the form of "Rd,g,h", negative integers not allowed' );
          expect( Emulator.checkLine( 'field 1,1', testLabels ) ).toBe( 'arguments must be in the form of "Rd,g,h", negative integers not allowed' );
          expect( Emulator.checkLine( 'field r1,1', testLabels ) ).toBe( 'arguments must be in the form of "Rd,g,h", negative integers not allowed' );

          expect( Emulator.checkLine( 'field r1,16,0', testLabels ) ).toBe( 'g argument must either be a decimal, hex, or, binary value between 0 and 15' );
          expect( Emulator.checkLine( 'field r1,-1,0', testLabels ) ).toBe( 'arguments must be in the form of "Rd,g,h", negative integers not allowed' );
          expect( Emulator.checkLine( 'field r1,$10,0', testLabels ) ).toBe( 'g argument must either be a decimal, hex, or, binary value between 0 and 15' );
          expect( Emulator.checkLine( 'field r1,#10000,0', testLabels ) ).toBe( 'g argument must either be a decimal, hex, or, binary value between 0 and 15' );

          expect( Emulator.checkLine( 'field r1,0,16', testLabels ) ).toBe( 'h argument must either be a decimal, hex, or, binary value between 0 and 15' );
          expect( Emulator.checkLine( 'field r1,0,-1', testLabels ) ).toBe( 'arguments must be in the form of "Rd,g,h", negative integers not allowed' );
          expect( Emulator.checkLine( 'field r1,0,$10', testLabels ) ).toBe( 'h argument must either be a decimal, hex, or, binary value between 0 and 15' );
          expect( Emulator.checkLine( 'field r1,0,#10000', testLabels ) ).toBe( 'h argument must either be a decimal, hex, or, binary value between 0 and 15' );

          expect( Emulator.checkLine( 'field r16,1,1', testLabels ) ).toBe( 'arguments must be in the form of "Rd,g,h", negative integers not allowed' );
          expect( Emulator.checkLine( 'field r-1,1,1', testLabels ) ).toBe( 'arguments must be in the form of "Rd,g,h", negative integers not allowed' );
          expect( Emulator.checkLine( 'field r$f,1,1', testLabels ) ).toBe( 'arguments must be in the form of "Rd,g,h", negative integers not allowed' );
          expect( Emulator.checkLine( 'field r#1111,1,1', testLabels ) ).toBe( 'arguments must be in the form of "Rd,g,h", negative integers not allowed' );

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
          expect( Emulator.checkLine( 'extract r1,R2,#1111,0' ) ).toBe( true );

          expect( Emulator.checkLine( 'extract R1,R2,0,15' ) ).toBe( true );
          expect( Emulator.checkLine( 'extract r1,R2,0,$f' ) ).toBe( true );
          expect( Emulator.checkLine( 'extract r1,R2,0,#1111' ) ).toBe( true );

          expect( Emulator.checkLine( ' extract r1,r2,0,0' ) ).toBe( true );
          expect( Emulator.checkLine( '     extract r1,r2,0,0;comment' ) ).toBe( true );
          expect( Emulator.checkLine( '     extract r1,r2,0,0;comment;doublecomment' ) ).toBe( true );
        } );

        test( 'CHECK RRKKEXP false', () => {
          expect( Emulator.checkLine( 'extract R16,r2,0,0' ) ).toBe( 'arguments must be in the form of "Rd,Re,g,h", negative integers not allowed' );
          expect( Emulator.checkLine( 'extract R-1,R2,0,0' ) ).toBe( 'arguments must be in the form of "Rd,Re,g,h", negative integers not allowed' );
          expect( Emulator.checkLine( 'extract r$f,R2,0,0' ) ).toBe( 'arguments must be in the form of "Rd,Re,g,h", negative integers not allowed' );
          expect( Emulator.checkLine( 'extract r#1111,R2,0,0' ) ).toBe( 'arguments must be in the form of "Rd,Re,g,h", negative integers not allowed' );

          expect( Emulator.checkLine( 'extract R1,r16,0,0' ) ).toBe( 'arguments must be in the form of "Rd,Re,g,h", negative integers not allowed' );
          expect( Emulator.checkLine( 'extract R1,R-1,0,0' ) ).toBe( 'arguments must be in the form of "Rd,Re,g,h", negative integers not allowed' );
          expect( Emulator.checkLine( 'extract r1,R$f,0,0' ) ).toBe( 'arguments must be in the form of "Rd,Re,g,h", negative integers not allowed' );
          expect( Emulator.checkLine( 'extract r1,R#1111,0,0' ) ).toBe( 'arguments must be in the form of "Rd,Re,g,h", negative integers not allowed' );

          expect( Emulator.checkLine( 'extract R1,r1,16,0' ) ).toBe( 'g argument must either be a decimal, hex, or, binary value between 0 and 15, negative integers not allowed' );
          expect( Emulator.checkLine( 'extract R1,r1,$10,0' ) ).toBe( 'g argument must either be a decimal, hex, or, binary value between 0 and 15, negative integers not allowed' );
          expect( Emulator.checkLine( 'extract R1,r1,#10000,0' ) ).toBe( 'g argument must either be a decimal, hex, or, binary value between 0 and 15, negative integers not allowed' );
          expect( Emulator.checkLine( 'extract r1,r1,-1,0' ) ).toBe( 'arguments must be in the form of "Rd,Re,g,h", negative integers not allowed' );

          expect( Emulator.checkLine( 'extract R1,r1,0,16' ) ).toBe( 'h argument must either be a decimal, hex, or, binary value between 0 and 15, negative integers not allowed' );
          expect( Emulator.checkLine( 'extract R1,r1,0,$10' ) ).toBe( 'h argument must either be a decimal, hex, or, binary value between 0 and 15, negative integers not allowed' );
          expect( Emulator.checkLine( 'extract R1,r1,0,#10000' ) ).toBe( 'h argument must either be a decimal, hex, or, binary value between 0 and 15, negative integers not allowed' );
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
          expect( Emulator.checkLine( 'inject r1,R2,r3,#1111,0' ) ).toBe( true );

          expect( Emulator.checkLine( 'inject R1,R2,r3,0,15' ) ).toBe( true );
          expect( Emulator.checkLine( 'inject r1,R2,r3,0,$f' ) ).toBe( true );
          expect( Emulator.checkLine( 'inject r1,R2,r3,0,#1111' ) ).toBe( true );

          expect( Emulator.checkLine( ' inject r1,r2,r3,0,0' ) ).toBe( true );
          expect( Emulator.checkLine( '     inject r1,r2,r3,0,0;comment' ) ).toBe( true );
          expect( Emulator.checkLine( '     inject r1,r2,r3,0,0;comment;doublecomment' ) ).toBe( true );
        } );

        test( 'CHECK RRRKKEXP false', () => {
          expect( Emulator.checkLine( 'inject R16,r2,r3,0,0' ) ).toBe( 'arguments must be in the form of "Rd,Re,Rf,g,h", negative integers not allowed' );
          expect( Emulator.checkLine( 'inject R-1,R2,r3,0,0' ) ).toBe( 'arguments must be in the form of "Rd,Re,Rf,g,h", negative integers not allowed' );
          expect( Emulator.checkLine( 'inject r$f,R2,r3,0,0' ) ).toBe( 'arguments must be in the form of "Rd,Re,Rf,g,h", negative integers not allowed' );
          expect( Emulator.checkLine( 'inject r#1111,R2,r3,0,0' ) ).toBe( 'arguments must be in the form of "Rd,Re,Rf,g,h", negative integers not allowed' );

          expect( Emulator.checkLine( 'inject R1,r16,r3,0,0' ) ).toBe( 'arguments must be in the form of "Rd,Re,Rf,g,h", negative integers not allowed' );
          expect( Emulator.checkLine( 'inject R1,R-1,r3,0,0' ) ).toBe( 'arguments must be in the form of "Rd,Re,Rf,g,h", negative integers not allowed' );
          expect( Emulator.checkLine( 'inject r1,R$f,r3,0,0' ) ).toBe( 'arguments must be in the form of "Rd,Re,Rf,g,h", negative integers not allowed' );
          expect( Emulator.checkLine( 'inject r1,R#1111,r3,0,0' ) ).toBe( 'arguments must be in the form of "Rd,Re,Rf,g,h", negative integers not allowed' );

          expect( Emulator.checkLine( 'inject R1,r1,r16,0,0' ) ).toBe( 'arguments must be in the form of "Rd,Re,Rf,g,h", negative integers not allowed' );
          expect( Emulator.checkLine( 'inject R1,R1,r-1,0,0' ) ).toBe( 'arguments must be in the form of "Rd,Re,Rf,g,h", negative integers not allowed' );
          expect( Emulator.checkLine( 'inject r1,R1,r$f,0,0' ) ).toBe( 'arguments must be in the form of "Rd,Re,Rf,g,h", negative integers not allowed' );
          expect( Emulator.checkLine( 'inject r1,R1,r#1111,0,0' ) ).toBe( 'arguments must be in the form of "Rd,Re,Rf,g,h", negative integers not allowed' );

          expect( Emulator.checkLine( 'inject R1,r1,r3,16,0' ) ).toBe( 'g argument must either be a decimal, hex, or, binary value between 0 and 15, negative integers not allowed' );
          expect( Emulator.checkLine( 'inject R1,r1,r3,$10,0' ) ).toBe( 'g argument must either be a decimal, hex, or, binary value between 0 and 15, negative integers not allowed' );
          expect( Emulator.checkLine( 'inject R1,r1,r3,#10000,0' ) ).toBe( 'g argument must either be a decimal, hex, or, binary value between 0 and 15, negative integers not allowed' );
          expect( Emulator.checkLine( 'inject r1,r1,r3,-1,0' ) ).toBe( 'arguments must be in the form of "Rd,Re,Rf,g,h", negative integers not allowed' );

          expect( Emulator.checkLine( 'inject R1,r1,r3,0,16' ) ).toBe( 'h argument must either be a decimal, hex, or, binary value between 0 and 15, negative integers not allowed' );
          expect( Emulator.checkLine( 'inject R1,r1,r3,0,$10' ) ).toBe( 'h argument must either be a decimal, hex, or, binary value between 0 and 15, negative integers not allowed' );
          expect( Emulator.checkLine( 'inject R1,r1,r3,0,#10000' ) ).toBe( 'h argument must either be a decimal, hex, or, binary value between 0 and 15, negative integers not allowed' );
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
          expect( Emulator.checkLine( 'logicw r1,R2,r3,#1111' ) ).toBe( true );

          expect( Emulator.checkLine( ' logicw r1,r2,r3,0' ) ).toBe( true );
          expect( Emulator.checkLine( '     logicw r1,r2,r3,0;comment' ) ).toBe( true );
          expect( Emulator.checkLine( '     logicw r1,r2,r3,0;comment;doublecomment' ) ).toBe( true );
        } );

        test( 'CHECK RRRKEXP false', () => {
          expect( Emulator.checkLine( 'logicw R16,r2,r3,0' ) ).toBe( 'arguments must be in the form of "Rd,Re,Rf,g", negative integers not allowed' );
          expect( Emulator.checkLine( 'logicw R-1,R2,r3,0' ) ).toBe( 'arguments must be in the form of "Rd,Re,Rf,g", negative integers not allowed' );
          expect( Emulator.checkLine( 'logicw r$f,R2,r3,0' ) ).toBe( 'arguments must be in the form of "Rd,Re,Rf,g", negative integers not allowed' );
          expect( Emulator.checkLine( 'logicw r#1111,R2,r3,0' ) ).toBe( 'arguments must be in the form of "Rd,Re,Rf,g", negative integers not allowed' );

          expect( Emulator.checkLine( 'logicw R1,r16,r3,0' ) ).toBe( 'arguments must be in the form of "Rd,Re,Rf,g", negative integers not allowed' );
          expect( Emulator.checkLine( 'logicw R1,R-1,r3,0' ) ).toBe( 'arguments must be in the form of "Rd,Re,Rf,g", negative integers not allowed' );
          expect( Emulator.checkLine( 'logicw r1,R$f,r3,0' ) ).toBe( 'arguments must be in the form of "Rd,Re,Rf,g", negative integers not allowed' );
          expect( Emulator.checkLine( 'logicw r1,R#1111,r3,0' ) ).toBe( 'arguments must be in the form of "Rd,Re,Rf,g", negative integers not allowed' );

          expect( Emulator.checkLine( 'logicw R1,r1,r16,0' ) ).toBe( 'arguments must be in the form of "Rd,Re,Rf,g", negative integers not allowed' );
          expect( Emulator.checkLine( 'logicw R1,R1,r-1,0' ) ).toBe( 'arguments must be in the form of "Rd,Re,Rf,g", negative integers not allowed' );
          expect( Emulator.checkLine( 'logicw r1,R1,r$f,0' ) ).toBe( 'arguments must be in the form of "Rd,Re,Rf,g", negative integers not allowed' );
          expect( Emulator.checkLine( 'logicw r1,R1,r#1111,0' ) ).toBe( 'arguments must be in the form of "Rd,Re,Rf,g", negative integers not allowed' );

          expect( Emulator.checkLine( 'logicw R1,r1,r3,16' ) ).toBe( 'g argument must either be a decimal, hex, or, binary value between 0 and 15, negative integers not allowed' );
          expect( Emulator.checkLine( 'logicw R1,r1,r3,$10' ) ).toBe( 'g argument must either be a decimal, hex, or, binary value between 0 and 15, negative integers not allowed' );
          expect( Emulator.checkLine( 'logicw R1,r1,r3,#10000' ) ).toBe( 'g argument must either be a decimal, hex, or, binary value between 0 and 15, negative integers not allowed' );
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
          expect( Emulator.checkLine( 'andb r1,R2,r3,#1111' ) ).toBe( true );

          expect( Emulator.checkLine( ' andb r1,r2,r3,0' ) ).toBe( true );
          expect( Emulator.checkLine( '     andb r1,r2,r3,0;comment' ) ).toBe( true );
          expect( Emulator.checkLine( '     andb r1,r2,r3,0;comment;doublecomment' ) ).toBe( true );
        } );

        test( 'CHECK LOGICALIASRRRK false', () => {
          expect( Emulator.checkLine( 'andb R16,r2,r3,0' ) ).toBe( 'arguments must be in the form of "Rd,Re,Rf,g", negative integers not allowed' );
          expect( Emulator.checkLine( 'andb R-1,R2,r3,0' ) ).toBe( 'arguments must be in the form of "Rd,Re,Rf,g", negative integers not allowed' );
          expect( Emulator.checkLine( 'andb r$f,R2,r3,0' ) ).toBe( 'arguments must be in the form of "Rd,Re,Rf,g", negative integers not allowed' );
          expect( Emulator.checkLine( 'andb r#1111,R2,r3,0' ) ).toBe( 'arguments must be in the form of "Rd,Re,Rf,g", negative integers not allowed' );

          expect( Emulator.checkLine( 'andb R1,r16,r3,0' ) ).toBe( 'arguments must be in the form of "Rd,Re,Rf,g", negative integers not allowed' );
          expect( Emulator.checkLine( 'andb R1,R-1,r3,0' ) ).toBe( 'arguments must be in the form of "Rd,Re,Rf,g", negative integers not allowed' );
          expect( Emulator.checkLine( 'andb r1,R$f,r3,0' ) ).toBe( 'arguments must be in the form of "Rd,Re,Rf,g", negative integers not allowed' );
          expect( Emulator.checkLine( 'andb r1,R#1111,r3,0' ) ).toBe( 'arguments must be in the form of "Rd,Re,Rf,g", negative integers not allowed' );

          expect( Emulator.checkLine( 'andb R1,r1,r16,0' ) ).toBe( 'arguments must be in the form of "Rd,Re,Rf,g", negative integers not allowed' );
          expect( Emulator.checkLine( 'andb R1,R1,r-1,0' ) ).toBe( 'arguments must be in the form of "Rd,Re,Rf,g", negative integers not allowed' );
          expect( Emulator.checkLine( 'andb r1,R1,r$f,0' ) ).toBe( 'arguments must be in the form of "Rd,Re,Rf,g", negative integers not allowed' );
          expect( Emulator.checkLine( 'andb r1,R1,r#1111,0' ) ).toBe( 'arguments must be in the form of "Rd,Re,Rf,g", negative integers not allowed' );

          expect( Emulator.checkLine( 'andb R1,r1,r3,16' ) ).toBe( 'g argument must either be a decimal, hex, or, binary value between 0 and 15, negative integers not allowed' );
          expect( Emulator.checkLine( 'andb R1,r1,r3,$10' ) ).toBe( 'g argument must either be a decimal, hex, or, binary value between 0 and 15, negative integers not allowed' );
          expect( Emulator.checkLine( 'andb R1,r1,r3,#10000' ) ).toBe( 'g argument must either be a decimal, hex, or, binary value between 0 and 15, negative integers not allowed' );
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
          expect( Emulator.checkLine( 'invb r1,r2,#1111', testLabels ) ).toBe( true );
          expect( Emulator.checkLine( 'invb r1,r2,4', testLabels ) ).toBe( true );

          expect( Emulator.checkLine( ' invb r1,r2,1', testLabels ) ).toBe( true );
          expect( Emulator.checkLine( '     invb r1,r2,1;comment', testLabels ) ).toBe( true );
          expect( Emulator.checkLine( '     invb r1,r2,1;comment;doublecomment', testLabels ) ).toBe( true );
        } );

        test( 'CHECK LOGICALIASRRK false', () => {
          expect( Emulator.checkLine( 'invb 1', testLabels ) ).toBe( 'arguments must be in the form of "Rd,Re,g", negative integers not allowed' );
          expect( Emulator.checkLine( 'invb r2,2', testLabels ) ).toBe( 'arguments must be in the form of "Rd,Re,g", negative integers not allowed' );
          expect( Emulator.checkLine( 'invb r1,r2', testLabels ) ).toBe( 'arguments must be in the form of "Rd,Re,g", negative integers not allowed' );

          expect( Emulator.checkLine( 'invb r1,r2,16', testLabels ) ).toBe( 'g argument must either be a decimal, hex, or, binary value between 0 and 15' );
          expect( Emulator.checkLine( 'invb r1,r2,-1', testLabels ) ).toBe( 'arguments must be in the form of "Rd,Re,g", negative integers not allowed' );
          expect( Emulator.checkLine( 'invb r1,r2,$10', testLabels ) ).toBe( 'g argument must either be a decimal, hex, or, binary value between 0 and 15' );
          expect( Emulator.checkLine( 'invb r1,r2,#10000', testLabels ) ).toBe( 'g argument must either be a decimal, hex, or, binary value between 0 and 15' );

          expect( Emulator.checkLine( 'invb r16,r2,1', testLabels ) ).toBe( 'arguments must be in the form of "Rd,Re,g", negative integers not allowed' );
          expect( Emulator.checkLine( 'invb r-1,r2,1', testLabels ) ).toBe( 'arguments must be in the form of "Rd,Re,g", negative integers not allowed' );
          expect( Emulator.checkLine( 'invb r$f,r2,1', testLabels ) ).toBe( 'arguments must be in the form of "Rd,Re,g", negative integers not allowed' );
          expect( Emulator.checkLine( 'invb r#1111,r2,1', testLabels ) ).toBe( 'arguments must be in the form of "Rd,Re,g", negative integers not allowed' );

          expect( Emulator.checkLine( 'invb r1,r16,1', testLabels ) ).toBe( 'arguments must be in the form of "Rd,Re,g", negative integers not allowed' );
          expect( Emulator.checkLine( 'invb r1,r-1,1', testLabels ) ).toBe( 'arguments must be in the form of "Rd,Re,g", negative integers not allowed' );
          expect( Emulator.checkLine( 'invb r1,r$f,1', testLabels ) ).toBe( 'arguments must be in the form of "Rd,Re,g", negative integers not allowed' );
          expect( Emulator.checkLine( 'invb r1,r#1111,1', testLabels ) ).toBe( 'arguments must be in the form of "Rd,Re,g", negative integers not allowed' );

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
          expect( Emulator.checkLine( 'andnew r#1111,R2,R3' ) ).toBe( 'arguments must be in the form of "Rd,Ra,Rb"' );

          expect( Emulator.checkLine( 'andnew R1,r2,r16' ) ).toBe( 'arguments must be in the form of "Rd,Ra,Rb"' );
          expect( Emulator.checkLine( 'andnew R1,R2,r-1' ) ).toBe( 'arguments must be in the form of "Rd,Ra,Rb"' );
          expect( Emulator.checkLine( 'andnew r1,R2,R$f' ) ).toBe( 'arguments must be in the form of "Rd,Ra,Rb"' );
          expect( Emulator.checkLine( 'andnew r1,R2,R#1111' ) ).toBe( 'arguments must be in the form of "Rd,Ra,Rb"' );

          expect( Emulator.checkLine( 'andnew R1,r16,r3' ) ).toBe( 'arguments must be in the form of "Rd,Ra,Rb"' );
          expect( Emulator.checkLine( 'andnew R1,R-1,r3' ) ).toBe( 'arguments must be in the form of "Rd,Ra,Rb"' );
          expect( Emulator.checkLine( 'andnew r1,R$f,R3' ) ).toBe( 'arguments must be in the form of "Rd,Ra,Rb"' );
          expect( Emulator.checkLine( 'andnew r1,R#1111,R3' ) ).toBe( 'arguments must be in the form of "Rd,Ra,Rb"' );

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
        expect( Emulator.checkLine( 'invnew #1111,R2' ) ).toBe( 'arguments must be in the form of "Ra,Rb"' );

        expect( Emulator.checkLine( 'invnew R1,r16' ) ).toBe( 'arguments must be in the form of "Ra,Rb"' );
        expect( Emulator.checkLine( 'invnew R1,R-1' ) ).toBe( 'arguments must be in the form of "Ra,Rb"' );
        expect( Emulator.checkLine( 'invnew r1,R$f' ) ).toBe( 'arguments must be in the form of "Ra,Rb"' );
        expect( Emulator.checkLine( 'invnew r1,R#1111' ) ).toBe( 'arguments must be in the form of "Ra,Rb"' );

        expect( Emulator.checkLine( ' invnew r1;r2' ) ).toBe( 'arguments must be in the form of "Ra,Rb"' );
        expect( Emulator.checkLine( '     invnew r1,r2comment' ) ).toBe( 'arguments must be in the form of "Ra,Rb"' );
        
        expect( Emulator.checkLine( '     invnew' ) ).toBe( 'invnew must be followed by 2 registers in form Rx,Rx' );
      } );

  // checkCodeIsCompatible
    // FULLY COMPATIBLE
      test( 'CHECK checkCodeIsCompatible fully', () => {
        for ( var i = 0; i < fullyCompatibleCommands.length; i++ ) {
          // dont add arguments as function only checks if the command is valid and assumes that the arguments are correct
          expect( Emulator.checkCodeIsCompatible( fullyCompatibleCommands[i] ) ).toStrictEqual( new Map() );
        }

        expect( Emulator.checkCodeIsCompatible( 'data 21' ) ).toStrictEqual( new Map() );

        expect( Emulator.checkCodeIsCompatible( 'data $0021' ) ).toStrictEqual( new Map() );

        expect( Emulator.checkCodeIsCompatible( 'data #0001110' ) ).toStrictEqual( new Map() );
      } );

    // PARTIALLY COMPATIBLE
      test( 'CHECK checkCodeIsCompatible partially', () => {
        for ( var i = 0; i < Object.keys( partiallyCompatibleCommands ).length; i++ ) {
          expect( Emulator.checkCodeIsCompatible( Object.keys( partiallyCompatibleCommands )[i] ) ).toStrictEqual( new Map( [[1, 'Compatibility warning : ' + partiallyCompatibleCommands[ Object.keys( partiallyCompatibleCommands )[i] ]]] ) );
        }

        expect( Emulator.checkCodeIsCompatible( 'data 21,$0021,#0001110' ) ).toStrictEqual( new Map( [[1, 'Compatibility warning : Multiple data constants is not supported by the original emulator']] ) );
      } );

    // NON COMPATIBLE
      test( 'CHECK checkCodeIsCompatible non', () => {
        for ( var i = 0; i < nonCompatibleCommands.length; i++ ) {
          expect( Emulator.checkCodeIsCompatible( nonCompatibleCommands[i] ) ).toStrictEqual( new Map( [[1, 'Compatibility error : Assembler does not recognise command at all and will return an error']] ) );
        }
      } );

// PARSE METHODS
  // label recognition
    test( 'PARSE label recognise', () => {
      expect( Emulator.parseLineForLabels( 'label data 3' ) ).toStrictEqual( { 'label' : 'label', 'justLabel' : false, 'instructionWords' : 1 } );
      expect( Emulator.parseLineForLabels( 'label load r1,label2[r0]' ) ).toStrictEqual( { 'label' : 'label', 'justLabel' : false, 'instructionWords' : 2 } );
      expect( Emulator.parseLineForLabels( 'label' ) ).toStrictEqual( {'label' : 'label', 'justLabel' : true, 'instructionWords' : 1} );
      expect( Emulator.parseLineForLabels( 'label ' ) ).toStrictEqual( {'label' : 'label', 'justLabel' : true, 'instructionWords' : 1} );
    } );

  // parseLineForMachineCode runs with the assumption that all the lines have been checked and returned a true result
    // RR
      // INV
        test( 'PARSE RR inv', () => {
          expect( Emulator.parseLineForMachineCode( 'inv r1,r2', testLabels ) ).toStrictEqual( [ 0x8112 ] );
          expect( Emulator.parseLineForMachineCode( 'inv R1,R2', testLabels ) ).toStrictEqual( [ 0x8112 ] );
        } );

      // CMP
        test( 'PARSE RR cmp', () => {
          expect( Emulator.parseLineForMachineCode( 'cmp r1,r2', testLabels ) ).toStrictEqual( [ 0x4112 ] );
          expect( Emulator.parseLineForMachineCode( 'cmp R1,R2', testLabels ) ).toStrictEqual( [ 0x4112 ] );
        } );

    // RRR
      // ADD
        test( 'PARSE RRR add', () => {
          expect( Emulator.parseLineForMachineCode( 'add r1,r2,r3', testLabels ) ).toStrictEqual( [ 0x0123 ] );
          expect( Emulator.parseLineForMachineCode( 'add R1,R2,R3', testLabels ) ).toStrictEqual( [ 0x0123 ] );
        } );

      // SUB
        test( 'PARSE RRR sub', () => {
          expect( Emulator.parseLineForMachineCode( 'sub r1,r2,r3', testLabels ) ).toStrictEqual( [ 0x1123 ] );
          expect( Emulator.parseLineForMachineCode( 'sub R1,R2,R3', testLabels ) ).toStrictEqual( [ 0x1123 ] );
        } );

      // MUL
        test( 'PARSE RRR mul', () => {
          expect( Emulator.parseLineForMachineCode( 'mul r1,r2,r3', testLabels ) ).toStrictEqual( [ 0x2123 ] );
          expect( Emulator.parseLineForMachineCode( 'mul R1,R2,R3', testLabels ) ).toStrictEqual( [ 0x2123 ] );
        } );

      // DIV
        test( 'PARSE RRR div', () => {
          expect( Emulator.parseLineForMachineCode( 'div r1,r2,r3', testLabels ) ).toStrictEqual( [ 0x3123 ] );
          expect( Emulator.parseLineForMachineCode( 'div R1,R2,R3', testLabels ) ).toStrictEqual( [ 0x3123 ] );
        } );

      // CMPLT
        test( 'PARSE RRR cmplt', () => {
          expect( Emulator.parseLineForMachineCode( 'cmplt r1,r2,r3', testLabels ) ).toStrictEqual( [ 0x5123 ] );
          expect( Emulator.parseLineForMachineCode( 'cmplt R1,R2,R3', testLabels ) ).toStrictEqual( [ 0x5123 ] );
        } );

      // CMPEQ
        test( 'PARSE RRR cmpeq', () => {
          expect( Emulator.parseLineForMachineCode( 'cmpeq r1,r2,r3', testLabels ) ).toStrictEqual( [ 0x6123 ] );
          expect( Emulator.parseLineForMachineCode( 'cmpeq R1,R2,R3', testLabels ) ).toStrictEqual( [ 0x6123 ] );
        } );

      // CMPGT
        test( 'PARSE RRR cmpgt', () => {
          expect( Emulator.parseLineForMachineCode( 'cmpgt r1,r2,r3', testLabels ) ).toStrictEqual( [ 0x7123 ] );
          expect( Emulator.parseLineForMachineCode( 'cmpgt R1,R2,R3', testLabels ) ).toStrictEqual( [ 0x7123 ] );
        } );

      // AND
        test( 'PARSE RRR and', () => {
          expect( Emulator.parseLineForMachineCode( 'and r1,r2,r3', testLabels ) ).toStrictEqual( [ 0x9123 ] );
          expect( Emulator.parseLineForMachineCode( 'and R1,R2,R3', testLabels ) ).toStrictEqual( [ 0x9123 ] );
        } );

      // OR
        test( 'PARSE RRR or', () => {
          expect( Emulator.parseLineForMachineCode( 'or r1,r2,r3', testLabels ) ).toStrictEqual( [ 0xa123 ] );
          expect( Emulator.parseLineForMachineCode( 'or R1,R2,R3', testLabels ) ).toStrictEqual( [ 0xa123 ] );
        } );

      // XOR
        test( 'PARSE RRR xor', () => {
          expect( Emulator.parseLineForMachineCode( 'xor r1,r2,r3', testLabels ) ).toStrictEqual( [ 0xb123 ] );
          expect( Emulator.parseLineForMachineCode( 'xor R1,R2,R3', testLabels ) ).toStrictEqual( [ 0xb123 ] );
        } );

      // TRAP
        test( 'PARSE RRR trap', () => {
          expect( Emulator.parseLineForMachineCode( 'trap r1,r2,r3', testLabels ) ).toStrictEqual( [ 0xd123 ] );
          expect( Emulator.parseLineForMachineCode( 'trap R1,R2,R3', testLabels ) ).toStrictEqual( [ 0xd123 ] );
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
          expect( Emulator.parseLineForMachineCode( 'lea r1,#100110111[r0]', testLabels ) ).toStrictEqual( [ 0xf100, 0x0137 ] );
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
          expect( Emulator.parseLineForMachineCode( 'load r1,#100110111[r0]', testLabels ) ).toStrictEqual( [ 0xf101, 0x0137 ] );
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
          expect( Emulator.parseLineForMachineCode( 'store r1,#100110111[r0]', testLabels ) ).toStrictEqual( [ 0xf102, 0x0137 ] );
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
          expect( Emulator.parseLineForMachineCode( 'jumpf r1,#100110111[r0]', testLabels ) ).toStrictEqual( [ 0xf106, 0x0137 ] );
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
          expect( Emulator.parseLineForMachineCode( 'jumpt r1,#100110111[r0]', testLabels ) ).toStrictEqual( [ 0xf107, 0x0137 ] );
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
          expect( Emulator.parseLineForMachineCode( 'jal r1,#100110111[r0]', testLabels ) ).toStrictEqual( [ 0xf108, 0x0137 ] );
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
          expect( Emulator.parseLineForMachineCode( 'testset r1,#100110111[r0]', testLabels ) ).toStrictEqual( [ 0xf109, 0x0137 ] );
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
          expect( Emulator.parseLineForMachineCode( 'jump #100110111[r0]', testLabels ) ).toStrictEqual( [ 0xf003, 0x0137 ] );
        } );

    // KX
      // JUMPC0
        test( 'PARSE KX jumpc0', () => {
          expect( Emulator.parseLineForMachineCode( 'jumpc0 0,test[r0]', testLabels ) ).toStrictEqual( [ 0xf004, testLabels['test'] ] );
          expect( Emulator.parseLineForMachineCode( 'jumpc0 0,test[R2]', testLabels ) ).toStrictEqual( [ 0xf024, testLabels['test'] ] );

          expect( Emulator.parseLineForMachineCode( 'jumpc0 1,test[R2]', testLabels ) ).toStrictEqual( [ 0xf124, testLabels['test'] ] );
          expect( Emulator.parseLineForMachineCode( 'jumpc0 $f,test[R2]', testLabels ) ).toStrictEqual( [ 0xff24, testLabels['test'] ] );
          expect( Emulator.parseLineForMachineCode( 'jumpc0 #1111,test[R2]', testLabels ) ).toStrictEqual( [ 0xff24, testLabels['test'] ] );

          expect( Emulator.parseLineForMachineCode( 'jumpc0 0,test[r0]', testLabels ) ).toStrictEqual( [ 0xf004, testLabels['test'] ] );
          expect( Emulator.parseLineForMachineCode( 'jumpc0 0,100[r0]', testLabels ) ).toStrictEqual( [ 0xf004, 100 ] );
          expect( Emulator.parseLineForMachineCode( 'jumpc0 0,-100[r0]', testLabels ) ).toStrictEqual( [ 0xf004, 0xff9c ] );
          expect( Emulator.parseLineForMachineCode( 'jumpc0 0,$100[r0]', testLabels ) ).toStrictEqual( [ 0xf004, 0x0100 ] );
          expect( Emulator.parseLineForMachineCode( 'jumpc0 0,#100110111[r0]', testLabels ) ).toStrictEqual( [ 0xf004, 0x0137 ] );

        } );

      // JUMPC1
        test( 'PARSE KX jumpc1', () => {
          expect( Emulator.parseLineForMachineCode( 'jumpc1 0,test[r0]', testLabels ) ).toStrictEqual( [ 0xf005, testLabels['test'] ] );
          expect( Emulator.parseLineForMachineCode( 'jumpc1 0,test[R2]', testLabels ) ).toStrictEqual( [ 0xf025, testLabels['test'] ] );

          expect( Emulator.parseLineForMachineCode( 'jumpc1 1,test[R2]', testLabels ) ).toStrictEqual( [ 0xf125, testLabels['test'] ] );
          expect( Emulator.parseLineForMachineCode( 'jumpc1 $f,test[R2]', testLabels ) ).toStrictEqual( [ 0xff25, testLabels['test'] ] );
          expect( Emulator.parseLineForMachineCode( 'jumpc1 #1111,test[R2]', testLabels ) ).toStrictEqual( [ 0xff25, testLabels['test'] ] );

          expect( Emulator.parseLineForMachineCode( 'jumpc1 0,test[r0]', testLabels ) ).toStrictEqual( [ 0xf005, testLabels['test'] ] );
          expect( Emulator.parseLineForMachineCode( 'jumpc1 0,100[r0]', testLabels ) ).toStrictEqual( [ 0xf005, 100 ] );
          expect( Emulator.parseLineForMachineCode( 'jumpc1 0,-100[r0]', testLabels ) ).toStrictEqual( [ 0xf005, 0xff9c ] );
          expect( Emulator.parseLineForMachineCode( 'jumpc1 0,$100[r0]', testLabels ) ).toStrictEqual( [ 0xf005, 0x0100 ] );
          expect( Emulator.parseLineForMachineCode( 'jumpc1 0,#100110111[r0]', testLabels ) ).toStrictEqual( [ 0xf005, 0x0137 ] );
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
          expect( Emulator.parseLineForMachineCode( 'jumple #100110111[r0]', testLabels ) ).toStrictEqual( [ 0xf104, 0x0137 ] );
        } );

      // JUMPNE
        test( 'PARSE JUMPALIAS jumpne', () => {
          expect( Emulator.parseLineForMachineCode( 'jumpne test[r0]', testLabels ) ).toStrictEqual( [ 0xf204, testLabels['test'] ] );
          expect( Emulator.parseLineForMachineCode( 'jumpne test[R2]', testLabels ) ).toStrictEqual( [ 0xf224, testLabels['test'] ] );

          expect( Emulator.parseLineForMachineCode( 'jumpne test[r0]', testLabels ) ).toStrictEqual( [ 0xf204, testLabels['test'] ] );
          expect( Emulator.parseLineForMachineCode( 'jumpne 100[r0]', testLabels ) ).toStrictEqual( [ 0xf204, 100 ] );
          expect( Emulator.parseLineForMachineCode( 'jumpne -100[r0]', testLabels ) ).toStrictEqual( [ 0xf204, 0xff9c ] );
          expect( Emulator.parseLineForMachineCode( 'jumpne $100[r0]', testLabels ) ).toStrictEqual( [ 0xf204, 0x0100 ] );
          expect( Emulator.parseLineForMachineCode( 'jumpne #100110111[r0]', testLabels ) ).toStrictEqual( [ 0xf204, 0x0137 ] );
        } );

      // JUMPGE
        test( 'PARSE JUMPALIAS jumpge', () => {
          expect( Emulator.parseLineForMachineCode( 'jumpge test[r0]', testLabels ) ).toStrictEqual( [ 0xf304, testLabels['test'] ] );
          expect( Emulator.parseLineForMachineCode( 'jumpge test[R2]', testLabels ) ).toStrictEqual( [ 0xf324, testLabels['test'] ] );

          expect( Emulator.parseLineForMachineCode( 'jumpge test[r0]', testLabels ) ).toStrictEqual( [ 0xf304, testLabels['test'] ] );
          expect( Emulator.parseLineForMachineCode( 'jumpge 100[r0]', testLabels ) ).toStrictEqual( [ 0xf304, 100 ] );
          expect( Emulator.parseLineForMachineCode( 'jumpge -100[r0]', testLabels ) ).toStrictEqual( [ 0xf304, 0xff9c ] );
          expect( Emulator.parseLineForMachineCode( 'jumpge $100[r0]', testLabels ) ).toStrictEqual( [ 0xf304, 0x0100 ] );
          expect( Emulator.parseLineForMachineCode( 'jumpge #100110111[r0]', testLabels ) ).toStrictEqual( [ 0xf304, 0x0137 ] );
        } );

      // JUMPNV
        test( 'PARSE JUMPALIAS jumpnv', () => {
          expect( Emulator.parseLineForMachineCode( 'jumpnv test[r0]', testLabels ) ).toStrictEqual( [ 0xf604, testLabels['test'] ] );
          expect( Emulator.parseLineForMachineCode( 'jumpnv test[R2]', testLabels ) ).toStrictEqual( [ 0xf624, testLabels['test'] ] );

          expect( Emulator.parseLineForMachineCode( 'jumpnv test[r0]', testLabels ) ).toStrictEqual( [ 0xf604, testLabels['test'] ] );
          expect( Emulator.parseLineForMachineCode( 'jumpnv 100[r0]', testLabels ) ).toStrictEqual( [ 0xf604, 100 ] );
          expect( Emulator.parseLineForMachineCode( 'jumpnv -100[r0]', testLabels ) ).toStrictEqual( [ 0xf604, 0xff9c ] );
          expect( Emulator.parseLineForMachineCode( 'jumpnv $100[r0]', testLabels ) ).toStrictEqual( [ 0xf604, 0x0100 ] );
          expect( Emulator.parseLineForMachineCode( 'jumpnv #100110111[r0]', testLabels ) ).toStrictEqual( [ 0xf604, 0x0137 ] );
        } );

      // JUMPNVU
        test( 'PARSE JUMPALIAS jumpnvu', () => {
          expect( Emulator.parseLineForMachineCode( 'jumpnvu test[r0]', testLabels ) ).toStrictEqual( [ 0xf504, testLabels['test'] ] );
          expect( Emulator.parseLineForMachineCode( 'jumpnvu test[R2]', testLabels ) ).toStrictEqual( [ 0xf524, testLabels['test'] ] );

          expect( Emulator.parseLineForMachineCode( 'jumpnvu test[r0]', testLabels ) ).toStrictEqual( [ 0xf504, testLabels['test'] ] );
          expect( Emulator.parseLineForMachineCode( 'jumpnvu 100[r0]', testLabels ) ).toStrictEqual( [ 0xf504, 100 ] );
          expect( Emulator.parseLineForMachineCode( 'jumpnvu -100[r0]', testLabels ) ).toStrictEqual( [ 0xf504, 0xff9c ] );
          expect( Emulator.parseLineForMachineCode( 'jumpnvu $100[r0]', testLabels ) ).toStrictEqual( [ 0xf504, 0x0100 ] );
          expect( Emulator.parseLineForMachineCode( 'jumpnvu #100110111[r0]', testLabels ) ).toStrictEqual( [ 0xf504, 0x0137 ] );
        } );

      // JUMPNCO
        test( 'PARSE JUMPALIAS jumpnco', () => {
          expect( Emulator.parseLineForMachineCode( 'jumpnco test[r0]', testLabels ) ).toStrictEqual( [ 0xf704, testLabels['test'] ] );
          expect( Emulator.parseLineForMachineCode( 'jumpnco test[R2]', testLabels ) ).toStrictEqual( [ 0xf724, testLabels['test'] ] );

          expect( Emulator.parseLineForMachineCode( 'jumpnco test[r0]', testLabels ) ).toStrictEqual( [ 0xf704, testLabels['test'] ] );
          expect( Emulator.parseLineForMachineCode( 'jumpnco 100[r0]', testLabels ) ).toStrictEqual( [ 0xf704, 100 ] );
          expect( Emulator.parseLineForMachineCode( 'jumpnco -100[r0]', testLabels ) ).toStrictEqual( [ 0xf704, 0xff9c ] );
          expect( Emulator.parseLineForMachineCode( 'jumpnco $100[r0]', testLabels ) ).toStrictEqual( [ 0xf704, 0x0100 ] );
          expect( Emulator.parseLineForMachineCode( 'jumpnco #100110111[r0]', testLabels ) ).toStrictEqual( [ 0xf704, 0x0137 ] );
        } );

      // JUMPNSO
        test( 'PARSE JUMPALIAS jumpnso', () => {
          expect( Emulator.parseLineForMachineCode( 'jumpnso test[r0]', testLabels ) ).toStrictEqual( [ 0xf804, testLabels['test'] ] );
          expect( Emulator.parseLineForMachineCode( 'jumpnso test[R2]', testLabels ) ).toStrictEqual( [ 0xf824, testLabels['test'] ] );

          expect( Emulator.parseLineForMachineCode( 'jumpnso test[r0]', testLabels ) ).toStrictEqual( [ 0xf804, testLabels['test'] ] );
          expect( Emulator.parseLineForMachineCode( 'jumpnso 100[r0]', testLabels ) ).toStrictEqual( [ 0xf804, 100 ] );
          expect( Emulator.parseLineForMachineCode( 'jumpnso -100[r0]', testLabels ) ).toStrictEqual( [ 0xf804, 0xff9c ] );
          expect( Emulator.parseLineForMachineCode( 'jumpnso $100[r0]', testLabels ) ).toStrictEqual( [ 0xf804, 0x0100 ] );
          expect( Emulator.parseLineForMachineCode( 'jumpnso #100110111[r0]', testLabels ) ).toStrictEqual( [ 0xf804, 0x0137 ] );
        } );

      // JUMPLT
        test( 'PARSE JUMPALIAS jumplt', () => {
          expect( Emulator.parseLineForMachineCode( 'jumplt test[r0]', testLabels ) ).toStrictEqual( [ 0xf305, testLabels['test'] ] );
          expect( Emulator.parseLineForMachineCode( 'jumplt test[R2]', testLabels ) ).toStrictEqual( [ 0xf325, testLabels['test'] ] );

          expect( Emulator.parseLineForMachineCode( 'jumplt test[r0]', testLabels ) ).toStrictEqual( [ 0xf305, testLabels['test'] ] );
          expect( Emulator.parseLineForMachineCode( 'jumplt 100[r0]', testLabels ) ).toStrictEqual( [ 0xf305, 100 ] );
          expect( Emulator.parseLineForMachineCode( 'jumplt -100[r0]', testLabels ) ).toStrictEqual( [ 0xf305, 0xff9c ] );
          expect( Emulator.parseLineForMachineCode( 'jumplt $100[r0]', testLabels ) ).toStrictEqual( [ 0xf305, 0x0100 ] );
          expect( Emulator.parseLineForMachineCode( 'jumplt #100110111[r0]', testLabels ) ).toStrictEqual( [ 0xf305, 0x0137 ] );
        } );

      // JUMPEQ
        test( 'PARSE JUMPALIAS jumpeq', () => {
          expect( Emulator.parseLineForMachineCode( 'jumpeq test[r0]', testLabels ) ).toStrictEqual( [ 0xf205, testLabels['test'] ] );
          expect( Emulator.parseLineForMachineCode( 'jumpeq test[R2]', testLabels ) ).toStrictEqual( [ 0xf225, testLabels['test'] ] );

          expect( Emulator.parseLineForMachineCode( 'jumpeq test[r0]', testLabels ) ).toStrictEqual( [ 0xf205, testLabels['test'] ] );
          expect( Emulator.parseLineForMachineCode( 'jumpeq 100[r0]', testLabels ) ).toStrictEqual( [ 0xf205, 100 ] );
          expect( Emulator.parseLineForMachineCode( 'jumpeq -100[r0]', testLabels ) ).toStrictEqual( [ 0xf205, 0xff9c ] );
          expect( Emulator.parseLineForMachineCode( 'jumpeq $100[r0]', testLabels ) ).toStrictEqual( [ 0xf205, 0x0100 ] );
          expect( Emulator.parseLineForMachineCode( 'jumpeq #100110111[r0]', testLabels ) ).toStrictEqual( [ 0xf205, 0x0137 ] );
        } );

      // JUMPGT
        test( 'PARSE JUMPALIAS jumpgt', () => {
          expect( Emulator.parseLineForMachineCode( 'jumpgt test[r0]', testLabels ) ).toStrictEqual( [ 0xf105, testLabels['test'] ] );
          expect( Emulator.parseLineForMachineCode( 'jumpgt test[R2]', testLabels ) ).toStrictEqual( [ 0xf125, testLabels['test'] ] );

          expect( Emulator.parseLineForMachineCode( 'jumpgt test[r0]', testLabels ) ).toStrictEqual( [ 0xf105, testLabels['test'] ] );
          expect( Emulator.parseLineForMachineCode( 'jumpgt 100[r0]', testLabels ) ).toStrictEqual( [ 0xf105, 100 ] );
          expect( Emulator.parseLineForMachineCode( 'jumpgt -100[r0]', testLabels ) ).toStrictEqual( [ 0xf105, 0xff9c ] );
          expect( Emulator.parseLineForMachineCode( 'jumpgt $100[r0]', testLabels ) ).toStrictEqual( [ 0xf105, 0x0100 ] );
          expect( Emulator.parseLineForMachineCode( 'jumpgt #100110111[r0]', testLabels ) ).toStrictEqual( [ 0xf105, 0x0137 ] );
        } );

      // JUMPV
        test( 'PARSE JUMPALIAS jumpv', () => {
          expect( Emulator.parseLineForMachineCode( 'jumpv test[r0]', testLabels ) ).toStrictEqual( [ 0xf605, testLabels['test'] ] );
          expect( Emulator.parseLineForMachineCode( 'jumpv test[R2]', testLabels ) ).toStrictEqual( [ 0xf625, testLabels['test'] ] );

          expect( Emulator.parseLineForMachineCode( 'jumpv test[r0]', testLabels ) ).toStrictEqual( [ 0xf605, testLabels['test'] ] );
          expect( Emulator.parseLineForMachineCode( 'jumpv 100[r0]', testLabels ) ).toStrictEqual( [ 0xf605, 100 ] );
          expect( Emulator.parseLineForMachineCode( 'jumpv -100[r0]', testLabels ) ).toStrictEqual( [ 0xf605, 0xff9c ] );
          expect( Emulator.parseLineForMachineCode( 'jumpv $100[r0]', testLabels ) ).toStrictEqual( [ 0xf605, 0x0100 ] );
          expect( Emulator.parseLineForMachineCode( 'jumpv #100110111[r0]', testLabels ) ).toStrictEqual( [ 0xf605, 0x0137 ] );
        } );

      // JUMPVU
        test( 'PARSE JUMPALIAS jumpvu', () => {
          expect( Emulator.parseLineForMachineCode( 'jumpvu test[r0]', testLabels ) ).toStrictEqual( [ 0xf505, testLabels['test'] ] );
          expect( Emulator.parseLineForMachineCode( 'jumpvu test[R2]', testLabels ) ).toStrictEqual( [ 0xf525, testLabels['test'] ] );

          expect( Emulator.parseLineForMachineCode( 'jumpvu test[r0]', testLabels ) ).toStrictEqual( [ 0xf505, testLabels['test'] ] );
          expect( Emulator.parseLineForMachineCode( 'jumpvu 100[r0]', testLabels ) ).toStrictEqual( [ 0xf505, 100 ] );
          expect( Emulator.parseLineForMachineCode( 'jumpvu -100[r0]', testLabels ) ).toStrictEqual( [ 0xf505, 0xff9c ] );
          expect( Emulator.parseLineForMachineCode( 'jumpvu $100[r0]', testLabels ) ).toStrictEqual( [ 0xf505, 0x0100 ] );
          expect( Emulator.parseLineForMachineCode( 'jumpvu #100110111[r0]', testLabels ) ).toStrictEqual( [ 0xf505, 0x0137 ] );
        } );

      // JUMPCO
        test( 'PARSE JUMPALIAS jumpco', () => {
          expect( Emulator.parseLineForMachineCode( 'jumpco test[r0]', testLabels ) ).toStrictEqual( [ 0xf705, testLabels['test'] ] );
          expect( Emulator.parseLineForMachineCode( 'jumpco test[R2]', testLabels ) ).toStrictEqual( [ 0xf725, testLabels['test'] ] );

          expect( Emulator.parseLineForMachineCode( 'jumpco test[r0]', testLabels ) ).toStrictEqual( [ 0xf705, testLabels['test'] ] );
          expect( Emulator.parseLineForMachineCode( 'jumpco 100[r0]', testLabels ) ).toStrictEqual( [ 0xf705, 100 ] );
          expect( Emulator.parseLineForMachineCode( 'jumpco -100[r0]', testLabels ) ).toStrictEqual( [ 0xf705, 0xff9c ] );
          expect( Emulator.parseLineForMachineCode( 'jumpco $100[r0]', testLabels ) ).toStrictEqual( [ 0xf705, 0x0100 ] );
          expect( Emulator.parseLineForMachineCode( 'jumpco #100110111[r0]', testLabels ) ).toStrictEqual( [ 0xf705, 0x0137 ] );
        } );

      // JUMPSO
        test( 'PARSE JUMPALIAS jumpnso', () => {
          expect( Emulator.parseLineForMachineCode( 'jumpso test[r0]', testLabels ) ).toStrictEqual( [ 0xf805, testLabels['test'] ] );
          expect( Emulator.parseLineForMachineCode( 'jumpso test[R2]', testLabels ) ).toStrictEqual( [ 0xf825, testLabels['test'] ] );

          expect( Emulator.parseLineForMachineCode( 'jumpso test[r0]', testLabels ) ).toStrictEqual( [ 0xf805, testLabels['test'] ] );
          expect( Emulator.parseLineForMachineCode( 'jumpso 100[r0]', testLabels ) ).toStrictEqual( [ 0xf805, 100 ] );
          expect( Emulator.parseLineForMachineCode( 'jumpso -100[r0]', testLabels ) ).toStrictEqual( [ 0xf805, 0xff9c ] );
          expect( Emulator.parseLineForMachineCode( 'jumpso $100[r0]', testLabels ) ).toStrictEqual( [ 0xf805, 0x0100 ] );
          expect( Emulator.parseLineForMachineCode( 'jumpso #100110111[r0]', testLabels ) ).toStrictEqual( [ 0xf805, 0x0137 ] );
        } );

    // X
      test( 'PARSE X data', () => {
        expect( Emulator.parseLineForMachineCode( 'data 100', testLabels ) ).toStrictEqual( [ 100 ] );
        expect( Emulator.parseLineForMachineCode( 'data -100', testLabels ) ).toStrictEqual( [ 0xff9c ] );
        expect( Emulator.parseLineForMachineCode( 'data $100', testLabels ) ).toStrictEqual( [ 0x0100 ] );
        expect( Emulator.parseLineForMachineCode( 'data #100110111', testLabels ) ).toStrictEqual( [ 0x0137 ] );

        expect( Emulator.parseLineForMachineCode( 'data 100,-100,$100,#100110111', testLabels ) ).toStrictEqual( [ 100, 0xff9c, 0x0100, 0x0137 ] );
      } );

    // NOEXP
      // RFI
        test( 'PARSE NOEXP rfi', () => {
          expect( Emulator.parseLineForMachineCode( 'rfi' ) ).toStrictEqual( [ 0xe000 ] );
          expect( Emulator.parseLineForMachineCode( 'rfi ' ) ).toStrictEqual( [ 0xe000 ] );
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
          expect( Emulator.parseLineForMachineCode( 'save r1,r2,#0110111[r0]', testLabels ) ).toStrictEqual( [ 0xe008, 0x1237 ] );
          expect( Emulator.parseLineForMachineCode( 'save r1,r2,100[r0]', testLabels ) ).toStrictEqual( [ 0xe008, 0x1264 ] );
        } );

      // RESTORE
        test( 'PARSE RXEXP restore', () => {
          expect( Emulator.parseLineForMachineCode( 'restore r1,r2,20[r0]', testLabels ) ).toStrictEqual( [ 0xe009, 0x1214 ] );
          expect( Emulator.parseLineForMachineCode( 'restore R1,R2,20[R0]', testLabels ) ).toStrictEqual( [ 0xe009, 0x1214 ] );
          expect( Emulator.parseLineForMachineCode( 'restore R14,R14,20[R2]', testLabels ) ).toStrictEqual( [ 0xe209, 0xee14 ] );

          expect( Emulator.parseLineForMachineCode( 'restore r1,r2,$ff[r0]', testLabels ) ).toStrictEqual( [ 0xe009, 0x12ff ] );
          expect( Emulator.parseLineForMachineCode( 'restore r1,r2,#0110111[r0]', testLabels ) ).toStrictEqual( [ 0xe009, 0x1237 ] );
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
          expect( Emulator.parseLineForMachineCode( 'shiftl r1,r2,#1110' ) ).toStrictEqual( [ 0xe110, 0x20e0 ] );
        } );

      // SHIFTR
        test( 'PARSE RRKEXP shiftr', () => {
          expect( Emulator.parseLineForMachineCode( 'shiftr r1,r2,0' ) ).toStrictEqual( [ 0xe111, 0x2000 ] );
          expect( Emulator.parseLineForMachineCode( 'shiftr R1,R15,0' ) ).toStrictEqual( [ 0xe111, 0xf000 ] );

          expect( Emulator.parseLineForMachineCode( 'shiftr r1,r2,5' ) ).toStrictEqual( [ 0xe111, 0x2050 ] );
          expect( Emulator.parseLineForMachineCode( 'shiftr r1,r2,$f' ) ).toStrictEqual( [ 0xe111, 0x20f0 ] );
          expect( Emulator.parseLineForMachineCode( 'shiftr r1,r2,#1110' ) ).toStrictEqual( [ 0xe111, 0x20e0 ] );
        } );

    // RKEXP
      // GETBIT
        test( 'PARSE RKEXP getbit', () => {
          expect( Emulator.parseLineForMachineCode( 'getbit r1,0' ) ).toStrictEqual( [ 0xe118, 0x0000 ] );
          expect( Emulator.parseLineForMachineCode( 'getbit R1,0' ) ).toStrictEqual( [ 0xe118, 0x0000 ] );

          expect( Emulator.parseLineForMachineCode( 'getbit r1,5' ) ).toStrictEqual( [ 0xe118, 0x0050 ] );
          expect( Emulator.parseLineForMachineCode( 'getbit r1,$f' ) ).toStrictEqual( [ 0xe118, 0x00f0 ] );
          expect( Emulator.parseLineForMachineCode( 'getbit r1,#1110' ) ).toStrictEqual( [ 0xe118, 0x00e0 ] );
        } );

      // GETBITI
        test( 'PARSE RKEXP getbiti', () => {
          expect( Emulator.parseLineForMachineCode( 'getbiti r1,0' ) ).toStrictEqual( [ 0xe119, 0x0000 ] );
          expect( Emulator.parseLineForMachineCode( 'getbiti R1,0' ) ).toStrictEqual( [ 0xe119, 0x0000 ] );

          expect( Emulator.parseLineForMachineCode( 'getbiti r1,5' ) ).toStrictEqual( [ 0xe119, 0x0050 ] );
          expect( Emulator.parseLineForMachineCode( 'getbiti r1,$f' ) ).toStrictEqual( [ 0xe119, 0x00f0 ] );
          expect( Emulator.parseLineForMachineCode( 'getbiti r1,#1110' ) ).toStrictEqual( [ 0xe119, 0x00e0 ] );
        } );

      // PUTBIT
        test( 'PARSE RKEXP putbit', () => {
          expect( Emulator.parseLineForMachineCode( 'putbit r1,0' ) ).toStrictEqual( [ 0xe11a, 0x0000 ] );
          expect( Emulator.parseLineForMachineCode( 'putbit R1,0' ) ).toStrictEqual( [ 0xe11a, 0x0000 ] );

          expect( Emulator.parseLineForMachineCode( 'putbit r1,5' ) ).toStrictEqual( [ 0xe11a, 0x0050 ] );
          expect( Emulator.parseLineForMachineCode( 'putbit r1,$f' ) ).toStrictEqual( [ 0xe11a, 0x00f0 ] );
          expect( Emulator.parseLineForMachineCode( 'putbit r1,#1110' ) ).toStrictEqual( [ 0xe11a, 0x00e0 ] );
        } );

      // PUTBITI
        test( 'PARSE RKEXP putbit', () => {
          expect( Emulator.parseLineForMachineCode( 'putbiti r1,0' ) ).toStrictEqual( [ 0xe11b, 0x0000 ] );
          expect( Emulator.parseLineForMachineCode( 'putbiti R1,0' ) ).toStrictEqual( [ 0xe11b, 0x0000 ] );

          expect( Emulator.parseLineForMachineCode( 'putbiti r1,5' ) ).toStrictEqual( [ 0xe11b, 0x0050 ] );
          expect( Emulator.parseLineForMachineCode( 'putbiti r1,$f' ) ).toStrictEqual( [ 0xe11b, 0x00f0 ] );
          expect( Emulator.parseLineForMachineCode( 'putbiti r1,#1110' ) ).toStrictEqual( [ 0xe11b, 0x00e0 ] );
        } );

    // INJECTIALIAS
      // FIELD
        test( 'PARSE INJECTIALIAS field', () => {
          expect( Emulator.parseLineForMachineCode( 'field r1,0,15' ) ).toStrictEqual( [ 0xe115, 0x000f ] );
          expect( Emulator.parseLineForMachineCode( 'field R15,0,15' ) ).toStrictEqual( [ 0xef15, 0x000f ] );

          expect( Emulator.parseLineForMachineCode( 'field r1,1,15' ) ).toStrictEqual( [ 0xe115, 0x001f ] );
          expect( Emulator.parseLineForMachineCode( 'field r1,$a,15' ) ).toStrictEqual( [ 0xe115, 0x00af ] );
          expect( Emulator.parseLineForMachineCode( 'field r1,#1110,15' ) ).toStrictEqual( [ 0xe115, 0x00ef ] );

          expect( Emulator.parseLineForMachineCode( 'field r1,0,1' ) ).toStrictEqual( [ 0xe115, 0x0001 ] );
          expect( Emulator.parseLineForMachineCode( 'field r1,0,$f' ) ).toStrictEqual( [ 0xe115, 0x000f ] );
          expect( Emulator.parseLineForMachineCode( 'field r1,0,#1110' ) ).toStrictEqual( [ 0xe115, 0x000e ] );
        } );

    // RRKKEXP
      // EXTRACT
        test( 'PARSE RRKKEXP extract', () => {
          expect( Emulator.parseLineForMachineCode( 'extract r1,r2,0,0' ) ).toStrictEqual( [ 0xe112, 0x2000 ] );
          expect( Emulator.parseLineForMachineCode( 'extract R1,R15,0,0' ) ).toStrictEqual( [ 0xe112, 0xf000 ] );

          expect( Emulator.parseLineForMachineCode( 'extract r1,r2,5,0' ) ).toStrictEqual( [ 0xe112, 0x2050 ] );
          expect( Emulator.parseLineForMachineCode( 'extract r1,r2,$f,0' ) ).toStrictEqual( [ 0xe112, 0x20f0 ] );
          expect( Emulator.parseLineForMachineCode( 'extract r1,r2,#1110,0' ) ).toStrictEqual( [ 0xe112, 0x20e0 ] );

          expect( Emulator.parseLineForMachineCode( 'extract r1,r2,0,5' ) ).toStrictEqual( [ 0xe112, 0x2005 ] );
          expect( Emulator.parseLineForMachineCode( 'extract r1,r2,0,#1110' ) ).toStrictEqual( [ 0xe112, 0x200e ] );
        } );

      // EXTRACTI
        test( 'PARSE RRKKEXP extracti', () => {
          expect( Emulator.parseLineForMachineCode( 'extracti r1,r2,0,0' ) ).toStrictEqual( [ 0xe113, 0x2000 ] );
          expect( Emulator.parseLineForMachineCode( 'extracti R1,R15,0,0' ) ).toStrictEqual( [ 0xe113, 0xf000 ] );

          expect( Emulator.parseLineForMachineCode( 'extracti r1,r2,5,0' ) ).toStrictEqual( [ 0xe113, 0x2050 ] );
          expect( Emulator.parseLineForMachineCode( 'extracti r1,r2,$f,0' ) ).toStrictEqual( [ 0xe113, 0x20f0 ] );
          expect( Emulator.parseLineForMachineCode( 'extracti r1,r2,#1110,0' ) ).toStrictEqual( [ 0xe113, 0x20e0 ] );

          expect( Emulator.parseLineForMachineCode( 'extracti r1,r2,0,5' ) ).toStrictEqual( [ 0xe113, 0x2005 ] );
          expect( Emulator.parseLineForMachineCode( 'extracti r1,r2,0,#1110' ) ).toStrictEqual( [ 0xe113, 0x200e ] );
        } );

    // RRRKKEXP
      // INJECT
        test( 'PARSE RRRKKEXP inject', () => {
          expect( Emulator.parseLineForMachineCode( 'inject r1,r2,r3,0,0' ) ).toStrictEqual( [ 0xe114, 0x2300 ] );
          expect( Emulator.parseLineForMachineCode( 'inject R1,R5,R15,0,0' ) ).toStrictEqual( [ 0xe114, 0x5f00 ] );

          expect( Emulator.parseLineForMachineCode( 'inject r1,r2,r3,5,0' ) ).toStrictEqual( [ 0xe114, 0x2350 ] );
          expect( Emulator.parseLineForMachineCode( 'inject r1,r2,r3,$f,0' ) ).toStrictEqual( [ 0xe114, 0x23f0 ] );
          expect( Emulator.parseLineForMachineCode( 'inject r1,r2,r3,#1110,0' ) ).toStrictEqual( [ 0xe114, 0x23e0 ] );

          expect( Emulator.parseLineForMachineCode( 'inject r1,r2,r3,0,5' ) ).toStrictEqual( [ 0xe114, 0x2305 ] );
          expect( Emulator.parseLineForMachineCode( 'inject r1,r2,r3,0,$f' ) ).toStrictEqual( [ 0xe114, 0x230f ] );
          expect( Emulator.parseLineForMachineCode( 'inject r1,r2,r3,0,#1110' ) ).toStrictEqual( [ 0xe114, 0x230e ] );
        } );

      // INJECTI
        test( 'PARSE RRRKKEXP injecti', () => {
          expect( Emulator.parseLineForMachineCode( 'injecti r1,r2,r3,0,0' ) ).toStrictEqual( [ 0xe115, 0x2300 ] );
          expect( Emulator.parseLineForMachineCode( 'injecti R1,R5,R15,0,0' ) ).toStrictEqual( [ 0xe115, 0x5f00 ] );

          expect( Emulator.parseLineForMachineCode( 'injecti r1,r2,r3,5,0' ) ).toStrictEqual( [ 0xe115, 0x2350 ] );
          expect( Emulator.parseLineForMachineCode( 'injecti r1,r2,r3,$f,0' ) ).toStrictEqual( [ 0xe115, 0x23f0 ] );
          expect( Emulator.parseLineForMachineCode( 'injecti r1,r2,r3,#1110,0' ) ).toStrictEqual( [ 0xe115, 0x23e0 ] );

          expect( Emulator.parseLineForMachineCode( 'injecti r1,r2,r3,0,5' ) ).toStrictEqual( [ 0xe115, 0x2305 ] );
          expect( Emulator.parseLineForMachineCode( 'injecti r1,r2,r3,0,#1110' ) ).toStrictEqual( [ 0xe115, 0x230e ] );
        } );

      // LOGICB
        test( 'PARSE RRRKKEXP logicb', () => {
          expect( Emulator.parseLineForMachineCode( 'logicb r1,r2,r3,0,0' ) ).toStrictEqual( [ 0xe117, 0x2300 ] );
          expect( Emulator.parseLineForMachineCode( 'logicb R1,R5,R15,0,0' ) ).toStrictEqual( [ 0xe117, 0x5f00 ] );

          expect( Emulator.parseLineForMachineCode( 'logicb r1,r2,r3,5,0' ) ).toStrictEqual( [ 0xe117, 0x2350 ] );
          expect( Emulator.parseLineForMachineCode( 'logicb r1,r2,r3,$f,0' ) ).toStrictEqual( [ 0xe117, 0x23f0 ] );
          expect( Emulator.parseLineForMachineCode( 'logicb r1,r2,r3,#1110,0' ) ).toStrictEqual( [ 0xe117, 0x23e0 ] );

          expect( Emulator.parseLineForMachineCode( 'logicb r1,r2,r3,0,5' ) ).toStrictEqual( [ 0xe117, 0x2305 ] );
          expect( Emulator.parseLineForMachineCode( 'logicb r1,r2,r3,0,$f' ) ).toStrictEqual( [ 0xe117, 0x230f ] );
          expect( Emulator.parseLineForMachineCode( 'logicb r1,r2,r3,0,#1110' ) ).toStrictEqual( [ 0xe117, 0x230e ] );
        } );

    // RRRKEXP
      // LOGICW
        test( 'PARSE RRRKEXP logicw', () => {
          expect( Emulator.parseLineForMachineCode( 'logicw r1,r2,r3,0' ) ).toStrictEqual( [ 0xe116, 0x2300 ] );
          expect( Emulator.parseLineForMachineCode( 'logicw R1,R5,R15,0' ) ).toStrictEqual( [ 0xe116, 0x5f00 ] );

          expect( Emulator.parseLineForMachineCode( 'logicw r1,r2,r3,5' ) ).toStrictEqual( [ 0xe116, 0x2350 ] );
          expect( Emulator.parseLineForMachineCode( 'logicw r1,r2,r3,$f' ) ).toStrictEqual( [ 0xe116, 0x23f0 ] );
          expect( Emulator.parseLineForMachineCode( 'logicw r1,r2,r3,#1110' ) ).toStrictEqual( [ 0xe116, 0x23e0 ] );
        } );

    // LOGICALIASRRRK
      // ANDB
        test( 'PARSE LOGICALIASRRRK andb', () => {
          expect( Emulator.parseLineForMachineCode( 'andb r1,r2,r3,0' ) ).toStrictEqual( [ 0xe117, 0x2310 ] );
          expect( Emulator.parseLineForMachineCode( 'andb R1,R5,R15,0' ) ).toStrictEqual( [ 0xe117, 0x5f10 ] );

          expect( Emulator.parseLineForMachineCode( 'andb r1,r2,r3,5' ) ).toStrictEqual( [ 0xe117, 0x2315 ] );
          expect( Emulator.parseLineForMachineCode( 'andb r1,r2,r3,$f' ) ).toStrictEqual( [ 0xe117, 0x231f ] );
          expect( Emulator.parseLineForMachineCode( 'andb r1,r2,r3,#1110' ) ).toStrictEqual( [ 0xe117, 0x231e ] );
        } );

      // ORB
        test( 'PARSE LOGICALIASRRRK orb', () => {
          expect( Emulator.parseLineForMachineCode( 'orb r1,r2,r3,0' ) ).toStrictEqual( [ 0xe117, 0x2370 ] );
          expect( Emulator.parseLineForMachineCode( 'orb R1,R5,R15,0' ) ).toStrictEqual( [ 0xe117, 0x5f70 ] );

          expect( Emulator.parseLineForMachineCode( 'orb r1,r2,r3,5' ) ).toStrictEqual( [ 0xe117, 0x2375 ] );
          expect( Emulator.parseLineForMachineCode( 'orb r1,r2,r3,$f' ) ).toStrictEqual( [ 0xe117, 0x237f ] );
          expect( Emulator.parseLineForMachineCode( 'orb r1,r2,r3,#1110' ) ).toStrictEqual( [ 0xe117, 0x237e ] );
        } );

      // XORB
        test( 'PARSE LOGICALIASRRRK xorb', () => {
          expect( Emulator.parseLineForMachineCode( 'xorb r1,r2,r3,0' ) ).toStrictEqual( [ 0xe117, 0x2360 ] );
          expect( Emulator.parseLineForMachineCode( 'xorb R1,R5,R15,0' ) ).toStrictEqual( [ 0xe117, 0x5f60 ] );

          expect( Emulator.parseLineForMachineCode( 'xorb r1,r2,r3,5' ) ).toStrictEqual( [ 0xe117, 0x2365 ] );
          expect( Emulator.parseLineForMachineCode( 'xorb r1,r2,r3,$f' ) ).toStrictEqual( [ 0xe117, 0x236f ] );
          expect( Emulator.parseLineForMachineCode( 'xorb r1,r2,r3,#1110' ) ).toStrictEqual( [ 0xe117, 0x236e ] );
        } );

    // LOGICALIASRRK
      // INVB
        test( 'PARSE LOGICALIASRRRK invb', () => {
          expect( Emulator.parseLineForMachineCode( 'invb r1,r2,0' ) ).toStrictEqual( [ 0xe117, 0x20c0 ] );
          expect( Emulator.parseLineForMachineCode( 'invb R1,R15,0' ) ).toStrictEqual( [ 0xe117, 0xf0c0 ] );

          expect( Emulator.parseLineForMachineCode( 'invb r1,r2,5' ) ).toStrictEqual( [ 0xe117, 0x20c5 ] );
          expect( Emulator.parseLineForMachineCode( 'invb r1,r2,$f' ) ).toStrictEqual( [ 0xe117, 0x20cf ] );
          expect( Emulator.parseLineForMachineCode( 'invb r1,r2,#1110' ) ).toStrictEqual( [ 0xe117, 0x20ce ] );
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

  // parseCodeToCompatible
    test( 'PARSE parseCodeToCompatible commands', () => {
      expect( Emulator.parseCodeToCompatible( ' add R1,R2,R3' ) ).toBe( ' add R1,R2,R3\n' );
      expect( Emulator.parseCodeToCompatible( 'add R1,R2,R3' ) ).toBe( ' add R1,R2,R3\n' );
      expect( Emulator.parseCodeToCompatible( '    add R1,R2,R3' ) ).toBe( ' add R1,R2,R3\n' );
    } );

    test( 'PARSE parseCodeToCompatible commands + label', () => {
      expect( Emulator.parseCodeToCompatible( 'label add R1,R2,R3' ) ).toBe( 'label add R1,R2,R3\n' );
      expect( Emulator.parseCodeToCompatible( '   label add R1,R2,R3' ) ).toBe( 'label add R1,R2,R3\n' );
    } );

    test( 'PARSE parseCodeToCompatible label', () => {
      expect( Emulator.parseCodeToCompatible( 'label' ) ).toBe( 'label \n' );
      expect( Emulator.parseCodeToCompatible( '   label' ) ).toBe( 'label \n' );
    } );

    test( 'PARSE parseCodeToCompatible arguments all', () => {
      // RR
        expect( Emulator.parseCodeToCompatible( '     inv R1,R2' ) ).toBe( ' inv R1,R2\n' );
        expect( Emulator.parseCodeToCompatible( 'inv r1,r2' ) ).toBe( ' inv R1,R2\n' );

      // RRR
        expect( Emulator.parseCodeToCompatible( '     add R1,R2,R3' ) ).toBe( ' add R1,R2,R3\n' );
        expect( Emulator.parseCodeToCompatible( 'add r1,r2,r3' ) ).toBe( ' add R1,R2,R3\n' );

      // RX
        expect( Emulator.parseCodeToCompatible( '     lea R1,#110000[R0]' ) ).toBe( ' lea R1,48[R0]\n' );
        expect( Emulator.parseCodeToCompatible( '     lea R1,$30[R0]' ) ).toBe( ' lea R1,48[R0]\n' );
        expect( Emulator.parseCodeToCompatible( 'lea r1,test[r0]' ) ).toBe( ' lea R1,test[R0]\n' );

      // JX
        expect( Emulator.parseCodeToCompatible( '     jump #110000[R0]' ) ).toBe( ' jump 48[R0]\n' );
        expect( Emulator.parseCodeToCompatible( '     jump $30[R0]' ) ).toBe( ' jump 48[R0]\n' );
        expect( Emulator.parseCodeToCompatible( 'jump test[r0]' ) ).toBe( ' jump test[R0]\n' );

      // KX
        expect( Emulator.parseCodeToCompatible( '     jumpc0 1,#110000[R0]' ) ).toBe( ' jumpc0 1,48[R0]\n' );
        expect( Emulator.parseCodeToCompatible( '     jumpc0 1,$30[R0]' ) ).toBe( ' jumpc0 1,48[R0]\n' );
        expect( Emulator.parseCodeToCompatible( 'jumpc0 1,test[r0]' ) ).toBe( ' jumpc0 1,test[R0]\n' );

      // JUMPALIAS
        expect( Emulator.parseCodeToCompatible( '     jumpne #110000[R0]' ) ).toBe( ' jumpne 48[R0]\n' );
        expect( Emulator.parseCodeToCompatible( '     jumpne $30[R0]' ) ).toBe( ' jumpne 48[R0]\n' );
        expect( Emulator.parseCodeToCompatible( 'jumpne test[r0]' ) ).toBe( ' jumpne test[R0]\n' );

      // X
        expect( Emulator.parseCodeToCompatible( '     data #110000' ) ).toBe( ' data 48\n' );
        expect( Emulator.parseCodeToCompatible( '     data $30' ) ).toBe( ' data 48\n' );
        expect( Emulator.parseCodeToCompatible( 'data 12' ) ).toBe( ' data 12\n' );

        expect( Emulator.parseCodeToCompatible( '     data 48,$30,#110000' ) ).toBe( ' data 48\n data 48\n data 48\n' );

        expect( Emulator.parseCodeToCompatible( 'thing     data 48,$30,#110000' ) ).toBe( 'thing data 48\n data 48\n data 48\n' );

        expect( Emulator.parseCodeToCompatible( '     data 48,$30,#110000;comment' ) ).toBe( ' data 48;comment\n data 48;comment\n data 48;comment\n' );

      // NOEXP
        expect( Emulator.parseCodeToCompatible( '     rfi R1,R2' ) ).toBe( ' rfi \n' );
        expect( Emulator.parseCodeToCompatible( 'rfi r1,r2' ) ).toBe( ' rfi \n' );

      // RREXP
        expect( Emulator.parseCodeToCompatible( '     execute R1,R2' ) ).toBe( ' execute R1,R2\n' );
        expect( Emulator.parseCodeToCompatible( 'execute r1,r2' ) ).toBe( ' execute R1,R2\n' );

      // RRXEXP
        expect( Emulator.parseCodeToCompatible( '     save R1,r2,#110000[R0]' ) ).toBe( ' save R1,R2,48[R0]\n' );
        expect( Emulator.parseCodeToCompatible( '     save R1,r2,$30[R0]' ) ).toBe( ' save R1,R2,48[R0]\n' );
        expect( Emulator.parseCodeToCompatible( 'save r1,r2,test[r0]' ) ).toBe( ' save R1,R2,test[R0]\n' );

      // RCEXP
        expect( Emulator.parseCodeToCompatible( '     getctl R1,pc' ) ).toBe( ' getctl R1,pc\n' );
        expect( Emulator.parseCodeToCompatible( 'getctl r1,pc' ) ).toBe( ' getctl R1,pc\n' );

      // RRREXP
        expect( Emulator.parseCodeToCompatible( '     push R1,R2,R3' ) ).toBe( ' push R1,R2,R3\n' );
        expect( Emulator.parseCodeToCompatible( 'push r1,r2,r3' ) ).toBe( ' push R1,R2,R3\n' );

      // RRKEXP
        expect( Emulator.parseCodeToCompatible( '     shiftl R1,r2,3' ) ).toBe( ' shiftl R1,R2,3\n' );
        expect( Emulator.parseCodeToCompatible( 'shiftl r1,r2,3' ) ).toBe( ' shiftl R1,R2,3\n' );

        expect( Emulator.parseCodeToCompatible( 'shiftl r1,r2,$f' ) ).toBe( ' shiftl R1,R2,15\n' );

        expect( Emulator.parseCodeToCompatible( 'shiftl r1,r2,#11' ) ).toBe( ' shiftl R1,R2,3\n' );

      // RKEXP
        expect( Emulator.parseCodeToCompatible( '     getbit R1,2' ) ).toBe( ' getbit R1,2\n' );
        expect( Emulator.parseCodeToCompatible( 'getbit r1,2' ) ).toBe( ' getbit R1,2\n' );

        expect( Emulator.parseCodeToCompatible( 'getbit r1,$f' ) ).toBe( ' getbit R1,15\n' );

        expect( Emulator.parseCodeToCompatible( 'getbit r1,#10' ) ).toBe( ' getbit R1,2\n' );

      // INJECTIALIAS
        expect( Emulator.parseCodeToCompatible( '     field R1,2,3' ) ).toBe( ' field R1,2,3\n' );
        expect( Emulator.parseCodeToCompatible( 'field r1,2,3' ) ).toBe( ' field R1,2,3\n' );

        expect( Emulator.parseCodeToCompatible( 'field r1,2,$f' ) ).toBe( ' field R1,2,15\n' );

        expect( Emulator.parseCodeToCompatible( 'field r1,2,#11' ) ).toBe( ' field R1,2,3\n' );

      // RRKKEXP
        expect( Emulator.parseCodeToCompatible( '     extract R1,R2,3,4' ) ).toBe( ' extract R1,R2,3,4\n' );
        expect( Emulator.parseCodeToCompatible( 'extract r1,r2,3,4' ) ).toBe( ' extract R1,R2,3,4\n' );

        expect( Emulator.parseCodeToCompatible( 'extract r1,r2,$3,$f' ) ).toBe( ' extract R1,R2,3,15\n' );

        expect( Emulator.parseCodeToCompatible( 'extract r1,r2,#11,#100' ) ).toBe( ' extract R1,R2,3,4\n' );

      // RRRKKEXP
        expect( Emulator.parseCodeToCompatible( '     logicb R1,R2,R3,4,5' ) ).toBe( ' logicb R1,R2,R3,4,5\n' );
        expect( Emulator.parseCodeToCompatible( 'logicb r1,r2,r3,4,5' ) ).toBe( ' logicb R1,R2,R3,4,5\n' );

        expect( Emulator.parseCodeToCompatible( 'logicb r1,r2,r3,$4,$5' ) ).toBe( ' logicb R1,R2,R3,4,5\n' );

        expect( Emulator.parseCodeToCompatible( 'logicb r1,r2,r3,#100,#101' ) ).toBe( ' logicb R1,R2,R3,4,5\n' );

      // RRRKEXP
        expect( Emulator.parseCodeToCompatible( '     logicw R1,R2,R3,4' ) ).toBe( ' logicw R1,R2,R3,4\n' );
        expect( Emulator.parseCodeToCompatible( 'logicw r1,r2,r3,4' ) ).toBe( ' logicw R1,R2,R3,4\n' );

        expect( Emulator.parseCodeToCompatible( 'logicw r1,r2,r3,$f' ) ).toBe( ' logicw R1,R2,R3,15\n' );

        expect( Emulator.parseCodeToCompatible( 'logicw r1,r2,r3,#100' ) ).toBe( ' logicw R1,R2,R3,4\n' );

      // LOGICALIASRRRK
        expect( Emulator.parseCodeToCompatible( '     andb R1,R2,R3,4' ) ).toBe( ' andb R1,R2,R3,4\n' );
        expect( Emulator.parseCodeToCompatible( 'andb r1,r2,r3,4' ) ).toBe( ' andb R1,R2,R3,4\n' );

        expect( Emulator.parseCodeToCompatible( 'andb r1,r2,r3,$f' ) ).toBe( ' andb R1,R2,R3,15\n' );

        expect( Emulator.parseCodeToCompatible( 'andb r1,r2,r3,#100' ) ).toBe( ' andb R1,R2,R3,4\n' );

      // LOGICALIASRRK
        expect( Emulator.parseCodeToCompatible( '     invb R1,R2,3' ) ).toBe( ' invb R1,R2,3\n' );
        expect( Emulator.parseCodeToCompatible( 'invb r1,r2,3' ) ).toBe( ' invb R1,R2,3\n' );

        expect( Emulator.parseCodeToCompatible( 'invb r1,r2,$f' ) ).toBe( ' invb R1,R2,15\n' );

        expect( Emulator.parseCodeToCompatible( 'invb r1,r2,#101' ) ).toBe( ' invb R1,R2,5\n' );

      // LOGICALIASRRR
        expect( Emulator.parseCodeToCompatible( '     andnew R1,R2,R3' ) ).toBe( ' andnew R1,R2,R3\n' );
        expect( Emulator.parseCodeToCompatible( 'andnew r1,r2,r3' ) ).toBe( ' andnew R1,R2,R3\n' );

      // LOGICALIASRR
        expect( Emulator.parseCodeToCompatible( '     invnew R1,R2' ) ).toBe( ' invnew R1,R2\n' );
        expect( Emulator.parseCodeToCompatible( 'invnew r1,r2' ) ).toBe( ' invnew R1,R2\n' );
    } );

// RUNNING METHODS
  // setMemory
    test( 'RUN setMemory', () => {
      const machineCode = [ 0xf101, 0x0008, 0xf201, 0x0009, 0x0312, 0xf302, 0x000a, 0xd000, 0x0001, 0x0002, 0x0000 ];
      var memory = new Map();
      for ( var i = 0; i < machineCode.length; i++ ) memory.set(i, machineCode[i]);

      expect( Emulator.setMemory( machineCode ) ).toStrictEqual( memory );
    } );

  // runMemory is ran with the assumption that lines have been checked, then parsed, and set into memory with previously tested functions
    // SETUP
      function fresh() {
        var control = new Map();
        control.set( 'pc', 0 );
        control.set( 'ir', 0 );
        control.set( 'adr', 0 );

        return {
          'registers' : new Array( 16 ).fill( 0 ),
          'memory' : new Map(),
          'control' : control
        };
      }

      function updateControl( inputMemory, inputControl ) {
        var outputControl = new Map();
        outputControl.set( 'pc', inputControl.get( 'pc' ) + 1 );
        outputControl.set( 'ir', ( inputMemory.has( inputControl.get( 'pc' ) ) ) ? inputMemory.get( inputControl.get( 'pc' ) ) : 0x0000 );
        outputControl.set( 'adr', 0x0000 );

        return outputControl;
      }

      function updateControlDouble( inputMemory, inputControl ) {
        var outputControl = new Map();
        outputControl.set( 'pc', inputControl.get( 'pc' ) + 2 );
        outputControl.set( 'ir', ( inputMemory.has( inputControl.get( 'pc' ) + 1 ) ) ? inputMemory.get( inputControl.get( 'pc' ) ) : 0x0000 );
        outputControl.set( 'adr', ( inputMemory.has( inputControl.get( 'pc' ) + 1 ) ) ? inputMemory.get( inputControl.get( 'pc' ) + 1 ) : 0x0000 );

        return outputControl;
      }

      function testFromChanges( inputs, outputs, testMode=true ) {
        // INPUTS
          var testControl = fresh()['control'];
          var testMemory = fresh()['memory'];
          var testRegisters = fresh()['registers'];
          var testInput = 'Hello, Computer!';
          var testOutput = '';

          var i;

          if ( inputs['control'] !== undefined ) {
            for ( const key of inputs['control'].keys() ) {
              testControl.set( key, inputs['control'].get( key ) );
            }
          }

          if ( inputs['registers'] !== undefined ) {
            for ( i = 0; i < Object.keys( inputs['registers'] ).length; i++ ) {
              testRegisters[ Object.keys( inputs['registers'] )[i] ] = inputs['registers'][ Object.keys( inputs['registers'] )[i] ];
            }
          }

          if ( inputs['memory'] !== undefined ) {
            for ( const key of inputs['memory'].keys() ) {
              testMemory.set( key, inputs['memory'].get( key ) );
            }
          }

          if ( inputs['input'] !== undefined ) {
            testInput = inputs['input'];
          }

          if ( inputs['output'] !== undefined ) {
            testOutput = inputs['output'];
          }

        // OUTPUTS
          var resultControl = new Map( testControl );
          var resultRegisters = [...testRegisters];
          var resultMemory = new Map( testMemory );
          var resultInput = testInput;
          var resultOutput = testOutput;
          var resultHalted = false;

          if ( outputs['registers'] !== undefined ) {
            for ( i = 0; i < Object.keys( outputs['registers'] ).length; i ++ ) {
              resultRegisters[ Object.keys( outputs['registers'] )[i] ] = outputs['registers'][ Object.keys( outputs['registers'] )[i] ];
            }
          }

          if ( outputs['memory'] !== undefined ) {
            for ( const key of outputs['memory'].keys() ) {
              resultMemory.set( key, outputs['memory'].get( key ) );
            }
          }

          if ( outputs['control'] !== undefined ) {
            for ( const key of outputs['control'].keys() ) {
              resultControl.set( key, outputs['control'].get( key ) );
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
          var parsed = Emulator.runMemory( testControl, testRegisters, testMemory, testInput, testOutput, testMode );
          expect( parsed['control'] ).toStrictEqual( resultControl );
          expect( parsed['registers'] ).toStrictEqual( resultRegisters );
          expect( parsed['memory'] ).toStrictEqual( resultMemory );
          expect( parsed['input'] ).toBe( resultInput );
          expect( parsed['output'] ).toBe( resultOutput );
          expect( parsed['halted'] ).toBe( resultHalted );

        return parsed;
      }

    // RRR
      test( 'RUN RRR add', () => {
        var inputMemory = fresh()['memory'];
        var inputRegisters = fresh()['registers'];

        inputMemory.set( 0, 0x0511 ); // add r5,r1,r1 <- add 5,1,1 <- r5 := 2, r15 := 0xc000
        inputMemory.set( 1, 0x0500 ); // add r5,r0,r0 <- add 5,0,0 <- r5 := 0, r15 := 0x2000
        inputMemory.set( 2, 0x0503 ); // add r5,r0,r3 <- add 5,0,0xffff <- r5 := 0xffff, r15 := 0x9000

        inputMemory.set( 3, 0x0531 ); // add r5,r3,r1 <- add 5,0xffff,1 <- r5 := 0, r15 := 0x2500 <- ccC, ccV, ccE

        inputMemory.set( 4, 0x0532 ); // add r5,r3,r2 <- add 5,0xffff,2 <- r5 := 1, r15 := 0xc500 <- ccC, ccV, ccG, ccg

        inputMemory.set( 5, 0x0534 ); // add r5,r3,r4 <- add 5,0xffff,0xfffe <- r5 := 0xfffd, r15 := 0x9500 <- ccC, ccV, ccG, ccl

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

        for ( var i = 0; i < results.length; i++ ) {
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

        inputMemory.set( 0, 0x1411 ); // sub r4,r1,r1 <- sub 4,1,1 <- r4 := 0, r15 := 0x2000
        inputMemory.set( 1, 0x1400 ); // sub r4,r0,r0 <- sub 4,0,0 <- r4 := 0, r15 := 0x2000
        inputMemory.set( 2, 0x1402 ); // sub r4,r0,r2 <- sub 4,0,0xffff <- r4 := 1, r15 := 0xc200 <- ccv, ccE

        inputMemory.set( 3, 0x1422 ); // sub r4,r2,r2 <- sub 4,0xffff,0xffff <- r4 := 0, r15 := 0x2000
        inputMemory.set( 4, 0x1423 ); // sub r4,r2,r3 <- sub 4,0xffff,0xfffe <- r4 := 1, r15 := 0xc000

        inputMemory.set( 5, 0x1421 ); // sub r4,r2,r1 <- sub 4,0xffff,1 <- r4 := fffe, r15 := 0x9000 <- ccG, ccl
        inputMemory.set( 6, 0x1432 ); // sub r4,r3,r2 <- sub 4,0xfffe,0xffff <- r4 := ffff, r15 := 0x9200 <- ccv, ccG, ccl

        inputRegisters[1] = 0x0001;
        inputRegisters[2] = 0xffff;
        inputRegisters[3] = 0xfffe;

        var results = [
          [ 0x0000, 0x2000 ],
          [ 0x0000, 0x2000 ],
          [ 0x0001, 0xc200 ],
          [ 0x0000, 0x2000 ],
          [ 0x0001, 0xc000 ],
          [ 0xfffe, 0x9000 ],
          [ 0xffff, 0x9200 ]
        ];

        var outputControl = updateControl( inputMemory, fresh()['control'] );
        
        var parsed = {
          'control' : fresh()['control'],
          'registers' : inputRegisters,
          'memory' : inputMemory
        };

        for ( var i = 0; i < results.length; i++ ) {
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

        inputMemory.set( 0, 0x2511 ); // mul r5,r1,r1 <- mul 5,1,1 <- r5 := 1, r15 := 0xc000
        inputMemory.set( 1, 0x2500 ); // mul r5,r0,r0 <- mul 5,0,0 <- r5 := 0, r15 := 0x2000
        inputMemory.set( 2, 0x2501 ); // mul r5,r0,r1 <- mul 5,0,1 <- r5 := 0, r15 := 0x2000
        inputMemory.set( 3, 0x2512 ); // mul r5,r1,r2 <- mul 5,1,2 <- r5 := 2, r15 := 0xc000
        inputMemory.set( 4, 0x2513 ); // mul r5,r1,r3 <- mul 5,1,3 <- r5 := 0xffff, r15 := 0x9000
        inputMemory.set( 5, 0x2523 ); // mul r5,r2,r3 <- mul 5,2,3 <- r5 := 0xfffe, r15 := 0x9400

        inputMemory.set( 6, 0x2533 ); // mul r5,r3,r3 <- mul 5,3,3 <- r5 := 1, r15 := 0xc400 <- ccG, ccg, ccV
        inputMemory.set( 7, 0x2543 ); // mul r5,r4,r3 <- mul 5,4,3 <- r5 := 0x0012, r15 := 0xc400 <- ccG, ccg, ccV

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

        for ( var i = 0; i < results.length; i++ ) {
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

        inputMemory.set( 0, 0x3611 ); // div r6,r1,r1 <- div 6,1,1 <- r6 := 1, r15 := 0x0
        inputMemory.set( 1, 0x3600 ); // div r6,r0,r0 <- div 6,0,0 <- r6 := 0, r15 := 0x0
        inputMemory.set( 2, 0x3610 ); // div r6,r1,r0 <- div 6,1,0 <- r6 := 1, r15 := 0x0

        inputMemory.set( 3, 0x3623 ); // div r6,r2,r3 <- div 6,0x0011,3 <- r6 := 5, r15 := 2
        inputMemory.set( 4, 0x3f23 ); // div r15,r2,r3 <- div 15,0x0011,2 <- r6 := 5, r15 := 5

        inputMemory.set( 5, 0x3643 ); // div r6,r4,r3 <- div 6,0xffef,3 <- r6 := 0xfffa, r15 := 0xfffe

        inputMemory.set( 6, 0x3645 ); // div r6,r4,r5 <- div 6,0xffef,0xfffd <- r6 := 5, r15 := 0xfffe

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

        for ( var i = 0; i < results.length; i++ ) {
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

      test( 'RUN RRR cmp', () => {
        var inputMemory = fresh()['memory'];
        var inputRegisters = fresh()['registers'];

        inputMemory.set( 0, 0x4112 ); // cmp r1,r2 <- cmp 1,2 <- r15 := 0x1800
        inputMemory.set( 1, 0x4111 ); // cmp r1,r1 <- cmp 1,1 <- r15 := 0x2000
        inputMemory.set( 2, 0x4110 ); // cmp r1,r0 <- cmp 1,0 <- r15 := 0xc000

        inputMemory.set( 3, 0x4330 ); // cmp r3,r0 <- cmp 0xffff,0 <- r15 := 0x9000
        inputMemory.set( 4, 0x4333 ); // cmp r3,r3 <- cmp 0xffff,0xffff <- r15 := 0x2000
        inputMemory.set( 5, 0x4334 ); // cmp r3,r4 <- cmp 0xffff,0xfffe <- r15 := 0xc000

        inputMemory.set( 6, 0x4332 ); // cmp r3,r2 <- cmp 0xffff,2 <- r15 := 0x9000
        inputMemory.set( 7, 0x4000 ); // cmp r0,r0 <- cmp 0,0 <- r15 := 0x2000
        inputMemory.set( 8, 0x4223 ); // cmp r2,r3 <- cmp 0xffff,2 <- r15 := 0x4800

        inputMemory.set( 9, 0x4003 ); // cmp r0,r3 <- cmp 0,0xffff <- r15 := 0x4800

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

        for ( var i = 0; i < results.length; i++ ) {
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

      test( 'RUN RRR cmplt', () => {
        var inputMemory = fresh()['memory'];
        var inputRegisters = fresh()['registers'];

        inputMemory.set( 0, 0x5512 ); // cmplt r5,r1,r2 <- cmplt 5,1,2 <- r5 := 1
        inputMemory.set( 1, 0x5511 ); // cmplt r5,r1,r1 <- cmplt 5,1,1 <- r5 := 0
        inputMemory.set( 2, 0x5521 ); // cmplt r5,r2,r1 <- cmplt 5,2,1 <- r5 := 0

        inputMemory.set( 3, 0x5534 ); // cmplt r5,r3,r4 <- cmplt 5,0xffff,0xfffe <- r5 := 0
        inputMemory.set( 4, 0x5533 ); // cmplt r5,r3,r3 <- cmplt 5,0xffff,0xffff <- r5 := 0
        inputMemory.set( 5, 0x5543 ); // cmplt r5,r4,r3 <- cmplt 5,0xfffe,0xffff <- r5 := 1
        inputMemory.set( 6, 0x5530 ); // cmplt r5,r3,r0 <- cmplt 5,0xffff,0 <- r5 := 1

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

        for ( var i = 0; i < results.length; i++ ) {
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

        inputMemory.set( 0, 0x6512 ); // cmpeq r5,r1,r2 <- cmpeq 5,1,2 <- r5 := 0
        inputMemory.set( 1, 0x6511 ); // cmpeq r5,r1,r1 <- cmpeq 5,1,1 <- r5 := 1
        inputMemory.set( 2, 0x6521 ); // cmpeq r5,r2,r1 <- cmpeq 5,2,1 <- r5 := 0

        inputMemory.set( 3, 0x6534 ); // cmpeq r5,r3,r4 <- cmpeq 5,0xffff,0xfffe <- r5 := 0
        inputMemory.set( 4, 0x6533 ); // cmpeq r5,r3,r3 <- cmpeq 5,0xffff,0xffff <- r5 := 1
        inputMemory.set( 5, 0x6543 ); // cmpeq r5,r4,r3 <- cmpeq 5,0xfffe,0xffff <- r5 := 0
        inputMemory.set( 6, 0x6530 ); // cmpeq r5,r3,r0 <- cmpeq 5,0xffff,0 <- r5 := 0

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

        for ( var i = 0; i < results.length; i++ ) {
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

        inputMemory.set( 0, 0x7512 ); // cmpgt r5,r1,r2 <- cmpgt 5,1,2 <- r5 := 0
        inputMemory.set( 1, 0x7511 ); // cmpgt r5,r1,r1 <- cmpgt 5,1,1 <- r5 := 0
        inputMemory.set( 2, 0x7521 ); // cmpgt r5,r2,r1 <- cmpgt 5,2,1 <- r5 := 1

        inputMemory.set( 3, 0x7534 ); // cmpgt r5,r3,r4 <- cmpgt 5,0xffff,0xfffe <- r5 := 1
        inputMemory.set( 4, 0x7533 ); // cmpgt r5,r3,r3 <- cmpgt 5,0xffff,0xffff <- r5 := 0
        inputMemory.set( 5, 0x7543 ); // cmpgt r5,r4,r3 <- cmpgt 5,0xfffe,0xffff <- r5 := 0
        inputMemory.set( 6, 0x7530 ); // cmpgt r5,r3,r0 <- cmpgt 5,0xffff,0 <- r5 := 0

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

        for ( var i = 0; i < results.length; i++ ) {
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

      test( 'RUN RRR inv', () => {
        var inputMemory = fresh()['memory'];
        var inputRegisters = fresh()['registers'];

        inputMemory.set( 0, 0x8441 ); // inv r4,r1 <- inv 4,0x0f0f <- r4 := 0xf0f0
        inputMemory.set( 1, 0x8442 ); // inv r4,r2 <- inv 4,0x00ff <- r4 := 0xff00
        inputMemory.set( 2, 0x8443 ); // inv r4,r2 <- inv 4,0xffff <- r4 := 0x0000

        inputRegisters[1] = 0x0f0f;
        inputRegisters[2] = 0x00ff;
        inputRegisters[3] = 0xffff;

        var results = [
          0xf0f0,
          0xff00,
          0x0000
        ];

        var outputControl = updateControl( inputMemory, fresh()['memory'] );
        
        var parsed = {
          'control' : fresh()['control'],
          'registers' : inputRegisters,
          'memory' : inputMemory
        };

        for ( var i = 0; i < results.length; i++ ) {
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

      test( 'RUN RRR and', () => {
        var inputMemory = fresh()['memory'];
        var inputRegisters = fresh()['registers'];

        inputMemory.set( 0, 0x9412 ); // and r4,r1,r2 <- and 4,0x00ff,0x0f0f <- r4 := 0x000f
        inputMemory.set( 1, 0x9413 ); // and r4,r1,r3 <- and 4,0x00ff,0xffff <- r4 := 0x00ff
        inputMemory.set( 2, 0x9410 ); // and r4,r1,r0 <- and 4,0x00ff,0 <- r4 := 0x0000
        inputMemory.set( 3, 0x9433 ); // and r4,r3,r3 <- and 4,0xffff,0xffff <- r4 := 0xffff

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

        for ( var i = 0; i < results.length; i++ ) {
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

        inputMemory.set( 0, 0xa412 ); // or r4,r1,r2 <- or 4,0x00ff,0x0f0f <- r4 := 0x0fff
        inputMemory.set( 1, 0xa413 ); // or r4,r1,r3 <- or 4,0x00ff,0xffff <- r4 := 0xffff
        inputMemory.set( 2, 0xa410 ); // or r4,r1,r0 <- or 4,0x00ff,0 <- r4 := 0x00ff
        inputMemory.set( 3, 0xa433 ); // or r4,r3,r3 <- or 4,0xffff,0xffff <- r4 := 0xffff

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

        for ( var i = 0; i < results.length; i++ ) {
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

        inputMemory.set( 0, 0xb412 ); // xor r4,r1,r2 <- xor 4,0x00ff,0x0f0f <- r4 := 0x0ff0
        inputMemory.set( 1, 0xb413 ); // xor r4,r1,r3 <- xor 4,0x00ff,0xffff <- r4 := 0xff00
        inputMemory.set( 2, 0xb410 ); // xor r4,r1,r0 <- xor 4,0x00ff,0 <- r4 := 0x00ff
        inputMemory.set( 3, 0xb433 ); // xor r4,r3,r3 <- xor 4,0xffff,0xffff <- r4 := 0x0000

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

        for ( var i = 0; i < results.length; i++ ) {
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

        inputMemory.set( 0, 0xc123 ); // nop r1,r2,r3 <- nop 1,0x0f0f,0xffff <- NO CHANGE

        inputRegisters[2] = 0x0f0f;
        inputRegisters[3] = 0xffff;

        var outputControl = updateControl( inputMemory, fresh()['control'] );

        var parsed = {
          'control' : fresh()['control'],
          'registers' : inputRegisters,
          'memory' : inputMemory
        };

        var results = [
          0x0000
        ];

        for ( var i = 0; i < results.length; i++ ) {
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

        inputMemory.set( 0, 0xd123 ); // trap r1,r2,r3 <- trap 1,23,16 <- input := '', output := '>>Hello, Computer!', mem[16 -> 31] = charcodes
        inputMemory.set( 1, 0xd456 ); // trap r4,r5,r6 <- trap 2,10,13 <- output := '>>Hello, Computer!Hello, World!'
        inputMemory.set( 2, 0xd000 ); // trap r0,r0,r0 <- trap 0,0,0 <- halted = true
        inputMemory.set( 3, 0xd123 ); // trap r1,r2,r3 <- trap 1,23,16 <- mem[16 -> 31] = 0

        inputMemory.set( 10, 0x0048 ); // outputbuffer start -> H
        inputMemory.set( 11, 0x0065 ); // -> e
        inputMemory.set( 12, 0x006c ); // -> l
        inputMemory.set( 13, 0x006c ); // -> l
        inputMemory.set( 14, 0x006f ); // -> o
        inputMemory.set( 15, 0x002c ); // -> ,
        inputMemory.set( 16, 0x0020 ); // ->  
        inputMemory.set( 17, 0x0057 ); // -> W
        inputMemory.set( 18, 0x006f ); // -> o
        inputMemory.set( 19, 0x0072 ); // -> r
        inputMemory.set( 20, 0x006c ); // -> l
        inputMemory.set( 21, 0x0064 ); // -> d
        inputMemory.set( 22, 0x0021 ); // -> !

        inputMemory.set( 23, 0x0000 ); // inputbuffer start -> *blank*

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

          var outputMemory = new Map();
          outputMemory.set( 23, 0x0048 ); // -> H
          outputMemory.set( 24, 0x0065 ); // -> e
          outputMemory.set( 25, 0x006c ); // -> l
          outputMemory.set( 26, 0x006c ); // -> l
          outputMemory.set( 27, 0x006f ); // -> o
          outputMemory.set( 28, 0x002c ); // -> ,
          outputMemory.set( 29, 0x0020 ); // ->  
          outputMemory.set( 30, 0x0043 ); // -> C
          outputMemory.set( 31, 0x006f ); // -> o
          outputMemory.set( 32, 0x006d ); // -> m
          outputMemory.set( 33, 0x0070 ); // -> p
          outputMemory.set( 34, 0x0075 ); // -> u
          outputMemory.set( 35, 0x0074 ); // -> t
          outputMemory.set( 36, 0x0065 ); // -> e
          outputMemory.set( 37, 0x0072 ); // -> r
          outputMemory.set( 38, 0x0021 ); // -> !

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

          var outputMemory = new Map();
          outputMemory.set( 23, 0x0 );
          outputMemory.set( 24, 0x0 );
          outputMemory.set( 25, 0x0 );
          outputMemory.set( 26, 0x0 );
          outputMemory.set( 27, 0x0 );
          outputMemory.set( 28, 0x0 );
          outputMemory.set( 29, 0x0 );
          outputMemory.set( 30, 0x0 );
          outputMemory.set( 31, 0x0 );
          outputMemory.set( 32, 0x0 );
          outputMemory.set( 33, 0x0 );
          outputMemory.set( 34, 0x0 );
          outputMemory.set( 35, 0x0 );
          outputMemory.set( 36, 0x0 );
          outputMemory.set( 37, 0x0 );
          outputMemory.set( 38, 0x0 );

          parsed = testFromChanges( parsed,
          {
            'control' : outputControl,
            'memory' : outputMemory,
            'output' : '>>Hello, Computer!Hello, World!>>'
          } );
      } );

    // RX
      test( 'RUN RX lea', () => {
        var inputMemory = fresh()['memory'];
        var inputRegisters = fresh()['registers'];

        inputMemory.set( 0, 0xf400 ); // lea r4,------[r0]
        inputMemory.set( 1, 0x0001 ); // lea r4,0x0001[r0] <- lea 4,0x0001,0 <- r4 := 1
        inputMemory.set( 2, 0xf400 ); // lea r4,------[r0] 
        inputMemory.set( 3, 0x0002 ); // lea r4,0x0002[r0] <- lea 4,0x0002,0 <- r4 := 2

        inputMemory.set( 4, 0xf410 ); // lea r4,------[r1] 
        inputMemory.set( 5, 0xfffe ); // lea r4,0xfffe[r1] <- lea 4,0xfffe,1 <- r4 := 0xffff

        inputMemory.set( 6, 0xf410 ); // lea r4,------[r1] 
        inputMemory.set( 7, 0xffff ); // lea r4,0xffff[r1] <- lea 4,0xffff,1 <- r4 := 0x0
        inputMemory.set( 8, 0xf420 ); // lea r4,------[r2] 
        inputMemory.set( 9, 0xffff ); // lea r4,0xffff[r2] <- lea 4,0xffff,2 <- r4 := 1
        inputMemory.set( 10, 0xf430 ); // lea r4,------[r3] 
        inputMemory.set( 11, 0x0003 ); // lea r4,0x0003[r3] <- lea 4,0x0003,3 <- r4 := 2

        inputRegisters[1] = 1;
        inputRegisters[2] = 2;
        inputRegisters[3] = 0xffff;

        var results = [
          0x0001,
          0x0002,
          0xffff,
          0x0000,
          0x0001,
          0x0002
        ];

        var outputControl = updateControl( inputMemory, fresh()['control'] );
        
        var parsed = {
          'control' : fresh()['control'],
          'registers' : inputRegisters,
          'memory' : inputMemory
        };

        for ( var i = 0; i < results.length; i++ ) {
          outputControl = updateControlDouble( inputMemory, parsed['control'] );

          parsed = testFromChanges( parsed,
          {
            'control' : outputControl,
            'registers' : {
              4 : results[i]
            }
          } );
        }
      } );

      test( 'RUN RX load', () => {
        var inputMemory = fresh()['memory'];
        var inputRegisters = fresh()['registers'];

        inputMemory.set( 0, 0xf401 ); // load r4,------[r0]
        inputMemory.set( 1, 0x0001 ); // load r4,0x0001[r0] <- load 4,0x0001,0 <- r4 := mem[1] <- 0x0001
        inputMemory.set( 2, 0xf401 ); // load r4,------[r0] 
        inputMemory.set( 3, 0x0002 ); // load r4,0x0002[r0] <- load 4,0x0002,0 <- r4 := mem[2] <- 0xf401

        inputMemory.set( 4, 0xf411 ); // load r4,------[r1] 
        inputMemory.set( 5, 0xfffe ); // load r4,0xfffe[r1] <- load 4,0xfffe,1 <- r4 := mem[0xffff] <- 0x0

        inputMemory.set( 6, 0xf411 ); // load r4,------[r1] 
        inputMemory.set( 7, 0xffff ); // load r4,0xffff[r1] <- load 4,0xffff,1 <- r4 := mem[0x0] <- 0xf401
        inputMemory.set( 8, 0xf421 ); // load r4,------[r2] 
        inputMemory.set( 9, 0xffff ); // load r4,0xffff[r2] <- load 4,0xffff,2 <- r4 := mem[1] <- 0x0001
        inputMemory.set( 10, 0xf431 ); // load r4,------[r3] 
        inputMemory.set( 11, 0x0003 ); // load r4,0x0003[r3] <- load 4,0x0003,3 <- r4 := mem[2] <- 0xf401

        inputRegisters[1] = 1;
        inputRegisters[2] = 2;
        inputRegisters[3] = 0xffff;

        var outputMemory = new Map();
        outputMemory.set( 65535, 0 );

        var results = [
          [ 0x0001, new Map()],
          [ 0xf401, new Map()],
          [ 0x0000, outputMemory],
          [ 0xf401, new Map()],
          [ 0x0001, new Map()],
          [ 0xf401, new Map()]
        ];

        var outputControl = updateControl( inputMemory, fresh()['control'] );
        
        var parsed = {
          'control' : fresh()['control'],
          'registers' : inputRegisters,
          'memory' : inputMemory
        };

        for ( var i = 0; i < results.length; i++ ) {
          outputControl = updateControlDouble( inputMemory, parsed['control'] );

          parsed = testFromChanges( parsed,
          {
            'control' : outputControl,
            'registers' : {
              4 : results[i][0]
            },
            'memory' : results[i][1]
          } );
        }
      } );

      test( 'RUN RX store', () => {
        var inputMemory = fresh()['memory'];
        var inputRegisters = fresh()['registers'];

        inputMemory.set( 0, 0xf402 ); // store r4,------[r0]
        inputMemory.set( 1, 0x0010 ); // store r4,0x0010[r0] <- store 4,0x0010,0 <- mem[0x10] := r4 <- 0x0010

        inputMemory.set( 2, 0xf412 ); // store r4,------[r1] 
        inputMemory.set( 3, 0xffff ); // store r4,0xffff[r1] <- store 4,0xffff,1 <- mem[0xf] := r4 <- 0x000f
        inputMemory.set( 4, 0xf422 ); // store r4,------[r2] 
        inputMemory.set( 5, 0x0011 ); // store r4,0x0011[r2] <- store 4,0x0011,2 <- mem[2] := r4 <- 0x0010

        inputRegisters[1] = 0x0010;
        inputRegisters[2] = 0xffff;
        inputRegisters[4] = 0x0f0f;

        var results = [
          0x0010,
          0x000f,
          0x0010
        ];

        var outputControl = updateControl( inputMemory, fresh()['control'] );

        var parsed = {
          'control' : fresh()['control'],
          'registers' : inputRegisters,
          'memory' : inputMemory
        };

        for ( var i = 0; i < results.length; i++ ) {
          outputControl = updateControlDouble( inputMemory, parsed['control'] );
          
          var outputMemory = new Map();
          outputMemory.set( results[i], inputRegisters[4] );

          parsed = testFromChanges( parsed,
          {
            'control' : outputControl,
            'memory' : outputMemory
          } );
        }
      } );

      test( 'RUN RX jump-', () => {
        var inputMemory = fresh()['memory'];
        var inputRegisters = fresh()['registers'];

        inputMemory.set( 0, 0xf003 ); // jump ------[r0]
        inputMemory.set( 1, 0x0010 ); // jump 0x0010[r0] <- jump 0x0010,0 <- pc := mem[0x0010]
        inputMemory.set( 16, 0xf013 ); // jump ------[r1] 
        inputMemory.set( 17, 0x0020 ); // jump 0x0020[r1] <- jump 0x0020,2 <- pc := mem[0x0022]
        
        inputMemory.set( 0x0022, 0xf003 ); // jump ------[r0] 
        inputMemory.set( 0x0023, 0xfff0 ); // jump 0xfff0[r0] <- jump 0xfff0,0 <- pc := mem[0xfff0]
        
        inputRegisters[1] = 2;

        var results = [
          [ 0x0010, {}, false ],
          [ 0x0022, {}, false ],
          [ 0xfff0, {0xfff0 : 0}, false ],
          [ 0xfff1, {0xfff1 : 0}, false ],
          [ 0xfff2, {0xfff2 : 0}, false ],
          [ 0xfff3, {0xfff3 : 0}, false ],
          [ 0xfff4, {0xfff4 : 0}, false ],
          [ 0xfff5, {0xfff5 : 0}, false ],
          [ 0xfff6, {0xfff6 : 0}, false ],
          [ 0xfff7, {0xfff7 : 0}, false ],
          [ 0xfff8, {0xfff8 : 0}, false ],
          [ 0xfff9, {0xfff9 : 0}, false ],
          [ 0xfffa, {0xfffa : 0}, false ],
          [ 0xfffb, {0xfffb : 0}, false ],
          [ 0xfffc, {0xfffc : 0}, false ],
          [ 0xfffd, {0xfffd : 0}, false ],
          [ 0xfffe, {0xfffe : 0}, false ],
          [ 0xffff, {0xffff : 0}, false ],
          [ 0x0000, {}, true ],
        ];

        var outputControl = updateControl( inputMemory, fresh()['control'] );
        
        var parsed = {
          'control' : fresh()['control'],
          'registers' : inputRegisters,
          'memory' : inputMemory
        };

        for ( var i = 0; i < results.length; i++ ) {
          outputControl = updateControlDouble( inputMemory, parsed['control'] );

          outputControl.set( 'pc', results[i][0] );

          var outputRegisters = {};
          if ( results[i][0] > 0xfff0 ) outputRegisters[15] = 0x2000; // since command is add R0,R0,R0 and will result in R15 being set to 0x2000 <- ccE

          var outputMemory = new Map();
          for ( const key of Object.keys( results[i][1] ) ) outputMemory.set( Number.parseInt( key ), results[i][1][key] );

          parsed = testFromChanges( parsed,
          {
            'control' : outputControl,
            'memory' : outputMemory,
            'halted' : results[i][2],
            'registers' : outputRegisters
          },
          false );
        }
      } );

      test( 'RUN RX jumpc0', () => {
        var inputMemory = fresh()['memory'];
        var inputRegisters = fresh()['registers'];

        inputMemory.set( 0, 0xf004 ); // jumpc0 0,------[r0]
        inputMemory.set( 1, 0x0010 ); // jumpc0 0,0x0010[r0] <- jumpc0 0,0x0010,0
        inputMemory.set( 2, 0xf104 ); // jumpc0 1,------[r0] 
        inputMemory.set( 3, 0x0010 ); // jumpc0 1,0x0010[r0] <- jumpc0 1,0x0010,0 <- pc := mem[0x0010]
        inputMemory.set( 16, 0xf114 ); // jumpc0 1,------[r1] 
        inputMemory.set( 17, 0x0020 ); // jumpc0 1,0x0020[r1] <- jumpc0 1,0x0020,2 <- pc := mem[0x0022]
        
        inputMemory.set( 0x0022, 0x0000 ); // jump testMode setting produces 0 in place of next instruction
        
        inputRegisters[1] = 2;
        inputRegisters[15] = 0x8000; // <- ccG, bits[0] := 1

        var results = [
          0x0002,
          0x0010,
          0x0022
        ];

        var outputControl = updateControl( inputMemory, fresh()['control'] );
        
        var parsed = {
          'control' : fresh()['control'],
          'registers' : inputRegisters,
          'memory' : inputMemory
        };

        for ( var i = 0; i < results.length; i++ ) {
          outputControl = updateControlDouble( inputMemory, parsed['control'] );

          outputControl.set( 'pc', results[i] );

          parsed = testFromChanges( parsed,
          {
            'control' : outputControl
          },
          false );
        }
      } );

      test( 'RUN RX jumpc1', () => {
        var inputMemory = fresh()['memory'];
        var inputRegisters = fresh()['registers'];

        inputMemory.set( 0, 0xf105 ); // jumpc1 1,------[r0]
        inputMemory.set( 1, 0x0010 ); // jumpc1 1,0x0010[r0] <- jumpc1 1,0x0010,0
        inputMemory.set( 2, 0xf005 ); // jumpc1 0,------[r0] 
        inputMemory.set( 3, 0x0010 ); // jumpc1 0,0x0010[r0] <- jumpc1 0,0x0010,0 <- pc := mem[0x0010]
        inputMemory.set( 16, 0xf015 ); // jumpc1 0,------[r1] 
        inputMemory.set( 17, 0x0020 ); // jumpc1 0,0x0020[r1] <- jumpc1 0,0x0020,2 <- pc := mem[0x0022]
        
        inputMemory.set( 0x0022, 0x0000 ); // jump testMode setting produces 0 in place of next instruction

        inputRegisters[1] = 2;
        inputRegisters[15] = 0x8000; // <- ccG, bits[0] := 1

        var results = [
          0x0002,
          0x0010,
          0x0022
        ];

        var outputControl = updateControl( inputMemory, fresh()['control'] );
        
        var parsed = {
          'control' : fresh()['control'],
          'registers' : inputRegisters,
          'memory' : inputMemory
        };

        for ( var i = 0; i < results.length; i++ ) {
          outputControl = updateControlDouble( inputMemory, parsed['control'] );

          outputControl.set( 'pc', results[i] );

          parsed = testFromChanges( parsed,
          {
            'control' : outputControl
          },
          false );
        }
      } );

      test( 'RUN RX jumpf', () => {
        var inputMemory = fresh()['memory'];
        var inputRegisters = fresh()['registers'];

        inputMemory.set( 0, 0xf106 ); // jumpf r1,------[r0]
        inputMemory.set( 1, 0x0010 ); // jumpf r1,0x0010[r0] <- jumpf 1,0x0010,0 <- pc := mem[0x0010]
        inputMemory.set( 2, 0xf206 ); // jumpf r2,------[r0] 
        inputMemory.set( 3, 0x0010 ); // jumpf r2,0x0010[r0] <- jumpf 2,0x0010,0 <- pc := mem[0x0010]
        inputMemory.set( 4, 0xf326 ); // jumpf r3,------[r2] 
        inputMemory.set( 5, 0x0010 ); // jumpf r3,0x0010[r2] <- jumpf 3,0x0010,2 <- pc := mem[0x0012]

        inputMemory.set( 0x0012, 0x0000 ); // jump testMode setting produces 0 in place of next instruction

        inputRegisters[1] = 1;
        inputRegisters[2] = 2;
        inputRegisters[3] = 0;

        var results = [
          0x0002,
          0x0004,
          0x0012
        ];

        var outputControl = updateControl( inputMemory, fresh()['control'] );
        
        var parsed = {
          'control' : fresh()['control'],
          'registers' : inputRegisters,
          'memory' : inputMemory
        };

        for ( var i = 0; i < results.length; i++ ) {
          outputControl = updateControlDouble( inputMemory, parsed['control'] );

          outputControl.set( 'pc', results[i] );

          parsed = testFromChanges( parsed,
          {
            'control' : outputControl
          },
          false );
        }
      } );

      test( 'RUN RX jumpt', () => {
        var inputMemory = fresh()['memory'];
        var inputRegisters = fresh()['registers'];

        inputMemory.set( 0, 0xf107 ); // jumpt r1,------[r0]
        inputMemory.set( 1, 0x0010 ); // jumpt r1,0x0010[r0] <- jumpt 1,0x0010,0 <- pc := mem[0x0010]
        inputMemory.set( 2, 0xf207 ); // jumpt r2,------[r0] 
        inputMemory.set( 3, 0x0010 ); // jumpt r2,0x0010[r0] <- jumpt 2,0x0010,0 <- pc := mem[0x0010]
        inputMemory.set( 4, 0xf327 ); // jumpt r3,------[r2] 
        inputMemory.set( 5, 0x0010 ); // jumpt r3,0x0010[r2] <- jumpt 3,0x0010,2 <- pc := mem[0x0012]

        inputMemory.set( 0x0012, 0x0000 ); // jump testMode setting produces 0 in place of next instruction

        inputRegisters[1] = 0;
        inputRegisters[2] = 2;
        inputRegisters[3] = 1;

        var results = [
          0x0002,
          0x0004,
          0x0012
        ];

        var outputControl = updateControl( inputMemory, fresh()['control'] );
        
        var parsed = {
          'control' : fresh()['control'],
          'registers' : inputRegisters,
          'memory' : inputMemory
        };

        for ( var i = 0; i < results.length; i++ ) {
          outputControl = updateControlDouble( inputMemory, parsed['control'] );

          outputControl.set( 'pc', results[i] );

          parsed = testFromChanges( parsed,
          {
            'control' : outputControl
          },
          false );
        }
      } );

      test( 'RUN RX jal', () => {
        var inputMemory = fresh()['memory'];
        var inputRegisters = fresh()['registers'];

        inputMemory.set( 0, 0xfd08 ); // jal r13,------[r0]
        inputMemory.set( 1, 0x0010 ); // jal r13,0x0010[r0] <- jal 13,0x0010,0 <- r13 := 0x0002, pc := mem[0x0010]
        inputMemory.set( 16, 0xfd18 ); // jal r13,------[r0] 
        inputMemory.set( 17, 0x0020 ); // jal r13,0x0020[r0] <- jal 13,0x0020,0 <- r13 := 0x0012, pc := mem[0x0010]

        inputMemory.set( 0x0022, 0x0000 ); // jump testMode setting produces 0 in place of next instruction

        inputRegisters[1] = 2;

        var results = [
          [ 0x0010, 0x0002 ],
          [ 0x0022, 0x0012 ]
        ];

        var outputControl = updateControl( inputMemory, fresh()['control'] );
        
        var parsed = {
          'control' : fresh()['control'],
          'registers' : inputRegisters,
          'memory' : inputMemory
        };

        for ( var i = 0; i < results.length; i++ ) {
          outputControl = updateControlDouble( inputMemory, parsed['control'] );

          outputControl.set( 'pc', results[i][0] );

          parsed = testFromChanges( parsed,
          {
            'control' : outputControl,
            'registers' : {
              13 : results[i][1]
            }
          },
          false );
        }
      } );

      test( 'RUN RX testset', () => {
        var inputMemory = fresh()['memory'];
        var inputRegisters = fresh()['registers'];

        inputMemory.set( 0, 0xf209 ); // testset r2,------[r0]
        inputMemory.set( 1, 0x0010 ); // testset r2,0x0010[r0] <- testset 13,0x0010,0 <- r13 := 0x0010, pc := mem[0x0010]
        inputMemory.set( 2, 0xf219 ); // testset r2,------[r0] 
        inputMemory.set( 3, 0x0020 ); // testset r2,0x0020[r0] <- testset 13,0x0020,0 <- r13 := 0x0022, pc := mem[0x0010]
        inputMemory.set( 16, 0x0020 ); // 0x0020
        inputMemory.set( 34, 0x0040 ); // 0x0040

        inputRegisters[1] = 2;

        var results = [
          [ 0x0020, 0x0010 ],
          [ 0x0040, 0x0022 ]
        ];

        var outputControl = updateControl( inputMemory, fresh()['control'] );

        var parsed = {
          'control' : fresh()['control'],
          'registers' : inputRegisters,
          'memory' : inputMemory
        };

        for ( var i = 0; i < results.length; i++ ) {
          outputControl = updateControlDouble( inputMemory, parsed['control'] );

          var outputMemory = new Map();
          outputMemory.set( results[i][1], 1 );

          parsed = testFromChanges( parsed,
          {
            'control' : outputControl,
            'registers' : {
              2 : results[i][0]
            },
            'memory' : outputMemory
          } );
        }
      } );

    // EXP
      test( 'RUN EXP rfi', () => {
        var inputMemory = fresh()['memory'];
        var inputRegisters = fresh()['registers'];

        inputMemory.set( 0, 0xe000 ); // rfi

        inputRegisters[2] = 0x0f0f;
        inputRegisters[3] = 0xffff;

        var outputControl = updateControl( inputMemory, fresh()['control'] );

        var parsed = {
          'control' : fresh()['control'],
          'registers' : inputRegisters,
          'memory' : inputMemory
        };

        var results = [
          0x0000
        ];

        for ( var i = 0; i < results.length; i++ ) {
          outputControl = updateControl( inputMemory, parsed['control'] );

          parsed = testFromChanges( parsed,
          {
            'control' : outputControl
          } );
        }
      } );

      test( 'RUN EXP save', () => {
        var inputMemory = fresh()['memory'];
        var inputRegisters = fresh()['registers'];

        inputMemory.set( 0, 0xe508 ); // save rx,rx,----,r5
        inputMemory.set( 1, 0x1400 ); // save r1,r4,0x00,r5 <- save 1,4,0,5 <- mem[0x0010 -> 0x0014] = regsiters[1 -> 4]
        inputMemory.set( 2, 0xe508 ); // save rx,rx,----,r5
        inputMemory.set( 3, 0x1410 ); // save r1,r4,0x10,r5 <- save 1,4,0x10,5 <- mem[0x0020 -> 0x0024] = regsiters[1 -> 4]

        inputRegisters[1] = 0x0010;
        inputRegisters[2] = 0xffff;
        inputRegisters[3] = 0x0000;
        inputRegisters[4] = 0x0f0f;

        inputRegisters[5] = 0x0010

        var results = [
          [ [ 0x0010, 0x0010 ],
            [ 0x0011, 0xffff ],
            [ 0x0012, 0x0000 ],
            [ 0x0013, 0x0f0f ] ],
          [ [ 0x0020, 0x0010 ],
            [ 0x0021, 0xffff ],
            [ 0x0022, 0x0000 ],
            [ 0x0023, 0x0f0f ] ]
        ];

        var outputControl = updateControl( inputMemory, fresh()['control'] );

        var parsed = {
          'control' : fresh()['control'],
          'registers' : inputRegisters,
          'memory' : inputMemory
        };

        for ( var i = 0; i < results.length; i++ ) {
          outputControl = updateControlDouble( inputMemory, parsed['control'] );
          
          var outputMemory = new Map();

          for ( var it = 0; it < results[i].length; it++ ) {
            outputMemory.set( results[i][it][0], results[i][it][1] );
          }

          parsed = testFromChanges( parsed,
          {
            'control' : outputControl,
            'memory' : outputMemory
          } );
        }
      } ); 

      test( 'RUN EXP restore', () => {
        var inputMemory = fresh()['memory'];
        var inputRegisters = fresh()['registers'];

        inputMemory.set( 0, 0xe909 ); // restore rx,rx,----,r9
        inputMemory.set( 1, 0x1400 ); // restore r1,r4,0x00,r9 <- restore 1,4,0,9 <- regsiters[1 -> 4] = mem[0x0010 -> 0x0014]
        inputMemory.set( 2, 0xe909 ); // restore rx,rx,----,r9
        inputMemory.set( 3, 0x5810 ); // restore r5,r8,0x10,r9 <- restore 1,4,0x10,9 <- regsiters[5 -> 8] = mem[0x0020 -> 0x0024]

        inputMemory.set( 0x0010, 0x0010 );
        inputMemory.set( 0x0011, 0xffff );
        inputMemory.set( 0x0012, 0x0000 );
        inputMemory.set( 0x0013, 0x0f0f );

        inputMemory.set( 0x0020, 0x0010 );
        inputMemory.set( 0x0021, 0xffff );
        inputMemory.set( 0x0022, 0x0000 );
        inputMemory.set( 0x0023, 0x0f0f );

        inputRegisters[9] = 0x0010

        var results = [
          [ [ 1, 0x0010 ],
            [ 2, 0xffff ],
            [ 3, 0x0000 ],
            [ 4, 0x0f0f ] ],
          [ [ 5, 0x0010 ],
            [ 6, 0xffff ],
            [ 7, 0x0000 ],
            [ 8, 0x0f0f ] ]
        ];

        var outputControl = updateControl( inputMemory, fresh()['control'] );

        var parsed = {
          'control' : fresh()['control'],
          'registers' : inputRegisters,
          'memory' : inputMemory
        };

        for ( var i = 0; i < results.length; i++ ) {
          outputControl = updateControlDouble( inputMemory, parsed['control'] );
          
          var outputRegisters = {};

          for ( var it = 0; it < results[i].length; it++ ) {
            outputRegisters[results[i][it][0]] = results[i][it][1];
          }

          parsed = testFromChanges( parsed,
          {
            'control' : outputControl,
            'registers' : outputRegisters
          } );
        }
      } );

      test( 'RUN EXP getctl', () => {
        var inputMemory = fresh()['memory'];
        var inputRegisters = fresh()['registers'];

        inputMemory.set( 0, 0xe10a ); // getctl r1,--
        inputMemory.set( 1, 0x0020 ); // getctl r1,ir <- getctl 1,2 <- r1 := control['ir']
        inputMemory.set( 2, 0xe10a ); // getctl r1,--
        inputMemory.set( 3, 0x0010 ); // getctl r1,pc <- getctl 1,1 <- r1 := control['pc']
        inputMemory.set( 4, 0xe10a ); // getctl r1,---
        inputMemory.set( 5, 0x0030 ); // getctl r1,adr <- getctl 1,3 <- r1 := control['adr']

        var results = [
          0xe10a,
          0x0002,
          0x0030
        ];

        var outputControl = updateControl( inputMemory, fresh()['control'] );

        var parsed = {
          'control' : fresh()['control'],
          'registers' : inputRegisters,
          'memory' : inputMemory
        };

        for ( var i = 0; i < results.length; i++ ) {
          outputControl = updateControlDouble( inputMemory, parsed['control'] );

          parsed = testFromChanges( parsed,
          {
            'control' : outputControl,
            'registers' : {
              1 : results[i]
            }
          } );
        }
      } );

      test( 'RUN EXP putctl', () => {
        var inputMemory = fresh()['memory'];
        var inputRegisters = fresh()['registers'];

        inputMemory.set( 0, 0xe00b ); // putctl r0,--
        inputMemory.set( 1, 0x0020 ); // putctl r0,ir <- putctl 0,2 <- control['ir'] := 0x0000
        inputMemory.set( 2, 0xe10b ); // putctl r1,--
        inputMemory.set( 3, 0x0010 ); // putctl r1,pc <- putctl 1,1 <- control['pc'] := 0x0010
        inputMemory.set( 16, 0xe10b ); // putctl r1,---
        inputMemory.set( 17, 0x0030 ); // putctl r1,adr <- putctl 1,3 <- control['adr'] := 0x0010

        inputRegisters[1] = 0x0010;

        var results = [
          [ 'ir', 0x0000 ],
          [ 'pc', 0x0010 ],
          [ 'adr', 0x0010 ]
        ];

        var outputControl = updateControl( inputMemory, fresh()['control'] );

        var parsed = {
          'control' : fresh()['control'],
          'registers' : inputRegisters,
          'memory' : inputMemory
        };

        for ( var i = 0; i < results.length; i++ ) {
          outputControl = updateControlDouble( inputMemory, parsed['control'] );

          outputControl.set( results[i][0], results[i][1] );

          parsed = testFromChanges( parsed,
          {
            'control' : outputControl
          } );
        }
      } );

      test( 'RUN EXP execute', () => {
        var inputMemory = fresh()['memory'];
        var inputRegisters = fresh()['registers'];

        inputMemory.set( 0, 0xe00c ); // execute rx,rx
        inputMemory.set( 1, 0x1200 ); // execute r1,r2 <- execute 0x0720,0x0020 <- add r11,r2,r0 <- r11 := 0x0020

        inputMemory.set( 2, 0xe00c ); // execute rx,rx
        inputMemory.set( 3, 0x3400 ); // execute r3,r4 <- execute 0xfa01,0x0001 <- load r2,0x0001[r0] <- r2 := 0x1200

        inputMemory.set( 4, 0xe00c ); // execute rx,rx
        inputMemory.set( 5, 0x5600 ); // execute r5,r6 <- execute 0xe00c,0x1200 <- execute r1,r2 <- add r11,r2,r0 <- r11 := 0x1200

        inputMemory.set( 6, 0xe00c ); // execute rx,rx
        inputMemory.set( 7, 0x7800 ); // execute r7,r8 <- execute 0xf003,0x0010 <- jump 0x0010[r0] <- control['pc'] := 0x0010
        
        inputMemory.set( 16, 0xe00c ); // execute rx,rx
        inputMemory.set( 17, 0x9a00 ); // execute r9,r10 <- execute 0xe00c,0x9a00 <- execute r9,r10 <- execute r9,r10 <- execute r9,r10 .....


        inputRegisters[1] = 0x0b20; // <- add r11,r2,r0 <- r11 := 0x0020
        inputRegisters[2] = 0x0020;

        inputRegisters[3] = 0xf201; // <- load r2,------[r0]
        inputRegisters[4] = 0x0001; // <- load r2,0x0001[r0] <- r2 := 0x1200

        inputRegisters[5] = 0xe00c; // <- execute rx,rx
        inputRegisters[6] = 0x1200; // <- execute r1,r2 <- add r11,r2,r0 <- r2 := 0x1200

        inputRegisters[7] = 0xf003; // <- jump ------[r0]
        inputRegisters[8] = 0x0010; // <- jump 0x0010[r0] <- control['pc'] := 0x0010

        inputRegisters[9] = 0xe00c; // <- execute rx,rx
        inputRegisters[10] = 0x9a00; // <- execute r9,r10 <- execute r9,r10 <- execute r9,r10 .....

        var results = [
          [ [], { 11 : 0x0020 }, false ],
          [ [], { 2 : 0x1200 }, false ],
          [ [], { 11 : 0x1200 }, false ],
          [ [ 'pc', 0x0010 ], {}, false ],
          [ [], {}, true ]
        ];

        var outputControl = updateControl( inputMemory, fresh()['control'] );

        var parsed = {
          'control' : fresh()['control'],
          'registers' : inputRegisters,
          'memory' : inputMemory
        };

        for ( var i = 0; i < results.length; i++ ) {
          outputControl = updateControlDouble( inputMemory, parsed['control'] );

          var outputRegisters = {};
          var outputHalted = false;

          if ( results[i][0].length ) {
            outputControl.set( results[i][0][0], results[i][0][1] );
          }

          if ( results[i][1] !== {} ) {
            outputRegisters = results[i][1];
          }

          outputHalted = results[i][2];

          parsed = testFromChanges( parsed,
          {
            'control' : outputControl,
            'registers' : outputRegisters,
            'halted' : outputHalted
          } );
        }
      } );

      test( 'RUN EXP push', () => {
        var inputMemory = fresh()['memory'];
        var inputRegisters = fresh()['registers'];

        inputMemory.set( 0, 0xe10d ); // push r1,rx,rx
        inputMemory.set( 1, 0x2300 ); // push r1,r2,r3 <- push 1,2,3 <- mem[0x0010] := r1, r2 := 0x0010
        inputMemory.set( 2, 0xe10d ); // push r1,rx,rx
        inputMemory.set( 3, 0x2300 ); // push r1,r2,r3 <- push 1,2,3 <- mem[0x0011] := r1, r2 := 0x0011
        inputMemory.set( 4, 0xe10d ); // push r1,rx,rx
        inputMemory.set( 5, 0x2300 ); // push r1,r2,r3 <- push 1,2,3 <- mem[0x0012] := r1, r2 := 0x0012

        inputMemory.set( 6, 0xe10d ); // push r1,rx,rx
        inputMemory.set( 7, 0x2300 ); // push r1,r2,r3 <- push 1,2,3 <- r15 := 0x0080 <- ccS

        inputRegisters[1] = 0x0010;
        inputRegisters[2] = 0x000f; // stacktop - 1
        inputRegisters[3] = 0x0012; // stackbottom

        var results = [
          [ { 0x0010 : 0x0010 }, { 2 : 0x0010 } ],
          [ { 0x0011 : 0x0010 }, { 2 : 0x0011 } ],
          [ { 0x0012 : 0x0010 }, { 2 : 0x0012 } ],
          [ {}, { 15 : 0x0080 } ]
        ];

        var outputControl = updateControl( inputMemory, fresh()['control'] );

        var parsed = {
          'control' : fresh()['control'],
          'registers' : inputRegisters,
          'memory' : inputMemory
        };

        for ( var i = 0; i < results.length; i++ ) {
          outputControl = updateControlDouble( inputMemory, parsed['control'] );
          
          var outputMemory = new Map();
          for ( const key of Object.keys( results[i][0] ) ) outputMemory.set( Number.parseInt( key ), results[i][0][key] );

          var outputRegisters = results[i][1];

          parsed = testFromChanges( parsed,
          {
            'control' : outputControl,
            'memory' : outputMemory,
            'registers' : outputRegisters
          } );
        }
      } );

      test( 'RUN EXP pop', () => {
        var inputMemory = fresh()['memory'];
        var inputRegisters = fresh()['registers'];

        inputMemory.set( 0, 0xe10e ); // pop r1,rx,rx
        inputMemory.set( 1, 0x2300 ); // pop r1,r2,r3 <- pop 1,2,3 <- r1 := mem[0x0012], r2 := 0x0011
        inputMemory.set( 2, 0xe10e ); // pop r1,rx,rx
        inputMemory.set( 3, 0x2300 ); // pop r1,r2,r3 <- pop 1,2,3 <- r1 := mem[0x0011], r2 := 0x0010
        inputMemory.set( 4, 0xe10e ); // pop r1,rx,rx
        inputMemory.set( 5, 0x2300 ); // pop r1,r2,r3 <- pop 1,2,3 <- r1 := mem[0x0010], r2 := 0x000f

        inputMemory.set( 6, 0xe10e ); // pop r1,rx,rx
        inputMemory.set( 7, 0x2300 ); // pop r1,r2,r3 <- pop 1,2,3 <- r1 := mem[0x000f], r2 := 0x000e

        inputMemory.set( 0x0012, 0x0022 );
        inputMemory.set( 0x0011, 0x0021 );
        inputMemory.set( 0x0010, 0x0020 );
        inputMemory.set( 0x000f, 0x0019 );

        inputRegisters[2] = 0x0012; // stacktop == stackbottom therefore, full stack
        inputRegisters[3] = 0x0012; // stackbottom

        var results = [
          [ { 1 : 0x0022, 2 : 0x0011 } ],
          [ { 1 : 0x0021, 2 : 0x0010 } ],
          [ { 1 : 0x0020, 2 : 0x000f } ],
          [ { 1 : 0x0019, 2 : 0x000e } ]
        ];

        var outputControl = updateControl( inputMemory, fresh()['control'] );

        var parsed = {
          'control' : fresh()['control'],
          'registers' : inputRegisters,
          'memory' : inputMemory
        };

        for ( var i = 0; i < results.length; i++ ) {
          outputControl = updateControlDouble( inputMemory, parsed['control'] );
          
          var outputRegisters = results[i][0];

          parsed = testFromChanges( parsed,
          {
            'control' : outputControl,
            'registers' : outputRegisters
          } );
        }
      } );

      test( 'RUN EXP top', () => {
        var inputMemory = fresh()['memory'];
        var inputRegisters = fresh()['registers'];

        inputMemory.set( 0, 0xe10f ); // top r1,rx,rx
        inputMemory.set( 1, 0x2300 ); // top r1,r2,r3 <- top 1,2,3 <- r1 := mem[0x0012]
        inputMemory.set( 2, 0xe10f ); // top r1,rx,rx
        inputMemory.set( 3, 0x2300 ); // top r1,r2,r3 <- top 1,2,3 <- r1 := mem[0x0012]
        
        inputMemory.set( 0x0012, 0x0022 );
        inputMemory.set( 0x0011, 0x0021 );
        inputMemory.set( 0x0010, 0x0020 );
        inputMemory.set( 0x000f, 0x0019 );

        inputRegisters[2] = 0x0012; // stacktop == stackbottom therefore, full stack
        inputRegisters[3] = 0x0012; // stackbottom

        var results = [
          [ { 1 : 0x0022 } ],
          [ { 1 : 0x0022 } ]
        ];

        var outputControl = updateControl( inputMemory, fresh()['control'] );

        var parsed = {
          'control' : fresh()['control'],
          'registers' : inputRegisters,
          'memory' : inputMemory
        };

        for ( var i = 0; i < results.length; i++ ) {
          outputControl = updateControlDouble( inputMemory, parsed['control'] );
          
          var outputRegisters = results[i][0];

          parsed = testFromChanges( parsed,
          {
            'control' : outputControl,
            'registers' : outputRegisters
          } );
        }
      } );

      test( 'RUN EXP shiftl', () => {
        var inputMemory = fresh()['memory'];
        var inputRegisters = fresh()['registers'];

        inputMemory.set( 0, 0xe510 ); // shiftl r5,rx,---
        inputMemory.set( 1, 0x1000 ); // shiftl r5,r1,0x0 <- shiftl 5,1,0 <- r5 := 0x00ff
        inputMemory.set( 2, 0xe510 ); // shiftl r5,rx,---
        inputMemory.set( 3, 0x2010 ); // shiftl r5,r2,0x1 <- shiftl 5,2,1 <- r5 := 0x1e1e
        inputMemory.set( 4, 0xe510 ); // shiftl r5,rx,---
        inputMemory.set( 5, 0x30f0 ); // shiftl r5,r3,0xf <- shiftl 5,3,16 <- r5 := 0x8000, r15 := 0x0400 <- ccV
        inputMemory.set( 6, 0xe510 ); // shiftl r5,rx,---
        inputMemory.set( 7, 0x40f0 ); // shiftl r5,r4,0xf <- shiftl 5,4,16 <- r5 := 0x0000

        inputRegisters[1] = 0x00ff
        inputRegisters[2] = 0x0f0f
        inputRegisters[3] = 0xffff
        inputRegisters[4] = 0x0000

        var results = [
          [ 0x00ff, 0x0000 ],
          [ 0x1e1e, 0x0000 ],
          [ 0x8000, 0x0400 ],
          [ 0x0000, 0x0000 ]
        ];

        var outputControl = updateControl( inputMemory, fresh()['control'] );

        var parsed = {
          'control' : fresh()['control'],
          'registers' : inputRegisters,
          'memory' : inputMemory
        };

        for ( var i = 0; i < results.length; i++ ) {
          outputControl = updateControlDouble( inputMemory, parsed['control'] );

          parsed = testFromChanges( parsed,
          {
            'control' : outputControl,
            'registers' : {
              5 : results[i][0],
              15 : results[i][1],
            }
          } );
        }
      } );

      test( 'RUN EXP shiftr', () => {
        var inputMemory = fresh()['memory'];
        var inputRegisters = fresh()['registers'];

        inputMemory.set( 0, 0xe511 ); // shiftr r5,rx,---
        inputMemory.set( 1, 0x1000 ); // shiftr r5,r1,0x0 <- shiftr 5,1,0 <- r5 := 0x00ff
        inputMemory.set( 2, 0xe511 ); // shiftr r5,rx,---
        inputMemory.set( 3, 0x2010 ); // shiftr r5,r2,0x1 <- shiftr 5,2,1 <- r5 := 0x0787
        inputMemory.set( 4, 0xe511 ); // shiftr r5,rx,---
        inputMemory.set( 5, 0x30f0 ); // shiftr r5,r3,0xf <- shiftr 5,3,16 <- r5 := 0x0001
        inputMemory.set( 6, 0xe511 ); // shiftr r5,rx,---
        inputMemory.set( 7, 0x40f0 ); // shiftr r5,r4,0xf <- shiftr 5,4,16 <- r5 := 0x0000

        inputRegisters[1] = 0x00ff
        inputRegisters[2] = 0x0f0f
        inputRegisters[3] = 0xffff
        inputRegisters[4] = 0x0000

        var results = [
          0x00ff,
          0x0787,
          0x0001,
          0x0000
        ];

        var outputControl = updateControl( inputMemory, fresh()['control'] );

        var parsed = {
          'control' : fresh()['control'],
          'registers' : inputRegisters,
          'memory' : inputMemory
        };

        for ( var i = 0; i < results.length; i++ ) {
          outputControl = updateControlDouble( inputMemory, parsed['control'] );

          parsed = testFromChanges( parsed,
          {
            'control' : outputControl,
            'registers' : {
              5 : results[i]
            }
          } );
        }
      } );

      test( 'RUN EXP extract', () => {
        var inputMemory = fresh()['memory'];
        var inputRegisters = fresh()['registers'];

        inputMemory.set( 0, 0xe512 ); // extract r5,rx,---,---
        inputMemory.set( 1, 0x100f ); // extract r5,r1,0x0,0xf <- extract 5,1,0,16 <- r5 := 0x00ff
        inputMemory.set( 2, 0xe512 ); // extract r5,rx,---,---
        inputMemory.set( 3, 0x206f ); // extract r5,r2,0x6,0xf <- extract 5,2,6,16 <- r5 := 0x030f
        inputMemory.set( 4, 0xe512 ); // extract r5,rx,---,---
        inputMemory.set( 5, 0x3009 ); // extract r5,r3,0x0,0x9 <- extract 5,3,0,9 <- r5 := 0x03ff
        inputMemory.set( 6, 0xe512 ); // extract r5,rx,---,---
        inputMemory.set( 7, 0x30f1 ); // extract r5,r3,0xf,0x1 <- extract 5,3,16,1 <- r5 := 0x0000
        inputMemory.set( 8, 0xe512 ); // extract r5,rx,---,---
        inputMemory.set( 9, 0x4007 ); // extract r5,r4,0x0,0x7 <- extract 5,4,0,7 <- r5 := 0x0000

        inputRegisters[1] = 0x00ff
        inputRegisters[2] = 0x0f0f
        inputRegisters[3] = 0xffff
        inputRegisters[4] = 0x0000

        var results = [
          0x00ff,
          0x030f,
          0x03ff,
          0x0000,
          0x0000
        ];

        var outputControl = updateControl( inputMemory, fresh()['control'] );

        var parsed = {
          'control' : fresh()['control'],
          'registers' : inputRegisters,
          'memory' : inputMemory
        };

        for ( var i = 0; i < results.length; i++ ) {
          outputControl = updateControlDouble( inputMemory, parsed['control'] );

          parsed = testFromChanges( parsed,
          {
            'control' : outputControl,
            'registers' : {
              5 : results[i]
            }
          } );
        }
      } );

      test( 'RUN EXP extracti', () => {
        var inputMemory = fresh()['memory'];
        var inputRegisters = fresh()['registers'];

        inputMemory.set( 0, 0xe513 ); // extracti r5,rx,---,---
        inputMemory.set( 1, 0x100f ); // extracti r5,r1,0x0,0xf <- extracti 5,1,0,16 <- r5 := 0xff00
        inputMemory.set( 2, 0xe513 ); // extracti r5,rx,---,---
        inputMemory.set( 3, 0x206f ); // extracti r5,r2,0x6,0xf <- extracti 5,2,6,16 <- r5 := 0x00f0
        inputMemory.set( 4, 0xe513 ); // extracti r5,rx,---,---
        inputMemory.set( 5, 0x3009 ); // extracti r5,r3,0x0,0x9 <- extracti 5,3,0,9 <- r5 := 0x0000
        inputMemory.set( 6, 0xe513 ); // extracti r5,rx,---,---
        inputMemory.set( 7, 0x30f1 ); // extracti r5,r3,0xf,0x1 <- extracti 5,3,16,1 <- r5 := 0x0000
        inputMemory.set( 8, 0xe513 ); // extracti r5,rx,---,---
        inputMemory.set( 9, 0x4007 ); // extracti r5,r4,0x0,0x7 <- extracti 5,4,0,7 <- r5 := 0x00ff

        inputRegisters[1] = 0x00ff
        inputRegisters[2] = 0x0f0f
        inputRegisters[3] = 0xffff
        inputRegisters[4] = 0x0000

        var results = [
          0xff00,
          0x00f0,
          0x0000,
          0x0000,
          0x00ff
        ];

        var outputControl = updateControl( inputMemory, fresh()['control'] );

        var parsed = {
          'control' : fresh()['control'],
          'registers' : inputRegisters,
          'memory' : inputMemory
        };

        for ( var i = 0; i < results.length; i++ ) {
          outputControl = updateControlDouble( inputMemory, parsed['control'] );

          parsed = testFromChanges( parsed,
          {
            'control' : outputControl,
            'registers' : {
              5 : results[i]
            }
          } );
        }
      } );

      test( 'RUN EXP inject', () => {
        var inputMemory = fresh()['memory'];
        var inputRegisters = fresh()['registers'];

        inputMemory.set( 0, 0xe514 ); // inject r5,rx,rx,---,---
        inputMemory.set( 1, 0x430f ); // inject r5,r4,r3,0x0,0xf <- inject 5,4,3,0,16 <- r5 := 0xffff
        inputMemory.set( 2, 0xe514 ); // inject r5,rx,rx,---,---
        inputMemory.set( 3, 0x344b ); // inject r5,r3,r4,0x4,0xb <- inject 5,3,4,4,11 <- r5 := 0xf00f
        inputMemory.set( 4, 0xe514 ); // inject r5,rx,rx,---,---
        inputMemory.set( 5, 0x13f0 ); // inject r5,r1,r3,0xf,0x0 <- inject 5,1,3,16,0 <- r5 := 0x00ff

        inputRegisters[1] = 0x00ff
        inputRegisters[2] = 0x0f0f
        inputRegisters[3] = 0xffff
        inputRegisters[4] = 0x0000

        var results = [
          0xffff,
          0xf00f,
          0x00ff
        ];

        var outputControl = updateControl( inputMemory, fresh()['control'] );

        var parsed = {
          'control' : fresh()['control'],
          'registers' : inputRegisters,
          'memory' : inputMemory
        };

        for ( var i = 0; i < results.length; i++ ) {
          outputControl = updateControlDouble( inputMemory, parsed['control'] );

          parsed = testFromChanges( parsed,
          {
            'control' : outputControl,
            'registers' : {
              5 : results[i]
            }
          } );
        }
      } );

      test( 'RUN EXP injecti', () => {
        var inputMemory = fresh()['memory'];
        var inputRegisters = fresh()['registers'];

        inputMemory.set( 0, 0xe515 ); // injecti r5,rx,rx,---,---
        inputMemory.set( 1, 0x430f ); // injecti r5,r4,r3,0x0,0xf <- injecti 5,4,3,0,16 <- r5 := 0x0000
        inputMemory.set( 2, 0xe515 ); // injecti r5,rx,rx,---,---
        inputMemory.set( 3, 0x344b ); // injecti r5,r3,r4,0x4,0xb <- injecti 5,3,4,4,11 <- r5 := 0xffff
        inputMemory.set( 4, 0xe515 ); // injecti r5,rx,rx,---,---
        inputMemory.set( 5, 0x13f0 ); // injecti r5,r1,r3,0xf,0x0 <- injecti 5,1,3,16,0 <- r5 := 0x00ff

        inputRegisters[1] = 0x00ff
        inputRegisters[2] = 0x0f0f
        inputRegisters[3] = 0xffff
        inputRegisters[4] = 0x0000

        var results = [
          0x0000,
          0xffff,
          0x00ff
        ];

        var outputControl = updateControl( inputMemory, fresh()['control'] );

        var parsed = {
          'control' : fresh()['control'],
          'registers' : inputRegisters,
          'memory' : inputMemory
        };

        for ( var i = 0; i < results.length; i++ ) {
          outputControl = updateControlDouble( inputMemory, parsed['control'] );

          parsed = testFromChanges( parsed,
          {
            'control' : outputControl,
            'registers' : {
              5 : results[i]
            }
          } );
        }
      } );

      test( 'RUN EXP logicw', () => {
        var inputMemory = fresh()['memory'];
        var inputRegisters = fresh()['registers'];

        // inv
        inputMemory.set( 0, 0xe416 ); // logicw r4,rx,rx,---
        inputMemory.set( 1, 0x10c0 ); // logicw r4,r1,r0,0xc <- invnew r4,r1 <- inv 4,0x00ff <- r4 := 0xff00
        inputMemory.set( 2, 0xe416 ); // logicw r4,rx,rx,---
        inputMemory.set( 3, 0x20c0 ); // logicw r4,r2,r0,0xc <- invnew r4,r2 <- inv 4,0x0f0f <- r4 := 0xf0f0
        inputMemory.set( 4, 0xe416 ); // logicw r4,rx,rx,---
        inputMemory.set( 5, 0x30c0 ); // logicw r4,r3,r0,0xc <- invnew r4,r3 <- inv 4,0xffff <- r4 := 0x0000

        // and
        inputMemory.set( 6, 0xe416 ); // logicw r4,rx,rx,---
        inputMemory.set( 7, 0x1210 ); // logicw r4,r1,r2,0x1 <- andnew r4,r1,r2 <- and 4,0x00ff,0x0f0f <- r4 := 0x000f
        inputMemory.set( 8, 0xe416 ); // logicw r4,rx,rx,---
        inputMemory.set( 9, 0x1310 ); // logicw r4,r1,r3,0x1 <- andnew r4,r1,r3 <- and 4,0x00ff,0xffff <- r4 := 0x00ff
        inputMemory.set( 10, 0xe416 ); // logicw r4,rx,rx,---
        inputMemory.set( 11, 0x1010 ); // logicw r4,r1,r0,0x1 <- andnew r4,r1,r0 <- and 4,0x00ff,0x0000 <- r4 := 0x0000
        inputMemory.set( 12, 0xe416 ); // logicw r4,rx,rx,---
        inputMemory.set( 13, 0x3310 ); // logicw r4,r3,r3,0x1 <- andnew r4,r3,r3 <- and 4,0xffff,0xffff <- r4 := 0xffff

        //or
        inputMemory.set( 14, 0xe416 ); // logicw r4,rx,rx,---
        inputMemory.set( 15, 0x1270 ); // logicw r4,r1,r2,0x1 <- ornew r4,r1,r2 <- or 4,0x00ff,0x0f0f <- r4 := 0x0fff
        inputMemory.set( 16, 0xe416 ); // logicw r4,rx,rx,---
        inputMemory.set( 17, 0x1370 ); // logicw r4,r1,r3,0x1 <- ornew r4,r1,r3 <- or 4,0x00ff,0xffff <- r4 := 0xffff
        inputMemory.set( 18, 0xe416 ); // logicw r4,rx,rx,---
        inputMemory.set( 19, 0x1070 ); // logicw r4,r1,r0,0x1 <- ornew r4,r1,r0 <- or 4,0x00ff,0x0000 <- r4 := 0x00ff
        inputMemory.set( 20, 0xe416 ); // logicw r4,rx,rx,---
        inputMemory.set( 21, 0x3370 ); // logicw r4,r3,r3,0x1 <- ornew r4,r3,r3 <- or 4,0xffff,0xffff <- r4 := 0xffff

        // xor
        inputMemory.set( 22, 0xe416 ); // logicw r4,rx,rx,---
        inputMemory.set( 23, 0x1260 ); // logicw r4,r1,r2,0x1 <- xornew r4,r1,r2 <- xor 4,0x00ff,0x0f0f <- r4 := 0x0ff0
        inputMemory.set( 24, 0xe416 ); // logicw r4,rx,rx,---
        inputMemory.set( 25, 0x1360 ); // logicw r4,r1,r3,0x1 <- xornew r4,r1,r3 <- xor 4,0x00ff,0xffff <- r4 := 0xff00
        inputMemory.set( 26, 0xe416 ); // logicw r4,rx,rx,---
        inputMemory.set( 27, 0x1060 ); // logicw r4,r1,r0,0x1 <- xornew r4,r1,r0 <- xor 4,0x00ff,0x0000 <- r4 := 0x00ff
        inputMemory.set( 28, 0xe416 ); // logicw r4,rx,rx,---
        inputMemory.set( 29, 0x3360 ); // logicw r4,r3,r3,0x1 <- xornew r4,r3,r3 <- xor 4,0xffff,0xffff <- r4 := 0x0000


        inputRegisters[1] = 0x00ff;
        inputRegisters[2] = 0x0f0f;
        inputRegisters[3] = 0xffff;

        var results = [
          // inv
          0xff00,
          0xf0f0,
          0x0000,
          // and
          0x000f,
          0x00ff,
          0x0000,
          0xffff,
          // or
          0x0fff,
          0xffff,
          0x00ff,
          0xffff,
          // xor
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

        for ( var i = 0; i < results.length; i++ ) {
          outputControl = updateControlDouble( inputMemory, parsed['control'] );

          parsed = testFromChanges( parsed,
          {
            'control' : outputControl,
            'registers' : {
              4 : results[i]
            }
          } );
        }
      } );

      test( 'RUN EXP logicb', () => {
        var inputMemory = fresh()['memory'];
        var inputRegisters = fresh()['registers'];

        // inv
        inputMemory.set( 0, 0xe417 ); // logicb r4,rx,rx,---,---
        inputMemory.set( 1, 0x10c0 ); // logicb r4,r1,r0,0xc,0x0 <- invb r4,r1,0 <- r4 := 0x8000
        inputMemory.set( 2, 0xe417 ); // logicb r4,rx,rx,---,---
        inputMemory.set( 3, 0x20c8 ); // logicb r4,r2,r0,0xc,0x8 <- invb r4,r2,8 <- r4 := 0x8080
        inputMemory.set( 4, 0xe417 ); // logicb r4,rx,rx,---,---
        inputMemory.set( 5, 0x30cf ); // logicb r4,r3,r0,0xc,--- <- invb r4,r3,15 <- r4 := 0x8080

        // and
        inputMemory.set( 6, 0xe517 ); // logicb r5,rx,rx,---,---
        inputMemory.set( 7, 0x121f ); // logicb r5,r1,r2,0x1,0xf <- andb r5,r1,r2,15 <- r5 := 0x0001
        inputMemory.set( 8, 0xe517 ); // logicb r5,rx,rx,---,---
        inputMemory.set( 9, 0x131c ); // logicb r5,r1,r3,0x1,0xc <- andb r5,r1,r3, <- r5 := 0x0009
        inputMemory.set( 10, 0xe517 ); // logicb r5,rx,rx,---,---
        inputMemory.set( 11, 0x1010 ); // logicb r5,r1,r0,0x1,0x0 <- andb r5,r1,r0,0 <- r5 := 0x0009
        inputMemory.set( 12, 0xe517 ); // logicb r5,rx,rx,---,---
        inputMemory.set( 13, 0x3314 ); // logicb r5,r3,r3,0x1,0x4 <- andb r5,r3,r3,4 <- r5 := 0x0809

        //or
        inputMemory.set( 14, 0xe617 ); // logicb r6,rx,rx,---,---
        inputMemory.set( 15, 0x127f ); // logicb r6,r1,r2,0x1,0xf <- orb r6,r1,r2,15 <- r6 := 0x0001
        inputMemory.set( 16, 0xe617 ); // logicb r6,rx,rx,---,---
        inputMemory.set( 17, 0x1370 ); // logicb r6,r1,r3,0x1,0x0 <- orb r6,r1,r3,0 <- r6 := 0x8001
        inputMemory.set( 18, 0xe617 ); // logicb r6,rx,rx,---,---
        inputMemory.set( 19, 0x107f ); // logicb r6,r1,r0,0x1,0xf <- orb r6,r1,r0,15 <- r6 := 0x8001
        inputMemory.set( 20, 0xe617 ); // logicb r6,rx,rx,---,---
        inputMemory.set( 21, 0x337c ); // logicb r6,r3,r3,0x1,0xc <- orb r6,r3,r3, <- r6 := 0x8009

        // xor
        inputMemory.set( 22, 0xe717 ); // logicb r7,rx,rx,---,---
        inputMemory.set( 23, 0x126b ); // logicb r7,r1,r2,0x1,0xb <- xorb r7,r1,r2,11 <- r7 := 0x0010
        inputMemory.set( 24, 0xe717 ); // logicb r7,rx,rx,---,---
        inputMemory.set( 25, 0x1360 ); // logicb r7,r1,r3,0x1,0x0 <- xorb r7,r1,r3,0 <- r7 := 0x8010
        inputMemory.set( 26, 0xe717 ); // logicb r7,rx,rx,---,---
        inputMemory.set( 27, 0x106f ); // logicb r7,r1,r0,0x1,0xf <- xorb r7,r1,r0,15 <- r7 := 0x8011
        inputMemory.set( 28, 0xe717 ); // logicb r7,rx,rx,---,---
        inputMemory.set( 29, 0x3363 ); // logicb r7,r3,r3,0x1,0x3 <- xorb r7,r3,r3,3 <- r7 := 0x8011


        inputRegisters[1] = 0x00ff;
        inputRegisters[2] = 0x0f0f;
        inputRegisters[3] = 0xffff;

        // invb
          var resultsInv = [
            0x8000,
            0x8080,
            0x8080
          ];

          var outputControl = updateControl( inputMemory, fresh()['control'] );

          var parsed = {
            'control' : fresh()['control'],
            'registers' : inputRegisters,
            'memory' : inputMemory
          };

          for ( var i = 0; i < resultsInv.length; i++ ) {
            outputControl = updateControlDouble( inputMemory, parsed['control'] );

            parsed = testFromChanges( parsed,
            {
              'control' : outputControl,
              'registers' : {
                4 : resultsInv[i]
              }
            } );
          }

        // andb
          var resultsAnd = [
            0x0001,
            0x0009,
            0x0009,
            0x0809
          ];

          for ( var i = 0; i < resultsAnd.length; i++ ) {
            outputControl = updateControlDouble( inputMemory, parsed['control'] );

            parsed = testFromChanges( parsed,
            {
              'control' : outputControl,
              'registers' : {
                5 : resultsAnd[i]
              }
            } );
          }

        // orb
          var resultsOr = [
            0x0001,
            0x8001,
            0x8001,
            0x8009,
          ];

          for ( var i = 0; i < resultsOr.length; i++ ) {
            outputControl = updateControlDouble( inputMemory, parsed['control'] );

            parsed = testFromChanges( parsed,
            {
              'control' : outputControl,
              'registers' : {
                6 : resultsOr[i]
              }
            } );
          }

        // xorb
          var resultsXor = [
            0x0010,
            0x8010,
            0x8011,
            0x8011
          ];

          for ( var i = 0; i < resultsXor.length; i++ ) {
            outputControl = updateControlDouble( inputMemory, parsed['control'] );

            parsed = testFromChanges( parsed,
            {
              'control' : outputControl,
              'registers' : {
                7 : resultsXor[i]
              }
            } );
          }
      } );

      test( 'RUN EXP getbit', () => {
        var inputMemory = fresh()['memory'];
        var inputRegisters = fresh()['registers'];

        inputMemory.set( 0, 0xe118 ); // getbit r1,---
        inputMemory.set( 1, 0x00f0 ); // getbit r1,0xf <- getbit 5,15 <- r1 := 0x0000
        inputMemory.set( 2, 0xe118 ); // getbit r1,---
        inputMemory.set( 3, 0x0000 ); // getbit r1,0x0 <- getbit 5,0 <- r1 := 0x0001

        inputRegisters[15] = 0xf000;

        var results = [
          0x0000,
          0x0001
        ];

        var outputControl = updateControl( inputMemory, fresh()['control'] );

        var parsed = {
          'control' : fresh()['control'],
          'registers' : inputRegisters,
          'memory' : inputMemory
        };

        for ( var i = 0; i < results.length; i++ ) {
          outputControl = updateControlDouble( inputMemory, parsed['control'] );

          parsed = testFromChanges( parsed,
          {
            'control' : outputControl,
            'registers' : {
              1 : results[i]
            }
          } );
        }
      } );

      test( 'RUN EXP getbiti', () => {
        var inputMemory = fresh()['memory'];
        var inputRegisters = fresh()['registers'];

        inputMemory.set( 0, 0xe119 ); // getbiti r1,---
        inputMemory.set( 1, 0x00f0 ); // getbiti r1,0xf <- getbiti 5,15 <- r1 := 0x0001
        inputMemory.set( 2, 0xe119 ); // getbiti r1,---
        inputMemory.set( 3, 0x0000 ); // getbiti r1,0x0 <- getbiti 5,0 <- r1 := 0x0000

        inputRegisters[15] = 0xf000;

        var results = [
          0x0001,
          0x0000
        ];

        var outputControl = updateControl( inputMemory, fresh()['control'] );

        var parsed = {
          'control' : fresh()['control'],
          'registers' : inputRegisters,
          'memory' : inputMemory
        };

        for ( var i = 0; i < results.length; i++ ) {
          outputControl = updateControlDouble( inputMemory, parsed['control'] );

          parsed = testFromChanges( parsed,
          {
            'control' : outputControl,
            'registers' : {
              1 : results[i]
            }
          } );
        }
      } );

      test( 'RUN EXP putbit', () => {
        var inputMemory = fresh()['memory'];
        var inputRegisters = fresh()['registers'];

        inputMemory.set( 0, 0xe11a ); // putbit r1,---
        inputMemory.set( 1, 0x00f0 ); // putbit r1,0xf <- putbit 5,15 <- r15 := 0x0000
        inputMemory.set( 2, 0xe11a ); // putbit r1,---
        inputMemory.set( 3, 0x0000 ); // putbit r1,0x0 <- putbit 5,0 <- r15 := 0x8000

        inputRegisters[1] = 0xf000;

        var results = [
          0x0000,
          0x8000
        ];

        var outputControl = updateControl( inputMemory, fresh()['control'] );

        var parsed = {
          'control' : fresh()['control'],
          'registers' : inputRegisters,
          'memory' : inputMemory
        };

        for ( var i = 0; i < results.length; i++ ) {
          outputControl = updateControlDouble( inputMemory, parsed['control'] );

          parsed = testFromChanges( parsed,
          {
            'control' : outputControl,
            'registers' : {
              15 : results[i]
            }
          } );
        }
      } );

      test( 'RUN EXP putbiti', () => {
        var inputMemory = fresh()['memory'];
        var inputRegisters = fresh()['registers'];

        inputMemory.set( 0, 0xe11b ); // putbiti r1,---
        inputMemory.set( 1, 0x00f0 ); // putbiti r1,0xf <- putbiti 5,15 <- r15 := 0x0001
        inputMemory.set( 2, 0xe11b ); // putbiti r1,---
        inputMemory.set( 3, 0x0000 ); // putbiti r1,0x0 <- putbiti 5,0 <- r15 := 0x0001 <- no change to 0th bit, howver putbit, like inject updates and does not set

        inputRegisters[1] = 0xf000;

        var results = [
          0x0001,
          0x0001
        ];

        var outputControl = updateControl( inputMemory, fresh()['control'] );

        var parsed = {
          'control' : fresh()['control'],
          'registers' : inputRegisters,
          'memory' : inputMemory
        };

        for ( var i = 0; i < results.length; i++ ) {
          outputControl = updateControlDouble( inputMemory, parsed['control'] );

          parsed = testFromChanges( parsed,
          {
            'control' : outputControl,
            'registers' : {
              15 : results[i]
            }
          } );
        }
      } );

      test( 'RUN EXP addc', () => {
        var inputMemory = fresh()['memory'];
        var inputRegisters = fresh()['registers'];

        inputMemory.set( 0, 0xe51c ); // addc r5,rx,rx
        inputMemory.set( 1, 0x1100 ); // addc r5,r1,r1 <- addc 5,1,1 + 0 <- r5 := 2, r15 := 0xc000
        inputMemory.set( 2, 0xe51c ); // addc r5,rx,rx
        inputMemory.set( 3, 0x0000 ); // addc r5,r0,r0 <- addc 5,0,0 + 0 <- r5 := 0, r15 := 0x2000
        inputMemory.set( 4, 0xe51c ); // addc r5,rx,rx
        inputMemory.set( 5, 0x0300 ); // addc r5,r0,r3 <- addc 5,0,0xffff + 0 <- r5 := 0xffff, r15 := 0x9000

        inputMemory.set( 6, 0xe51c ); // addc r5,rx,rx
        inputMemory.set( 7, 0x3100 ); // addc r5,r3,r1 <- addc 5,0xffff,1 + 0 <- r5 := 0, r15 := 0x2500 <- ccC, ccV, ccE

        inputMemory.set( 8, 0xe51c ); // addc r5,rx,rx
        inputMemory.set( 9, 0x3200 ); // addc r5,r3,r2 <- addc 5,0xffff,2 + 0 <- r5 := 1, r15 := 0xc500 <- ccC, ccV, ccG, ccg

        inputMemory.set( 10, 0xe51c ); // addc r5,rx,rx
        inputMemory.set( 11, 0x3400 ); // addc r5,r3,r4 <- addc 5,0xffff,0xfffe + 0 <- r5 := 0xfffd, r15 := 0x9500 <- ccC, ccV, ccG, ccl


        inputMemory.set( 12, 0xe51c ); // addc r5,rx,rx
        inputMemory.set( 13, 0x1100 ); // addc r5,r1,r1 <- addc 5,1,1 + ccC <- r5 := 3, r15 := 0xc000
        inputMemory.set( 14, 0xe51c ); // addc r5,rx,rx
        inputMemory.set( 15, 0x0000 ); // addc r5,r0,r0 <- addc 5,0,0 + ccC <- r5 := 1, r15 := 0xc000
        inputMemory.set( 16, 0xe51c ); // addc r5,rx,rx
        inputMemory.set( 17, 0x0300 ); // addc r5,r0,r3 <- addc 5,0,0xffff + ccC <- r5 := 0x0, r15 := 0x2500

        inputMemory.set( 18, 0xe51c ); // addc r5,rx,rx
        inputMemory.set( 19, 0x3100 ); // addc r5,r3,r1 <- addc 5,0xffff,1 + ccC <- r5 := 1, r15 := 0xc500

        inputMemory.set( 20, 0xe51c ); // addc r5,rx,rx
        inputMemory.set( 21, 0x3200 ); // addc r5,r3,r2 <- addc 5,0xffff,2 + ccC <- r5 := 2, r15 := 0xc500

        inputMemory.set( 22, 0xe51c ); // addc r5,rx,rx
        inputMemory.set( 23, 0x3400 ); // addc r5,r3,r4 <- addc 5,0xffff,0xfffe + ccC <- r5 := 0xfffe, r15 := 0x9500

        inputRegisters[1] = 0x0001;
        inputRegisters[2] = 0x0002;
        inputRegisters[3] = 0xffff;
        inputRegisters[4] = 0xfffe;

        var results = [
          [ 0x0000, 0x0002, 0xc000 ],
          [ 0x0000, 0x0000, 0x2000 ],
          [ 0x0000, 0xffff, 0x9000 ],
          [ 0x0000, 0x0000, 0x2500 ],
          [ 0x0000, 0x0001, 0xc500 ],
          [ 0x0000, 0xfffd, 0x9500 ],

          [ 0x0100, 0x0003, 0xc000 ],
          [ 0x0100, 0x0001, 0xc000 ],
          [ 0x0100, 0x0000, 0x2500 ],
          [ 0x0100, 0x0001, 0xc500 ],
          [ 0x0100, 0x0002, 0xc500 ],
          [ 0x0100, 0xfffe, 0x9500 ]
        ];

        var outputControl = updateControl( inputMemory, fresh()['control'] );
        
        var parsed = {
          'control' : fresh()['control'],
          'registers' : inputRegisters,
          'memory' : inputMemory
        };

        for ( var i = 0; i < results.length; i++ ) {
          outputControl = updateControlDouble( inputMemory, parsed['control'] );

          parsed['registers'][15] = results[i][0];

          parsed = testFromChanges( parsed,
          {
            'control' : outputControl,
            'registers' : {
              5 : results[i][1],
              15 : results[i][2]
            }
          } );
        }
      } );
