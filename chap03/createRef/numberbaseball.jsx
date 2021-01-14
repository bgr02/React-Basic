import React, { Component, createRef } from 'react';
import Try from './try';

//숫자 4개를 랜덤하게 겹치지 않게 생성하는 함수
function getNumbers() {
    const candidate = [1, 2, 3, 4, 5, 6, 7, 8, 9];
    const array = [];
    for (let i = 0; i < 4; i += 1) {
        const chosen = candidate.splice(Math.floor(Math.random() * (9 - i)), 1)[0];
        array.push(chosen);
    }
    return array;
}

class NumberBaseball extends Component {
    state = {
        result: '',
        value: '',
        answer: getNumbers(),
        tries: []
    };

    onSubmitForm = (e) => {
        e.preventDefault();
        if (this.state.value === this.state.answer.join('')) {
            this.setState((prevState) => {
                return {
                    result: '홈런!',
                    //React에서는 기존 배열에 push로 요소를 추가할 경우 변경감지가 되지 않으므로
                    //새로운 배열에 기존 값을 넣어주고 새로운 요소를 추가하는 작업을 해주어야 함
                    tries: [...prevState.tries, { try: this.state.value, result: '홈런!' }]
                };
            });
            alert('게임을 다시 시작합니다.');
            this.setState({
                value: '',
                answer: getNumbers(),
                tries: []
            });
            this.inputRef.current.focus();
        } else { //오답인경우
            const answerArray = this.state.value.split('').map((v) => parseInt(v));
            let strike = 0;
            let ball = 0;
            //10번 이상 틀렸을 때 
            if (this.state.tries.length >= 9) {
                this.setState({
                    result: `10번 이상 틀려서 실패! 답은 ${this.state.answer.join(',')}였습니다.`
                });
                alert('게임을 다시 시작합니다.');
                this.setState({
                    value: '',
                    answer: getNumbers(),
                    tries: []
                });
                this.inputRef.current.focus();
            } else {
                for (let i = 0; i < 4; i += 1) {
                    if (answerArray[i] === this.state.answer[i]) {
                        strike += 1;
                    } else if (this.state.answer.includes(answerArray[i])) {
                        ball += 1;
                    }
                }
                this.setState((prevState) => {
                    return {
                        tries: [...prevState.tries, { try: this.state.value, result: `${strike} 스트라이크, ${ball} 볼` }],
                        value: ''
                    };
                });
                this.inputRef.current.focus();
            }
        }
    };

    onChangeInput = (e) => {
        console.log(this.state.answer);
        this.setState({
            value: e.target.value
        });
    };

    //1. createRef는 Class Component에서 ref 사용을 hooks와 비슷하게 사용할 수 있게 편한 사용성을 제공한다.
    //2. ref 메서드를 직접 생성하는 경우 메서드 내부에서 다른 함수를 호출하는 등 세부적인 작업이 가능한 반면 
    //createRef는 제공되는 메서드를 사용하기 때문에 세부적인 작업은 불가능하다.
    //3. createRef로 생성된 대상을 사용시 current를 붙여서 사용해야 한다.
    inputRef = createRef();

    //render 함수 내부에서 setState 함수를 사용해서는 안된다. setState를 사용하면 랜더링이 되고 
    //랜더링이 되면 render 함수 내부의 setState가 호출되므로 무한반복이 일어난다.
    render() {
        //구조분해 할당을 사용한 state 간소화
        const { result, value, tries } = this.state;
        return (
            <>
                <h1>{result}</h1>
                <form onSubmit={this.onSubmitForm}>
                    <input ref={inputRef} maxLength={4} value={value} onChange={this.onChangeInput} />
                </form>
                <div>시도 : {tries.length}</div>
                <ul>
                    {
                        tries.map((v, i) => {
                            //1. React의 반복문은 map 함수를 사용하여 표현하고 반복되는 태그에 key를 반드시 포함하여 컴포넌트를 구분할 수 있게 하여야 함
                            //2. key에 map의 인덱스를 사용하는 것은 안티패턴이다. React에서는 key를 기준으로 element를 추가, 수정, 삭제 하는데 배열의 순서값인
                            //index를 key값으로 사용하게 되면 배열의 순서가 바뀔경우 element에 대한 조작이 뒤틀리기 때문임
                            //3. props로 컴포넌트에 데이터 전달(value, index)
                            //4. JSX 주석 : {/* */}
                            return <Try key={`${i + 1}차 시도 : `} tryInfo={v} />;
                        })
                    }
                </ul>
            </>
        );
    }

}

export default NumberBaseball;