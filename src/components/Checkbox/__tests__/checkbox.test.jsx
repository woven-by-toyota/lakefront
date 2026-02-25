import React from 'react';
import { fireEvent } from '@testing-library/react';
import { renderWithTheme as render } from 'src/lib/testing';
import Checkbox from '../Checkbox';
import { ReactComponent as Check } from '../assets/check.svg';

const onChangeHandler = jest.fn();
const LABEL = 'Checkbox';

describe('Checkbox', () => {
  it('renders un-checked checkbox and no label by default', () => {
    const { queryByRole } = render(<Checkbox />);

    expect(queryByRole('checkbox')).toBeInTheDocument();
  });

  it('renders un-checked checkbox with label when label provided', () => {
    const { queryByRole, getByText } = render(<Checkbox label={LABEL} />);

    getByText(LABEL);
    expect(queryByRole('checkbox')).toBeInTheDocument();
  });

  it('renders checked checkbox when "checked" prop is true', () => {
    const { container } = render(<Checkbox checked />);
    
    expect(container.querySelector('svg')).toBeInTheDocument();
  });

  it('renders indeterminate checkbox when "indeterminate" prop is true', () => {
    const { container } = render(<Checkbox indeterminate />);
    
    expect(container.querySelector('svg')).toBeInTheDocument();
  });

  it('renders provided svg when "checkedIcon" is provided', () => {
    const { container } = render(<Checkbox checked checkedIcon={<Check />} />);
    
    expect(container.querySelector('svg')).toBeInTheDocument();
  });

  it('triggers handler when checkbox is changed', () => {
    const { getByText } = render(<Checkbox onChange={onChangeHandler} label={LABEL} />);

    fireEvent.click(getByText(LABEL));

    expect(onChangeHandler).toHaveBeenCalled();
  });

  it('prevents handler trigger when disabled prop is true', () => {
    const { getByText } = render(<Checkbox onChange={onChangeHandler} label={LABEL} disabled />);

    fireEvent.click(getByText(LABEL));

    expect(onChangeHandler).not.toHaveBeenCalled();
  });
});
