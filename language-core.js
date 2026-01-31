/**
 * language-core.js
 * Dedicated logic for URL-based language routing and dynamic content updates.
 * STRICTLY JS LOGIC ONLY - No CSS/HTML structure changes.
 */

const VALID_LANGUAGES = ['en', 'ar', 'de', 'fr', 'ru', 'it', 'hu', 'hr', 'es', 'cs', 'lv', 'zh', 'tr', 'pl', 'et', 'sr'];
const DEFAULT_LANG = 'en';

// Exported Router Object
const LanguageRouter = {

    // 1. Detection: Detect language from Hash (e.g. #en or #en/services)
    detect: function () {
        const hash = window.location.hash; // e.g. #en/services
        const match = hash.match(/^#([a-z]{2})(\/|$)/);
        if (match && VALID_LANGUAGES.includes(match[1])) {
            return match[1];
        }
        return DEFAULT_LANG;
    },

    // 2. Hash Manipulation: Update Hash to include language
    updateURL: function (lang) {
        let hash = window.location.hash || ''; // e.g. #ar/services or empty

        // Remove existing lang prefix if present
        // Matches #ar, #ar/, #ar/services
        const match = hash.match(/^#([a-z]{2})(\/|$)/);
        let cleanPath = hash;

        if (match && VALID_LANGUAGES.includes(match[1])) {
            // Strip the lang part:
            // #en -> quote empty
            // #en/ -> quote empty
            // #en/services -> services
            const prefixLen = match[0].length;
            // If ends with slash, we want to keep it? No usually #en/services -> services
            // But if just #en, prefixLen is 3. 
            cleanPath = hash.slice(prefixLen);
        } else if (hash.startsWith('#')) {
            cleanPath = hash.slice(1);
        }

        // Construct new hash
        // Format: #lang/cleanPath
        // If cleanPath is empty, just #lang
        // If cleanPath starts with /, remove it to avoid double slash
        if (cleanPath.startsWith('/')) cleanPath = cleanPath.slice(1);

        const newHash = cleanPath ? `#${lang}/${cleanPath}` : `#${lang}`;

        if (window.location.hash !== newHash) {
            window.location.hash = newHash;
        }
    },

    // 3. HTML Direction: Toggle dir attribute
    setDir: function (lang) {
        if (lang === 'ar') {
            document.documentElement.dir = 'rtl';
            document.body.classList.add('rtl');
        } else {
            document.documentElement.dir = 'ltr';
            document.body.classList.remove('rtl');
        }
        document.documentElement.lang = lang;
    },

    // 4. Dynamic Content Update (Stub - expects external data)
    updateContent: function (lang) {
        // If window.updateAllServices exists (from working-language-system.js), use it.
        // This keeps the logic connected.
        if (typeof window.updateAllServices === 'function') {
            // Ensure global currentLanguage is synced if it exists
            if (typeof window.currentLanguage !== 'undefined') {
                window.currentLanguage = lang;
                localStorage.setItem('selectedLanguage', lang);
            }
            window.updateAllServices();
        }

        if (typeof window.updateAllUIText === 'function') {
            window.updateAllUIText();
        }

        if (typeof window.updateLanguageDropdown === 'function') {
            window.updateLanguageDropdown();
        }
    },

    // 5. Global Event Listener for Switcher Buttons
    setupListeners: function () {
        document.addEventListener('click', (event) => {
            // Check if clicked element is a language switcher item
            // Targeting <a class="dropdown-item" onclick="switchLanguage('...')">
            const target = event.target.closest('.dropdown-item');

            if (target && target.getAttribute('onclick') && target.getAttribute('onclick').includes('switchLanguage')) {
                // Prevent default href="#" behavior which resets hash to empty
                event.preventDefault();

                const onclickStr = target.getAttribute('onclick');
                // Regex to match switchLanguage('ar') or switchLanguage("ar") with optional spaces
                const match = onclickStr.match(/switchLanguage\s*\(\s*['"]([a-z]{2})['"]\s*\)/);

                if (match && match[1]) {
                    const lang = match[1];
                    console.log(`LanguageRouter: Click detected, switching to ${lang}`);

                    // Update URL (Hash) - this creates a history entry automatically
                    this.updateURL(lang);

                    // Update Content immediately (redundant if hashchange handles it, but good for responsiveness)
                    this.setDir(lang);
                    this.updateContent(lang);
                }
            }
        });
        console.log("LanguageRouter: Listeners active");
    },

    // 6. Initialization
    init: function () {
        // Initial Load
        window.addEventListener('load', () => {
            const lang = this.detect();
            // sync with local storage if needed, or prefer URL
            this.updateURL(lang);
            this.setDir(lang);
            this.updateContent(lang);
        });

        // Popstate (Back/Forward)
        window.addEventListener('popstate', (event) => {
            // Try to get lang from state, fallback to URL detection
            const lang = event.state?.language || this.detect();
            this.setDir(lang);
            this.updateContent(lang);
        });

        // Setup Button Listeners
        this.setupListeners();
    }
};

// Start the router
LanguageRouter.init();
