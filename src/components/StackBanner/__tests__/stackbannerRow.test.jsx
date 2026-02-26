import React from 'react';
import { fireEvent } from '@testing-library/react';
import { renderWithTheme as render } from 'src/lib/testing';
import StackBannerRow from '../StackBannerRow';

const CONTENT = 'content';
const content = <div>{CONTENT}</div>;

describe('StackBannerRow', () => {
  it('renders stack banner row properly.', () => {
    const { getByText } = render(<StackBannerRow key="1" content={content} />);

    getByText(CONTENT);
  });

  it('handles onClick action', () => {
    const onClick = jest.fn();
    const { getByText } = render(
      <StackBannerRow onClick={onClick} key="1" content={content} />
    );

    fireEvent.click(getByText(CONTENT));

    expect(onClick).toHaveBeenCalled();
  });
});
