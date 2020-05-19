import React from 'react';

import './App.css';

import { HashRouter, Switch } from 'react-router-dom';

import AppliedRoute from './AppliedRoute';
import HomeView from './components/HomeView';
import DocumentationView from './components/DocumentationView';
import ProgramEditorView from './components/ProgramEditorView';
import ProgramDebugView from './components/ProgramDebugView';

export default class App extends React.Component {
  constructor( props ) {
    super( props );

    this.state = {};

    // the default program that takes up the code chunk
    this.state.code = `lea r1,2[r0]
lea r2,buffer[r0]
load r3,buffersize[r0]

trap r1,r2,r3

trap r0,r0,r0

buffersize data 13
buffer data $0048
  data $0065
  data $006c
  data $006c
  data $006f
  data $002c
  data $0020
  data $0057
  data $006f
  data $0072
  data $006c
  data $0064
  data $0021`;

    this.state.breakpoints = [];
    this.state.input = '';

  }
  render() {
    var stateCode = this.state.code;
    var stateBreakpoints = this.state.breakpoints;
    var stateInput = this.state.input;

    return (
      <React.Fragment>
        <HashRouter>
          <Switch>
            <AppliedRoute exact path="/" component={HomeView} props={{code : stateCode, breakpoints : stateBreakpoints, input : stateInput}}/>
            <AppliedRoute exact path="/documentation" component={DocumentationView} props={{code : stateCode, breakpoints : stateBreakpoints, input : stateInput}}/>
            <AppliedRoute exact path="/editor" component={ProgramEditorView} props={{code : stateCode, breakpoints : stateBreakpoints, input : stateInput}}/>
            <AppliedRoute exact path="/debug" component={ProgramDebugView} props={{code : stateCode, breakpoints : stateBreakpoints, input : stateInput}}/>
          </Switch>
        </HashRouter>
      </React.Fragment>
    );
  }
}
