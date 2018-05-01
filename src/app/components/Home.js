import React from 'react';
import {connect} from 'react-redux';
import Header from './common/Header';
import { USER_LOGOUT_API, SERVER } from '../config/network';
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
            iconStyle : {}
        }
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
        
        return (
            <div className="home">
                <Header/>
                <div className="home-content">
                    <div className="left-menu">
                        <div className="create" onClick={this._toggleStoryForm.bind(this)} style={this.state.iconStyle}>
                            <img src={imgSrc}/>
                        </div>
                   </div>
                   <div className="story-form-wrapper" style={this.state.formStyle}>
                        {storyFormComponent}
                   </div>
                   <Storyfeed/>
                   <div className="right-menu">
                        <div className="story-tags suggestion">
                                <span className="tag">Technology <span className="count">45</span> </span>
                                <span className="tag">Sex <span className="count"> 23 </span></span>
                                <span className="tag">Education <span className="count"> 12</span></span>
                                <span className="tag">Funy <span className="count"> 11</span></span>
                                <span className="tag">Fantasy <span className="count"> 134</span></span>
                                <span className="tag">Viral <span className="count"> 6.5k</span></span>
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
        onStoryPublish : (story) => {
            dispatch(createActionStoryPublished(story))
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Home);