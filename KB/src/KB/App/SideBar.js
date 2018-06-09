import React, { Component } from "react";
import reqwest from "reqwest";
import { withRouter } from 'react-router'

const navigate = (url) => {
    window.location.href = "#/" + url;
}

const isCurrent = (file) => {
    return window.location.hash == "#/" + file;
}

const isOpen = (file) => {
    return window.location.href.indexOf(file.replace(".md", "")) != -1;
}

const Item = ({ description, file, childrens }) => {
    return <div className="sidebar__item">
        <div className={isCurrent(file) ? "sidebar__link sidebar__link--current" : "sidebar__link"} onClick={() => navigate(file)}>{description}</div>
        <div className={isOpen(file) ? "sidebar__subItem sidebar__subItem--open" : "sidebar__subItem"}>
            {childrens.map((x, i) => <Item key={i} description={x.description} file={x.entry} childrens={x.childrens || []} />)}
        </div>
    </div>
};

class SideBar extends Component {
    constructor() {
        super();
        this.state = {
            pages: []
        }

        this.loadIndex();
    }

    loadIndex = () => {
        reqwest({
            url: 'Docs/GetStructure',
            type: 'json',
            method: 'get',
            contentType: 'application/json',
            success: (res) => {
                this.setState({ pages: res.childrens })
            }
        })
    }

    render() {
        return <div className="sidebar">
            {this.state.pages.map((x, i) => <Item key={i} description={x.description} file={x.entry} childrens={x.childrens || []} />)}
        </div>;
    }
}

export default withRouter(SideBar);