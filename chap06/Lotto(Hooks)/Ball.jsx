import React, {memo} from 'react';

//1. Ball은 함수형 컴포넌트이지만 Hooks는 아니다. Hooks는 useState, useEffect를 지칭한다.
//2. Ball 컴포넌트를 memo 컴포넌트로 감쌌는데 이렇게 컴포넌트를 다른 컴포넌트로 감싼것을 High Order Component(HOC)라고 한다.
//3. 컴포넌트를 매개변수로 하여 로직을 추가해서 기능을 더한 컴포넌트를 반환하는 것을 High Order Component(HOC)라고 한다.
const Ball = memo(({ number }) => {
    let background;
    if(number <= 10) {
        background = 'red';
    } else if(number <= 20) {
        background = 'orange';
    } else if(number <= 30) {
        background = 'yellow';
    } else if(number <= 40) {
        background = 'blue';
    } else {
        background = 'green';
    }
    return (
        <div className="ball" style={{background}}>{number}</div>
    );
});

export default Ball;