
const mock = () => {
    let storage = {};
    return {
        getItem: key => key in storage ? storage[key] : null,
        setItem: (key, value) => storage[key] = value || '',
        removeItem: key => delete storage[key],
        clear: () => storage = {},
    };
};

const ace = () => {
    return {
        edit: () => {
            return {
                getValue: () => '',
                setValue: () => { return; },
                setTheme: () => { return; },
                setMode: () => { return; },
                navigateTo: () => { return; },
                setReadOnly: () => { return; },
                session: {
                    setMode: () => { return; }
                }
            };
        }
    };
};

Object.defineProperty(window, 'localStorage', { value: mock() });
Object.defineProperty(window, 'sessionStorage', { value: mock() });
Object.defineProperty(window, 'getComputedStyle', {
    value: () => ['-webkit-appearance']
});
Object.defineProperty(window, 'ace', { value: ace() });

