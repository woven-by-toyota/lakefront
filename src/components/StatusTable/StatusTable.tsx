import { FC, ReactNode } from 'react';
import {SortIcon, StatusTableStyle} from './statusTableStyles';
import { ReactComponent as UnfoldMoreIcon } from './__assets__/UnfoldMoreIcon.svg';
import { v4 as uuid } from 'uuid';

export interface StatusTableHeader {
    /** 
     * This property is to set the name of the header.
     */
    name: string;
    /**
     * This is to set the name of the field.
     */
    field?: string;
    /**
     * This is to set whether the field is sortable.
     */
    sortable: boolean;
}

export interface StatusTableProps {
    /**
     * The headers to populate the status table. The header should have a display name, field and sortable
     *  set to true or false.
     */
    headers: StatusTableHeader[];
    /**
     * The children to render inside the table.
     */
    children?: ReactNode
    /**
     * This is an event that triggers whenever the sorting is clicked.
     */
    handleSort?: (field: string) => void;
    /**
     * If set to true, this will render table as Status Table Card. The headers will not be visible.
     */
    cards?: boolean;
    /**
     * This is to set an external class.
     */
    className?: string;
}

/**
 * 
 * Status Table Component has two variations- 1. Status Table with headers 2. Status Table as a card with no headers.
 * The handleSort event is triggered whenever the sorting changes on the table. 
 * You can use this to write your own logic to handle sort.
 * The colors for each row is rendered depending on the status.
 */
const StatusTable: FC<StatusTableProps> = (
    {
        children,
        handleSort,
        headers,
        cards = false,
        className
    }) => {
    if (cards) {
        return (
                <StatusTableStyle className={className} cards>
                    <table>
                        <tbody>
                            {children}
                        </tbody>
                    </table>
                </StatusTableStyle>
        );
    }

    return (
            <StatusTableStyle className={className} cards>
                <table>
                    <thead>
                        <tr>
                            {
                                headers.map(({ name, field = '', sortable }) => (
                                    <th key={uuid()}>
                                        <div
                                            onClick={sortable && handleSort ?
                                                () => handleSort(field) :
                                                undefined}
                                        >
                                            {name}
                                            {
                                                sortable && <SortIcon />
                                            }
                                        </div>
                                    </th>
                                ))
                            }
                        </tr>
                    </thead>
                    <tbody>
                        {children}
                    </tbody>
                </table>
            </StatusTableStyle>
    );
};

export default StatusTable;
