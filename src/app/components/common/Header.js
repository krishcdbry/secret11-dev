import React from 'react';
import {connect} from 'react-redux';
import { Link } from 'react-router-dom';
import {
    SERVER,
    USER_LOGOUT_API,
    SEARCH_GLOBAL_API,
    getTokenHeaders
} from '../../config/network';

import { createActionUserLoggedOut } from '../../actions/actions';

class Header extends React.Component {
    constructor(context, props) {
        super(context, props);
        
        this.state = {
            search : "",
            searching: true,
            results : []
        }
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

    searchGlobal(val) {
        this.setState({
            results : [],
            searching: true
        })

        fetch(SERVER+SEARCH_GLOBAL_API+val, {
            headers : getTokenHeaders()
        })
        .then(res => res.json())
        .then(res => {
            if (res.success) {
                this.setState({
                    results : res._embedded,
                    searching: false
                })
            }
        })
        .catch(err=>console.error(err));
    }

    _searchInputHandler(e) {
        let val = e.target.value;
        this.setState({
            search : val
        })
        this.searchGlobal(val)
    }

    render () {
        let {username, image} = this.props.user;
        let {search, results} = this.state;

        let profileLink = "/"+username;

        let searchComponent = null;
        let searchResultsComponent = [];

        if (search.length > 0) {
            
            if (results.length > 0) {
                results.map(item => {
                    let profileLink = "/"+item.username;
                    searchResultsComponent.push(
                        <Link to={profileLink}>
                            <div className="search-item">
                                <img className="author" src={item.image}/>
                                <div className="username">
                                    {item.username}
                                </div>
                            </div>
                        </Link>
                    )
                })
            }

            searchComponent = (
                <div class="search-results">
                    <div class="key">Results for <b>{search}</b></div>
                    <div class="results">
                        {searchResultsComponent}
                    </div>
                </div>
            )
        }
        
        return (
            <header>
                <div className="header-content">
                    <div className="header-main-content">
                        <Link to="/"><h1 className="logo">Secret11</h1></Link>
                        <div class="search-section">
                            <input type="search" 
                                    value={this.state.search} 
                                    className="search" 
                                    placeholder="search" 
                                    onChange={this._searchInputHandler.bind(this)}/>
                            {searchComponent}
                        </div>
                    </div>
                    <div className="user-info">
                            <Link to={profileLink}>
                                <img src={image}/>
                                {/* <span className="username">{username}</span> */}
                            </Link>
                            {/* |<a href="javascript:;" onClick={this._logout.bind(this)}>Logout</a>  */}
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