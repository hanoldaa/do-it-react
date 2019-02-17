import React, { Component } from "react";
import { hot } from "react-hot-loader";
import fire from "./fire";
import "./EditTaskModal.css";
import { Modal, Form, Button, Container, Row, Col } from 'react-bootstrap';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import ReactTags from 'react-tag-autocomplete';
import './TagInput.css';

class EditTaskModal extends Component {

  constructor(props) {
    super(props);

    this.state = {
      dueDate: new Date(props.task.dueDate),
      tags: [],
      suggestions: []
    };
    this.handleDateChange = this.handleDateChange.bind(this);
  }

  componentWillMount(){
    this.updateTags();
    this.updateSuggestions();
  }

  componentWillReceiveProps(){
    this.updateSuggestions();
  }

  updateTags() {
    var tags = [];

    var uid = 0;
    this.props.task.tags.split(',').forEach(tag => {
      if(tag) {
        tags.push({id: uid++, name: tag.toLowerCase()});
      }
    });

    this.setState({tags: tags});
  }

  updateSuggestions(){
    var suggestions = [];

    var uid = 0;
    this.props.uniqueTags.forEach(tag => {
      suggestions.push({id: uid++, name: tag.toLowerCase()});
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
  editTask(e) {
    e.preventDefault();

    let updatedTask = this.props.task;

    // Update task
    updatedTask.task = this.task.value;
    updatedTask.notes = this.notes.value ? this.notes.value : "";
    updatedTask.tags = this.state.tags ? this.state.tags.map(t => t.name).join() : "";
    updatedTask.priority = this.priority.value ? this.priority.value : "Low";
    updatedTask.dueDate = this.state.dueDate.toString() ? this.state.dueDate.toString() : "Whenever";

    // Initialize list of updates
    var updates = {};
    updates['/tasks/' + updatedTask.key] = updatedTask;

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
      const tags = this.state.tags.slice(0);
      tags.splice(i, 1);
      this.setState({ tags });
  }
 
  // Adds new tags from input
  handleAddition (tag) {
    // Prevent duplicate tags
    if(this.state.tags.indexOf(tag) == -1){
      const tags = [].concat(this.state.tags, tag);
      this.setState({ tags: tags });
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
              <Modal.Title>Edit Task</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="EditTaskModal">
              <Container>
                <Row>
                  <Col md={{ span: 12, offset: 0 }}>
                    <Form onSubmit={this.editTask.bind(this)}>
                      <Form.Group controlId="task">
                        <Form.Label>Task</Form.Label>
                        <Form.Control as="textarea" defaultValue={this.props.task.task} ref={t => this.task = t} required />
                      </Form.Group>
                      <Form.Group controlId="notes">
                        <Form.Label>Notes <i>(optional)</i></Form.Label>
                        <Form.Control defaultValue={this.props.task.notes} ref={n => this.notes = n} />
                      </Form.Group>
                      <Form.Group controlId="tags">
                        <Form.Label>Tags</Form.Label>
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
                          <Form.Control as="select" defaultValue={this.props.task.priority} ref={p => this.priority = p} >
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
                        Edit Task
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

export default hot(module)(EditTaskModal);