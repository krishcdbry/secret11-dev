import React from 'react';
import {connect} from 'react-redux';
import random from '../../helpers/random';
import {Link} from 'react-router-dom';
import { customAlert } from '../../helpers/utils';
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
    
    _openInput () {
        if (this.state.story.type == 'Q') {
            //this._loadAnswers();
            this._loadReplies();
        }
        else {
            this._loadReplies();
        }
        let open = !this.state.openInput;
        this.setState({
            openInput: open
        })
    }

    _handleReplyChange(e) {
        this.setState({
            reply: e.target.value
        })
    }

    _resetReply(){
        this.setState({
            reply: ""
        })
    }

    _sendReply() {
        let {reply, story} = this.state;

        if (reply.length > 0) {
            
            let replyData = {
                content : reply,
                story : story.id
            }

            fetch(SERVER+STORY_REPLY_PUBLISH_API, {
                method: 'POST',
                headers: getTokenHeaders(),
                body: JSON.stringify(replyData)
            })
            .then((res) => res.json())
            .then((data) => {
                if (data.success) {
                    this._resetReply();
                    this._loadReplies(1);
                }
            })
            .catch((err)=>console.log(err))
        }
    }

    _loadReplies(force=false) {
        let {id} = this.state.story;

        if (this.state.replyData.length < 1 || force) {

            fetch(SERVER+STORY_REPLY_GET_API+id, {
                headers: getTokenHeaders(),
            })
            .then((res) => res.json())
            .then((data) => {
                if (data.success) {
                    this.setState({
                        replyData: data._embedded
                    })
                }
            })
            .catch((err)=>console.log(err))
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
        let {story, voting} = this.state;
        let {upvote} = story;
       // let {voted} = this.props;
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
        let storyValue = story.content.trim();
        let expandClass = "";
        let url = "";
        let spanImageClass = "";
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

        if (storyValue.length > 90 && !fullStory) {
            trimmedStory = storyValue.substr(0, 90) + '...';
        }
        else {
            trimmedStory = storyValue;
        }

        if (story.image) {
            if (story.image.length > 0) {
                storyStyleComponent = {
                    'backgroundImage' : 'url('+story.image+')',
                    'backgroundSize' : 'cover'
                }

                spanImageClass = "span-image";

                displayStoryComponent = (
                    <span style={storyStyleComponent} className={spanImageClass}>
                        <span class="text-main-content">
                            {trimmedStory}
                            <Link to={url} className="view-more">View more</Link>
                        </span>
                        <span class="text-wrapper"></span>
                    </span>
                )
            }
            else {
                displayStoryComponent = (
                    <span style={storyStyleComponent} className={spanImageClass}>
                        {storyValue}
                    </span>
                )
            }
        }

        let optionContent = (
            <a href="javascript:;" className="reply" onClick={this._openInput.bind(this)}>Reply 
                <span className="count">{story.reply.count} </span>
            </a>
        )

        if (story.type == "Q") {
            storyClass += " question";
            questionIndicator = (
                <div className="question-indicator">Q</div>
            )
            optionContent = (
                <a href="javascript:;" className="reply" onClick={this._openInput.bind(this)}>Answer 
                    <span className="count">{story.answer.count} </span>
                </a>
            )

            let url = "/story/"+story.url;

            displayStoryComponent = (
                <Link to={url}>
                     <span>
                        {storyValue}
                    </span>
                </Link>
            )
        }

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

        if (this.state.openInput) {
            inputHandler = (
                <div className="reply-compose">
                     <textarea 
                          placeholder="Start typing.." 
                          autoFocus="true" 
                          value={this.state.reply}
                          onChange={this._handleReplyChange.bind(this)}></textarea>
                        
                    <a href="javascript:;" className="app-button" onClick={this._sendReply.bind(this)}>Send</a>
                </div>
            );
        }

        this.state.replyData.map(item => {
            let key = random()
            let profileLink = "/"+item.user.username;
            replyContent.push(
                <div className="reply-item" key={key}>
                        <div className="reply-user">
                            <Link to={profileLink}><img src={item.user.image}/></Link>
                            <span className="timestamp">{item.timestamp}</span>
                        </div>
                        <div className="reply-content">
                            <Link to={profileLink}>
                                <span className="username">{item.user.username}</span>
                            </Link>
                            <span className="reply">{item.reply}</span>
                        </div>
                </div>
            )
        })

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

        if(story.upvote.count > 0) {
            upvoteCountContent = (
                <Link to={url} className="reply">Likes <span className="count">{story.upvote.count} </span>
                </Link>
            )
        }
        
        return (
            <div className={storyClass}>
                {questionIndicator}
                <div className="voting">
                    <a href="javascript:;" onClick={this._voted.bind(this)}>
                        <i className={voteClass}></i>
                    </a>
                </div>
                <div className="user-info">
                    <Link to={profileLink}>
                        <img className="author" src={story.author.image}/>
                    </Link>
                </div>
                <div className="story-data">
                    <div className="text-content">
                        {storyTitleContent}
                        {displayStoryComponent}
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