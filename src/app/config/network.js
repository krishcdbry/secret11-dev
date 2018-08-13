const PROTOCOL = window.location.protocol;
const HOST = window.location.host;
const DOMAIN = "secret11.com";

const LOCAL_SERVER = "api";
const DEV_SERVER = "api-geek";
const LIVE_SERVER = "api";

let CURRENT_SERVER = LIVE_SERVER;
if (HOST.indexOf('geek') > 0) {
    CURRENT_SERVER = DEV_SERVER;
}

let PORT = "9000";
if (PROTOCOL == "https:") {
    PORT = "7200";
}

const SERVER = `${PROTOCOL}//${CURRENT_SERVER}.${DOMAIN}:${PORT}`;

const USER_DATA_API = "/user";
const USER_PROFILE_API = "/user/";
const USER_PROFILE_EDIT_API = "/user";

const USER_SIGNUP_API = "/auth/signup";
const USER_LOGIN_API = "/auth/login";
const USER_LOGOUT_API = "/auth/logout";

const USER_FOLLOW_API = "/user/follow";
const USER_UNFOLLOW_API = "/user/follow/";

const TOPIC_LIST_API = "/topic";

const STORY_PUBLISH_API = "/story/publish";
const STORY_FEED_API = "/story/feed";
const STORY_FEED_BY_TOPIC = "/story/feed/";
const STORY_REPLY_GET_API = "/story/reply/";
const STORY_REPLY_PUBLISH_API = "/story/reply";
const STORY_PROFILEFEED_API = "/story/userfeed/";
const STORY_ITEM_API = "/story/item";


const STORY_UPVOTE_API = "/story/vote";
const STORY_DOWNVOTE_API = "/story/vote/";

const TAG_INFO_API = "/tag/";
const TAG_FEED_API = "/tag/feed/";
const TAG_LIST_API = "/tag-list";

const TAG_FOLLOW_API = "/tag/follow";
const TAG_UNFOLLOW_API = "/tag/follow/";

const SEARCH_IMAGES_API = '/search/pic/';
const SEARCH_GLOBAL_API = '/search/global/';

const getTokenHeaders = () => {
    let _token = localStorage.getItem('x-access-token') || 742;
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

    USER_FOLLOW_API,
    USER_UNFOLLOW_API,

    USER_SIGNUP_API,
    USER_LOGIN_API,
    USER_LOGOUT_API,

    TOPIC_LIST_API,

    STORY_PUBLISH_API,
    STORY_FEED_API,
    STORY_FEED_BY_TOPIC,
    STORY_REPLY_GET_API,
    STORY_REPLY_PUBLISH_API,
    STORY_PROFILEFEED_API,
    STORY_ITEM_API,

    STORY_UPVOTE_API,
    STORY_DOWNVOTE_API,

    TAG_INFO_API,
    TAG_FEED_API,
    TAG_LIST_API,

    TAG_FOLLOW_API,
    TAG_UNFOLLOW_API,

    SEARCH_IMAGES_API,
    SEARCH_GLOBAL_API,
    
    getTokenHeaders
}