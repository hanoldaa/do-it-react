import React, { Component } from 'react';
import { OverlayTrigger, Tooltip, Popover, Table } from 'react-bootstrap';
import { hot } from "react-hot-loader";
import './Task.css';

class Task extends Component{

    constructor(props) {
        super(props);

        this.state = {isEditing: false};
    }

    editTask() {
        this.setState({isEditing: true});
    }

    render() {
        let tagsElement = <td></td>;

        let dueDateString = this.props.dueDateComparer == this.props.today ? "Today" :
                            this.props.dueDateComparer == this.props.tomorrow ? "Tomorrow" :
                            this.props.dueDateComparer == this.props.yesterday ? "Yesterday" :
                            new Date(this.props.task.dueDate).toLocaleDateString();

        if(this.props.task.tags){
            tagsElement = <td className="tags"> {this.props.task.tags.split(',').map(function(t){
                return <span key={t} className="tag-pill" >
                        {t.toLowerCase()}
                    </span>})
                }
            </td>
        }

        return <li>
            <Table className="desktop">
                <tbody>
                    <tr 
                        key={this.props.task.key} 
                        className={"due-" + this.props.dueType}
                    >
                        {
                            this.props.filter != 'all' ?
                            <td className="task-button">
                                <OverlayTrigger
                                    key={this.props.task.key}
                                    placement='top'
                                    delay='500'
                                    overlay={
                                    <Tooltip id={`${this.props.task.key} Done`}>
                                        { this.props.task.done ? "Redo it!" : "Did it!" }
                                    </Tooltip>
                                    }
                                >
                                {
                                    this.props.task.done ?
                                    <button className="table-button Low" onClick={this.props.undoTask.bind(this, this.props.task.key)}>
                                        &#8634;
                                    </button> :
                                    <button className={`table-button ${this.props.task.priority}`} onClick={this.props.completeTask.bind(this, this.props.task.key)}>
                                        <span className="fas fa-check"></span>
                                    </button>
                                }
                                </OverlayTrigger>
                            </td>:
                            ""
                        }
                        <td className="content">
                            <span className="expand-height">{this.props.task.task}</span>
                            {this.props.task.notes ?
                                <OverlayTrigger
                                    trigger="focus"
                                    key={this.props.task.key}
                                    placement='auto'
                                    overlay={
                                    <Popover
                                        className="notes-popover"
                                        id={`${this.props.task.key} Note`}
                                        title={`Notes`}
                                        variant="dark"
                                    >
                                        {this.props.task.notes}
                                    </Popover>
                                    }
                                >
                                    <button className="notes-button"><span className="fas fa-sticky-note"></span></button>
                                </OverlayTrigger> :
                                ""}
                        </td>
                        {tagsElement}
                        <td className={`due-date ${this.props.dueType}`}>{dueDateString}</td>
                        <td>
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
                        </td>
                    </tr>
                </tbody>
            </Table>
        </li>
    }
}

export default hot(module)(Task);