import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import NumberBaseball from '../../chap03/NumberBaseball(Class Component)/numberbaseball';
import RSP from '../../chap05/RSP(Class Component)/RSP';
import Lotto from '../../chap06/Lotto(Class Component)/Lotto';

//NumberBaseball, RSP, Lotto를 함수형 컴포넌트로 가져다 사용하지 않는 이유는 다른 폴더의 컴포넌트를 사용하였기 때문임.
//정확히는 다른 폴더의 함수형 컴포넌트를 가져다 사용하면 다른 폴더에 있는 node_modules의 패키지들과 충돌이 일어남.
class GameMatcher extends Component {
    render() {
        let urlSearchParms = new URLSearchParams(this.props.location.search.slice(1));
        //urlSearchParms 자체는 빈 객체로 나오지만 get 메서드를 통해서 조회해보면 값이 나옴.
        console.log(urlSearchParms.get('hello'));
        if(this.props.match.params.name === 'number-baseball') {
            return <NumberBaseball />
        } else if(this.props.match.params.name === 'rock-scissors-paper') {
            return <RSP />
        } else if(this.props.match.params.name === 'lotto-generator') {
            return <Lotto />
        }
        return (
            <div>
                일치하는 게임이 없습니다.
            </div>      
        );
    };
}

//Hooks에서의 withRouter 사용법
// const GameMatcher = withRouter(({ location, match, history }) => {
//     return (
//         <>
//         </>
//     );
// });

export default GameMatcher;
//withRouter로 감싸서 사용시 Route 태그의 component가 아니더라도 Class Component안에서 props로 Route 정보를 받아쓸 수 있음.
//export default withRouter(GameMatcher);