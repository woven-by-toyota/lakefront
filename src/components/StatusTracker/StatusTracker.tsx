import { FC, Fragment } from 'react';
import {
    StyledStatusTracker,
    StatusNode,
    StatusNodeCircle,
    StatusLine,
    StatusContent,
    StatusLabel,
    StatusAboveDetails,
    StatusDescription
} from './statusTrackerStyles';

export interface StatusItem {
    /**
     * The label for the status node.
     */
    label: string;
    /**
     * Optional description shown below the status node.
     */
    description?: string;
    /**
     * Optional details shown above the status node.
     */
    aboveDetails?: string;
    /**
     * Color for the status node. Defaults to theme primary.
     */
    color?: string;
    /**
     * When true, displays a pulsing ring around the node and fades the label.
     */
    active?: boolean;
}

export interface StatusTrackerProps {
    /**
     * Array of status items to display.
     */
    statuses: StatusItem[];
    /**
     * The classes to pass to the component.
     */
    className?: string;
}

/**
 * StatusTracker Component
 *
 * The StatusTracker component displays a horizontal timeline of status nodes with optional details and descriptions.
 * The component adjusts to 100% width of its parent container, with connecting lines between nodes.
 *
 */
const StatusTracker: FC<StatusTrackerProps> = ({ statuses, className }) => {
    return (
        <StyledStatusTracker className={className}>
            {statuses.map((status, index) => (
                <Fragment key={`${status.label}-${index}`}>
                    <StatusNode>
                        <StatusContent>
                            {status.aboveDetails && (
                                <StatusAboveDetails>{status.aboveDetails}</StatusAboveDetails>
                            )}
                            <StatusNodeCircle color={status.color} active={status.active} />
                            <StatusLabel active={status.active}>{status.label}</StatusLabel>
                            {status.description && (
                                <StatusDescription>{status.description}</StatusDescription>
                            )}
                        </StatusContent>
                    </StatusNode>
                    {index < statuses.length - 1 && (
                        <StatusLine active={statuses[index + 1]?.active} />
                    )}
                </Fragment>
            ))}
        </StyledStatusTracker>
    );
};

export default StatusTracker;
