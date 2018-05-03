import React from 'react';
import Storyform from './story/Storyform';
import Header from './common/Header';

class NotFound extends React.Component {
    constructor(context, props) {
        super(context, props);
    }
    
    render() {

        return (
            <div className="home">
                <Header/>
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
}

export default NotFound;