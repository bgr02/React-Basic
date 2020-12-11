import React, { memo, useState } from 'react';

//Class Component에 PureComponent가 있다면 Hooks에는 Memo가 있다.
//Memo는 PureComponent와 같은 기능을 하며 컴포넌트를 Memo로 감싸서 사용한다.
const Test = memo(() => {
    const [counter, setCounter] = useState(0);
    const [string, setString] = useState('hello');
    const [number, setNumber] = useState(1);
    const [boolean, setBoolean] = useState(boolean);
    const [object, setObject] = useState({});
    const [array, setArray] = useState([]);

    const onClick = () => {
        setArray();
    };

    return (
        <div>
            <button onClick={onClick}>클릭</button>
        </div>
    );
});

export default Test;