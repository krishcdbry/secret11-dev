import React from 'react';
import {connect} from 'react-redux';
import Storyitem from './Storyitem';
import { SERVER, STORY_FEED_API, getTokenHeaders } from '../../config/network';
import { createActionOnStoryFeedLoaded } from '../../actions/actions';
import random from '../../helpers/random';

class Storyfeed extends React.Component {
    constructor(context, props) {
        super(context, props);
        this.state = {
            storyfeed : this.props.storyfeed
        }
    }

    _voted(id) {
        console.log("Voted", id);
    }

    componentDidMount() {
        let {onStoryFeedLoaded} = this.props;

        fetch(SERVER+STORY_FEED_API, {
            headers : getTokenHeaders()
        })
        .then(res => res.json())
        .then(res => {
            onStoryFeedLoaded(res._embedded);
        })
    }

    render() {
        let {storyfeed} = this.props;
        let key = random();
        let feedComponent = [
            <div key={key}>
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
                    <Storyitem story={item} key={key}/>
                )
            })
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
        storyfeed : state.storyfeed
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