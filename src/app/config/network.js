const PROTOCOL = window.location.protocol;
const HOST = window.location.host;

const LOCAL_SERVER = "api";
const DEV_SERVER = "api-dev";
const LIVE_SERVER = "api";

let PORT = "9000";

let SERVER_URL = PROTOCOL+"//"+LIVE_SERVER+"."+HOST+":"+PORT;

if (PROTOCOL == "https:") {
    PORT = "7200";
    SERVER_URL = PROTOCOL+"//secret11.com/api:"+PORT;
}

const SERVER = SERVER_URL;

const USER_DATA_API = "/user";
const USER_PROFILE_API = "/user/";
const USER_PROFILE_EDIT_API = "/user";

const USER_SIGNUP_API = "/auth/signup";
const USER_LOGIN_API = "/auth/login";
const USER_LOGOUT_API = "/auth/logout";

const STORY_PUBLISH_API = "/story/publish";
const STORY_FEED_API = "/story/feed";
const STORY_REPLY_GET_API = "/story/reply/";
const STORY_REPLY_PUBLISH_API = "/story/reply";
const STORY_PROFILEFEED_API = "/story/userfeed/";

const STORY_UPVOTE_API = "/story/vote";
const STORY_DOWNVOTE_API = "/story/vote/";

const TAG_INFO_API = "/tag/";
const TAG_FEED_API = "/tag/feed/";

const SEARCH_IMAGES_API = '/search/';

const getTokenHeaders = () => {
    let _token = localStorage.getItem('x-access-token');
    let authHeaders = new Headers();
    authHeaders.append('x-access-token' , _token);
    authHeaders.append('Accept', 'application/json');
    authHeaders.append('Content-Type', 'application/json');
    return authHeaders;
}

export {
    SERVER,

    USER_DATA_API,
    USER_PROFILE_API,
    USER_PROFILE_EDIT_API,

    USER_SIGNUP_API,
    USER_LOGIN_API,
    USER_LOGOUT_API,

    STORY_PUBLISH_API,
    STORY_FEED_API,
    STORY_REPLY_GET_API,
    STORY_REPLY_PUBLISH_API,
    STORY_PROFILEFEED_API,

    STORY_UPVOTE_API,
    STORY_DOWNVOTE_API,

    TAG_INFO_API,
    TAG_FEED_API,

    SEARCH_IMAGES_API,
    
    getTokenHeaders
}