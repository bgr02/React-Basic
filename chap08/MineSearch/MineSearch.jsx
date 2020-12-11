import React, { useReducer, createContext, useMemo, useEffect } from 'react';
import Form from './Form';
import Table from './Table';

export const CODE = {
    MINE: -7,
    NORMAL: -1,
    QUESTION: -2,
    FLAG: -3,
    QUESTION_MINE: -4,
    FLAG_MINE: -5,
    CLICKED_MINE: -6,
    OPENED: 0 //0이상이면 다 OPENED
}

//createContext에서 전달할 값을 초기회 및 export
export const TableContext = createContext({
    tableData: [],
    halted: true,
    dispatch: () => {}
});

const initialState = {
    tableData: [],
    data: {
        row: 0,
        cell: 0,
        mine: 0
    },
    timer: 0,
    result: '',
    halted: true,
    openedCount: 0
}

const plantMine = (row, cell, mine) => {
    console.log(row, cell, mine);
    const candidate = Array(row * cell).fill().map((arr, i) => {
        return i;
    });
    const shuffle = [];
    while(candidate.length > row * cell - mine) {
        const chosen = candidate.splice(Math.floor(Math.random() * candidate.length), 1)[0];
        shuffle.push(chosen);
    }
    const data = [];
    for (let i = 0; i < row; i++) {
        const rowData = [];
        data.push(rowData);
        for (let j=0; j < cell; j++) {
            rowData.push(CODE.NORMAL);
        }
    }

    for (let k = 0; k < shuffle.length; k++) {
        const ver = Math.floor(shuffle[k] / cell);
        const hor = shuffle[k] % cell;
        data[ver][hor] = CODE.MINE;
    }

    console.log(data);
    return data;
};

export const START_GAME = 'START_GAME';
export const OPEN_CELL = 'OPEN_CELL';
export const CLICK_MINE = 'CLICK_MINE';
export const FLAG_CELL = 'FLAG_CELL';
export const QUESTION_CELL = 'QUESTION_CELL';
export const NORMALIZE_CELL = 'NORMALIZE_CELL';
export const INCREMENT_TIMER = 'INCREMENT_TIMER';

