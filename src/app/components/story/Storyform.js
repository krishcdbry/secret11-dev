import React from 'react';
import {connect} from 'react-redux';
import random from '../../helpers/random';
import { 
    SERVER, 
    STORY_PUBLISH_API, 
    getTokenHeaders 
} from '../../config/network';
import SearchBox from '../widgets/SearchBox';
import {customAlert} from '../../helpers/utils';
import {Link} from 'react-router-dom';

class Storyform extends React.Component {
    constructor(context, props) {
        super(context, props);
        this.state = {
            tags : [],
            tagValue : '',
            question : false,
            story: '',
            qstory: '',
            title : '',
            openSearch: false,
            image : '',
        }
    }

    _resetState() {
        this.setState({
            tags : [],
            tagValue : '',
            question : false,
            story: '',
            qstory: '',
            title : '',
            openSearch: false,
            image : '',
        });
    }

    _handleStoryChange(e) {
        this.setState({
            story: e.target.value
        })
    }

    _handleQStoryChange(e) {
        let val = e.target.value;
        if (val > 250) {
            return false;
        }
        else {
            val = val.substr(0,249);
        }
        this.setState({
            qstory: val
        })
    }

    _handleTitleChange(e) {
        let val = e.target.value;
        if (val > 250) {
            return false;
        }
        else {
            val = val.substr(0,249);
        }
        this.setState({
            title: val
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
            type : 'S',
            tags : this.state.tags.join(","),
            title: this.state.title,
            image : this.state.image
        }

        if (this.state.question) {
            storyData.content = this.state.qstory;
            storyData.type = 'Q';
            delete storyData.title;
        }
        
        fetch(SERVER+STORY_PUBLISH_API, {
            method: 'POST',
            headers: getTokenHeaders(),
            body: JSON.stringify(storyData)
        })
        .then((res) => res.json())
        .then((data) => {
            if (data.success) {
                customAlert("Published");
                this._resetState();
                onSave(data.story);
            }
        })
        .catch((err)=>console.log(err))
    }

    _openSearchBox() {
        let val = !this.state.openSearch;
        this.setState({
            openSearch: val
        })
    }

    _onSelect(val) {
        if (val.length > 0) {
            this.setState({
                image : val,
                openSearch: false
            })
        }
    }
    
    _onClose() {
        this.setState({
            openSearch: false
        })
    }

    _removeImage() {
        this.setState({
            image : ''
        })
    }

    render() {
        let {tags, question, openSearch, image} = this.state;
        let divComponent = [];
        let SearchBoxComponent = null;
        let imageComponent = null;
        let textareaStyle = {
            'height' : 'calc(100vh - 300px)'
        }

        if (image.length > 0) {
            textareaStyle = {
                'height' : 'calc(100vh - 450px)'
            }
        }
        
        if (tags.length > 0) {
            tags.forEach(item => {
                let key = random();
                divComponent.push(
                    <span key={key}>{item}</span>
                )
            })
        }

        let inputClass = "";
        let formInputContent = (
            <div>
                <input type="text"
                    autoFocus="true" 
                    className="story-title" 
                    placeholder="Title (Max 250 Characters)"
                    value={this.state.title}
                    onChange={this._handleTitleChange.bind(this)}
                />
                <textarea placeholder="Start typing" 
                          autoFocus="true" 
                          value={this.state.story}
                          style={textareaStyle}
                          onChange={this._handleStoryChange.bind(this)}></textarea>
            </div>
        );

        if (question) {
            inputClass = "question";
            formInputContent = (
                <textarea placeholder="Start typing  (Max 250 Characters)" 
                          autoFocus="true" 
                          className="question" 
                          style={textareaStyle}
                          value={this.state.qstory}
                          onChange={this._handleQStoryChange.bind(this)}></textarea>
            );
        }

        if (openSearch) {
            SearchBoxComponent = (
                <SearchBox onSelect={this._onSelect.bind(this)} onClose={this._onClose.bind(this)}/>
            )
        }

        if (image.length > 0) {
            imageComponent = (
                <div class="image-item">
                    <img src={this.state.image} style={{
                        'max-height' : '200px' 
                    }}/>
                    <a href="javascript:;" class="close fa fa-remove" onClick={this._removeImage.bind(this)}></a>
                </div>
            )
        }

        return (
            <div className="story-form">
                <br/>
                <div class="question-switcher">
                    <div className="pretty p-icon p-round p-pulse">
                        <input type="checkbox" value={this.state.question} onChange={this._handleQuestionChange.bind(this)}/>
                        <div className="state p-success">
                            <i className="icon mdi mdi-check"></i>
                            <label>Question</label>
                        </div>
                    </div>
                </div>
                {formInputContent}
                {imageComponent}
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
                        <a href="javascript:;" className="select-image" onClick={this._openSearchBox.bind(this)}><i className="fa fa-image"></i></a>
                        
                        <div className="publish-actions">
                            <Link to="/" className="app-button inverse">Cancel</Link>
                            <a href="javascript:;" className="app-button" onClick={this._publishStory.bind(this)}>Publish</a>
                        </div>
                    </div>
                    {SearchBoxComponent}
                </div>
            </div>
        )
    }
}

export default Storyform;