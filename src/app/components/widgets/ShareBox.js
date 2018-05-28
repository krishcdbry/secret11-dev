import React from 'react';
import { 
    SERVER, 
    getTokenHeaders
} from '../../config/network';
import random from '../../helpers/random';

class ShareBox extends React.Component {
    constructor(context, props) {
        super(context, props);
        this.state = {
            url : window.location.href
        }
    }

    shareWhatsapp() {
        window.open("https://web.whatsapp.com/send?text=" +document.title + " " +this.state.url);
    }

    shareFacebook() {
        window.open("https://www.facebook.com/sharer.php?t="+document.title+"&u="+this.state.url)
    }

    shareTwitter() {
        window.open("https://twitter.com/intent/tweet?text="+document.title+"&url="+this.state.url);
    }

    sharePinterest() {
        window.open("https://pinterest.com/pin/create/button/?description="+document.title+"&media=&url="+this.state.url)
    }

    shareEmail() {
        window.location = "mailto:example@foo.com?subject=Secret11&body=Check this out \n "+document.title + " \n\n  " + this.state.url;
    }

    render() {
        return (
            <div class="share-box">
                <div class="share-item fb" onClick={this.shareFacebook.bind(this)}>
                    <span className="fa fa-facebook"></span>
                    <span className="count"></span>
                </div>
                <div class="share-item tw" onClick={this.shareTwitter.bind(this)}>
                    <span className="fa fa-twitter"></span>
                    <span className="count"></span>
                </div>
                <div class="share-item pt" onClick={this.sharePinterest.bind(this)}>
                    <span className="fa fa-pinterest"></span>
                    <span className="count"></span>
                </div>
                <div class="share-item em" onClick={this.shareEmail.bind(this)}>
                    <span className="fa fa-envelope"></span>
                    <span className="count"></span>
                </div>
                <div class="share-item ws" onClick={this.shareWhatsapp.bind(this)}>
                    <span className="fa fa-whatsapp"></span>
                    <span className="count"></span>
                </div>
            </div>
        )
    }
}

export default ShareBox;