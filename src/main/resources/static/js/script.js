/* ── API Endpoints ───────────────────────────────────────────── */
        const API = {
            add:         'https://netflix-spring-application-production.up.railway.app//api/netflix/add',              // POST
            fetchAll:    'https://netflix-spring-application-production.up.railway.app//api/netflix/fetch',             // GET all
            fetchByName: 'https://netflix-spring-application-production.up.railway.app//api/netflix/fetchByName/'       // GET by name
        };

        /* In-memory list of all content items */
        let allItems = [];


        /* ================================================================
           TOAST
           ================================================================ */
        function showToast(message, type = 'success') {
            const toast       = document.getElementById('toast');
            toast.textContent = message;
            toast.className   = `show toast-${type}`;
            setTimeout(() => { toast.className = ''; }, 3000);
        }


        /* ================================================================
           ALERT BANNERS
           ================================================================ */
        function showAlert(id, html, type = 'error') {
            const el     = document.getElementById(id);
            el.className = `alert alert-${type} visible`;
            el.innerHTML = html;
        }

        function hideAlert(...ids) {
            ids.forEach(id => {
                const el = document.getElementById(id);
                if (el) el.classList.remove('visible');
            });
        }


        /* ================================================================
           FIELD VALIDATION
           ================================================================ */
        function setFieldError(inputId, errId, message) {
            document.getElementById(inputId).classList.add('error');
            const err       = document.getElementById(errId);
            err.textContent = message;
            err.classList.add('visible');
        }

        function clearFieldError(inputId, errId) {
            document.getElementById(inputId).classList.remove('error');
            const err = document.getElementById(errId);
            if (err) { err.textContent = ''; err.classList.remove('visible'); }
        }


        /* ================================================================
           BUTTON LOADING STATE
           ================================================================ */
        function setLoading(btnId, isLoading) {
            const btn    = document.getElementById(btnId);
            btn.disabled = isLoading;
            btn.classList.toggle('loading', isLoading);
        }


        function esc(str) {
            return String(str)
                .replace(/&/g, '&amp;')
                .replace(/</g, '&lt;')
                .replace(/>/g, '&gt;');
        }


        function buildContentCard(item, highlight = false) {
            return `
                <div class="content-card ${highlight ? 'highlight' : ''}">
                    <div class="content-meta">
                        <span class="content-id">#${item.id}</span>
                        <span class="content-category">${esc(item.category || '')}</span>
                    </div>
                    <div class="content-name">${esc(item.name || '')}</div>
                    <div class="content-desc">${esc(item.description || '')}</div>
                </div>`;
        }

        function updateStats() {
            const last = allItems.length > 0 ? allItems[allItems.length - 1] : null;
            document.getElementById('stat-total').textContent  = allItems.length;
            document.getElementById('stat-latest').textContent = last ? `#${last.id}` : '—';
            document.getElementById('stat-cat').textContent    = last ? (last.category || '—') : '—';
        }

        function renderList() {
            const list = document.getElementById('items-list');

            if (allItems.length === 0) {
                list.innerHTML = `
                    <div class="empty-state">
                        <div class="empty-icon">🎬</div>
                        <div class="empty-text">No content yet. Add your first title!</div>
                    </div>`;
            } else {
                list.innerHTML = [...allItems]
                    .reverse()
                    .map(item => buildContentCard(item))
                    .join('');
            }

            updateStats();
        }


        /* ================================================================
           ADD CONTENT  →  POST /api/netflix/add
           ================================================================ */
        async function addContent() {

            const name     = document.getElementById('c-name').value.trim();
            const category = document.getElementById('c-category').value.trim();
            const desc     = document.getElementById('c-desc').value.trim();

            /* 1. Clear previous errors */
            clearFieldError('c-name',     'err-name');
            clearFieldError('c-category', 'err-category');
            clearFieldError('c-desc',     'err-desc');
            hideAlert('add-error', 'add-success');

            /* 2. Validate */
            let hasError = false;
            if (!name)     { setFieldError('c-name',     'err-name',     'Name should not be blank');        hasError = true; }
            if (!category) { setFieldError('c-category', 'err-category', 'Category should not be blank');    hasError = true; }
            if (!desc)     { setFieldError('c-desc',     'err-desc',     'Description should not be blank'); hasError = true; }
            if (hasError) return;

            /* 3. Call API */
            setLoading('add-btn', true);

            try {
                const response = await fetch(API.add, {
                    method:  'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body:    JSON.stringify({ name, category, description: desc })
                });

                const data = await response.json();

                if (response.ok) {
                    allItems.push(data);
                    renderList();

                    /* Clear form */
                    document.getElementById('c-name').value     = '';
                    document.getElementById('c-category').value = '';
                    document.getElementById('c-desc').value     = '';

                    showAlert('add-success',
                        `<div class="alert-title">✓ Content added successfully</div>
                         ID assigned: <strong>#${data.id}</strong>`,
                        'success');

                    showToast(`"${data.name}" added!`, 'success');

                } else if (response.status === 400 && data.errors) {
                    const rows = Object.entries(data.errors)
                        .map(([field, msg]) => `<li><strong>${field}:</strong> ${msg}</li>`)
                        .join('');
                    showAlert('add-error',
                        `<div class="alert-title">Validation failed</div><ul>${rows}</ul>`);

                } else {
                    showAlert('add-error',
                        `<div class="alert-title">Error ${response.status}</div>${data.message || 'Something went wrong.'}`);
                }

            } catch (err) {
                // Connection failed
            }

            setLoading('add-btn', false);
        }


        /* ================================================================
           GET BY NAME  →  GET /api/netflix/fetchByName/{name}
           ================================================================ */
        async function getByName() {

            const name = document.getElementById('get-name').value.trim();

            hideAlert('get-error');
            document.getElementById('search-results').innerHTML = '';

            /* Validate — name must not be empty */
            if (!name) {
                showAlert('get-error',
                    '<div class="alert-title">Empty search</div>Please enter a content name to search.');
                return;
            }

            try {
                /* URL-encode the name so spaces/special chars are handled correctly */
                const encodedName = encodeURIComponent(name);
                const response    = await fetch(API.fetchByName + encodedName);

                if (response.ok) {
                    const data = await response.json();

                    /* Backend may return a single object OR an array — handle both */
                    const results = Array.isArray(data) ? data : [data];

                    if (results.length === 0) {
                        document.getElementById('search-results').innerHTML = `
                            <div class="empty-state">
                                <div class="empty-icon">🔎</div>
                                <div class="empty-text">No content found matching "<strong>${esc(name)}</strong>"</div>
                            </div>`;
                    } else {
                        const cards = results.map(item => buildContentCard(item, true)).join('');
                        document.getElementById('search-results').innerHTML = `
                            <div class="match-count">
                                <span>${results.length}</span> result${results.length > 1 ? 's' : ''} found for "${esc(name)}"
                            </div>
                            ${cards}`;
                        showToast(`${results.length} result${results.length > 1 ? 's' : ''} found`, 'success');
                    }

                } else if (response.status === 404) {
                    document.getElementById('search-results').innerHTML = `
                        <div class="empty-state">
                            <div class="empty-icon">🔎</div>
                            <div class="empty-text">No content found matching "<strong>${esc(name)}</strong>"</div>
                        </div>`;

                } else {
                    showAlert('get-error',
                        `<div class="alert-title">Error ${response.status}</div>Something went wrong.`);
                }

            } catch (err) {
                    // Connection error
            }
        }


        /* ================================================================
           LOAD ALL ON PAGE OPEN  →  GET /api/netflix/fetch
           ================================================================ */
        async function loadAll() {
            try {
                const response = await fetch(API.fetchAll);
                if (response.ok) {
                    allItems = await response.json();
                    renderList();
                }
            } catch (err) {
                /* Server not reachable — start with empty list */
            }
        }

        document.getElementById('get-name')
            .addEventListener('keydown', e => { if (e.key === 'Enter') getByName(); });

        document.getElementById('c-name')
            .addEventListener('keydown', e => { if (e.key === 'Enter') document.getElementById('c-category').focus(); });

        loadAll();


