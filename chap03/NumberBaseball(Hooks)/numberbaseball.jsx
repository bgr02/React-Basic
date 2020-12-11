import React, { useState } from 'react';
import Try from './try';

//숫자 4개를 랜덤하게 겹치지 않게 생성하는 함수
function getNumbers() {
    const candidate = [1,2,3,4,5,6,7,8,9];
    const array = [];
    for(let i=0; i<4; i+=1) {
        const chosen = candidate.splice(Math.floor(Math.random() * (9-i)), 1)[0];
        array.push(chosen);
    }
    return array;
}

const NumberBaseball = () => {
    const [result, setResult] = useState('');
    const [value, setValue] = useState('');
    const [answer, setAnswer] = useState(getNumbers());
    const [tries, setTries] = useState([]);

    const onSubmitForm = (e) => {
        e.preventDefault();
        if(value === answer.join('')) {
            setResult('홈런!');
            setTries((prevTries) => {
                return [...prevTries, {try: value, result: '홈런!'}];
            });
            alert('게임을 다시 시작합니다.');
            setValue('');
            setAnswer(getNumbers());
            setTries([]);
        } else { //오답인경우
            const answerArray = value.split('').map((v) => parseInt(v));
            let strike = 0;
            let ball = 0;
            //10번 이상 틀렸을 때 
            if(tries.length >= 9) {
                setResult(`10번 이상 틀려서 실패! 답은 ${answer.join(',')}였습니다.`);
                alert('게임을 다시 시작합니다.');
                setValue('');
                setAnswer(getNumbers());
                setTries([]);
            } else {
                for(let i=0; i < 4; i+=1) {
                    if(answerArray[i] === answer[i]) {
                        strike += 1;
                    } else if(answer.includes(answerArray[i])) {
                        ball += 1;
                    }
                }
                setTries((prevTries) => {
                    return [...prevTries, {try: value, result: `${strike} 스트라이크, ${ball} 볼`}];
                });
                setValue('');
            }
        }
    };

    const onChangeInput = (e) => {
        console.log(answer);
        setValue(e.target.value)
    };

    return (
        <>
            <h1>{result}</h1>
            <form onSubmit={onSubmitForm}>
                <input maxLength={4} value={value} onChange={onChangeInput}/>
            </form>
            <div>시도 : {tries.length}</div>
            <ul>
                {
                    tries.map((v, i)=> {
                        //1. React의 반복문은 map 함수를 사용하여 표현하고 반복되는 태그에 key를 반드시 포함하여 컴포넌트를 구분할 수 있게 하여야 함
                        //2. key에 map의 인덱스를 사용하는 것은 안티패턴이다. React에서는 key를 기준으로 element를 추가, 수정, 삭제 하는데 배열의 순서값인
                        //index를 key값으로 사용하게 되면 배열의 순서가 바뀔경우 element에 대한 조작이 뒤틀리기 때문임
                        //3. props로 컴포넌트에 데이터 전달(value, index)
                        //4. JSX 주석 : {/* */}
                        return <Try key={`${i+1}차 시도 : `} tryInfo={v}/>;
                    })
                }
            </ul>
        </>
    );
};

export default NumberBaseball;