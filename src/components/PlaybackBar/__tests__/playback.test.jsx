import { fireEvent, cleanup } from '@testing-library/react';
import { renderWithTheme as render } from 'src/lib/testing';
import PlaybackBar from '../Playbackbar';

afterAll(cleanup);

describe('<PlaybackBar>', () => {
  beforeEach(cleanup);

  it('renders fine with highlights and check slider click', async () => {
    const changeCallback = jest.fn(index => index);

    const { container, getByTestId } = render(
      <PlaybackBar
        currentDuration={'00:30'}
        currentSlider={100}
        endDuration={'05:15'}
        highlights={[{ start: 50, end: 300, playback: true }]}
        setSlider={changeCallback}
        maxSlider={720}
      />
    );


    // test if the slider is clicked.
    fireEvent.click(getByTestId('slider'), { clientX: '256' });
    expect(changeCallback).toHaveBeenCalled();

    getByTestId('highlight').hasAttribute('position:\'absolute\'');
  });

  it('renders fine with multiple highlights', async () => {
    const changeCallback = jest.fn(index => index);

    const { container, getAllByTestId } = render(
      <PlaybackBar
        currentDuration={'00:30'}
        currentSlider={100}
        endDuration={'05:15'}
        highlights={[{ start: 50, end: 300, playback: false }, { start: 400, end: 500, playback: false }]}
        setSlider={changeCallback}
        maxSlider={720}
      />
    );
    expect(getAllByTestId('highlight').length).toEqual(2);

  });
});
