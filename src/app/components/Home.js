import React from 'react';
import {connect} from 'react-redux';
import random from '../helpers/random';
import Header from './common/Header';
import { USER_LOGOUT_API, SERVER, TAG_LIST_API, getTokenHeaders } from '../config/network';
import { createActionUserLoggedOut, createActionStoryPublished } from '../actions/actions';
import Storyfeed from './story/Storyfeed';
import Storyform from './story/Storyform';
import {customAlert} from '../helpers/utils';
import {Link} from 'react-router-dom';

class Home extends React.Component {
    constructor(context, props) {
        super(context, props);
        this.state = {
            formStyle : {},
            formOpen : false,
            iconStyle : {},
            tags : []
        }
    }

    componentDidMount() {
        fetch(SERVER+TAG_LIST_API, {
            headers : getTokenHeaders()
        })
        .then(res => res.json())
        .then(res => {
            this.setState({
                tags : res._embedded
            })
        })
    }

    _toggleStoryForm() {
        let {formOpen} = this.state;
        let style = {};
        let rotateStyle = {};
        
        if (!formOpen) {
            style = {
                'top' : '50%'
            }
            rotateStyle = {
                'transform' : 'rotate(90deg)'
            }
        }
        else {
            style = {
                'top' : '-50%'
            }
            rotateStyle = {
                'transform' : 'rotate(0deg)'
            }
        }
        
        let open = !this.state.formOpen;
        
        this.setState({
            formStyle: style,
            formOpen: open,
            iconStyle : rotateStyle
        })
    }

    render() {
        let {user, onStoryPublish} = this.props;

        let storyFormComponent = null;
    
        let imgSrc = "/dist/assets/images/add.png";

        let tagsComponent = [];

        this.state.tags.map(item => {
            let key = random();
            let link = "/tag/"+item.name;
            tagsComponent.push(
                <Link to={link} key={key} className="tag">
                    {item.name} <span className="count">{item.count}</span>
                </Link>
            )
        })

        if (this.state.formOpen && !storyFormComponent) {
            storyFormComponent = (
                <div>
                    {/* <div className="close-story" onClick={this._toggleStoryForm.bind(this)}>
                            <a href="javascript:;" className="fa fa-remove"></a>
                    </div> */}
                    <Storyform onSave={onStoryPublish}/>
                </div>
            )
            imgSrc = "/dist/assets/images/cancel.png";
        }
        
        // onClick={this._toggleStoryForm.bind(this)} 


        
        return (
            <div className="home">
                <Header/>
                <div className="home-content home-page">
                    <div className="left-menu">
                        <Link to="/compose/new">
                            <div className="create" style={this.state.iconStyle}>
                                <img src={imgSrc}/>
                            </div>
                        </Link>
                        <div className="story-tags suggestion">
                                {tagsComponent}
                        </div>
                   </div>
                   <div className="story-form-wrapper" style={this.state.formStyle}>
                        {storyFormComponent}
                   </div>
                   <Storyfeed/>
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
        onStoryPublish : (story) => {
            dispatch(createActionStoryPublished(story))
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Home);