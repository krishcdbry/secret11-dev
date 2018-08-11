import React from 'react';
import Storyform from './story/Storyform';
import {connect} from 'react-redux';
import Header from './common/Header';

class ComposePage extends React.Component {
    constructor(context, props) {
        super(context, props);
    }

    render() {

        let composeComponent = null;
        
        if (this.props.topics.length > 0) {
            composeComponent = (
                <div className="home">
                    <div className="home-content">
                        <div className="story-page">
                            <div className="story-form-wrapper">
                                <Storyform/>
                            </div>
                        </div>
                    </div>
                </div>
            )
        }

        return composeComponent;
    }
}

const mapStateToProps = (state) => {
    return {
        user : state.user,
        topics : state.topics
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
       
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ComposePage);