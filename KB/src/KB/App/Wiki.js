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


// Get the top position of an element in the document
var getTop = function (element) {
    // return value of html.getBoundingClientRect().top ... IE : 0, other browsers : -pageYOffset
    if (element.nodeName === 'HTML') return -window.pageYOffset
    return element.getBoundingClientRect().top + window.pageYOffset;
}
// ease in out function thanks to:
// http://blog.greweb.fr/2012/02/bezier-curve-based-easing-functions-from-concept-to-implementation/
var easeInOutCubic = function (t) { return t < .5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1 }

// calculate the scroll position we should be in
// given the start and end point of the scroll
// the time elapsed from the beginning of the scroll
// and the total duration of the scroll (default 500ms)
var position = function (start, end, elapsed, duration) {
    if (elapsed > duration) return end;
    return start + (end - start) * easeInOutCubic(elapsed / duration); // <-- you can change the easing funtion there
    // return start + (end - start) * (elapsed / duration); // <-- this would give a linear scroll
}

// we use requestAnimationFrame to be called by the browser before every repaint
// if the first argument is an element then scroll to the top of this element
// if the first argument is numeric then scroll to this location
// if the callback exist, it is called when the scrolling is finished
// if context is set then scroll that element, else scroll window 
var smoothscroll = function (el, duration, callback, context, offsetTop) {
    duration = duration || 500;
    context = context || window;
    var start = window.pageYOffset;

    if (typeof el === 'number') {
        var end = parseInt(el);
    } else {
        var end = getTop(el);
    }
    end -= offsetTop || 0;

    if (context != null) {
        start += context.scrollTop;
        end += context.scrollTop;
    }

    var clock = Date.now();
    var requestAnimationFrame = window.requestAnimationFrame ||
        window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame ||
        function (fn) { window.setTimeout(fn, 15); };

    var step = function () {
        var elapsed = Date.now() - clock;
        if (context !== window) {
            context.scrollTop = position(start, end, elapsed, duration);
        }
        else {
            window.scroll(0, position(start, end, elapsed, duration));
        }

        if (elapsed > duration) {
            if (typeof callback === 'function') {
                callback(el);
            }
        } else {
            requestAnimationFrame(step);
        }
    }
    step();
}



function extractSections(text) {
    if (text == null) { return []; }
    var span = document.createElement('span');
    span.innerHTML = text;
    var titles = span.querySelectorAll("h2");
    return [].slice.call(titles).map(x => x.textContent);
}


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
                Path: window.location.hash.replace("#", ""),
                Content: text
            }),
            success: (res) => {

                this.setState({ edit: false });
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

    scrollTo = (target) => {
        var titles = Array.from(document.querySelectorAll("h2"));
        var titolo = titles.filter(x => x.textContent == target);

        if (titolo.length > 0) {
            debugger;
            smoothscroll(titolo[0], 500, null, document.getElementsByClassName("application__mainBody")[0]);
        }
    }

    render() {
        const titles = extractSections(this.state.convertedText);

        return <div className={this.state.edit ? "page page--edit" : "page"}>
            <h2 className="page__title">{this.state.title} <button className="button__undo" onClick={this.edit}>{this.state.edit ? "Save" : "Modify"}</button> </h2>
            {this.state.edit ?
                <MonacoEditor
                    language="markdown"
                    value={this.state.text}
                    options={{ wordWrap: "on", minimap: { enabled: false } }}
                    onChange={(e) => this.setState({ text: e })}
                />
                :
                <div>
                    {titles.length > 1 && <div className="page__index">
                        {titles.map(x => <div onClick={() => this.scrollTo(x)}>{x}</div>)}
                    </div>}
                    <div className="page__content" dangerouslySetInnerHTML={{ __html: this.state.convertedText }} onClick={this.handleClick} />
                </div>
            }
        </div>;
    }
}

export default withRouter(Container);