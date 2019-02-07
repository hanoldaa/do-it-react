import React, { Component } from "react";
import { hot } from "react-hot-loader";
import fire from "./fire";
import "./NewTask.css";
import { Form, Button, Container, Row, Col } from 'react-bootstrap';

class NewTask extends Component {

  constructor (props){
      super(props);
      this.state = {tasks: []};
  }

  componentWillMount(){
    let tasksRef = fire.database().ref('tasks');
      tasksRef.on("child_added", snapshot => {
        let task = snapshot.val();
        console.log(task);
        this.setState({tasks: [task].concat(this.state.tasks)});
      })
  }

  addTask(e) {
    e.preventDefault();

    var newTaskKey = fire.database().ref().child('tasks').push().key;

    let task = {
      id: newTaskKey,
      description: this.description.value,
      priority: this.priority.value,
      dueDate: new Date().toDateString()
    }

    var updates = {};
    updates['/tasks/' + newTaskKey] = task;

    fire.database().ref().update(updates);
    this.description.value = '';
    this.priority.value = 'low';
  }

  render() {
    return (
      <div className="NewTask">
        <Container>
          <Row>
            <Col md={{span:6, offset:3}}>
              <Form onSubmit={this.addTask.bind(this)}>
                <Form.Group controlId="description">
                  <Form.Label>Description</Form.Label>
                  <Form.Control ref={ d => this.description = d } />
                </Form.Group>
                <Form.Group controlId="priority">
                  <Form.Label>Priority</Form.Label>
                  <Form.Control as="select" ref={ p => this.priority = p } >
                    <option>Low</option>
                    <option>Med</option>
                    <option>High</option>
                  </Form.Control>
                </Form.Group>
                <Button variant="primary" type="submit">
                  Add Task
                </Button>
                <br />
                <br />
                <ul>
                  {
                    this.state.tasks.map( task => <li key={task.id}>{task.description} | {task.priority} | {task.dueDate}</li>)
                  }
                </ul>
              </Form>
            </Col>
          </Row>
        </Container>
      </div>
    );
  }
}

export default hot(module)(NewTask);