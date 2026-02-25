import { fireEvent, cleanup } from '@testing-library/react';
import { renderWithTheme as render } from 'src/lib/testing';
import PlaybackBar from '../Playbackbar';

afterAll(cleanup);

const mockProps = {
    currentDuration: '00:30',
    currentSlider: 100,
    endDuration: '05:15',
    maxSlider: 720,
    setSlider: jest.fn()
};

describe('<PlaybackBar>', () => {
    beforeEach(() => {
        cleanup();
        jest.clearAllMocks();
    });

    it('renders fine with highlights and check slider click in light theme', async () => {
        const changeCallback = jest.fn(index => index);

        const { container, getByTestId } = render(
            <PlaybackBar
                {...mockProps}
                highlights={[{ start: 50, end: 300, playback: true }]}
                setSlider={changeCallback}
            />
        );

        // test if the slider is clicked.
        fireEvent.click(getByTestId('slider'), { clientX: '256' });
        expect(changeCallback).toBeCalled();

        getByTestId("highlight").hasAttribute("position:'absolute'");
    });

    it('renders fine with highlights and check slider click in dark theme', async () => {
        const changeCallback = jest.fn(index => index);

        const { container, getByTestId } = render(
            <PlaybackBar
                {...mockProps}
                highlights={[{ start: 50, end: 300, playback: true }]}
                setSlider={changeCallback}
            />,
            'dark'
        );

        // test if the slider is clicked.
        fireEvent.click(getByTestId('slider'), { clientX: '256' });
        expect(changeCallback).toBeCalled();

        getByTestId("highlight").hasAttribute("position:'absolute'");
    });

    it('renders fine with multiple highlights', async () => {
        const changeCallback = jest.fn(index => index);

        const { container, getAllByTestId } = render(
            <PlaybackBar
                {...mockProps}
                highlights={[{ start: 50, end: 300, playback: false }, { start: 400, end: 500, playback: false }]}
                setSlider={changeCallback}
            />
        );
        expect(getAllByTestId("highlight").length).toEqual(2);
    });

    it('renders multiple highlights correctly in both themes', async () => {
        const changeCallback = jest.fn(index => index);

        const { getAllByTestId: lightHighlights } = render(
            <PlaybackBar
                {...mockProps}
                highlights={[{ start: 50, end: 300, playback: false }, { start: 400, end: 500, playback: false }]}
                setSlider={changeCallback}
            />
        );

        const { getAllByTestId: darkHighlights } = render(
            <PlaybackBar
                {...mockProps}
                highlights={[{ start: 50, end: 300, playback: false }, { start: 400, end: 500, playback: false }]}
                setSlider={changeCallback}
            />,
            'dark'
        );

        expect(lightHighlights("highlight").length).toEqual(2);
        expect(darkHighlights("highlight").length).toEqual(2);
    });

    it('handles slider functionality consistently across themes', () => {
        const changeCallback = jest.fn();

        const { getByTestId: lightSlider } = render(
            <PlaybackBar
                {...mockProps}
                setSlider={changeCallback}
            />
        );

        const { getByTestId: darkSlider } = render(
            <PlaybackBar
                {...mockProps}
                setSlider={changeCallback}
            />,
            'dark'
        );

        // Both should have functional sliders
        expect(lightSlider('slider')).toBeInTheDocument();
        expect(darkSlider('slider')).toBeInTheDocument();
    });
});
