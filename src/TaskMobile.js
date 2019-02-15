import React from 'react';
import { Table, Button } from 'react-bootstrap';
import { hot } from "react-hot-loader";

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
            {props.task.notes}
        </div>
    }


    return<li>
        <Table className={`mobile ${props.dueType}`}>
            <tbody>
                <tr 
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
                        
                        {/* Due Date Display */}
                        <div className="task-info-title">
                        Due
                        </div>
                        <div className="task-info-stacked inline-block">
                            {dueDateString}
                        </div>

                        
                        {/* Delete/Done/Undo Display */}
                        <div className="task-info-stacked inline-block">
                            <Button size="sm" onClick={props.deleteTask.bind(this, props.task.key)}>
                                Delete It
                            </Button>
                        {
                            props.task.done ?
                            <Button className="Low" size="sm" onClick={props.undoTask.bind(this, props.task.key)}>
                                Redo It
                            </Button> :
                            <Button className={props.task.priority} size="sm" onClick={props.completeTask.bind(this, props.task.key)}>
                                Did It
                            </Button>
                        }
                        </div>
                    </td>
                </tr>
            </tbody>
        </Table> 
    </li>
}

export default hot(module)(TaskMobile);