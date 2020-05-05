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

    var commonCommands = ["add", "sub", "mul", "div", "cmp", "cmplt", "cmpeq", "cmpgt", "inv", "and", "or", "xor", "nop", "trap", 
                          "lea", "load", "store", "jump", "jumpc0", "jumpc1", "jumpf", "jumpt", "jal", 
                          "data"];

    CodeMirror.registerHelper("hintWords", "sigma16", commonCommands);

    define('keyword', commonCommands);

    function tokenBase(stream, state) {
      if ( stream.eatSpace() ) return null;
      if ( stream.eat( ',' ) ) return 'punctuation';
      if ( stream.eat( '[' ) ) return 'punctuation';
      if ( stream.eat( ']' ) ) return 'punctuation';

      var ch = stream.next();
      var peek = stream.peek();

      if (ch === ';') {
        stream.skipToEnd();
        return 'comment';
      } else if ( /(r|R)([0-9])/.test(ch+peek) ) {
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
      } else if (ch === '$') {
        stream.eatWhile(/((\d)|([a-f])|([A-F]))/);
        if(stream.eol() || !/\w/.test(stream.peek())) {
          return 'number';
        }
      } else if (/\d/.test(ch)) {
        stream.eatWhile(/\d/);
        if(stream.eol() || !/\w/.test(stream.peek())) {
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