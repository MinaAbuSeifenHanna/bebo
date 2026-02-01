const route = (event) => {
    // Hash routing - handled by hashchange listener
};

const routes = {
    "/": { templateId: "tmpl-home", title: "Home | World Spa & Beauty", page: "home" },
    "home": { templateId: "tmpl-home", title: "Home | World Spa & Beauty", page: "home" },
    "salon": { templateId: "tmpl-salon", title: "Salon | World Spa & Beauty", page: "salon" },
    "gallery": { templateId: "tmpl-gallery", title: "Gallery | World Spa & Beauty", page: "gallery" },

    // Service Sub-routes
    "services": { templateId: "tmpl-services", title: "Services | World Spa & Beauty", page: "services", category: "all" },
    "packages": { templateId: "tmpl-services", title: "Packages | World Spa & Beauty", page: "services", category: "packages" },
    "massages": { templateId: "tmpl-services", title: "Massages | World Spa & Beauty", page: "services", category: "massages" },
    "hammam": { templateId: "tmpl-services", title: "Hammam | World Spa & Beauty", page: "services", category: "hammam" },
    "scrubs": { templateId: "tmpl-services", title: "Body Scrubs | World Spa & Beauty", page: "services", category: "scrubs" },

    // Details & Booking
    "details": { templateId: "tmpl-details", title: "Service Details", page: "details" },
    "booking": { templateId: "tmpl-booking", title: "Book Service", page: "booking" },
    "cart": { templateId: "tmpl-cart", title: "Your Cart", page: "cart" },

    404: { templateId: "tmpl-home", title: "Page Not Found", page: "home" }
};

const handleLocation = async () => {
    // Get full hash
    let fullHash = window.location.hash.replace('#', '') || '/';

    // Hash Routing for Language: Support #en/services
    // If hash starts with a language code, extract it and update system, 
    // then strip it so the router sees the correct path.
    const langMatch = fullHash.match(/^([a-z]{2})(\/|$)/);
    if (langMatch) {
        const lang = langMatch[1];
        // Switch language if needed (without changing URL again)
        if (typeof window.LanguageRouter !== 'undefined') {
            if (document.documentElement.lang !== lang) {
                console.log(`Router: Prefix detected, switching to ${lang}`);
                window.LanguageRouter.setDir(lang);
                window.LanguageRouter.updateContent(lang);
            }
        }

        // Strip prefix for routing
        // #en -> "" (home)
        // #en/ -> "" (home)
        // #en/services -> services
        if (fullHash === lang) {
            fullHash = '/';
        } else if (fullHash.startsWith(`${lang}/`)) {
            fullHash = fullHash.substring(lang.length + 1); // remove "en/"
        }

        if (fullHash === '') fullHash = '/';
    }

    // separate path and query params (e.g., details?id=123)
    let [path, queryString] = fullHash.split('?');

    // Normalize root
    if (path === '/') path = 'home';
    if (path === '') path = 'home';

    // Parse Query Params
    const urlParams = new URLSearchParams(queryString);
    const params = Object.fromEntries(urlParams.entries());
    window.currentParams = params; // Expose globally

    const routeData = routes[path] || routes[404];

    console.log(`Navigating to Hash: ${path}, Template: ${routeData.templateId}, Params:`, params);

    try {
        const template = document.getElementById(routeData.templateId);
        if (!template) {
            throw new Error(`Template not found: ${routeData.templateId}`);
        }

        // Clone content
        const content = template.content.cloneNode(true);
        const appContainer = document.getElementById("app-container");
        appContainer.innerHTML = ''; // Clear current
        appContainer.appendChild(content);

        document.title = routeData.title;

        window.currentPage = routeData.page;
        window.currentCategory = routeData.category || 'all';

        updateActiveState(path);

        // Re-initialize scripts
        if (window.initPageScripts) {
            // Make sure execution happens after DOM update
            // cloneNode inserts immediate DOM elements but verify logic
            setTimeout(() => {
                console.log(`Triggering initPageScripts for ${routeData.page}`);
                window.initPageScripts(routeData.page, routeData.category);
            }, 0);
        }

        window.scrollTo(0, 0);

    } catch (err) {
        console.error("Router Error:", err);
        document.getElementById("app-container").innerHTML = "<p class='text-center py-5 text-danger'>Error loading content. Please check console.</p>";
    }
};

const updateActiveState = (path) => {
    document.querySelectorAll('.nav-link').forEach(link => link.classList.remove('active'));

    // Fix: Match href="#path" or href="#/path" depending on how we write it in HTML
    let activeLink = document.querySelector(`a[href="#${path}"]`);
    if (activeLink) activeLink.classList.add('active');

    // Handle Hierarchy
    // Handle Hierarchy
    const servicePaths = ['home', 'services', 'packages', 'massages', 'hammam', 'scrubs', 'details', 'booking', 'cart'];

    const serviceNav = document.getElementById('service-nav-container');

    if (servicePaths.includes(path)) {
        // Activate Global Home Tab (href="#home" or href="#")
        const globalHome = document.querySelector('a[href="#"]'); // Root link
        if (globalHome) globalHome.classList.add('active');

        if (serviceNav) serviceNav.style.display = 'block';
        document.body.classList.remove('subnav-hidden');
    } else {
        if (serviceNav) serviceNav.style.display = 'none';
        document.body.classList.add('subnav-hidden');

        // If salon or gallery, global link is already handled by step 1/2?
        // Note: Global salon link is href="#salon". It will match step 2.
    }
};

window.addEventListener('hashchange', handleLocation);
document.addEventListener("DOMContentLoaded", handleLocation);
