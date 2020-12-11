import React, { useContext, memo } from 'react';
import { TableContext } from './MineSearch';
import Tr from './Tr';

//부모 컴포넌트에 memo를 적용한 경우 하위의 자식 컴포넌트들에도 memo를 적용해주어야 함.
const Table = memo(() => {
    const { tableData } = useContext(TableContext);
    return (
        <table>
            {Array(tableData.length).fill().map((tr, i) => <Tr rowIndex={i}/>)}
        </table>
    );
});

export default Table;