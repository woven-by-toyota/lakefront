import type { ClipboardEvent, FC } from 'react';
import { MultiValueInputContainer, StyledMultiValueInput } from './multiSelectStyles';
import type { InputProps } from 'src/components/Input/Input';

interface MultiValueInputProps {
    handleCreate: (item: string) => void;
}

const MultiValueInput: FC<MultiValueInputProps & Omit<InputProps, 'theme'>> = ({ handleCreate, ...inputProps }) => (
    <MultiValueInputContainer>
        <StyledMultiValueInput
            {...inputProps}
            autoFocus
            onPaste={(e: ClipboardEvent<HTMLTextAreaElement>) => {
                e.preventDefault();
                handleCreate(e.clipboardData.getData('Text'));
            }}
        />
    </MultiValueInputContainer>
);

export default MultiValueInput;
