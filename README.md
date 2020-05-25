# Sigma17 repository

Sigma17 is a re-write of the original emulator written by John O' Donnell. The overall aim of Sigma17 is to re-write the entire web based app but keep apps functionality. This is so that it is easier and more intuitive to code in Sigma16 with the web based app. 

Sigma16 is a computer architecture designed for research and teaching in computer systems.  This application aims to provide a complete environment for experimenting with the architecture.

## Using the emulator

Currently, the emulator can be used by visiting the [Sigma17 website](https://questiowo.github.io/Sigma17) which is hosted by github as a `github.io` project site and is kept up to date with all major changes.

Also, the emulator can be ran locally using npm and React from the source directory which will support more minor changes that will not effect the overall ability of the `github.io` site.

### Run in a browser

Visit [the website](https://questiowo.github.io/Sigma17).

### Run with npm locally in browser

The following software needs to be installed in order to build the executable using electron

    node.js
    npm

After these are installed, to compile the program, execute the following commands in the repository directory:

    npm install
    npm start

This will start the local React.js development server and should open a windown in your default browser to `localhost:3000`, in which the webiste can be used as normal.

## TODO list

1. Finish code editor
* √ - Implement proper Sigma16 `CodeMirror` highlighting
* √ - Add breakpoints so that they work and persist
* ( Possible )
* x - Add auto complete/code snippet shortcuts - not sure about difficulty since using port of CodeMirror

2. Finish code builder
* √ - Implement parser - remove need for whitespace with commands reccognition
* √ - Display errors in `CodeMirror` chunk for syntax errors
* √ - Have parser translate to machine code

3. Finish code runner
* √ - Add window for displaying register output, memory values and I/O of program after running
* √ - Implement circuit/circuit functionality
* √ - Implement actions based off of machine code
* √ - Implement all `RRR`/`RR` functions ( except `trap` )
* √ - Implement all `RX`/`JX`/`KX` functions
* √ - Implement '`jumpAlias`' functions
* √ - Implement full function of `trap` instruction
* √ - Check that R15 updates correctly for each arithmetic `RRR` function.
* √ - Implement all `EXP` functions ( except rfi as no interrupt registers )
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

5. Clean-Up
* Write testing framework for/how to set tests out
* Write tests for `Emulator.js`
* Write documentation that outlines function calls, i.e how to debug as an outsider.
* √ - Set up `githib.io` page for emulator
* √ - Write 'Hello, World!' program to be default display
* Add download/copy buttons for machine code and Sigma16 code versions of the program on the editor.
* Allow unhighlighted code chunk to have tabs used correctly.
* √ - Make webiste display properly on Firefox and Safari
* x - Make double clicking on output boxes work properly on Firefox

## Author

The original Sigma16 language, architecture was software tools are written by, [John O'Donnell](https://jtod.github.io/index.html). Email: john.t.odonnnell9@gmail.com

The current React.js version of the software is being written by [Jim Carty](https://questiowo.github.io). Email: cartyjim1@gmail.com
