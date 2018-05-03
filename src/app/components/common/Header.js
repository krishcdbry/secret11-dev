import React from 'react';
import {connect} from 'react-redux';
import { Link } from 'react-router-dom';
import {
    SERVER,
    USER_LOGOUT_API
} from '../../config/network';

import { createActionUserLoggedOut } from '../../actions/actions';

class Header extends React.Component {
    constructor(context, props) {
        super(context, props);
    }

    _logout() {
        let {onUserLoggedOut} = this.props;

        fetch(SERVER+USER_LOGOUT_API, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
             },
            body: null
        })
        .then((res) => res.json())
        .then((data) =>  {
            if (data.success)  {
                onUserLoggedOut()
                document.body.className = "landing-background";
            }
            else {
                alert(data.message);
            }
        })
        .catch((err)=>console.log(err))
    }

    render () {
        let {username, image} = this.props.user;

        let profileLink = "/"+username;
        
        return (
            <header>
                <div className="header-content">
                    <div className="header-main-content">
                        <Link to="/"><h1 className="logo">Secret11</h1></Link>
                        <input type="search" className="search" placeholder="search"/>
                    </div>
                    <div className="user-info">
                            <Link to={profileLink}>
                                <img src={image}/>
                                <span className="username">{username}</span>
                            </Link>
                            |<a href="javascript:;" onClick={this._logout.bind(this)}>Logout</a> 
                    </div>
                </div>
            </header>
        )
    }
}

let mapStateToProps = (state) => {
    return {
        user : state.user
    }
}

let mapDispatchToProps = (dispatch) => {
    return {
        onUserLoggedOut : () => {
            dispatch(createActionUserLoggedOut())
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Header);