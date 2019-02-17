import React, {Component} from 'react';
import { Table, OverlayTrigger, Popover } from 'react-bootstrap';
import { hot } from "react-hot-loader";
import './TaskMobile.css';
import EditTaskModal from './EditTaskModal.js';

class TaskMobile extends Component {
    constructor(props) {
        super(props);

        this.state = {isEditing: false};
    }

    editTask() {
        this.setState({isEditing: true});
    }

    render(){
        let tagsTitleElement;
        let tagsPillsElement;
        let notesElement;
    
        let dueDateString = this.props.dueDateComparer == this.props.today ? "Today" :
                            this.props.dueDateComparer == this.props.tomorrow ? "Tomorrow" :
                            this.props.dueDateComparer == this.props.yesterday ? "Yesterday" :
                            new Date(this.props.task.dueDate).toLocaleDateString();
    
        if(this.props.task.tags){
            tagsTitleElement = <div className="task-info-title">
                Tags
            </div>
    
            tagsPillsElement = <div className="task-info-stacked">
            {
                this.props.task.tags.split(',').map(function(t){
                return <span key={t} className="tag-pill" >
                        {t.toLowerCase()}
                    </span>})
            }
            </div>
        }
    
        if(this.props.task.notes){
            notesElement = <div className="task-info-stacked no-indent">
                <span className="expand-height">{this.props.task.notes}</span>
            </div>
        }
    
    
        return<li>
    
            <EditTaskModal 
                    key={"editTaskModal" + this.props.task.key}
                    showModal={this.state.isEditing} 
                    isMobile={true} 
                    onHide={() => this.setState({isEditing: false})}
                    uniqueTags={this.props.uniqueTags}
                    task={this.props.task}/>
    
            <Table className="mobile">
                <tbody>
                    <tr 
                        key={this.props.task.key} 
                        className={"mobile-row"}
                    >
                        <td className="mobile-cell">
    
                            {/* Task Display */}
                            <div className="task-info-stacked header">
                                <span className="expand-height">{this.props.task.task}</span>
                                <OverlayTrigger
                                    trigger="focus"
                                    key={this.props.task.key}
                                    placement='auto'
                                    overlay={
                                    <Popover
                                        id={`${this.props.task.key} Note`}
                                        className="options"
                                        variant="dark"
                                    >
                                        <span className="edit popover-item" onClick={this.editTask.bind(this)}>Edit Task</span>
                                        <span className="delete popover-item" onClick={this.props.deleteTask.bind(this, this.props.task.key)}>Delete Task</span>
                                    </Popover>
                                    }
                                >
                                    <button className="options-button"><span className="fas fa-ellipsis-h"></span></button>
                                </OverlayTrigger>
                            </div>
    
                            {/* Notes Display */}
                            {notesElement}
                            
                            {/* Tags Display */}
                            {tagsTitleElement}
                            {tagsPillsElement}
                            
                            {/* Due Date Display */}
                            <div className="task-info-title">
                            Due
                            </div>
                            <div className={`task-info-stacked inline-block due-${this.props.dueType}`}>
                                {dueDateString}
                            </div>
    
                            
                            {/* Delete/Done/Undo Display */}
                            <div className="task-info-stacked inline-block">
                                {/*<Button size="sm" onClick={this.props.deleteTask.bind(this, this.props.task.key)}>
                                    Delete It
                                </Button>*/}
                            {
                                this.props.task.done ?
                                <button className="table-button Low" onClick={this.props.undoTask.bind(this, this.props.task.key)}>
                                    <span className="fas fa-redo"></span>
                                </button> :
                                <button className={`table-button ${this.props.task.priority}`} onClick={this.props.completeTask.bind(this, this.props.task.key)}>
                                    <span className="fas fa-check"></span>
                                </button>
                            }
                            </div>
                        </td>
                    </tr>
                </tbody>
            </Table> 
        </li>
    }
}

export default hot(module)(TaskMobile);