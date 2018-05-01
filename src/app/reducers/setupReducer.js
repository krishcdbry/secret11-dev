import { 
    USER_LOGGED_IN, 
    USER_LOGGED_OUT,
    STORY_PUBLISH_APIED, 
    STORY_FEED_API_LOADED
} from "../actions/actions";

let kInitialState = {
    token : null,
    loggedIn : false,
    user : null,
    storyfeed : []
}

const setupReducer = (state = kInitialState, action) => {
    switch(action.type) {
        case USER_LOGGED_IN: {
            let {user, token} = action;
            localStorage.setItem("x-access-token", token);
            return Object.assign({}, state, {user, loggedIn: true, token})
        }
        case USER_LOGGED_OUT: {
            localStorage.removeItem("x-access-token");
            return Object.assign({}, state, {user : null, loggedIn: false, token: null})
        }
        case STORY_FEED_API_LOADED: {
            let {feed} = action;
            let {storyfeed} = state;

            if (feed.length > 0) {
                storyfeed = feed;
            }
            
            return Object.assign({}, state, {storyfeed});
        }
        case STORY_PUBLISH_APIED: {
            let {story} = action;
            let {storyfeed} = state;
            let newFeed = storyfeed.slice(0)
            if (story) {
                newFeed.unshift(story);
            }
            
            return Object.assign({}, state, {storyfeed: newFeed});
        }
        default : {
            return state;
        }
    }
}

export default setupReducer;