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

    this.state.code = `;Program Swap - works

 load R1,x[R0]; R1:=x
 load R2,y[R0]; R2:=y

 store R2,x[R0]; x:=y
 store R1,y[R0]; y:=x, x and y swapped

 trap R0,R0,R0; halt

x data 3; x:=3, set initial value
y data 19; y:=19, set initial value`

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
