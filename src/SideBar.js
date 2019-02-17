import React, { Component } from 'react';
import { hot } from 'react-hot-loader';
import Collapsible from 'react-collapsible';
import './SideBar.css';

class SideBar extends Component {

    constructor(props) {
        super(props);

        this.state = {
            tagsFilterOpen: true,
            selectedTags: []
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

    render() {
        const tagElements = this.props.uniqueTags.map(tag => {

            var tagActive = this.state.selectedTags.indexOf(tag) >= 0 ? "active" : "";
            
            return <div key={tag} className={`tag-filter-toggle ${tagActive}`} onClick={this.onTagFilterClicked.bind(this, tag)} >
                <span className={`dot ${tagActive}`} onClick={this.onTagFilterClicked.bind(this, tag)}></span> {tag.charAt(0).toUpperCase() + tag.slice(1)}
            </div>
        });

        

        return <div className="side-bar">
                <div className="tags-foldout">
                    <Collapsible trigger="Tags">
                        {tagElements}
                    </Collapsible>
            </div>
        </div>
    }
}

export default hot(module)(SideBar);
