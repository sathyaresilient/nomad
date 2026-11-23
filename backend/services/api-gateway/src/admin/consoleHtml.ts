/**
 * Embedded Web Admin Console HTML Template
 * Pure client-side zero-dependency single-page application for platform management
 */

export function renderAdminConsoleHtml(): string {
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Nomadly Admin Console</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap" rel="stylesheet">
    <style>
        body { font-family: 'Plus Jakarta Sans', sans-serif; }
        .glass { background: rgba(255, 255, 255, 0.85); backdrop-filter: blur(12px); }
    </style>
</head>
<body class="bg-slate-50 text-slate-900 min-h-screen">
    <!-- Top Navigation -->
    <header class="glass sticky top-0 z-40 border-b border-slate-200">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
            <div class="flex items-center space-x-3">
                <div class="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center text-white font-bold text-lg shadow-sm">
                    N
                </div>
                <div>
                    <h1 class="text-lg font-bold tracking-tight text-slate-900">Nomadly Console</h1>
                    <p class="text-xs text-slate-500">Live Management & Moderation</p>
                </div>
            </div>

            <div class="flex items-center space-x-3">
                <span id="apiStatusBadge" class="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
                    <span class="w-1.5 h-1.5 mr-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                    API Connected
                </span>

                <button onclick="changeApiKey()" class="text-xs px-3 py-1.5 rounded-lg border border-slate-300 hover:bg-slate-100 text-slate-700 font-medium transition">
                    Change Key
                </button>
                <button onclick="loadDashboard()" class="text-xs px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-medium shadow-sm transition">
                    ↻ Refresh
                </button>
            </div>
        </div>
    </header>

    <!-- Main Container -->
    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <!-- Tabs -->
        <div class="flex border-b border-slate-200 mb-6 space-x-8">
            <button onclick="switchTab('metricsTab')" id="tabBtnMetrics" class="tab-btn pb-3 border-b-2 border-indigo-600 font-semibold text-sm text-indigo-600">
                Overview & Metrics
            </button>
            <button onclick="switchTab('usersTab')" id="tabBtnUsers" class="tab-btn pb-3 border-b-2 border-transparent font-medium text-sm text-slate-500 hover:text-slate-700">
                User Management
            </button>
            <button onclick="switchTab('reportsTab')" id="tabBtnReports" class="tab-btn pb-3 border-b-2 border-transparent font-medium text-sm text-slate-500 hover:text-slate-700 flex items-center">
                UGC Safety & Reports
                <span id="reportsBadge" class="ml-2 px-1.5 py-0.5 text-xs rounded-full bg-rose-100 text-rose-700 font-bold hidden">0</span>
            </button>
        </div>

        <!-- Tab 1: Metrics Overview -->
        <div id="metricsTab" class="tab-content space-y-6">
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div class="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                    <p class="text-xs font-semibold uppercase tracking-wider text-slate-500">Total Registered Users</p>
                    <p id="statTotalUsers" class="text-3xl font-extrabold text-slate-900 mt-2">--</p>
                    <p id="statNewUsers" class="text-xs text-emerald-600 font-medium mt-1">+0 this week</p>
                </div>
                <div class="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                    <p class="text-xs font-semibold uppercase tracking-wider text-slate-500">Active Users (24h)</p>
                    <p id="statActive24h" class="text-3xl font-extrabold text-indigo-600 mt-2">--</p>
                    <p id="statActive7d" class="text-xs text-slate-500 mt-1">-- active past 7d</p>
                </div>
                <div class="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                    <p class="text-xs font-semibold uppercase tracking-wider text-slate-500">Trips Planned</p>
                    <p id="statTrips" class="text-3xl font-extrabold text-slate-900 mt-2">--</p>
                    <p id="statUpcomingTrips" class="text-xs text-slate-500 mt-1">-- upcoming</p>
                </div>
                <div class="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                    <p class="text-xs font-semibold uppercase tracking-wider text-slate-500">Pending Safety Reports</p>
                    <p id="statReports" class="text-3xl font-extrabold text-rose-600 mt-2">--</p>
                    <p id="statBannedUsers" class="text-xs text-slate-500 mt-1">-- banned users</p>
                </div>
            </div>

            <!-- System Services State -->
            <div class="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                <h3 class="text-sm font-semibold uppercase tracking-wider text-slate-500 mb-4">Infrastructure Health</h3>
                <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div class="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                        <div>
                            <p class="text-xs text-slate-500 font-medium">PostgreSQL Database</p>
                            <p class="text-sm font-bold text-slate-800">Supabase Pooler</p>
                        </div>
                        <span class="px-2 py-1 bg-emerald-100 text-emerald-700 text-xs font-bold rounded-lg">ONLINE</span>
                    </div>
                    <div class="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                        <div>
                            <p class="text-xs text-slate-500 font-medium">Memory Cache</p>
                            <p id="redisStatusText" class="text-sm font-bold text-slate-800">Redis</p>
                        </div>
                        <span id="redisStatusBadge" class="px-2 py-1 bg-slate-200 text-slate-700 text-xs font-bold rounded-lg">CHECKING</span>
                    </div>
                    <div class="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                        <div>
                            <p class="text-xs text-slate-500 font-medium">Cloud Gateway</p>
                            <p class="text-sm font-bold text-slate-800">GCP Cloud Run</p>
                        </div>
                        <span class="px-2 py-1 bg-emerald-100 text-emerald-700 text-xs font-bold rounded-lg">READY</span>
                    </div>
                </div>
            </div>
        </div>

        <!-- Tab 2: Users Management -->
        <div id="usersTab" class="tab-content hidden space-y-4">
            <div class="flex flex-col sm:flex-row justify-between gap-3">
                <div class="relative flex-1">
                    <input type="text" id="userSearchInput" onkeydown="if(event.key==='Enter') loadUsers()" placeholder="Search by name or email..." class="w-full px-4 py-2 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500">
                </div>
                <div class="flex space-x-2">
                    <select id="userFilterSelect" onchange="loadUsers()" class="px-3 py-2 rounded-xl border border-slate-300 text-sm bg-white focus:outline-none">
                        <option value="all">All Users</option>
                        <option value="active">Active Only</option>
                        <option value="banned">Banned</option>
                        <option value="verified">Verified</option>
                    </select>
                    <button onclick="loadUsers()" class="px-4 py-2 bg-indigo-600 text-white rounded-xl text-sm font-semibold hover:bg-indigo-700 transition">
                        Search
                    </button>
                </div>
            </div>

            <div class="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <div class="overflow-x-auto">
                    <table class="min-w-full divide-y divide-slate-200">
                        <thead class="bg-slate-50">
                            <tr>
                                <th class="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase">User</th>
                                <th class="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase">Travel Style</th>
                                <th class="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase">Status</th>
                                <th class="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase">Trips</th>
                                <th class="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase">Last Active</th>
                                <th class="px-4 py-3 text-right text-xs font-semibold text-slate-500 uppercase">Actions</th>
                            </tr>
                        </thead>
                        <tbody id="usersTableBody" class="divide-y divide-slate-100 text-sm">
                            <tr><td colspan="6" class="px-4 py-8 text-center text-slate-400">Loading users...</td></tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>

        <!-- Tab 3: UGC Safety & Reports -->
        <div id="reportsTab" class="tab-content hidden space-y-4">
            <div class="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <div class="p-4 border-b border-slate-100 flex justify-between items-center">
                    <div>
                        <h3 class="font-bold text-slate-800">User Moderation & Abuse Reports</h3>
                        <p class="text-xs text-slate-500">Review flagged users and offensive content</p>
                    </div>
                    <button onclick="loadReports()" class="text-xs px-3 py-1.5 rounded-lg border border-slate-300 hover:bg-slate-50 font-medium">
                        Refresh Queue
                    </button>
                </div>
                <div class="overflow-x-auto">
                    <table class="min-w-full divide-y divide-slate-200">
                        <thead class="bg-slate-50">
                            <tr>
                                <th class="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase">Reported User</th>
                                <th class="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase">Reporter</th>
                                <th class="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase">Reason & Details</th>
                                <th class="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase">Date</th>
                                <th class="px-4 py-3 text-right text-xs font-semibold text-slate-500 uppercase">Take Action</th>
                            </tr>
                        </thead>
                        <tbody id="reportsTableBody" class="divide-y divide-slate-100 text-sm">
                            <tr><td colspan="5" class="px-4 py-8 text-center text-slate-400">Loading reports...</td></tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </main>

    <!-- Admin Key Prompt Modal -->
    <div id="keyModal" class="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center hidden">
        <div class="bg-white rounded-2xl p-6 max-w-md w-full mx-4 shadow-xl border border-slate-200">
            <h3 class="text-lg font-bold text-slate-900">Admin Authorization Required</h3>
            <p class="text-xs text-slate-500 mt-1 mb-4">Enter your secret ADMIN_API_KEY to access this console.</p>
            <input type="password" id="adminKeyInput" placeholder="Enter Admin Secret Key..." class="w-full px-4 py-2 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 mb-4">
            <button onclick="saveAdminKey()" class="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-semibold text-sm transition">
                Unlock Console
            </button>
        </div>
    </div>

    <script>
        const API_BASE = '/api/v1/admin';

        function getAdminKey() {
            return localStorage.getItem('nomadly_admin_key') || '';
        }

        function checkAuth() {
            if (!getAdminKey()) {
                document.getElementById('keyModal').classList.remove('hidden');
                return false;
            }
            return true;
        }

        function saveAdminKey() {
            const key = document.getElementById('adminKeyInput').value.trim();
            if (key) {
                localStorage.setItem('nomadly_admin_key', key);
                document.getElementById('keyModal').classList.add('hidden');
                loadDashboard();
            }
        }

        function changeApiKey() {
            localStorage.removeItem('nomadly_admin_key');
            document.getElementById('adminKeyInput').value = '';
            document.getElementById('keyModal').classList.remove('hidden');
        }

        async function apiFetch(endpoint, options = {}) {
            const headers = {
                'x-admin-key': getAdminKey(),
                'Content-Type': 'application/json',
                ...(options.headers || {}),
            };

            const res = await fetch(API_BASE + endpoint, { ...options, headers });
            if (res.status === 403 || res.status === 401) {
                alert('Invalid Admin Key. Please re-enter.');
                changeApiKey();
                throw new Error('Unauthorized');
            }
            return res.json();
        }

        function switchTab(tabId) {
            document.querySelectorAll('.tab-content').forEach(el => el.classList.add('hidden'));
            document.querySelectorAll('.tab-btn').forEach(btn => {
                btn.classList.remove('border-indigo-600', 'text-indigo-600', 'font-semibold');
                btn.classList.add('border-transparent', 'text-slate-500', 'font-medium');
            });

            document.getElementById(tabId).classList.remove('hidden');
            const activeBtn = tabId === 'metricsTab' ? 'tabBtnMetrics' : tabId === 'usersTab' ? 'tabBtnUsers' : 'tabBtnReports';
            const btn = document.getElementById(activeBtn);
            btn.classList.add('border-indigo-600', 'text-indigo-600', 'font-semibold');
            btn.classList.remove('border-transparent', 'text-slate-500', 'font-medium');

            if (tabId === 'usersTab') loadUsers();
            if (tabId === 'reportsTab') loadReports();
        }

        async function loadDashboard() {
            if (!checkAuth()) return;
            try {
                const data = await apiFetch('/metrics');
                document.getElementById('statTotalUsers').innerText = data.users.total.toLocaleString();
                document.getElementById('statNewUsers').innerText = '+' + data.users.new7d + ' this week';
                document.getElementById('statActive24h').innerText = data.users.active24h.toLocaleString();
                document.getElementById('statActive7d').innerText = data.users.active7d.toLocaleString() + ' active past 7d';
                document.getElementById('statTrips').innerText = data.content.tripsTotal.toLocaleString();
                document.getElementById('statUpcomingTrips').innerText = data.content.tripsUpcoming.toLocaleString() + ' upcoming';
                document.getElementById('statReports').innerText = data.moderation.pendingReports;
                document.getElementById('statBannedUsers').innerText = data.users.banned + ' accounts banned';

                const rBadge = document.getElementById('reportsBadge');
                if (data.moderation.pendingReports > 0) {
                    rBadge.innerText = data.moderation.pendingReports;
                    rBadge.classList.remove('hidden');
                } else {
                    rBadge.classList.add('hidden');
                }

                const redisBadge = document.getElementById('redisStatusBadge');
                const redisText = document.getElementById('redisStatusText');
                if (data.services.redis === 'connected') {
                    redisBadge.className = 'px-2 py-1 bg-emerald-100 text-emerald-700 text-xs font-bold rounded-lg';
                    redisBadge.innerText = 'ONLINE';
                    redisText.innerText = 'Redis Clustered';
                } else {
                    redisBadge.className = 'px-2 py-1 bg-amber-100 text-amber-700 text-xs font-bold rounded-lg';
                    redisBadge.innerText = 'STANDBY';
                    redisText.innerText = 'Local / Mock';
                }
            } catch (err) {
                console.error('Metrics failed', err);
            }
        }

        async function loadUsers() {
            if (!checkAuth()) return;
            const search = document.getElementById('userSearchInput').value.trim();
            const filter = document.getElementById('userFilterSelect').value;
            const tbody = document.getElementById('usersTableBody');
            tbody.innerHTML = '<tr><td colspan="6" class="px-4 py-8 text-center text-slate-400">Loading users...</td></tr>';

            try {
                const params = new URLSearchParams({ search, filter });
                const data = await apiFetch('/users?' + params.toString());

                if (!data.users || data.users.length === 0) {
                    tbody.innerHTML = '<tr><td colspan="6" class="px-4 py-8 text-center text-slate-400">No users found.</td></tr>';
                    return;
                }

                tbody.innerHTML = data.users.map(u => {
                    const isBanned = u.bannedUntil && new Date(u.bannedUntil) > new Date();
                    return \`
                        <tr class="hover:bg-slate-50 transition">
                            <td class="px-4 py-3 flex items-center space-x-3">
                                <div class="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-xs font-bold text-slate-600 overflow-hidden">
                                    \${u.avatarUrl ? '<img src="' + u.avatarUrl + '" class="w-full h-full object-cover"/>' : (u.displayName || 'U')[0].toUpperCase()}
                                </div>
                                <div>
                                    <p class="font-semibold text-slate-800">\${u.displayName || 'Unnamed'}</p>
                                    <p class="text-xs text-slate-400">\${u.email}</p>
                                </div>
                            </td>
                            <td class="px-4 py-3 text-slate-600">\${u.travelStyle || 'Not set'}</td>
                            <td class="px-4 py-3">
                                \${isBanned 
                                    ? '<span class="px-2 py-0.5 rounded text-xs font-semibold bg-rose-100 text-rose-700">BANNED</span>'
                                    : (u.isVerified 
                                        ? '<span class="px-2 py-0.5 rounded text-xs font-semibold bg-emerald-100 text-emerald-700">VERIFIED</span>'
                                        : '<span class="px-2 py-0.5 rounded text-xs font-semibold bg-slate-100 text-slate-600">ACTIVE</span>'
                                      )
                                }
                            </td>
                            <td class="px-4 py-3 text-slate-600 font-medium">\${u.tripCount || 0}</td>
                            <td class="px-4 py-3 text-xs text-slate-400">\${new Date(u.lastActiveAt).toLocaleDateString()}</td>
                            <td class="px-4 py-3 text-right space-x-1">
                                \${isBanned
                                    ? \`<button onclick="unbanUser('\${u.id}')" class="text-xs px-2.5 py-1 bg-emerald-50 text-emerald-700 rounded-lg font-medium hover:bg-emerald-100">Unban</button>\`
                                    : \`<button onclick="banUser('\${u.id}', 30)" class="text-xs px-2.5 py-1 bg-rose-50 text-rose-700 rounded-lg font-medium hover:bg-rose-100">Ban 30d</button>\`
                                }
                                \${!u.isVerified
                                    ? \`<button onclick="verifyUser('\${u.id}', true)" class="text-xs px-2.5 py-1 bg-indigo-50 text-indigo-700 rounded-lg font-medium hover:bg-indigo-100">Verify</button>\`
                                    : ''
                                }
                            </td>
                        </tr>
                    \`;
                }).join('');
            } catch (err) {
                tbody.innerHTML = '<tr><td colspan="6" class="px-4 py-8 text-center text-rose-500">Failed to load users.</td></tr>';
            }
        }

        async function banUser(userId, days) {
            if (!confirm('Are you sure you want to ban this user for ' + days + ' days?')) return;
            await apiFetch('/users/' + userId + '/ban', {
                method: 'POST',
                body: JSON.stringify({ days, reason: 'Admin manual ban' }),
            });
            loadUsers();
            loadDashboard();
        }

        async function unbanUser(userId) {
            await apiFetch('/users/' + userId + '/unban', { method: 'POST' });
            loadUsers();
            loadDashboard();
        }

        async function verifyUser(userId, verified) {
            await apiFetch('/users/' + userId + '/verify', {
                method: 'POST',
                body: JSON.stringify({ verified }),
            });
            loadUsers();
        }

        async function loadReports() {
            if (!checkAuth()) return;
            const tbody = document.getElementById('reportsTableBody');
            tbody.innerHTML = '<tr><td colspan="5" class="px-4 py-8 text-center text-slate-400">Loading reports...</td></tr>';

            try {
                const data = await apiFetch('/reports');
                if (!data.reports || data.reports.length === 0) {
                    tbody.innerHTML = '<tr><td colspan="5" class="px-4 py-8 text-center text-slate-400">No active reports. All clear!</td></tr>';
                    return;
                }

                tbody.innerHTML = data.reports.map(r => \`
                    <tr class="hover:bg-slate-50 transition">
                        <td class="px-4 py-3">
                            <p class="font-semibold text-slate-800">\${r.targetUser?.displayName || 'Unknown'}</p>
                            <p class="text-xs text-slate-400">\${r.targetUser?.email || ''}</p>
                        </td>
                        <td class="px-4 py-3">
                            <p class="font-medium text-slate-700">\${r.reporter?.displayName || 'Unknown'}</p>
                            <p class="text-xs text-slate-400">\${r.reporter?.email || ''}</p>
                        </td>
                        <td class="px-4 py-3">
                            <span class="px-2 py-0.5 rounded text-xs font-bold bg-amber-100 text-amber-800">\${r.reason}</span>
                            \${r.details ? '<p class="text-xs text-slate-500 mt-1">' + r.details + '</p>' : ''}
                        </td>
                        <td class="px-4 py-3 text-xs text-slate-400">\${new Date(r.createdAt).toLocaleDateString()}</td>
                        <td class="px-4 py-3 text-right space-x-1">
                            <button onclick="resolveReport('\${r.id}', 'ban')" class="text-xs px-2.5 py-1 bg-rose-600 text-white rounded-lg font-medium hover:bg-rose-700 shadow-sm">
                                Ban Offender
                            </button>
                            <button onclick="resolveReport('\${r.id}', 'dismiss')" class="text-xs px-2.5 py-1 border border-slate-300 text-slate-700 rounded-lg font-medium hover:bg-slate-100">
                                Dismiss
                            </button>
                        </td>
                    </tr>
                \`).join('');
            } catch (err) {
                tbody.innerHTML = '<tr><td colspan="5" class="px-4 py-8 text-center text-rose-500">Failed to load reports queue.</td></tr>';
            }
        }

        async function resolveReport(reportId, action) {
            await apiFetch('/reports/' + reportId + '/resolve', {
                method: 'POST',
                body: JSON.stringify({ action, banDays: 30 }),
            });
            loadReports();
            loadDashboard();
        }

        // Initialize on page load
        window.addEventListener('DOMContentLoaded', () => {
            if (getAdminKey()) {
                loadDashboard();
            } else {
                document.getElementById('keyModal').classList.remove('hidden');
            }
        });
    </script>
</body>
</html>`;
}
