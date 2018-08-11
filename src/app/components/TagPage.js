import React from 'react';
import {connect} from 'react-redux';
import random from '../helpers/random';
import Header from './common/Header';
import MainMenu from './common/MainMenu';
import { 
    SERVER, 
    TAG_INFO_API,
    TAG_LIST_API,
    getTokenHeaders,
    TAG_FOLLOW_API,
    TAG_UNFOLLOW_API
} from '../config/network';
import { createActionUserLoggedOut, createActionStoryPublished } from '../actions/actions';
import Storyfeed from './story/Storyfeed';
import Storyform from './story/Storyform';
import {customAlert} from '../helpers/utils';
import Tagfeed from './tag/Tagfeed';
import {Link} from 'react-router-dom';
import ShareBox from './widgets/ShareBox';

class TagPage extends React.Component {
    constructor(context, props) {
        super(context, props);
        this.state = {
            tag: null,
            name : this.props.tag,
            invalidTag: false,
            tags : []
        }
    }

    _loadTagList() {
        fetch(SERVER+TAG_LIST_API, {
            headers : getTokenHeaders()
        })
        .then(res => res.json())
        .then(res => {
            this.setState({
                tags : res._embedded
            })
        })
    }

    _loadData(tag) {
        fetch(SERVER+TAG_INFO_API+tag, {
                headers: getTokenHeaders()
            })
            .then(res => {
                return res.json();
            })
            .then(res => {
                if (res.success) {
                    this.setState({
                        tag: res.tag
                    })
                }
                else {
                    this.setState({
                        invalidTag: true
                    })
                }
            }, err => {
                
            })
    }

    _followTag() {
        let {id, name} = this.state.tag;
        let storyTag = {
            tag : id
        }
        fetch(SERVER+TAG_FOLLOW_API, {
            method: 'POST',
            headers: getTokenHeaders(),
            body: JSON.stringify(storyTag)
        })
        .then(res => {
            return res.json();
        })
        .then(res => {
            if (res.success) {
                this._loadData(name);
            }
        }, err => {
            // Error
        })
    }

    _unfollowTag() {
        let {tag} = this.state;
        let {id, name} = tag;
        fetch(SERVER+TAG_UNFOLLOW_API+id, {
            method: 'DELETE',
            headers: getTokenHeaders(),
        })
        .then(res => {
            return res.json();
        })
        .then(res => {
            if (res.success) {
                this._loadData(name);
            }
        }, err => {
            // Error
        })
    }

    componentDidMount() {
        this._loadData(this.props.tag);
        this._loadTagList();
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        if(nextProps.tag != prevState.name) {
            return {
                name : nextProps.tag,
            }
        }
        return null;
    }

    componentDidUpdate(prevProps){
        if (prevProps.tag != this.props.tag) {
            this._loadData(this.props.tag);
        }
    }

    render() {
        let {user} = this.props;
        let {tag, invalidTag} = this.state;
        let tagStats = null;
        let count = 0;
        let tagFeedComponent = null;
        let tagInfoContent = null;
        let tagOptionsComponent = null;
        
        let tagsComponent = [];

        this.state.tags.map(item => {
            let key = random();
            let link = "/tag/"+item.name;
            tagsComponent.push(
                <Link to={link} key={key} className="tag">
                    {item.name} <span className="count">{item.count}</span>
                </Link>
            )
        })

        if (tag) {
            count =  tag.stories;
            tagFeedComponent = (
                <Tagfeed id={tag.id}/>
            )

            tagInfoContent = (
                <div>
                     <h1>{this.props.tag}</h1>
                     <span className="count">
                         {count} Stories | {tag.follower.count} Followers
                    </span>
                </div>
            )

            if (!tag.follower.following) {
                tagOptionsComponent = (
                    <div className="tag-options">
                        <a href="javascript:;" class="app-button" onClick={this._followTag.bind(this)}>Follow</a>
                    </div>
                )
            }
            else {
                tagOptionsComponent = (
                    <div className="tag-options">
                        <a href="javascript:;" class="app-button inverse" onClick={this._unfollowTag.bind(this)}>Following</a>
                    </div>
                )
            }

            let title = this.props.tag
            let metaData = document.getElementsByTagName('meta');
            for (var l = 0; l < metaData.length; l++) {
                if(metaData[l].name == "description") {  
                    window.document.title = title;
                    metaData[l].content = title; 
                }
            }
        }

        if (invalidTag) {
            tagInfoContent = (
                <div>
                     <h1>{this.props.tag} - Not found</h1>
                </div>
            )
        }

        return (
            <div className="home">
                <Header/>
                <div className="tag-content home-content">
                    <div className="tag-block">
                        <div className="tag-info">
                            {tagInfoContent}
                            {tagOptionsComponent}
                        </div>
                        <div className="">
                           {tagFeedComponent}
                        </div>
                    </div>
                    <div className="right-menu">
                        <ShareBox/>
                        <div className="story-tags suggestion">
                                {tagsComponent}
                        </div>
                   </div>
                </div>
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        user : state.user
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
       
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(TagPage);