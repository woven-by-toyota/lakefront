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

});
