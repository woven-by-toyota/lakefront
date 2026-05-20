import { FC, Fragment } from 'react';
import {
    StyledStatusTracker,
    StatusNode,
    StatusNodeCircle,
    StatusLine,
    StatusContent,
    StatusLabel,
    StatusAboveDetails,
    StatusDescription,
    SkeletonCircle,
    SkeletonBar
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
    /**
     * When true, displays skeleton placeholders with fade animation.
     */
    loading?: boolean;
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
    // Determine if min-heights need to be applied for consistent alignment across statuses
    const anyAboveDetails = statuses.some(status => status.aboveDetails);
    const anyDescription = statuses.some(status => status.description);

    return (
        <StyledStatusTracker className={className}>
            {statuses.map((status, index) => (
                <Fragment key={`${status.label}-${index}`}>
                    <StatusNode className='status-node'>
                        {status.loading ? (
                            <StatusContent className='status-content'>
                                {status.aboveDetails && <SkeletonBar className='skeleton-bar above-details' width={80} height={12} />}
                                <SkeletonCircle className='status-circle' />
                                <SkeletonBar className='skeleton-bar' width={100} height={16} />
                                {status.description && <SkeletonBar className='skeleton-bar description' width={120} height={12} />}
                            </StatusContent>
                        ) : (
                            <StatusContent className='status-content'>
                                {anyAboveDetails && (
                                    <StatusAboveDetails className='above-details' title={status.aboveDetails} hasDetails={Boolean(status.aboveDetails)}>{status.aboveDetails || ''}</StatusAboveDetails>
                                )}
                                <StatusNodeCircle className='status-circle' color={status.color} active={status.active} />
                                <StatusLabel className='label' active={status.active}>{status.label}</StatusLabel>
                                {anyDescription && (
                                    <StatusDescription className='description' title={status.description}>{status.description || ''}</StatusDescription>
                                )}
                            </StatusContent>
                        )}
                    </StatusNode>
                    {index < statuses.length - 1 && (
                        <StatusLine className='status-line' active={statuses[index + 1]?.active} />
                    )}
                </Fragment>
            ))}
        </StyledStatusTracker>
    );
};

export default StatusTracker;
