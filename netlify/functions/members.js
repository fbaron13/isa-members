<!DOCTYPE html>
<html lang="de">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>ISA Germany - Mitgliederverzeichnis</title>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
            background: transparent;
            color: #1a1a1a;
        }
        
        .container {
            max-width: 1400px;
            margin: 0 auto;
            padding: 20px;
        }
        
        h1 {
            font-size: 2rem;
            margin-bottom: 40px;
        }
        
        h2 {
            font-size: 1.5rem;
            margin: 40px 0 20px;
            padding-bottom: 10px;
            border-bottom: 2px solid #2d5016;
            color: #2d5016;
        }
        
        .search-box {
            margin-bottom: 30px;
        }
        
        .search-box input {
            width: 100%;
            max-width: 500px;
            padding: 14px 20px;
            border: 2px solid #e0e0e0;
            border-radius: 10px;
            font-size: 15px;
        }
        
        .search-box input:focus {
            outline: none;
            border-color: #2d5016;
        }
        
        .company-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
            gap: 24px;
            margin-bottom: 20px;
        }
        
        .company-card {
            background: white;
            border-radius: 12px;
            padding: 24px;
            border: 1px solid #e0e0e0;
            transition: all 0.3s;
        }
        
        .company-card:hover {
            transform: translateY(-4px);
            box-shadow: 0 8px 20px rgba(0,0,0,0.1);
            border-color: #2d5016;
        }
        
        .company-header {
            display: flex;
            gap: 16px;
            margin-bottom: 16px;
            align-items: center;
        }
        
        .company-logo {
            width: 80px;
            height: 80px;
            object-fit: contain;
            border-radius: 8px;
            border: 1px solid #e0e0e0;
            background: white;
        }
        
        .company-logo-placeholder {
            width: 80px;
            height: 80px;
            border-radius: 8px;
            border: 2px dashed #e0e0e0;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 2rem;
            color: #ccc;
        }
        
        .company-info {
            flex: 1;
        }
        
        .company-name {
            font-size: 1.2rem;
            font-weight: 700;
            color: #1a1a1a;
            margin-bottom: 4px;
        }
        
        .company-name a {
            color: #1a1a1a;
            text-decoration: none;
        }
        
        .company-name a:hover {
            color: #2d5016;
        }
        
        .company-location {
            color: #666;
            font-size: 0.9rem;
        }
        
        .company-contacts {
            display: flex;
            flex-direction: column;
            gap: 8px;
        }
        
        .contact-item {
            display: flex;
            align-items: center;
            gap: 8px;
            font-size: 0.9rem;
        }
        
        .contact-item a {
            color: #2d5016;
            text-decoration: none;
        }
        
        .contact-item a:hover {
            text-decoration: underline;
        }
        
        .show-more-container {
            text-align: center;
            margin: 30px 0;
        }
        
        .show-more-btn {
            background: #2d5016;
            color: white;
            border: none;
            padding: 12px 32px;
            border-radius: 8px;
            font-size: 1rem;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s;
        }
        
        .show-more-btn:hover {
            background: #1f3910;
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(45, 80, 22, 0.3);
        }
        
        .table-container {
            background: white;
            border-radius: 12px;
            overflow: hidden;
            border: 1px solid #e0e0e0;
        }
        
        table {
            width: 100%;
            border-collapse: collapse;
        }
        
        thead {
            background: #2d5016;
            color: white;
        }
        
        th {
            padding: 16px;
            text-align: left;
            font-weight: 600;
            font-size: 0.85rem;
            text-transform: uppercase;
        }
        
        td {
            padding: 14px 16px;
            border-bottom: 1px solid #f0f0f0;
            font-size: 0.9rem;
        }
        
        tbody tr:hover {
            background: #f8f9fa;
        }
        
        tbody tr:last-child td {
            border-bottom: none;
        }
        
        .loading {
            text-align: center;
            padding: 60px;
        }
        
        .loading-spinner {
            width: 50px;
            height: 50px;
            border: 4px solid #f0f0f0;
            border-top-color: #2d5016;
            border-radius: 50%;
            animation: spin 1s linear infinite;
            margin: 0 auto 20px;
        }
        
        @keyframes spin {
            to { transform: rotate(360deg); }
        }
        
        .stats {
            display: flex;
            gap: 20px;
            margin-bottom: 30px;
        }
        
        .stat {
            background: white;
            padding: 20px 30px;
            border-radius: 10px;
            border: 1px solid #e0e0e0;
        }
        
        .stat-number {
            font-size: 2rem;
            font-weight: 700;
            color: #2d5016;
        }
        
        .stat-label {
            color: #666;
            font-size: 0.85rem;
            margin-top: 4px;
        }
        
        @media (max-width: 768px) {
            .company-grid {
                grid-template-columns: 1fr;
            }
            
            .stats {
                flex-direction: column;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>Mitgliederverzeichnis</h1>
        
        <div class="stats">
            <div class="stat">
                <div class="stat-number" id="total">-</div>
                <div class="stat-label">Gesamt</div>
            </div>
            <div class="stat">
                <div class="stat-number" id="companies-count">-</div>
                <div class="stat-label">Firmenmitglieder</div>
            </div>
            <div class="stat">
                <div class="stat-number" id="individuals-count">-</div>
                <div class="stat-label">Einzelmitglieder</div>
            </div>
        </div>
        
        <div class="search-box">
            <input type="text" id="search" placeholder="Suche nach Name, Stadt..." oninput="filterMembers()">
        </div>
        
        <div id="loading" class="loading">
            <div class="loading-spinner"></div>
            <p>Mitgliederdaten werden geladen...</p>
        </div>
        
        <div id="content" style="display: none;">
            <h2>Firmenmitglieder</h2>
            <div id="companies" class="company-grid"></div>
            <div id="show-more-container" class="show-more-container" style="display: none;">
                <button class="show-more-btn" onclick="showAllCompanies()">Mehr anzeigen</button>
            </div>
            
            <h2>Einzelmitglieder</h2>
            <div class="table-container">
                <table>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>PLZ</th>
                            <th>Stadt</th>
                            <th>Telefon</th>
                            <th>Email</th>
                        </tr>
                    </thead>
                    <tbody id="individuals"></tbody>
                </table>
            </div>
        </div>
    </div>

    <script>
        let allMembers = [];
        let companies = [];
        let individuals = [];
        let showingAllCompanies = false;

        async function loadMembers() {
            try {
                const res = await fetch('/.netlify/functions/members');
                
                if (!res.ok) {
                    throw new Error('HTTP ' + res.status);
                }
                
                const data = await res.json();
                console.log('Response type:', typeof data);
                console.log('Is array?', Array.isArray(data));
                
                // Handle different response structures
                if (Array.isArray(data)) {
                    allMembers = data;
                } else if (data.results) {
                    allMembers = data.results;
                } else if (data.data) {
                    allMembers = data.data;
                } else if (data.members) {
                    allMembers = data.members;
                } else if (data.error) {
                    throw new Error(data.error + ': ' + data.message);
                } else {
                    console.error('Unknown response structure:', data);
                    throw new Error('Invalid response format');
                }
                
                console.log('Loaded', allMembers.length, 'members');
                
                // Filter: Only keep members with complete contact data
                companies = allMembers.filter(m => {
                    const cd = m.contactDetailsData || {};
                    // Must have company name AND (email OR phone)
                    return cd.companyName && 
                           cd.companyName.trim() !== '' &&
                           (cd.companyEmail || cd.companyPhone || m.emailOrUserName);
                });
                
                individuals = allMembers.filter(m => {
                    const cd = m.contactDetailsData || {};
                    // Must NOT be company AND have (email OR phone)
                    const isNotCompany = !cd.companyName || cd.companyName.trim() === '';
                    const hasContact = cd.privateEmail || cd.privatePhone || m.emailOrUserName;
                    return isNotCompany && hasContact;
                });
                
                console.log('Valid companies:', companies.length, 'Valid individuals:', individuals.length);
                
                updateStats();
                renderMembers();
                
                document.getElementById('loading').style.display = 'none';
                document.getElementById('content').style.display = 'block';
                
            } catch (e) {
                alert('Fehler beim Laden: ' + e.message);
                console.error(e);
            }
        }

        function updateStats() {
            document.getElementById('total').textContent = companies.length + individuals.length;
            document.getElementById('companies-count').textContent = companies.length;
            document.getElementById('individuals-count').textContent = individuals.length;
        }

        function renderMembers() {
            renderCompanies();
            renderIndividuals();
        }

        function renderCompanies() {
            const container = document.getElementById('companies');
            const search = document.getElementById('search').value.toLowerCase();
            const isSearching = search.trim() !== '';
            
            const filtered = companies.filter(m => {
                if (!isSearching) return true; // Show all if not searching
                
                const cd = m.contactDetailsData || {};
                const searchStr = [
                    cd.companyName,
                    cd.companyCity,
                    cd.city,
                    cd.companyZip,
                    cd.companyEmail,
                    cd.companyPhone
                ].join(' ').toLowerCase();
                return searchStr.includes(search);
            });
            
            // Calculate items per row (assume ~3 cards per row at 350px min-width)
            const itemsPerRow = 3;
            const initialRows = 2;
            const initialCount = itemsPerRow * initialRows;
            
            // Show limited or all based on state and search
            const displayCount = (showingAllCompanies || isSearching) ? filtered.length : Math.min(initialCount, filtered.length);
            const displayMembers = filtered.slice(0, displayCount);
            
            container.innerHTML = displayMembers.map(m => {
                const cd = m.contactDetailsData || {};
                const name = cd.companyName;
                const zip = cd.companyZip || cd.zip || '';
                const city = cd.companyCity || cd.city || '';
                const email = cd.companyEmail || m.emailOrUserName || '';
                const phone = cd.companyPhone || cd.mobilePhone || '';
                const website = cd.companyWebsite || '';
                const logo = m._profilePicture || '';
                
                return `
                    <div class="company-card">
                        <div class="company-header">
                            ${logo ? 
                                `<img src="${logo}" alt="${name}" class="company-logo">` :
                                `<div class="company-logo-placeholder">🏢</div>`
                            }
                            <div class="company-info">
                                <div class="company-name">
                                    ${website ? 
                                        `<a href="${website}" target="_blank">${name}</a>` :
                                        name
                                    }
                                </div>
                                <div class="company-location">${zip} ${city}</div>
                            </div>
                        </div>
                        <div class="company-contacts">
                            ${phone ? `
                                <div class="contact-item">
                                    📞 <a href="tel:${phone}">${phone}</a>
                                </div>
                            ` : ''}
                            ${email ? `
                                <div class="contact-item">
                                    ✉️ <a href="mailto:${email}">${email}</a>
                                </div>
                            ` : ''}
                            ${website ? `
                                <div class="contact-item">
                                    🌐 <a href="${website}" target="_blank">Website</a>
                                </div>
                            ` : ''}
                        </div>
                    </div>
                `;
            }).join('');
            
            // Show/hide "Show more" button
            const showMoreBtn = document.getElementById('show-more-container');
            if (!isSearching && filtered.length > initialCount && !showingAllCompanies) {
                showMoreBtn.style.display = 'block';
            } else {
                showMoreBtn.style.display = 'none';
            }
        }

        function renderIndividuals() {
            const tbody = document.getElementById('individuals');
            const search = document.getElementById('search').value.toLowerCase();
            
            const filtered = individuals.filter(m => {
                if (!search.trim()) return true;
                
                const cd = m.contactDetailsData || {};
                const searchStr = [
                    cd.firstName,
                    cd.familyName,
                    cd.city,
                    cd.zip,
                    cd.privateEmail,
                    cd.privatePhone
                ].join(' ').toLowerCase();
                return searchStr.includes(search);
            });
            
            tbody.innerHTML = filtered.map(m => {
                const cd = m.contactDetailsData || {};
                const name = [cd.firstName, cd.familyName].filter(Boolean).join(' ') || cd.name || 'Unbekannt';
                const zip = cd.zip;
                const city = cd.city;
                const email = cd.privateEmail || m.emailOrUserName || '';
                const phone = cd.privatePhone || cd.mobilePhone || '';
                
                return `
                    <tr>
                        <td><strong>${name}</strong></td>
                        <td>${zip}</td>
                        <td>${city}</td>
                        <td>${phone ? `<a href="tel:${phone}">${phone}</a>` : '-'}</td>
                        <td>${email ? `<a href="mailto:${email}">${email}</a>` : '-'}</td>
                    </tr>
                `;
            }).join('');
        }

        function showAllCompanies() {
            showingAllCompanies = true;
            renderCompanies();
        }

        function filterMembers() {
            // Reset show all when searching
            showingAllCompanies = false;
            renderMembers();
        }

        loadMembers();
    </script>
</body>
</html>
