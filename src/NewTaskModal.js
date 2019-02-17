import React, { Component } from "react";
import { hot } from "react-hot-loader";
import fire from "./fire";
import "./NewTaskModal.css";
import { Modal, Form, Button, Container, Row, Col } from 'react-bootstrap';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import ReactTags from 'react-tag-autocomplete';
import './TagInput.css';

class NewTaskModal extends Component {

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
    this.updateSuggestions();
  }

  componentWillReceiveProps(){
    this.updateSuggestions();
  }

  updateSuggestions(){
    var suggestions = [];

    var uid = 0;
    this.props.uniqueTags.forEach(tag => {
      suggestions.push({id: uid++, name: tag});
    });

    this.setState({suggestions: suggestions});
  }

  componentDidMount(){
    // Disable the date picker keyboard input 
    var container = document.getElementsByClassName('react-datepicker__input-container')[0]
    
    if(container)
      container.getElementsByTagName('input')[0].readOnly = true;
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
        
    let modalSize;
    if(this.props.isMobile) 
        modalSize = {dialogClassName: "modal-100w"};
    else 
        modalSize = {size: "lg"};

    return (
      <Modal 
          { ...modalSize }
          show={this.props.showModal} 
          onHide={this.props.onHide.bind(this)}
          centered
      >
          <Modal.Header closeButton>
              <Modal.Title>New Task</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="NewTaskModal">
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
                        <div className="priority-select">
                          <Form.Control as="select" ref={p => this.priority = p} >
                            <option>Low</option>
                            <option>Med</option>
                            <option>High</option>
                          </Form.Control>
                          <span className="fas fa-chevron-down"></span>
                        </div>
                      </Form.Group>
                      <Form.Group controlId="dueDate">
                        <Form.Label>Due Date</Form.Label>
                        <DatePicker
                          selected={this.state.dueDate}
                          onChange={this.handleDateChange}
                        />
                      </Form.Group>
                      <Button type="submit" onClick={this.props.onHide.bind(this)}>
                        Add Task
                      </Button>
                    </Form>
                  </Col>
                </Row>
              </Container>
            </div>
          </Modal.Body>
      </Modal>
    );
  }
}

export default hot(module)(NewTaskModal);