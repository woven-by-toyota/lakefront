import { FC, MouseEventHandler, ReactNode } from 'react';
import { StatusRowStyle } from './statusTableStyles';
import { ThemeProvider } from '@emotion/react';
import theme from 'src/styles/theme';

export enum Status {
    RUNNING = 'Running',
    ENQUEUED = 'Enqueued',
    ERROR = 'Error',
    FAILED = 'Failed',
    NONE = 'None'
}

export interface StatusRowProps {
    /**
     * The children to display within row.
     */
    children?: ReactNode;
    /**
     * This is to set the status.
     */
    status?: Status;
    /**
     * This is to set an external classname.
     */
    className?: string;

    /**
     * This is to handle the row click event.
     */
    onRowClick?: () => void;
}

/**
 *  Status Row Component is used to render the row with various colums.
 */
const StatusRow: FC<StatusRowProps> = ({ children, status = Status.NONE, className, onRowClick }) => {

    const handleOnClick: MouseEventHandler<HTMLTableRowElement> = () => {
        if (onRowClick) {
            onRowClick();
        }
    };

    return (
            <StatusRowStyle className={className} status={status} rowClick={Boolean(onRowClick)} onClick={handleOnClick}>
                {children}
            </StatusRowStyle>
    );
};

export default StatusRow;
