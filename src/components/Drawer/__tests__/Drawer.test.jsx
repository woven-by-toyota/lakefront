import React from 'react';
import { fireEvent } from '@testing-library/react';
import { renderWithTheme as render } from 'src/lib/testing';
import Drawer from '../Drawer';

const PROPS = {
    open: true,
    width: '50%'
};

describe('Drawer', () => {
    it('opens properly', () => {
        const { container } = render(<Drawer {...PROPS} />);
        expect(container.querySelector('div.innerDrawerContainer')).toBeInTheDocument();
        expect(container.querySelector('div')).toHaveStyle({ marginRight: '0' });
    });

    it('hides the drawer when false', () => {
        const { container } = render(<Drawer open={false} />);
        expect(container.querySelector('div')).toHaveStyle({ marginRight: '-50%' });
    });

    it('calls the onClose action on button click', () => {
        const onClose = jest.fn();
        const { getByRole } = render(<Drawer {...PROPS} onClose={onClose} />);
        fireEvent.click(getByRole('button'));
        expect(onClose).toHaveBeenCalled();
    });

    it('renders child component', () => {
        const { getByText } = render(
            <Drawer {...PROPS} >
                <div>This is child component</div>
            </Drawer>
        );
        expect(getByText('This is child component')).toBeInTheDocument();
    });

    describe('theme support', () => {
        it('renders correctly in light theme', () => {
            const { container } = render(<Drawer {...PROPS} />);
            expect(container.querySelector('div.innerDrawerContainer')).toBeInTheDocument();
            expect(container.querySelector('div')).toHaveStyle({ marginRight: '0' });
        });

        it('renders correctly in dark theme', () => {
            const { container } = render(<Drawer {...PROPS} />, 'dark');
            expect(container.querySelector('div.innerDrawerContainer')).toBeInTheDocument();
            expect(container.querySelector('div')).toHaveStyle({ marginRight: '0' });
        });

        it('handles close button interaction in light theme', () => {
            const onClose = jest.fn();
            const { getByRole } = render(<Drawer {...PROPS} onClose={onClose} />);
            fireEvent.click(getByRole('button'));
            expect(onClose).toHaveBeenCalledTimes(1);
        });

        it('handles close button interaction in dark theme', () => {
            const onClose = jest.fn();
            const { getByRole } = render(<Drawer {...PROPS} onClose={onClose} />, 'dark');
            fireEvent.click(getByRole('button'));
            expect(onClose).toHaveBeenCalledTimes(1);
        });

        it('renders children in light theme', () => {
            const { getByText } = render(
                <Drawer {...PROPS}>
                    <div>Light theme child content</div>
                </Drawer>
            );

            expect(getByText('Light theme child content')).toBeInTheDocument();
        });

        it('renders children in dark theme', () => {
            const { getByText } = render(
                <Drawer {...PROPS}>
                    <div>Dark theme child content</div>
                </Drawer>,
                'dark'
            );

            expect(getByText('Dark theme child content')).toBeInTheDocument();
        });

        it('handles open/closed state consistently across themes', () => {
            const { container: lightOpen } = render(<Drawer {...PROPS} open={true} />);
            const { container: lightClosed } = render(<Drawer {...PROPS} open={false} />);

            const { container: darkOpen } = render(<Drawer {...PROPS} open={true} />, 'dark');
            const { container: darkClosed } = render(<Drawer {...PROPS} open={false} />, 'dark');

            // Open state
            expect(lightOpen.querySelector('div')).toHaveStyle({ marginRight: '0' });
            expect(darkOpen.querySelector('div')).toHaveStyle({ marginRight: '0' });

            // Closed state
            expect(lightClosed.querySelector('div')).toHaveStyle({ marginRight: '-50%' });
            expect(darkClosed.querySelector('div')).toHaveStyle({ marginRight: '-50%' });
        });
    });

});
