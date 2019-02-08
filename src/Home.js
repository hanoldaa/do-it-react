import React, { Component } from "react";
import { Container, Row, Col, Table } from 'react-bootstrap';
import { hot } from "react-hot-loader";
import fire from "./fire";
import './Home.css';

class Home extends Component {

    constructor(props) {
        super(props);
        this.state = {tasks: [], isMounted: false};
    }


    // Initialize DB on component mount
    componentDidMount(){
        this.state.isMounted = true;

        let tasksRef = fire.database().ref('tasks');

        // Refresh on task add
        tasksRef.on("child_added", snapshot => {
          let task = snapshot.val();
          console.log(task);
          if(this.state.isMounted) {
              this.setState({tasks: [task].concat(this.state.tasks)});
          }
        });

        // Initial load on navigating to page
        tasksRef.once("value", snapshot => {
            let tasks = [];
            snapshot.forEach(childSnapshot => {
                tasks = [childSnapshot.val()].concat(tasks);
            })
            if(this.state.isMounted){
                this.setState({tasks: tasks});
            }
        });
    }

    componentWillUnmount(){
        this.state.isMounted = false;
    }

    render(){
        return (
            <Container>
                <Row>
                    <Col xs={{span:10, offset: 1}}>
                        <Table>
                            <tbody>
                                { this.state.tasks.map( task => 
                                    <tr key={task.key}>
                                        <td>{task.description}</td>
                                        <td>{task.tags}</td> 
                                        <td><span className={task.priority == "Low" ? "dot green" : task.priority == "Med" ? "dot orange" : "dot red"}></span>{task.priority}</td>
                                        <td>{new Date(task.dueDate).toDateString()}</td>
                                    </tr>
                                )
                                }
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