import React, { useState, useRef, useEffect } from 'react';

//React LifeCycle
//클래스 컴포넌트의 렌더링 : constructor -> render -> ref -> componentDidMount
//리렌더링인 경우 : setState/props 바뀔때 -> shouldComponentUpdate(true) -> render -> componentDidUpdate
//부모 컴포넌트에서 자식 컴포넌트 삭제시 : componentWillUnmount -> 소멸

const rspCoords = {
    바위: '0',
    가위: '-142px',
    보: '-284px'
}

const scores = {
    가위: 1,
    바위: 0,
    보: -1
}

const computerChoice = (imgCoord) => {
    return Object.entries(rspCoords).find(function(v) {
        return v[1] === imgCoord;
    })[0];
}

//1. Hooks는 렌더링 될때마다 RSP 메서드가 통째로 동작한다.
//2. 부모 component가 렌더링 되면 자식 component도 무조건 렌더링된다. 따라서 shouldComponentUpdate, PureComponent, memo등을 사용하여 처리해야 한다.
const RSP = () => {
    //useState: 함수 컴포넌트에 state 변수를 선언할 수 있는 함수 -> 컴포넌트가 다시 렌더링되어도 그대로 유지됨
    const [result, setResult] = useState('');
    const [imgCoord, setImgCoord] = useState(rspCoords.바위);
    const [score, setScore] = useState(0);
    const interval = useRef();
    console.log(imgCoord);

    //1. useEffect를 여러번 사용하여 state 별로 다른 동작을 구현할 수 있다.
    //2. 두번째 파라미터인 []에 넣은 값에 변화가 있을때 useEffect가 동작한다.
    //3. 렌더링 이후 useEffect가 실행된다.
    //4. Class Compnent의 coponenetDidMount, componentDidUpdate, componentWillUnmount는 하나만 사용할 수 있으며
    //내부에서 state를 조건 분기하여 처리해야 한다.
    useEffect(() => { //componentDidMount, componentDidUpdate 역할(1 대 1 대응은 아님)
        interval.current = setInterval(changeHand, 1000);
        return () => { //componentWillUnmount 역할
            clearInterval(interval.current);
        }
    }, [imgCoord]);

    const changeHand =() => {
        if(imgCoord === rspCoords.바위) {
            setImgCoord(rspCoords.가위);
        } else if(imgCoord === rspCoords.가위) {
            setImgCoord(rspCoords.보);
        } else if(imgCoord === rspCoords.보) {
            setImgCoord(rspCoords.바위);
        } 
    };

    const onClickBtn = (choice) => (e) => {
        e.preventDefault();
        clearInterval(interval.current);
        const myScore = scores[choice];
        const cpuScore = scores[computerChoice(imgCoord)];
        const diff = myScore - cpuScore;
        if(diff === 0) {
            setResult('비겼습니다.!');
        } else if([-1, 2].includes(diff)) {
            setResult('이겼습니다.!');
            setScore((prevScore) => {
                return prevScore + 1
            });
        } else {
            setResult('졌습니다.!');
            setScore((prevScore) => {
                return prevScore - 1
            });
        }
        setTimeout(() => {
            interval.current = setInterval(changeHand, 100);    
        }, 2000);
    };

    return (
        <>
            <div id="computer" style={{ background: `url(https://en.pimg.jp/023/182/267/1/23182267.jpg) ${imgCoord} 0`}} />
            <div>
                <button id="scissor" className="btn" onClick={onClickBtn('가위')}>가위</button>
                <button id="rock" className="btn" onClick={onClickBtn('바위')}>바위</button>
                <button id="paper" className="btn" onClick={onClickBtn('보')}>보</button>
            </div>
            <div>{result}</div>
            <div>현재 {score}점</div>
        </>
    );
};

export default RSP;