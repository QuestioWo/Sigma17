import React from 'react';

import './App.css';

import { BrowserRouter, Switch } from 'react-router-dom';

import AppliedRoute from './AppliedRoute';
import HomeView from './components/HomeView';
import DocumentationView from './components/DocumentationView';
import ProgramEditorView from './components/ProgramEditorView';
import ProgramDebugView from './components/ProgramDebugView';

export default class App extends React.Component {
  constructor( props ) {
    super( props )

    this.state = {}

    this.state.code = `load r1,x[r0]; r1:=x
load r2,y[r0]; r2:=y
add r3,r1,r2; r3:=x+y
store r3,z[r0]; z:=x=y
trap r0,r0,r0; terminate
x data $0017
y data 14
z data 0`

  }
  render() {
    var stateCode = this.state.code;

    return (
      <React.Fragment>
        <BrowserRouter>
          <div>
            <Switch>
              <AppliedRoute exact path="/" component={HomeView} props={{code:stateCode}} />
              <AppliedRoute exact path="/documentation" component={DocumentationView} props={{code:stateCode}} />
              <AppliedRoute exact path="/editor" component={ProgramEditorView} props={{code:stateCode}} />
              <AppliedRoute exact path="/debug" component={ProgramDebugView} props={{code:stateCode}} />
            </Switch>
          </div>
        </BrowserRouter>
      </React.Fragment>
    );
  }
}
