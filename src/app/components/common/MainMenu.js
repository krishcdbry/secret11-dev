import React from 'react';
import {connect} from 'react-redux';
import { Link } from 'react-router-dom';
import random from '../../helpers/random';

class MainMenu extends React.Component {
    constructor(context, props) {
        super(context, props);
    }

    render () {
        let {topics, user} = this.props;
        let menuComponent = [];

        if (topics.length != 12) {
            topics.unshift({"name" : "Feed"});
        }

        for (let topic of topics) {
            let item = topic.name;
            let key = random();
            let link =  "/topic/"+item;
            let itemClass = "item-"+item;

            if (item == 'Feed') {
                link =  "/";
            }
            
            if (item == this.props.tag) {
                itemClass = itemClass + " active";
            }
            
            menuComponent.push(
                <Link to={link} key={key} className={itemClass}>
                    {item}
                </Link>
            )
        }

        return (
            <section className="main-menu">
                {menuComponent}
            </section>
        )
    }
}

let mapStateToProps = (state) => {
    return {
        user : state.user,
        topics : state.topics
    }
}

let mapDispatchToProps = (dispatch) => {
    return {}
}

export default connect(mapStateToProps, mapDispatchToProps)(MainMenu);