import React from "react";
import ReactDOM from "react-dom";
import App from "./app";

const el = document.createElement("div");
document.body.append(el);

ReactDOM.render(React.createElement(App, null, null), el);
