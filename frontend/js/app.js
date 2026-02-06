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
        
        // Load saved templates from localStorage
        UI.init();
        
        // Նավիգացիայի կարգավորում
        this.setupNavigation();

        // Դերերի կառավարում
        this.setupRoleManagement();
        
        // Մոբայլ մենյուի կարգավորում
        this.setupMobileMenu();
        
        // Տեղափոխվել գլխավոր էջ
        this.navigateTo('home');
    },

    /**
     * Դերերի կառավարում և Նավիգացիայի թարմացում
     */
    setupRoleManagement() {
        // Initialize default user if not exists
        if (!API.getCurrentUser()) {
             API.setCurrentUser({ role: 'guest', name: 'Guest' });
        }
        
        const currentUser = API.getCurrentUser() || { role: 'guest' };
        const roleSelector = document.getElementById('role-selector');
        
        if (roleSelector) {
            roleSelector.value = currentUser.role;
            
            roleSelector.addEventListener('change', (e) => {
                const newRole = e.target.value;
                const roleName = e.target.options[e.target.selectedIndex].text;
                
                const user = { 
                    role: newRole, 
                    name: roleName.split(' ')[0] // Just first word for simplicity
                };
                
                API.setCurrentUser(user);
                this.updateNavigationBasedOnRole(newRole);
                
                UI.showSuccess(`Դերը փոխվեց: ${user.name}`);
                
                // Navigate to home to ensure permissions are applied
                this.navigateTo('home');
            });
        }
        
        this.updateNavigationBasedOnRole(currentUser.role);
    },

    /**
     * Update Navigation items based on role
     */
    updateNavigationBasedOnRole(role) {
        console.log('Updating navigation for role:', role);
        const roles = window.DataStore ? window.DataStore.getRoles() : {};
        
        // Default visibility (everything visible)
        const show = (id) => {
            const el = document.getElementById('nav-' + id);
            if (el) el.style.display = 'block';
        };
        const hide = (id) => {
            const el = document.getElementById('nav-' + id);
            if (el) el.style.display = 'none';
        };
        
        // Helper to hide multiple
        const hideList = (list) => list.forEach(hide);
        const showList = (list) => list.forEach(show);
        
        // Reset all to visible first
        const allNavs = ['home', 'competitions', 'problems', 'participants', 'results', 'schools', 'editor', 'grading', 'about'];
        showList(allNavs);

        switch (role) {
            case 'guest':
                // Guest: General info only
                hideList(['editor', 'grading', 'schools', 'participants']); 
                // Note: user asked for "general information on competitions, problems and results".
                // I'm hiding schools & participants to differ from Admin, but showing Comp/Prob/Res
                break;
                
            case 'school_operator':
                // School Operator: Can print sheets, submit scans.
                // Needs Competitions (to find sheets/submit), Schools (their school info).
                // Doesn't need Editor (Template creation), Grading (Committee job).
                hideList(['editor', 'grading']);
                break;
                
            case 'committee_member':
                // Committee: Add/Edit problems, Grade.
                // Needs Editor (for problems/templates), Grading.
                // Less focus on Schools maybe?
                hideList(['schools']);
                break;
                
            case 'admin':
                // Admin: Everyting
                break;
                
            default:
                // Fallback to guest
                hideList(['editor', 'grading', 'schools']);
        }
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
        const gradeFilter = document.getElementById('grade-filter-competitions') ? 
                            document.getElementById('grade-filter-competitions').value : 'all';
        
        const cards = document.querySelectorAll('.competition-card');
        cards.forEach(card => {
            const status = card.getAttribute('data-status');
            const subject = card.getAttribute('data-subject');
            const gradesStr = card.getAttribute('data-grades') || '';
            const cardGrades = gradesStr.split(',').filter(g => g).map(g => g.trim());
            
            const statusMatch = statusFilter === 'all' || status === statusFilter;
            const subjectMatch = subjectFilter === 'all' || subject === subjectFilter;
            const gradeMatch = gradeFilter === 'all' || cardGrades.includes(gradeFilter);
            
            card.style.display = statusMatch && subjectMatch && gradeMatch ? 'flex' : 'none';
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
        const competition = API.getCompetitionById(competitionId);
        if (competition) {
            API.updateCompetition(competitionId, { participants: competition.participants + 1 });
        }
        
        this.closeModal();
        UI.showSuccess('Գրանցումն հաջողությամբ կատարվեց։');
        this.navigateTo('competitions');
    },

    /**
     * Terminate the competition (Mark as completed)
     */
    finishCompetition(competitionId) {
        if (confirm('Դուք վստա՞հ եք, որ ցանկանում եք ավարտել մրցույթը: Սա թույլ կտա դիտել արդյունքները:')) {
            API.updateCompetition(competitionId, { status: 'completed' });
            this.closeModal();
            UI.showSuccess('Մրցույթն ավարտվեց: Արդյունքներն այժմ հասանելի են:');
            // Refresh current view if needed
            const currentPage = document.querySelectorAll('.nav-links a.active')[0]?.getAttribute('data-page');
            if (currentPage === 'competitions') this.navigateTo('competitions');
            if (currentPage === 'results') this.navigateTo('results');
        }
    },

    /**
     * Ցուցադրել մրցույթի մանրամասները
     */
    viewCompetitionDetails(competitionId) {
        const competition = API.getCompetitionById(competitionId);
        const currentUser = API.getCurrentUser();
        const role = currentUser ? currentUser.role : 'guest';
        
        const subjects = API.getSubjects();
        const subjectObj = subjects.find(s => s.id === competition.subject) || { name: competition.subject, icon: '📚' };
        
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

        const canEditProblems = role === 'admin' || role === 'committee_member';
        const canSubmitAnswers = role === 'admin' || role === 'school_operator';
        
        modalContent.innerHTML = `
            <div class="modal-header">
                <h2>${competition.name}</h2>
                <button class="modal-close" onclick="App.closeModal()">&times;</button>
            </div>
            <div class="modal-body">
                <p><strong>Նկարագրություն՝</strong> ${competition.description}</p>
                <p><strong>Կարգավիճակ՝</strong> <span class="status-badge status-${competition.status}">${statusLabels[competition.status]}</span></p>
                <p><strong>Առարկա՝</strong> ${subjectObj.icon} ${subjectObj.name}</p>
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
                                    <h3>#${p.number || '-'}: ${p.title}</h3>
                                    <p style="font-size: 0.85em; color: #666;">
                                        Տեսակ՝ ${p.type === 'multiple_choice' ? 'Բազմակի ընտրություն' : 'Կարճ պատասխան'}
                                        ${(p.correctAnswer && canEditProblems) ? ` | Ճիշտ՝ <strong>${p.correctAnswer}</strong>` : ''}
                                    </p>
                                </div>
                                <div class="problem-meta">
                                    <span class="difficulty difficulty-${p.difficulty}">${{easy:'Հեշտ',medium:'Միջին',hard:'Բարդ'}[p.difficulty] || p.difficulty}</span>
                                    <span class="points-badge">${p.points} միավոր</span>
                                    ${canEditProblems ? `
                                        <button class="btn btn-sm" onclick="App.closeModal(); App.showEditProblemModal(${p.id})" title="Խմբագրել">✏️</button>
                                        <button class="btn btn-sm btn-danger" onclick="App.deleteProblem(${p.id})" title="Ջնջել">🗑️</button>
                                    ` : ''}
                                </div>
                            </div>
                        `).join('')}
                    </div>
                ` : '<p>Այս մրցույթի համար դեռ խնդիրներ չկան</p>'}
                

                <h3 style="margin-top: 1.5rem;">👥 Գրանցված մասնակիցներ (${participants.length})</h3>
                ${participants.length > 0 ? `
                    <ul>
                        ${participants.slice(0, 10).map(p => {
                            const name = p.name || `${p.firstName || ''} ${p.lastName || ''}`.trim() || 'Անհայտ';
                            return `<li>${name} - ${p.school}</li>`;
                        }).join('')}
                        ${participants.length > 10 ? `<li>և ${participants.length - 10} այլ մասնակիցներ...</li>` : ''}
                    </ul>
                ` : '<p>Դեռ գրանցված մասնակիցներ չկան</p>'}
            </div>
            <div class="modal-footer">
                <button class="btn btn-secondary" onclick="App.closeModal()">Փակել</button>
                ${canEditProblems ? `<button class="btn btn-primary" onclick="App.closeModal(); App.showAddProblemModal(${competitionId})">➕ Ավելացնել խնդիր</button>` : ''}
                
                ${(role === 'school_operator' || role === 'admin') ? `
                    <button class="btn btn-info" style="background-color: #17a2b8; color: white; margin-left: 10px;" onclick="UI.printAnswerSheetTemplate('${competition.subject}', '${competition.name}')">🖨️ Տպել պատասխանաթերթիկ</button>
                ` : ''}

                ${role === 'school_operator' || role === 'guest' || role === 'admin' ? 
                    (competition.status === 'registration' ? `
                    <button class="btn btn-success" style="margin-left: 10px;" onclick="App.closeModal(); App.showRegistrationModal(${competitionId});">Գրանցվել</button>
                ` : '') : ''}
                
                ${competition.status === 'active' && canSubmitAnswers ? `
                    <button class="btn btn-warning" style="margin-left: 10px;" onclick="App.closeModal(); App.showAnswerSheetModal(${competitionId});">📝 Լրացնել պատասխանները</button>
                ` : ''}
                
                ${role === 'admin' && competition.status === 'active' ? `
                    <button class="btn btn-danger" style="margin-left: 10px;" onclick="App.finishCompetition(${competitionId})">🏁 Ավարտել մրցույթը</button>
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
        const competitionIdField = document.getElementById('new-prob-comp-id').value || document.getElementById('new-prob-comp')?.value;
        const competitionId = competitionIdField ? parseInt(competitionIdField) : null;
        const title = document.getElementById('new-prob-title').value.trim();
        const type = document.getElementById('new-prob-type').value;
        const number = parseInt(document.getElementById('new-prob-number').value) || 1;
        const difficulty = document.getElementById('new-prob-difficulty').value;
        const points = parseInt(document.getElementById('new-prob-points').value);
        const description = document.getElementById('new-prob-desc').value.trim();
        
        // Get correct answer based on type
        let correctAnswer = '';
        if (type === 'multiple_choice') {
            const selectedRadio = document.querySelector('input[name="correct-answer"]:checked');
            correctAnswer = selectedRadio ? selectedRadio.value : '';
        } else {
            correctAnswer = document.getElementById('new-prob-short-answer').value.trim();
        }
        
        if (!title || !description || !points || !correctAnswer) {
            UI.showError('Խնդրում ենք լրացնել բոլոր պարտադիր դաշտերը, ներառյալ ճիշտ պատասխանը');
            return;
        }

        const competition = competitionId ? API.getCompetitionById(competitionId) : null;
        
        API.addProblem({
            title,
            name: title,
            number,
            competitionId: competitionId || null,
            subject: competition ? competition.subject : 'Mathematics',
            type,
            difficulty,
            points,
            description,
            correctAnswer
        });

        this.closeModal();
        UI.showSuccess('Problem added successfully');
        
        // Refresh view if coming from competition details
        if (competitionId) {
            this.viewCompetitionDetails(competitionId);
        } else {
            this.navigateTo('problems');
        }
    },

    /**
     * Update existing problem
     */
    updateProblem(problemId) {
        const competitionId = parseInt(document.getElementById('edit-prob-comp').value);
        const title = document.getElementById('edit-prob-title').value.trim();
        const type = document.getElementById('edit-prob-type').value;
        const number = parseInt(document.getElementById('edit-prob-number').value) || 1;
        const difficulty = document.getElementById('edit-prob-difficulty').value;
        const points = parseInt(document.getElementById('edit-prob-points').value);
        const description = document.getElementById('edit-prob-desc').value.trim();
        
        // Get correct answer based on type
        let correctAnswer = '';
        if (type === 'multiple_choice') {
            const selectedRadio = document.querySelector('input[name="edit-correct-answer"]:checked');
            correctAnswer = selectedRadio ? selectedRadio.value : '';
        } else {
            correctAnswer = document.getElementById('edit-prob-short-answer').value.trim();
        }
        
        if (!title || !description || !points || !correctAnswer) {
            UI.showError('Խնդրում ենք լրացնել բոլոր պարտադիր դաշտերը, ներառյալ ճիշտ պատասխանը');
            return;
        }

        const competition = API.getCompetitionById(competitionId);
        
        API.updateProblem(problemId, {
            title,
            name: title,
            number,
            competitionId,
            subject: competition ? competition.subject : 'Mathematics',
            type,
            difficulty,
            points,
            description,
            correctAnswer
        });

        this.closeModal();
        UI.showSuccess('Խնդիրը հաջողությամբ թարմացվեց');
        
        // Refresh problems view
        this.navigateTo('problems');
    },

    /**
     * Delete problem
     */
    deleteProblem(problemId) {
        if (confirm('Վստա՞հ եք, որ ցանկանում եք ջնջել այս խնդիրը:')) {
            API.deleteProblem(problemId);
            this.closeModal();
            UI.showSuccess('Խնդիրը հաջողությամբ ջնջվեց');
            this.navigateTo('problems');
        }
    },

    /**
     * Show edit problem modal
     */
    showEditProblemModal(problemId) {
        const modal = document.getElementById('modal-container');
        const modalContent = document.getElementById('modal-content');
        modalContent.innerHTML = UI.renderEditProblemModal(problemId);
        modal.classList.remove('hidden');
        document.querySelector('.modal-backdrop').onclick = () => this.closeModal();
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
     * Հանձնել պատասխանաթերթիկը (Scan) - Process and Verify
     */
    submitAnswerSheetScan() {
        const competitionId = parseInt(document.getElementById('as-comp-id').value);
        const participantId = document.getElementById('as-participant-select').value;
        const fileInput = document.getElementById('file-input');
        
        if (!participantId) {
            UI.showError('Խնդրում ենք ընտրել մասնակցին');
            return;
        }

        if (!fileInput.files.length) {
            UI.showError('Խնդրում ենք ընտրել ֆայլը');
            return;
        }

        const file = fileInput.files[0];
        const reader = new FileReader();

        // Show processing state with spinner
        const modal = document.getElementById('modal-container');
        const modalContent = document.getElementById('modal-content');
        modalContent.innerHTML = `
            <div class="modal-header">
                <h2>Սկանավորում...</h2>
            </div>
            <div class="modal-body" style="text-align: center; padding: 40px;">
                <div style="border: 4px solid #f3f3f3; border-top: 4px solid #3498db; border-radius: 50%; width: 40px; height: 40px; animation: spin 1s linear infinite; margin: 0 auto;"></div>
                <p id="scan-status" style="margin-top: 20px; font-size: 1.1em; color: #666;">Միացնում ենք OCR համակարգը...</p>
            </div>
            <style>@keyframes spin {0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); }}</style>
        `;
        modal.classList.remove('hidden');

        reader.onload = async function(e) {
            const imageData = e.target.result;
            
            try {
                // Get problems for context
                const problems = API.getProblemsByCompetition(competitionId);
                
                // Real OCR/OMR Processing
                // Using Tesseract.js via UI.processSubmissionImage
                const result = await UI.processSubmissionImage(imageData, problems);
                const rawAnswers = result.extractedData;
                const debugInfo = result.debugInfo; // Get debug info for visualization
                
                // Map Question Numbers (from Sheet) to Problem IDs (from Database)
                console.log('[Scan] Raw OCR answers (by question number):', rawAnswers);
                console.log('[Scan] Problems for mapping:', problems.map(p => ({id: p.id, number: p.number})));
                console.log('[Scan] Debug info:', debugInfo);
                
                const detectedAnswers = {};
                const invalidAnswers = {}; // Track invalid (multiple selection) answers
                
                problems.forEach(p => {
                    const qNum = p.number; // e.g. 1, 2... matches sheet numbers
                    if (rawAnswers[qNum] !== undefined) {
                        if (rawAnswers[qNum] === 'INVALID') {
                            invalidAnswers[p.id] = true;
                            detectedAnswers[p.id] = 'INVALID';
                        } else {
                            detectedAnswers[p.id] = String(rawAnswers[qNum]);
                        }
                    }
                });
                
                console.log('[Scan] Mapped answers (by problem ID):', detectedAnswers);
                console.log('[Scan] Invalid answers:', invalidAnswers);
                
                // Store imageData and debugInfo temporarily for the next step
                App.tempImageData = imageData;
                App.tempDebugInfo = debugInfo;
                
                // Open verification modal with invalid answer info
                modalContent.innerHTML = UI.renderScanVerificationModal(competitionId, parseInt(participantId), imageData, detectedAnswers, invalidAnswers);
                
                // Draw debug overlay after modal is rendered
                setTimeout(() => {
                    UI.drawDebugOverlay(debugInfo);
                }, 100);
            } catch (err) {
                console.error("Scan Error:", err);
                modal.classList.add('hidden');
                UI.showError("Error processing image: " + err.message);
            }
        };

        reader.readAsDataURL(file);
    },
    /**
     */
    confirmScanSubmission(competitionId, participantId) {
        console.log('[Submit] Starting submission for competition:', competitionId, 'participant:', participantId);
        
        const problems = API.getProblemsByCompetition(competitionId);
        const finalAnswers = {};
        
        // Collect edited answers
        problems.forEach(p => {
            const el = document.getElementById(`verify-answer-${p.id}`);
            if (el) {
                const val = el.value;
                if (val) finalAnswers[p.id] = val;
            } else {
                console.warn(`[Submit] Input not found for problem ID: ${p.id}`);
            }
        });

        console.log('[Submit] Final answers collected:', finalAnswers);

        const submission = {
            competitionId,
            userId: parseInt(participantId),
            filename: 'scanned_upload.png', // valid placeholder
            timestamp: new Date().toISOString(),
            status: 'pending_review', // Will be set to 'graded' after gradeSubmission
            imageData: App.tempImageData,
            answers: finalAnswers
        };

        try {
            // Just save the submission - grading happens later from grading page
            const savedSubmission = API.uploadAnswerSheet(submission);
            console.log("[Submit] Submission saved with ID:", savedSubmission.id);
            
            this.closeModal();
            UI.showSuccess("Submission saved successfully!");
            
            // Clean up
            App.tempImageData = null;
            
            // Navigate to grading page to see pending submissions
            this.navigateTo("grading");
        } catch (err) {
            console.error("[Submit] Error:", err);
            UI.showError("Error: " + err.message);
        }
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
        UI.showSuccess(`Grading complete! Score: ${result.score}`);
        
        this.navigateTo('results');
    },

    /**
     * Խնդիրների ֆիլտրացիա
     */
    filterProblems() {
        const searchQuery = document.getElementById('problem-search').value.toLowerCase();
        const difficultyFilter = document.getElementById('difficulty-filter').value;
        const subjectFilter = document.getElementById('subject-filter-problems').value;
        const gradeFilter = document.getElementById('grade-filter-problems') ? 
                            document.getElementById('grade-filter-problems').value : 'all';
        
        // Filter individual items
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

        // Hide empty groups or groups not matching grade
        const groups = document.querySelectorAll('.problem-group');
        groups.forEach(group => {
            const visibleItems = Array.from(group.querySelectorAll('.problem-item')).filter(item => item.style.display !== 'none');
            
            const gradesStr = group.getAttribute('data-grades') || '';
            const groupGrades = gradesStr.split(',').filter(g => g).map(g => g.trim());
            const gradeMatch = gradeFilter === 'all' || groupGrades.includes(gradeFilter);

            group.style.display = (visibleItems.length > 0 && gradeMatch) ? 'block' : 'none';
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
        
        const displayName = participant.name || 
            ((participant.firstName || '') + ' ' + (participant.lastName || '')).trim() || 
            'Անհայտ';
        
        modalContent.innerHTML = `
            <div class="modal-header">
                <h2>👤 ${displayName}</h2>
                <button class="modal-close" onclick="App.closeModal()">&times;</button>
            </div>
            <div class="modal-body">
                <p><strong>Էլ. հասցե՝</strong> ${participant.email || '—'}</p>
                <p><strong>Դպրոց՝</strong> ${participant.school || '—'}</p>
                <p><strong>Դասարան՝</strong> ${participant.grade}-րդ դասարան</p>
                <p><strong>Քաղաք/Մարզ՝</strong> ${participant.city || '—'}</p>
                
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
                                        <td>${r.rank || '—'}</td>
                                        <td>${r.score !== undefined ? r.score : (r.totalScore !== undefined ? r.totalScore : '—')}</td>
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

// Global export for browser environment
window.App = App;

// Initialize App when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    App.init();
});
