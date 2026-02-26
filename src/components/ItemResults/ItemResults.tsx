import React from 'react';
import theme from 'src/styles/theme';
import { ThemeProvider } from '@emotion/react';
import { ItemStyleContainer } from './itemResultsStyles';

export interface ItemResultsProps {
    /**
     * The current number of data elements being displayed.
     */
    dataLength: number;
    /**
     * The total number of data elements.
     */
    totalItems: number;
    /**
     * The classes to pass to the item results.
     */
    className?: string;
}

const ItemResults: React.FC<ItemResultsProps> = ({ dataLength, totalItems, className }) => {
    const digitGroupSeparator = (number: number) => {
        if (number && typeof number === 'number') {
            return number.toLocaleString();
        }
        return '0';
    };

    const current = digitGroupSeparator(dataLength);
    const total = digitGroupSeparator(totalItems);

    return (
            <ItemStyleContainer className={className}>
                {dataLength > 0 && totalItems > 0 ? `1 - ${current} of ${total}` : '0 results'}
            </ItemStyleContainer>
    );
};

export default ItemResults;
