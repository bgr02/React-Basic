const React = require('react');
const { useState, useRef } = React;

//hooks
//1. this를 통한 state, method 접근이 없어짐
//2. state, method를 따로 변수로 빼서 사용하므로 다 선언을 해주어야 함
//3. render() 함수 사용하지 않음
//4. hooks에서 ref 접근시 항상 current를 붙여주어야 함(ex. inputRef.current.focus())
const WordRelay = () => {
    const [word, setWord] = useState('제로초');
    const [value, setValue] = useState('');
    const [result, setResult] = useState('');
    const inputRef = useRef(null);

    const onSubmitForm = (e) => {
        e.preventDefault();
        if(word[word.length - 1] === value[0]) {
            setResult('딩동댕');
            setWord(value);
            setValue('');
            inputRef.current.focus();
        } else {
            setResult('땡');
            setValue('');
            inputRef.current.focus();
        }
    };

    const onChangeInput = (e) => {
        setValue(e.target.value);
    };

    return (
        //React에서는 value 프로퍼티를 넣으경우 반드시 onChange 프로퍼티를 같이 명시해주어야 하며
        //만약 value를 사용하지 않고 value값을 지정하려는 경우 defaultValue 프로퍼티로 명시해주어야 함
        <>
            <div>{word}</div>
            <form onSubmit={onSubmitForm}>
                <label htmlFor="wordInput">글자를 입력하세요.</label>
                <input className="wordInput" ref={inputRef} value={value} onChange={onChangeInput}/>
                <button>입력!</button>
            </form>
            <div>{result}</div>
        </>
    );
}

module.exports = WordRelay;