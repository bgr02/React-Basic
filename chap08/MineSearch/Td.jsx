import React, { useCallback, useContext, memo, useMemo } from 'react';
import { CODE, OPEN_CELL, CLICK_MINE, FLAG_CELL, QUESTION_CELL, NORMALIZE_CELL, TableContext } from './MineSearch';

const getTdStyle = (code) => {
    switch (code) {
        case CODE.MINE:
        case CODE.NORMAL:
            return {
                background: '#444'
            }
        case CODE.CLICK_MINE:
        case CODE.OPENED:
            return {
                background: 'white'
            }
        case CODE.QUESTION_MINE:
        case CODE.QUESTION:
            return {
                background: 'yellow'
            }
        case CODE.FLAG_MINE:
        case CODE.FLAG:
            return {
                background: 'red'
            }
        default:
            return {
                background: 'white'
            }
    }   
};

const getTdText = (code) => {
    switch (code) {
        case CODE.NORMAL:
            return '';
        case CODE.MINE:
            return 'X';
        case CODE.CLICKED_MINE:
            return '펑';
        case CODE.FLAG_MINE:
        case CODE.FLAG:
            return '!';
        case CODE.QUESTION_MINE:
        case CODE.QUESTION:
            return '?';
        default:
            return code || '';
    } 
};

//React.memo: React.memo는 동일한 props로 동일한 rendering 결과를 내는경우 해당 결과를 캐싱하여 재사용하는데
//만약 props의 값이 변하는 경우 rendering 결과가 달라지므로 rendering 과정이 일어난다. 여기서 propps는 예를들어
//memo(({ rowIndex, cellIndex }) => {}에서 rowIndex, cellIndex를 말하고 이러한 값이 변하지 않는경우 캐싱한
//rendering 결과를 반환한다. React.memo는 props 변화에 대한 캐싱만을 하기 때문에 컴포넌트 내부의 useState 또는 useContext의
//값이 변하는 경우 React.memo가 적용되어 있는 컴포넌트여도 그때마다 rendering이 일어날 것임.
const Td = memo(({ rowIndex, cellIndex }) => {
    //useContext를 쓰는 컴포넌트는 제공되는 state가 변할때마다 렌더링이 일어남.
    const { tableData, dispatch, halted } = useContext(TableContext);

    const onClickTd = useCallback(() => {
        if(halted) {
            return;
        }

        switch (tableData[rowIndex][cellIndex]) {
            case CODE.OPENED:
            case CODE.FLAG_MINE:
            case CODE.FLAG:
            case CODE.QUESTION_MINE:
            case CODE.QUESTION:
                return;
            case CODE.NORMAL:
                dispatch({ type: OPEN_CELL, row: rowIndex, cell: cellIndex });
                return;
            case CODE.MINE:
                dispatch({ type: CLICK_MINE, row: rowIndex, cell: cellIndex });
                return;
            default:
                return;
        }       
    }, [tableData[rowIndex][cellIndex], halted]);

    const onRightClickTd = useCallback((e) => {
        e.preventDefault();
        if(halted) {
            return;
        }
        switch (tableData[rowIndex][cellIndex]) {
            case CODE.NORMAL:
            case CODE.MINE:
                dispatch({ type: FLAG_CELL, row: rowIndex, cell: cellIndex });
                return;
            case CODE.FLAG_MINE:
            case CODE.FLAG:
                dispatch({ type: QUESTION_CELL, row: rowIndex, cell: cellIndex });
                return;
            case CODE.QUESTION_MINE:
            case CODE.QUESTION:
                dispatch({ type: NORMALIZE_CELL, row: rowIndex, cell: cellIndex });                
                return;
            default:
                return;
        }
    }, [tableData[rowIndex][cellIndex], halted]);

    console.log('td rendered');

    //useMemo를 통해 값을 캐싱하여 렌더링 될때마다 함수 자체가 실행되어도 같은 값일경우 return 함수부분은 재실행되지 않도록 함.
    return useMemo(() => {
        <td style={getTdStyle(tableData[rowIndex][cellIndex])} onClick={onClickTd} onContextMenu={onRightClickTd}>
            {getTdText(tableData[rowIndex][cellIndex])}
        </td>
    }, [tableData[rowIndex][cellIndex]]);

    //컴포넌트로 분리한후 memo를 적용하여 호출
    //return  <RealTd onClickTd={onClickTd} onRightClickTd={onRightClickTd} data={tableData[rowIndex][cellIndex]}/>
});

const RealTd = memo(({ onClickTd, onRightClickTd, data }) => {
    console.log('real td rendered');
    return (
        <td style={getTdStyle(data)} onClick={onClickTd} onContextMenu={onRightClickTd}>
            {getTdText(data)}
        </td>
    );
});

export default Td;