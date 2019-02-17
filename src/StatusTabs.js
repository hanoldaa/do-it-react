import React from 'react';
import { hot } from 'react-hot-loader';
import { Tabs, Tab } from 'react-bootstrap';
import './StatusTabs.css';

function StatusTabs(props) {
    return <Tabs
        id="tasks-filter-tab"
        activeKey={props.status}
        onSelect={status => props.onSelect({ status })}
    >
        <Tab eventKey="to-do" title="To Do"> </Tab>
        <Tab eventKey="done" title="Done"> </Tab>
        <Tab eventKey="all" title="All"> </Tab>
    </Tabs>
}

export default hot(module)(StatusTabs);
