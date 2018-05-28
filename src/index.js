import React from 'react';
import App from './app/app';
import store from './app/store';
import { Provider } from 'react-redux';
import { Switch, BrowserRouter as Router, Route, Link, Redirect } from 'react-router-dom';
import { render } from 'react-dom';
import TagPage from './app/components/TagPage';
import {fillProgress} from './app/helpers/utils';

require('./app/app.scss');

render(
    <Provider store={store}>
        <Router>
                <div>
                    <Route exact={true} path="/" component={App}/>

                    <Switch>

                        <Route path="/compose/:id" render={(props) => { 
                            fillProgress();
                            return <App route="compose" {...props} /> 
                        }}/> 

                         <Route path="/story/:id" render={(props) => { 
                            fillProgress();
                            return <App route="story" {...props} /> 
                        }}/> 

                        <Route path="/profile/:id" render={(props) => { 
                            fillProgress();
                            return <App route="profile" {...props} /> 
                        }}/> 

                        <Route path="/tag/:id" render={(props) => { 
                            fillProgress();
                            return <App route="tag" {...props} /> 
                        }}/> 
                    
                        <Route path="/:id" render={(props) => { 
                            fillProgress();
                            return <App route="user" {...props} /> 
                        }}/> 

                    </Switch>
                    
                </div>
            </Router>
    </Provider>,
    document.getElementById('root')
)

