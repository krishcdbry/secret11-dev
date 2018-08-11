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
            topic : this.props.topics[1]
        }
    }

    _handleSelectBoxEvent() {
        let selected = document.getElementById('selected');
        let dropdown = document.getElementById('dropdown');

        selected.onclick = () => {
        dropdown.classList.toggle('show');
        }

        dropdown.onclick = (e) => {
            if (e.target.nodeName == 'A') {
                dropdown.classList.toggle('show');
            }
        }
    }

    componentDidMount () {
        this._handleSelectBoxEvent();
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
            topic : this.props.topics[1]
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
            val = val.substr(0,199);
        }
        this.setState({
            qstory: val
        })
    }

    _handleTitleChange(e) {
        let val = e.target.value;
        if (val > 200) {
            return false;
        }
        else {
            val = val.substr(0,199);
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

        console.log("State", this.state);

        let storyData = {
            content : this.state.story,
            type : 'S',
            tags : this.state.tags.join(","),
            title: this.state.title,
            image : this.state.image,
            topic : this.state.topic._id
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

    _selectTopic(topic) {
        this.setState({
            topic : topic
        })
    }

    render() {
        let {tags, question, openSearch, image, topic} = this.state;
        let divComponent = [];
        let dropdownItems = [];
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
                    autoFocus="true"
                    placeholder="Title/Question (Max 250 Characters)"
                    value={this.state.title}
                    onChange={this._handleTitleChange.bind(this)}
                />
                <textarea placeholder="Context"  
                          value={this.state.story}
                          style={textareaStyle}
                          onChange={this._handleStoryChange.bind(this)}></textarea>
            </div>
        );

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
        
        // Dropdown items
        for (let item of this.props.topics) {
            if (item.name != 'Feed') {
                dropdownItems.push(
                    <a href="javascript:;" className="option-item" onClick={() => this._selectTopic(item)}>{item.name}</a>
                )
            }
        }

        return (
            <div className="story-form">
                {/* <div class="question-switcher">
                    <div className="pretty p-icon p-round p-pulse">
                        <input type="checkbox" value={this.state.question} onChange={this._handleQuestionChange.bind(this)}/>
                        <div className="state p-success">
                            <i className="icon mdi mdi-check"></i>
                            <label>Question</label>
                        </div>
                    </div>
                </div> */}
                <div class="selectbox">
                    <span class="selected option-item" id="selected">{topic.name}</span>
                    <div class="dropdown" id="dropdown">
                        {dropdownItems}
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

const mapStateToProps = (state) => {
    return {
        user : state.user,
        topics : state.topics
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
       
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Storyform);
