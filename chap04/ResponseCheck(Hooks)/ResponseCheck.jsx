import React,  { useRef, useState } from 'react';

const ResponseCheck = () => {
    //1. state를 set 함수를 통해 값을 변경하면 랜더링이 일어나지만 ref로 할당된 변수의 값은 변경해도 랜더링이 발생하지 않음
    //2. ref 용도 -> (1) dom에 대한 접근, (2) 랜더링 없이 변경되는 값을 관리하고자 하는경우
    const [state, setState] = useState('waiting');
    const [message, setMessage] = useState('클릭해서 시작하세요.');
    const [result, setResult] = useState([]);
    const timeout = useRef(null);
    const startTime = useRef();
    const endTime = useRef();

    const onClickScreen = () => {
        if(state === 'waiting') {
            setState('ready');
            setMessage('초록색이 되면 클릭하세요.');
            timeout.current = setTimeout(() => {
                setState('now');
                setMessage('지금 클릭');
                startTime.current = new Date();
            }, Math.floor(Math.random() * 1000) + 2000); //2~3초 랜덤
        } else if(state === 'ready') { //성급하게 클릭
            clearTimeout(timeout);
            setState('waiting');
            setMessage('너무 성급하시군요! 초록색이 된 후에 클릭하세요.');
        } else if(state === 'now') { //반응속도 체크
            endTime.current = new Date();
            setState('waiting');
            setMessage('클릭해서 시작하세요.');
            setResult((prevResult) => {
                return [...prevResult, endTime.current - startTime.current];
            });
        }
    }; 

    const onReset = () => {
        setResult([]);
    };

    const renderAverage = () => {
        return result.length === 0 
            ? null 
            : <>
                <div>평균 시간: {result.reduce((a, c) => a + c) / result.length}ms</div>
                <button onClick={onReset}>리셋</button>
            </>
    };

    //1. return ();가 일반적으로 쓰이지만 return []를 사용하기도 한다.
    //2. return [
    //    <div key="사과">사과</div>
    //    <div key="배">배</div>
    //    <div key="감">감</div>
    //  ];
    return (
        //1. JSX에서 {}를 사용하면 자바스크립트 코드를 작성할 수 있다.
        //2. JSX에서 if, for문을 사용할 수 없다.
        //3. JSX에서 {}를 선언하고 {} 내부에서 즉시실행함수를 작성하면 함수 내부에서는 if, for문이 사용 가능하다.
        //4. React 주석 : {/* */}
        <>
            <div
                id="screen"
                className={state}
                onClick={onClickScreen}
            >
                {message}
            </div>
            {/*{(() => {
                if(result.length === 0) {
                    return null;
                } else {
                    return <>
                        <div>평균 시간: {result.reduce((a, c) => a + c) / result.length}ms</div>
                        <button onClick={onReset}>리셋</button>
                    </>;
                }
            })()}*/}
            {renderAverage()}
        </>
    );
};

export default ResponseCheck;