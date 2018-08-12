const USER_LOGGED_IN = "USER_LOGGED_IN";
const USER_LOGGED_OUT = "USER_LOGGED_OUT";
const STORY_PUBLISH_APIED = "STORY_PUBLISH_APIED";
const STORY_FEED_API_LOADED = "STORY_FEED_API_LOADED";
const TOPICS_LOADED = "TOPICS_LOADED";
const TOGGLE_MODAL = "TOGGLE_MODAL";
const SET_MODAL_CONTENT = "SET_MODAL_CONTENT";

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

function createActionToggleModal() {
    return {
        type : TOGGLE_MODAL
    }
}

function createActionSetModalContent(content) {
    return {
        type : SET_MODAL_CONTENT,
        content,
    }
}

export {
    USER_LOGGED_IN,
    USER_LOGGED_OUT,
    STORY_PUBLISH_APIED,
    STORY_FEED_API_LOADED,
    TOPICS_LOADED,
    TOGGLE_MODAL,
    SET_MODAL_CONTENT,

    createActionUserLoggedIn,
    createActionUserLoggedOut,
    createActionStoryPublished,
    createActionOnStoryFeedLoaded,
    createActionOnTopicsLoaded,
    createActionToggleModal,
    createActionSetModalContent
}