import React from 'react';
import {connect} from 'react-redux';
import random from '../../helpers/random';
import {Link} from 'react-router-dom';
import { customAlert, modalToggle } from '../../helpers/utils';
import { 
    SERVER,
    STORY_REPLY_PUBLISH_API,
    STORY_REPLY_GET_API,
    STORY_UPVOTE_API,
    STORY_DOWNVOTE_API,

    getTokenHeaders
} from '../../config/network';


class StoryitemMini extends React.Component {
    constructor(context, props) {
        super(context, props);
        this.state = {
            story : this.props.story,
            openInput : false,
            reply: "",
            replyData : [],
            voting: false,
            fullStory: (this.props.full) ? true : false,
            expandImage : false
        }
    }

    _storyVoteProcessed(vote) {
        let {story} = this.state;
        let newStory = Object.assign({}, story);
        newStory.upvote = vote;
        this.setState({
            story: newStory,
            voting: false
        })
    }

    _voted() {
        let {user} = this.props;
        
        if (!user) {
            modalToggle();
            return;
        }

        let {story, voting} = this.state;
        let {upvote} = story;
        if (voting) {
            return;
        }

        this.setState({
            voting: true
        })

        if (!upvote.voted) {
        fetch(SERVER+STORY_UPVOTE_API, {
            method: 'POST',
            headers: getTokenHeaders(),
            body: JSON.stringify({"story": story.id})
        })
        .then(res => res.json())
        .then(res => {
            if (res.success) {
                this._storyVoteProcessed(res.upvote)
                //voted(newStory);
            }
        })
        .catch((err)=>console.log(err))
        }
        else {

        fetch(SERVER+STORY_DOWNVOTE_API+story.id, {
            method: 'DELETE',
            headers: getTokenHeaders()
        })
        .then(res => res.json())
        .then(res => {
            if (res.success) {
                this._storyVoteProcessed(res.upvote);
            }
        })
        .catch((err)=>console.log(err))

        }
    }

    _showFullStory() {
        this.setState({
            fullStory: true
        })
    }

    _expandToggleImage(e) {
        let expand = this.state.expandImage;
        this.setState({
            expandImage : !expand
        })
    }

    render() {
        let {story, fullStory, expandImage} = this.state;
        let storyClass = "story-item story-item-mini";
        let questionIndicator = null;
        let storyTagsContent = [];
        let voteClass = "fa fa-heart-o";
        let inputHandler = null;
        let replyContent = [];
        let profileLink = "/"+story.author.username;
        let storyTitleContent = null;
        let upvoteCountContent = null;
        let storyImageComponent = null;
        let displayStoryComponent = null;
        let expandImageComponent = null;
        let imageComponent = null;
        let storyValue = story.content.trim();
        let expandClass = "";
        let url = "";
        let textLength = 150;
        let imageClass = "";
        let storyStyleComponent = {};
        let trimmedStory = "";
        let imageStyle = {
            'max-height': '200px',
            'float' : 'right',
            'max-width' : '95%'
        }

        if (expandImage) {
            expandClass = "expand-image";
        }

        if (story.url) {
            url = "/story/"+story.url;
        }

        if (story.image.length > 3) {
            imageComponent = (
                <div className="image-component">
                    <img src={story.image}/>
                </div>
            )
            imageClass = "with-image";
            textLength = 100;
        }

        if (storyValue.length > textLength && !fullStory) {
            trimmedStory = storyValue.substr(0, textLength) + '...';
        }
        else {
            trimmedStory = storyValue;
        }

        displayStoryComponent = (
            <div style={storyStyleComponent} className={imageClass}>
                {trimmedStory}
            </div>
        )

        let optionContent = (
            <Link to={url} className="reply">
                <a href="javascript:;">
                    <i className="fa fa-comment-o"></i>
                </a> 
                <span className="count">{story.reply.count}</span>
            </Link>
        )

        if (story.tags.length > 0) {
            story.tags.forEach(item => {
                let key = random();
                let link = "/tag/"+item.name;
                storyTagsContent.push(
                    <Link to={link} key={key} className="tag"><span>{item.name}<span className="count">{item.count}</span></span></Link>
                )
            });
        }

        if (story.upvote.voted) {
            voteClass = "fa fa-heart voted";
        }

        if (story.title) {
            if (story.title.length > 0) {
                storyTitleContent = (
                    <Link to={url}>
                        <div className="story-title">
                            {story.title.trim()}
                        </div>
                    </Link>
                )
            }
        }

        //if(story.upvote.count > 0) {
            upvoteCountContent = (
                <a href="javascript:;" className="reply" onClick={this._voted.bind(this)}>  
                    <a href="javascript:;">
                        <i className={voteClass}></i>
                    </a>
                    <span className="count">{story.upvote.count} </span>
                </a>
            )
        //}
        
        return (
            <div className={storyClass}>
                {questionIndicator}
                <div className="topic-tag">
                    {story.topic.name}
                </div>
                <div className="story-data">
                    <div className="title-section">
                        {storyTitleContent}
                        <div class="author-section">
                            <Link to={profileLink}>
                                <img className="author" src={story.author.image}/> {story.author.username}
                            </Link>
                        </div>
                    </div>
                
                    <div className="context-section">
                        <div class="story-context text-content">
                            {displayStoryComponent}
                            {imageComponent}
                        </div>
                    </div>
                </div>
                <div className="story-options">
                        <div class="stats">
                            {upvoteCountContent}
                            {optionContent}
                        </div>
                </div>
                <div className="timestamp">{story.timestamp}</div>
            </div>
        )
    }
}

export default StoryitemMini;