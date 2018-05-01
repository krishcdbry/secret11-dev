import React from 'react';
import {connect} from 'react-redux';
import Header from './components/common/Header';
import { 
    SERVER,
    USER_API, 
    USER_SIGNUP_API, 
    USER_DATA_API 
} from './config/network';
import Signup from './components/auth/signup';
import Login from './components/auth/Login';
import Home from './components/Home';
import { createActionUserLoggedIn } from './actions/actions';
import TagPage from './components/TagPage';
import ProfilePage from './components/ProfilePage';
import ProfileEditPage from './components/ProfileEditPage';
import NotFound from './components/404';

class App extends React.Component {
    constructor(context, props) {
        super(context, props);

        let routeId = null;
        if (this.props.match.params) {
            let params = this.props.match.params;
            routeId = params.id;
        }

        this.state = {
            activeState : "N",
            route : this.props.route || null,
            routeId : routeId || null
        }
    }

    componentDidMount() {
        let {userLoggedIn} = this.props;
        let _token = localStorage.getItem('x-access-token');

        let authHeaders = new Headers();
        authHeaders.append('x-access-token' , _token);

        if (_token) {
            fetch(SERVER+USER_DATA_API, {
                    headers: authHeaders
                })
                .then(res => {
                    return res.json();
                })
                .then(res => {
                    document.body.className = "home";
                    userLoggedIn(res, _token)
                })
        }
    }

    changeActiveState(activeState) {
        this.setState({
            activeState : activeState
        })
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        if (nextProps.match.params) {
            let id = nextProps.match.params.id;
            if (id && id != prevState.routeId) {

                return {
                    route: nextProps.route,
                    routeId: (nextProps.match.params) ? nextProps.match.params.id : null
                }
            }
        }
        return null;
    }

    // N - Normal
    // L - Login
    // S - Signup
    render () {
        let {activeState} = this.state;
        let {loggedIn} = this.props;

        let signupLoginComponent = (
            <div className="main-component">
                <span className="name">Secret<span className="num">11</span></span><br/><span className="caption">The anonymous planet (11th). </span><br/>
                        <div className="site-info">Stay tuned to enter into a new world.</div>
                <div className="notify-me">
                            <a href="javascript:;" className="notify-btn" id="login-btn" onClick={() => this.changeActiveState("L")}>Login</a>
                            <a href="javascript:;" className="notify-btn" id="join-us-btn" onClick={() => this.changeActiveState("S")}>Join Us</a>
                </div>
            </div>
        )

        if (activeState == "L") {
            signupLoginComponent = (
                <div className="main-component">
                    <Login/>
                </div>
            )
        }

        let mainComponent = null;
        let routeComponent = <Home/>;
    
        if (this.state.route) {
            let {routeId, route} = this.state;
            
            switch(route) {
                case "tag" : {
                    routeComponent = <TagPage tag={routeId}/>
                    break;
                }
                case "user" : {
                    routeComponent = <ProfilePage userHandle={routeId}/>
                    break;
                }
                case "profile" : {
                    if (routeId == 'edit') {
                        routeComponent = <ProfileEditPage/>
                    }
                    else {
                        routeComponent = <NotFound/>
                    }
                    break;
                }
                default : {
                    routeComponent = <NotFound/>
                }
            }
            
        }

        if (activeState == "S") {
            signupLoginComponent = (
                <div className="main-component">
                    <Signup/>
                </div>
            )
        }
        
        if (loggedIn) {
            mainComponent = (<div className="maincomponent">
                {routeComponent}
            </div>)
        }
        else {
            mainComponent = (
                <div className="maincomponent">
                    <div className="load-wrapper" id="load-wrapper">
                        <div className="lds-css ng-scope">
                            <div className="lds-ripple">
                                <div></div>
                                <div></div>
                            </div>
                        </div>
                    </div>
                    <div className="wrapper"></div>
                    <div id="stars1"></div>
                    <div id="stars2"></div>
                    <div id="stars3"></div>
                    <div className="timer-data">
                        {signupLoginComponent}
                    </div>
                </div>
            )   
            window.init()
        }
        return (
            <div className="app-container">
                {mainComponent}
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        loggedIn: state.loggedIn
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        userLoggedIn : (user, token) => {
            dispatch(createActionUserLoggedIn(user, token));   
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(App);