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



function rel_to_abs(url, base_url) {
    /* Only accept commonly trusted protocols:
     * Only data-image URLs are accepted, Exotic flavours (escaped slash,
     * html-entitied characters) are not supported to keep the function fast */
    if (/^(https?|file|ftps?|mailto|javascript|data:image\/[^;]{2,9};):/i.test(url))
        return url; //Url is already absolute

    if (url.substring(0, 2) == "//")
        return location.protocol + url;
    else if (url.charAt(0) == "/")
        return location.protocol + "//" + location.host + url;
    else if (url.substring(0, 2) == "./")
        url = "." + url;
    else if (/^\s*$/.test(url))
        return ""; //Empty = Return nothing
    else url = "../" + url;

    url = base_url + url;
    var i = 0
    while (/\/\.\.\//.test(url = url.replace(/[^\/]+\/+\.\.\//g, "")));

    /* Escape certain characters to prevent XSS */
    url = url.replace(/\.$/, "").replace(/\/\./g, "").replace(/"/g, "%22")
        .replace(/'/g, "%27").replace(/</g, "%3C").replace(/>/g, "%3E");
    return url;
}

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
                var html = converter.makeHtml(res)
                var meta = converter.getMetadata();
                var base = window.location.hash.replace("#", "");
                base = base.substring(0, base.lastIndexOf("\\"))
                console.log(base);
                html = html.replace(/(<img *src=")(?!http:\/\/)(.*?)"/g, "$1/Repository" + base + "/$2\"");

                //changes images relative urls
                this.setState({ text: res, convertedText: html, title: meta.title });
            }
        })
    }

    save = (text) => {
        debugger;
        reqwest({
            url: 'Docs/Save'
  , type: 'json'
  , method: 'post'
  , contentType: 'application/json',
            data: JSON.stringify({
                Path: window.location.hash.replace("#",""),
                Content: text
            }),
            success: (res) => {

                this.setState({ edit:false});
            }
        })
    }

    edit = () => {
        if (this.state.edit) {
            this.save(this.state.text);
        } else {
            this.setState({ edit: true });
        }
    }

    componentWillReceiveProps = ({ params }) => {
        if (params.splat != this.props.params.splat) {
            this.load(params.splat);
        }
    }

    handleClick = (e) => {
        if (e.target.tagName == "A") {
            debugger;
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
                <div className="page__content" dangerouslySetInnerHTML={{ __html: this.state.convertedText }} onClick={this.handleClick} />
            }
        </div>;
    }
}

export default withRouter(Container);