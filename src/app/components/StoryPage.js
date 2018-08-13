import React from 'react';
import {connect} from 'react-redux';
import random from '../helpers/random';
import Header from './common/Header';
import { 
    getTokenHeaders,
    SERVER, 
    TAG_INFO_API,
    TAG_LIST_API,
    TAG_FOLLOW_API,
    TAG_UNFOLLOW_API,
    STORY_ITEM_API
} from '../config/network';
import { createActionUserLoggedOut, createActionStoryPublished } from '../actions/actions';
import Storyfeed from './story/Storyfeed';
import Storyform from './story/Storyform';
import {customAlert} from '../helpers/utils';
import Tagfeed from './tag/Tagfeed';
import {Link} from 'react-router-dom';
import Storyitem from './story/Storyitem';
import NotFound from './404';
import ShareBox from './widgets/ShareBox';

class TagPage extends React.Component {
    constructor(context, props) {
        super(context, props);
        this.state = {
            story: null,
            url : this.props.storyUrl,
            invalidStory: false,
            tags : [],
            loading : false
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

    _loadData(key) {
        this.setState({
            loading : true
        })
        
        let postBody = {
            url : key
        }
        fetch(SERVER+STORY_ITEM_API, {
                method : "POST",
                headers: getTokenHeaders(),
                body : JSON.stringify(postBody)
            })
            .then(res => {
                return res.json();
            })
            .then(res => {
                if (res.success) {
                    this.setState({
                        story: res._embedded,
                        loading : false
                    })
                }
                else {
                    this.setState({
                        invalidStory: true,
                        story: null,
                        loading : false
                    })
                }
            }, err => {
                //
            })
    }

    componentDidMount() {
        this._loadData(this.props.storyUrl);
       // this._loadTagList();
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        if(nextProps.storyUrl != prevState.url) {
            return {
                url : nextProps.storyUrl,
            }
        }
        return null;
    }

    componentDidUpdate(prevProps){
        if (prevProps.storyUrl != this.props.storyUrl) {
            this._loadData(this.props.storyUrl);
        }
    }

    render() {
        let {url, story, invalidStory, loading} = this.state;
        let storyItemComponent = null;
        let tagInfoContent = null;
        let tagsComponent = [];
        let homeComponent = null;

        this.state.tags.map(item => {
            let key = random();
            let link = "/tag/"+item.name;
            tagsComponent.push(
                <Link to={link} key={key} className="tag">
                    {item.name} <span className="count">{item.count}</span>
                </Link>
            )
        })

        tagInfoContent = (
            <div>
                <h1>{this.props.storyUrl}</h1>
            </div>
        );

        if (!loading) {
            if (!invalidStory && story) {
                storyItemComponent = (
                    <Storyitem story={story} full={true}/>
                );

                let title = (story.type == "Q") ? story.content : story.title;
                let metaData = document.getElementsByTagName('meta');
                for (var l = 0; l < metaData.length; l++) {
                    if(metaData[l].name == "description") {  
                        window.document.title = title;
                        metaData[l].content = title; 
                    }
                }
    
                homeComponent = (
                    <div className="tag-content home-content">
                            <div className="tag-block">
                                <div className="">
                                    {storyItemComponent}
                                </div>
                            </div>
                            <div className="right-menu">
                                {/* <ShareBox/> */}
                                <div className="story-tags suggestion">
                                        {/* {tagsComponent} */}
                                    <Storyfeed topic={story.topic.name} fullStory={true}/>
                                </div>
                           </div>
                        </div>
                )
            }
            else {
                homeComponent = (
                    <NotFound/>
                )
            }
        }

        return (
            <div className="home">
                {homeComponent}
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