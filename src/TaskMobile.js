import React from 'react';
import { OverlayTrigger, Button, Popover } from 'react-bootstrap';
import { hot } from "react-hot-loader";

function TaskMobile(props) {

    let tagsTitleElement;
    let tagsPillsElement;

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

    return <tr 
        key={props.task.key} 
        className={"mobile-row due-" + props.dueType}
    >
        <td className="mobile-cell">
            <div className="task-info-stacked header">
                {props.task.task}
            </div>

            <div className="task-info-stacked">
                {props.task.notes ?
                    <OverlayTrigger
                        trigger="click"
                        key={props.task.key}
                        placement='auto'
                        overlay={
                        <Popover
                            id={`${props.task.key} Note`}
                            title={`Notes`}
                        >
                            {props.task.notes}
                        </Popover>
                        }
                    >
                        <button className="icon-button"><span className="fas fa-sticky-note"></span></button>
                    </OverlayTrigger> :
                    ""}
            </div>
            
            {tagsTitleElement}
            {tagsPillsElement}
            
            <div className="task-info-title">
            Priority
            </div>
            <div className="task-info-stacked">
                <span className={ "dot " + props.priorityColor }></span>
                {props.task.priority}
            </div>
            
            <div className="task-info-title">
            Due
            </div>
            <div className="task-info-stacked">
                {new Date(props.task.dueDate).toDateString()}
            </div>
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