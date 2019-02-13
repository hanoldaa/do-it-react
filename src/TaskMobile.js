import React from 'react';
import { Button } from 'react-bootstrap';
import { hot } from "react-hot-loader";

function TaskMobile(props) {

    let tagsTitleElement;
    let tagsPillsElement;
    let notesElement;

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
            {props.task.notes}
        </div>
    }


    return <tr 
        key={props.task.key} 
        className={"mobile-row due-" + props.dueType}
    >
        <td className="mobile-cell">

            {/* Task Display */}
            <div className="task-info-stacked header">
                {props.task.task}
            </div>

            {/* Notes Display */}
            {notesElement}
            
            {/* Tags Display */}
            {tagsTitleElement}
            {tagsPillsElement}
            
            {/* Priority Display */}
            <div className="task-info-title">
            Priority
            </div>
            <div className="task-info-stacked">
                <span className={ "dot " + props.priorityColor }></span>
                {props.task.priority}
            </div>
            
            {/* Due Date Display */}
            <div className="task-info-title">
            Due
            </div>
            <div className="task-info-stacked">
                {new Date(props.task.dueDate).toDateString()}
            </div>

            
            {/* Delete/Done/Undo Display */}
            <div className="task-info-stacked">
                <Button variant="danger" size="sm" onClick={props.deleteTask.bind(this, props.task.key)}>
                    Delete It
                </Button>
            {
                props.task.done ?
                <Button variant="success" size="sm" onClick={props.undoTask.bind(this, props.task.key)}>
                    Redo It
                </Button> :
                <Button variant="success" size="sm" onClick={props.completeTask.bind(this, props.task.key)}>
                    Did It
                </Button>
            }
            </div>
        </td>
    </tr>
}

export default hot(module)(TaskMobile);