import React, { useEffect, useRef, useState, useMemo, useCallback } from 'react';
import Ball from './Ball';

function getWinNumbers() {
    console.log('getWinNumbers');
    const candidate = Array(45).fill().map((v,i) => i+1);
    const shuffle = [];
    while(candidate.length > 0) {
        shuffle.push(candidate.splice(Math.floor(Math.random() * candidate.length), 1)[0]);
    }
    const bonusNumber = shuffle[shuffle.length - 1];
    const winNumbers = shuffle.slice(0, 6).sort((p, c) => p - c);
    return [...winNumbers, bonusNumber];
}

//1. Hooks(useState, useRef...)는 선언순서도 중요, 특정 변수를 사용한다면 해당 변수가 먼저 선언이 되어있어야 함.
//따라서 Hooks(useState, useRef...)는 조건문, 반복문, 함수에서 사용하면 안된다. 순서가 꼬이기 때문이다.
//2. Hooks(useState, useRef...)는 최상위에 선언하여 실행순서가 같게 하는게 좋다.
const Lotto = () => {
    //useMemo: 복잡한 함수의 값을 캐싱하여 기억하고 있는다. 두번째 파라미터인 배열의 요소가 변경되는 경우만 새롭게 실행을 한다.
    const lottoNumbers = useMemo(() => getWinNumbers(), []);
    const [winNumbers, setWinNumbers] = useState(lottoNumbers);
    const [winBalls, setWinBalls] = useState([]);
    const [bonus, setBonus] = useState(null);
    const [redo, setRedo] = useState(false);
    const timeouts = useRef([]);

    const runTimeouts = () => {
        for(let i=0; i < winNumbers.length - 1; i++) {
            //비동기 함수에서 바깥 변수를 사용하는 경우 클로저 문제가 발생하지만
            //let 문제를 사용할 경우 이러한 문제를 해결할 수 있다.
            //timeouts.current[i] 배열에 요소를 추가하는 것은 state가 변하는 것이 아니다. 따라서 렌더링도 일어나지 않는다. 
            //timeouts.current[i]이 바뀌는 것은 timeouts.current = []와 같이 완전히 새로운 배열을 할당하여 바뀌는 경우를 말한다.
            timeouts.current[i] = setTimeout(() => {
                setWinBalls((prevWinBalls) => {
                    return [...prevWinBalls, winNumbers[i]];
                })
            }, (i + 1) * 1000);
        }
        timeouts.current[6] = setTimeout(() => {
            setBonus(winNumbers[6]);
            setRedo(true);
        }, 7000);
    };

    /*
        componentDidMount에서는 동작하지 않게하고 componentDidUpdate에서만 동작하게 하고 싶은경우의 로직
        const mounted = useRef(false);
        useEffect(() => {
            if(!mounted.current) {
                mounted.current = true;
            } else {
                //ajax
            }
        }, [바뀌는값]);
    */

    //1. useEffect 함수의 두번째 파라미터인 배열을 비워놓은 상태로 동작할 경우 componentDidMount와 같은 동작을 한다.
    //2. useEffect 함수의 두번째 파라미터인 배열에 요소가 있는 상태로 동작할 경우 componentDidMount와 componentDidUpdate의 동작을 수행한다.
    //3. 현재 조건으로 동작하는 경우 처음에 componentDidMount의 역할로 runTimeouts()가 최초 실행되고 그 후 렌더링 될때마다 winBalls.length === 0
    //조건을 만족하는 경우 runTimeouts()를 실행하고 컴포넌트가 사용종료 되어 제거되기 직전 timeouts.current.forEach((v) => clearTimeout(v));를 실행한다.
    useEffect(() => {
        console.log('useEffect');
        runTimeouts();

        return () => {
            timeouts.current.forEach((v) => clearTimeout(v));
        };
    }, [timeouts.current]);

    //useCallback: 함수 자체를 캐싱하여 기억한다. 함수형 컴포넌트는 전체가 렌더링 될때마다 전체가 재실행 되는데 만약 내부에 복잡한 함수가 있다면
    //재실행 될때마다 함수를 생성하여 할당하는데 자원 소모가 생기므로 useCallback을 사용하여 매번 할당이 아닌 한번만 할당하고 사용할 수 있도록 한다.
    //두번째 파라미터인 배열의 요소가 바뀌지 않는경우 새롭게 실행되지 않는다. 즉, 함수 내부의 값들도 변하지 않고 계속 같은 값들을 기억하고 있게된다.
    //useCallback을 반드시 사용하여야 하는 경우가 있다. 자식 컴포넌트에 props로 함수를 넘겨줄때이다. 만약 자식 컴포넌트에 넘겨주는 함수를 useCallback으로 
    //감싸지 않고 보낸다면 자식 컴포넌트에서는 매번 새로운 함수를 할당받게 되고 이로인해 그 때마다 렌더링을 하게되어 성능저하가 일어날수 있다.
    const onClickRedo = useCallback(() => {
        console.log('onClickRedo');
        console.log(winNumbers);
        setWinNumbers(getWinNumbers());
        setWinBalls([]);
        setBonus(null);
        setRedo(false);
        timeouts.current = [];
    }, [winNumbers]);

    return (
        <>
            <div>당첨숫자</div>
            <div id="결과창">
                {winBalls.map((v) => <Ball key={v} number={v}/>)}
            </div>
            <div>보너스!</div>
            {bonus && <Ball number={bonus}/>}
            {redo && <button onClick={onClickRedo}>한 번 더!</button>}
        </>
    );
};

export default Lotto;