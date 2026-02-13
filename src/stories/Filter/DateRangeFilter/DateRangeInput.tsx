import { FC, useState, useEffect, ChangeEvent } from 'react';
import styled from '@emotion/styled';
import Input from 'src/components/Input/Input';

export interface DateRange {
  startDate?: string;
  endDate?: string;
}

export interface DateRangeInputProps {
  value: DateRange | null;
  onChange: (value: DateRange | null) => void;
}

const Container = styled.div`
    display: flex;
    flex-direction: column;
    gap: 12px;
    width: 100%;
    input {
        width: 100%;
    }
`;

const DateRangeInput: FC<DateRangeInputProps> = ({ value, onChange }) => {
  const [startDate, setStartDate] = useState<string>(value?.startDate || '');
  const [endDate, setEndDate] = useState<string>(value?.endDate || '');

  useEffect(() => {
    setStartDate(value?.startDate || '');
    setEndDate(value?.endDate || '');
  }, [value]);

  const handleStartDateChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newStartDate = e.target.value;
    setStartDate(newStartDate);
    if (!newStartDate && !endDate) {
      onChange(null);
    } else {
      onChange({
        startDate: newStartDate || undefined,
        endDate: endDate || undefined
      });
    }
  };

  const handleEndDateChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newEndDate = e.target.value;
    setEndDate(newEndDate);
    if (!startDate && !newEndDate) {
      onChange(null);
    } else {
      onChange({
        startDate: startDate || undefined,
        endDate: newEndDate || undefined
      });
    }
  };

  return (
    <Container>
      <Input
        label="Start Date"
        type="date"
        value={startDate}
        onChange={handleStartDateChange}
      />
      <Input
        label="End Date"
        type="date"
        value={endDate}
        onChange={handleEndDateChange}
      />
    </Container>
  );
};

export default DateRangeInput;
