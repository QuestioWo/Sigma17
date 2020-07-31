# TODO list

*Will not do unless asked for with good reason since large effort when alternatives are available*

* ( Possible ) - Write documentation that outlines function calls, i.e how to debug as an outsider. *Possibly on repos rather than in actual website.*
* Make double clicking on output boxes work properly on Firefox
* Allow for code, breakpoints, and, input to persit across webpages without having to use the navigation features ( cannot  be done with github pages as the hosting site as it uses HashRouter when we would need BrowserRouter )
* Change the code editors updating method so that it doesnt lag the webpage when editting larger files ( difficult since breakpoints and line numbers need updating so not sure about how to do it )
* Fix memory leaks

# Done

1. Finish code editor
* √ - Implement proper Sigma16 `CodeMirror` highlighting
* √ - Add breakpoints so that they work and persist

2. Finish code builder
* √ - Implement parser - remove need for whitespace with commands reccognition
* √ - Display errors in `CodeMirror` chunk for syntax errors
* √ - Have parser translate to machine code
* √ - Allow multiple data statements to be strung together, e.g `data $30,$40`
* √ - Stricter requirements for labels to be accepted.
* √ - Abstract RegExp for checking statements.
* √ - Binary accepted as integers.

3. Finish code runner
* √ - Add window for displaying register output, memory values and I/O of program after running
* √ - Implement circuit/circuit functionality
* √ - Implement actions based off of machine code
* √ - Implement all `RRR`/`RR` functions ( except `trap` )
* √ - Implement all `RX`/`JX`/`KX` functions
* √ - Implement '`jumpAlias`' functions
* √ - Implement full function of `trap` instruction
* √ - Check that R15 updates correctly for each arithmetic `RRR` function.
* √ - Implement all `EXP` functions ( except `rfi` as no interrupt registers )
* √ - Small rewrite to use binary checking instead of string checking to increase performance further
* √ - Link to webpage

4. Finish code debugger
* √ - Allow for code and breakpoints to be passed/persist between different pages
* √ - Allow for breakpoints to halt execution of code
* √ - Add window to show register, memory and I/O
* √ - Add highlighting of lines being and have been executed in memory
* √ - Add line by line exectuting ability
* √ - Change input button on debug page
* √ - Allow input to be displayed
* √ - Allow input to persist between pages
* √ - Add double click back to output box
* √ - Show code chunk of currently being executed program
* √ - Display highlighting of lines being exectued in code chunk
* √ - Make the code debugger follow the line that was executed
* √ - Highlighting for effected/used memory values and registers.

5. Write Tests
* √ - Write testing framework for/how to set tests out
* √ - Tests for UTILS
* √ - Tests for CHECKING
* √ - Tests for PARSING
* √ - Tests for RUNNING
* √ - Finish tests for `Emulator.js`

6. Write Documentation
* √ - Write documentation for Sigma16 instructions.
* √ - Write documentation for how to use the emulator.
* √ - Write a full list of all of the instructions, aliases and all.
* √ - Have a contents or a search functionality to make navigating easier.

7. Clean-Up
* √ - Set up `github.io` page for emulator
* √ - Write 'Hello, World!' program to be default display
* √ - Add download/copy buttons for machine code and Sigma16 code versions of the program on the editor.
* √ - Add import functionality for binary exports
* √ - Allow unhighlighted code chunk to have tabs used correctly.
* √ - Make website display properly on Firefox and Safari
* √ - Stricter requirements for comments to be accepted.
* √ - Binary files properly generate and import.
* √ - Change viewing method of the results, namely memory, so that it isnt as laggy to hover over values in larger results; see [Memory performance test](https://github.com/QuestioWo/Sigma17#memory-performance-test-). Also so that it isn't so slow to run a program since [Memory performance test](https://github.com/QuestioWo/Sigma17#memory-performance-test-) takes ~53 ms to execute so the rest of the ~56 s is displaying the results
