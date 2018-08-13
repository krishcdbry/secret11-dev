import React from 'react';
import {connect} from 'react-redux';
import { createActionUserLoggedIn } from '../../actions/actions';
import { SERVER, USER_LOGIN_API } from '../../config/network';
import {customAlert, modalToggle} from '../../helpers/utils'


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

    _login(e) {
        e.preventDefault();
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
            if (data.success)  {
                document.body.className = "home";
                userLoggedIn(data.userData, data.token);
                customAlert("Welcome! <br/> "+ data.userData.username);
                modalToggle();
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
               {/* <div className="component-info">
                    Secret 11
               </div> */}
               <div className="component-content">
                    <form onSubmit={this._login.bind(this)}>
                        <div className="signup-item input">
                            <input type="text" placeholder=" " value={this.state.username} onChange={this._usernameInputHandler.bind(this)} autoComplete="off"/>
                            <label><span className="fa fa-user"></span> <span className="hint">Username</span></label>
                        </div>
                        <div className="signup-item input">
                            <input type="password" placeholder=" " value={this.state.password} onChange={this._passwordInputHandler.bind(this)} autoComplete="new-password"/>
                            <label><span className="fa fa-lock"></span> <span className="hint">Password</span></label>
                        </div>
                        <div className="signup-item submit">
                            <button type="submit" onClick={this._login.bind(this)} className="app-button">Login</button>
                            <a href="javascript:;"> Forgot password ? </a>
                        </div>
                    </form>
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