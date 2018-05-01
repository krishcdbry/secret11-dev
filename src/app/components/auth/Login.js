import React from 'react';
import {connect} from 'react-redux';
import { createActionUserLoggedIn } from '../../actions/actions';
import { SERVER, USER_LOGIN_API } from '../../config/network';
import {customAlert} from '../../helpers/utils'


class Login extends React.Component {
    constructor(context, props) {
        super(context, props);

        this.state = {
            username : "",
            password: "",
            gender: ""
        }
    }

    _usernameInputHandler(e) {
        this.setState({
            username: e.target.value
        })
    }

    _passwordInputHandler(e) {
        this.setState({
            password: e.target.value
        })
    }

    _login() {
        let {userLoggedIn} = this.props;
        let userData = {
            username : this.state.username,
            password : this.state.password
        }
        fetch(SERVER+USER_LOGIN_API, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
             },
            body: JSON.stringify(userData)
        })
        .then((res) => res.json())
        .then((data) =>  {
            if (data.auth)  {
                document.body.className = "home";
                userLoggedIn(data.userData, data.token);
                customAlert("Welcome! <br/> "+ data.userData.username);
            }
            else {
                // alert(data.message);
            }
        })
        .catch((err)=>console.log(err))
    }

   
    render() {

        return (
            <div className="signup-component">
                <img src="https://assistance-wordpress.com/wp-content/uploads/2018/02/icon-account.png"/>
                <div className="signup-item input">
                    <label>Username</label>
                    <input type="text" value={this.state.username} onChange={this._usernameInputHandler.bind(this)} autoComplete="off"/>
                </div>
                <div className="signup-item input">
                    <label>Password</label>
                    <input type="password" value={this.state.password} onChange={this._passwordInputHandler.bind(this)} autoComplete="new-password"/>
                </div>
                <div className="signup-item">
                    <a href="javascript:;" onClick={this._login.bind(this)} className="notify-btn">Sign up</a>
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
        userLoggedIn : (user, token) => {
            dispatch(createActionUserLoggedIn(user, token));   
        }
    }
} 

export default connect(mapStateToProps, mapDispatchToProps)(Login);