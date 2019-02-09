import React, { Component } from "react";
import { Container, Row, Col, Table, Button, Tabs, Tab } from 'react-bootstrap';
import { hot } from "react-hot-loader";
import fire from "./fire";
import './Home.css';

class Home extends Component {

    constructor(props) {
        super(props);
        this.state = { tasks: [], isMounted: false, key: 'to-do' };
    }


    // Initialize DB on component mount
    componentDidMount() {
        this.state.isMounted = true;

        let tasksRef = fire.database().ref('tasks');

        // Refresh on task add
        tasksRef.on("child_added", snapshot => {
            
            // Get task
            let task = snapshot.val();

            console.log(task);

            // Store task only if component is mounted users match
            if (this.state.isMounted && task.user == fire.auth().currentUser.uid) {
                this.setState({ tasks: [task].concat(this.state.tasks) });
            }
        });

        // Initial load on navigating to page
        tasksRef.on("value", snapshot => {
            let tasks = [];

            // Get each task
            snapshot.forEach(childSnapshot => {
                // Only add task if it belongs to the current user
                if(childSnapshot.val().user == fire.auth().currentUser.uid){
                    tasks = [childSnapshot.val()].concat(tasks);
                }
            })

            // Store the list of tasks if component is mounted
            if (this.state.isMounted) {
                this.setState({ tasks: tasks });
            }
        });
    }

    componentWillUnmount() {
        this.state.isMounted = false;
    }

    completeTask (key) {
        console.log("completed " + key);
        fire.database().ref('/tasks/' + key).update({done: true}, function(error) {
            console.log("failed to complete " + key + ": " + error);
        });
    }

    removeTask (key) {
        fire.database().ref('/tasks/').remove(key);
    }

    render() {

        const taskList = this.state.tasks.map(task =>
            {
                if( this.state.key == 'all' ||
                    (this.state.key == 'to-do' && task.done == false) ||
                    (this.state.key == 'done' && task.done == true)) {
                    return <tr key={task.key}>
                        <td>
                            <Button onClick={this.completeTask.bind(this, task.key)}>
                                Done
                            </Button>
                        </td>
                        <td>{task.description}</td>
                        <td>{task.tags}</td>
                        <td><span className={
                            task.priority == "Low" ? "dot green" : 
                            task.priority == "Med" ? "dot orange" : 
                            "dot red"
                            }></span>{task.priority}
                        </td>
                        <td>{new Date(task.dueDate).toDateString()}</td>
                    </tr>
                }
            }
        );

        return (
            <Container>
                <Row>
                    <Col xs={{ span: 10, offset: 1 }}>

                        <Tabs
                            id="tasks-filter-tab"
                            activeKey={this.state.key}
                            onSelect={key => this.setState({ key })}
                        >
                            <Tab eventKey="to-do" title="To Do"> </Tab>
                            <Tab eventKey="done" title="Done"> </Tab>
                            <Tab eventKey="all" title="All"> </Tab>
                        </Tabs>

                        <Table>
                            <tbody>
                                {taskList}
                            </tbody>
                        </Table>
                    </Col>
                </Row>
            </Container>
        );
    }
}
export default hot(module)(Home);
//<span className={task.priority == "Low" ? "dot green" : task.priority == "Med" ? "dot orange" : "dot red"}></span>