import React from 'react';
import { Table, Button } from 'react-bootstrap';
import { hot } from "react-hot-loader";
import './TaskMobile.css';

function TaskMobile(props) {

    let tagsTitleElement;
    let tagsPillsElement;
    let notesElement;

    let dueDateString = props.dueDateComparer == props.today ? "Today" :
                        props.dueDateComparer == props.tomorrow ? "Tomorrow" :
                        props.dueDateComparer == props.yesterday ? "Yesterday" :
                        new Date(props.task.dueDate).toLocaleDateString();

    if(props.task.tags){
        tagsTitleElement = <div className="task-info-title">
            Tags
        </div>

        tagsPillsElement = <div className="task-info-stacked">
        {
            props.task.tags.split(',').map(function(t){
            return <span key={t} className="tag-pill" >
                    {t.toLowerCase()}
                </span>})
        }
        </div>
    }

    if(props.task.notes){
        notesElement = <div className="task-info-stacked no-indent">
            <span className="expand-height">{props.task.notes}</span>
        </div>
    }


    return<li>
        <Table className="mobile">
            <tbody>
                <tr 
                    key={props.task.key} 
                    className={"mobile-row"}
                >
                    <td className="mobile-cell">

                        {/* Task Display */}
                        <div className="task-info-stacked header">
                            <span className="expand-height">{props.task.task}</span>
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
                        <div className={`task-info-stacked inline-block due-${props.dueType}`}>
                            {dueDateString}
                        </div>

                        
                        {/* Delete/Done/Undo Display */}
                        <div className="task-info-stacked inline-block">
                            {/*<Button size="sm" onClick={props.deleteTask.bind(this, props.task.key)}>
                                Delete It
                            </Button>*/}
                        {
                            props.task.done ?
                            <button className="table-button Low" onClick={props.undoTask.bind(this, props.task.key)}>
                                <span className="fas fa-redo"></span>
                            </button> :
                            <button className={`table-button ${props.task.priority}`} onClick={props.completeTask.bind(this, props.task.key)}>
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

export default hot(module)(TaskMobile);