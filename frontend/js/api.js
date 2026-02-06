/**
 * Base Data Provider Interface
 */
class DataProvider {
    getCompetitions() {}
    getCompetitionById(id) {}
    // ... define other methods ...
}

/**
 * LocalStorage Data Provider
 */
class LocalStorageProvider {
    constructor() {
        this.STORAGE_KEYS = {
            COMPETITIONS: 'olymp_competitions',
            PROBLEMS: 'olymp_problems',
            PARTICIPANTS: 'olymp_participants',
            SCHOOLS: 'olymp_schools',
            RESULTS: 'olymp_results',
            SUBMISSIONS: 'olymp_submissions',
            TEMPLATES: 'olymp_templates',
            CURRENT_USER: 'olymp_current_user'
        };
    }

    init() {
        if (!localStorage.getItem(this.STORAGE_KEYS.COMPETITIONS)) {
            localStorage.setItem(this.STORAGE_KEYS.COMPETITIONS, JSON.stringify(MockData.competitions));
        } else {
            // MERGE: Update competitions with missing fields from MockData
            let storedCompetitions = JSON.parse(localStorage.getItem(this.STORAGE_KEYS.COMPETITIONS));
            let hasChanges = false;
            storedCompetitions.forEach(comp => {
                const mockComp = MockData.competitions.find(mc => mc.id === comp.id);
                if (mockComp) {
                    // Add missing fields from mock data and update localized fields
                    ['startDate', 'duration', 'participants', 'maxParticipants', 'subject', 'status', 'grades'].forEach(field => {
                        if (comp[field] === undefined && mockComp[field] !== undefined) {
                            comp[field] = mockComp[field];
                            hasChanges = true;
                        }
                    });
                    // Always update localized text fields
                    ['name', 'description'].forEach(field => {
                        if (mockComp[field] !== undefined && comp[field] !== mockComp[field]) {
                            comp[field] = mockComp[field];
                            hasChanges = true;
                        }
                    });
                }
            });
            if (hasChanges) {
                localStorage.setItem(this.STORAGE_KEYS.COMPETITIONS, JSON.stringify(storedCompetitions));
            }
        }
        if (!localStorage.getItem(this.STORAGE_KEYS.PROBLEMS)) {
            localStorage.setItem(this.STORAGE_KEYS.PROBLEMS, JSON.stringify(MockData.problems));
        } else {
            // MERGE: Ensure new mock problems are added and existing ones updated
            let storedProblems = JSON.parse(localStorage.getItem(this.STORAGE_KEYS.PROBLEMS));
            let hasChanges = false;
            MockData.problems.forEach(mockProblem => {
                const existing = storedProblems.find(p => p.id === mockProblem.id);
                if (!existing) {
                    storedProblems.push(mockProblem);
                    hasChanges = true;
                } else {
                    // Add missing fields from mock data and update localized fields
                    ['number', 'correctAnswer', 'type', 'difficulty', 'points'].forEach(field => {
                        if (existing[field] === undefined && mockProblem[field] !== undefined) {
                            existing[field] = mockProblem[field];
                            hasChanges = true;
                        }
                    });
                    // Always update localized text fields
                    ['title', 'name', 'description'].forEach(field => {
                        if (mockProblem[field] !== undefined && existing[field] !== mockProblem[field]) {
                            existing[field] = mockProblem[field];
                            hasChanges = true;
                        }
                    });
                }
            });
            if (hasChanges) {
                localStorage.setItem(this.STORAGE_KEYS.PROBLEMS, JSON.stringify(storedProblems));
            }
        }
        if (!localStorage.getItem(this.STORAGE_KEYS.PARTICIPANTS)) {
            localStorage.setItem(this.STORAGE_KEYS.PARTICIPANTS, JSON.stringify(MockData.participants));
        } else {
            // MERGE: Update participants with localized names and schools
            let storedParticipants = JSON.parse(localStorage.getItem(this.STORAGE_KEYS.PARTICIPANTS));
            let hasChanges = false;
            storedParticipants.forEach(p => {
                const mockP = MockData.participants.find(mp => mp.id === p.id);
                if (mockP) {
                    // Update city if missing
                    if (!p.city && mockP.city) {
                        p.city = mockP.city;
                        hasChanges = true;
                    }
                    // Always update localized text fields
                    ['name', 'school'].forEach(field => {
                         if (mockP[field] !== undefined && p[field] !== mockP[field]) {
                             p[field] = mockP[field];
                             hasChanges = true;
                         }
                    });
                }
            });
            if (hasChanges) {
                localStorage.setItem(this.STORAGE_KEYS.PARTICIPANTS, JSON.stringify(storedParticipants));
            }
        }
        if (!localStorage.getItem(this.STORAGE_KEYS.SCHOOLS)) {
            localStorage.setItem(this.STORAGE_KEYS.SCHOOLS, JSON.stringify(MockData.schools));
        }
        if (!localStorage.getItem(this.STORAGE_KEYS.RESULTS)) {
            localStorage.setItem(this.STORAGE_KEYS.RESULTS, JSON.stringify(MockData.results));
        }
        if(!localStorage.getItem(this.STORAGE_KEYS.SUBMISSIONS)) {
             localStorage.setItem(this.STORAGE_KEYS.SUBMISSIONS, JSON.stringify([]));
        }
    }

