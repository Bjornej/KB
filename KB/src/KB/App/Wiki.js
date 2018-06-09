import React, { Component } from "react";
import { withRouter } from 'react-router'
import reqwest from "reqwest";
import showdown from "showdown";

var converter = new showdown.Converter({
    tables: true,
    emoji: true,
    metadata:true
});

class Container extends Component {
    constructor(props) {
        super(props);
        this.state = {
            edit: false,
            text: null
        };
        this.load(this.props.params.splat);
    }

    load = (url) => {
        reqwest({
            url: 'Docs/Read?path='+ url,
            type: 'json',
            method: 'get',
            contentType: 'application/text',
            success: (res) => {
                this.setState({ text: res })
            }
        })
    }

    componentWillReceiveProps = ({ params }) => {
        if (params.splat != this.props.params.splat) {
            this.load(params.splat);
        }
    }

    render() {
        return <div className="page">
            <div className="page__content" dangerouslySetInnerHTML={{ __html: converter.makeHtml(this.state.text)}}/>
        </div>;
    } 
}

export default withRouter(Container);