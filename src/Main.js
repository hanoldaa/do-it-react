import React from "react";
import { Switch, Route } from 'react-router-dom'
import { hot } from "react-hot-loader";
import Home from './Home';

function Main() {
  return (
    <main>
      <Switch>
        <Route exact path='/' component={Home}/>
      </Switch>
    </main>
  );
}
export default hot(module)(Main);