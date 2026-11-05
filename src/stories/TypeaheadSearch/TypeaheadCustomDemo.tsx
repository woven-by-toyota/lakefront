import { type FC, useEffect, useState } from 'react';

import Loading from 'src/components/Loading/Loading';
import type { TypeaheadSearchResultProps } from 'src/components/TypeaheadSearch';
import type { TypeaheadResultItem } from 'src/components/TypeaheadSearch/TypeaheadResults';
import styled from '@emotion/styled';
import theme from 'src/styles/theme';
import { ThemeProvider } from '@emotion/react';

interface LoadingErrorProp {
    loading: boolean;
    error: any;
    data: any;
    useLoadingPlaceholder?: boolean;
}

const TypeaheadSearchResultsContainer = styled.div(({ theme }) => ({
    'section.resultSection': {
        marginBottom: 8
    },
    'div.resultError': {
        color: theme?.colors?.red
    },
    'div.resultSectionLabel': {
        textTransform: 'uppercase',
        color: theme?.colors?.pavement
    },
    'div.resultList': {
        display: 'flex',
        flexDirection: 'column',
        marginInlineStart: 0,
        marginInlineEnd: 0,
        marginBlockStart: 0,
        marginBlockEnd: 0,
        paddingInlineStart: 0,
        'li.resultItem': {
            marginTop: 1,
            padding: '2px 4px',
            display: 'block',
            ':hover': {
                textDecoration: 'underline',
                color: theme?.colors?.saturatedBlue,
                cursor: 'pointer'
            }
        }
    }
}));

const searchResultsLoadingError: FC<LoadingErrorProp> = ({ loading, error, data }) => {
    if (loading) {
        return (
            <div className="resultLoading">
                <Loading
                    height={14}
                    label="Searching..."
                    labelPosition="RIGHT"
                    width={14}
                    className="resultLoadingText"
                />
            </div>
        );
    }

    if (error) {
        return <div className="resultError">Error encountered fetching results</div>;
    }

    if (!data || !data.length) {
        return <div className="resultMessage">No results</div>;
    }

    return null;
};

export const LAKEFRONT_NAMES = [
    'L',
    'La',
    'Lak',
    'Lake',
    'Lakefront',
    'Lakers',
    'Lakes',
    'Lakeside',
    'l',
    'la',
    'lak',
    'lake',
    'lakefront',
    'lakers',
    'lakes',
    'lakeside'
];

const LOGS = LAKEFRONT_NAMES.map(name => `log-${name}.log`);
const FILES = LAKEFRONT_NAMES.map(name => `file-${name}.txt`);

const fetchResults = (searchText: string) => {
    return new Promise<[TypeaheadResultItem[], TypeaheadResultItem[]]>((res, rej) => {
        setTimeout(() => {
            let response: [TypeaheadResultItem[], TypeaheadResultItem[]] = [[], []];

            if (LOGS.join().includes(searchText) || FILES.join().includes(searchText)) {
                response = [
                    LOGS.map((value) => ({ label: value, value })).filter(({ value }) =>
                        value.includes(searchText)
                    ).slice(0,3),
                    FILES.map((value) => ({ label: value, value })).filter(({ value }) => value.includes(searchText)).slice(0,3)
                ];
            }

            res(response);
        }, 100);
    });
};

const TypeaheadSearchResults: FC<TypeaheadSearchResultProps> = ({ searchText, onResultSelect }) => {
    const [logs, setSessions] = useState<TypeaheadResultItem[]>([]);
    const [files, setFiles] = useState<TypeaheadResultItem[]>([]);
    const [fetching, setFetching] = useState<boolean>(false);

    useEffect(() => {
        setFetching(true);

        fetchResults(searchText)
            .then(([logResults, fileResults]) => {
                setSessions(logResults);
                setFiles(fileResults);
                setFetching(false);
            })
            .catch(() => {
                setFetching(false);
            });
    }, [fetchResults, searchText]);

    const handleResultSelect = (result: TypeaheadResultItem) => {
        if (onResultSelect) {
            onResultSelect(result);
        }
    };

    const logLoadingError = searchResultsLoadingError({ error: searchText === 'log-error', data: logs, loading: fetching });
    const fileLoadingError = searchResultsLoadingError({ error: searchText === 'file-error', data: files, loading: fetching });

    const logData = logs || [];
    const fileData = files || [];

    return (
        <ThemeProvider theme={theme}>
            <TypeaheadSearchResultsContainer className="typeaheadSearchResultsContainer">
                <section className="resultSection">
                    <div className="resultSectionLabel">Sessions</div>
                    {logLoadingError || (
                        <div className="resultList">
                            {logData.map((log) => log && (
                                <li key={log.value} className="resultItem">
                                    <div className="resultLink" onClick={() => handleResultSelect(log)}>
                                        {log.label}
                                    </div>
                                </li>
                            ))}
                        </div>
                    )}
                </section>
                <section className="resultSection">
                    <div className="resultSectionLabel">Files</div>
                    {fileLoadingError || (
                        <div className="resultList">
                            {fileData.map((file) => file && (
                                <li key={file.value} className="resultItem">
                                    <div className="resultLink" onClick={() => handleResultSelect(file)}>
                                        {file.label}
                                    </div>
                                </li>
                            ))}
                        </div>
                    )}
                </section>
            </TypeaheadSearchResultsContainer>
        </ThemeProvider>
    );
};

export default TypeaheadSearchResults;
