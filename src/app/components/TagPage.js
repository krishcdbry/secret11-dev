import React from 'react';
import {connect} from 'react-redux';
import Header from './common/Header';
import { 
    SERVER, 
    TAG_INFO_API,
    getTokenHeaders
} from '../config/network';
import { createActionUserLoggedOut, createActionStoryPublished } from '../actions/actions';
import Storyfeed from './story/Storyfeed';
import Storyform from './story/Storyform';
import {customAlert} from '../helpers/utils';
import Tagfeed from './tag/Tagfeed';
import {Link} from 'react-router-dom';

class TagPage extends React.Component {
    constructor(context, props) {
        super(context, props);
        this.state = {
            tag: null,
            name : this.props.tag,
            invalidTag: false
        }
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

    componentDidMount() {
        this._loadData(this.props.tag);
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
        
        if (tag) {
            count =  tag.stories;
            tagFeedComponent = (
                <Tagfeed id={tag.id}/>
            )

            tagInfoContent = (
                <div>
                     <h1>{this.props.tag}</h1>
                     <span className="count">
                         {count} Items
                    </span>
                </div>
         )
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
                        </div>
                        <div className="">
                           {tagFeedComponent}
                        </div>
                    </div>
                    <div className="right-menu">
                        <div className="story-tags suggestion">
                                <Link to="Sex" className="tag">
                                    <span>Technology <span className="count">45</span> </span>
                                </Link>
                                <Link to="Sex" className="tag">
                                    <span>Sex <span className="count"> 23 </span></span>
                                </Link>
                                <Link to="Sex" className="tag">
                                    <span>Education <span className="count"> 12</span></span>
                                </Link>
                                <Link to="Sex" className="tag">
                                    <span>Funy <span className="count"> 11</span></span>
                                </Link>
                                <Link to="Sex" className="tag">
                                    <span className="tag">Funy <span className="count"> 11</span></span>
                                </Link>
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