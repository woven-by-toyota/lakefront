import { type FC, useEffect, useState } from 'react';
import Button from 'src/components/Button/Button';
import type { FilterJSONInputProps } from 'src/components/Filter/types';
import { ButtonWrapper, JSONEditor } from './filterJSONInputStyles';

const JSON_INDENT_SPACES = 4;

const FilterJSONInput: FC<FilterJSONInputProps> = ({ filterHooks, onInputModifiedChange }) => {
    const { filterPostBody, applyApiPostBody } = filterHooks;
    const formatCurrentPostBody = () => JSON.stringify(filterPostBody, undefined, JSON_INDENT_SPACES);
    const [jsonInput, setJsonInput] = useState<string>(() => formatCurrentPostBody());
    const [isInputModified, setIsInputModified] = useState(false);
    const [error, setError] = useState('');

    const resetInput = () => {
        setJsonInput(formatCurrentPostBody());
        setIsInputModified(false);
        setError('');
    };

    const handleInputChange = (event) => {
        setJsonInput(event.target.value);
        setError('');
        setIsInputModified(true);
    };

    const handleApply = () => {
        // remove all newline chars before parsing so it doesn't choke
        const escaped = jsonInput.replace(/\n/g, '');

        try {
            const body = JSON.parse(escaped);
            console.log(body);
            applyApiPostBody(body);
            setIsInputModified(false);
        } catch (error) {
            setError('Invalid JSON.');
        }
    };

    // reset input JSON when filter hook changes the post body (e.g. filters are updated via
    // some other means, like dismissing a chip in the filter bar)
    useEffect(() => {
        resetInput();
    }, [filterPostBody]);

    // update external watchers with modified state (for confirmation modal display)
    useEffect(() => {
        onInputModifiedChange(isInputModified);
    }, [isInputModified]);

    return (
        <>
            <JSONEditor
                value={jsonInput}
                onChange={handleInputChange}
                error={error}
            />
            <ButtonWrapper>
                <Button
                    color='secondary'
                    onClick={resetInput}
                >
                    Cancel
                </Button>
                <Button onClick={handleApply}>Apply JSON</Button>
            </ButtonWrapper>
        </>
    );
};

export default FilterJSONInput;
