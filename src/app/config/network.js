
const LOCAL_SERVER = "http://api.secret11:9000";
const DEV_SERVER = "http://api-dev.secret11.com:9000";
const LIVE_SERVER = "http://api.secret11.com:9000";

const SERVER = LOCAL_SERVER;

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

    getTokenHeaders
}