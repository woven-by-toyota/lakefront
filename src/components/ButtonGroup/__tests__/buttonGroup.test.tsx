import React from 'react';
import { fireEvent } from '@testing-library/react';
import ButtonGroup from '../ButtonGroup';
import { renderWithTheme } from 'src/lib/testing';
import Button, { type ButtonProps } from 'src/components/Button';

const buttonConfigs = [
  { id: '1', label: 'Button 1' },
  { id: '2', label: 'Button 2' },
  { id: '3', label: 'Button 3' },
];

describe('ButtonGroup Component', () => {
  it('renders buttons in group mode', () => {
    const { getByText } = renderWithTheme(<ButtonGroup mode="group" buttonConfigs={buttonConfigs} />);

    expect(getByText('Button 1')).toBeInTheDocument();
    expect(getByText('Button 2')).toBeInTheDocument();
    expect(getByText('Button 3')).toBeInTheDocument();
  });

  it('renders buttons with correct styles in toggle mode', () => {
    const { getByText } = renderWithTheme(<ButtonGroup mode="toggle" buttonConfigs={buttonConfigs} selectedId="2" />);

    const button1 = getByText('Button 1');
    const selectedButton = getByText('Button 2');
    const button3 = getByText('Button 3');

    expect(button1).toHaveClass('secondary');
    expect(selectedButton).toHaveClass('primary');
    expect(button3).toHaveClass('secondary');
  });

  it('applies className prop to ButtonGroupContainer', () => {
    const { container } = renderWithTheme(<ButtonGroup mode="group" buttonConfigs={buttonConfigs} className="custom-class" />);

    expect(container.firstChild).toHaveClass('custom-class');
  });

  it('renders buttons with additional props', () => {
    const customButtonConfigs = [
      { id: '1', label: 'Button 1', disabled: true },
      { id: '2', label: 'Button 2', onClick: jest.fn() },
    ];

    const { getByText } = renderWithTheme(<ButtonGroup mode="group" buttonConfigs={customButtonConfigs} />);

    const button1 = getByText('Button 1');
    const button2 = getByText('Button 2');

    expect(button1).toBeDisabled();
    expect(button2).not.toBeDisabled();
  });

  it('handles button click events', () => {
    const mockOnClick = jest.fn();
    const customButtonConfigs = [
      { id: '1', label: 'Button 1', onClick: mockOnClick },
    ];

    const { getByText } = renderWithTheme(<ButtonGroup mode="group" buttonConfigs={customButtonConfigs} />);

    const button1 = getByText('Button 1');
    fireEvent.click(button1);

    expect(mockOnClick).toHaveBeenCalledTimes(1);
  });

  it('uses custom button when passed', () => {
    const ariaLabel = 'custom-button';
    const CustomButton = (props: ButtonProps) => <Button {...props} aria-label={`${props.id}-${ariaLabel}`} />;

    const { getByLabelText } = renderWithTheme(<ButtonGroup mode="group" buttonConfigs={buttonConfigs} Button={CustomButton} />);

    getByLabelText(`${buttonConfigs[0].id}-${ariaLabel}`);
  });
});
