import React from 'react';
import {connect} from 'react-redux';
import Header from './common/Header';
import { 
    USER_PROFILE_API, 
    SERVER,
    getTokenHeaders,
    USER_FOLLOW_API,
    USER_UNFOLLOW_API
} from '../config/network';
import { createActionUserLoggedOut, createActionStoryPublished } from '../actions/actions';
import Storyfeed from './story/Storyfeed';
import Storyform from './story/Storyform';
import NotFound from './404';
import {customAlert} from '../helpers/utils';
import Profilefeed from './profile/Profilefeed';
import { Route, Link, Switch, Redirect } from 'react-router-dom';

class ProfilePage extends React.Component {
    constructor(context, props) {
        super(context, props);
        this.state = {
            user: this.props.user,
            profile : null,
            invalidProfile : false
        }
    }

    _loadUser(user) {
        fetch(SERVER+USER_PROFILE_API+user, {
            headers: getTokenHeaders()
        })
        .then(res => res.json())
        .then(res => {
            if (res.success) {
                this.setState({
                    profile : res.user
                })
            }
            else {
                this.setState({
                    invalidProfile: true
                })
            }
        }, err => {
            this.setState({
                invalidProfile: true
            })
        })
    }

    _profileLoaded(user) {
        this.setState({
            profile : user
        })
    }

    _followUser() {
        let {user} = this.props;
        let {id, username} = this.state.profile;
        let userBody = {
            user : id
        }
        fetch(SERVER+USER_FOLLOW_API, {
            headers: getTokenHeaders(),
            method : "POST",
            body : JSON.stringify(userBody)
        })
        .then(res => res.json())
        .then(res => {
            if (res.success) {
                this._loadUser(username);
            }
        }, err => {
           // Error
        })
    }

    _unfollowUser() {
        let {user} = this.props;
        let {id, username} = this.state.profile;
  
        fetch(SERVER+USER_UNFOLLOW_API+id, {
            headers: getTokenHeaders(),
            method : "DELETE",
        })
        .then(res => res.json())
        .then(res => {
            if (res.success) {
                this._loadUser(username);
            }
        }, err => {
           // Error
        })
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        if(nextProps.userHandle != prevState.user.username) {
            return {
                profile : null
            }
        }
        return null;
    }

    componentDidMount() {
        this._loadUser(this.props.userHandle);
    }

    componentDidUpdate(prevProps){
        if (prevProps.userHandle != this.props.userHandle) {
            this._loadUser(this.props.userHandle);
        }
    }

    render() {
        let {profile, invalidProfile} = this.state;

        let homeContent = null;
        let profileFeedComponent = null;
        let profileEditContent = null;
        let profileOptionsComponent = null;

        if (profile) {
            profileFeedComponent = (
                <Profilefeed id={profile.id}/>
            )

            if (profile.username == this.props.user.username) {
                profileEditContent = (
                    <div className="profile-edit-option">
                            <Link to="/profile/edit" className="app-button inverse">Edit</Link>
                    </div>
                )
            }
            else {
                if (!profile.follower.following) {
                    profileOptionsComponent = (
                        <div className="follow-options">
                            <a href="javascript:;" class="app-button" onClick={this._followUser.bind(this)}>Follow</a>
                        </div>
                    )
                }
                else {
                    profileOptionsComponent = (
                        <div className="follow-options">
                            <a href="javascript:;" class="app-button inverse" onClick={this._unfollowUser.bind(this)}>Following</a>
                        </div>
                    )
                }
            }
        }

        if (profile) {
            homeContent = (
                <div className="home-content">
                    <div className="tag-block">
                        <div className="profile-info">
                            {profileEditContent}
                            <br/>
                            <img src={profile.image} className="profile-pic-big"/>
                            <h1>{profile.username}</h1>
                            <div class="description">
                                {profile.description}
                            </div>
                            <div className="profile-stats">
                                <div className="stats-item story">
                                    <span className="count">{profile.stats.story}</span>
                                    <span className="title">Stories</span>
                                </div>
                                <div className="stats-item reply">
                                    <span className="count">{profile.stats.reply}</span>
                                    <span className="title">Replies</span>
                                </div>
                                <div className="stats-item follower">
                                    <span className="count">{profile.follower.count}</span>
                                    <span className="title">Followers</span>
                                </div>
                            </div>
                            {profileOptionsComponent}
                        </div>
                        <div className="">
                           {profileFeedComponent}
                        </div>
                    </div>
                    <div className="right-menu">
                        <div className="user-suggestions">
                            <img src="/bucket/profile/user-profile-1.png"/>
                            <img src="/bucket/profile/user-profile-2.png"/>
                            <img src="/bucket/profile/user-profile-3.png"/>
                            <img src="/bucket/profile/user-profile-4.png"/>
                            <img src="/bucket/profile/user-profile-5.png"/>
                            <img src="/bucket/profile/user-profile-6.png"/>
                        </div>
                   </div>
                </div>
            )
        }

        if (invalidProfile) {
            homeContent = (
                <NotFound/>
            )
        }

        return (
            <div className="home">
                <Header/>
                {homeContent}
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

export default connect(mapStateToProps, mapDispatchToProps)(ProfilePage);