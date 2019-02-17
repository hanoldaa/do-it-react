import React, { Component } from "react";
import { Container, Row, Col, Table, Tabs, Tab } from 'react-bootstrap';
import { hot } from "react-hot-loader";
import fire from "./fire";
import './Home.css';
import NewTaskModal from './NewTaskModal.js';
import Task from './Task.js';
import TaskMobile from './TaskMobile.js';
import StatusTabs from './StatusTabs.js';
import SideBar from './SideBar.js';

class Home extends Component {

    constructor(props) {
        super(props);
        this.state = { 
            tasks: [], 
            sortedTasks: [], 
            sortKey: "",
            taskFilter: "",
            tagFilter: [],
            priorityFilter: "",
            descending: true, 
            isMounted: false, 
            status: 'to-do',
            width: window.innerWidth,
            showNewTaskModal: false,
            uniqueTags : []
        };
    }

    componentWillMount() {
      window.addEventListener('resize', this.handleWindowSizeChange.bind(this));
    }

    // Initialize DB on component mount
    componentDidMount() {
        this.state.isMounted = true;

        let tasksRef = fire.database().ref('tasks');

        // Refresh on task add
        tasksRef.on("child_added", snapshot => {
            
            // Get task
            let task = snapshot.val();

            // Store task only if component is mounted users match
            if (this.state.isMounted && task.user == fire.auth().currentUser.uid) {
                this.setState({ tasks: [task].concat(this.state.tasks) });
                this.setState({ sortedTasks: this.state.tasks });
            }
        });

        // Refresh on task add
        tasksRef.on("child_removed", snapshot => {
            
            // Get task
            let task = snapshot.val();

            // Store task only if component is mounted users match
            if (this.state.isMounted && task.user == fire.auth().currentUser.uid) {
                this.setState({ tasks: [task].concat(this.state.tasks) });
                this.setState({ sortedTasks: this.state.tasks });
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
                var uniqueTags = this.getUniqueTags(tasks);
                this.setState({ tasks: tasks, sortedTasks: tasks, uniqueTags: uniqueTags });
            }
        });
    }
    
    componentWillUnmount() {
        this.state.isMounted = false;
        window.removeEventListener('resize', handleWindowSizeChange.bind(this));
    }

