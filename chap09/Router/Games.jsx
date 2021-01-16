import React from 'react';
import { BrowserRouter, HashRouter, Route, Link, Switch } from 'react-router-dom';
import NumberBaseball from '../../chap03/NumberBaseball(Class Component)/numberbaseball';
import RSP from '../../chap05/RSP(Class Component)/RSP';
import Lotto from '../../chap06/Lotto(Class Component)/Lotto';
import GameMatcher from './GameMatcher(Hooks)';

const Games = () => {
    return (
        //router를 사용하려면 router 태그로 하위 태그를 포함하여야 함.
        //페이지 각각 여러개 있는것이 아닌 한 페이지에서 각각의 컴포넌트를 새롭게 만들어 내는것임.
        //BrowserRouter: 새로고침시 오류가 발생함. 이유는 Link 태그를 클릭하여 페이지로 이동하는 방식은
        //프론트에 요청을 하여 페이지를 렌더링 하는데 주소창에 직접 입력하는 방식은 프론트에 요청을 하는것이 아닌
        //서버에 요청을 하기 때문에 화면을 그려내지 못하게 됨.
        //HashRouter: 새로고침시 오류가 발생하지 않음. 이유는 HashRouter를 사용하면 반드시 /#이 주소에 포함되게 되는데
        //이 주소는 프론트만이 알고 서버는 인식하지 못하여 요청이 프론트에서만 일어나기 때문에 화면을 렌더링하는 것이 가능.
        //하지만 이 방식은 SEO(Search Engine Optimize)에서 불리하다. 이유는 검색엔진 봇들이 정보수집을 할때 프론트에 요청하여 정보 수집을
        //하는것이 아니라 서버에 요청하여 정보를 수집하기 때문에 서버에서 주소를 모르므로 해당 사이트는 검색엔진에서 노출이 안될 가능성이 높음.
        //따라서 HashRouter는 잘 사용되지 않음.
        <BrowserRouter>
            {/* 레이아웃: 화면 전환시에도 바뀌지 않고 그대로 남아있는 부분 */}
            <div>
                <Link to="/game/number-baseball?query=10&hello=zerocho&bye=react">숫자야구</Link>
                &nbsp;
                <Link to="/game/rock-scissors-paper">가위바위보</Link>
                &nbsp;
                <Link to="/game/lotto-generator">로또생성기</Link>
                &nbsp;
                <Link to="/game/index">게임매쳐</Link>
            </div>
            {/* 렌더링 부분: 화면 전환시 각 컴포넌트가 렌더링 되어 바뀌는 부분*/}
            <div>
                {/* Switch: poth가 존재해는 첫번째 Route 태그로 이동하면 그 이후 나머지 Route 태그의 컴포넌트는 렌더링 하지않음.
                    즉, 숫자야구를 클릭하면 /game/:name인 페이지가 클릭되서 /game/number-baseball?query=10&hello=zerocho&bye=react 페이지도 나오고
                    /game/number-baseball도 나오게 되는데 이런 현상을 Switch 태그를 사용하게 되면 제일 처음 일치하는 path인 
                    /game/:name인 페이지가 클릭되서 /game/number-baseball?query=10&hello=zerocho&bye=react만 실행이 되고 그 뒤에 있는 
                    /game/number-baseball path는 렌더링 되지 않는다.

                    exact: 주소가 완전히 일치하는 경우의 페이지만 렌더링한다.
                */}
                    <Switch>
                        {/* Switch 태그안에 Link 태그로 들어오는 경로와 연결될 Route 태그를 모두 서술해 놓아야 Link 태그를 눌렀을때 
                            이동할 페이지가 생성이 됨.
                        */}
                        {/* Route 태그에서 지정한 컴포넌트이기 때문에 location, match, history는 prop으로 넘겨주지 않아도 알아서 가지고 있음 */}
                        <Route path="/game/:name" component={ GameMatcher } />
                        <Route path="/game/number-baseball" render={(props) => <GameMatcher {...props} />} />
                        {/* props 넘기는 방법 */}
                        {/* component 사용, 랜더링할때마다 새로운 컴포넌트를 생성(언마운트 -> 마운트가 랜더링때마다 발생) */}
                        {/*<Route path="/game/:name" component={() => <GameMatcher props={}/>} />*/}
                        {/* render를 사용, render를 사용시 자식 컴포넌트에 props를 무조건 넘겨주어야 에러가 안남, Best Practice이며 
                        랜더링이되어도 무분별한 컴포넌트 생성이 발생하지 않음. */}
                        {/*<Route path="/game/:name" render={(props) => <GameMatcher {...props}/>} />*/}
                    </Switch>
            </div>
        </BrowserRouter>
    ); 
};

export default Games;