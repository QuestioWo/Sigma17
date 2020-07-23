# Sigma17 repository

[![Language grade: JavaScript](https://img.shields.io/lgtm/grade/javascript/g/QuestioWo/Sigma17.svg?logo=lgtm&logoWidth=18)](https://lgtm.com/projects/g/QuestioWo/Sigma17/context:javascript)

Sigma17 is a re-write of the original emulator written by John O' Donnell. The overall aim of Sigma17 is to re-write the entire web based app but keep apps functionality. This is so that it is easier and more intuitive to code in Sigma16 with the web based app. 

Sigma16 is a computer architecture designed for research and teaching in computer systems.  This application aims to provide a complete environment for experimenting with the architecture.

## Using the emulator

Currently, the emulator can be used by visiting the [Sigma17 website](https://questiowo.github.io/Sigma17) which is hosted by github as a `github.io` project site and is kept up to date with all major changes.

Also, the emulator can be ran locally using `npm` and `React.js` from the source directory which will support more minor changes that will not effect the overall ability of the `github.io` site.

### Run in a browser

Visit [the website](https://questiowo.github.io/Sigma17).

### Run with `npm` locally in browser

The following software needs to be installed in order to build the local server :

* `node.js`
* `npm`

After these are installed, to compile the program, execute the following commands in the repository directory:

```shell
npm install
npm start
```

This will start the local `React.js` development server and should open a window in your default browser to [localhost:3000](https://localhost:3000), in which the website can be used as normal.

## Performance

### [Performance example program](https://jtod.github.io/home/Sigma16/releases/3.1.3/examples/Advanced/Testing/Performance.asm.txt) :

Comparison of time to find which is the times to compute a standard program between each emulator

#### Original

Measured by stopwatch

> 3:44.49

#### This emulator

Measured by `console.time()` to two decimal places
> 28.31ms

### Memory performance test :

```
 lea R1,heap[R0]
 lea R2,1[R0]
 lea R3,65535[R0]
 
 sub R1,R1,R2
 
loop 
 add R1,R1,R2
 store R1,0[R1]
 
 cmp R1,R3
 
 jumpne loop[R0]
 
 trap R0,R0,R0
 
heap 
```

Comparison of time and tab's memory usage to find the times and memory impacts to compute a program in each emulator

#### Original

Measured by stopwatch and Google Chrome Task Manager Tool
> 25:10.23; 340MB

#### This emulator

Measured by stopwatch and Google Chrome Task Manager Tool
> 56.35; 2.3GB

## Author

This `React.js` version of the Sigma16 emulator has been and is being written by [Jim Carty](https://questiowo.github.io). Email: cartyjim1@gmail.com

## License

This project is licensed under the terms of the GNU Public License. See `LICENSE.txt` for the full license.
