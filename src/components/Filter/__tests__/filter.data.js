export const KEYWORD_DEMO = 'demoText';
export const PHRASE_DEMO = 'demo phrase here.';
export const DEFAULT_PHRASE_DEMO = 'A random phrase then.';

export const BASE_FILTER = {
    getApiQueryUrl: (key, value) => {
        return value ? `&${key}=${encodeURIComponent(value)}` : '';
    },
    getApiPostBody: (key, value) => (value ? { [key]: value } : undefined),
    getBrowserQueryUrlValue: (value) => value,
    getDefaultFilterValue: () => '',
    isDefaultFilterValue: (value) => value === '',
    clearPartialSingleFilter: (name, value) => value,
    getFilterBarLabel: (value) => value,
    getFilterSectionLabel: (value) => value,
    parseInitialFilterValue: (browserQueryUrlValue) => browserQueryUrlValue || '',
    renderComponent: ({ name, value, update }) => (
        <input
            key={name}
            onChange={update}
            value={value}
        />
    )
};

export const FILTERS = {
    keywords: {
        description: 'Words to include.',
        label: 'Keywords',
        ...BASE_FILTER
    },
    phrases: {
        description: 'Phrases to lookup.',
        label: 'Phrases',
        ...BASE_FILTER
    }
};

export const LOCATION = {
    pathname: 'path',
    search: '',
    state: {
        search: ''
    },
    hash: '',
    key: 'key'
};
