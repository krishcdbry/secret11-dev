import React from 'react';
import {connect} from 'react-redux';
import random from '../../helpers/random';
import { 
    SERVER, 
    STORY_PUBLISH_API, 
    getTokenHeaders 
} from '../../config/network';
import {customAlert} from '../../helpers/utils';

class Storyform extends React.Component {
    constructor(context, props) {
        super(context, props);
        this.state = {
            tags : [],
            tagValue : '',
            question : false,
            story: '',
            title : ''
        }
    }

    _resetState() {
        this.setState({
            tags : [],
            tagValue : '',
            question : false,
            story: ''
        });
    }

    _handleStoryChange(e) {
        this.setState({
            story: e.target.value
        })
    }

    _handleTitleChange(e) {
        this.setState({
            title: e.target.value
        })
    }
    
    _handleTagChange(e) {
        let val = e.target.value.trim();
        let regex = /^[0-9a-zA-Z_]{0,}$/;
        if (regex.test(val)) {
            this.setState({
                tagValue: val
            })
        }
    }

    _handleQuestionChange(e) {
        this.setState({
            question: e.target.checked
        })
    }

    _addTags(e) {
        let val = e.target.value.trim();
        let {tags} = this.state;

        if (e.keyCode == 8 && val.length == 0) {
            tags.pop();
            this.setState({
                tags: tags,
                tagValue: ""
            })
        }

        if ((e.keyCode == 13 || e.keyCode == 32) && val.length > 0) {
            if (tags.indexOf(val) == -1) {
                tags.push(val);
            }
            this.setState({
                tags: tags,
                tagValue: ""
            })
        }
    }

    _publishStory() {
        let {onSave} = this.props;
        let storyData = {
            content : this.state.story,
            type : (this.state.question) ? 'Q' : 'S',
            tags : this.state.tags.join(",")
        }

        if (!this.state.question) {
            storyData.title = this.state.title;
        }
        
        fetch(SERVER+STORY_PUBLISH_API, {
            method: 'POST',
            headers: getTokenHeaders(),
            body: JSON.stringify(storyData)
        })
        .then((res) => res.json())
        .then((data) => {
            if (data.success) {
                customAlert("Published")
                onSave(data.story)
                this._resetState();
            }
        })
        .catch((err)=>console.log(err))
    }
    
    render() {
        let {tags} = this.state;
        let divComponent = [];
        
        if (tags.length > 0) {
            tags.forEach(item => {
                let key = random();
                divComponent.push(
                    <span key={key}>{item}</span>
                )
            })
        }

        let inputClass = "";
        let titleInputContent = (
            <input type="text"
                   autoFocus="true" 
                   className="story-title" 
                   placeholder="Title"
                   value={this.state.title}
                   onChange={this._handleTitleChange.bind(this)}
            />
        );

        if (this.state.question) {
            inputClass = "question";
            titleInputContent = null;
        }

        return (
            <div className="story-form">
                <br/>
                <div className="pretty p-icon p-round p-pulse">
                    <input type="checkbox" value={this.state.question} onChange={this._handleQuestionChange.bind(this)}/>
                    <div className="state p-success">
                        <i className="icon mdi mdi-check"></i>
                        <label>Question</label>
                    </div>
                </div>
                {titleInputContent}
                <textarea placeholder="Start typing" 
                          autoFocus="true" 
                          className={inputClass} 
                          value={this.state.story}
                          onChange={this._handleStoryChange.bind(this)}></textarea>
                <div className="section-other">
                    <div className="tag-input">
                        {divComponent}
                        <input type="text" 
                            placeholder="Tag"
                            value={this.state.tagValue}
                            onKeyDown={this._addTags.bind(this)} 
                            onChange={this._handleTagChange.bind(this)}/>
                    </div>
                    <div className="publish-section">
                        <a href="javascript:;" className="app-button" onClick={this._publishStory.bind(this)}>Publish</a>
                    </div>
                </div>
            </div>
        )
    }
}

export default Storyform;