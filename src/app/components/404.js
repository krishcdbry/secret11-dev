import React from 'react';

class NotFound extends React.Component {
    constructor(context, props) {
        super(context, props);
    }
    
    render() {

        return (

            <div className="home-content">
                <div className="page-404">
                    <h1>Sorry, This is not the page you are looking for </h1>
                    <img src="/dist/assets/images/404.png"/>
                </div>
            </div>
            
        )
    }
}

export default NotFound;