/**
 * Main Application Controller
 * Հավելվածի հիմնական կառավարիչ
 */

const App = {
    currentPage: 'home',

    /**
     * Հավելվածի սկզբնավորում
     */
    init() {
        console.log('Սկսվում է Olymp.am հավելվածը...');
        
        // Տվյալների սկզբնավորում
        API.init();
        
        // Load saved templates from localStorage
        UI.init();
        
        // Նավիգացիայի կարգավորում
        this.setupNavigation();
        
        // Մոբայլ մենյուի կարգավորում
        this.setupMobileMenu();
        
        // Տեղափոխվել գլխավոր էջ
        this.navigateTo('home');
    },

    /**
     * Նավիգացիայի կարգավորում
     */
    setupNavigation() {
        const navLinks = document.querySelectorAll('.nav-menu a');
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const page = e.target.getAttribute('data-page');
                this.navigateTo(page);
                // Փակել մոբայլ մենյուն ընտրելուց հետո
                document.querySelector('.nav-menu').classList.remove('show');
            });
        });
    },

    /**
     * Մոբայլ մենյուի կոճակի կարգավորում
     */
    setupMobileMenu() {
        const mobileBtn = document.getElementById('mobile-menu-btn');
        if (mobileBtn) {
            mobileBtn.addEventListener('click', () => {
                document.querySelector('.nav-menu').classList.toggle('show');
            });
        }
    },

    /**
     * Էջերի տեղափոխում
     */
    navigateTo(page) {
        console.log(`Տեղափոխում էջ: ${page}`);
        this.currentPage = page;

        // Ակտիվացնել մենյուի կոճակը
        document.querySelectorAll('.nav-menu a').forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('data-page') === page) {
                link.classList.add('active');
            }
        });

        // Ցուցադրել բեռնման էկրանը
        const contentDiv = document.getElementById('app-content');
        contentDiv.innerHTML = '<div class="loading">Բեռնվում է...</div>';

        // Render page content
        setTimeout(() => {
            let content;
            switch (page) {
                case 'competitions':
                    content = UI.renderCompetitions();
                    break;
                case 'problems':
                    content = UI.renderProblems();
                    break;
                case 'participants':
                    content = UI.renderParticipants();
                    break;
                case 'results':
                    content = UI.renderResults();
                    break;
                case 'schools':
                    content = UI.renderSchools();
                    break;
                case 'about':
                    content = UI.renderAbout();
                    break;
                case 'editor': // New route
                    content = UI.renderAnswerSheetEditor();
                    break;
                case 'grading':
                    content = UI.renderGradingPage();
                    break;
                default:
                    content = UI.renderHome();
            }
            contentDiv.innerHTML = content;
        }, 200);
    },

    // ==================== Մրցույթների ֆունկցիոնալություն ====================

    /**
     * Մրցույթների ֆիլտրացիա
     */
    filterCompetitions() {
        const statusFilter = document.getElementById('status-filter').value;
        const subjectFilter = document.getElementById('subject-filter').value;
        
        const cards = document.querySelectorAll('.competition-card');
        cards.forEach(card => {
            const status = card.getAttribute('data-status');
            const subject = card.getAttribute('data-subject');
            
            const statusMatch = statusFilter === 'all' || status === statusFilter;
            const subjectMatch = subjectFilter === 'all' || subject === subjectFilter;
            
            card.style.display = statusMatch && subjectMatch ? 'flex' : 'none';
        });
    },

    /**
     * Ցուցադրել գրանցման պատուհանը
     */
    showRegistrationModal(competitionId) {
        const modal = document.getElementById('modal-container');
        const modalContent = document.getElementById('modal-content');
        modalContent.innerHTML = UI.renderRegistrationModal(competitionId);
        modal.classList.remove('hidden');
        
        // Փակել պատուհանը սեղմելով ետնաշերտին
        document.querySelector('.modal-backdrop').onclick = () => this.closeModal();
    },

    /**
     * Հաստատել գրանցումը
     */
    submitRegistration() {
        const form = document.getElementById('registration-form');
        const competitionId = parseInt(document.getElementById('competition-id').value);
        
        const name = document.getElementById('reg-name').value.trim();
        const email = document.getElementById('reg-email').value.trim();
        const school = document.getElementById('reg-school').value;
        const grade = parseInt(document.getElementById('reg-grade').value);
        const city = document.getElementById('reg-city').value.trim();
        
        if (!name || !email || !school || !grade || !city) {
            UI.showError('Խնդրում ենք լրացնել բոլոր պարտադիր դաշտերը');
            return;
        }
        
        // Ստուգել գոյություն ունեցող մասնակիցներին
        const existingParticipants = API.getParticipants();
        let participant = existingParticipants.find(p => p.email === email);
        
        if (participant) {
            // Եթե մասնակիցը արդեն կա, գրանցել նրան մրցույթին
            API.registerParticipantForCompetition(participant.id, competitionId);
        } else {
            // Ստեղծել նոր մասնակից
            participant = API.addParticipant({
                name,
                email,
                school,
                grade,
                city,
                registeredCompetitions: [competitionId],
                scores: {}
            });
        }
        
        // Թարմացնել մրցույթի մասնակիցների քանակը
        const competitions = API.getCompetitions();
        const compIndex = competitions.findIndex(c => c.id === competitionId);
        if (compIndex !== -1) {
            competitions[compIndex].participants++;
            localStorage.setItem(API.STORAGE_KEYS.COMPETITIONS, JSON.stringify(competitions));
        }
        
        this.closeModal();
        UI.showSuccess('Գրանցումն հաջողությամբ կատարվեց։');
        this.navigateTo('competitions');
    },

    /**
     * Ցուցադրել մրցույթի մանրամասները
     */
    viewCompetitionDetails(competitionId) {
        const competition = API.getCompetitionById(competitionId);
        const problems = API.getProblemsByCompetition(competitionId);
        const participants = API.getParticipantsByCompetition(competitionId);
        
        const modal = document.getElementById('modal-container');
        const modalContent = document.getElementById('modal-content');
        
        const statusLabels = {
            'registration': 'Գրանցումը բաց է',
            'upcoming': 'Սպասվող',
            'active': 'Ընթացքի մեջ',
            'completed': 'Ավարտված'
        };
        
        modalContent.innerHTML = `
            <div class="modal-header">
                <h2>${competition.name}</h2>
                <button class="modal-close" onclick="App.closeModal()">&times;</button>
            </div>
            <div class="modal-body">
                <p><strong>Նկարագրություն՝</strong> ${competition.description}</p>
                <p><strong>Կարգավիճակ՝</strong> <span class="status-badge status-${competition.status}">${statusLabels[competition.status]}</span></p>
                <p><strong>Առարկա՝</strong> ${competition.subject}</p>
                <p><strong>Սկիզբ՝</strong> ${UI.formatDate(competition.startDate)}</p>
                <p><strong>Տևողություն՝</strong> ${competition.duration} րոպե</p>
                <p><strong>Մասնակիցներ՝</strong> ${competition.participants}/${competition.maxParticipants}</p>
                <p><strong>Դասարաններ՝</strong> ${competition.grades.join(', ')}-րդ դասարաններ</p>
                
                <h3 style="margin-top: 1.5rem;">📚 Խնդիրներ (${problems.length})</h3>
                ${problems.length > 0 ? `
                    <div class="problems-list">
                        ${problems.map(p => `
                            <div class="problem-item">
                                <div class="problem-info">
                                    <h3>${p.title}</h3>
                                </div>
                                <div class="problem-meta">
                                    <span class="difficulty difficulty-${p.difficulty}">${p.difficulty}</span>
                                    <span class="points-badge">${p.points} միավոր</span>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                ` : '<p>Այս մրցույթի համար դեռ խնդիրներ չկան</p>'}
                
                <h3 style="margin-top: 1.5rem;">👥 Գրանցված մասնակիցներ (${participants.length})</h3>
                ${participants.length > 0 ? `
                    <ul>
                        ${participants.slice(0, 10).map(p => `<li>${p.name} - ${p.school}</li>`).join('')}
                        ${participants.length > 10 ? `<li>և ${participants.length - 10} այլ մասնակիցներ...</li>` : ''}
                    </ul>
                ` : '<p>Դեռ գրանցված մասնակիցներ չկան</p>'}
            </div>
            <div class="modal-footer">
                <button class="btn btn-secondary" onclick="App.closeModal()">Փակել</button>
                <button class="btn btn-primary" onclick="App.closeModal(); App.showAddProblemModal(${competitionId})">➕ Ավելացնել խնդիր</button>
                ${competition.status === 'registration' ? `
                    <button class="btn btn-success" onclick="App.closeModal(); App.showRegistrationModal(${competitionId});">Գրանցվել</button>
                ` : ''}
                ${competition.status === 'active' ? `
                    <button class="btn btn-warning" onclick="App.closeModal(); App.showAnswerSheetModal(${competitionId});">📝 Լրացնել պատասխանները</button>
                ` : ''}
            </div>
        `;
        
        modal.classList.remove('hidden');
        document.querySelector('.modal-backdrop').onclick = () => this.closeModal();
    },

    // ==================== Խնդիրների ֆունկցիոնալություն ====================

    /**
     * Խնդիր ավելացնելու պատուհան
     */
    showAddProblemModal(competitionId) {
        const modal = document.getElementById('modal-container');
        const modalContent = document.getElementById('modal-content');
        modalContent.innerHTML = UI.renderAddProblemModal(competitionId);
        modal.classList.remove('hidden');
        document.querySelector('.modal-backdrop').onclick = () => this.closeModal();
    },

    /**
     * Հաստատել նոր խնդրի ավելացումը
     */
    submitNewProblem() {
        const competitionId = parseInt(document.getElementById('new-prob-comp-id').value);
        const title = document.getElementById('new-prob-title').value.trim();
        const difficulty = document.getElementById('new-prob-difficulty').value;
        const points = parseInt(document.getElementById('new-prob-points').value);
        const description = document.getElementById('new-prob-desc').value.trim();
        const input = document.getElementById('new-prob-input').value.trim();
        const output = document.getElementById('new-prob-output').value.trim();
        
        if (!title || !description || !input || !output || !points) {
            UI.showError('Խնդրում ենք լրացնել բոլոր պարտադիր դաշտերը');
            return;
        }

        const competition = API.getCompetitionById(competitionId);
        
        API.addProblem({
            title,
            competitionId: competitionId || null,
            subject: competition ? competition.subject : 'Մաթեմատիկա', // Fallback or select
            difficulty,
            points,
            description,
            input,
            output,
            examples: [
                { input: 'Մուտքի օրինակ', output: 'Ելքի օրինակ' } // Placeholder for demo
            ]
        });

        this.closeModal();
        UI.showSuccess('Խնդիրը հաջողությամբ ավելացվեց');
        
        // Refresh view if coming from competition details
        if (competitionId) {
            this.viewCompetitionDetails(competitionId);
        } else {
            this.navigateTo('problems');
        }
    },

    /**
     * Ցուցադրել պատասխանաթերթիկի պատուհանը
     */
    showAnswerSheetModal(competitionId) {
        const modal = document.getElementById('modal-container');
        const modalContent = document.getElementById('modal-content');
        modalContent.innerHTML = UI.renderAnswerSheetModal(competitionId);
        modal.classList.remove('hidden');
        document.querySelector('.modal-backdrop').onclick = () => this.closeModal();
    },

    /**
     * Հանձնել պատասխանաթերթիկը (Scan)
     */
    submitAnswerSheetScan() {
        const competitionId = parseInt(document.getElementById('as-comp-id').value);
        const fileInput = document.getElementById('file-input');
        
        if (!fileInput.files.length) {
            UI.showError('Խնդրում ենք ընտրել ֆայլը');
            return;
        }

        const file = fileInput.files[0];
        const reader = new FileReader();

        reader.onload = function(e) {
            const imageData = e.target.result;
            
            const submission = {
                competitionId,
                userId: 1, // Mock user
                filename: file.name,
                timestamp: new Date().toISOString(),
                status: 'pending_review',
                imageData: imageData // Store the actual image
            };

            try {
                API.uploadAnswerSheet(submission);
                
                // Clear the input
                fileInput.value = '';
                App.closeModal();
                UI.showSuccess('Պատասխանաթերթիկը հաջողությամբ վերբեռնվեց:');
                
                // Mock notification
                console.log("Admin notification: New answer sheet uploaded for " + competitionId);
            } catch (err) {
                console.error(err);
                if (err.name === 'QuotaExceededError') {
                    UI.showError('Նկարի չափը շատ մեծ է Demo տարբերակի համար: Խնդրում ենք ընտրել ավելի փոքր նկար:');
                } else {
                    UI.showError('Տեղի ունեցավ սխալ:');
                }
            }
        };

        reader.readAsDataURL(file);
    },

    /**
     * Submit OMR grading
     */
    submitGrading(submissionId) {
        const submission = API.getSubmissionById(submissionId);
        if(!submission) return;

        const competitionId = submission.competitionId;
        const problems = API.getProblemsByCompetition(competitionId);
        
        const answers = {};
        
        problems.forEach(p => {
            const input = document.getElementById(`grade-input-${p.id}`);
            if (input) {
                answers[p.id] = input.value;
            }
        });

        const result = API.gradeSubmission(submissionId, answers);
        
        this.closeModal();
        UI.showSuccess(`Գնահատումն ավարտված է: Միավոր՝ ${result.score}`);
        
        this.navigateTo('grading');
    },

    /**
     * Խնդիրների ֆիլտրացիա
     */
    filterProblems() {
        const searchQuery = document.getElementById('problem-search').value.toLowerCase();
        const difficultyFilter = document.getElementById('difficulty-filter').value;
        const subjectFilter = document.getElementById('subject-filter-problems').value;
        
        const items = document.querySelectorAll('.problem-item');
        items.forEach(item => {
            const title = item.querySelector('h3').textContent.toLowerCase();
            const difficulty = item.getAttribute('data-difficulty');
            const subject = item.getAttribute('data-subject');
            
            const searchMatch = title.includes(searchQuery);
            const difficultyMatch = difficultyFilter === 'all' || difficulty === difficultyFilter;
            const subjectMatch = subjectFilter === 'all' || subject === subjectFilter;
            
            item.style.display = searchMatch && difficultyMatch && subjectMatch ? 'flex' : 'none';
        });
    },

    /**
     * Ցուցադրել խնդրի մանրամասները
     */
    viewProblemDetails(problemId) {
        const modal = document.getElementById('modal-container');
        const modalContent = document.getElementById('modal-content');
        modalContent.innerHTML = UI.renderProblemDetailModal(problemId);
        modal.classList.remove('hidden');
        document.querySelector('.modal-backdrop').onclick = () => this.closeModal();
    },

    // ==================== Մասնակիցների ֆունկցիոնալություն ====================

    /**
     * Մասնակիցների ֆիլտրացիա
     */
    filterParticipants() {
        const searchQuery = document.getElementById('participant-search').value.toLowerCase();
        const gradeFilter = document.getElementById('grade-filter').value;
        
        const rows = document.querySelectorAll('#participants-table tbody tr');
        rows.forEach(row => {
            const name = row.querySelector('td:nth-child(2)').textContent.toLowerCase();
            const school = row.querySelector('td:nth-child(3)').textContent.toLowerCase();
            const city = row.querySelector('td:nth-child(5)').textContent.toLowerCase();
            const grade = row.getAttribute('data-grade');
            
            const searchMatch = name.includes(searchQuery) || school.includes(searchQuery) || city.includes(searchQuery);
            const gradeMatch = gradeFilter === 'all' || grade === gradeFilter;
            
            row.style.display = searchMatch && gradeMatch ? '' : 'none';
        });
    },

    /**
     * Ցուցադրել մասնակից ավելացնելու պատուհանը
     */
    showAddParticipantModal() {
        const modal = document.getElementById('modal-container');
        const modalContent = document.getElementById('modal-content');
        modalContent.innerHTML = UI.renderAddParticipantModal();
        modal.classList.remove('hidden');
        document.querySelector('.modal-backdrop').onclick = () => this.closeModal();
    },

    /**
     * Հաստատել նոր մասնակցի ավելացումը
     */
    submitNewParticipant() {
        const name = document.getElementById('new-name').value.trim();
        const email = document.getElementById('new-email').value.trim();
        const school = document.getElementById('new-school').value;
        const grade = parseInt(document.getElementById('new-grade').value);
        const city = document.getElementById('new-city').value.trim();
        
        if (!name || !email || !school || !grade || !city) {
            UI.showError('Խնդրում ենք լրացնել բոլոր պարտադիր դաշտերը');
            return;
        }
        
        API.addParticipant({
            name,
            email,
            school,
            grade,
            city,
            registeredCompetitions: [],
            scores: {}
        });
        
        this.closeModal();
        UI.showSuccess('Մասնակիցը հաջողությամբ ավելացվեց։');
        this.navigateTo('participants');
    },

    /**
     * Ցուցադրել մասնակցի մանրամասները
     */
    viewParticipantDetails(participantId) {
        const participant = API.getParticipantById(participantId);
        const results = API.getResultsByParticipant(participantId);
        const competitions = API.getCompetitions();
        
        const modal = document.getElementById('modal-container');
        const modalContent = document.getElementById('modal-content');
        
        modalContent.innerHTML = `
            <div class="modal-header">
                <h2>👤 ${participant.name}</h2>
                <button class="modal-close" onclick="App.closeModal()">&times;</button>
            </div>
            <div class="modal-body">
                <p><strong>Էլ. հասցե՝</strong> ${participant.email}</p>
                <p><strong>Դպրոց՝</strong> ${participant.school}</p>
                <p><strong>Դասարան՝</strong> ${participant.grade}-րդ դասարան</p>
                <p><strong>Քաղաք/Մարզ՝</strong> ${participant.city}</p>
                
                <h3 style="margin-top: 1.5rem;">🏆 Գրանցված մրցույթներ</h3>
                ${participant.registeredCompetitions && participant.registeredCompetitions.length > 0 ? `
                    <ul>
                        ${participant.registeredCompetitions.map(compId => {
                            const comp = competitions.find(c => c.id === compId);
                            return comp ? `<li>${comp.name}</li>` : '';
                        }).join('')}
                    </ul>
                ` : '<p>Մասնակիցը դեռ գրանցված չէ որևէ մրցույթի</p>'}
                
                <h3 style="margin-top: 1.5rem;">📊 Արդյունքներ</h3>
                ${results.length > 0 ? `
                    <table class="data-table">
                        <thead>
                            <tr>
                                <th>Մրցույթ</th>
                                <th>Տեղ</th>
                                <th>Միավոր</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${results.map(r => {
                                const comp = competitions.find(c => c.id === r.competitionId);
                                return `
                                    <tr>
                                        <td>${comp ? comp.name : 'Մրցույթը չի գտնվել'}</td>
                                        <td>${r.rank}</td>
                                        <td>${r.totalScore}</td>
                                    </tr>
                                `;
                            }).join('')}
                        </tbody>
                    </table>
                ` : '<p>Արդյունքներ առկա չեն</p>'}
            </div>
            <div class="modal-footer">
                <button class="btn btn-secondary" onclick="App.closeModal()">Փակել</button>
            </div>
        `;
        
        modal.classList.remove('hidden');
        document.querySelector('.modal-backdrop').onclick = () => this.closeModal();
    },

    // ==================== Արդյունքների ֆունկցիոնալություն ====================

    /**
     * Բեռնել մրցույթի արդյունքները
     */
    loadCompetitionResults() {
        const select = document.getElementById('competition-select');
        const competitionId = select.value;
        const container = document.getElementById('results-container');
        
        if (!competitionId) {
            container.innerHTML = `
                <div class="empty-state">
                    <div class="empty-state-icon">🏅</div>
                    <h3>Ընտրեք մրցույթը</h3>
                    <p>Խնդրում ենք ընտրել մրցույթը ցանկից՝ արդյունքները տեսնելու համար</p>
                </div>
            `;
            return;
        }
        
        container.innerHTML = UI.renderLeaderboard(parseInt(competitionId));
    },

    // ==================== Դպրոցների ֆունկցիոնալություն ====================

    /**
     * Դպրոցների ֆիլտրացիա
     */
    filterSchools() {
        const searchQuery = document.getElementById('school-search').value.toLowerCase();
        const regionFilter = document.getElementById('region-filter').value;
        
        const cards = document.querySelectorAll('.school-card');
        cards.forEach(card => {
            const name = card.querySelector('h3').textContent.toLowerCase();
            const region = card.getAttribute('data-region');
            
            const searchMatch = name.includes(searchQuery);
            const regionMatch = regionFilter === 'all' || region === regionFilter;
            
            card.style.display = searchMatch && regionMatch ? 'block' : 'none';
        });
    },

    /**
     * Ցուցադրել դպրոց ավելացնելու պատուհանը
     */
    showAddSchoolModal() {
        const modal = document.getElementById('modal-container');
        const modalContent = document.getElementById('modal-content');
        modalContent.innerHTML = UI.renderAddSchoolModal();
        modal.classList.remove('hidden');
        document.querySelector('.modal-backdrop').onclick = () => this.closeModal();
    },

    /**
     * Հաստատել նոր դպրոցի ավելացումը
     */
    submitNewSchool() {
        const name = document.getElementById('school-name').value.trim();
        const city = document.getElementById('school-city').value.trim();
        const region = document.getElementById('school-region').value;
        const address = document.getElementById('school-address').value.trim();
        const phone = document.getElementById('school-phone').value.trim();
        const email = document.getElementById('school-email').value.trim();
        
        if (!name || !city || !region) {
            UI.showError('Խնդրում ենք լրացնել բոլոր պարտադիր դաշտերը');
            return;
        }
        
        API.addSchool({
            name,
            city,
            region,
            address,
            phone,
            email,
            participantsCount: 0,
            averageScore: 0
        });
        
        this.closeModal();
        UI.showSuccess('Դպրոցը հաջողությամբ ավելացվեց։');
        this.navigateTo('schools');
    },

    // ==================== Օգտակար ֆունկցիաներ ====================

    /**
     * Փակել պատուհանը
     */
    closeModal() {
        const modal = document.getElementById('modal-container');
        modal.classList.add('hidden');
    },

    /**
     * Վերականգնել բոլոր տվյալները
     */
    resetAllData() {
        if (confirm('Դուք վստա՞հ եք, որ ցանկանում եք վերականգնել տվյալների բազան սկզբնական վիճակի: Բոլոր փոփոխությունները կկորչեն:')) {
            API.resetData();
            UI.showSuccess('Տվյալները հաջողությամբ վերականգնվել են սկզբնական վիճակի։');
            this.navigateTo('home');
        }
    },

    /**
     * Ցուցադրել մրցույթ ավելացնելու պատուհանը
     */
    showAddCompetitionModal() {
        const modal = document.getElementById('modal-container');
        const modalContent = document.getElementById('modal-content');
        
        modalContent.innerHTML = `
            <div class="modal-header">
                <h2>🏆 Ավելացնել մրցույթ</h2>
                <button class="modal-close" onclick="App.closeModal()">&times;</button>
            </div>
            <div class="modal-body">
                <form id="add-competition-form">
                    <div class="form-group">
                        <label for="comp-name">Մրցույթի անվանումը *</label>
                        <input type="text" id="comp-name" required>
                    </div>
                    
                    <div class="form-group">
                        <label for="comp-subject">Առարկա *</label>
                        <select id="comp-subject" required>
                            ${MockData.subjects.map(s => `<option value="${s.name}">${s.icon} ${s.name}</option>`).join('')}
                        </select>
                    </div>
                    
                    <div class="form-group">
                        <label for="comp-description">Նկարագրություն</label>
                        <textarea id="comp-description" rows="3"></textarea>
                    </div>
                    
                    <div class="form-row">
                        <div class="form-group">
                            <label for="comp-start-date">Սկզբի ամսաթիվ *</label>
                            <input type="date" id="comp-start-date" required>
                        </div>
                        <div class="form-group">
                            <label for="comp-reg-deadline">Գրանցման վերջնաժամկետ *</label>
                            <input type="date" id="comp-reg-deadline" required>
                        </div>
                    </div>
                    
                    <div class="form-row">
                        <div class="form-group">
                            <label for="comp-duration">Տևողություն (րոպե) *</label>
                            <input type="number" id="comp-duration" value="180" min="30" max="600" required>
                        </div>
                        <div class="form-group">
                            <label for="comp-max-participants">Մասնակիցների առավելագույն քանակ *</label>
                            <input type="number" id="comp-max-participants" value="200" min="10" max="1000" required>
                        </div>
                    </div>
                </form>
            </div>
            <div class="modal-footer">
                <button class="btn btn-secondary" onclick="App.closeModal()">Չեղարկել</button>
                <button class="btn btn-success" onclick="App.submitNewCompetition()">Ստեղծել</button>
            </div>
        `;
        
        modal.classList.remove('hidden');
        document.querySelector('.modal-backdrop').onclick = () => this.closeModal();
    },

    /**
     * Հաստատել նոր մրցույթի ավելացումը
     */
    submitNewCompetition() {
        const name = document.getElementById('comp-name').value.trim();
        const subject = document.getElementById('comp-subject').value;
        const description = document.getElementById('comp-description').value.trim();
        const startDate = document.getElementById('comp-start-date').value;
        const registrationDeadline = document.getElementById('comp-reg-deadline').value;
        const duration = parseInt(document.getElementById('comp-duration').value);
        const maxParticipants = parseInt(document.getElementById('comp-max-participants').value);
        
        if (!name || !subject || !startDate || !registrationDeadline || !duration || !maxParticipants) {
            UI.showError('Խնդրում ենք լրացնել բոլոր պարտադիր դաշտերը');
            return;
        }
        
        API.addCompetition({
            name,
            subject,
            description,
            startDate,
            endDate: startDate,
            registrationDeadline,
            status: 'registration',
            participants: 0,
            maxParticipants,
            grades: [9, 10, 11, 12],
            duration,
            problems: []
        });
        
        this.closeModal();
        UI.showSuccess('Մրցույթը հաջողությամբ ստեղծվեց։');
        this.navigateTo('competitions');
    }
};

// Initialize App when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    App.init();
});
