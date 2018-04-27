import React from 'react';
import Header from './components/header';
import Footer from './components/footer';
import Body from './components/body';
require('./app.scss');

class App extends React.Component {
    constructor(context, props) {
        super(context, props);
    }

    render () {
        return (
            <div className="app-container">
                <Header/>
                <Body/>
                <Footer/>
            </div>
        )
    }
}

export default App;