﻿import React, { Component } from "react";

class Container extends Component {
    render(){
        return <div>
            <h1>Wiki</h1>
            <div>{this.props.children}</div>
        </div>;
    } 
}

export default Container;