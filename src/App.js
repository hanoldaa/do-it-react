import React from "react";
import { hot } from "react-hot-loader";
import Header from "./Header.js";
import Main from "./Main.js";

function App() {
    return (
        <div>
            <Header />
            <Main />
        </div>
    );
}
export default hot(module)(App);