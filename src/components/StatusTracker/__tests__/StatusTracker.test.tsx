import React from 'react';
import { renderWithTheme } from 'src/lib/testing';
import StatusTracker from '../StatusTracker';
import { green, saturatedRed } from 'src/styles/lakefrontColors';

describe('StatusTracker Component', () => {
    const basicStatuses = [
        { label: 'Started' },
        { label: 'In Progress' },
        { label: 'Complete' }
    ];

    it('renders all status labels', () => {
        const { getByText } = renderWithTheme(<StatusTracker statuses={basicStatuses} />);

        expect(getByText('Started')).toBeInTheDocument();
        expect(getByText('In Progress')).toBeInTheDocument();
        expect(getByText('Complete')).toBeInTheDocument();
    });

    it('renders status descriptions when provided', () => {
        const statusesWithDescriptions = [
            { label: 'Started', description: '2024-01-15 10:30 AM' },
            { label: 'Complete', description: '2024-01-15 04:30 PM' }
        ];

        const { getByText } = renderWithTheme(<StatusTracker statuses={statusesWithDescriptions} />);

        expect(getByText('2024-01-15 10:30 AM')).toBeInTheDocument();
        expect(getByText('2024-01-15 04:30 PM')).toBeInTheDocument();
    });

    it('does not render descriptions when not provided', () => {
        const { container } = renderWithTheme(<StatusTracker statuses={basicStatuses} />);

        expect(container).toBeInTheDocument();
    });

    it('renders aboveDetails when provided', () => {
        const statusesWithAboveDetails = [
            { label: 'Started', aboveDetails: 'John Doe' },
            { label: 'Complete', aboveDetails: 'Jane Smith' }
        ];

        const { getByText } = renderWithTheme(<StatusTracker statuses={statusesWithAboveDetails} />);

        expect(getByText('John Doe')).toBeInTheDocument();
        expect(getByText('Jane Smith')).toBeInTheDocument();
    });

    it('does not render aboveDetails when not provided', () => {
        const { container } = renderWithTheme(<StatusTracker statuses={basicStatuses} />);

        expect(container).toBeInTheDocument();
    });

    it('applies custom colors to status nodes', () => {
        const statusesWithColors = [
            { label: 'Success', color: green },
            { label: 'Error', color: saturatedRed }
        ];

        const { getByText } = renderWithTheme(<StatusTracker statuses={statusesWithColors} />);

        expect(getByText('Success')).toBeInTheDocument();
        expect(getByText('Error')).toBeInTheDocument();
    });

    it('renders all nodes correctly', () => {
        const { container, getByText } = renderWithTheme(<StatusTracker statuses={basicStatuses} />);

        expect(getByText('Started')).toBeInTheDocument();
        expect(getByText('In Progress')).toBeInTheDocument();
        expect(getByText('Complete')).toBeInTheDocument();
        expect(container.firstChild).toBeInTheDocument();
    });

    it('applies custom className', () => {
        const { container } = renderWithTheme(
            <StatusTracker statuses={basicStatuses} className="custom-class" />
        );

        expect(container.firstChild).toHaveClass('custom-class');
    });

    it('handles single status item', () => {
        const singleStatus = [{ label: 'Only One' }];
        const { getByText } = renderWithTheme(<StatusTracker statuses={singleStatus} />);

        expect(getByText('Only One')).toBeInTheDocument();
    });

    it('renders complete status with all properties', () => {
        const completeStatus = [
            {
                label: 'Complete Step',
                description: 'Completed at 10:30 AM',
                aboveDetails: 'John Doe',
                color: green
            }
        ];

        const { getByText } = renderWithTheme(<StatusTracker statuses={completeStatus} />);

        expect(getByText('Complete Step')).toBeInTheDocument();
        expect(getByText('Completed at 10:30 AM')).toBeInTheDocument();
        expect(getByText('John Doe')).toBeInTheDocument();
    });

    it('renders empty array without errors', () => {
        const { container } = renderWithTheme(<StatusTracker statuses={[]} />);

        expect(container.firstChild).toBeInTheDocument();
    });
});
