import React from "react";
import ReactDOM from "react-dom";
import Header from "./Header.js";
import NewTask from "./NewTask.js";
import 'bootstrap/dist/css/bootstrap.css';

ReactDOM.render(<Header />, document.getElementById("header"));
ReactDOM.render(<NewTask />, document.getElementById("root"));