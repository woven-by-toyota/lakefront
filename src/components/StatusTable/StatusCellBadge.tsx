import { FC } from 'react';
import { humanize } from 'src/lib/format.js';
import { Status } from './StatusRow';
import { StatusCellBadgeStyle } from './statusTableStyles';
import { ThemeProvider } from '@emotion/react';
import theme from 'src/styles/theme';

export interface StatusCellBadgeProps {
    /**
     * This is to set the status.
     */
    status: string;
    /**
     * This is to set an external class.
     */
    className?: string;
}

/**
 *  Status Cell Badge Component will display a round bullet colored according to the status and 
 *  display the status. 
 */
const StatusCellBadge: FC<StatusCellBadgeProps> = ({ status = Status.NONE, className }) => {
    const styleKey = (Status as any)[status];

    return (
            <StatusCellBadgeStyle className={className} status={styleKey}>
                {humanize(status)}
            </StatusCellBadgeStyle>
    );
};

export default StatusCellBadge;
