import React from 'react';
import { OverlayTrigger, Tooltip, Popover, Table } from 'react-bootstrap';
import { hot } from "react-hot-loader";

function Task(props) {

    let tagsElement = <td></td>;

    let dueDateString = props.dueDateComparer == props.today ? "Today" :
                        props.dueDateComparer == props.tomorrow ? "Tomorrow" :
                        props.dueDateComparer == props.yesterday ? "Yesterday" :
                        new Date(props.task.dueDate).toLocaleDateString();

    if(props.task.tags){
        tagsElement = <td className="tags float-right"> {props.task.tags.split(',').map(function(t){
            return <span key={t} className="tag-pill" >
                    {t.toLowerCase()}
                </span>})
            }
        </td>
    }
    return <li>
        <Table>
            <tbody>
                <tr 
                    key={props.task.key} 
                    className={"due-" + props.dueType}
                >
                    {
                        props.filter != 'all' ?
                        <td className="row-button">
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
                                <button className="table-button Low" onClick={props.undoTask.bind(this, props.task.key)}>
                                    &#8634;
                                </button> :
                                <button className={`table-button ${props.task.priority}`} onClick={props.completeTask.bind(this, props.task.key)}>
                                    &#10004;
                                </button>
                            }
                            </OverlayTrigger>
                        </td>:
                        ""
                    }
                    <td className="content">
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
                                <button className="icon-button float-right"><span className="fas fa-sticky-note"></span></button>
                            </OverlayTrigger> :
                            ""}
                    </td>
                    {tagsElement}
                    <td className={`due-date ${props.dueType}`}>{dueDateString}</td>
                </tr>
            </tbody>
        </Table>
    </li>
}

export default hot(module)(Task);