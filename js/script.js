(function () {

    var sidebarItems = [
        { href: '/', label: 'Overview' },
        { href: '/documentation.html', label: 'Docs' },
        { href: '/products.html', label: 'Products' },
        { href: '/research.html', label: 'Research' },
        { href: '/roadmap.html', label: 'Roadmap' },
        { href: '/about.html', label: 'About' }
    ];

    function normalizePath(pathname) {
        var normalized = (pathname || '/')
            .replace(/index\.html$/, '')
            .replace(/\.html$/, '')
            .replace(/\/+$/, '');
        return normalized || '/';
    }

    function initSidebar() {
        if (document.querySelector('.site-sidebar')) return;

        var body = document.body;
        if (!body) return;

        body.classList.add('has-sidebar');

        var sidebar = document.createElement('aside');
        sidebar.className = 'site-sidebar';
        sidebar.id = 'site-sidebar-panel';
        sidebar.setAttribute('aria-label', 'Sidebar');

        var links = sidebarItems.map(function (item) {
            return '<li><a href="' + item.href + '">' + item.label + '</a></li>';
        }).join('');

        sidebar.innerHTML =
            '<a href="/" class="sidebar-logo"><span class="nav-mark">K</span><span class="sidebar-logo-text">KONTYRA Wiki</span></a>' +
            '<div class="sidebar-search"><input class="nav-search-input" type="search" placeholder="Search" aria-label="Search"></div>' +
            '<ul class="sidebar-links">' + links + '</ul>' +
            '<p class="sidebar-note">Continuous Intelligence.<br>Limitless Impact.</p>';

        var overlay = document.createElement('div');
        overlay.className = 'sidebar-overlay';
        overlay.setAttribute('hidden', 'hidden');

        body.appendChild(sidebar);
        body.appendChild(overlay);

        var navInner = document.querySelector('.nav-inner');
        if (navInner && !navInner.querySelector('.sidebar-toggle')) {
            var toggle = document.createElement('button');
            toggle.className = 'sidebar-toggle';
            toggle.type = 'button';
            toggle.setAttribute('aria-expanded', 'false');
            toggle.setAttribute('aria-controls', 'site-sidebar-panel');
            toggle.innerHTML = '<span></span>Menu';
            navInner.insertBefore(toggle, navInner.firstChild);
        }

        function closeSidebar() {
            body.classList.remove('sidebar-open');
            var toggle = document.querySelector('.sidebar-toggle');
            if (toggle) toggle.setAttribute('aria-expanded', 'false');
            overlay.setAttribute('hidden', 'hidden');
        }

        function openSidebar() {
            body.classList.add('sidebar-open');
            var toggle = document.querySelector('.sidebar-toggle');
            if (toggle) toggle.setAttribute('aria-expanded', 'true');
            overlay.removeAttribute('hidden');
        }

        document.addEventListener('click', function (e) {
            var target = e.target;
            if (!(target instanceof Element)) return;

            if (target.closest('.sidebar-toggle')) {
                if (body.classList.contains('sidebar-open')) {
                    closeSidebar();
                } else {
                    openSidebar();
                }
            }

            if (target.closest('.sidebar-overlay') || target.closest('.sidebar-links a')) {
                closeSidebar();
            }
        });

        window.addEventListener('resize', function () {
            if (window.innerWidth > 980) {
                closeSidebar();
            }
        });
    }

    function setActiveNav() {
        var path = normalizePath(window.location.pathname);
        var links = document.querySelectorAll('.nav-links a, .sidebar-links a');

        links.forEach(function (link) {
            link.classList.remove('active');
            var href = link.getAttribute('href');
            if (!href) return;

            var linkPath = normalizePath(new URL(href, window.location.origin).pathname);
            var isRoot = linkPath === '/';
            if (isRoot && path === '/') {
                link.classList.add('active');
            } else if (!isRoot && (path === linkPath || path.startsWith(linkPath + '/'))) {
                link.classList.add('active');
            }
        });
    }

    function initSearch() {
        var forms = document.querySelectorAll('.search-bar, #search-page-form');
        forms.forEach(function (form) {
            form.addEventListener('submit', function (e) {
                e.preventDefault();
                var input = form.querySelector('input[type="search"]');
                var query = input ? input.value.trim() : '';
                if (query) {
                    window.location.href = '/search.html?q=' + encodeURIComponent(query);
                }
            });
        });

        var navInputs = document.querySelectorAll('.nav-search-input');
        navInputs.forEach(function (navInput) {
            navInput.addEventListener('keydown', function (e) {
                if (e.key === 'Enter') {
                    var query = navInput.value.trim();
                    if (query) {
                        window.location.href = '/search.html?q=' + encodeURIComponent(query);
                    }
                }
            });
        });
    }

    function initSearch_page() {
        if (window.location.pathname !== '/search.html') return;
        var params = new URLSearchParams(window.location.search);
        var query = params.get('q') || '';
        var titleEl = document.getElementById('search-query-title');
        var inputEl = document.getElementById('search-input');
        if (titleEl) titleEl.textContent = query;
        if (inputEl) inputEl.value = query;

        if (!query) return;

        var articles = [
            {
                title: 'The Origin of KONTYRA',
                url: '/articles/the-origin-of-kontyra.html',
                tag: 'Foundation',
                date: 'June 6, 2026',
                excerpt: 'The story behind the name — from Cool Shot Systems to a technology company built around the idea of Continuous Intelligence.'
            },
            {
                title: 'What is KONTYRA?',
                url: '/articles/what-is-kontyra.html',
                tag: 'Foundation',
                date: 'June 6, 2026',
                excerpt: 'An introduction to the company, its philosophy of Continuous Intelligence, and its vision for technology that makes limitless impact.'
            },
            {
                title: 'Introducing DevOS',
                url: '/articles/introducing-devos.html',
                tag: 'Product',
                date: 'June 6, 2026',
                excerpt: 'DevOS is KONTYRA\'s developer operating system — a unified environment for building, deploying, and understanding software at scale.'
            },
            {
                title: 'Continuous Intelligence, Limitless Impact',
                url: '/articles/continuous-intelligence-limitless-impact.html',
                tag: 'Vision',
                date: 'June 6, 2026',
                excerpt: 'The philosophy behind KONTYRA\'s tagline and what it means for how we design systems, measure success, and think about technology\'s role in the world.'
            },
            {
                title: 'Wiki Style Guide',
                url: '/articles/wiki-style-guide.html',
                tag: 'Reference',
                date: 'June 6, 2026',
                excerpt: 'Article structure, heading formats, citation rules, and naming conventions for consistent, high-quality content.'
            }
        ];

        var q = query.toLowerCase();
        var results = articles.filter(function (a) {
            return a.title.toLowerCase().includes(q) ||
                a.excerpt.toLowerCase().includes(q) ||
                a.tag.toLowerCase().includes(q);
        });

        var container = document.getElementById('search-results');
        var countEl = document.getElementById('search-count');
        if (!container) return;

        if (countEl) {
            countEl.textContent = results.length + ' result' + (results.length !== 1 ? 's' : '') + ' for "' + query + '"';
        }

        if (results.length === 0) {
            container.innerHTML = '<p style="color:var(--text-muted);padding:40px 0;">No articles matched your search. Try a different term.</p>';
            return;
        }

        container.innerHTML = results.map(function (a) {
            return '<a href="' + a.url + '" class="article-card">' +
                '<div class="article-card-meta"><span class="tag">' + a.tag + '</span><span class="article-date">' + a.date + '</span></div>' +
                '<h3>' + a.title + '</h3>' +
                '<p>' + a.excerpt + '</p>' +
                '</a>';
        }).join('');
    }

    document.addEventListener('DOMContentLoaded', function () {
        initSidebar();
        setActiveNav();
        initSearch();
        initSearch_page();
    });

}());
