import React, { useState, useReducer, useCallback, useEffect } from 'react';
import Table from './Table';

const initialState = {
    winner: '',
    turn: 'O',
    tableData: [['', '', ''], ['', '', ''], ['', '', '']],
    recentCell: [-1, -1]
}

export const SET_WINNER = 'SET_WINNER';
export const CLICK_CELL = 'CLICK_CELL';
export const CHANGE_TURN = 'CHANGE_TURN';
export const RESET_GAME = 'RESET_GAME';

const reducer = (state, action) => {
    switch(action.type) {
        case SET_WINNER:
            //state.winner = action.winner; 이런 방식은 사용금지
            return {
                ...state,
                winner: action.winner
            }
        case CLICK_CELL: {
            const tableData = [...state.tableData];
            tableData[action.row] = [...tableData[action.row]]; //immer라는 라이브러리로 가독성 문제 해결
            tableData[action.row][action.cell] = state.turn;
            return {
                ...state,
                tableData,
                recentCell: [action.row, action.cell]
            }
        }
        case CHANGE_TURN: {
            return {
                ...state,
                turn: state.turn === 'O' ? 'X' : 'O'
            }
        }
        case RESET_GAME: {
            return {
                ...state,
                turn: 'O',
                tableData: [['', '', ''], ['', '', ''], ['', '', '']],
                recentCell: [-1, -1]
            }
        }
        default:
            return state;
    }
}

const TicTacToc = () => {
    //useReducer에서 state는 비동기적으로 바뀐다.(React도 마찬가지)
    //reducer: 액션객체를 어떻게 처리할지에 대해 정의, dispatch에 의해 실행
    //initialState: state 객체
    const [state, dispatch] = useReducer(reducer, initialState);
    const { tableData, turn, winner, recentCell } = state;

    //const [winner, setWinner] = useState('');
    //const [turn, setTurn] = useState('0');
    //const [tableData, setTableData] = useState([['', '', ''], ['', '', ''], ['', '', '']]);
    
    const onClickTable = useCallback(() => {
        //dispatch는 내부의 객체는 액션객체
        //dispatch는 내부의 액션객체를 실행
        dispatch({
            type: SET_WINNER,
            winner: 'O'
        });
    }, []);

    //state는 비동기적으로 변하는데 이러한 state에 대한 처리는 useEffect에서 처리한다.
    useEffect(() => {
        const [row, cell] = recentCell;
        if(row < 0) {
            return;
        }

        let win  = false;

        if(tableData[row][0] === turn && tableData[row][1] === turn && tableData[row][2] === turn) {
            win = true;
        }
        if(tableData[0][cell] === turn && tableData[1][cell] === turn && tableData[2][cell] === turn) {
            win = true;
        }
        if(tableData[0][0] === turn && tableData[1][1] === turn && tableData[2][2] === turn) {
            win = true;
        }
        if(tableData[0][2] === turn && tableData[1][1] === turn && tableData[2][0] === turn) {
            win = true;
        }

        if(win) { //승리시
            dispatch({ type: SET_WINNER, winner: turn });
            dispatch({ type: RESET_GAME });
        } else { //무승부 검사
            let all = true; //all이 true면 무승부라는 뜻
            tableData.forEach((row) => {
                row.forEach((cell) => {
                    if(!cell) {
                        all = false;
                    }
                });
            });
            if(all) {
                dispatch({ type: RESET_GAME });
            } else {
                dispatch({type: CHANGE_TURN});
            }
        }
    }, [recentCell]);

    return (
        <>
            <Table onClick={onClickTable} tableData={tableData} dispatch={dispatch}/>
            {winner && <div>{winner}님의 승리</div>}
        </>
    );
};

export default TicTacToc;