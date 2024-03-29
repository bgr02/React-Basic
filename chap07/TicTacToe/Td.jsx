import React, { useCallback, useEffect, useRef, memo } from 'react';
import { CLICK_CELL } from './TicTacToe';

const Td = memo(({ rowIndex, cellIndex, dispatch, cellData }) => {
    console.log('td rendered');

    const ref = useRef([]);
    useEffect(() => {
        //어떤 state가 변해서 렌더링이 되고 있는지에 대한 검사
        console.log(rowIndex === ref.current[0], cellIndex === ref.current[1], dispatch === ref.current[2], cellData === ref.current[3]);
        ref.current = [rowIndex, cellIndex, dispatch, cellData];
    }, [rowIndex, cellIndex, dispatch, cellData]);

    const onClickTd = useCallback(() => {
        console.log(rowIndex, cellIndex);
        if(cellData) {
            return;
        }
        dispatch({type: CLICK_CELL, row: rowIndex, cell: cellIndex});
    }, [cellData]);

    return (
        <td onClick={onClickTd}>{cellData}</td>
    );
});

export default Td;