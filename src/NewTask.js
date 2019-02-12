import React, { Component } from "react";
import { hot } from "react-hot-loader";
import fire from "./fire";
import "./NewTask.css";
import { Form, Button, Container, Row, Col } from 'react-bootstrap';
import { withRouter } from 'react-router-dom';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import ReactTags from 'react-tag-autocomplete';
import './TagInput.css';

class NewTask extends Component {

  constructor(props) {
    super(props);
    this.state = {
      dueDate: new Date(),
      tags: [],
      suggestions: []
    };
    this.handleDateChange = this.handleDateChange.bind(this);
  }

  componentWillMount(){

        let tasksRef = fire.database().ref('tasks');

        // Initial load on navigating to page
        tasksRef.once("value", snapshot => {
          let tags = [];
          let uniqueTags = [];

          // Get each task
          let uid = 0;
          snapshot.forEach(childSnapshot => {
              // Only add task if it belongs to the current user
              if(childSnapshot.val().user == fire.auth().currentUser.uid){
                
                childSnapshot.val().tags.split(',').forEach(tag => {
                  if(uniqueTags.indexOf(tag.toLowerCase().trim()) == -1){
                    uniqueTags.push(tag.toLowerCase().trim());
                    tags.push({id: uid++, name: tag.toLowerCase().trim()});
                  }
                })

                console.log(tags);
              }
          })

          // Store the list of suggestions
          this.setState({ suggestions: tags });
      });
  }

  componentDidMount(){
    // Disable the date picker keyboard input 
    document.getElementsByClassName('react-datepicker__input-container')[0].getElementsByTagName('input')[0].readOnly = true;
  }

  // Creates and adds the task to the database
  // Returns to the home page
  addTask(e) {
    e.preventDefault();

    // Generate new task key
    var newTaskKey = fire.database().ref().child('tasks').push().key;

    // Build new task
    let task = {
      key: newTaskKey,
      task: this.task.value,
      notes: this.notes.value ? this.notes.value : "",
      tags: this.state.tags ? this.state.tags.map(t => t.name).join() : "",
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

    // Return to tasks view
    this.props.history.push('/');
  }

  // Set date when picked from calendar
  handleDateChange(date) {
    this.setState({
      dueDate: date
    });
  }

  // Delete tags from input
  handleDelete (i) {
    // Prevent duplicate tags
      const tags = this.state.tags.slice(0)
      tags.splice(i, 1)
      this.setState({ tags })
  }
 
  // Adds new tags from input
  handleAddition (tag) {
    // Prevent duplicate tags
    if(this.state.tags.indexOf(tag) == -1){
      const tags = [].concat(this.state.tags, tag)
      this.setState({ tags })
    }
  }

  render() {
    return (
      <div className="NewTask">
        <Container>
          <Row>
            <Col md={{ span: 12, offset: 0 }}>
              <Form onSubmit={this.addTask.bind(this)}>
                <Form.Group controlId="task">
                  <Form.Label>Task</Form.Label>
                  <Form.Control ref={t => this.task = t} required />
                </Form.Group>
                <Form.Group controlId="notes">
                  <Form.Label>Notes <i>(optional)</i></Form.Label>
                  <Form.Control ref={n => this.notes = n} />
                </Form.Group>
                <Form.Group controlId="tags">
                  <Form.Label>Tags <i>(separated by commas)</i></Form.Label>
                  <ReactTags
                    tags={this.state.tags}
                    suggestions={this.state.suggestions}
                    handleDelete={this.handleDelete.bind(this)}
                    handleAddition={this.handleAddition.bind(this)} 
                    autofocus={false}
                    autoresize={false}
                    delimiterChars={[',']}
                    allowNew={true}
                  />
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
                <Button variant="primary" type="submit" onClick={this.props.onHide.bind(this)}>
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