    resetData() {
        localStorage.setItem(this.STORAGE_KEYS.COMPETITIONS, JSON.stringify(MockData.competitions));
        localStorage.setItem(this.STORAGE_KEYS.PROBLEMS, JSON.stringify(MockData.problems));
        localStorage.setItem(this.STORAGE_KEYS.PARTICIPANTS, JSON.stringify(MockData.participants));
        localStorage.setItem(this.STORAGE_KEYS.SCHOOLS, JSON.stringify(MockData.schools));
        localStorage.setItem(this.STORAGE_KEYS.RESULTS, JSON.stringify(MockData.results));
        localStorage.setItem(this.STORAGE_KEYS.SUBMISSIONS, JSON.stringify([]));
    }

    getCompetitions() {
        try {
            const data = localStorage.getItem(this.STORAGE_KEYS.COMPETITIONS);
            return (data && data !== "undefined") ? JSON.parse(data) : [];
        } catch (e) {
            console.error("Error parsing competitions:", e);
            return [];
        }
    }

    saveCompetitions(competitions) {
        localStorage.setItem(this.STORAGE_KEYS.COMPETITIONS, JSON.stringify(competitions));
    }

    getProblems() {
        const data = localStorage.getItem(this.STORAGE_KEYS.PROBLEMS);
        if (!data || data === "undefined" || data === "null") return [];
        try { return JSON.parse(data); } catch (e) { return []; }
    }

    saveProblems(problems) {
        localStorage.setItem(this.STORAGE_KEYS.PROBLEMS, JSON.stringify(problems));
    }

    getParticipants() {
        const data = localStorage.getItem(this.STORAGE_KEYS.PARTICIPANTS);
        return data ? JSON.parse(data) : [];
    }

    saveParticipants(participants) {
        localStorage.setItem(this.STORAGE_KEYS.PARTICIPANTS, JSON.stringify(participants));
    }

    getSchools() {
        const data = localStorage.getItem(this.STORAGE_KEYS.SCHOOLS);
        let schools = data ? JSON.parse(data) : [];
        
        // Auto-migration: If we find strings instead of objects, reset to new MockData
        if (schools.length > 0 && typeof schools[0] === 'string') {
            console.warn("Detected old school data format (strings), resetting to MockData objects.");
            schools = MockData.schools; // Use the new structure from data.js
            this.saveSchools(schools);
        }
        
        return schools;
    }

    saveSchools(schools) {
        localStorage.setItem(this.STORAGE_KEYS.SCHOOLS, JSON.stringify(schools));
    }

