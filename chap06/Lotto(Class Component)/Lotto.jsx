import React, { Component } from 'react';
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

class Lotto extends Component {
    state = {
        winNumbers: getWinNumbers(), //당첨숫자
        winBalls: [],
        bonus: null, //보너스공
        redo: false
    };

    timeouts = [];

    runTimeouts = () => {
        const { winNumbers } = this.state;
        for(let i=0; i < winNumbers.length - 1; i++) {
            //비동기 함수에서 바깥 변수를 사용하는 경우 클로저 문제가 발생하지만
            //let 문제를 사용할 경우 이러한 문제를 해결할 수 있다.
            this.timeouts[i] = setTimeout(() => {
                this.setState((prevState) => {
                    return {
                        winBalls: [...prevState.winBalls, winNumbers[i]]
                    }
                });
            }, (i + 1) * 1000);
        }
        this.timeouts[6] = setTimeout(() => {
            this.setState({
                bonus: winNumbers[6],
                redo: true //한 번 더! 버튼의 표시여부
            });
        }, 7000);
    };

    componentDidMount() {
       this.runTimeouts();
    }

    componentDidUpdate(prevProps, prevState) {
        if(this.timeouts.length === 0) {
            this.runTimeouts();
        }
    }

    componentWillUnmount() {
        this.timeouts.forEach((v) => {
            clearTimeout(v);
        });
    }

    onClickRedo = () => {
        this.setState({
            winNumbers: getWinNumbers(), //당첨숫자
            winBalls: [],
            bonus: null, //보너스공
            redo: false
        });
        this.timeouts = [];
    }

    render() {
        const { winBalls, bonus, redo } = this.state;
        return (
            <>
                <div>당첨숫자</div>
                <div id="결과창">
                    {winBalls.map((v) => <Ball key={v} number={v}/>)}
                </div>
                <div>보너스!</div>
                {bonus && <Ball number={bonus}/>}
                {redo && <button onClick={this.onClickRedo}>한 번 더!</button>}
            </>
        );
    }
}

export default Lotto;