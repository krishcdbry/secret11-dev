import React from 'react';
import {connect} from 'react-redux';
import Header from './components/common/Header';
import { 
    getTokenHeaders,
    SERVER,
    USER_API, 
    USER_SIGNUP_API, 
    USER_DATA_API,
    TOPIC_LIST_API
} from './config/network';
import Signup from './components/auth/signup';
import Login from './components/auth/Login';
import Home from './components/Home';
import { 
    createActionUserLoggedIn,
    createActionOnTopicsLoaded
} from './actions/actions';
import TagPage from './components/TagPage';
import ProfilePage from './components/ProfilePage';
import ProfileEditPage from './components/ProfileEditPage';
import StoryPage from './components/StoryPage';
import ComposePage from './components/ComposePage';
import NotFound from './components/404';
import MainMenu from './components/common/MainMenu';
import {modalToggle} from './helpers/utils';

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
            routeId : routeId || null,
            loading: true
        }
    }

    _fetchUserData() {
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
                    if (res.id) {
                        document.body.className = "home";
                        userLoggedIn(res, _token);
                        this.setState({
                            loading : false
                        })
                    }
                })
                .catch(err => {
                    console.error(err);  
                    this.setState({
                        loading : false
                    })                  
                })
        }
        else {
            this.setState({
                loading : false
            }) 
        }
    }

    _fetchTopics() {
        let topics = localStorage.getItem('topics');
        if (topics) {
            topics = JSON.parse(topics);
            this.props.topicsLoaded(topics);
        }
        else {
            fetch(SERVER+TOPIC_LIST_API, {
                headers : getTokenHeaders()
            })
            .then(res => res.json())
            .then(res => {
                console.log(res._embedded);
                this.props.topicsLoaded(res._embedded);
            })
            .catch(err => {
                // Error
            })
        }
    }

    componentDidMount() {
        this._fetchUserData();
        this._fetchTopics();
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

    _closeModal() {
        modalToggle();
    }

    // N - Normal
    // L - Login
    // S - Signup
    render () {
        let {activeState, routeId} = this.state;
        let {loggedIn} = this.props;
        let closeModalSrc = "/dist/assets/images/add.png";
        let loginSignComponent = null;

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

        loginSignComponent = (this.props.modalConfig.content == "L") ? <Login/> : <Signup/>
        
        if (activeState == "L") {
            signupLoginComponent = (
                <div className="main-component">
                    <Login/>
                </div>
            )
        }

        let mainComponent = null;
        let routeComponent = <Home/>;
    
        if (this.state.routeId) {
            let {route} = this.state;

            switch(route) {
                case "topic" : {
                    routeComponent = <Home topic={routeId}/>;
                    break;
                }
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
                case "compose" : {
                    if (routeId == 'new') {
                        routeComponent = <ComposePage/>
                    }
                    else {
                        routeComponent = <NotFound/>
                    }
                    break;
                }
                case "story" : {
                    routeComponent = <StoryPage storyUrl={routeId}/>
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
        
        if (this.props.topics.length > 0) {
            mainComponent = (
            <div className="maincomponent">
                {routeComponent}
            </div>)
        }

        // if (!routeId && !loggedIn && !this.state.loading) {
        //     console.log("Main ligin/signup");
        //     mainComponent = (
        //         <div className="maincomponent">
        //             <div className="load-wrapper" id="load-wrapper">
        //                 <div className="lds-css ng-scope">
        //                     <div className="lds-ripple">
        //                         <div></div>
        //                         <div></div>
        //                     </div>
        //                 </div>
        //             </div>
        //             <div className="wrapper"></div>
        //             <div id="stars1"></div>
        //             <div id="stars2"></div>
        //             <div id="stars3"></div>
        //             <div className="timer-data">
        //                 {signupLoginComponent}
        //             </div>
        //         </div>
        //     )   
        //     window.init()
        // }

        // console.log(this.state);
        // console.log(mainComponent);
        
        return (
            <div className="app-container">
                {mainComponent}
                <div class="modal-container">
                    <a href="javascript:;" onClick={this._closeModal.bind(this)} className="close-modal">
                        <img src={closeModalSrc}/>
                    </a>
                    <div class="modal">
                        {loginSignComponent}
                    </div>
                </div>
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        loggedIn: state.loggedIn,
        topics : state.topics,
        modalConfig : state.modalConfig
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        userLoggedIn : (user, token) => {
            dispatch(createActionUserLoggedIn(user, token));   
        },
        topicsLoaded : (topics) => {
            dispatch(createActionOnTopicsLoaded(topics))
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(App);