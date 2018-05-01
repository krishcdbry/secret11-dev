import React from 'react';
import random from '../../helpers/random';

class Profilpicedit extends React.Component {
    constructor(context, props) {
        super(context, props);
    }

    _setProfilePic(i) {
        
    }

    render() {
        let profilePicComponent = [];
        let profilePicUrl = "/bucket/profile/";
        let {onsave} = this.props;

        for (let i = 210; i > 0; i--) {
            let img = profilePicUrl+'user-profile-'+i+'.png';
            let key = random();
            profilePicComponent.push(
                <a href="javascript:;" onClick={() => onsave(img)} key={key}>
                    <img src={img}/>
                </a>
            )
        }
    
        return (
            <div className="profile-edit">
                {profilePicComponent}
            </div>
        )
    }
}


export default Profilpicedit;