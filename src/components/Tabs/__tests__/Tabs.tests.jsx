import { fireEvent, cleanup } from '@testing-library/react';
import { renderWithTheme as render } from '../../../lib/testing';
import Tabs from '../Tabs';

afterAll(cleanup);

const TABS = [
    {
        key: 'episode',
        caption: 'Episode Tasks'
    },
    {
        key: 'command',
        caption: 'Command Tasks'
    }

];

describe('<Tabs>', () => {
    it('check tab tags and behaviour', () => {
        const callback = jest.fn();
        const { getByText } = render(<Tabs options={TABS} value="episode" onChange={callback} />);

        // tab items should be in the document
        expect(getByText('Episode Tasks')).toBeInTheDocument();
        expect(getByText('Command Tasks')).toBeInTheDocument();

        // clicking on the tab should fire callback
        fireEvent.click(getByText('Command Tasks'));
        expect(callback).toBeCalledWith('command');
    });
});