    getResults() {
        const data = localStorage.getItem(this.STORAGE_KEYS.RESULTS);
        return data ? JSON.parse(data) : [];
    }

    saveResults(results) {
        localStorage.setItem(this.STORAGE_KEYS.RESULTS, JSON.stringify(results));
    }

    getSubmissions() {
        const data = localStorage.getItem(this.STORAGE_KEYS.SUBMISSIONS);
        return data ? JSON.parse(data) : [];
    }

    saveSubmissions(submissions) {
        localStorage.setItem(this.STORAGE_KEYS.SUBMISSIONS, JSON.stringify(submissions));
    }

    getTemplates() {
        const data = localStorage.getItem(this.STORAGE_KEYS.TEMPLATES);
        return data ? JSON.parse(data) : null;
    }

    saveTemplates(templates) {
        localStorage.setItem(this.STORAGE_KEYS.TEMPLATES, JSON.stringify(templates));
    }

    getCurrentUser() {
        const data = localStorage.getItem(this.STORAGE_KEYS.CURRENT_USER);
        return data ? JSON.parse(data) : null;
    }

    saveCurrentUser(user) {
        localStorage.setItem(this.STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
    }

    removeCurrentUser() {
        localStorage.removeItem(this.STORAGE_KEYS.CURRENT_USER);
    }
}

// Remove global instance - we will inject it later
// const dataProvider = new LocalStorageProvider();

const API = {
    provider: null,
    STORAGE_KEYS: null, // Will be set from provider

    init(provider) {
        this.provider = provider;
        this.STORAGE_KEYS = provider.STORAGE_KEYS;
        this.provider.init();
    },

    resetData() {
        this.provider.resetData();
    },

    getTemplates() {
        return this.provider.getTemplates();
    },
    
    saveTemplates(templates) {
        this.provider.saveTemplates(templates);
    },

    // ==================== Մրցույթներ ====================
    getCompetitions() {
        return this.provider.getCompetitions();
    },

    getCompetitionById(id) {
        return this.getCompetitions().find(c => c.id === parseInt(id));
    },

    getCompetitionsByStatus(status) {
        return this.getCompetitions().filter(c => c.status === status);
    },

    addCompetition(competition) {
        const competitions = this.getCompetitions();
        competition.id = Math.max(...competitions.map(c => c.id), 0) + 1;
        competitions.push(competition);
        this.provider.saveCompetitions(competitions);
        return competition;
    },

    updateCompetition(id, updates) {
        const competitions = this.getCompetitions();
        const index = competitions.findIndex(c => c.id === parseInt(id));
        if (index !== -1) {
            competitions[index] = { ...competitions[index], ...updates };
            this.provider.saveCompetitions(competitions);
            return competitions[index];
        }
        return null;
    },

    // ==================== Խնդիրներ ====================
    getProblems() {
        return this.provider.getProblems();
    },

    getProblemById(id) {
        return this.getProblems().find(p => p.id === parseInt(id));
    },

    getProblemsByCompetition(competitionId) {
        return this.getProblems()
            .filter(p => p.competitionId === parseInt(competitionId))
            .sort((a, b) => a.number - b.number); // Sort by question number
    },

    getProblemsByDifficulty(difficulty) {
        return this.getProblems().filter(p => p.difficulty === difficulty);
    },

    addProblem(problem) {
        const problems = this.getProblems();
        problem.id = Math.max(...problems.map(p => p.id), 0) + 1;
        problems.push(problem);
        this.provider.saveProblems(problems);
        return problem;
    },

    updateProblem(problemId, updates) {
        const problems = this.getProblems();
        const index = problems.findIndex(p => p.id === parseInt(problemId));
        if (index !== -1) {
            problems[index] = { ...problems[index], ...updates, id: parseInt(problemId) };
            this.provider.saveProblems(problems);
            return problems[index];
        }
        return null;
    },

    deleteProblem(problemId) {
        const problems = this.getProblems();
        const filtered = problems.filter(p => p.id !== parseInt(problemId));
        this.provider.saveProblems(filtered);
        return true;
    },

    // ==================== Participants ====================
    getParticipants() {
        return this.provider.getParticipants();
    },

    getParticipantById(id) {
        return this.getParticipants().find(p => p.id === parseInt(id));
    },

    getParticipantsByCompetition(competitionId) {
        return this.getParticipants().filter(p => 
            (p.registeredCompetitions && p.registeredCompetitions.includes(parseInt(competitionId))) ||
            p.competitionId === parseInt(competitionId)
        );
    },

    getParticipantsBySchool(schoolId) {
        const school = this.getSchoolById(schoolId);
        if (!school) return [];
        return this.getParticipants().filter(p => p.school === school.name);
    },

    addParticipant(participant) {
        const participants = this.getParticipants();
        participant.id = Math.max(...participants.map(p => p.id), 0) + 1;
        participant.registeredCompetitions = participant.registeredCompetitions || [];
        participant.scores = participant.scores || {};
        participants.push(participant);
        this.provider.saveParticipants(participants);
        return participant;
    },

    updateParticipant(id, updates) {
        const participants = this.getParticipants();
        const index = participants.findIndex(p => p.id === parseInt(id));
        if (index !== -1) {
            participants[index] = { ...participants[index], ...updates };
            this.provider.saveParticipants(participants);
            return participants[index];
        }
        return null;
    },

    registerParticipantForCompetition(participantId, competitionId) {
        const participants = this.getParticipants();
        const index = participants.findIndex(p => p.id === parseInt(participantId));
        if (index !== -1) {
            if (!participants[index].registeredCompetitions) {
                participants[index].registeredCompetitions = [];
            }
            if (!participants[index].registeredCompetitions.includes(parseInt(competitionId))) {
                participants[index].registeredCompetitions.push(parseInt(competitionId));
                this.provider.saveParticipants(participants);
            }
            return participants[index];
        }
        return null;
    },

    // ==================== Դպրոցներ ====================
    getSchools() {
        return this.provider.getSchools();
    },

    getSchoolById(id) {
        return this.getSchools().find(s => s.id === parseInt(id));
    },

    getSchoolsByRegion(region) {
        return this.getSchools().filter(s => s.region === region);
    },

    addSchool(school) {
        const schools = this.getSchools();
        school.id = Math.max(...schools.map(s => s.id), 0) + 1;
        school.participantsCount = school.participantsCount || 0;
        school.averageScore = school.averageScore || 0;
        schools.push(school);
        this.provider.saveSchools(schools);
        return school;
    },

    // ==================== Արդյունքներ ====================
    getResults() {
        return this.provider.getResults();
    },

    getResultsByCompetition(competitionId) {
        return this.getResults()
            .filter(r => r.competitionId === parseInt(competitionId))
            .sort((a, b) => a.rank - b.rank);
    },

    getResultsByParticipant(participantId) {
        // We need to calculate rank dynamically by looking at the leaderboard for each competition
        const participantResults = this.getResults().filter(r => r.participantId === parseInt(participantId));
        
        return participantResults.map(result => {
            // Get leaderboard for this competition to find the rank
            // This is slightly inefficient but ensures consistent ranking logic
            const leaderboard = this.getLeaderboard(result.competitionId);
            const leaderboardEntry = leaderboard.find(entry => entry.participantId === parseInt(participantId));
            
            return {
                ...result,
                rank: leaderboardEntry ? leaderboardEntry.rank : (result.rank || '-')
            };
        });
    },

    addResult(result) {
        const results = this.getResults();
        results.push(result);
        this.provider.saveResults(results);
        return result;
    },

    // ==================== Լուծումներ (Submissions) ====================
    getSubmissions() {
        return this.provider.getSubmissions();
    },

    getSubmissionsByProblem(problemId) {
        return this.getSubmissions().filter(s => s.problemId === parseInt(problemId));
    },

    submitAnswerSheet(submission) {
        const submissions = this.getSubmissions();
        submission.id = Date.now();
        submission.timestamp = new Date().toISOString();
        
        let totalScore = 0;
        const problems = this.getProblemsByCompetition(submission.competitionId);
        
        submission.results = {};
        problems.forEach(problem => {
             const userAnswer = submission.answers[problem.id];
             const correctAnswer = problem.correctAnswer;
             let isCorrect = false;
             if (userAnswer && correctAnswer && userAnswer.toString().trim().toLowerCase() === correctAnswer.toString().trim().toLowerCase()) {
                 isCorrect = true;
             }
             const points = isCorrect ? problem.points : 0;
             totalScore += points;
             submission.results[problem.id] = { userAnswer: userAnswer || '', isCorrect, points };
        });
        
        submission.totalScore = totalScore;
        submissions.push(submission);
        this.provider.saveSubmissions(submissions);
        return submission;
    },

    getLeaderboard(competitionId) {
        // Get results and sort by score descending
        const results = this.getResults()
            .filter(r => r.competitionId === parseInt(competitionId))
            .sort((a, b) => (b.score || 0) - (a.score || 0));
            
        const participants = this.getParticipants();
        
        return results.map((r, index) => {
            const participant = participants.find(p => p.id === r.participantId);
            
            // Prefer name from participant record, fallback to stored name in result, fallback to unknown
            let name = 'Անհայտ մասնակից';
            if (participant) {
                name = participant.name || ((participant.firstName || '') + ' ' + (participant.lastName || '')).trim() || name;
            } else if (r.participantName) {
                name = r.participantName;
            }
            
            return {
                ...r,
                participantName: name,
                school: participant ? participant.school : (r.school || 'Անհայտ դպրոց'),
                rank: index + 1 // Assign rank dynamically based on sorted position
            };
        });
    },

    // ==================== Վիճակագրություն ====================
    getStatistics() {
        const competitions = this.getCompetitions();
        const participants = this.getParticipants();
        const schools = this.getSchools();
        const problems = this.getProblems();

        return {
            totalCompetitions: competitions.length,
            activeCompetitions: competitions.filter(c => c.status === 'active').length,
            upcomingCompetitions: competitions.filter(c => c.status === 'upcoming' || c.status === 'registration').length,
            completedCompetitions: competitions.filter(c => c.status === 'completed').length,
            totalParticipants: participants.length,
            totalSchools: schools.length,
            totalProblems: problems.length,
            easyProblems: problems.filter(p => p.difficulty === 'easy').length,
            mediumProblems: problems.filter(p => p.difficulty === 'medium').length,
            hardProblems: problems.filter(p => p.difficulty === 'hard').length
        };
    },

    searchParticipants(query) {
        const participants = this.getParticipants();
        const lowerQuery = query.toLowerCase();
        return participants.filter(p => 
            p.name.toLowerCase().includes(lowerQuery) ||
            p.school.toLowerCase().includes(lowerQuery) ||
            p.city.toLowerCase().includes(lowerQuery)
        );
    },

    searchSchools(query) {
        const schools = this.getSchools();
        const lowerQuery = query.toLowerCase();
        return schools.filter(s => 
            s.name.toLowerCase().includes(lowerQuery) ||
            s.city.toLowerCase().includes(lowerQuery) ||
            s.region.toLowerCase().includes(lowerQuery)
        );
    },

    uploadAnswerSheet(submission) {
        console.log('[API] uploadAnswerSheet called with:', submission);
        const submissions = this.getSubmissions();
        submission.id = Date.now();
        submissions.push(submission);
        this.provider.saveSubmissions(submissions);
        console.log('[API] Submission saved with ID:', submission.id);
        return submission;
    },

    getPendingSubmissions() {
        return this.getSubmissions().filter(s => s.status === 'pending_review');
    },

    getSubmissionById(id) {
        return this.getSubmissions().find(s => s.id === parseInt(id));
    },

    gradeSubmission(id, extractedAnswers) {
        console.log('[API] gradeSubmission called with ID:', id, 'answers:', extractedAnswers);
        console.log('[API] Answer keys (types):', Object.keys(extractedAnswers).map(k => `${k} (${typeof k})`));
        
        const submissions = this.getSubmissions();
        const index = submissions.findIndex(s => s.id === parseInt(id));
        
        if (index === -1) {
            console.error('[API] Submission not found for ID:', id);
            return null;
        }

        const submission = submissions[index];
        const competitionId = submission.competitionId;
        const problems = this.getProblemsByCompetition(competitionId);
        
        console.log('[API] Problems for grading:', problems.map(p => ({id: p.id, idType: typeof p.id, number: p.number, correctAnswer: p.correctAnswer})));
        
        let totalScore = 0;
        const details = [];

        for (const problem of problems) {
            // Try both number and string keys since keys could be either
            let userAnswer = extractedAnswers[problem.id];
            if (userAnswer === undefined) {
                userAnswer = extractedAnswers[String(problem.id)];
            }
            console.log(`[API] Problem ${problem.id}: userAnswer="${userAnswer}", correctAnswer="${problem.correctAnswer}"`);
            
            let isCorrect = false;
            let score = 0;

            if (userAnswer !== undefined && userAnswer !== null && userAnswer !== '') {
                const normUser = String(userAnswer).trim().toLowerCase();
                const normCorrect = String(problem.correctAnswer).trim().toLowerCase();
                console.log(`[API] Comparing: "${normUser}" vs "${normCorrect}"`);
                if (normUser === normCorrect) {
                    isCorrect = true;
                    score = problem.points;
                    console.log(`[API] CORRECT! +${score} points`);
                } else {
                    console.log(`[API] INCORRECT`);
                }
            } else {
                console.log(`[API] No answer provided for problem ${problem.id}`);
            }

            totalScore += score;
            details.push({
                problemId: problem.id,
                userAnswer: userAnswer,
                correctAnswer: problem.correctAnswer,
                isCorrect: isCorrect,
                score: score
            });
        }

        submission.status = 'graded';
        submission.score = totalScore;
        submission.details = details;
        
        submissions[index] = submission;
        this.provider.saveSubmissions(submissions);

        const participant = this.getParticipantById(submission.userId) || {};
        const pName = participant.name || ((participant.firstName || '') + ' ' + (participant.lastName || '')).trim() || "Անհայտ";

        const newResult = {
            competitionId: competitionId,
            participantId: submission.userId,
            participantName: pName,
            school: participant.school || "Unknown",
            score: totalScore,
            rank: 0,
            details: details
        };
        console.log('[API] Adding result:', newResult);
        this.addResult(newResult);
        
        console.log('[API] Grading complete. Total score:', totalScore);
        return submission;
    },

    // ==================== Օգտատեր ====================
    getCurrentUser() {
        return this.provider.getCurrentUser();
    },

    setCurrentUser(user) {
        this.provider.saveCurrentUser(user);
    },

    logout() {
        this.provider.removeCurrentUser();
    },

    // ==================== Static/Reference Data ====================
    getSubjects() {
        return window.DataStore ? window.DataStore.getSubjects() : [];
    },

    getGrades() {
        return window.DataStore ? window.DataStore.getGrades() : [];
    },

    getRegions() {
        return window.DataStore ? window.DataStore.getRegions() : [];
    },

    getTranslations() {
        return window.DataStore ? window.DataStore.getTranslations() : {};
    },

    getFormTemplates() {
        return window.DataStore ? window.DataStore.getFormTemplates() : {};
    },

    setFormTemplate(key, template) {
        if (window.DataStore) {
            window.DataStore.setFormTemplate(key, template);
        }
    }
};

// Initialize API with dependency injection
const storageProvider = new LocalStorageProvider();
API.init(storageProvider);

// Global export for browser environment
window.API = API;