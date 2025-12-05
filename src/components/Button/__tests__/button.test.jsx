import React from 'react';
import { fireEvent } from '@testing-library/react';
import { renderWithTheme as render } from 'src/lib/testing';
import Button from '../Button';
import theme from '../../../styles/theme';

const BUTTON_TEXT = 'buttonText';

const THEME = theme;

const onClick = jest.fn();

describe('Button', () => {
  describe('general rendering', () => {
    it('renders child text', () => {
      const { getByText } = render(<Button>{BUTTON_TEXT}</Button>);

      getByText(BUTTON_TEXT);
    });

    it('renders additional child types', () => {
      const [divID, pID] = ['divID', 'pID'];
      const { container } = render(
        <Button>
          <div id={divID}>
            <p id={pID}>{BUTTON_TEXT}</p>
          </div>
        </Button>
      );

      expect(container.querySelector(`#${divID}`)).toBeInTheDocument();
      expect(container.querySelector(`#${pID}`)).toBeInTheDocument();
    });
  });

  describe('when enabled', () => {
    it('triggers button handler when clicked', () => {
      const { getByText } = render(
        <Button onClick={onClick}>{BUTTON_TEXT}</Button>
      );

      fireEvent.click(getByText(BUTTON_TEXT));

      expect(onClick).toHaveBeenCalled();
    });

    it('renders primary variant when color is undefined', () => {
      const { getByRole } = render(
        <Button>{BUTTON_TEXT}</Button>
      );

      expect(getByRole('button')).toHaveStyle({
        backgroundColor: THEME.colors.storm
      });
    });

    it('renders primary variant when color does not exist', () => {
      const { getByRole } = render(
        <Button color="non_existing_color">
          {BUTTON_TEXT}
        </Button>
      );

      expect(getByRole('button')).toHaveStyle({
        backgroundColor: THEME.colors.storm
      });
    });

    it('renders primary variant when specified', () => {
      const { getByRole } = render(
        <Button color="primary">
          {BUTTON_TEXT}
        </Button>
      );

      expect(getByRole('button')).toHaveStyle({
        backgroundColor: THEME.colors.storm
      });
    });

    it('renders secondary variant when specified', () => {
      const { getByRole } = render(
        <Button color="secondary">
          {BUTTON_TEXT}
        </Button>
      );

      expect(getByRole('button')).toHaveStyle({
        backgroundColor: 'transparent'
      });
    });

    it('renders desctructive variant when specified', () => {
      const { getByRole } = render(
        <Button color="destructive">
          {BUTTON_TEXT}
        </Button>
      );

      expect(getByRole('button')).toHaveStyle({
        backgroundColor: THEME.backgrounds.primary
      });
    });
  });

  describe('when alternate prop is provided', () => {
    it('renders the alternate primary style.', () => {
      const { getByRole } = render(
        <Button alternate color="primary">
          {BUTTON_TEXT}
        </Button>
      );

      expect(getByRole('button')).toHaveStyle({ color: THEME.colors.storm });
    });

    it('renders the alternate secondary style.', () => {
      const { getByRole } = render(
        <Button alternate color="secondary">
          {BUTTON_TEXT}
        </Button>
      );

      expect(getByRole('button')).toHaveStyle({ color: THEME.backgrounds.tinted });
    });

    it('renders the alternate destructive style.', () => {
      const { getByRole } = render(
        <Button alternate color="destructive">
          {BUTTON_TEXT}
        </Button>
      );

      expect(getByRole('button')).toHaveStyle({ color: THEME.backgrounds.errorsInverted });
    });
  });

  describe('when disabled', () => {
    it('renders with disabled styles', () => {
      const { getByText } = render(<Button disabled>{BUTTON_TEXT}</Button>);

      expect(getByText(BUTTON_TEXT)).toHaveStyle({ cursor: 'not-allowed' });
    });

    it('prevents button handler when clicked', () => {
      const { getByText } = render(<Button disabled>{BUTTON_TEXT}</Button>);

      fireEvent.click(getByText(BUTTON_TEXT));

      expect(onClick).not.toHaveBeenCalled();
    });
  });

  describe('iconLabel', () => {
    it('displays the iconLabel below the enabled button when provided and icon is true', () => {
      const { container } = render(
        <Button icon={true} iconLabel={'label text'} />
      );

      expect(container.querySelector('div')).toHaveTextContent('label text');
    });

    it("doesn't display the iconLabel when icon is false / not provided", () => {
      const { container } = render(<Button iconLabel={'label text'} />);

      expect(container.querySelector('div')).toBe(null);
    });
  });
});
