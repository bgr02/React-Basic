import React from 'react';

const Try = ({ tryInfo }) => {
    //부모에서 받은 props는 자식이 바꿀 수 없고 부모에서 바꾸어야 함
    //아니면 state에 props를 담아서 사용하여 해당 state를 변경하는 식으로 사용한다.
    return (
        <li>
            <div>{tryInfo.try}</div>
            <div>{tryInfo.result}</div>
        </li>
    );
};

export default Try;