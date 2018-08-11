const USER_LOGGED_IN = "USER_LOGGED_IN";
const USER_LOGGED_OUT = "USER_LOGGED_OUT";
const STORY_PUBLISH_APIED = "STORY_PUBLISH_APIED";
const STORY_FEED_API_LOADED = "STORY_FEED_API_LOADED";
const TOPICS_LOADED = "TOPICS_LOADED";

function createActionUserLoggedIn(user, token) {
    return {
        type: USER_LOGGED_IN,
        user,
        token
    }
}

function createActionUserLoggedOut() {
    return {
        type: USER_LOGGED_OUT
    }
}

function createActionStoryPublished(story) {
    return {
        type: STORY_PUBLISH_APIED,
        story
    }    
}

function createActionOnStoryFeedLoaded(feed) {
    return {
        type: STORY_FEED_API_LOADED,
        feed
    }    
}

function createActionOnTopicsLoaded(topics) {
    return {
        type : TOPICS_LOADED,
        topics
    }
}

export {
    USER_LOGGED_IN,
    USER_LOGGED_OUT,
    STORY_PUBLISH_APIED,
    STORY_FEED_API_LOADED,
    TOPICS_LOADED,

    createActionUserLoggedIn,
    createActionUserLoggedOut,
    createActionStoryPublished,
    createActionOnStoryFeedLoaded,
    createActionOnTopicsLoaded
}