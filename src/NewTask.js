import React, { Component } from "react";
import { hot } from "react-hot-loader";
import fire from "./fire";
import "./NewTask.css";
import { Form, Button, Container, Row, Col } from 'react-bootstrap';
import { withRouter } from 'react-router-dom';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

class NewTask extends Component {

  constructor(props) {
    super(props);
    this.state = {dueDate: new Date()};
    this.handleDateChange = this.handleDateChange.bind(this);
  }

  addTask(e) {
    e.preventDefault();

    // Generate new task key
    var newTaskKey = fire.database().ref().child('tasks').push().key;

    // Build new task
    let task = {
      key: newTaskKey,
      description: this.description.value,
      tags: this.tags ? this.tags.value : "",
      priority: this.priority.value ? this.priority.value : "Low",
      dueDate: this.state.dueDate.toString() ? this.state.dueDate.toString() : "Whenever",
      done: false,
      user: fire.auth().currentUser ? fire.auth().currentUser.uid : "None"
    }

    // Initialize list of updates
    var updates = {};
    updates['/tasks/' + newTaskKey] = task;

    // Add task to database
    fire.database().ref().update(updates);

    // Reset form fields
    this.description.value = '';
    this.priority.value = 'Low';

    // Return to tasks view
    this.props.history.push('/');
  }

  handleDateChange(date) {
    this.setState({
      dueDate: date
    });
  }

  render() {
    return (
      <div className="NewTask">
        <Container>
          <Row>
            <Col md={{ span: 6, offset: 3 }}>
              <Form onSubmit={this.addTask.bind(this)}>
                <Form.Group controlId="description">
                  <Form.Label>Description</Form.Label>
                  <Form.Control ref={d => this.description = d} required />
                </Form.Group>
                <Form.Group controlId="tags">
                  <Form.Label>Tags <i>(separated by commas)</i></Form.Label>
                  <Form.Control ref={t => this.tags = t} />
                </Form.Group>
                <Form.Group controlId="priority">
                  <Form.Label>Priority</Form.Label>
                  <Form.Control as="select" ref={p => this.priority = p} >
                    <option>Low</option>
                    <option>Med</option>
                    <option>High</option>
                  </Form.Control>
                </Form.Group>
                <Form.Group controlId="dueDate">
                  <Form.Label>Due Date</Form.Label>
                  <DatePicker
                    selected={this.state.dueDate}
                    onChange={this.handleDateChange}
                  />
                </Form.Group>
                <Button variant="primary" type="submit">
                  Add Task
                </Button>
              </Form>
            </Col>
          </Row>
        </Container>
      </div>
    );
  }
}

export default hot(module)(withRouter(NewTask));