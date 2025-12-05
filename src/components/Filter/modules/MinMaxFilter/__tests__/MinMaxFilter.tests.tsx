import React from 'react';
import { fireEvent } from '@testing-library/react';
import { renderWithTheme as render } from 'src/lib/testing';
import { MinMaxFilter } from '../MinMaxFilter';

describe('MinMaxFilter', () => {
  it('returns the proper label', () => {
    const label = 'label';
    expect(MinMaxFilter({ label: label, description: '' })).toMatchObject({
      label
    });
  });

  it('returns the proper description', () => {
    const description = 'description';
    expect(MinMaxFilter({ label: '', description: description })).toMatchObject(
      { description }
    );
  });

  describe('getApiQueryUrl', () => {
    const { getApiQueryUrl } = MinMaxFilter({
      label: 'Vehicle Speed',
      description: ''
    });

    it('returns the proper url when there is a value', () => {
      expect(getApiQueryUrl('', { min: 1, max: 2 })).toBe(
        '&vehicleSpeed.min=1&vehicleSpeed.max=2'
      );
    });

    it('returns an empty string when value is falsy', () => {
      expect(getApiQueryUrl('a', {})).toBe('');
    });
  });

  describe('getApiPostBody', () => {
    const { getApiPostBody } = MinMaxFilter({
      label: 'Vehicle Speed',
      description: ''
    });

    it('returns the proper object when there is a value', () => {
      expect(getApiPostBody('a', { min: 1, max: 2 })).toMatchObject({
        'vehicleSpeed.min': 1,
        'vehicleSpeed.max': 2
      });
    });
  });

  describe('getBrowserQueryUrlValue', () => {
    const { getBrowserQueryUrlValue } = MinMaxFilter({
      label: 'Vehicle Speed',
      description: ''
    });

    it('returns the value provided', () => {
      expect(getBrowserQueryUrlValue({ min: 1, max: 6 })).toBe('1~6');
      expect(getBrowserQueryUrlValue({ min: 1 })).toBe('1~');
    });
  });

  describe('getDefaultFilterValue', () => {
    const { getDefaultFilterValue } = MinMaxFilter({
      label: 'Vehicle Speed',
      description: ''
    });

    it('returns null', () => {
      expect(getDefaultFilterValue()).toBe(null);
    });
  });

  describe('isDefaultFilterValue', () => {
    const { isDefaultFilterValue } = MinMaxFilter({
      label: '',
      description: ''
    });

    it('returns true only if value is null', () => {
      expect(isDefaultFilterValue({})).toBe(false);
    });
  });

  describe('getFilterBarLabel', () => {
    const { getFilterBarLabel } = MinMaxFilter({
      label: 'Vehicle Speed',
      description: '',
      unitsOfMeasurement: 'm/hr'
    });

    it('returns the value provided', () => {
      expect(getFilterBarLabel({ min: 1, max: 6 })).toBe(
        'Vehicle Speed: 1 - 6 m/hr'
      );
    });
  });

  describe('getFilterSectionLabel', () => {
    const { getFilterSectionLabel } = MinMaxFilter({
      label: 'Vehicle Speed',
      description: '',
      unitsOfMeasurement: 'm/hr'
    });

    it('returns the value provided', () => {
      expect(getFilterSectionLabel({ min: 1, max: 6 })).toBe('1 - 6 m/hr');
      expect(getFilterSectionLabel({ min: 1 })).toBe('1 -  m/hr');
    });
  });

  describe('parseInitialFilterValue', () => {
    const { parseInitialFilterValue } = MinMaxFilter({
      label: '',
      description: ''
    });

    it('returns value if value is truthy', () => {
      expect(parseInitialFilterValue('1~6')).toStrictEqual({
        max: '6',
        min: '1'
      });
      expect(parseInitialFilterValue('1~')).toStrictEqual({
        min: '1',
        max: ''
      });
      expect(parseInitialFilterValue()).toBe(null);
    });
  });

  describe('renderComponent', () => {
    it('returns the expected component', () => {
      const { renderComponent } = MinMaxFilter({
        label: '',
        description: ''
      });

      const update = jest.fn();
      const name = 'filter';
      const { container } = render(
        <div>
          {renderComponent({ value: { min: 1, max: 5 }, update, name })}
        </div>
      );
      expect(container.querySelectorAll('input')[0]).toHaveValue(1);
      fireEvent.blur(container.querySelectorAll('input')[0], {
        target: { value: 2 }
      });
      expect(update).toBeCalledTimes(2);
    });
  });
});
