import React, { useRef, useEffect, memo } from 'react';
import Td from './Td';

const Tr = memo(({ rowData, rowIndex, dispatch }) => {
    console.log('tr rendered');

    const ref = useRef([]);
    useEffect(() => {
        //어떤 state가 변해서 렌더링이 되고 있는지에 대한 검사
        console.log(rowData === ref.current[0], rowIndex === ref.current[1], dispatch === ref.current[2]);
        ref.current = [rowData, rowIndex, dispatch];
    }, [rowData, rowIndex, dispatch]);

    //useMemo는 함수의 값뿐만 아니라 컴포넌트를 캐싱하여 기억할 수 있다.(렌더링 최적화시 사용) -> 확실하지 않음.
    return (
        <tr>
            {Array(rowData.length).fill().map((td, i) => <Td key={i} dispatch={dispatch} rowIndex={rowIndex} cellIndex={i} cellData={rowData[i]}>{}</Td>)}
        </tr>
    );
});

export default Tr;