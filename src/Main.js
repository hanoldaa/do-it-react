import React from "react";
import { Switch, Route } from 'react-router-dom'
import { hot } from "react-hot-loader";
import Home from './Home';
import Login from './Login';
import NewTask from './NewTask';

function Main() {
  return (
    <main>
      <Switch>
        <Route exact path='/' component={Home}/>
        <Route path='/login' component={Login}/>
        <Route path='/newTask' component={NewTask}/>
      </Switch>
    </main>
  );
}
export default hot(module)(Main);