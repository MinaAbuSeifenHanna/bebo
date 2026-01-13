
global.window = {}; // Mock window
global.localStorage = { getItem: () => "en", setItem: () => { } };
global.document = {
    documentElement: { lang: 'en', dir: 'ltr' },
    body: { classList: { add: () => { }, remove: () => { } } },
    getElementById: () => ({ textContent: "" }),
    querySelectorAll: () => []
};

try {
    // We need to mock servicesData for working-language-system to work if we were to run it, 
    // but we just want to verify syntax (require does that).
    // However, it runs top-level code like `let currentLanguage = ...`.

    require('./js/working-language-system.js');
    console.log('js/working-language-system.js Syntax OK');
} catch (e) {
    console.error('js/working-language-system.js Syntax Error:', e.message);
}
