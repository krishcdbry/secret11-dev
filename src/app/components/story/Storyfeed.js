import React from 'react';
import {connect} from 'react-redux';
import StoryitemMini from './StoryitemMini';
import { SERVER, STORY_FEED_API, STORY_FEED_BY_TOPIC, getTokenHeaders } from '../../config/network';
import { createActionOnStoryFeedLoaded } from '../../actions/actions';
import random from '../../helpers/random';
import { getIndexOfkey } from '../../helpers/utils';

class Storyfeed extends React.Component {
    constructor(context, props) {
        super(context, props);
        this.state = {
            storyfeed : this.props.storyfeed,
            topic : this.props.topic
        }
    }

    _voted(id) {
        console.log("Voted", id);
    }

    componentDidMount() {
        this._loadFeed()
    }

    _loadFeed() {
        let {onStoryFeedLoaded, topic} = this.props;
        let api = SERVER+STORY_FEED_API;
        if (topic) {
            let idx = getIndexOfkey(this.props.topics, {"name" : topic});
            let topicId = this.props.topics[idx]._id;
            api = SERVER+STORY_FEED_BY_TOPIC+topicId;
        }
        fetch(api, {
            headers : getTokenHeaders()
        })
        .then(res => res.json())
        .then(res => {
            //onStoryFeedLoaded(res._embedded);
            this.setState({
                storyfeed : res._embedded
            })
        })
    }

    componentDidUpdate(prevProps){
        if (prevProps.topic != this.props.topic) {
            this._loadFeed();
        }
    }

    render() {
        let {storyfeed} = this.state;
        let key = random();
        let feedComponent = [
            <div key={key} className="feed-loader">
                <br/><br/><br/>
                <div className="spinner">
                    <div className="bounce1"></div>
                    <div className="bounce2"></div>
                    <div className="bounce3"></div>
                </div>
            </div>
        ];

        if (storyfeed.length > 0) {
            feedComponent = [];
            storyfeed.forEach(item => {
                let key = random();
                feedComponent.push(
                    <StoryitemMini story={item} key={key}/>
                )
            })
        }
        else {
            feedComponent = (
                <div className="no-content"><h2>No content</h2></div>
            )
        }

        return (
            <div className="storyfeed">
                {feedComponent}
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        storyfeed : state.storyfeed,
        topics : state.topics
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        onStoryFeedLoaded : (feed) => {
            dispatch(createActionOnStoryFeedLoaded(feed))
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Storyfeed);