import { FC, ReactNode } from 'react';
import { DividerRow } from './statusTableStyles';
import { ThemeProvider } from '@emotion/react';
import theme from 'src/styles/theme';

export interface StatusCardProps {
    /**
     * This is to set the status row.
     */
    statusRow: ReactNode;
    /**
     * This is to set the bottom row.
     */
    bottomRow: ReactNode;
    /**
     * This is to set an external class.
     */
    className?: string;
}

/**
 * Status Card Component is used to render the status and the bottom row.
 */
const StatusCard: FC<StatusCardProps> = ({ statusRow, bottomRow, className }) => {
    return (
        <>
            {statusRow}
            <tr className={className}>{bottomRow}</tr>
            <DividerRow />
        </>
    );
};

export default StatusCard;