    handleWindowSizeChange () {
      this.setState({ width: window.innerWidth });
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

    setSort(newKey){
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
        
        this.sortTasks(newKey, newDescending);
    }

    sortTasks(newKey, newDescending){

        let sortedTasks = this.state.tasks;

        if(newKey == '')
            return;

        switch(newKey){
            case 'task':
                if(newDescending)
                    sortedTasks.sort(function(a, b) {return a.task.localeCompare(b.task)});
                else
                    sortedTasks.sort(function(a, b) {return b.task.localeCompare(a.task)});
                break;
            case 'priority':
                if(newDescending){
                    sortedTasks.sort(function(a, b) {
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
                    sortedTasks.sort(function(b, a) {
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
                    sortedTasks.sort(function(a, b) {return new Date(a.dueDate).getDate() - new Date(b.dueDate).getDate()});
                else
                    sortedTasks.sort(function(a, b) {return new Date(b.dueDate).getDate() - new Date(a.dueDate).getDate()});
                break;
        }
        
        this.setState({sortedTasks: sortedTasks});
    }

    getUniqueTags(tasks){
        var tags = [];
        
        tasks.forEach(task => {
            task.tags.split(',').forEach(tag => {
                if(tag && !tags.includes(tag.toLowerCase()))
                    tags.push(tag.toLowerCase());
            }
        )});

        return tags;
    }

    handleShowNewTaskModal(){
        this.setState({showNewTaskModal: true});
    }

    handleCloseNewTaskModal(){
        this.setState({showNewTaskModal: false});
    }

    render() {

        const { width } = this.state;
        const isMobile = width <= 576;

        let today = new Date().setHours(0, 0, 0, 0);

        let tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        tomorrow = tomorrow.setHours(0, 0, 0, 0);

        let yesterday = new Date();
        yesterday.setDate(yesterday.getDate() + 1);
        yesterday = yesterday.setHours(0, 0, 0, 0);

        let sortBar;
        if(isMobile){
            sortBar = <Table className="sort-bar">
                <thead>
                    <tr>                                    
                        <th className="sortable" onClick={this.setSort.bind(this, 'task')}>
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
                        <th className="sortable" onClick={this.setSort.bind(this, 'priority')}>
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
                        <th className="sortable" onClick={this.setSort.bind(this, 'dueDate')}>
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
            </Table>
        }
        else{
            sortBar = "";
        }

        const taskList = this.state.sortedTasks.map(task =>
            {
                const dueDateComparer = new Date(task.dueDate).setHours(0, 0, 0, 0);
                const dueType = task.done ? "whenever" :
                                dueDateComparer == today ? "today" :
                                dueDateComparer == tomorrow ? "tomorrow" :
                                dueDateComparer < today ? "overdue" :
                                "whenever";
                
                const priorityColor =   task.priority == "Low" ? "green" : 
                                        task.priority == "Med" ? "orange" : 
                                        "red";

                let skipTask = true;

                if (this.state.tagFilter.length > 0){
                    task.tags.split(',').forEach(tag => {
                        this.state.tagFilter.forEach(tagFilter => {
                            if(tagFilter.toLowerCase() == tag.toLowerCase())
                                skipTask = false;
                        });
                    })
                }
                else{
                    skipTask = false;
                }

                if( !skipTask && 
                    (this.state.status == 'all' ||
                    (this.state.status == 'to-do' && task.done == false) ||
                    (this.state.status == 'done' && task.done == true))) {

                    if(isMobile) {
                        return <TaskMobile key={task.key} 
                            task={task} 
                            today={today}
                            tomorrow={tomorrow} 
                            yesterday={yesterday}
                            dueDateComparer={dueDateComparer} 
                            dueType={dueType}
                            priorityColor={priorityColor}
                            filter={this.state.status}
                            undoTask={this.undoTask}
                            completeTask={this.completeTask}
                            deleteTask={this.deleteTask}
                            uniqueTags={this.state.uniqueTags}/>
                    } else {
                        return <Task key={task.key} 
                            task={task} 
                            today={today} 
                            tomorrow={tomorrow} 
                            yesterday={yesterday}
                            dueDateComparer={dueDateComparer} 
                            dueType={dueType}
                            priorityColor={priorityColor}
                            filter={this.state.status}
                            undoTask={this.undoTask}
                            completeTask={this.completeTask}
                            deleteTask={this.deleteTask}
                            uniqueTags={this.state.uniqueTags}/>
                    }                    
                }
            }
        );

        return (
            <div className="content-body">
                <NewTaskModal 
                    key="newTaskModal" 
                    showModal={this.state.showNewTaskModal} 
                    isMobile={isMobile} 
                    onHide={this.handleCloseNewTaskModal.bind(this)}
                    uniqueTags={this.state.uniqueTags}
                />

                {!isMobile ? 
                    <SideBar 
                        uniqueTags={this.state.uniqueTags} 
                        onUpdateTags={(tagFilter) => this.setState({tagFilter: tagFilter})}
                        onUpdateSortKey={(sortKey) => this.setSort(sortKey)}
                        onUpdateStatus={(status) => this.setState({status: status})}
                    /> : "" }

                <Container fluid={true}>
                    <Row noGutters={true}>
                        <Col xs={{ span: 12 }} sm={{span: 11, offset: 1}} className="content-col">

                            {isMobile ? 
                                <StatusTabs status={this.state.status} onSelect={(status) => this.setState(status)}/> :
                                ""}

                            {sortBar}
                            <ul>
                                {taskList}
                            </ul>
                        </Col>
                    </Row>
                </Container>

                <button className="newTaskButton" onClick={this.handleShowNewTaskModal.bind(this)}>
                    <span className="fas fa-plus"></span>
                </button>
            </div>
        );
    }
}
export default hot(module)(Home);
//<span className={task.priority == "Low" ? "dot green" : task.priority == "Med" ? "dot orange" : "dot red"}></span>