//reducer: action 발생시 state를 어떻게 처리할지를 담당
const reducer = (state, action) => {
    switch (action.type) {
        case START_GAME:
            return {
                ...state,
                data: {
                    row: action.row, 
                    cell: action.cell, 
                    mine: action.mine
                },
                openedCount: 0,
                tableData: plantMine(action.row, action.cell, action.mine),
                halted: false,
                timer: 0
            };
        case OPEN_CELL:{
            const tableData = [...state.tableData];
            tableData.forEach((row, i) => {
                tableData[i] = [...row];
            });
            const checked = [];
            let cellCount = 0;
            const checkAround = (row, cell) => {
                //닫힌칸만 열기
                if([CODE.OPENED, CODE.FLAG_MINE, CODE.FLAG, CODE.QUESTION_MINE, CODE.QUESTION].includes(tableData[row][cell])) {
                    return;
                }
                //상하좌우 없는칸은 안열기
                if(row < 0 || row >= tableData.length || cell < 0 || cell >= tableData[0].length) { //상하좌우 칸이 아닌경우 필터링
                    return;
                }
                //이미 검사한 칸인지를 체크
                if(checked.includes(row + ',' + cell)) { 
                    return;
                } else {
                    checked.push(row + ',' + cell);
                }
                let around = [];
                if(tableData[row - 1]) {
                    around = around.concat(
                        tableData[row - 1][cell - 1],
                        tableData[row - 1][cell],
                        tableData[row - 1][cell + 1]
                    );
                }
                around = around.concat(
                    tableData[row][cell - 1],
                    tableData[row][cell + 1]
                );
                if(tableData[row + 1]) {
                    around = around.concat(
                        tableData[row + 1][cell - 1],
                        tableData[row + 1][cell],
                        tableData[row + 1][cell + 1]
                    );
                }
                const count = around.filter((v) => [CODE.MINE, CODE.FLAG_MINE, CODE.QUESTION_MINE].includes(v)).length;
                if(count === 0) {
                    if(row > -1) {
                        const near = [];
                        if(row - 1 > -1) {
                            near.push([row - 1, cell - 1]);
                            near.push([row - 1, cell]);
                            near.push([row - 1, cell + 1]);
                        }
                        near.push([row, cell - 1]);
                        near.push([row, cell + 1]);
                        if(row + 1 < tableData.length) {
                            near.push([row + 1, cell - 1]);
                            near.push([row + 1, cell]);
                            near.push([row + 1, cell + 1]);
                        }
                        near.forEach((n) => {
                            if(tableData[n[0]][n[1]] !== CODE.OPENED) {
                                checkAround(n[0], n[1]);
                            }
                        });
                    }
                }
                if(tableData[row][cell] === CODE.NORMAL) { //칸이 닫힌칸인 경우 카운트 증가
                    cellCount += 1;
                }
                tableData[row][cell] = count;
            };
            checkAround(action.row, action.cell);
            let halted = false;
            let result = '';
            console.log(state.data.row * state.data.cell - state.data.mine, state.openedCount, cellCount);
            if(state.data.row * state.data.cell - state.data.mine === state.openedCount + cellCount) { //승리
                halted = true;
                result = `${state.timer}초만에 승리하셨습니다.`;
            }
            return {
                ...state,
                tableData,
                openedCount: state.openedCount + cellCount,
                halted,
                result
            };
        }
        case CLICK_MINE:{
            const tableData = [...state.tableData];
            tableData[action.row] = [...state.tableData[action.row]];
            tableData[action.row][action.cell] = CODE.CLICKED_MINE;
            return {
                ...state,
                tableData,
                halted: true //게임중지 여부
            };
        }
        case FLAG_CELL:{
            const tableData = [...state.tableData];
            tableData[action.row] = [...state.tableData[action.row]];
            
            if(tableData[action.row][action.cell] === CODE.MINE) {
                tableData[action.row][action.cell] = CODE.FLAG_MINE;
            } else {
                tableData[action.row][action.cell] = CODE.FLAG;
            }

            return {
                ...state,
                tableData
            };
        }
        case QUESTION_CELL:{
            const tableData = [...state.tableData];
            tableData[action.row] = [...state.tableData[action.row]];
            
            if(tableData[action.row][action.cell] === CODE.FLAG_MINE) {
                tableData[action.row][action.cell] = CODE.QUESTION_MINE;
            } else {
                tableData[action.row][action.cell] = CODE.QUESTION;
            }

            return {
                ...state,
                tableData
            };
        }
        case NORMALIZE_CELL:{
            const tableData = [...state.tableData];
            tableData[action.row] = [...state.tableData[action.row]];
            
            if(tableData[action.row][action.cell] === CODE.QUESTION_MINE) {
                tableData[action.row][action.cell] = CODE.MINE;
            } else {
                tableData[action.row][action.cell] = CODE.NORMAL;
            }

            return {
                ...state,
                tableData
            };
        }
        case INCREMENT_TIMER: {
            return {
                ...state,
                timer: state.timer + 1
            }
        }
        default:
            return state;
    }
};

const MineSearch = () => {
    const [state, dispatch] = useReducer(reducer, initialState);
    const { tableData, halted, timer, result } = state;

    //Context Api 사용시 useMemo를 사용하면 성능저하를 줄일 수 있다.
    //dispatch는 항상 같게 유지되기 때문에 바뀌는 대상으로 설정하지 않아도 됨.
    const value = useMemo(() => {
        return { tableData: tableData, halted: halted, dispatch }
    }, [tableData, halted]);

    useEffect(() => {
        let timer;
        if(halted === false ) {
            timer = setInterval(() => {
                dispatch({ type: INCREMENT_TIMER });
            }, 1000);
        }
        
        return () => {
            clearInterval(timer);
        }
    }, [halted]);

    return (
        //TableContext.Provider 태그 하위의 태그들은 value로 제공하는 데이터들에 접근할 수 있음.
        //TableContext.Provider 태그 하위의 태그들은 value의 값이 변경될때 마다 렌더링 된다.
        <TableContext.Provider value={value}>
            <Form />
            <div>{timer}</div>
            <Table />
            <div>{result}</div>
        </TableContext.Provider>  
    );
};

export default MineSearch;