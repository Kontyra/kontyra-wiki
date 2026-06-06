(function () {

    function setActiveNav() {
        var path = window.location.pathname;
        var links = document.querySelectorAll('.nav-links a');
        links.forEach(function (link) {
            link.classList.remove('active');
            var href = link.getAttribute('href');
            if (href === '/' && path === '/') {
                link.classList.add('active');
            } else if (href !== '/' && path.startsWith(href.replace('.html', ''))) {
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

        var navInput = document.querySelector('.nav-search-input');
        if (navInput) {
            navInput.addEventListener('keydown', function (e) {
                if (e.key === 'Enter') {
                    var query = navInput.value.trim();
                    if (query) {
                        window.location.href = '/search.html?q=' + encodeURIComponent(query);
                    }
                }
            });
        }
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
        setActiveNav();
        initSearch();
        initSearch_page();
    });

}());
