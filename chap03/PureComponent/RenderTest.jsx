import React, { PureComponent } from 'react';

//PureComponent: shouldComponentUpdate 메서드를 구현해놓은 컴포넌트,
//state값의 변경을 감지하여 state가 변경된 경우에만 랜더링을 함
class Test extends PureComponent {
    state = {
        counter: 0,
        string: 'hello',
        number: 1,
        boolean: true,
        object: {},
        array: []
    };

    //React에서 배열 변경시 항상 새로운 배열에 기존 값을 추가하여 변경해야 변경감지가 가능함
    onClick = () => {
        this.setState({
            array: [...this.state.array, 1]
        });
    };

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