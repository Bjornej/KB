import React, { Component } from "react";
import { withRouter } from 'react-router'
import reqwest from "reqwest";
import showdown from "showdown";
import MonacoEditor from 'react-monaco-editor';

var converter = new showdown.Converter({
    tables: true,
    emoji: true,
    metadata: true
});

class Container extends Component {
    constructor(props) {
        super(props);
        this.state = {
            edit: false,
            text: null,
            convertedText: null,
            title: null
        };
        this.load(this.props.params.splat);
    }

    load = (url) => {
        reqwest({
            url: 'Docs/Read?path=' + url,
            type: 'json',
            method: 'get',
            contentType: 'application/text',
            success: (res) => {
                debugger;
                var html = converter.makeHtml(res)
                var meta = converter.getMetadata();
                this.setState({ text: res, convertedText: html, title: meta.title });
            }
        })
    }

    save = (text) => {

    }

    edit = () => {
        if (this.state.edit) {
            this.state.save(this.state.text);
        } else {
            this.setState({ edit: true });
        }
    }

    componentWillReceiveProps = ({ params }) => {
        if (params.splat != this.props.params.splat) {
            this.load(params.splat);
        }
    }

    render() {
        return <div className="page">
            <h2 className="page__title">{this.state.title} <button onClick={this.edit}>{this.state.edit ? "Save" : "Modify"}</button> </h2>
            {this.state.edit ?
                <MonacoEditor
                    language="markdown"
                    value={this.state.text}
                    onChange={(e) => this.setState({ text: e })}
                />
                :
                <div className="page__content" dangerouslySetInnerHTML={{ __html: this.state.convertedText }} />
            }
        </div>;
    }
}

export default withRouter(Container);