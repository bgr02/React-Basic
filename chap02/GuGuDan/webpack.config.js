const path = require('path');
const webpack = require('webpack');

module.exports = {
    name: 'gugudan-setting',
    mode: 'development', //실서비스: production
    devtool: 'eval', //개발시에는 eval, 실서비스시 hidden-source-map
    resolve: {
        //entry->app의 인자의 확장자를 알아서 찾아줌
        extensions: ['.js', '.jsx']
    },
    //입력
    //client.jsx에서 wordrelay.jsx를 불러오므로  app의 인자로 명시하지 않음
    entry: {
        app: ['./client']
    },
    module: { //entry 파일에 특정 rule을 적용후 output 파일로 생성
        rules: [{
            test: /\.jsx?$/, //js, jsx 파일에 적용됨
            loader: 'babel-loader',
            options: { //babel의 옵션
                //@babel/preset-env: 최신 문법을 이전 문법으로 변환
                //@babel/preset-react: JSX와 같은 react 문법을 지원
                //plugin의 모음이 presets임
                presets: [
                    //preset 각각의 설정이 가능
                    ['@babel/preset-env', {
                        //지원할 브라우저를 지정함(지원할 브라우저를 지정하지 않을시 webpack에서 설정해야 하는 부분들이 많아져서 느려지기 때문)
                        targets: {
                            //> 5% in KR : 한국에서 브라우저 점유율 5%를 차지하는 브라우저는 지원
                            //last 2 chrome versions : 크롬 브라우저 최신버전과 그 이전 버전 지원
                            browsers: ['> 5% in KR', 'last 2 Chrome versions'] //browserslist
                        },
                        debug: true //개발시 debug 체크
                    }],
                    '@babel/preset-react'],
                plugins: []
            }
        }]
    },
    plugins: [
        //모든 loader의 option에 debug: true를 추가
        new webpack.LoaderOptionsPlugin({ debug: true })
    ],
    //출력
    output: {
        //path.join: 파라미터 값들을 합쳐서 경로를 생성
        //__dirname: webpack.confg.js 파일이 있는 폴더의 경로
        path: path.join(__dirname, 'dist'),
        filename: 'app.js'
    }
};