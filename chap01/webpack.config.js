const path = require('path');

module.exports = {
    name: 'wordrelay-setting',
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
            test: /\.jsx?/, //js, jsx 파일에 적용됨
            loader: 'babel-loader',
            options: { //babel의 옵션
                //@babel/preset-env: 최신 문법을 이전 문법으로 변환
                //@babel/preset-react: JSX와 같은 react 문법을 지원
                presets: ['@babel/preset-env', '@babel/preset-react'],
                plugins: ['@babel/plugin-proposal-class-properties']
            }
        }]
    },
    //출력
    output: {
        //path.join: 파라미터 값들을 합쳐서 경로를 생성
        //__dirname: webpack.confg.js 파일이 있는 폴더의 경로
        path: path.join(__dirname, 'dist'),
        filename: 'app.js'
    }
};