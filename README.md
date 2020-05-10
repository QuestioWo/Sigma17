# Sugma17 source directory

Sugma17 is a re-write of the orignal emulator written by John O' Donnell. The overall aim of Sugma17 is to re-write the entire web based app but keep apps functionality. This is so that it is easier and more intuitive to code in Sigma16 with the web based app. 

Sigma16 is a computer architecture designed for research and teaching in computer systems.  This application aims to provide a complete environment for experimenting with the architecture.

## Using the emulator

Currently, it is required to download and run the emulator locally using np and a browser. However, once the website is operational, it is to be published as a github.io page.

### Run in a browser

!-- This option is currently unavailable for the react.js version of the emulator however it hopefully to be published as a github.io page once it is functional. --!

### Run with npm locally in browser

The following software needs to be installed in order to build the executable using electron

    node.js
    npm

After these are installed, to compile the program, navigate to the  `react-version` directory and execute the following commands:

    npm install
    npm start

This will start the local React.js development server and should open a windown in your default browser to `localhost:3000`, in which the webiste can be used as normal.

## TODO list

1. Finish code editor
* √ - Implement proper Sigma16 CodeMirror highlighting
* √ - Add breakpoints so that they work and persist
* ( Possible )
* Add auto complete/code snippet shortcuts - not sure about difficulty since using port of CodeMirror

2. Finish code builder
* √ - Implement parser - remove need for whitespace with commands reccognition
* √ - Display errors in CodeMirror chunk for syntax errors
* √ - Have parser translate to machine code

3. Finish code runner
* √ - Add window for displaying register output, memory values and I/O of program after running
* √ - Implement circuit/circuit functionality
* √ - Implement actions based off of machine code
* √ - Implement all RRR/RR functions
* √ - Implement all RX/JX/KX functions
* Implement 'jump alias' functions
* Implement all EXP functions
* √ - Small rewrite to use binary checking instead of string checking to increase performance further
* √ - Link to webpage

4. Finish code debugger
* Allow for breakpoints to halt execution of code
* Add window to show register, memory and I/O along with code
* Add highlighting of lines being and have been executed
* Add line by line exectuting ability

## Author

The original Sigma16 language, architecture was software tools are written by, [John O'Donnell](https://jtod.github.io/index.html). Email: john.t.odonnnell9@gmail.com

The current React.js version of the software is being written by [Jim Carty](https://github.com/questiowo). Email: cartyjim1@gmail.com
