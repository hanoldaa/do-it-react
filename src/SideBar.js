import React, { Component } from 'react';
import { hot } from 'react-hot-loader';
import Collapsible from 'react-collapsible';
import './SideBar.css';

class SideBar extends Component {

    constructor(props) {
        super(props);

        this.state = {
            tagsFilterOpen: true,
            selectedTags: [],
            sortKey: '',
            sortDescending:'descending',
            statusKey: 'to-do'
        };
    }

    onTagFilterClicked(tag) {
        var selectedTags = this.state.selectedTags;
        if(selectedTags.indexOf(tag) >= 0) {
            selectedTags.splice(selectedTags.indexOf(tag), 1);
            this.setState({selectedTags: selectedTags});
        }
        else{
            selectedTags.push(tag);
            this.setState({selectedTags: selectedTags});
        }

        this.props.onUpdateTags(this.state.selectedTags);
    }

    onSortOptionClicked(sortKey){

        if(this.state.sortKey == sortKey){
            if(this.state.sortDescending == 'descending')
                this.setState({sortKey: sortKey, sortDescending: 'ascending'});
            else
                this.setState({sortKey: sortKey, sortDescending: 'descending'});
        }
        else{
            this.setState({sortKey: sortKey, sortDescending: 'descending'});
        }

        this.props.onUpdateSortKey(sortKey);
    }

    onStatusToggleClicked(statusKey) {
        this.setState({statusKey: statusKey});

        this.props.onUpdateStatus(statusKey);
    }


    render() {
        const tagElements = this.props.uniqueTags.map(tag => {

            var tagActive = this.state.selectedTags.indexOf(tag) >= 0 ? "active" : "";
            
            return <div key={tag} className={`tag-filter-toggle ${tagActive}`} onClick={this.onTagFilterClicked.bind(this, tag.toLowerCase())} >
                <span className={`dot ${tagActive}`} onClick={this.onTagFilterClicked.bind(this, tag)}></span> {tag.charAt(0).toUpperCase() + tag.slice(1)}
            </div>
        });

        return <div className="side-bar">
        <div className="status-foldout">
            <Collapsible trigger="Status"
                triggerDisabled={true}
                open={true}>
                <div className={`status-toggle ${this.state.statusKey=="to-do" ? "active" : ""}`} 
                    onClick={this.onStatusToggleClicked.bind(this, 'to-do')}>
                    To Do
                </div>
                <div className={`status-toggle ${this.state.statusKey=="done" ? "active" : ""}`} 
                    onClick={this.onStatusToggleClicked.bind(this, 'done')} >
                    Done
                </div>
                <div className={`status-toggle ${this.state.statusKey=="all" ? "active" : ""}`} 
                    onClick={this.onStatusToggleClicked.bind(this, 'all')} >
                    All
                </div>
            </Collapsible>
        </div>
        <div className="sort-foldout">
            <Collapsible trigger="Sorting">
                <div className={`sort-toggle due ${this.state.sortKey == 'dueDate' ? 'active ' + this.state.sortDescending : 'inactive'}`}
                     onClick={this.onSortOptionClicked.bind(this, 'dueDate')}>
                    Due Date
                </div>
                <div className={`sort-toggle priority ${this.state.sortKey == 'priority' ? 'active ' + this.state.sortDescending : 'inactive'}`}
                     onClick={this.onSortOptionClicked.bind(this, 'priority')}>
                    Priority
                </div>
                <div className={`sort-toggle task ${this.state.sortKey == 'task' ? 'active ' + this.state.sortDescending : 'inactive'}`}
                     onClick={this.onSortOptionClicked.bind(this, 'task')}>
                    Task Name
                </div>
            </Collapsible>
        </div>
            <div className="tags-foldout">
                <Collapsible trigger="Tags">
                    {tagElements}
                </Collapsible>
            </div>
        </div>
    }
}

export default hot(module)(SideBar);
