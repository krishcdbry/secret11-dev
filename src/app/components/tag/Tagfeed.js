import React from 'react';
import {connect} from 'react-redux';
import Storyitem from '../story/Storyitem';
import { 
    SERVER,
    STORY_FEED_API, 
    TAG_FEED_API,
    getTokenHeaders
} from '../../config/network';
import random from '../../helpers/random';

class Tagfeed extends React.Component {
    constructor(context, props) {
        super(context, props);
        this.state = {
            storyfeed: null
        }
    }

    _voted(id) {
        console.log("Voted", id);
    }

    componentDidMount() {
        this._loadFeed(this.props.id);
    }

    _loadFeed(id) {
        fetch(SERVER+TAG_FEED_API+id, {
            headers : getTokenHeaders()
        })
        .then(res => res.json())
        .then(res => {
           this.setState({
               storyfeed: res._embedded
           })
        })
    }
    
    componentDidUpdate(prevProps){
        if (prevProps.id != this.props.id) {
            this._loadFeed(this.props.id);
        }
    }

    render() {
        let {storyfeed} = this.state;
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

        if (storyfeed) {
            feedComponent = [];
            if (storyfeed.length > 0) {
                storyfeed.forEach(item => {
                    let key = random();
                    feedComponent.push(
                        <Storyitem story={item} voted={this._voted.bind(this)} key={key}/>
                    )
                })
            }
        }
        

        return (
            <div className="storyfeed">
                {feedComponent}
            </div>
        )
    }
}


export default Tagfeed;