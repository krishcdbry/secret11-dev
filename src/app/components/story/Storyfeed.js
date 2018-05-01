import React from 'react';
import {connect} from 'react-redux';
import Storyitem from './Storyitem';
import { SERVER, STORY_FEED_API } from '../../config/network';
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
        let _token = localStorage.getItem('x-access-token');
        let authHeaders = new Headers();
        authHeaders.append('x-access-token' , _token);

        fetch(SERVER+STORY_FEED_API, {
            headers : authHeaders
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
                <i className="fa fa-spinner fa-pulse fa-3x fa-fw loading"></i>
            </div>
        ];

        if (storyfeed.length > 0) {
            feedComponent = [];
            storyfeed.forEach(item => {
                let key = random();
                feedComponent.push(
                    <Storyitem story={item} voted={this._voted.bind(this)} key={key}/>
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