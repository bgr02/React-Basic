import React, { Component } from 'react';

class Test extends Component {
    state = {
        counter: 0
    };

    //무분별한 랜더링 방지를 위해 사용하는 함수, 랜더링이 특정 조건에서 일어나게 제한함
    shouldComponentUpdate(nextProps, nextState, nextContext) {
        if(this.state.counter !== nextState.counter) {
            return true;
        }
        return false;
    }

    //setState에서 값을 바꾸지 않고 setState 함수를 호출하기만 해도 
    //랜더링이 발행함.
    onClick = () => {
        this.setState({});
    }

    render() {
        console.log('랜더링', this.state);
        return (
            <div>
                <button onClick={this.onClick}>클릭</button>
            </div>
        );
    }
}

export default Test;