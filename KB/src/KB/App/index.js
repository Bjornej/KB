import React from "react";
import { render } from 'react-dom'
import { Router, Route, IndexRoute, Link, hashHistory } from 'react-router';
import Container from "./Container";
import Wiki from "./Wiki";

debugger;
render((
    <Router history={hashHistory}>
        <Route path="*" component={Container}>
            <IndexRoute component={Wiki} />
        </Route>
    </Router>
), document.getElementById("container"))