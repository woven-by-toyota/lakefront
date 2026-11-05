import { type FC, type ReactNode, useEffect, useRef, useState } from 'react';
import { TypeaheadError, TypeaheadResultsContainer } from './typeaheadSearchStyles';
import Loading from 'src/components/Loading/Loading';

export const ERROR_MESSAGE = 'An error occured when searching.';
export const HEADER_MESSAGE = 'Results';
export const LOADING_MESSAGE = 'Searching...';
export const NO_RESULTS_MESSAGE = 'No results were returned.';

export interface TypeaheadResultItem {
    label: ReactNode;
    value: string;
}

interface TypeaheadResultsProps {
    debouncedText: string;
    fetchResults?: (searchText: string) => Promise<TypeaheadResultItem[]>;
    onResultSelect: (result: TypeaheadResultItem) => void;
}

const TypeaheadResults: FC<TypeaheadResultsProps> = ({ debouncedText, fetchResults, onResultSelect }) => {
    const [results, setResults] = useState<TypeaheadResultItem[]>([]);
    const [error, setError] = useState<string>('');
    const [fetching, setFetching] = useState<boolean>(false);
    const mountedRef = useRef(false);

    useEffect(() => {
        mountedRef.current = true;

        return () => {
            mountedRef.current = false;
        };
    }, []);

    useEffect(() => {
        setFetching(true);
        setError('');

        if (fetchResults) {
            fetchResults(debouncedText)
                .then((resultItems) => {
                    if (mountedRef.current) {
                        setResults(resultItems);
                        setFetching(false);
                    }
                })
                .catch(() => {
                    if (mountedRef.current) {
                        setError(ERROR_MESSAGE);
                        setFetching(false);
                    }
                });
            return;
        }

        setFetching(false);
    }, [fetchResults, debouncedText]);

    if (fetching) {
        return <Loading label={LOADING_MESSAGE} />;
    }

    if (error) {
        return <TypeaheadError className="typeaheadError">{ERROR_MESSAGE}</TypeaheadError>;
    }

    if (!results.length) {
        return <div>{NO_RESULTS_MESSAGE}</div>;
    }

    return (
        <TypeaheadResultsContainer>
            <div className="resultsHeader">{HEADER_MESSAGE}</div>
            <ul className="resultsList">
                {results.map((result) => (
                    <li key={result.value} className="resultItem" onClick={() => onResultSelect(result)}>
                        {result.label}
                    </li>
                ))}
            </ul>
        </TypeaheadResultsContainer>
    );
};

export default TypeaheadResults;
