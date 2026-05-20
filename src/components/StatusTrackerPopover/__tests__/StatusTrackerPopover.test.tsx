import React from 'react';
import { renderWithTheme } from 'src/lib/testing';
import StatusTrackerPopover from '../StatusTrackerPopover';
import { green, saturatedBlue } from 'src/styles/lakefrontColors';
import * as usePopoverUtil from 'src/lib/hooks/usePopover/usePopoverUtil';

let createObserverSpy: jest.SpyInstance;
let mockIntersectionObserver: IntersectionObserver;

beforeEach(() => {
    jest.clearAllMocks();

    mockIntersectionObserver = {
        observe: jest.fn(),
        unobserve: jest.fn(),
        root: null,
        rootMargin: '0px 0px 0px 0px',
        thresholds: [],
        disconnect: () => null,
        takeRecords: () => [],
        scrollMargin: ''
    };
    createObserverSpy = jest.spyOn(usePopoverUtil, 'createObserver').mockImplementation(() => {
        return mockIntersectionObserver;
    });
});

describe('StatusTrackerPopover Component', () => {
    const basicStatuses = [
        { label: 'Started' },
        { label: 'In Progress' },
        { label: 'Complete' }
    ];

    it('renders children', () => {
        const { getByText } = renderWithTheme(
            <StatusTrackerPopover statuses={basicStatuses} visible={true}>
                <button>Click Me</button>
            </StatusTrackerPopover>
        );

        expect(getByText('Click Me')).toBeInTheDocument();
    });

    it('renders StatusTracker when visible is true', () => {
        const { getByText } = renderWithTheme(
            <StatusTrackerPopover statuses={basicStatuses} visible={true}>
                <button>Trigger</button>
            </StatusTrackerPopover>
        );

        expect(getByText('Started')).toBeInTheDocument();
        expect(getByText('In Progress')).toBeInTheDocument();
        expect(getByText('Complete')).toBeInTheDocument();
    });

    it('does not render StatusTracker when visible is false', () => {
        const { queryByText } = renderWithTheme(
            <StatusTrackerPopover statuses={basicStatuses} visible={false}>
                <button>Trigger</button>
            </StatusTrackerPopover>
        );

        expect(queryByText('Started')).not.toBeInTheDocument();
        expect(queryByText('In Progress')).not.toBeInTheDocument();
        expect(queryByText('Complete')).not.toBeInTheDocument();
    });

    it('does not render popover when statuses array is empty', () => {
        const { container } = renderWithTheme(
            <StatusTrackerPopover statuses={[]} visible={true}>
                <button>Trigger</button>
            </StatusTrackerPopover>
        );

        const popover = container.querySelector('[class*="StyledStatusTrackerPopover"]');
        expect(popover).not.toBeInTheDocument();
    });

    it('passes status props correctly to StatusTracker', () => {
        const statusesWithDetails = [
            {
                label: 'Started',
                description: '2024-01-15 10:30 AM',
                aboveDetails: 'John Doe',
                color: green
            },
            {
                label: 'Complete',
                description: '2024-01-15 04:30 PM',
                aboveDetails: 'Jane Smith',
                color: saturatedBlue
            }
        ];

        const { getByText } = renderWithTheme(
            <StatusTrackerPopover statuses={statusesWithDetails} visible={true}>
                <button>Trigger</button>
            </StatusTrackerPopover>
        );

        expect(getByText('Started')).toBeInTheDocument();
        expect(getByText('2024-01-15 10:30 AM')).toBeInTheDocument();
        expect(getByText('John Doe')).toBeInTheDocument();
        expect(getByText('Complete')).toBeInTheDocument();
        expect(getByText('2024-01-15 04:30 PM')).toBeInTheDocument();
        expect(getByText('Jane Smith')).toBeInTheDocument();
    });

    it('applies custom className', () => {
        const { container } = renderWithTheme(
            <StatusTrackerPopover
                statuses={basicStatuses}
                visible={true}
                className="custom-popover-class"
            >
                <button>Trigger</button>
            </StatusTrackerPopover>
        );

        expect(container.firstChild).toHaveClass('custom-popover-class');
    });

    it('handles renderInPortal prop', () => {
        const { container } = renderWithTheme(
            <StatusTrackerPopover
                statuses={basicStatuses}
                visible={true}
                renderInPortal={true}
            >
                <button>Trigger</button>
            </StatusTrackerPopover>
        );

        expect(container).toBeInTheDocument();
    });

    it('handles portalId prop', () => {
        const customPortalId = 'custom-portal-id';
        const { container } = renderWithTheme(
            <StatusTrackerPopover
                statuses={basicStatuses}
                visible={true}
                renderInPortal={true}
                portalId={customPortalId}
            >
                <button>Trigger</button>
            </StatusTrackerPopover>
        );

        expect(container).toBeInTheDocument();
    });

    it('toggles visibility correctly', () => {
        const { queryByText, rerender } = renderWithTheme(
            <StatusTrackerPopover statuses={basicStatuses} visible={false}>
                <button>Trigger</button>
            </StatusTrackerPopover>
        );

        expect(queryByText('Started')).not.toBeInTheDocument();

        rerender(
            <StatusTrackerPopover statuses={basicStatuses} visible={true}>
                <button>Trigger</button>
            </StatusTrackerPopover>
        );

        expect(queryByText('Started')).toBeInTheDocument();
    });
});
