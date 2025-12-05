import React from 'react';
import { fireEvent, screen } from '@testing-library/react';
import { renderWithTheme as render } from 'src/lib/testing';
import userEvent from '@testing-library/user-event';
import Button from 'src/components/Button/Button';
import RefreshToolbar from '../RefreshToolbar';

describe('<RefreshToolbar />', () => {
    let count = 0;
    let refreshing = false;
    const handleRefresh = () => {
        refreshing = true;
        count += 1;
    };

    it('renders button as correctly-styled icon', () => {
        const { container } = render((
            <RefreshToolbar
                handleRefresh={handleRefresh}
                isRefreshing={refreshing}
                refreshProgressLabel="Loading..."
                refreshTooltipText="Refresh LogSync File Details"
            />
        ));

        expect(container).toMatchSnapshot();
    });

    it('renders tooltip on hover', () => {
        const { container } = render((
            <RefreshToolbar
                handleRefresh={handleRefresh}
                isRefreshing={refreshing}
                refreshProgressLabel="Loading..."
                refreshTooltipText="Refresh LogSync File Details"
            />
        ));

        userEvent.hover(screen.getByRole('button'));
        expect(container).toMatchSnapshot();
    });

    it('calls the refresh callback', () => {
        const { getByRole } = render((
            <RefreshToolbar
                handleRefresh={handleRefresh}
                isRefreshing={refreshing}
                refreshProgressLabel="Loading..."
                refreshTooltipText="Refresh LogSync File Details"
            />
        ));

        fireEvent.click(getByRole('button'));

        expect(count).toBe(1);
        expect(refreshing).toBeTruthy();
    });

    it('renders custom refresh button', () => {
        const refreshButton = <Button color='primary' icon={true}></Button>;
        const { container } = render((
            <RefreshToolbar
                handleRefresh={handleRefresh}
                isRefreshing={refreshing}
                refreshProgressLabel="Loading..."
                refreshTooltipText="Refresh LogSync File Details"
                refreshButton={refreshButton}
            />
        ));

        expect(container.getElementsByClassName('iconChild')).toBeDefined();
    });

    it('renders right side text', () => {
        const { container } = render((
            <RefreshToolbar
                handleRefresh={() => null}
                refreshTooltipText="Refresh LogSync File Details"
                lastUpdated="11:28:22 AM"
                rightSideText="Last Updated: 11:28:22 AM EST"
            />
        ));
        expect(container).toHaveTextContent('Last Updated: 11:28:22 AM EST');
    });

});
