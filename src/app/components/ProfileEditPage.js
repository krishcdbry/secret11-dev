import React from 'react';
import {connect} from 'react-redux';
import Header from './common/Header';
import { 
    USER_PROFILE_API, 
    SERVER,
    USER_PROFILE_EDIT_API,
    getTokenHeaders
} from '../config/network';
import Profilepicedit from './profile/Profilepicedit';
import {customAlert} from '../helpers/utils';
import {Link} from 'react-router-dom';

class ProfileEditPage extends React.Component {
    constructor(context, props) {
        super(context, props);
        let {username, description, image, gender} = this.props.user;
        this.state = {
            user: this.props.user,
            username,
            description,
            image,
            gender,
            choosePics: false
        }
    }

    _changeImage(image) {
        this.setState({
            image
        })
    }

    _genderInputHandler(e) {
         this.setState({
             gender: e.target.value
         })
    }

    _usernameInputHandler(e) {
        this.setState({
            username : e.target.value
        })
    }

    _descriptionInputHandler(e) {
        this.setState({
            description : e.target.value
        })
    }

    _saveProfile() {
        let {username, gender, description, image} = this.state;
        let imgArray = image.split("/");
        let imageSrc = imgArray[imgArray.length-1];
        
        let updateUser = {
            username,
            gender,
            description,
            image : imageSrc
        }
        
        fetch(SERVER+USER_PROFILE_EDIT_API, {
            "method" : "PUT",
            "headers" : getTokenHeaders(),
            "body" : JSON.stringify(updateUser)
        })
        .then(res => res.json())
        .then(res => {
            if (res.success) {
                customAlert("Saved")
            }
        }, err=> console.log(err));
    }

    componentDidMount() {
       // this._loadUser(this.props.userHandle);
    }

    _activateChoosePic() {
        let choosePics = !this.state.choosePics;
        this.setState({
            choosePics
        })
    }

    render() {
        let {user} = this.props;

        let profilePicSelectComponent = null;

        if (this.state.choosePics){
            profilePicSelectComponent = (
                <div className="pic-selection-box">
                     <a href="javascript:;" 
                            className="app-button inverse"
                            onClick={this._activateChoosePic.bind(this)}>Close</a>

                    <Profilepicedit onsave={this._changeImage.bind(this)}/>
                </div>
            )
        }
        else {
            profilePicSelectComponent = (
                <a href="javascript:;" 
                            className="app-button inverse"
                            onClick={this._activateChoosePic.bind(this)}>Choose pic</a>

            )
        }
    
        let profileLink = "/"+user.username;
        
        return (
            <div className="home">
                <div className="home-content">
                    <div className="profile-edit-component">
                    <div className="profile-save-options">
                        <a href="javascript:;" className="app-button" onClick={this._saveProfile.bind(this)}>Save</a>
                        <Link to={profileLink} className="app-button inverse">Cancel</Link>
                    </div>
                    <div className="profile-info">
                        <img src={this.state.image} className="profile-pic-big"/>
                        <div className="change-pic">
                            <br/>
                            {profilePicSelectComponent}
                            <br/><br/>
                        </div>
                        <input type="text" 
                               className="username-edit" 
                               value={this.state.username}
                               onChange={this._usernameInputHandler.bind(this)} />

                        <textarea 
                               placeholder="Describe yourself.."
                               className="description-edit" 
                               value={this.state.description}
                               onChange={this._descriptionInputHandler.bind(this)} />
                    </div>
                    
                    <div className="gender">
                            <div className="pretty p-icon p-round p-pulse">
                                <input type="radio" 
                                    value="male"
                                    name="gender"
                                    onChange={this._genderInputHandler.bind(this)}
                                    checked={this.state.gender=="male"}/>
                                <div className="state p-success">
                                    <i className="icon mdi mdi-check"></i>
                                    <label>Male</label>
                                </div>
                            </div>
                            <div className="pretty p-icon p-round p-pulse">
                                <input type="radio" 
                                    value="female" 
                                    name="gender"
                                    onChange={this._genderInputHandler.bind(this)}
                                    checked={this.state.gender=="female"}/>
                                <div className="state p-success">
                                    <i className="icon mdi mdi-check"></i>
                                    <label>Female</label>
                                </div>
                            </div>
                            <div className="pretty p-icon p-round p-pulse">
                                <input type="radio" 
                                    value="other" 
                                    name="gender"
                                    onChange={this._genderInputHandler.bind(this)}
                                    checked={this.state.gender=="other"}/>
                                <div className="state p-success">
                                    <i className="icon mdi mdi-check"></i>
                                    <label>Other</label>
                                </div>
                            </div>
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

export default connect(mapStateToProps, mapDispatchToProps)(ProfileEditPage);