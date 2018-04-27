import React from 'react';

class Body extends React.Component {
    constructor(context, props) {
        super(context, props);
        this.state = {
            active : 0
        }
    }

    isActive(index) {
        if (this.state.active == index) {
            return "item show"
        }
        return "item";
    }

    lockAnswer(option) {
        let nextQuestion = this.state.active+1;
        this.setState({
            active : nextQuestion
        })
    }

    render () {
        return (
            <div className="main-body">
                <div className={() => this.isActive(0)}>
                    <div className="question">
                        <pre lang="javascript">{
                                `var f = (function f(){ return "1"; }, function g(){ return 2; })();
                                typeof f;`
                            }
                        </pre>
                    </div>
                    <div className="options">
                        <div className="option-item" onClick={this.lockAnswer(0)}>string</div>
                        <div className="option-item">function</div>
                        <div className="option-item">undefined</div>
                        <div className="option-item">number</div>
                    </div>
                </div>
                <br/>
                <div className="item" className={() => this.giveClass(1)}>
                    <div className="question">
                        <pre lang="javascript" >{
                                `var f = (function f(){ return "1"; }, function g(){ return 2; })();
                                typeof f;`
                            }
                        </pre>
                    </div>
                    <div className="options">
                        <div className="option-item">string</div>
                        <div className="option-item">function</div>
                        <div className="option-item">undefined</div>
                        <div className="option-item">number</div>
                    </div>
                </div>
            </div>
        )
    }
}

export default Body;