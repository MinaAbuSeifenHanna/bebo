// js/utils.js - Shared Utilities

window.Utils = {
    // Fix pathing based on current location
    resolvePath: function (path) {
        if (!path) return '';

        // Remove leading slash if present to avoid absolute path confusion
        if (path.startsWith('/')) path = path.substring(1);

        // If it's a full URL, return as is
        if (path.startsWith('http')) return path;

        const isSubPage = window.location.pathname.includes('/pages/');

        // If we are in a subfolder (like /pages/), prepend ../
        if (isSubPage) {
            // If path already starts with ../, leave it
            if (path.startsWith('../')) return path;
            return '../' + path;
        }

        // If we are at root
        return path;
    },

    // Get current language
    getCurrentLang: function () {
        return localStorage.getItem('selectedLanguage') || 'en';
    },

    // Format currency
    formatPrice: function (amount, currency = '€') {
        return `${currency}${parseFloat(amount).toFixed(2)}`;
    }
};
