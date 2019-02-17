import React, { Component } from "react";
import { hot } from "react-hot-loader";
import Header from "./Header.js";
import Main from "./Main.js";
import fire from "./fire.js";

class App extends Component {

    constructor(props) {
        super(props);
        this.state = {user: null};
    }

    componentWillMount() {
        fire.auth().onAuthStateChanged(user => {
            if (user) {
                this.setState({user: user});
                if(user.isAnonymous)
                    console.log("Authenticated anonymously");
                else
                    console.log("Authenticated");
            } else {
                console.log("Unauthenticated. Signing in anonymously...");
                fire.auth().signInAnonymously().catch(function(error) {
                    // Handle Errors here.
                    var errorCode = error.code;
                    var errorMessage = error.message;
                    // ...
                    if(errorMessage){
                        console.log("Failed to sign in anonymously");
                        console.log(errorMessage);
                    }

                    this.setState({user: fire.auth().currentUser});
                });
            }
        });
    }

    render(){
        let header;
        let main;

        if(this.state.user){
            header = <Header />;
            main = <Main />;
        }

        return (
            <div className="app">
            {header}
            {main}
            </div>
        );
    }
}
export default hot(module)(App);