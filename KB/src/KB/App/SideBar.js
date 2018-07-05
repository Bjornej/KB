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

class Item extends Component {
    constructor() {
        super();
        this.state = { showMenu: false, type: 0, showName: false, page: "" }
    }

    componentDidMount() {
        document.addEventListener('click', this.handleClickOutside, true);
    }

    componentWillUnmount() {
        document.removeEventListener('click', this.handleClickOutside, true);
    }

    askForName = (type) => {
        this.setState({ showMenu: false, showName: true, type: type })
    }

    handleClickOutside = (e) => {
        const domNode = this.__domNode;
        if (
            (!domNode || !domNode.contains(e.target))
        ) {
            this.setState({ showMenu : false })
        }
    }

    create = () => {
        if (this.state.page == "") {
            return;
        }

        var pageToCreate = window.location.hash.replace("#", "");
        if (this.state.type == 1) {
            pageToCreate = pageToCreate.substring(0, pageToCreate.lastIndexOf("\\")) + "\\" + this.state.page + ".md";
        } else {
            pageToCreate = pageToCreate.substring(0, pageToCreate.lastIndexOf(".md")) + "\\" + this.state.page + ".md";
        }

        reqwest({
            url: 'Docs/CreatePage'
            , type: 'json'
            , method: 'post'
            , contentType: 'application/json',
            data: JSON.stringify({
                Path: pageToCreate
            }),
            success: (res) => {
                this.setState({ showName:false, page:"" })
                this.props.reload();
            }
        })
    }


    render = () => {
        const { description, file, childrens, reload } = this.props;

        return <div className="sidebar__item">
            <div className={isCurrent(file) ? "sidebar__link sidebar__link--current" : "sidebar__link"}
                onClick={() => navigate(file)}
                ref={c => {
                    this.__domNode = c;
                }}
                onContextMenu={(e) => { e.preventDefault(); this.setState({ showMenu: !this.state.showMenu }) }}
            ><span>{description}</span>
                {this.state.showMenu && <div className="sidebar_menu">
                    <div className="sidebar__menu__item" onClick={() => this.askForName(1)}>New Page</div>
                    <div className="sidebar__menu__item" onClick={() => this.askForName(2)}>New Sub Page</div>
                </div>}
            </div>

            {this.state.showName && <div className="dialog">
                <div className="dialog__body">
                    <input placeholder="Insert the name of the new page" onChange={(e) => this.setState({ page: e.target.value })} />
                    <button className="button button__undo" onClick={() => this.setState({ showName: false })} > Cancel</button>
                    <button className="button button__confirm" onClick={this.create}>Create</button>
                </div>
            </div>}

            <div className={isOpen(file) ? "sidebar__subItem sidebar__subItem--open" : "sidebar__subItem"}>
                {childrens.map((x, i) => <Item key={i} reload={reload} description={x.description} file={x.entry} childrens={x.childrens || []} />)}
            </div>
        </div>
    }
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
            {this.state.pages.map((x, i) => <Item key={i} reload={this.loadIndex} description={x.description} file={x.entry} childrens={x.childrens || []} />)}
        </div>;
    }
}

export default withRouter(SideBar);