const React = require('react');
const { Component } = React;

class WordRelay extends Component {
    state = {
        word: '제로초',
        value: '',
        result: ''
    };

    onSubmitForm = (e) => {
        e.preventDefault();
        if(this.state.word[this.state.word.length - 1] === this.state.value[0]) {
            this.setState({
                result: '딩동댕',
                word: this.state.value,
                value: ''
            });
            this.input.focus();
        } else {
            this.setState({
                result: '땡',
                value: ''
            });
            this.input.focus();
        }
    };

    onChangeInput = (e) => {
        this.setState({
            value: e.target.value
        })
    };

    input;

    onRefInput = (c) => {
        this.input = c;
    };
    
    render() {
        return (
            //React에서는 value 프로퍼티를 넣으경우 반드시 onChange 프로퍼티를 같이 명시해주어야 하며
            //만약 value를 사용하지 않고 value값을 지정하려는 경우 defaultValue 프로퍼티로 명시해주어야 함
            <>
                <div>{this.state.word}</div>
                <form onSubmit={this.onSubmitForm}>
                    <input ref={this.onRefInput} value={this.state.value} onChange={this.onChangeInput}/>
                    <button>입력!</button>
                </form>
                <div>{this.state.result}</div>
            </>
        );
    }
}

module.exports = WordRelay;