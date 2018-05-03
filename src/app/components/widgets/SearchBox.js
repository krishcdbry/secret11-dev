import React from 'react';
import { 
    SERVER, 
    SEARCH_IMAGES_API,
    getTokenHeaders
} from '../../config/network';
import random from '../../helpers/random';

class SearchBox extends React.Component {
    constructor(context, props) {
        super(context, props);
        this.state = {
            search : '',
            images : [],
            searching : false
        }
    }

    _fetchImages(e) {
        let val = e.target.value;
        let regex = /^[a-zA-Z0-9 ]{2,}$/;
       
        if (e.keyCode != 13 || !regex.test(val)) {
            return;
        }
        else {
            this.setState({
                searching: true
            })
        }
        fetch(SERVER+SEARCH_IMAGES_API+val, {
            headers : getTokenHeaders()
        })
        .then(res => res.json())
        .then(res => {
            if (res.success) {
                this.setState({
                    images : res._embedded,
                    searching: false
                })
            }
        })
        .catch(err=>console.error(err));
    }

    _handleSearcInput(e) {
        this.setState({
            search : e.target.value
        })
    }

    render() {
        let {onSelect, onClose} = this.props;
        let {images, search, searching} = this.state;

        let imageFeedComponent = [];

        if (!searching && images.length > 0) {
            images.map(item => {
                let key = random();
                imageFeedComponent.push(
                    <div key={key} 
                        style={{
                            background: 'url('+item.url+')',
                            backgroundSize: 'cover',
                        }} 
                        class="item"
                        onClick={() => onSelect(item.url)}>
                    </div>
                )
            })
        }

        if (searching) {
            imageFeedComponent = [];
            imageFeedComponent.push(
                <div className="searching">
                   <div className="spinner">
                        <div className="bounce1"></div>
                        <div className="bounce2"></div>
                        <div className="bounce3"></div>
                    </div>
                </div>
            )
        }

        if(!searching && images.length == 0) {
            imageFeedComponent.push(
                <div class="searching">
                    Start searching
                </div>
            )
        }

        return (
            <div class="search-box">
                <div class="search-input">
                    <input type="text" 
                            placeholder="search.." 
                            value={search}
                            onKeyDown={this._fetchImages.bind(this)}
                            onChange={this._handleSearcInput.bind(this)} />
                    <a href="javascript:;" onClick={onClose} className="app-button inverse">Close</a>
                </div>
                <div class="search-results">
                    {imageFeedComponent}
                </div>
            </div>
        )
    }
}

export default SearchBox;