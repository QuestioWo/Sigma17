/*
  Copyright Jim Carty © 2020

  This file is subject to the terms and conditions defined in file 'LICENSE.txt', which is part of this source code package.
*/

(function(mod) {
  if (typeof exports == "object" && typeof module == "object") // CommonJS
    mod(require("codemirror"));
})(function(CodeMirror) {

  CodeMirror.defineMode('sigma16', function() {

    var words = function(str) { return str.split(" "); };
    function define(style, dict) {
      for(var i = 0; i < dict.length; i++) {
        words[dict[i]] = style;
      }
    };

    const allCommands = [ "add", "sub", "mul", "div", "cmplt", "cmpeq", "cmpgt", "and", "andold", "or", "orold", "xor", "xorold", "trap", "cmp", "inv", "invold",
                          "lea", "load", "store", "jumpf", "jumpt", "jal", "testset", "jump", "jumpc0", "jumpc1", "jumple", "jumpne", "jumpge", "jumpnv", "jumpnvu", "jumpnco", "jumpnso", "jumplt", "jumpeq", "jumpgt", "jumpv", "jumpvu", "jumpco", "jumpso",
                          "data",
                          "rfi", "execute", "save", "restore", "getctl", "putctl", "push", "pop", "top", "addc", "shiftl", "shiftr", "getbit", "getbiti", "putbit", "putbiti", "field", "extract", "extracti", "inject", "injecti", "logicb", "logicw", "andb", "orb", "xorb", "invb", "andnew", "ornew", "xornew", "invnew" ];

    CodeMirror.registerHelper("hintWords", "sigma16", allCommands);

    define('keyword', allCommands);

    function tokenBase(stream, state) {
      if ( stream.eatSpace() ) return null;
      if ( stream.eat( ',' ) ) return null;
      if ( stream.eat( '[' ) ) return null;
      if ( stream.eat( ']' ) ) return null;

      var ch = stream.next();
      var peek = stream.peek();

      if (ch === ';') {
        stream.skipToEnd();
        return 'comment';
      } else if ( /(r|R)([0-9])/.test( ch + peek ) ) {
        if ( /(1)/.test( peek ) ) {
          stream.next();
          peek = stream.peek();

          if ( /([0-5])/.test(peek) ) {
            stream.next();
          }
        } else {
          stream.next();
        }
        return 'def';   
      } else if ( ch === '$' ) {
        stream.eatWhile( /((\d)|([a-f])|([A-F]))/ );
        if( stream.eol() || !/\w/.test( stream.peek() ) ) {
          return 'number';
        }
      } else if ( ch === '#' ) {
        stream.eatWhile( /1|0/ );
        if( stream.eol() || !/\w/.test( stream.peek() ) ) {
          return 'number';
        }
      } else if ( ch === '-' ) {
        stream.eatWhile( /\d/ );
        if( stream.eol() || !/\w/.test( stream.peek() ) ) {
          return 'number';
        }
      } else if ( /\d/.test( ch ) ) {
        stream.eatWhile( /\d/ );
        if( stream.eol() || !/\w/.test( stream.peek() ) ) {
          return 'number';
        }
      }
      stream.eatWhile(/[\w]/);
      var cur = stream.current();
      return words.hasOwnProperty(cur) ? words[cur] : 'variable';
    }

    function tokenize(stream, state) {
      return (state.tokens[0] || tokenBase) (stream, state);
    };

    return {
      startState: function() {return {tokens:[]};},
      token: function(stream, state) {
        return tokenize(stream, state);
      },
      closeBrackets: "[]",
      lineComment: ';',
      fold: "brace"
    };
  });

  CodeMirror.defineMIME('text/plain', 'sigma16');

});