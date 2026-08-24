import { FC, FocusEvent, KeyboardEvent, useEffect, useState } from 'react';
import { StyledInput } from './textSearchStyles';

interface TextSearchProps {
    onChange(text: string): void;
    type?: 'text' | 'number';
    value: string;
    trimWhitespace?: boolean;
}

const TextSearch: FC<TextSearchProps> = ({ onChange, type = 'text', value, trimWhitespace = true }) => {
    const [text, setText] = useState('');

    useEffect(() => {
        setText(value);
    }, [value]);

    const submitSearch = (text: string) => {
        // Whitespace is trimmed on submit (rather than on change) so that it can still be typed between words.
        const submittedText = trimWhitespace ? text.trim() : text;

        setText(submittedText);
        onChange(submittedText);
    };

    const handleOnBlur = (event: FocusEvent<HTMLInputElement>) => {
        submitSearch(event.target.value);
    };

    const handleKeyPress = (event: KeyboardEvent<HTMLInputElement> & { target: HTMLInputElement }) => {
        if (event.key === 'Enter') {
            submitSearch(event.target?.value || '');
        }
    };

    return (
        <StyledInput
            id="keyword"
            type={type}
            onBlur={handleOnBlur}
            onKeyPress={handleKeyPress}
            onChange={(e) => {
                setText(e.target.value);
            }}
            value={text}
        />
    );
};

export default TextSearch;
