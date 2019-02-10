import React, { Component } from "react";
import { Container, Row, Col, Table, Tooltip, Tabs, Tab, OverlayTrigger, Popover } from 'react-bootstrap';
import { hot } from "react-hot-loader";
import fire from "./fire";
import './Home.css';

class Home extends Component {

    constructor(props) {
        super(props);
        this.state = { 
            tasks: [], 
            filteredTasks: [], 
            sortKey: "",
            taskFilter: "",
            tagFilter: "",
            priorityFilter: "",
            descending: true, 
            isMounted: false, 
            key: 'to-do' 
        };
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
                this.setState({ filteredTasks: this.state.tasks });
            }
        });

        // Refresh on task add
        tasksRef.on("child_removed", snapshot => {
            
            // Get task
            let task = snapshot.val();

            console.log(task);

            // Store task only if component is mounted users match
            if (this.state.isMounted && task.user == fire.auth().currentUser.uid) {
                this.setState({ tasks: [task].concat(this.state.tasks) });
                this.setState({ filteredTasks: this.state.tasks });
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
                this.setState({ tasks: tasks, filteredTasks: tasks });
            }
        });
    }

    componentWillUnmount() {
        this.state.isMounted = false;
    }

    completeTask (key) {
        fire.database().ref('/tasks/' + key).update({done: true}, function(error) {
            if(error)
                console.log("failed to complete " + key + ": " + error);
            else
                console.log("completed " + key);
        });
    }

    undoTask (key) {
        fire.database().ref('/tasks/' + key).update({done: false}, function(error) {
            if(error)
                console.log("failed to undo " + key + ": " + error);
            else
                console.log("undid " + key);
        });
    }

    deleteTask (key) {
        fire.database().ref('/tasks/' + key).remove(function(error) {
            if(error)
                console.log("failed to remove " + key + ": " + error);
            else
                console.log("removed " + key);
        });
    }

    setFilter(newKey){

        var newDescending;

        if(this.state.sortKey == newKey){
            newDescending = !this.state.descending;
            this.setState({descending: !this.state.descending});
        }
        else{       
            newDescending = true;
            this.setState({
                sortKey: newKey,
                descending: true
            });
        }

        this.filterTasks(newKey, newDescending);
    }

    filterTasks(newKey, newDescending){

        let filteredTasks = this.state.tasks;

        filteredTasks = this.state.filteredTasks.map(t => {
            let skipTask = false;

            if ((this.state.taskFilter && !t.task.includes(this.state.taskFilter)) ||
                (this.state.tagFilter && t.tags.split(',').indexOf(this.state.tagFilter) > -1) ||
                (this.state.priorityFilter && t.priority == this.state.priorityFilter))
                skipTask = true;
            
            if(!skipTask)
                return t;
        });

        if(newKey == '')
            return;

        console.log("Sorting");
        
        switch(newKey){
            case 'task':
                if(newDescending)
                    filteredTasks.sort(function(a, b) {return a.task.localeCompare(b.task)});
                else
                    filteredTasks.sort(function(a, b) {return b.task.localeCompare(a.task)});
                break;
            case 'priority':
                if(newDescending){
                    filteredTasks.sort(function(a, b) {
                        if(a.priority == 'High'){
                            if(b.priority == 'Med' || b.priority == 'Low')
                                return 1;
                            else
                                return 0;
                        }
                        else if (a.priority == 'Med'){
                            if(b.priority == 'Low')
                                return 1;
                            else if (b.priority == 'High')
                                return -1;
                            else
                                return 0;
                        }
                        else{
                            if(b.priority == 'Med' || b.priority == 'High')
                                return -1;
                            else
                                return 0;
                        } 
                    });
                }
                else {
                    filteredTasks.sort(function(b, a) {
                        if(a.priority == 'High'){
                            if(b.priority == 'Med' || b.priority == 'Low')
                                return 1;
                            else
                                return 0;
                        }
                        else if (a.priority == 'Med'){
                            if(b.priority == 'Low')
                                return 1;
                            else if (b.priority == 'High')
                                return -1;
                            else
                                return 0;
                        }
                        else{
                            if(b.priority == 'Med' || b.priority == 'Low')
                                return -1;
                            else
                                return 0;
                        } 
                    });
                }
                break;
            case 'dueDate':
                if(newDescending)
                    filteredTasks.sort(function(a, b) {return new Date(a.dueDate).getDate() - new Date(b.dueDate).getDate()});
                else
                    filteredTasks.sort(function(a, b) {return new Date(b.dueDate).getDate() - new Date(a.dueDate).getDate()});
                break;
        }
        
        this.setState({filteredTasks: filteredTasks});
    }

    render() {

        let today = new Date().setHours(0, 0, 0, 0);
        let tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        tomorrow = tomorrow.setHours(0, 0, 0, 0);

        const taskList = this.state.filteredTasks.map(task =>
            {
                const dueDateComparer = new Date(task.dueDate).setHours(0, 0, 0, 0);
                const dueType = dueDateComparer == today ? "today" :
                                dueDateComparer == tomorrow ? "tomorrow" :
                                dueDateComparer < today ? "overdue" :
                                "whenever";
                
                const priorityColor =   task.priority == "Low" ? "green" : 
                                        task.priority == "Med" ? "orange" : 
                                        "red";

                if( this.state.key == 'all' ||
                    (this.state.key == 'to-do' && task.done == false) ||
                    (this.state.key == 'done' && task.done == true)) {
                    return <tr 
                        key={task.key} 
                        className={"due-" + dueType}
                    >
                        <td className="hidden-column">
                            {
                            this.state.key != 'all' ?
                                <div className="row-button">
                                    <OverlayTrigger
                                        key={task.key}
                                        placement='top'
                                        delay='500'
                                        overlay={
                                        <Tooltip id={`${task.key} Done`}>
                                            { task.done ? "Redo it!" : "Did it!" }
                                        </Tooltip>
                                        }
                                    >
                                    {
                                        task.done ?
                                        <button className="icon-button" onClick={this.undoTask.bind(this, task.key)}>
                                            <span className="fas fa-undo-alt"></span>
                                        </button> :
                                        <button className="icon-button" onClick={this.completeTask.bind(this, task.key)}>
                                            <span className="fas fa-check-circle"></span>
                                        </button>
                                    }
                                    </OverlayTrigger>
                                </div>:
                                ""
                            }
                            <div className="row-button">
                                <OverlayTrigger
                                    key={task.key}
                                    placement='top'
                                    delay='500'
                                    overlay={
                                    <Tooltip id={`${task.key} Delete`}>
                                        Delete it!
                                    </Tooltip>
                                    }
                                >
                                    <button className="icon-button" onClick={this.deleteTask.bind(this, task.key)}>
                                        <span className="fas fa-times-circle"></span>
                                    </button>
                                </OverlayTrigger>
                            </div>
                        </td>
                        <td>
                            {task.task}
                            {task.notes ?
                                <OverlayTrigger
                                    trigger="click"
                                    key={task.key}
                                    placement='auto'
                                    overlay={
                                    <Popover
                                        id={`${task.key} Note`}
                                        title={`Notes`}
                                    >
                                        {task.notes}
                                    </Popover>
                                    }
                                >
                                    <button className="icon-button"><span className="fas fa-sticky-note"></span></button>
                                </OverlayTrigger> :
                                ""}
                            </td>
                        <td>{task.tags}</td>
                        <td>
                            <span className={ "dot " + priorityColor }></span>
                            {task.priority}
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
                            <thead>
                                <tr>
                                    <th style={{width:'0', padding:'0'}}></th>
                                    <th className="sortable" onClick={this.setFilter.bind(this, 'task')}>
                                        Task
                                        {
                                            this.state.sortKey == 'task' ? 
                                                (this.state.descending ? 
                                                    <span className="fas fa-caret-down"></span> :
                                                    <span className="fas fa-caret-up"></span>
                                                ) :
                                            <span className="fas fa-caret-down inactive"></span>
                                        }
                                    </th>
                                    <th>
                                        Tags
                                    </th>
                                    <th className="sortable" onClick={this.setFilter.bind(this, 'priority')}>
                                        Priority
                                        {
                                            this.state.sortKey == 'priority' ? 
                                                (this.state.descending ? 
                                                    <span className="fas fa-caret-down"></span> :
                                                    <span className="fas fa-caret-up"></span>
                                                ) :
                                            <span className="fas fa-caret-down inactive"></span>
                                        }
                                    </th>
                                    <th className="sortable" onClick={this.setFilter.bind(this, 'dueDate')}>
                                        Due
                                        {
                                            this.state.sortKey == 'dueDate' ? 
                                                (this.state.descending ? 
                                                    <span className="fas fa-caret-down"></span> :
                                                    <span className="fas fa-caret-up"></span>
                                                ) :
                                            <span className="fas fa-caret-down inactive"></span>
                                        }
                                    </th>
                                </tr>
                            </thead>
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