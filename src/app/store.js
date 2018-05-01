import {createStore} from 'redux';
import setupReducer from './reducers/setupReducer';

const store = createStore(setupReducer);

export default store;