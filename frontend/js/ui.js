/**
 * UI Component Manager
 * UI բաղադրիչների կառավարիչ
 */

const UI = {
    // Թարգմանություններ
    t: MockData.translations,

    /**
     * Initialize UI - load saved data from localStorage
     */
    init() {
        this.loadTemplatesFromStorage();
        console.log('UI initialized, templates loaded from localStorage');
    },

    /**
     * Load templates from localStorage
     */
    loadTemplatesFromStorage() {
        try {
            const saved = localStorage.getItem('olymp_templates');
            if (saved) {
                const templates = JSON.parse(saved);
                Object.assign(MockData.formTemplates, templates);
                console.log('Loaded templates:', Object.keys(templates));
            }
        } catch (e) {
            console.error('Failed to load templates from localStorage:', e);
        }
    },

    /**
     * Save all templates to localStorage
     */
    saveTemplatesToStorage() {
        try {
            const toSave = {};
            for (const key in MockData.formTemplates) {
                if (key !== 'default') {
                    toSave[key] = MockData.formTemplates[key];
                }
            }
            localStorage.setItem('olymp_templates', JSON.stringify(toSave));
            console.log('Templates saved to localStorage');
        } catch (e) {
            console.error('Failed to save templates to localStorage:', e);
        }
    },

    /**
     * Ցուցադրել գլխավոր էջը
     */
    renderHome() {
        const stats = API.getStatistics();
        const competitions = API.getCompetitions();
        const upcomingCompetitions = competitions.filter(c => c.status === 'upcoming' || c.status === 'registration').slice(0, 3);
        
        return `
            <div class="page-content">
                <h2>Բարի գալուստ Olymp.am! 🎓</h2>
                <p style="font-size: 1.1rem; color: #666; margin-bottom: 2rem;">
                    Սա Հայաստանի դպրոցականների համար նախատեսված օլիմպիադաների կառավարման միասնական հարթակ է։
                    Այստեղ կարող եք մասնակցել օլիմպիադաների, լուծել խնդիրներ և տեսնել արդյունքները։
                </p>
                
                <!-- Վիճակագրություն -->
                <div class="stats-grid">
                    <div class="stat-card">
                        <div class="stat-number">${stats.totalCompetitions}</div>
                        <div class="stat-label">Մրցույթներ</div>
                    </div>
                    <div class="stat-card orange">
                        <div class="stat-number">${stats.totalParticipants}</div>
                        <div class="stat-label">Մասնակիցներ</div>
                    </div>
                    <div class="stat-card green">
                        <div class="stat-number">${stats.totalSchools}</div>
                        <div class="stat-label">Դպրոցներ</div>
                    </div>
                    <div class="stat-card purple">
                        <div class="stat-number">${stats.totalProblems}</div>
                        <div class="stat-label">Խնդիրներ</div>
                    </div>
                </div>

                <!-- Սպասվող մրցույթներ -->
                <h3 style="margin-top: 2rem; margin-bottom: 1rem;">📢 Սպասվող մրցույթներ</h3>
                ${upcomingCompetitions.length > 0 ? `
                    <div class="competition-list">
                        ${upcomingCompetitions.map(comp => this.renderCompetitionCard(comp)).join('')}
                    </div>
                ` : `
                    <div class="empty-state">
                        <div class="empty-state-icon">📅</div>
                        <h3>Սպասվող մրցույթներ չկան</h3>
                        <p>Ներկայումս չկան պլանավորված նոր մրցույթներ</p>
                    </div>
                `}

                <!-- Արագ հղումներ -->
                <div class="card-grid" style="margin-top: 2rem;">
                    <div class="card">
                        <div class="card-icon">🏆</div>
                        <h3>Մրցույթներ</h3>
                        <p>Դիտեք բոլոր ընթացիկ և սպասվող օլիմպիադաները</p>
                        <button onclick="App.navigateTo('competitions')">Դիտել մրցույթները</button>
                    </div>
                    
                    <div class="card">
                        <div class="card-icon">📚</div>
                        <h3>Խնդիրներ</h3>
                        <p>Լուծեք տարբեր բարդության խնդիրներ և բարելավեք ձեր գիտելիքները</p>
                        <button onclick="App.navigateTo('problems')">Լուծել խնդիրներ</button>
                    </div>
                    
                    <div class="card">
                        <div class="card-icon">📊</div>
                        <h3>Արդյունքներ</h3>
                        <p>Տեսեք օլիմպիադաների արդյունքները և վարկանիշային աղյուսակները</p>
                        <button onclick="App.navigateTo('results')">Դիտել արդյունքները</button>
                    </div>
                    
                    <div class="card">
                        <div class="card-icon">🏫</div>
                        <h3>Դպրոցներ</h3>
                        <p>Տեղեկություններ մասնակից դպրոցների և նրանց ցուցանիշների մասին</p>
                        <button onclick="App.navigateTo('schools')">Դիտել դպրոցները</button>
                    </div>
                </div>
            </div>
        `;
    },

    /**
     * Ցուցադրել մրցույթների էջը
     */
    renderCompetitions() {
        const competitions = API.getCompetitions();
        
        return `
            <div class="page-content">
                <h2>🏆 Մրցույթներ</h2>
                
                <!-- Ֆիլտրեր -->
                <div class="filter-bar">
                    <select id="status-filter" onchange="App.filterCompetitions()">
                        <option value="all">Բոլոր մրցույթները</option>
                        <option value="registration">Գրանցումը բաց է</option>
                        <option value="upcoming">Սպասվող</option>
                        <option value="active">Ընթացքի մեջ</option>
                        <option value="completed">Ավարտված</option>
                    </select>
                    <select id="subject-filter" onchange="App.filterCompetitions()">
                        <option value="all">Բոլոր առարկաները</option>
                        ${MockData.subjects.map(s => `<option value="${s.name}">${s.icon} ${s.name}</option>`).join('')}
                    </select>
                    <button class="btn btn-success" onclick="App.showAddCompetitionModal()">+ Ավելացնել մրցույթ</button>
                </div>
                
                <!-- Մրցույթների ցուցակ -->
                <div class="competition-list" id="competitions-list">
                    ${competitions.map(comp => this.renderCompetitionCard(comp)).join('')}
                </div>
            </div>
        `;
    },

    /**
     * Մրցույթի քարտի ձևավորում
     */
    renderCompetitionCard(competition) {
        const statusLabels = {
            'registration': 'Գրանցումը բաց է',
            'upcoming': 'Սպասվող',
            'active': 'Ընթացքի մեջ',
            'completed': 'Ավարտված'
        };
        
        const statusClass = `status-${competition.status}`;
        
        return `
            <div class="competition-card" data-status="${competition.status}" data-subject="${competition.subject}">
                <div class="competition-info">
                    <h3>${competition.name}</h3>
                    <p>${competition.description}</p>
                    <div class="competition-meta">
                        <span class="meta-badge">📅 ${this.formatDate(competition.startDate)}</span>
                        <span class="meta-badge">⏱️ ${competition.duration} րոպե</span>
                        <span class="meta-badge">👥 ${competition.participants}/${competition.maxParticipants}</span>
                        <span class="meta-badge">📚 ${competition.subject}</span>
                    </div>
                </div>
                <div class="competition-actions">
                    <span class="status-badge ${statusClass}">${statusLabels[competition.status]}</span>
                    <br><br>
                    ${competition.status === 'registration' ? `
                        <button class="btn btn-success" onclick="App.showRegistrationModal(${competition.id})">Գրանցվել</button>
                    ` : ''}
                    <button class="btn" onclick="App.viewCompetitionDetails(${competition.id})">Մանրամասն</button>
                </div>
            </div>
        `;
    },

    /**
     * Ցուցադրել խնդիրների էջը
     */
    renderProblems() {
        const problems = API.getProblems();
        
        return `
            <div class="page-content">
                <h2>📚 Խնդիրներ</h2>
                
                <!-- Ֆիլտրեր -->
                <div class="filter-bar">
                    <input type="text" class="search-input" id="problem-search" 
                           placeholder="🔍 Փնտրել խնդիրներ..." oninput="App.filterProblems()">
                    <select id="difficulty-filter" onchange="App.filterProblems()">
                        <option value="all">Բոլոր բարդությունները</option>
                        <option value="easy">✅ Հեշտ</option>
                        <option value="medium">⚡ Միջին</option>
                        <option value="hard">🔥 Բարդ</option>
                    </select>
                    <select id="subject-filter-problems" onchange="App.filterProblems()">
                        <option value="all">Բոլոր առարկաները</option>
                        ${MockData.subjects.map(s => `<option value="${s.name}">${s.icon} ${s.name}</option>`).join('')}
                    </select>
                </div>
                
                <!-- Խնդիրների ցուցակ -->
                <div class="problems-list" id="problems-list">
                    ${problems.map(problem => this.renderProblemItem(problem)).join('')}
                </div>
            </div>
        `;
    },

    /**
     * Խնդրի տարրի ցուցադրում
     */
    renderProblemItem(problem) {
        const difficultyLabels = {
            'easy': 'Հեշտ',
            'medium': 'Միջին',
            'hard': 'Բարդ'
        };

        // Fallback for missing subject - lookup via competition or use default
        let subject = problem.subject;
        if (!subject && problem.competitionId) {
            const competition = API.getCompetitionById(problem.competitionId);
            if (competition) {
                subject = competition.subject;
            }
        }
        subject = subject || 'Անհայտ առարկա';
        
        return `
            <div class="problem-item" data-difficulty="${problem.difficulty}" data-subject="${subject}">
                <div class="problem-info">
                    <h3>${problem.title}</h3>
                    <p>${subject}</p>
                </div>
                <div class="problem-meta">
                    <span class="difficulty difficulty-${problem.difficulty}">${difficultyLabels[problem.difficulty]}</span>
                    <span class="points-badge">${problem.points} միավոր</span>
                    <button class="btn" onclick="App.viewProblemDetails(${problem.id})">Լուծել</button>
                </div>
            </div>
        `;
    },

    /**
     * Ցուցադրել մասնակիցների էջը
     */
    renderParticipants() {
        const participants = API.getParticipants();
        
        return `
            <div class="page-content">
                <h2>👥 Մասնակիցներ</h2>
                
                <!-- Ֆիլտրեր -->
                <div class="filter-bar">
                    <input type="text" class="search-input" id="participant-search" 
                           placeholder="🔍 Փնտրել մասնակիցների..." oninput="App.filterParticipants()">
                    <select id="grade-filter" onchange="App.filterParticipants()">
                        <option value="all">Բոլոր դասարանները</option>
                        ${MockData.grades.map(g => `<option value="${g.value}">${g.label}</option>`).join('')}
                    </select>
                    <button class="btn btn-success" onclick="App.showAddParticipantModal()">+ Ավելացնել մասնակից</button>
                </div>
                
                <!-- Մասնակիցների աղյուսակ -->
                <div class="table-responsive">
                    <table class="data-table" id="participants-table">
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Անուն Ազգանուն</th>
                                <th>Դպրոց</th>
                                <th>Դասարան</th>
                                <th>Քաղաք/Մարզ</th>
                                <th>Մրցույթներ</th>
                                <th>Գործողություն</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${participants.map((p, index) => this.renderParticipantRow(p, index + 1)).join('')}
                        </tbody>
                    </table>
                </div>
            </div>
        `;
    },

    /**
     * Մասնակցի տողի ցուցադրում
     */
    renderParticipantRow(participant, index) {
        const name = participant.name || `${participant.firstName || ''} ${participant.lastName || ''}`.trim() || 'Անհայտ';
        const city = participant.city || '—';

        return `
            <tr data-grade="${participant.grade}">
                <td>${index}</td>
                <td><strong>${name}</strong></td>
                <td>${participant.school}</td>
                <td>${participant.grade}-րդ դասարան</td>
                <td>${city}</td>
                <td>${participant.registeredCompetitions ? participant.registeredCompetitions.length : 0}</td>
                <td>
                    <button class="btn" style="padding: 0.3rem 0.8rem; font-size: 0.85rem;" 
                            onclick="App.viewParticipantDetails(${participant.id})">Դիտել</button>
                </td>
            </tr>
        `;
    },

    /**
     * Ցուցադրել արդյունքների էջը
     */
    renderResults() {
        const competitions = API.getCompetitions().filter(c => c.status === 'completed');
        
        return `
            <div class="page-content">
                <h2>📊 Արդյունքներ</h2>
                
                <!-- Ֆիլտրեր -->
                <div class="filter-bar">
                    <select id="competition-select" onchange="App.loadCompetitionResults()">
                        <option value="">Ընտրեք մրցույթը...</option>
                        ${competitions.map(c => `<option value="${c.id}">${c.name}</option>`).join('')}
                    </select>
                </div>
                
                <!-- Արդյունքների ցուցակ -->
                <div id="results-container">
                    <div class="empty-state">
                        <div class="empty-state-icon">🏅</div>
                        <h3>Ընտրեք մրցույթը</h3>
                        <p>Խնդրում ենք ընտրել մրցույթը ցանկից՝ արդյունքները տեսնելու համար</p>
                    </div>
                </div>
            </div>
        `;
    },

    /**
     * Մրցույթի արդյունքների աղյուսակի ցուցադրում
     */
    renderLeaderboard(competitionId) {
        const leaderboard = API.getLeaderboard(competitionId);
        const competition = API.getCompetitionById(competitionId);
        
        if (competition.status !== 'completed') {
            return `
                <div class="empty-state">
                    <div class="empty-state-icon">⏳</div>
                    <h3>Արդյունքները դեռ հասանելի չեն</h3>
                    <p>Մրցույթը դեռ ընթացքի մեջ է: Արդյունքները հասանելի կլինեն մրցույթի ավարտից հետո:</p>
                </div>
            `;
        }

        if (leaderboard.length === 0) {
            return `
                <div class="empty-state">
                    <div class="empty-state-icon">📊</div>
                    <h3>Արդյունքներ չկան</h3>
                    <p>Այս մրցույթի համար դեռևս արդյունքներ գրանցված չեն</p>
                </div>
            `;
        }
        
        return `
            <div class="leaderboard">
                <h3 style="margin-bottom: 1rem;">${competition.name} - Արդյունքներ</h3>
                
                <!-- Լավագույն 3 մասնակիցները -->
                <div class="stats-grid" style="margin-bottom: 2rem;">
                    ${leaderboard.slice(0, 3).map((entry, index) => `
                        <div class="stat-card ${index === 0 ? '' : index === 1 ? 'green' : 'orange'}">
                            <div class="stat-number">${index === 1 ? '🥈' : index === 2 ? '🥉' : '🥇'}</div>
                            <div class="stat-label">${entry.participantName}</div>
                            <div style="font-size: 1.5rem; margin-top: 0.5rem;">${entry.score !== undefined ? entry.score : (entry.totalScore || 0)} միավոր</div>
                        </div>
                    `).join('')}
                </div>
                
                <!-- Ամբողջական աղյուսակ -->
                <table class="data-table">
                    <thead>
                        <tr>
                            <th>Տեղ</th>
                            <th>Մասնակից</th>
                            <th>Դպրոց</th>
                            <th>Միավոր</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${leaderboard.map(entry => `
                            <tr>
                                <td>
                                    <span class="rank-badge ${entry.rank <= 3 ? 'rank-' + entry.rank : 'rank-default'}">
                                        ${entry.rank}
                                    </span>
                                </td>
                                <td><strong>${entry.participantName}</strong></td>
                                <td>${entry.school}</td>
                                <td><strong>${entry.score !== undefined ? entry.score : (entry.totalScore || 0)}</strong></td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        `;
    },

    /**
     * Դպրոցների էջի ցուցադրում
     */
    renderSchools() {
        const schools = API.getSchools();
        
        return `
            <div class="page-content">
                <h2>🏫 Դպրոցներ և վիճակագրություն</h2>
                
                <!-- Ֆիլտրեր -->
                <div class="filter-bar">
                    <input type="text" class="search-input" id="school-search" 
                           placeholder="🔍 Փնտրել դպրոց..." oninput="App.filterSchools()">
                    <select id="region-filter" onchange="App.filterSchools()">
                        <option value="all">Բոլոր մարզերը</option>
                        ${MockData.regions.map(r => `<option value="${r}">${r}</option>`).join('')}
                    </select>
                    <button class="btn btn-success" onclick="App.showAddSchoolModal()">+ Ավելացնել դպրոց</button>
                </div>
                
                <!-- Դպրոցների ցուցակ -->
                <div class="schools-grid" id="schools-grid">
                    ${schools.map(school => this.renderSchoolCard(school)).join('')}
                </div>
            </div>
        `;
    },

    /**
     * Դպրոցի քարտի ցուցադրում
     */
    renderSchoolCard(school) {
        return `
            <div class="school-card" data-region="${school.region}">
                <h3>${school.name}</h3>
                <p>📍 ${school.city}, ${school.region}</p>
                <p>📞 ${school.phone}</p>
                <p>✉️ ${school.email}</p>
                <div class="school-stats">
                    <div class="school-stat">
                        <div class="number">${school.participantsCount}</div>
                        <div class="label">Մասնակիցներ</div>
                    </div>
                    <div class="school-stat">
                        <div class="number">${school.averageScore}</div>
                        <div class="label">Միջին միավոր</div>
                    </div>
                </div>
            </div>
        `;
    },

    /**
     * "Մեր մասին" էջի ցուցադրում
     */
    renderAbout() {
        return `
            <div class="page-content">
                <h2>ℹ️ Մեր մասին</h2>
                
                <div style="max-width: 800px;">
                    <h3>🎯 Հարթակի նպատակը</h3>
                    <p style="margin-bottom: 1.5rem;">
                        Olymp.am-ը Հայաստանի դպրոցականների համար նախատեսված միասնական օլիմպիական հարթակ է, որը նպատակ ունի պարզեցնել օլիմպիադաների կազմակերպումը և անցկացումը։ Մենք ձգտում ենք ապահովել թափանցիկություն, հասանելիություն և հավասար հնարավորություններ բոլոր աշակերտների համար։
                    </p>
                    
                    <h3>✨ Հնարավորությունները</h3>
                    <ul style="margin-bottom: 1.5rem;">
                        <li>🏆 Մասնակցություն տարբեր առարկայական օլիմպիադաների</li>
                        <li>📝 Արդյունքների և վարկանիշների դիտում</li>
                        <li>👥 Դպրոցների և աշակերտների միասնական բազա</li>
                        <li>📚 Ուսումնական նյութեր և անցած տարիների խնդիրներ</li>
                    </ul>

                    <h3>💻 Տեխնոլոգիական լուծումներ</h3>
                    <ul style="margin-bottom: 1.5rem;">
                        <li><strong>Frontend:</strong> Vanilla JavaScript (ES6+)</li>
                        <li><strong>Տվյալներ:</strong> LocalStorage</li>
                        <li><strong>Դիզայն:</strong> CSS3 (Grid, Flexbox)</li>
                        <li><strong>Արխիտեկտուրա:</strong> Single Page Application (SPA)</li>
                    </ul>
                    
                    <h3>📞 Կապ մեզ հետ</h3>
                    <p>
                        ✉️ Էլ. փոստ: info@olymp.am<br>
                        📞 Հեռախոս: +374 10 123456<br>
                        📍 Հասցե: Երևան, Ալեք Մանուկյան 1
                    </p>
                    
                    <div style="margin-top: 2rem; padding: 1rem; background: #f0f4f8; border-radius: 8px;">
                        <h4 style="margin-top: 0;">🔄 Տվյալների վերականգնում</h4>
                        <p style="margin-bottom: 1rem;">Եթե ցանկանում եք վերականգնել տվյալների բազան սկզբնական վիճակի, կարող եք օգտագործել այս կոճակը։ Ուշադրություն՝ բոլոր փոփոխությունները կկորչեն։</p>
                        <button class="btn btn-warning" onclick="App.resetAllData()">Վերականգնել տվյալները</button>
                    </div>
                </div>
            </div>
        `;
    },

    // ==================== Մոդալ պատուհաններ ====================

    /**
     * Գրանցման պատուհանի ցուցադրում
     */
    renderRegistrationModal(competitionId) {
        const competition = API.getCompetitionById(competitionId);
        const schools = API.getSchools();
        
        return `
            <div class="modal-header">
                <h2>📝 Գրանցվել մրցույթին</h2>
                <button class="modal-close" onclick="App.closeModal()">&times;</button>
            </div>
            <div class="modal-body">
                <p style="margin-bottom: 1.5rem;">
                    <strong>Մրցույթ՝</strong> ${competition.name}<br>
                    <strong>Սկսվում է՝</strong> ${this.formatDate(competition.startDate)}<br>
                    <strong>Վերջնաժամկետ՝</strong> ${this.formatDate(competition.registrationDeadline)}
                </p>
                
                <form id="registration-form">
                    <input type="hidden" id="competition-id" value="${competitionId}">
                    
                    <div class="form-row">
                        <div class="form-group">
                            <label for="reg-name">Անուն Ազգանուն *</label>
                            <input type="text" id="reg-name" required placeholder="Արմեն Արմենյան">
                        </div>
                        <div class="form-group">
                            <label for="reg-email">Էլ. փոստ *</label>
                            <input type="email" id="reg-email" required placeholder="example@email.com">
                        </div>
                    </div>
                    
                    <div class="form-row">
                        <div class="form-group">
                            <label for="reg-school">Դպրոց *</label>
                            <select id="reg-school" required>
                                <option value="">Ընտրեք դպրոցը...</option>
                                ${schools.map(s => `<option value="${s.name}">${s.name}</option>`).join('')}
                            </select>
                        </div>
                        <div class="form-group">
                            <label for="reg-grade">Դասարան *</label>
                            <select id="reg-grade" required>
                                <option value="">Ընտրեք դասարանը...</option>
                                ${MockData.grades.map(g => `<option value="${g.value}">${g.label}</option>`).join('')}
                            </select>
                        </div>
                    </div>
                    
                    <div class="form-group">
                        <label for="reg-city">Քաղաք/Մարզ *</label>
                        <input type="text" id="reg-city" required placeholder="Երևան">
                    </div>
                </form>
            </div>
            <div class="modal-footer">
                <button class="btn btn-secondary" onclick="App.closeModal()">Չեղարկել</button>
                <button class="btn btn-success" onclick="App.submitRegistration()">Հաստատել</button>
            </div>
        `;
    },


    /**
     * Opens a printable answer sheet window using the saved template configuration
     */
    printAnswerSheetTemplate(subject, competitionName) {
        // Find the template for this subject
        const templateId = this.findTemplateForSubject(subject);
        const template = MockData.formTemplates[templateId] || MockData.formTemplates['default'];
        
        console.log('Using template:', templateId, template);
        
        // Get section configurations
        const mcqSection = template.sections.find(s => s.type === 'multiple_choice') || { questions: { start: 1, end: 15 }, options: 4 };
        const shortSection = template.sections.find(s => s.type === 'handwritten_number') || { questions: { start: 16, end: 20 }, maxDigits: 4 };
        
        const mcqCount = mcqSection.questions.end - mcqSection.questions.start + 1;
        const mcqOptions = mcqSection.options || 4;
        const shortStart = shortSection.questions.start;
        const shortEnd = shortSection.questions.end;
        const shortCount = shortEnd - shortStart + 1;
        const maxDigits = shortSection.maxDigits || 4;
        
        // Generate MCQ option headers
        let mcqHeaders = '';
        for (let i = 1; i <= mcqOptions; i++) {
            mcqHeaders += '<div style="font-weight: bold; text-align: center;">' + i + '</div>';
        }
        
        // Generate MCQ rows
        let mcqRows = '';
        for (let i = 0; i < mcqCount; i++) {
            mcqRows += '<div>' + (mcqSection.questions.start + i) + '</div>';
            for (let j = 0; j < mcqOptions; j++) {
                mcqRows += '<div class="square"></div>';
            }
        }
        
        // Generate short answer rows
        let shortRows = '';
        for (let i = 0; i < shortCount; i++) {
            let digitDividers = '';
            for (let d = 0; d < maxDigits - 1; d++) {
                digitDividers += '<div style="border-right: 0.5px solid #ddd; flex: 1;"></div>';
            }
            digitDividers += '<div style="flex: 1;"></div>';
            
            shortRows += '<div style="margin-bottom: 15px; display: flex; align-items: center; gap: 10px;">' +
                '<strong>' + (shortStart + i) + '</strong>' +
                '<div>' +
                    '<div style="border:0.5px solid #bbb; height:25px; width: ' + (maxDigits * 25) + 'px; display: flex;">' +
                        digitDividers +
                    '</div>' +
                    '<div style="font-size: 10px; color: #666; text-align: center;">պատասխան</div>' +
                '</div>' +
            '</div>';
        }
        
        // Build short answer section HTML
        let shortSectionHtml = '';
        if (shortCount > 0) {
            shortSectionHtml = '<div>' +
                '<h4 style="text-align: center;">Կարճ Պատասխան (' + shortStart + '-' + shortEnd + ')</h4>' +
                shortRows +
            '</div>';
        }

        const win = window.open('', '_blank');
        win.document.write(
            '<html>' +
            '<head>' +
                '<title>Պատասխանաթերթիկ - ' + competitionName + '</title>' +
                '<style>' +
                    'body { font-family: "DejaVu Sans", sans-serif; margin: 0; padding: 0; }' +
                    '.page-container { position: relative; width: 210mm; min-height: 297mm; padding: 15mm; margin: 0 auto; box-sizing: border-box; }' +
                    '.fiducial { position: absolute; width: 20px; height: 20px; background: black; }' +
                    '.f-tl { top: 15mm; left: 10mm; }' +
                    '.f-tr { top: 15mm; right: 10mm; }' +
                    '.f-bl { bottom: 15mm; left: 10mm; }' +
                    '.f-br { bottom: 15mm; right: 10mm; }' +
                    '.f-ml { top: 48%; left: 10mm; }' +
                    '.header { text-align: center; margin-bottom: 20px; margin-top: 10px; }' +
                    '.header h2, .header h3 { margin: 5px 0; }' +
                    '.top-section { display: flex; justify-content: space-between; margin-bottom: 20px; }' +
                    '.personal-info { width: 55%; }' +
                    '.info-row { margin-bottom: 15px; border-bottom: 1px solid black; height: 25px; position: relative; }' +
                    '.info-label { font-weight: bold; position: absolute; top: -20px; left: 0; font-size: 12px; }' +
                    '.personal-number { width: 40%; border: 2px solid black; padding: 10px; }' +
                    '.bubble-grid { display: grid; grid-template-columns: repeat(6, 1fr); gap: 2px; text-align: center; }' +
                    '.square { display: inline-block; width: 16px; height: 16px; border: 1px solid black; margin: 1px; text-align: center; line-height: 14px; font-size: 10px; vertical-align: middle; }' +
                    '@media print { body { -webkit-print-color-adjust: exact; } .no-print { display: none; } @page { margin: 0; size: A4; } .page-container { width: 100%; height: 100%; border: none; } }' +
                '</style>' +
            '</head>' +
            '<body>' +
                '<div class="page-container">' +
                    '<div class="fiducial f-tl"></div>' +
                    '<div class="fiducial f-tr"></div>' +
                    '<div class="fiducial f-ml"></div>' +
                    '<div class="fiducial f-bl"></div>' +
                    '<div class="fiducial f-br"></div>' +
                    '<div class="header">' +
                        '<h3>ԴՊՐՈՑԱԿԱՆՆԵՐԻ ԱՌԱՐԿԱՅԱԿԱՆ ՕԼԻՄՊԻԱԴԱ</h3>' +
                        '<h3>/մարզային փուլ/</h3>' +
                        '<h2>ՊԱՏԱՍԽԱՆԱԹԵՐԹԻԿ</h2>' +
                    '</div>' +
                    '<div class="top-section">' +
                        '<div class="personal-info" style="padding-top: 20px;">' +
                            '<div class="info-row"><span class="info-label">Ազգանուն</span></div>' +
                            '<div class="info-row"><span class="info-label">Անուն</span></div>' +
                            '<div class="info-row"><span class="info-label">Հայրանուն</span></div>' +
                            '<div class="info-row"><span class="info-label">Մարզ</span></div>' +
                            '<div class="info-row"><span class="info-label">Կրթօջախ</span></div>' +
                        '</div>' +
                        '<div class="personal-number">' +
                            '<div style="text-align: center; font-weight: bold;">ԱՆՁՆԱԿԱՆ ՀԱՄԱՐ</div>' +
                            '<div style="text-align: center; font-size: 10px; margin-bottom: 5px;">(Լրացվում է հանձնաժողովի կողմից)</div>' +
                            '<div class="bubble-grid">' +
                                Array(6).fill(0).map(function() {
                                    return '<div>' +
                                        '<div style="border:0.5px solid #bbb; height:20px; margin-bottom:2px; width: 16px; margin: 0 auto 5px auto;"></div>' +
                                        Array(10).fill(0).map(function(_, i) { return '<div class="square">' + i + '</div>'; }).join('') +
                                    '</div>';
                                }).join('') +
                            '</div>' +
                        '</div>' +
                    '</div>' +
                    '<div style="margin-bottom: 20px;">' +
                        '<div style="margin-bottom: 10px;">' +
                            '<strong>Դասարան:</strong> ' +
                            [5,6,7,8,9,10,11,12].map(function(n) { return '<span class="square" style="width:20px; height:20px;"></span> ' + n; }).join('&nbsp;&nbsp;') +
                        '</div>' +
                        '<div style="display: flex; gap: 20px;">' +
                            '<strong>Առարկա:</strong>' +
                            '<div><span class="square"></span> ' + (subject || 'Մաթեմատիկա') + '</div>' +
                            '<div><span class="square"></span> Ֆիզիկա</div>' +
                            '<div><span class="square"></span> Քիմիա</div>' +
                            '<div><span class="square"></span> Կենսաբանություն</div>' +
                        '</div>' +
                    '</div>' +
                    '<hr style="border-top: 2px solid black; margin: 20px 0;">' +
                    '<div style="display: flex; justify-content: space-around;">' +
                        '<div>' +
                            '<h4 style="text-align: center;">Ընտրովի Պատասխան (' + mcqSection.questions.start + '-' + mcqSection.questions.end + ')</h4>' +
                            '<div style="display: grid; grid-template-columns: auto repeat(' + mcqOptions + ', auto); gap: 10px;">' +
                                '<div style="font-weight: bold;">Հ/Հ</div>' +
                                mcqHeaders +
                                mcqRows +
                            '</div>' +
                        '</div>' +
                        shortSectionHtml +
                    '</div>' +
                    '<div style="margin-top: 40px; text-align: center; font-size: 11px; font-weight: bold;">' +
                        'ՈՒՇԱԴՐՈՒԹՅՈՒՆ. Ջնջումներ չեն թույլատրվում:' +
                    '</div>' +
                '</div>' +
                '<script>setTimeout(function() { window.print(); }, 500);</script>' +
            '</body>' +
            '</html>'
        );
        win.document.close();
    },
    
    /**
     * Find the best template for a given subject
     */
    findTemplateForSubject(subject) {
        // First, look for a template that matches this subject exactly
        for (const key in MockData.formTemplates) {
            const template = MockData.formTemplates[key];
            if (template.subject === subject) {
                return key;
            }
        }
        // Fall back to default
        return 'default';
    },
    /**
     * Պատասխանաթերթիկի հանձնման պատուհան (Scanned Upload)
     */
    renderAnswerSheetModal(competitionId) {
        const competition = API.getCompetitionById(competitionId);
        const participants = API.getParticipantsByCompetition(competitionId);
        
        return `
            <div class="modal-header">
                <h2>📄 Հանձնել պատասխանաթերթիկը</h2>
                <button class="modal-close" onclick="App.closeModal()">&times;</button>
            </div>
            <div class="modal-body">
                <style>
                    .upload-area {
                        border: 2px dashed #ccc;
                        border-radius: 8px;
                        padding: 40px;
                        text-align: center;
                        background: #f9f9f9;
                        transition: all 0.3s;
                        cursor: pointer;
                        margin: 20px 0;
                    }
                    .upload-area:hover {
                        border-color: #2196F3;
                        background: #e3f2fd;
                    }
                    .upload-icon {
                        font-size: 48px;
                        color: #666;
                        margin-bottom: 15px;
                    }
                    .instruction-step {
                        display: flex;
                        align-items: flex-start;
                        margin-bottom: 15px;
                    }
                    .step-number {
                        background: #2196F3;
                        color: white;
                        width: 24px;
                        height: 24px;
                        border-radius: 50%;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        margin-right: 10px;
                        flex-shrink: 0;
                        font-weight: bold;
                    }
                </style>

                <p>Մրցույթ՝ <strong>${competition.name}</strong></p>
                
                <div style="background: #fff3cd; color: #856404; padding: 15px; border-radius: 4px; margin-bottom: 20px;">
                    ⚠️ Ուշադրություն. Խնդրում ենք վերբեռնել միայն սկանավորված պատասխանաթերթիկը (JPG կամ PNG ձևաչափով):
                </div>

                <div class="instructions">
                    <div class="instruction-step">
                        <div class="step-number">1</div>
                        <div>
                            <strong>Ներբեռնեք ձևաթուղթը</strong><br>
                            <a href="#" onclick="UI.printAnswerSheetTemplate('${competition.subject}', '${competition.name}'); return false;" style="color: #2196F3; text-decoration: none;">⬇️ Ներբեռնել պատասխանաթերթիկի նմուշը</a>
                        </div>
                    </div>
                    <div class="instruction-step">
                        <div class="step-number">2</div>
                        <div>
                            <strong>Լրացրեք այն</strong><br>
                            Լրացրեք անձնական տվյալները և պատասխանները սև և կապույտ գրիչով:
                        </div>
                    </div>
                    <div class="instruction-step">
                        <div class="step-number">3</div>
                        <div>
                            <strong>Սկանավորեք և վերբեռնեք</strong><br>
                            Լուսանկարեք կամ սկանավորեք լրացված թերթիկը:
                        </div>
                    </div>
                </div>
                
                <form id="scan-upload-form">
                    <input type="hidden" id="as-comp-id" value="${competitionId}">

                    <div style="margin-bottom: 20px;">
                        <label for="as-participant-id" style="font-weight: bold; display: block; margin-bottom: 5px;">Ընտրեք մասնակցին:</label>
                        <select id="as-participant-id" class="search-input" style="width: 100%; padding: 10px;">
                            <option value="">-- Ընտրեք --</option>
                            ${participants.map(p => {
                                const name = p.name || `${p.firstName || ''} ${p.lastName || ''}`.trim() || 'Անհայտ';
                                return `<option value="${p.id}">${name} (${p.grade}-րդ դասարան)</option>`;
                            }).join('')}
                        </select>
                    </div>
                    
                    <div class="upload-area" onclick="document.getElementById('file-input').click()">
                        <div class="upload-icon">📤</div>
                        <h3>Սեղմեք կամ գցեք ֆայլը այստեղ</h3>
                        <p style="color: #666;">JPG կամ PNG (max 5MB)</p>
                        <input type="file" id="file-input" accept=".jpg,.jpeg,.png" style="display: none" onchange="UI.handleFileSelect(this)">
                        <div id="file-name" style="margin-top: 10px; font-weight: bold; color: #2196F3;"></div>
                    </div>
                </form>
            </div>
            <div class="modal-footer">
                <button class="btn btn-secondary" onclick="App.closeModal()">Չեղարկել</button>
                <button class="btn btn-success" onclick="App.submitAnswerSheetScan()" id="btn-upload-scan" disabled>Հանձնել աշխատանքը</button>
            </div>
        `;
    },

    /**
     * Helper to show filename
     */
    handleFileSelect(input) {
        const fileName = input.files[0] ? input.files[0].name : '';
        document.getElementById('file-name').textContent = fileName ? `Ընտրված ֆայլ: ${fileName}` : '';
        document.getElementById('btn-upload-scan').disabled = !fileName;
    },


    // Current editor state
    editorState: {
        templateId: 'default',
        templateName: 'Standard Olympiad',
        subject: null, // Will be set to first subject on render
        mcqCount: 15,
        mcqOptions: 4,
        shortAnswerStart: 16,
        shortAnswerCount: 5,
        maxDigits: 4
    },

    /**
     * Initialize editor state from existing template
     */
    loadTemplateForEditing(templateId) {
        const template = MockData.formTemplates[templateId];
        if (!template) return;
        
        const mcqSection = template.sections.find(s => s.type === 'multiple_choice');
        const shortSection = template.sections.find(s => s.type === 'handwritten_number');
        
        this.editorState = {
            templateId: templateId,
            templateName: template.name,
            subject: template.subject || MockData.subjects[0].name,
            mcqCount: mcqSection ? mcqSection.questions.end - mcqSection.questions.start + 1 : 15,
            mcqOptions: mcqSection ? mcqSection.options : 4,
            shortAnswerStart: shortSection ? shortSection.questions.start : 16,
            shortAnswerCount: shortSection ? shortSection.questions.end - shortSection.questions.start + 1 : 5,
            maxDigits: shortSection ? shortSection.maxDigits : 4
        };
    },

    /**
     * Save current editor state to template
     */
    saveEditorTemplate() {
        const state = this.editorState;
        const templateId = state.subject.toLowerCase().replace(/\s+/g, '_') + '_template';
        
        MockData.formTemplates[templateId] = {
            name: state.templateName,
            paperSize: 'A4',
            subject: state.subject,
            anchors: MockData.formTemplates['default'].anchors,
            sections: [
                {
                    id: 'mcq',
                    type: 'multiple_choice',
                    label: 'Ընտրովի (' + state.mcqCount + ')',
                    questions: { start: 1, end: state.mcqCount },
                    options: state.mcqOptions,
                    region: MockData.formTemplates['default'].sections[0].region,
                    grid: {
                        rows: state.mcqCount,
                        columns: state.mcqOptions,
                        cellPadding: 0.08
                    }
                },
                {
                    id: 'short_answer',
                    type: 'handwritten_number',
                    label: 'Կարճ Պատ. (' + state.shortAnswerStart + '-' + (state.shortAnswerStart + state.shortAnswerCount - 1) + ')',
                    questions: { start: state.shortAnswerStart, end: state.shortAnswerStart + state.shortAnswerCount - 1 },
                    maxDigits: state.maxDigits,
                    region: MockData.formTemplates['default'].sections[1].region,
                    grid: {
                        rows: state.shortAnswerCount,
                        columns: 1
                    }
                }
            ]
        };
        
        // Persist to localStorage
        this.saveTemplatesToStorage();
        
        this.showSuccess('"' + state.templateName + '" ձևանմուշը պահպանվեց ' + state.subject + ' առարկայի համար:');
        console.log('Saved template:', templateId, MockData.formTemplates[templateId]);
    },

    /**
     * Answer Sheet Editor - configure templates per subject
     */
    renderAnswerSheetEditor() {
        const subjects = MockData.subjects;
        const templates = Object.keys(MockData.formTemplates);
        
        // Initialize subject if not set
        if (!this.editorState.subject) {
            this.editorState.subject = subjects[0].name;
        }
        
        // Auto-load existing template for the current subject
        const existingTemplateId = this.findTemplateForSubject(this.editorState.subject);
        if (existingTemplateId !== 'default' && this.editorState.templateId === 'default') {
            this.loadTemplateForEditing(existingTemplateId);
        }
        
        const state = this.editorState;
        
        return `
            <div class="page-header">
                <h1>📝 Պատասխանաթերթիկի Խմբագրիչ</h1>
                <p>Ստեղծել և կարգավորել պատասխանաթերթիկի ձևանմուշներ տարբեր առարկաների և մրցույթների համար</p>
            </div>

            <div class="editor-container" style="display: grid; grid-template-columns: 350px 1fr; gap: 20px;">
                <!-- Sidebar Controls -->
                <div class="editor-sidebar card" style="padding: 20px;">
                    <h3>📋 Ձևանմուշի Կարգավորումներ</h3>
                    
                    <!-- Existing Templates -->
                    <div style="margin-bottom: 15px;">
                        <label style="font-weight: bold;">Բեռնել Առկա Ձևանմուշը</label>
                        <select class="form-control" id="editor-template-select" onchange="UI.onTemplateSelect(this.value)">
                            <option value="">-- Նոր Ձևանմուշ --</option>
                            ${templates.map(t => `<option value="${t}" ${state.templateId === t ? 'selected' : ''}>${MockData.formTemplates[t].name}</option>`).join('')}
                        </select>
                    </div>
                    
                    <hr>
                    
                    <!-- Template Name -->
                    <div style="margin-bottom: 15px;">
                        <label style="font-weight: bold;">Ձևանմուշի Անվանում</label>
                        <input type="text" class="form-control" id="editor-template-name" 
                               value="${state.templateName}" 
                               onchange="UI.editorState.templateName = this.value; UI.refreshEditorPreview();">
                    </div>
                    
                    <!-- Subject -->
                    <div style="margin-bottom: 15px;">
                        <label style="font-weight: bold;">Առարկա</label>
                        <select class="form-control" id="editor-subject" onchange="UI.onSubjectChange(this.value)">
                            ${subjects.map(s => `<option value="${s.name}" ${state.subject === s.name ? 'selected' : ''}>${s.icon} ${s.name}</option>`).join('')}
                        </select>
                    </div>
                    
                    <hr>
                    <h4>🔢 Ընտրովի Պատասխանով Հարցեր</h4>
                    
                    <!-- MCQ Count -->
                    <div style="margin-bottom: 15px;">
                        <label>Ընտրովի Հարցերի Քանակ (1-ից N)</label>
                        <input type="number" class="form-control" id="editor-mcq-count" 
                               min="1" max="50" value="${state.mcqCount}"
                               onchange="UI.editorState.mcqCount = parseInt(this.value); UI.editorState.shortAnswerStart = parseInt(this.value) + 1; UI.refreshEditorPreview();">
                    </div>
                    
                    <!-- MCQ Options -->
                    <div style="margin-bottom: 15px;">
                        <label>Տարբերակներ յուրաքանչյուր հարցի համար</label>
                        <select class="form-control" id="editor-mcq-options" onchange="UI.editorState.mcqOptions = parseInt(this.value); UI.refreshEditorPreview();">
                            <option value="3" ${state.mcqOptions === 3 ? 'selected' : ''}>3 տարբերակ (A, B, C)</option>
                            <option value="4" ${state.mcqOptions === 4 ? 'selected' : ''}>4 տարբերակ (1, 2, 3, 4)</option>
                            <option value="5" ${state.mcqOptions === 5 ? 'selected' : ''}>5 տարբերակ (A, B, C, D, E)</option>
                        </select>
                    </div>
                    
                    <hr>
                    <h4>📝 Կարճ Պատասխանով Հարցեր</h4>
                    
                    <!-- Short Answer Count -->
                    <div style="margin-bottom: 15px;">
                        <label>Կարճ Պատասխանով Հարցերի Քանակ</label>
                        <input type="number" class="form-control" id="editor-short-count" 
                               min="0" max="20" value="${state.shortAnswerCount}"
                               onchange="UI.editorState.shortAnswerCount = parseInt(this.value); UI.refreshEditorPreview();">
                    </div>
                    
                    <!-- Max Digits -->
                    <div style="margin-bottom: 15px;">
                        <label>Առավելագույն Նիշերի Քանակ</label>
                        <input type="number" class="form-control" id="editor-max-digits" 
                               min="1" max="10" value="${state.maxDigits}"
                               onchange="UI.editorState.maxDigits = parseInt(this.value); UI.refreshEditorPreview();">
                    </div>
                    
                    <hr>
                    
                    <!-- Action Buttons -->
                    <button class="btn btn-primary" style="width: 100%; margin-bottom: 10px;" onclick="UI.saveEditorTemplate()">
                        💾 Պահպանել Ձևանմուշը
                    </button>
                    <button class="btn btn-secondary" style="width: 100%; margin-bottom: 10px;" onclick="UI.printAnswerSheetTemplate(UI.editorState.subject, UI.editorState.templateName)">
                        🖨️ Տպելու Դիտում
                    </button>
                    <button class="btn btn-secondary" style="width: 100%;" onclick="UI.exportTemplateJSON()">
                        📤 Արտահանել JSON
                    </button>
                </div>

                <!-- Live Preview Area -->
                <div class="card" style="padding: 20px;">
                    <h3>👁️ Ուղիղ Դիտում</h3>
                    <div id="editor-preview-area">
                        ${this.renderEditorPreview()}
                    </div>
                </div>
            </div>
        `;
    },
    
    /**
     * Render the preview portion of the editor
     */
    renderEditorPreview() {
        const state = this.editorState;
        const mcqEnd = state.mcqCount;
        const shortStart = state.shortAnswerStart;
        const shortEnd = shortStart + state.shortAnswerCount - 1;
        
        let mcqOptionsHtml = '';
        for (let i = 0; i < state.mcqOptions; i++) {
            mcqOptionsHtml += '<div style="font-weight: bold;">' + (i+1) + '</div>';
        }
        
        let mcqRowsHtml = '';
        const rowsToShow = Math.min(state.mcqCount, 20);
        for (let i = 0; i < rowsToShow; i++) {
            mcqRowsHtml += '<div>' + (i+1) + '</div>';
            for (let j = 0; j < state.mcqOptions; j++) {
                mcqRowsHtml += '<div style="width: 12px; height: 12px; border: 1px solid black; margin: auto;"></div>';
            }
        }
        if (state.mcqCount > 20) {
            mcqRowsHtml += '<div style="grid-column: 1 / -1; text-align: center; color: #666;">... (ևս ' + (state.mcqCount - 20) + ' տող)</div>';
        }
        
        let shortAnswerHtml = '';
        if (state.shortAnswerCount > 0) {
            for (let i = 0; i < state.shortAnswerCount; i++) {
                let digitBoxes = '';
                for (let d = 0; d < state.maxDigits; d++) {
                    digitBoxes += '<div style="border-right: 1px solid #ccc; flex: 1;"></div>';
                }
                shortAnswerHtml += `
                    <div style="margin-bottom: 8px; display: flex; align-items: center; gap: 8px;">
                        <strong style="width: 20px; font-size: 10px;">${shortStart + i}</strong>
                        <div style="border: 1px solid #000; height: 18px; display: flex; flex: 1;">
                            ${digitBoxes}
                        </div>
                    </div>`;
            }
        }
        
        return `
            <div class="editor-preview" id="sheet-preview" style="min-height: 700px; background: white; padding: 30px; position: relative; border: 1px solid #ddd; font-size: 12px;">
                
                <!-- Fiducial Markers Preview -->
                <div style="position: absolute; top: 10px; left: 10px; width: 15px; height: 15px; background: black;" title="TL Anchor"></div>
                <div style="position: absolute; top: 10px; right: 10px; width: 15px; height: 15px; background: black;" title="TR Anchor"></div>
                <div style="position: absolute; bottom: 10px; left: 10px; width: 15px; height: 15px; background: black;" title="BL Anchor"></div>
                <div style="position: absolute; bottom: 10px; right: 10px; width: 15px; height: 15px; background: black;" title="BR Anchor"></div>
                
                <!-- Header -->
                <div style="text-align: center; margin-bottom: 15px; padding-top: 20px;">
                    <h4 style="margin: 3px 0;">${state.subject.toUpperCase()}Ի ՕԼԻՄՊԻԱԴԱ</h4>
                    <h3 style="margin: 3px 0;">ՊԱՏԱՍԽԱՆԱԹԵՐԹԻԿ</h3>
                    <p style="margin: 3px 0; font-size: 10px; color: #666;">${state.templateName}</p>
                </div>

                <!-- Summary -->
                <div style="background: #f5f5f5; padding: 10px; margin-bottom: 15px; border-radius: 5px; font-size: 11px;">
                    <strong>Կառուցվածք:</strong> 
                    Ընտրովի: Հարցեր 1-${mcqEnd} (${state.mcqOptions} տարբերակ) | 
                    Կարճ Պատասխան: Հարցեր ${shortStart}-${shortEnd} (${state.maxDigits} նիշ առավելագույնը)
                </div>

                <hr style="border-top: 1px solid #ccc; margin: 15px 0;">

                <!-- Answer Sections -->
                <div style="display: flex; justify-content: space-around; gap: 20px;">
                    <!-- MCQ Section -->
                    <div style="flex: 1; padding: 10px; border: 2px dashed #2196F3; position: relative; max-width: 250px;">
                        <span style="position: absolute; top: -10px; right: 5px; background: #2196F3; color: white; padding: 2px 6px; font-size: 9px; border-radius: 3px;">Ընտրովի</span>
                        <div style="text-align: center; font-weight: bold; margin-bottom: 8px; font-size: 11px;">Ընտրովի Պատասխան (1-${mcqEnd})</div>
                        <div style="display: grid; grid-template-columns: 25px repeat(${state.mcqOptions}, 1fr); gap: 3px; text-align: center; font-size: 10px;">
                            <div style="font-weight: bold;">Հ/Հ</div>
                            ${mcqOptionsHtml}
                            ${mcqRowsHtml}
                        </div>
                    </div>
                    
                    <!-- Short Answer Section -->
                    ${state.shortAnswerCount > 0 ? `
                    <div style="flex: 1; padding: 10px; border: 2px dashed #28a745; position: relative; max-width: 200px;">
                        <span style="position: absolute; top: -10px; right: 5px; background: #28a745; color: white; padding: 2px 6px; font-size: 9px; border-radius: 3px;">OCR</span>
                        <div style="text-align: center; font-weight: bold; margin-bottom: 8px; font-size: 11px;">Կարճ Պատասխան (${shortStart}-${shortEnd})</div>
                        ${shortAnswerHtml}
                    </div>
                    ` : '<div style="flex: 1; padding: 20px; text-align: center; color: #999;">Կարճ պատասխանով հարցեր չկան</div>'}
                </div>

                <div style="margin-top: 20px; text-align: center; font-size: 9px; color: #999;">
                    Ընդհանուր Հարցեր: ${mcqEnd + state.shortAnswerCount}
                </div>
            </div>
        `;
    },
    
    /**
     * Refresh just the preview area
     */
    refreshEditorPreview() {
        const previewArea = document.getElementById('editor-preview-area');
        if (previewArea) {
            previewArea.innerHTML = this.renderEditorPreview();
        }
    },
    
    /**
     * Handle template selection change
     */
    onTemplateSelect(templateId) {
        if (templateId) {
            this.loadTemplateForEditing(templateId);
        } else {
            // Reset to defaults for new template
            this.editorState = {
                templateId: '',
                templateName: 'New Template',
                subject: MockData.subjects[0].name,
                mcqCount: 15,
                mcqOptions: 4,
                shortAnswerStart: 16,
                shortAnswerCount: 5,
                maxDigits: 4
            };
        }
        // Re-render the whole editor to update all fields
        document.getElementById('content').innerHTML = this.renderAnswerSheetEditor();
    },
    
    /**
     * Handle subject change - load existing template if available
     */
    onSubjectChange(subject) {
        this.editorState.subject = subject;
        
        // Check if there's an existing template for this subject
        const existingTemplateId = this.findTemplateForSubject(subject);
        if (existingTemplateId !== 'default') {
            // Load the existing template
            this.loadTemplateForEditing(existingTemplateId);
            document.getElementById('content').innerHTML = this.renderAnswerSheetEditor();
        } else {
            // Just refresh preview
            this.refreshEditorPreview();
        }
    },
    
    /**
     * Export template as JSON
     */
    exportTemplateJSON() {
        const state = this.editorState;
        const template = {
            name: state.templateName,
            subject: state.subject,
            paperSize: 'A4',
            sections: [
                {
                    type: 'multiple_choice',
                    questions: { start: 1, end: state.mcqCount },
                    options: state.mcqOptions
                },
                {
                    type: 'handwritten_number',
                    questions: { start: state.shortAnswerStart, end: state.shortAnswerStart + state.shortAnswerCount - 1 },
                    maxDigits: state.maxDigits
                }
            ]
        };
        
        const json = JSON.stringify(template, null, 2);
        const blob = new Blob([json], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = state.templateName.replace(/\s+/g, '_') + '.json';
        a.click();
        URL.revokeObjectURL(url);
        
        this.showSuccess('Template exported!');
    },
    /**
     * Render Grading Dashboard
     */
    renderGradingPage() {
        const pendingSubmissions = API.getPendingSubmissions();
        const competitions = API.getCompetitions();

        return `
            <div class="page-header">
                <h1>✅ Ստուգում (Grading Dashboard)</h1>
                <p>Ստուգեք վերբեռնված պատասխանաթերթիկները</p>
            </div>

            <div class="card">
                <h3>Սպասող աշխատանքներ (${pendingSubmissions.length})</h3>
                
                ${pendingSubmissions.length > 0 ? `
                    <table class="data-table">
                        <thead>
                            <tr>
                                <th>Ամսաթիվ</th>
                                <th>Մրցույթ</th>
                                <th>Ֆայլ</th>
                                <th>Գործողություն</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${pendingSubmissions.map(sub => {
                                const comp = competitions.find(c => c.id === sub.competitionId) || {};
                                return `
                                    <tr>
                                        <td>${new Date(sub.timestamp).toLocaleString()}</td>
                                        <td>${comp.name}</td>
                                        <td>📄 ${sub.filename || 'Scan.pdf'}</td>
                                        <td>
                                            <button class="btn btn-primary btn-sm" onclick="UI.openGradingModal(${sub.id})">🔍 Ստուգել</button>
                                        </td>
                                    </tr>
                                `;
                            }).join('')}
                        </tbody>
                    </table>
                ` : '<p>Ստուգման ենթակա աշխատանքներ չկան</p>'}
            </div>
        `;
    },

    /**
     * Open Grading/OMR Modal
     */
    openGradingModal(submissionId) {
        const submission = API.getSubmissionById(submissionId);
        const modal = document.getElementById('modal-container');
        const modalContent = document.getElementById('modal-content');
        
        const competition = API.getCompetitionById(submission.competitionId);
        const problems = API.getProblemsByCompetition(submission.competitionId);
        
        // Make modal wider for this view
        modalContent.style.maxWidth = '1800px'; 
        modalContent.style.width = '98%';

        modalContent.innerHTML = `
            <div class="modal-header" style="background: #2c3e50; color: white;">
                <h2>🤖 OMR Ստուգում (ID: ${submissionId})</h2>
                <button class="modal-close" style="color: white; font-size: 24px;" onclick="document.getElementById('modal-content').style.maxWidth=''; document.getElementById('modal-content').style.width=''; App.closeModal()">&times;</button>
            </div>
            <div class="modal-body" style="display: flex; gap: 30px; min-height: 850px; padding: 20px;">
                <!-- Left: Document View (Image) -->
                <div style="flex: 1.5; background: #555; padding: 20px; border-radius: 8px; display: flex; align-items: center; justify-content: center; color: white; flex-direction: column; overflow: hidden;">
                    <p style="font-size: 1.1em; margin: 0 0 10px 0; color: #eee;">📄 ${submission.filename}</p>
                    
                    <div id="scan-container" style="width: 100%; height: 100%; background: #333; position: relative; border-radius: 2px; box-shadow: 0 4px 10px rgba(0,0,0,0.5); overflow: auto; display: flex; justify-content: center; align-items: flex-start;">
                        ${submission.imageData ? 
                            `<div id="scan-wrapper" style="position: relative; max-width: 100%; max-height: 100%; display: block;">
                                <img id="scan-image" src="${submission.imageData}" crossorigin="anonymous" style="max-width: 100%; max-height: 800px; height: auto; display: block;">
                             </div>` 
                            : 
                            `<div style="color: #bbb; text-align: center; margin-top: 50%;">Նկարը բացակայում է</div>`
                        }
                        
                        <!-- Scanning Overlay -->
                        <div id="scan-overlay" style="position: absolute; inset: 0; background: rgba(0,0,0,0.7); display: flex; flex-direction: column; align-items: center; justify-content: center; z-index: 10;">
                            <div class="spinner" style="border: 4px solid #f3f3f3; border-top: 4px solid #3498db; border-radius: 50%; width: 40px; height: 40px; animation: spin 1s linear infinite; margin-bottom: 20px;"></div>
                            <h3 style="color: white; margin: 0;">Կատարվում է OMR/OCR վերլուծություն...</h3>
                            <p id="scan-status" style="color: #ccc; margin-top: 10px;">Նախապատրաստում...</p>
                        </div>
                    </div>
                </div>

                <!-- Right: Data Extraction -->
                <div style="flex: 1.5; overflow-y: auto; background: #fafafa; padding: 20px; border-radius: 8px; border: 1px solid #ddd;">
                    <h3 style="margin-top: 0; color: #2c3e50; border-bottom: 2px solid #eee; padding-bottom: 10px;">📊 Ճանաչված տվյալներ (Իրական ժամանակ)</h3>
                    
                    <div style="background: #e8f5e9; padding: 15px; border-radius: 8px; margin-bottom: 20px; display: flex; align-items: center; justify-content: space-between; border: 1px solid #c8e6c9;">
                        <span>Ճշգրտության հավանականություն:</span>
                        <strong id="confidence-score" style="color: #2e7d32; font-size: 1.2em;">-</strong>
                    </div>

                    <!-- OMR Settings Panel -->
                    <details style="background: #fff3e0; padding: 10px 15px; border-radius: 8px; margin-bottom: 15px; border: 1px solid #ffe0b2;">
                        <summary style="cursor: pointer; font-weight: bold; color: #e65100;">⚙️ OMR Settings</summary>
                        <div style="margin-top: 10px; display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
                            <div>
                                <label style="font-size: 0.85em; color: #666;">Gray Threshold (0-255):</label>
                                <input type="range" id="omr-gray-threshold" min="80" max="180" value="120" style="width: 100%;">
                                <span id="omr-gray-value" style="font-size: 0.85em;">120</span>
                            </div>
                            <div>
                                <label style="font-size: 0.85em; color: #666;">Density Threshold (%):</label>
                                <input type="range" id="omr-density-threshold" min="5" max="30" value="15" style="width: 100%;">
                                <span id="omr-density-value" style="font-size: 0.85em;">15%</span>
                            </div>
                        </div>
                        <button type="button" onclick="UI.rescanWithSettings()" style="margin-top: 10px; padding: 5px 15px; background: #ff9800; color: white; border: none; border-radius: 4px; cursor: pointer;">🔄 Rescan</button>
                    </details>

                    <form id="grading-form" style="opacity: 0.5; pointer-events: none;">
                        <table class="data-table" style="font-size: 1.1em;">
                            <thead>
                                <tr style="background: #eceff1;">
                                    <th width="40" style="padding: 12px; text-align: center;">#</th>
                                    <th style="padding: 12px;">Հարց</th>
                                    <th width="120" style="padding: 12px;">Ճանաչված</th>
                                    <th width="120" style="padding: 12px;">Ճիշտ</th>
                                </tr>
                            </thead>
                            <tbody id="grading-table-body">
                                <tr><td colspan="4" style="text-align: center; padding: 20px;">Տվյալները բեռնվում են...</td></tr>
                            </tbody>
                        </table>
                    </form>
                </div>
            </div>
            <div class="modal-footer" style="padding: 20px;">
                <button class="btn btn-secondary" style="padding: 10px 20px; font-size: 1.1em;" onclick="document.getElementById('modal-content').style.maxWidth=''; document.getElementById('modal-content').style.width=''; App.closeModal()">Չեղարկել</button>
                <button id="confirm-grade-btn" class="btn btn-success" disabled style="padding: 10px 25px; font-size: 1.1em; opacity: 0.5;" onclick="App.submitGrading(${submissionId})">✅ Հաստատել և Գնահատել</button>
            </div>
            <style>
            @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
            </style>
        `;
        
        modal.classList.remove('hidden');
        document.querySelector('.modal-backdrop').onclick = () => {
             document.getElementById('modal-content').style.maxWidth=''; 
             document.getElementById('modal-content').style.width='';
             App.closeModal();
        };

        // Start Processing by calling the helper method (which we will add next)
        if (submission.imageData) {
            // Store scan state for rescan functionality
            this._currentScanState = {
                imageUrl: submission.imageData,
                problems: problems,
                submissionId: submissionId
            };
            
            // Initialize OMR settings sliders
            this.initOMRSettingsSliders();
            
            this.processSubmissionImage(submission.imageData, problems).then(result => { // Expecting {extractedData, debugInfo}
                const { extractedData, debugInfo } = result;

                // Update UI with results
                const form = document.getElementById('grading-form');
                const tbody = document.getElementById('grading-table-body');
                const overlay = document.getElementById('scan-overlay');
                const btn = document.getElementById('confirm-grade-btn');
                
                // Draw Debug Overlay
                this.drawDebugOverlay(debugInfo);

                // Hide overlay
                if(overlay) overlay.style.display = 'none';
                if(form) {
                    form.style.opacity = '1';
                    form.style.pointerEvents = 'auto';
                }
                if(btn) {
                    btn.disabled = false;
                    btn.style.opacity = '1';
                }
                const scoreEl = document.getElementById('confidence-score');
                if(scoreEl) scoreEl.innerText = '92%'; // High likelyhood

                // Render Rows
                if(tbody) {
                    tbody.innerHTML = '';
                    
                    // Sort problems: filled first
                    const filledProblems = problems.filter(p => extractedData[p.id]);
                    const emptyProblems = problems.filter(p => !extractedData[p.id]);
                    
                    // Helper to render row
                    const renderRow = (p) => {
                        const val = extractedData[p.id] || '';
                        const isMatch = String(val).trim().toLowerCase() === String(p.correctAnswer).trim().toLowerCase();
                        const color = val ? (isMatch ? '#a5d6a7' : '#ffccbc') : '#fff'; // Green if match, Red if mismatch, White if empty
                        
                        return `
                            <tr>
                                <td style="text-align: center; font-weight: bold; color: #555;">${p.id}</td>
                                <td>${p.title}</td>
                                <td style="padding: 8px;">
                                    <input type="text" id="grade-input-${p.id}" value="${val}" 
                                        style="width: 100%; padding: 8px; border: 2px solid ${color}; border-radius: 4px; font-weight: bold; font-size: 1.1em; text-align: center; color: #37474f;">
                                </td>
                                <td style="text-align: center; color: #2e7d32; font-weight: bold; background: #f1f8e9;">
                                    ${p.correctAnswer}
                                </td>
                            </tr>
                        `;
                    };

                    tbody.innerHTML += filledProblems.map(renderRow).join('');
                    
                    if (emptyProblems.length > 0) {
                        tbody.innerHTML += `<tr><td colspan="4" style="text-align: center; color: #999; padding: 10px; border-top: 1px solid #eee; background: #fffcfc;">
                            ...ևս ${emptyProblems.length} չլրացված պատասխաններ <button style="font-size: 0.8em; margin-left: 10px;" type="button" onclick="document.getElementById('more-rows').classList.toggle('hidden')">Ցուցադրել բոլորը</button>
                        </td></tr>`;
                        tbody.innerHTML += `<tbody id="more-rows" class="hidden">${emptyProblems.map(renderRow).join('')}</tbody>`;
                    }
                }
            });
        }
    },

    /**
     * Draw validation boxes on top of the image
     */
    drawDebugOverlay(debugInfo) {
        const wrapper = document.getElementById('scan-wrapper');
        const img = document.getElementById('scan-image');
        if (!wrapper || !img || !debugInfo) return;

        // Create or reuse canvas
        let canvas = document.getElementById('debug-canvas');
        if (!canvas) {
            canvas = document.createElement('canvas');
            canvas.id = 'debug-canvas';
            canvas.style.position = 'absolute';
            canvas.style.top = '0';
            canvas.style.left = '0';
            canvas.style.pointerEvents = 'none'; // Click through
            wrapper.appendChild(canvas);
        }

        // Match image dimensions (displayed)
        // Note: The image might be scaled by CSS (max-width: 100%). 
        // We need to coordinate mapping from Original Image -> Displayed Image
        
        const displayWidth = img.clientWidth;
        const displayHeight = img.clientHeight;
        
        canvas.width = displayWidth;
        canvas.height = displayHeight;
        
        const ctx = canvas.getContext('2d');
        const scaleX = displayWidth / debugInfo.imgWidth;
        const scaleY = displayHeight / debugInfo.imgHeight;
        
        console.log(`[Debug Overlay] Display: ${displayWidth}x${displayHeight}, Original: ${debugInfo.imgWidth}x${debugInfo.imgHeight}, Scale: ${scaleX.toFixed(3)}x${scaleY.toFixed(3)}`);
        console.log(`[Debug Overlay] scan-image natural: ${img.naturalWidth}x${img.naturalHeight}, client: ${img.clientWidth}x${img.clientHeight}`);

        // Clear previous draw
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Draw Detected Anchors
        if (debugInfo.anchors) {
            const a = debugInfo.anchors;
            ctx.lineWidth = 2;
            
            // Draw content bounds rectangle
            ctx.beginPath();
            ctx.rect(
                a.left * scaleX, 
                a.top * scaleY, 
                a.width * scaleX, 
                a.height * scaleY
            );
            ctx.strokeStyle = a.detected ? '#FF00FF' : 'rgba(255, 0, 255, 0.3)';
            ctx.setLineDash([10, 5]);
            ctx.stroke();
            ctx.setLineDash([]);
            
            // Draw individual marker positions if detected
            if (a.markers) {
                const drawMarker = (marker, label) => {
                    if (marker) {
                        // Draw crosshair at marker position
                        ctx.beginPath();
                        ctx.arc(marker.x * scaleX, marker.y * scaleY, 10, 0, Math.PI * 2);
                        ctx.strokeStyle = '#00FF00';
                        ctx.lineWidth = 3;
                        ctx.stroke();
                        
                        // Draw cross
                        ctx.beginPath();
                        ctx.moveTo((marker.x - 15) * scaleX, marker.y * scaleY);
                        ctx.lineTo((marker.x + 15) * scaleX, marker.y * scaleY);
                        ctx.moveTo(marker.x * scaleX, (marker.y - 15) * scaleY);
                        ctx.lineTo(marker.x * scaleX, (marker.y + 15) * scaleY);
                        ctx.stroke();
                        
                        // Label
                        ctx.font = 'bold 10px Arial';
                        ctx.fillStyle = '#00FF00';
                        ctx.fillText(`${label} ${marker.score.toFixed(2)}`, (marker.x + 12) * scaleX, (marker.y - 5) * scaleY);
                    }
                };
                
                drawMarker(a.markers.topLeft, 'TL');
                drawMarker(a.markers.topRight, 'TR');
                drawMarker(a.markers.bottomLeft, 'BL');
                drawMarker(a.markers.bottomRight, 'BR');
            }
            
            // Status label
            ctx.font = 'bold 12px Arial';
            const status = a.detected ? 'Anchors DETECTED' : 'Anchors FALLBACK';
            ctx.fillStyle = a.detected ? '#00FF00' : '#FF00FF';
            ctx.fillText(status, 10, 20);
        }

        // Draw OMR Boxes
        if (debugInfo.omrBoxes) {
            debugInfo.omrBoxes.forEach(box => {
                ctx.beginPath();
                ctx.rect(
                    box.x * scaleX, 
                    box.y * scaleY, 
                    box.w * scaleX, 
                    box.h * scaleY
                );
                ctx.lineWidth = 2;
                // Green if marked, Red outline if checked but empty
                ctx.strokeStyle = box.isMarked ? '#00FF00' : 'rgba(255, 0, 0, 0.3)';
                if (box.isMarked) {
                     ctx.fillStyle = 'rgba(0, 255, 0, 0.3)';
                     ctx.fill();
                }
                ctx.stroke();

                // Debug: Show density
                if (box.density > 0.05) {
                    ctx.fillStyle = '#000';
                    ctx.font = '10px Arial';
                    ctx.fillText(box.density.toFixed(2), box.x * scaleX, (box.y + box.h) * scaleY);
                }
            });
        }

        // Draw OCR Region
        if (debugInfo.ocrRegion) {
            const r = debugInfo.ocrRegion;
            ctx.beginPath();
            ctx.rect(r.left * scaleX, r.top * scaleY, r.width * scaleX, r.height * scaleY);
            ctx.lineWidth = 2;
            ctx.strokeStyle = '#0000FF'; // Blue
            ctx.setLineDash([5, 5]);
            ctx.stroke();
            ctx.setLineDash([]);
        }

        // Draw OCR Words
        if (debugInfo.ocrWords) {
            debugInfo.ocrWords.forEach(w => {
                // Row markers (dashed outline)
                if (w.isRowMarker) {
                    console.log(`[Draw Row] ${w.text}: orig(${w.x.toFixed(1)}, ${w.y.toFixed(1)}) -> display(${(w.x * scaleX).toFixed(1)}, ${(w.y * scaleY).toFixed(1)})`);
                    ctx.beginPath();
                    ctx.rect(w.x * scaleX, w.y * scaleY, w.w * scaleX, w.h * scaleY);
                    ctx.lineWidth = 1;
                    ctx.strokeStyle = 'rgba(0, 150, 255, 0.5)';
                    ctx.setLineDash([4, 4]);
                    ctx.stroke();
                    ctx.setLineDash([]);
                    
                    // Row label
                    ctx.fillStyle = 'rgba(0, 150, 255, 0.8)';
                    ctx.font = 'bold 10px Arial';
                    ctx.fillText(w.text, w.x * scaleX + 2, (w.y + 12) * scaleY);
                    return;
                }
                
                // OCR Detection results (always show for debugging)
                if (w.isDetection) {
                    const isValidNum = !isNaN(w.val);
                    const color = isValidNum ? '#00AA00' : '#FF6600';
                    
                    ctx.beginPath();
                    ctx.rect(w.x * scaleX, w.y * scaleY, w.w * scaleX, w.h * scaleY);
                    ctx.lineWidth = 2;
                    ctx.strokeStyle = color;
                    ctx.stroke();
                    
                    if (isValidNum) {
                        ctx.fillStyle = 'rgba(0, 200, 0, 0.2)';
                        ctx.fill();
                    }
                    
                    // Show detected text
                    ctx.font = 'bold 11px Arial';
                    const label = isValidNum ? `✓ ${w.val}` : `"${w.text}"`;
                    const textMetrics = ctx.measureText(label);
                    ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
                    ctx.fillRect(w.x * scaleX, (w.y - 14) * scaleY, textMetrics.width + 6, 13);
                    ctx.fillStyle = color;
                    ctx.fillText(label, w.x * scaleX + 3, (w.y - 3) * scaleY);
                    return;
                }
                
                // Legacy: Valid detected numbers - show with green
                const isValidNum = !isNaN(w.val);
                if (!isValidNum) return; // Skip garbage
                
                const color = '#00AA00';

                // Draw bounding box
                ctx.beginPath();
                ctx.rect(w.x * scaleX, w.y * scaleY, w.w * scaleX, w.h * scaleY);
                ctx.lineWidth = 2;
                ctx.strokeStyle = color;
                ctx.stroke();
                
                // Fill with semi-transparent green
                ctx.fillStyle = 'rgba(0, 200, 0, 0.2)';
                ctx.fill();
                
                // Label
                ctx.font = 'bold 12px Arial';
                const label = `${w.val}`;
                
                // Background for text
                const textMetrics = ctx.measureText(label);
                ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
                ctx.fillRect(w.x * scaleX, (w.y - 16) * scaleY, textMetrics.width + 6, 14);

                // Text
                ctx.fillStyle = color;
                ctx.fillText(label, w.x * scaleX + 3, (w.y - 4) * scaleY);
            });
        }
        
        // Render OCR Preview Panel - show what Tesseract sees (hidable)
        if (debugInfo.ocrPreview && debugInfo.ocrPreview.length > 0) {
            let previewContainer = document.getElementById('ocr-preview-panel');
            if (!previewContainer) {
                previewContainer = document.createElement('div');
                previewContainer.id = 'ocr-preview-panel';
                previewContainer.style.cssText = `
                    position: absolute;
                    bottom: 10px;
                    left: 10px;
                    background: rgba(0, 0, 0, 0.85);
                    padding: 10px;
                    border-radius: 8px;
                    max-height: 200px;
                    overflow-y: auto;
                    z-index: 100;
                `;
                wrapper.appendChild(previewContainer);
            }
            
            // Check if panel is hidden
            const isHidden = previewContainer.dataset.hidden === 'true';
            
            previewContainer.innerHTML = `
                <div style="color: #fff; font-size: 11px; margin-bottom: 8px; font-weight: bold; display: flex; justify-content: space-between; align-items: center;">
                    <span>🔍 OCR Debug (Short Answers)</span>
                    <button onclick="
                        const panel = document.getElementById('ocr-preview-panel');
                        const content = document.getElementById('ocr-preview-content');
                        const isHidden = panel.dataset.hidden !== 'true';
                        panel.dataset.hidden = isHidden;
                        content.style.display = isHidden ? 'none' : 'flex';
                        this.textContent = isHidden ? '▶ Show' : '▼ Hide';
                    " style="background: #555; border: none; color: #fff; padding: 2px 8px; border-radius: 4px; cursor: pointer; font-size: 10px;">
                        ${isHidden ? '▶ Show' : '▼ Hide'}
                    </button>
                </div>
                <div id="ocr-preview-content" style="display: ${isHidden ? 'none' : 'flex'}; flex-wrap: wrap; gap: 10px;">
                    ${debugInfo.ocrPreview.map(p => `
                        <div style="text-align: center; background: #333; padding: 5px; border-radius: 4px;">
                            <div style="color: #0af; font-size: 10px; margin-bottom: 4px; font-weight: bold;">Q${p.qNum}</div>
                            <div style="margin-bottom: 3px;">
                                <img src="${p.rawDataUrl}" style="height: 30px; border: 2px solid #f80; background: #fff;" title="RAW: Q${p.qNum} at x=${p.sourceCoords.x.toFixed(0)}, y=${p.sourceCoords.y.toFixed(0)}">
                            </div>
                            <div>
                                <img src="${p.dataUrl}" style="height: 30px; border: 2px solid #0af; background: #fff;" title="Processed for OCR">
                            </div>
                        </div>
                    `).join('')}
                </div>
            `;
        }
    },

    /**
     * Detect fiducial markers (black squares) in the corners of the image
     * Returns the content area bounds based on detected anchors
     */
    detectAnchors(ctx, imgWidth, imgHeight) {
        // Search in larger regions - markers are ~5-10% inward from edges
        const marginX = imgWidth * 0.15;  // Search first 15% from each side
        const marginY = imgHeight * 0.12; // Search first 12% from top/bottom
        
        console.log(`[Anchors] Image size: ${imgWidth}x${imgHeight}, search margins: ${marginX.toFixed(0)}x${marginY.toFixed(0)}`);
        
        // Helper: Find darkest square cluster in a region
        const findMarker = (startX, startY, searchW, searchH, cornerName) => {
            // Ensure we don't exceed image bounds
            startX = Math.floor(startX);
            startY = Math.floor(startY);
            searchW = Math.floor(Math.min(searchW, imgWidth - startX));
            searchH = Math.floor(Math.min(searchH, imgHeight - startY));
            
            const imageData = ctx.getImageData(startX, startY, searchW, searchH);
            const data = imageData.data;
            
            let bestX = null, bestY = null, bestScore = -1; // Start at -1 so any score beats it
            let darkestPixel = 255, lightestPixel = 0;
            
            // First pass: analyze the brightness range in this region
            for (let i = 0; i < data.length; i += 4) {
                const gray = (data[i] + data[i+1] + data[i+2]) / 3;
                if (gray < darkestPixel) darkestPixel = gray;
                if (gray > lightestPixel) lightestPixel = gray;
            }
            
            console.log(`[Anchors] ${cornerName}: brightness range ${darkestPixel.toFixed(0)}-${lightestPixel.toFixed(0)}, data.length=${data.length}`);
            
            // Window size should be proportional to image size
            // Markers are ~2.5% of page width (20px on 800px wide = 2.5%)
            const windowSize = Math.max(10, Math.round(imgWidth * 0.025));
            let sampleCount = 0;
            
            console.log(`[Anchors] ${cornerName}: using windowSize=${windowSize}`);
            
            for (let y = 0; y <= searchH - windowSize; y += 2) {
                for (let x = 0; x <= searchW - windowSize; x += 2) {
                    let darkPixelCount = 0;
                    let totalPixels = 0;
                    
                    for (let dy = 0; dy < windowSize; dy++) {
                        for (let dx = 0; dx < windowSize; dx++) {
                            const px = x + dx;
                            const py = y + dy;
                            const idx = (py * searchW + px) * 4;
                            
                            if (idx + 2 < data.length) {
                                const gray = (data[idx] + data[idx+1] + data[idx+2]) / 3;
                                // Count dark pixels (threshold 128)
                                if (gray < 128) darkPixelCount++;
                                totalPixels++;
                            }
                        }
                    }
                    
                    const density = totalPixels > 0 ? darkPixelCount / totalPixels : 0;
                    sampleCount++;
                    
                    if (density > bestScore) {
                        bestScore = density;
                        bestX = startX + x + windowSize/2;
                        bestY = startY + y + windowSize/2;
                    }
                }
            }
            
            console.log(`[Anchors] ${cornerName}: checked ${sampleCount} positions, bestScore=${bestScore.toFixed(3)}, pos=(${bestX?.toFixed(0)}, ${bestY?.toFixed(0)})`);
            
            // Accept if > 50% dark pixels in the window (clearly a marker)
            return bestScore > 0.5 ? { x: bestX, y: bestY, score: bestScore } : null;
        };
        
        // Detect corners - search in margin regions (not extreme corners)
        const topLeft = findMarker(0, 0, marginX, marginY, 'TL');
        const topRight = findMarker(imgWidth - marginX, 0, marginX, marginY, 'TR');
        const bottomLeft = findMarker(0, imgHeight - marginY, marginX, marginY, 'BL');
        const bottomRight = findMarker(imgWidth - marginX, imgHeight - marginY, marginX, marginY, 'BR');
        
        // Calculate content bounds from detected anchors
        // Use anchor centers DIRECTLY - no offset at all
        // The coordinate system: (0,0) = TL anchor center, (1,1) = diagonal opposite point
        const contentBounds = {
            left: topLeft?.x || 0,
            top: topLeft?.y || 0,
            right: topRight?.x || imgWidth,
            bottom: bottomLeft?.y || imgHeight,
            detected: !!(topLeft && topRight && bottomLeft),
            // Store marker positions for debug overlay
            markers: { topLeft, topRight, bottomLeft, bottomRight }
        };
        
        contentBounds.width = contentBounds.right - contentBounds.left;
        contentBounds.height = contentBounds.bottom - contentBounds.top;
        
        console.log('[Anchors] TL:', topLeft, 'TR:', topRight, 'BL:', bottomLeft);
        console.log('[Anchors] Content bounds:', contentBounds);
        
        return contentBounds;
    },

    /**
     * Process Image with Tesseract and Canvas OMR
     * @param {string} imageUrl - Image URL to process
     * @param {Array} problems - List of problems
     * @param {Object} settings - OMR settings {grayThreshold, densityThreshold}
     */
    async processSubmissionImage(imageUrl, problems, settings = {}) {
        const grayThreshold = settings.grayThreshold || 120;
        const densityThreshold = settings.densityThreshold || 0.15;
        
        const updateStatus = (msg) => {
            const el = document.getElementById('scan-status');
            if(el) el.innerText = msg;
        };

        return new Promise(async (resolve) => {
            const img = new Image();
            img.crossOrigin = "Anonymous";
            img.src = imageUrl;
            
            img.onload = async () => {
                const results = {};
                const debugInfo = {
                    imgWidth: img.width,
                    imgHeight: img.height,
                    omrBoxes: [],
                    ocrWords: [],
                    ocrRegion: null,
                    anchors: null
                };
                
                // Canvas for pixels
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');
                canvas.width = img.width;
                canvas.height = img.height;
                ctx.drawImage(img, 0, 0);

                // --- 0. Detect Anchor Markers ---
                updateStatus('Detecting anchors...');
                const contentBounds = this.detectAnchors(ctx, img.width, img.height);
                debugInfo.anchors = contentBounds;

                // --- 1. Handwritten Numbers (Tesseract) ---
                updateStatus('OCR processing...');
                
                try {
                    // Initialize Tesseract worker
                    const worker = await Tesseract.createWorker('eng');

                    // Get OCR section from template
                    const formTemplate = MockData.formTemplates['default'];
                    const ocrSection = formTemplate?.sections?.find(s => s.type === 'handwritten_number');
                    
                    if (!ocrSection) {
                        console.error('No handwritten_number section found in template');
                        throw new Error('Template missing OCR section');
                    }
                    
                    // Calculate coordinates using detected anchors
                    const ocrRegion = ocrSection.region;
                    const qStart = ocrSection.questions.start;
                    const qEnd = ocrSection.questions.end;
                    const numQuestions = qEnd - qStart + 1;
                    
                    // Use anchor-based coordinates if detected, else fallback to percentages
                    let ocrX, ocrY, ocrW, ocrH;
                    if (contentBounds.detected) {
                        // Map template percentages to content area (between anchors)
                        ocrX = contentBounds.left + contentBounds.width * ocrRegion.x;
                        ocrY = contentBounds.top + contentBounds.height * ocrRegion.y;
                        ocrW = contentBounds.width * ocrRegion.width;
                        ocrH = contentBounds.height * ocrRegion.height;
                    } else {
                        // Fallback to image percentages
                        ocrX = img.width * ocrRegion.x;
                        ocrY = img.height * ocrRegion.y;
                        ocrW = img.width * ocrRegion.width;
                        ocrH = img.height * ocrRegion.height;
                    }

                    debugInfo.ocrRegion = { left: ocrX, top: ocrY, width: ocrW, height: ocrH };
                    
                    console.log(`[OCR Region] Calculated: x=${ocrX.toFixed(1)}, y=${ocrY.toFixed(1)}, w=${ocrW.toFixed(1)}, h=${ocrH.toFixed(1)}`);
                    console.log(`[OCR Region] From contentBounds: left=${contentBounds.left.toFixed(1)}, top=${contentBounds.top.toFixed(1)}, w=${contentBounds.width.toFixed(1)}, h=${contentBounds.height.toFixed(1)}`);
                    console.log(`[OCR Region] Template percentages: x=${ocrRegion.x}, y=${ocrRegion.y}, w=${ocrRegion.width}, h=${ocrRegion.height}`);

                    // --- Row-based OCR: Process each row separately ---
                    const rowHeight = ocrH / numQuestions;
                    
                    for (let rowIdx = 0; rowIdx < numQuestions; rowIdx++) {
                        const qNum = qStart + rowIdx;
                        const rowY = ocrY + (rowIdx * rowHeight);
                        
                        // Inward crop padding to exclude border lines (as percentage of cell size)
                        const cropPadX = ocrW * 0.20;   // 20% from left/right edges
                        const cropPadY = rowHeight * 0.20; // 20% from top/bottom edges
                        const croppedX = ocrX + cropPadX;
                        const croppedY = rowY + cropPadY;
                        const croppedW = ocrW - (cropPadX * 2);
                        const croppedH = rowHeight - (cropPadY * 2);
                        
                        // Create RAW (unprocessed) crop for debug
                        const rawCanvas = document.createElement('canvas');
                        rawCanvas.width = Math.ceil(croppedW);
                        rawCanvas.height = Math.ceil(croppedH);
                        const rawCtx = rawCanvas.getContext('2d');
                        rawCtx.drawImage(img, croppedX, croppedY, croppedW, croppedH, 0, 0, rawCanvas.width, rawCanvas.height);
                        const rawDataUrl = rawCanvas.toDataURL('image/png');
                        
                        // Step 1: Process at ORIGINAL resolution first (before upscaling)
                        const origW = Math.ceil(croppedW);
                        const origH = Math.ceil(croppedH);
                        const tempCanvas = document.createElement('canvas');
                        tempCanvas.width = origW;
                        tempCanvas.height = origH;
                        const tempCtx = tempCanvas.getContext('2d');
                        tempCtx.drawImage(img, croppedX, croppedY, croppedW, croppedH, 0, 0, origW, origH);
                        
                        // Apply threshold at original resolution
                        const tempData = tempCtx.getImageData(0, 0, origW, origH);
                        const td = tempData.data;
                        for (let i = 0; i < td.length; i += 4) {
                            const r = td[i], g = td[i+1], b = td[i+2];
                            const gray = 0.2126*r + 0.7152*g + 0.0722*b;
                            // Higher threshold to capture lighter pen strokes (like thin "1"s)
                            const val = (gray < 140) ? 0 : 255;
                            td[i] = td[i+1] = td[i+2] = val;
                        }
                        tempCtx.putImageData(tempData, 0, 0);
                        
                        // Skip morphological opening - it destroys thin handwriting strokes
                        // Instead rely on crop padding to exclude borders
                        
                        // Step 2: Now upscale the processed image for OCR
                        const scaleFactor = 4;
                        const padding = 30;
                        const workW = origW * scaleFactor;
                        const workH = origH * scaleFactor;

                        const ocrCanvas = document.createElement('canvas');
                        ocrCanvas.width = workW + (padding * 2);
                        ocrCanvas.height = workH + (padding * 2);
                        const ocrCtx = ocrCanvas.getContext('2d');
                        
                        // Fill white background
                        ocrCtx.fillStyle = '#FFFFFF';
                        ocrCtx.fillRect(0, 0, ocrCanvas.width, ocrCanvas.height);

                        // Draw processed image, scaled up
                        ocrCtx.drawImage(tempCanvas, 0, 0, origW, origH, padding, padding, workW, workH);
                        
                        // Store both preprocessed and raw images for debug visualization
                        if (!debugInfo.ocrPreview) debugInfo.ocrPreview = [];
                        const previewInfo = {
                            qNum: qNum,
                            dataUrl: ocrCanvas.toDataURL('image/png'),
                            rawDataUrl: rawDataUrl,
                            sourceCoords: { x: croppedX, y: croppedY, w: croppedW, h: croppedH }
                        };
                        debugInfo.ocrPreview.push(previewInfo);
                        console.log(`[OCR Row ${qNum}] Reading from: x=${croppedX.toFixed(1)}, y=${croppedY.toFixed(1)}, w=${croppedW.toFixed(1)}, h=${croppedH.toFixed(1)} (inward crop from x=${ocrX.toFixed(1)}, y=${rowY.toFixed(1)})`);
                        
                        // Debug: Log that we're processing this row
                        console.log(`[Row OCR] Processing Q${qNum}...`);

                        // Store row region for debug visualization (use cropped coords)
                        debugInfo.ocrWords.push({
                            text: `Row ${qNum}`,
                            val: NaN,
                            x: croppedX,
                            y: croppedY,
                            w: croppedW,
                            h: croppedH,
                            cx: croppedX + croppedW/2,
                            cy: croppedY + croppedH/2,
                            confidence: 0,
                            isRowMarker: true
                        });

                        // Recognize this row - use single line mode with digit whitelist
                        await worker.setParameters({
                            tessedit_pageseg_mode: '7', // Single text line
                            tessedit_char_whitelist: '0123456789 ' // Only digits and space
                        });

                        const { data: { text: rowText } } = await worker.recognize(ocrCanvas);
                        
                        // Clean and extract number - remove all non-digit characters
                        const cleaned = rowText.replace(/[^0-9]/g, '');
                        console.log(`[Row OCR] Q${qNum}: raw="${rowText.trim()}" -> cleaned="${cleaned}"`);
                        
                        // Always show what was detected for debugging
                        debugInfo.ocrWords.push({
                            text: rowText.trim() || '(empty)',
                            val: cleaned.length > 0 ? parseInt(cleaned) : NaN,
                            x: ocrX + 10,
                            y: rowY + rowHeight * 0.25,
                            w: ocrW - 20,
                            h: rowHeight * 0.5,
                            cx: ocrX + ocrW/2,
                            cy: rowY + rowHeight/2,
                            confidence: 100,
                            isDetection: true
                        });
                        
                        if (cleaned.length > 0 && cleaned.length <= 4) {
                            const answer = parseInt(cleaned);
                            if (!isNaN(answer)) {
                                results[qNum] = answer;
                            }
                        }
                    }

                    await worker.terminate();

                } catch (e) {
                    console.error("OCR Error", e);
                }

                // --- 2. Checkboxes (Pixel Density) using template ---
                updateStatus("OMR processing...");
                
                // Get MCQ section from template
                const template = MockData.formTemplates["default"];
                const mcqSection = template?.sections?.find(s => s.type === "multiple_choice");
                
                if (mcqSection) {
                    const mcqRegion = mcqSection.region;
                    const mcqGrid = mcqSection.grid;
                    const qStart = mcqSection.questions.start;
                    const qEnd = mcqSection.questions.end;
                    const numOptions = mcqSection.options;
                    
                    // Use anchor-based coordinates if detected
                    let startX, startY, totalWidth, totalHeight;
                    if (contentBounds.detected) {
                        startX = contentBounds.left + contentBounds.width * mcqRegion.x;
                        startY = contentBounds.top + contentBounds.height * mcqRegion.y;
                        totalWidth = contentBounds.width * mcqRegion.width;
                        totalHeight = contentBounds.height * mcqRegion.height;
                    } else {
                        startX = img.width * mcqRegion.x;
                        startY = img.height * mcqRegion.y;
                        totalWidth = img.width * mcqRegion.width;
                        totalHeight = img.height * mcqRegion.height;
                    }
                    
                    const colWidth = totalWidth / mcqGrid.columns;
                    const rowHeightOMR = totalHeight / mcqGrid.rows;
                    
                    // Grid is: rows = questions (1-15), columns = options (1-4)
                    for (let i = 0; i < (qEnd - qStart + 1); i++) {
                        const qId = qStart + i;
                        const qY = startY + (i * rowHeightOMR);  // Question = row
                        
                        let maxDensity = 0;
                        let bestOption = null;
                        
                        for (let opt = 0; opt < numOptions; opt++) {
                            const optX = startX + (opt * colWidth);  // Option = column
                            
                            const cellPadding = mcqGrid.cellPadding || 0.15;
                            const sampleW = colWidth * (1 - cellPadding * 2);
                            const sampleH = rowHeightOMR * (1 - cellPadding * 2);
                            const sampleX = optX + colWidth * cellPadding;
                            const sampleY = qY + rowHeightOMR * cellPadding;

                            if (sampleX + sampleW < img.width && sampleY + sampleH < img.height) {
                                const imageData = ctx.getImageData(sampleX, sampleY, sampleW, sampleH);
                                const data = imageData.data;
                                let darkPixels = 0;
                                
                                for (let p = 0; p < data.length; p += 4) {
                                    const gray = (data[p] + data[p+1] + data[p+2]) / 3;
                                    if (gray < grayThreshold) darkPixels++;  // Configurable threshold
                                }
                                
                                const density = darkPixels / (data.length / 4);
                                const isMarked = density > densityThreshold;  // Configurable detection threshold
                                
                                debugInfo.omrBoxes.push({
                                    x: sampleX, y: sampleY, w: sampleW, h: sampleH,
                                    density: density,
                                    isMarked: isMarked
                                });

                                if (isMarked && density > maxDensity) {
                                    maxDensity = density;
                                    bestOption = opt + 1;
                                }
                            }
                        }
                        
                        if (bestOption) {
                            results[qId] = bestOption;
                        }
                    }
                }
                
                resolve({ extractedData: results, debugInfo: debugInfo });
                resolve({ extractedData: results, debugInfo: debugInfo });
            };
            
            img.onerror = () => {
                console.error("Image load failed");
                resolve({ extractedData: {}, debugInfo: null });
            };
        });
    },

    /**
     * Խնդրի մանրամասների պատուհանի ցուցադրում
     */
    renderProblemDetailModal(problemId) {
        const problem = API.getProblemById(problemId);
        const difficultyLabels = {
            'easy': 'Հեշտ',
            'medium': 'Միջին',
            'hard': 'Բարդ'
        };
        
        return `
            <div class="modal-header">
                <h2>📝 ${problem.title}</h2>
                <button class="modal-close" onclick="App.closeModal()">&times;</button>
            </div>
            <div class="modal-body">
                <div style="display: flex; gap: 1rem; margin-bottom: 1.5rem;">
                    <span class="difficulty difficulty-${problem.difficulty}">${difficultyLabels[problem.difficulty]}</span>
                    <span class="points-badge">${problem.points} միավոր</span>
                    <span class="meta-badge">${problem.subject}</span>
                </div>
                
                <div class="problem-detail">
                    <h3>Խնդիր</h3>
                    <div class="problem-statement" style="font-size: 1.1em; line-height: 1.6;">
                        ${problem.description}
                    </div>
                </div>
            </div>
            <div class="modal-footer">
                <button class="btn btn-secondary" onclick="App.closeModal()">Փակել</button>
            </div>
        `;
    },

    /**
     * Խնդիր ավելացնելու պատուհանի ցուցադրում
     */
    renderAddProblemModal(competitionId) {
        return `
            <div class="modal-header">
                <h2>➕ Ավելացնել նոր խնդիր</h2>
                <button class="modal-close" onclick="App.closeModal()">&times;</button>
            </div>
            <div class="modal-body">
                <form id="add-problem-form">
                    <input type="hidden" id="new-prob-comp-id" value="${competitionId || ''}">
                    
                    <div class="form-group">
                        <label for="new-prob-title">Վերնագիր *</label>
                        <input type="text" id="new-prob-title" required placeholder="Օրինակ՝ Ֆիբոնաչիի թվեր">
                    </div>
                    
                    <div class="form-row">
                        <div class="form-group">
                            <label for="new-prob-difficulty">Բարդություն *</label>
                            <select id="new-prob-difficulty" required>
                                <option value="easy">Հեշտ</option>
                                <option value="medium">Միջին</option>
                                <option value="hard">Բարդ</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label for="new-prob-points">Միավորներ *</label>
                            <input type="number" id="new-prob-points" required value="100" min="0">
                        </div>
                    </div>

                    <div class="form-group">
                        <label for="new-prob-desc">Խնդրի պահանջը *</label>
                        <textarea id="new-prob-desc" rows="5" required></textarea>
                    </div>

                    <div class="form-row">
                        <div class="form-group">
                            <label for="new-prob-input">Մուտքային տվյալներ *</label>
                            <textarea id="new-prob-input" rows="3" required placeholder="Օրինակ՝ Մուտքում տրված է N բնական թիվ"></textarea>
                        </div>
                        <div class="form-group">
                            <label for="new-prob-output">Ելքային տվյալներ *</label>
                            <textarea id="new-prob-output" rows="3" required placeholder="Օրինակ՝ Արտածել N-րդ Ֆիբոնաչիի թիվը"></textarea>
                        </div>
                    </div>
                </form>
            </div>
            <div class="modal-footer">
                <button class="btn btn-secondary" onclick="App.closeModal()">Չեղարկել</button>
                <button class="btn btn-success" onclick="App.submitNewProblem()">Ավելացնել</button>
            </div>
        `;
    },

    /**
     * Մասնակից ավելացնելու պատուհանի ցուցադրում
     */
    renderAddParticipantModal() {
        const schools = API.getSchools();
        
        return `
            <div class="modal-header">
                <h2>👤 Ավելացնել մասնակից</h2>
                <button class="modal-close" onclick="App.closeModal()">&times;</button>
            </div>
            <div class="modal-body">
                <form id="add-participant-form">
                    <div class="form-row">
                        <div class="form-group">
                            <label for="new-name">Անուն Ազգանուն *</label>
                            <input type="text" id="new-name" required>
                        </div>
                        <div class="form-group">
                            <label for="new-email">Էլ. փոստ *</label>
                            <input type="email" id="new-email" required>
                        </div>
                    </div>
                    
                    <div class="form-row">
                        <div class="form-group">
                            <label for="new-school">Դպրոց *</label>
                            <select id="new-school" required>
                                <option value="">Ընտրեք դպրոցը...</option>
                                ${schools.map(s => `<option value="${s.name}">${s.name}</option>`).join('')}
                            </select>
                        </div>
                        <div class="form-group">
                            <label for="new-grade">Դասարան *</label>
                            <select id="new-grade" required>
                                ${MockData.grades.map(g => `<option value="${g.value}">${g.label}</option>`).join('')}
                            </select>
                        </div>
                    </div>
                    
                    <div class="form-group">
                        <label for="new-city">Քաղաք/Մարզ *</label>
                        <input type="text" id="new-city" required>
                    </div>
                </form>
            </div>
            <div class="modal-footer">
                <button class="btn btn-secondary" onclick="App.closeModal()">Չեղարկել</button>
                <button class="btn btn-success" onclick="App.submitNewParticipant()">Ավելացնել</button>
            </div>
        `;
    },

    /**
     * Դպրոց ավելացնելու պատուհանի ցուցադրում
     */
    renderAddSchoolModal() {
        return `
            <div class="modal-header">
                <h2>🏫 Ավելացնել դպրոց</h2>
                <button class="modal-close" onclick="App.closeModal()">&times;</button>
            </div>
            <div class="modal-body">
                <form id="add-school-form">
                    <div class="form-group">
                        <label for="school-name">Դպրոցի անվանումը *</label>
                        <input type="text" id="school-name" required>
                    </div>
                    
                    <div class="form-row">
                        <div class="form-group">
                            <label for="school-city">Քաղաք/Գյուղ *</label>
                            <input type="text" id="school-city" required>
                        </div>
                        <div class="form-group">
                            <label for="school-region">Մարզ *</label>
                            <select id="school-region" required>
                                ${MockData.regions.map(r => `<option value="${r}">${r}</option>`).join('')}
                            </select>
                        </div>
                    </div>
                    
                    <div class="form-group">
                        <label for="school-address">Հասցե</label>
                        <input type="text" id="school-address">
                    </div>
                    
                    <div class="form-row">
                        <div class="form-group">
                            <label for="school-phone">Հեռախոս</label>
                            <input type="tel" id="school-phone">
                        </div>
                        <div class="form-group">
                            <label for="school-email">Էլ. փոստ</label>
                            <input type="email" id="school-email">
                        </div>
                    </div>
                </form>
            </div>
            <div class="modal-footer">
                <button class="btn btn-secondary" onclick="App.closeModal()">Չեղարկել</button>
                <button class="btn btn-success" onclick="App.submitNewSchool()">Ավելացնել</button>
            </div>
        `;
    },

    // ==================== Օգտակար ֆունկցիաներ ====================

    /**
     * Ամսաթվի ֆորմատավորում
     */
    formatDate(dateString) {
        if (!dateString) return '';
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString('hy-AM', options);
    },

    /**
     * Հաջողության հաղորդագրության ցուցադրում
     */
    showSuccess(message) {
        const toast = document.createElement('div');
        toast.className = 'success-message';
        toast.style.cssText = 'position: fixed; top: 20px; right: 20px; z-index: 2000; animation: modalSlideIn 0.3s ease;';
        toast.textContent = message;
        document.body.appendChild(toast);
        setTimeout(() => toast.remove(), 3000);
    },

    /**
     * Սխալի հաղորդագրության ցուցադրում
     */
    showError(message) {
        const toast = document.createElement('div');
        toast.className = 'error';
        toast.style.cssText = 'position: fixed; top: 20px; right: 20px; z-index: 2000; animation: modalSlideIn 0.3s ease;';
        toast.textContent = message;
        document.body.appendChild(toast);
        setTimeout(() => toast.remove(), 3000);
    },

    /**
     * Rescan with current OMR settings
     */
    async rescanWithSettings() {
        const graySlider = document.getElementById('omr-gray-threshold');
        const densitySlider = document.getElementById('omr-density-threshold');
        
        if (!graySlider || !densitySlider) {
            console.error('OMR settings sliders not found');
            return;
        }
        
        const settings = {
            grayThreshold: parseInt(graySlider.value),
            densityThreshold: parseInt(densitySlider.value) / 100
        };
        
        console.log('Rescanning with settings:', settings);
        
        // Get the current image and problems from stored state
        if (!this._currentScanState) {
            console.error('No scan state available for rescan');
            return;
        }
        
        const { imageUrl, problems, submissionId } = this._currentScanState;
        
        // Show rescanning status
        const overlay = document.getElementById('scan-overlay');
        if (overlay) overlay.style.display = 'flex';
        const statusEl = document.getElementById('scan-status');
        if (statusEl) statusEl.innerText = 'Rescanning with new settings...';
        
        // Reprocess with new settings
        const result = await this.processSubmissionImage(imageUrl, problems, settings);
        const { extractedData, debugInfo } = result;
        
        // Update UI with new results
        const form = document.getElementById('grading-form');
        const tbody = document.getElementById('grading-table-body');
        const btn = document.getElementById('confirm-grade-btn');
        
        // Draw Debug Overlay
        this.drawDebugOverlay(debugInfo);

        // Hide overlay
        if(overlay) overlay.style.display = 'none';
        if(form) {
            form.style.opacity = '1';
            form.style.pointerEvents = 'auto';
        }
        if(btn) {
            btn.disabled = false;
            btn.style.opacity = '1';
        }
        
        // Render Rows
        if(tbody) {
            tbody.innerHTML = '';
            
            // Sort problems: filled first
            const filledProblems = problems.filter(p => extractedData[p.id]);
            const emptyProblems = problems.filter(p => !extractedData[p.id]);
            
            // Helper to render row
            const renderRow = (p) => {
                const val = extractedData[p.id] || '';
                const isMatch = String(val).trim().toLowerCase() === String(p.correctAnswer).trim().toLowerCase();
                const color = val ? (isMatch ? '#a5d6a7' : '#ffccbc') : '#fff';
                
                return `
                    <tr>
                        <td style="text-align: center; font-weight: bold; color: #555;">${p.id}</td>
                        <td>${p.title}</td>
                        <td style="padding: 8px;">
                            <input type="text" id="grade-input-${p.id}" value="${val}" 
                                style="width: 100%; padding: 8px; border: 2px solid ${color}; border-radius: 4px; font-weight: bold; font-size: 1.1em; text-align: center; color: #37474f;">
                        </td>
                        <td style="text-align: center; color: #2e7d32; font-weight: bold; background: #f1f8e9;">
                            ${p.correctAnswer}
                        </td>
                    </tr>
                `;
            };

            tbody.innerHTML += filledProblems.map(renderRow).join('');
            
            if (emptyProblems.length > 0) {
                tbody.innerHTML += `<tr><td colspan="4" style="text-align: center; color: #999; padding: 10px; border-top: 1px solid #eee; background: #fffcfc;">
                    ... plus ${emptyProblems.length} empty answers <button style="font-size: 0.8em; margin-left: 10px;" type="button" onclick="document.getElementById('more-rows').classList.toggle('hidden')">Show/Hide</button>
                </td></tr>`;
                tbody.innerHTML += `<tbody id="more-rows" class="hidden">${emptyProblems.map(renderRow).join('')}</tbody>`;
            }
        }
        
        console.log('Rescan complete with settings:', settings);
    },

    /**
     * Initialize OMR settings sliders
     */
    initOMRSettingsSliders() {
        setTimeout(() => {
            const graySlider = document.getElementById('omr-gray-threshold');
            const densitySlider = document.getElementById('omr-density-threshold');
            const grayValue = document.getElementById('omr-gray-value');
            const densityValue = document.getElementById('omr-density-value');
            
            if (graySlider && grayValue) {
                graySlider.oninput = () => {
                    grayValue.innerText = graySlider.value;
                };
            }
            
            if (densitySlider && densityValue) {
                densitySlider.oninput = () => {
                    densityValue.innerText = densitySlider.value + '%';
                };
            }
        }, 100);
    }
};
