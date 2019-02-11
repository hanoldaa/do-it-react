import React from 'react';
import { OverlayTrigger, Tooltip, Popover } from 'react-bootstrap';
import { hot } from "react-hot-loader";

function Task(props) {

    let tagsElement = <td></td>;

    if(props.task.tags){
        tagsElement = <td> {props.task.tags.split(',').map(function(t){
            return <span key={t} className="tag-pill" >
                    {t.toLowerCase()}
                </span>})
            }
        </td>
    }
    return <tr 
        key={props.task.key} 
        className={"due-" + props.dueType}
    >
    <td className="hidden-column">
        {
            props.filter != 'all' ?
            <div className="row-button">
                <OverlayTrigger
                    key={props.task.key}
                    placement='top'
                    delay='500'
                    overlay={
                    <Tooltip id={`${props.task.key} Done`}>
                        { props.task.done ? "Redo it!" : "Did it!" }
                    </Tooltip>
                    }
                >
                {
                    props.task.done ?
                    <button className="icon-button" onClick={props.undoTask.bind(this, props.task.key)}>
                        <span className="fas fa-undo-alt"></span>
                    </button> :
                    <button className="icon-button" onClick={props.completeTask.bind(this, props.task.key)}>
                        <span className="fas fa-check-circle"></span>
                    </button>
                }
                </OverlayTrigger>
            </div>:
            ""
        }
        <div className="row-button">
            <OverlayTrigger
                key={props.task.key}
                placement='top'
                delay='500'
                overlay={
                <Tooltip id={`${props.task.key} Delete`}>
                    Delete it!
                </Tooltip>
                }
            >
                <button className="icon-button" onClick={props.deleteTask.bind(this, props.task.key)}>
                    <span className="fas fa-times-circle"></span>
                </button>
            </OverlayTrigger>
        </div>
    </td>
    <td>
        {props.task.task}
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
        </td>
    {tagsElement}
    <td>
        <span className={ "dot " + props.priorityColor }></span>
        {props.task.priority}
    </td>
    <td>{new Date(props.task.dueDate).toDateString()}</td>
    </tr>
}

export default hot(module)(Task);