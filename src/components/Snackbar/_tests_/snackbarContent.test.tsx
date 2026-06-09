import SnackbarContent from '../SnackbarContent';
import { MESSAGE_TYPES } from '../Snackbar.util';
import { renderWithTheme } from '../../../lib/testing';

const SnackbarContentPropsMock = {
    action: <button />,
    message: 'File transfer initiated.',
    type: MESSAGE_TYPES.SUCCESS
};

describe('SnackbarContent', () => {
    it('should render component as expected', () => {
        const { container, getByText } = renderWithTheme(<SnackbarContent {...SnackbarContentPropsMock} />);
        expect(container).toBeDefined();
        getByText('File transfer initiated.');
        expect(container.querySelector('svg')).toContainHTML('style="fill: #5c85d6;"');
    });
});
