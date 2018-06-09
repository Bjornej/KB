import React, { Component } from "react";
import Sidebar from "./Sidebar";
import SideBar from "./Sidebar";

class Container extends Component {
    render() {
        return <div>
            <div className="application__sidebar">
                <SideBar />
            </div>
            <div className="application__mainBody">
                {this.props.children}
            </div>
        </div>;
    }
}

export default Container;