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

  describe('theme support', () => {
    beforeEach(() => {
      onChangeHandler.mockClear();
    });

    it('renders correctly in light theme', () => {
      const { queryByRole } = render(<Checkbox />);
      expect(queryByRole('checkbox')).toBeInTheDocument();
    });

    it('renders correctly in dark theme', () => {
      const { queryByRole } = render(<Checkbox />, 'dark');
      expect(queryByRole('checkbox')).toBeInTheDocument();
    });

    it('renders with label consistently across themes', () => {
      const { queryByRole: lightQueryByRole, getByText: lightGetByText } = render(
        <Checkbox label={LABEL} />
      );

      const { queryByRole: darkQueryByRole, getByText: darkGetByText } = render(
        <Checkbox label={LABEL} />,
        'dark'
      );

      lightGetByText(LABEL);
      darkGetByText(LABEL);
      expect(lightQueryByRole('checkbox')).toBeInTheDocument();
      expect(darkQueryByRole('checkbox')).toBeInTheDocument();
    });

    it('renders checked state consistently across themes', () => {
      const { container: lightContainer } = render(<Checkbox checked />);
      const { container: darkContainer } = render(<Checkbox checked />, 'dark');

      expect(lightContainer.querySelector('svg')).toBeInTheDocument();
      expect(darkContainer.querySelector('svg')).toBeInTheDocument();
    });

    it('renders indeterminate state consistently across themes', () => {
      const { container: lightContainer } = render(<Checkbox indeterminate />);
      const { container: darkContainer } = render(<Checkbox indeterminate />, 'dark');

      expect(lightContainer.querySelector('svg')).toBeInTheDocument();
      expect(darkContainer.querySelector('svg')).toBeInTheDocument();
    });

    it('renders custom checked icon consistently across themes', () => {
      const { container: lightContainer } = render(
        <Checkbox checked checkedIcon={<Check />} />
      );

      const { container: darkContainer } = render(
        <Checkbox checked checkedIcon={<Check />} />,
        'dark'
      );

      expect(lightContainer.querySelector('svg')).toBeInTheDocument();
      expect(darkContainer.querySelector('svg')).toBeInTheDocument();
    });

    it('handles click events consistently across themes', () => {
      const lightHandler = jest.fn();
      const darkHandler = jest.fn();

      const { getByText: lightGetByText } = render(
        <Checkbox onChange={lightHandler} label={LABEL} />
      );

      const { getByText: darkGetByText } = render(
        <Checkbox onChange={darkHandler} label={LABEL} />,
        'dark'
      );

      fireEvent.click(lightGetByText(LABEL));
      fireEvent.click(darkGetByText(LABEL));

      expect(lightHandler).toHaveBeenCalledTimes(1);
      expect(darkHandler).toHaveBeenCalledTimes(1);
    });

    it('handles disabled state consistently across themes', () => {
      const lightHandler = jest.fn();
      const darkHandler = jest.fn();

      const { getByText: lightGetByText } = render(
        <Checkbox onChange={lightHandler} label={LABEL} disabled />
      );

      const { getByText: darkGetByText } = render(
        <Checkbox onChange={darkHandler} label={LABEL} disabled />,
        'dark'
      );

      fireEvent.click(lightGetByText(LABEL));
      fireEvent.click(darkGetByText(LABEL));

      expect(lightHandler).not.toHaveBeenCalled();
      expect(darkHandler).not.toHaveBeenCalled();
    });

    it('maintains checkbox functionality across different states in both themes', () => {
      // Test unchecked state
      const { queryByRole: lightUnchecked } = render(<Checkbox />);
      const { queryByRole: darkUnchecked } = render(<Checkbox />, 'dark');

      expect(lightUnchecked('checkbox')).toBeInTheDocument();
      expect(darkUnchecked('checkbox')).toBeInTheDocument();

      // Test checked state with label
      const { getByText: lightCheckedText, container: lightCheckedContainer } = render(
        <Checkbox checked label="Checked" />
      );

      const { getByText: darkCheckedText, container: darkCheckedContainer } = render(
        <Checkbox checked label="Checked" />,
        'dark'
      );

      lightCheckedText('Checked');
      darkCheckedText('Checked');
      expect(lightCheckedContainer.querySelector('svg')).toBeInTheDocument();
      expect(darkCheckedContainer.querySelector('svg')).toBeInTheDocument();

      // Test indeterminate state with label
      const { getByText: lightIndeterminateText, container: lightIndeterminateContainer } = render(
        <Checkbox indeterminate label="Indeterminate" />
      );

      const { getByText: darkIndeterminateText, container: darkIndeterminateContainer } = render(
        <Checkbox indeterminate label="Indeterminate" />,
        'dark'
      );

      lightIndeterminateText('Indeterminate');
      darkIndeterminateText('Indeterminate');
      expect(lightIndeterminateContainer.querySelector('svg')).toBeInTheDocument();
      expect(darkIndeterminateContainer.querySelector('svg')).toBeInTheDocument();
    });
  });
});
