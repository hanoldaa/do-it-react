import React, { Component } from "react";
import { hot } from "react-hot-loader";
import fire from "./fire";

class Home extends Component {

    constructor(props) {
        super(props);
        this.state = {tasks: []};
    }


    // Initialize DB on component mount
    componentDidMount(){
        let tasksRef = fire.database().ref('tasks');

        // Refresh on task add
        tasksRef.on("child_added", snapshot => {
          let task = snapshot.val();
          console.log(task);
          this.setState({tasks: [task].concat(this.state.tasks)});
        });

        // Initial load on navigating to page
        tasksRef.once("value", snapshot => {
            let tasks = [];
            snapshot.forEach(childSnapshot => {
                tasks = [childSnapshot.val()].concat(tasks);
            })
            this.setState({tasks: tasks});
        });
    }

    render(){
        return (
            <div>
                <ul>
                    { this.state.tasks.map( task => <li key={task.id}>{task.description} | {task.priority} | {task.dueDate}</li>) }
                </ul>
            </div>
        );
    }
}
export default hot(module)(Home);
