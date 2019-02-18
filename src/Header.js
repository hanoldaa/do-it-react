import React, { Component } from "react";
import { hot } from "react-hot-loader";
import fire from './fire';
import firebase from 'firebase';
import './Header.css';
import { Navbar, Nav } from 'react-bootstrap';
import { withRouter } from 'react-router-dom';

class Header extends Component {

    constructor(props) {
        super(props);

        this.state = ({user: fire.auth().currentUser});
        this.onLogin = this.onLogin.bind(this);
        this.migrateAnonymousTasks = this.migrateAnonymousTasks.bind(this);
    }

    homeClicked() {
        this.props.history.push('/');
    }

    onLogin() {
        var provider = new firebase.auth.GoogleAuthProvider();

        fire.auth().currentUser.linkWithPopup(provider).then((result) => {

            // The firebase.User instance:
            var user = result.user;
            this.setState({user: user});

        }, (error) =>  {
            // Account already linked, force sign in
            if(error.code=="auth/credential-already-in-use"){
                var prevUser = fire.auth().currentUser;

                fire.auth().signInAndRetrieveDataWithCredential(error.credential).then(() => {
                    this.migrateAnonymousTasks(prevUser, fire.auth().currentUser);
                    console.log("logging in to: ", fire.auth().currentUser);
                    this.setState({user: fire.auth().currentUser});
                // User re-authenticated.
                }).catch((error) => {
                    console.log("failed to re-authenticate", error);
                    // An error happened.
                });
    
            }
        });
    }

    migrateAnonymousTasks(anonUser, newUser) {
        let tasksRef = fire.database().ref('tasks');

        tasksRef.once("value", snapshot => {
            let tasks = [];

            // Get each task
            snapshot.forEach(childSnapshot => {
                // Only add task if it belongs to the current user
                if(childSnapshot.val().user == anonUser.uid){
                    var task = childSnapshot.val();
                    console.log("migrating: ", task);
                    task.user = newUser.uid;
                    tasks = [task].concat(tasks);
                }
            })

            let updates = {};
            tasks.forEach(task => {
                updates['/tasks/' + task.key] = task;
            });
        
            // Add task to database
            fire.database().ref().update(updates);
        });
    }

    onLogout() {
        fire.auth().signOut().then(() => {
            this.setState({user: null});
          }).catch(function(error) {
            // An error happened.
          });
    }

    render(){

        let authButton;
        
        if(this.state.user && !this.state.user.isAnonymous){
            authButton = <button onClick={this.onLogout.bind(this)}>Logout</button>
        }
        else{
            authButton = <button className="has-logo" onClick={this.onLogin.bind(this)}>Login</button>
        }

        return (
            <div className="page-header">
                <span>Do It</span>
                {authButton}
            </div>
        );
    }
}
export default hot(module)(withRouter(Header));