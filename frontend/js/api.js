/**
 * API Client for Olympiad Demo Application
 * Օլիմպիադայի դեմո հավելվածի (localStorage)
 */

const API = {
    // LocalStorage բանալիներ
    STORAGE_KEYS: {
        COMPETITIONS: 'olymp_competitions',
        PROBLEMS: 'olymp_problems',
        PARTICIPANTS: 'olymp_participants',
        SCHOOLS: 'olymp_schools',
        RESULTS: 'olymp_results',
        SUBMISSIONS: 'olymp_submissions',
        CURRENT_USER: 'olymp_current_user'
    },

    /**
     * Հավելվածի սկզբնավորում - Բեռնում է MockData-ն localStorage
     * Force reset data to ensure translations are applied
     */
    init() {
        // Always overwrite with fresh MockData to ensure correct language
        localStorage.setItem(this.STORAGE_KEYS.COMPETITIONS, JSON.stringify(MockData.competitions));
        localStorage.setItem(this.STORAGE_KEYS.PROBLEMS, JSON.stringify(MockData.problems));
        localStorage.setItem(this.STORAGE_KEYS.PARTICIPANTS, JSON.stringify(MockData.participants));
        localStorage.setItem(this.STORAGE_KEYS.SCHOOLS, JSON.stringify(MockData.schools));
        localStorage.setItem(this.STORAGE_KEYS.RESULTS, JSON.stringify(MockData.results));
        
        if(!localStorage.getItem(this.STORAGE_KEYS.SUBMISSIONS)) {
             localStorage.setItem(this.STORAGE_KEYS.SUBMISSIONS, JSON.stringify([]));
        }
    },

    /**
     * Վերականգնել localStorage-ի տվյալները
     */
    resetData() {
        localStorage.setItem(this.STORAGE_KEYS.COMPETITIONS, JSON.stringify(MockData.competitions));
        localStorage.setItem(this.STORAGE_KEYS.PROBLEMS, JSON.stringify(MockData.problems));
        localStorage.setItem(this.STORAGE_KEYS.PARTICIPANTS, JSON.stringify(MockData.participants));
        localStorage.setItem(this.STORAGE_KEYS.SCHOOLS, JSON.stringify(MockData.schools));
        localStorage.setItem(this.STORAGE_KEYS.RESULTS, JSON.stringify(MockData.results));
        localStorage.setItem(this.STORAGE_KEYS.SUBMISSIONS, JSON.stringify([]));
    },

    // ==================== Մրցույթներ ====================

    /**
     * Ստանալ բոլոր մրցույթները
     */
    getCompetitions() {
        const data = localStorage.getItem(this.STORAGE_KEYS.COMPETITIONS);
        try {
            return (data && data !== "undefined") ? JSON.parse(data) : [];
        } catch (e) {
            console.error("Error parsing competitions data:", e);
            return [];
        }
    },

    /**
     * Ստանալ մրցույթը ըստ ID-ի
     */
    getCompetitionById(id) {
        const competitions = this.getCompetitions();
        return competitions.find(c => c.id === parseInt(id));
    },

    /**
     * Ստանալ մրցույթները ըստ կարգավիճակի
     */
    getCompetitionsByStatus(status) {
        const competitions = this.getCompetitions();
        return competitions.filter(c => c.status === status);
    },

    /**
     * Ավելացնել նոր մրցույթ
     */
    addCompetition(competition) {
        const competitions = this.getCompetitions();
        competition.id = Math.max(...competitions.map(c => c.id), 0) + 1;
        competitions.push(competition);
        localStorage.setItem(this.STORAGE_KEYS.COMPETITIONS, JSON.stringify(competitions));
        return competition;
    },

    /**
     * Թարմացնել մրցույթի տվյալները
     */
    updateCompetition(id, updates) {
        const competitions = this.getCompetitions();
        const index = competitions.findIndex(c => c.id === parseInt(id));
        if (index !== -1) {
            competitions[index] = { ...competitions[index], ...updates };
            localStorage.setItem(this.STORAGE_KEYS.COMPETITIONS, JSON.stringify(competitions));
            return competitions[index];
        }
        return null;
    },

    // ==================== Խնդիրներ ====================

    /**
     * Ստանալ բոլոր խնդիրները
     */
    getProblems() {
        const data = localStorage.getItem(this.STORAGE_KEYS.PROBLEMS);
        if (!data || data === "undefined" || data === "null") {
            return [];
        }
        try {
            return JSON.parse(data);
        } catch (e) {
            console.error("Error parsing problems data:", e);
            console.warn("Resetting corrupted problems data.");
            // Optional: Auto-fix by clearing or resetting
            // localStorage.setItem(this.STORAGE_KEYS.PROBLEMS, JSON.stringify(MockData.problems));
            return [];
        }
    },

    /**
     * Ստանալ խնդիրը ըստ ID-ի
     */
    getProblemById(id) {
        const problems = this.getProblems();
        return problems.find(p => p.id === parseInt(id));
    },

    /**
     * Ստանալ մրցույթի խնդիրները
     */
    getProblemsByCompetition(competitionId) {
        const problems = this.getProblems();
        return problems.filter(p => p.competitionId === parseInt(competitionId));
    },

    /**
     * Ստանալ խնդիրները ըստ բարդության
     */
    getProblemsByDifficulty(difficulty) {
        const problems = this.getProblems();
        return problems.filter(p => p.difficulty === difficulty);
    },

    /**
     * Ավելացնել նոր խնդիր
     */
    addProblem(problem) {
        const problems = this.getProblems();
        problem.id = Math.max(...problems.map(p => p.id), 0) + 1;
        problems.push(problem);
        localStorage.setItem(this.STORAGE_KEYS.PROBLEMS, JSON.stringify(problems));
        return problem;
    },

    // ==================== Մասնակիցներ ====================

    /**
     * Ստանալ բոլոր մասնակիցներին
     */
    getParticipants() {
        const data = localStorage.getItem(this.STORAGE_KEYS.PARTICIPANTS);
        return data ? JSON.parse(data) : [];
    },

    /**
     * Ստանալ մասնակցին ըստ ID-ի
     */
    getParticipantById(id) {
        const participants = this.getParticipants();
        return participants.find(p => p.id === parseInt(id));
    },

    /**
     * Ստանալ մրցույթի մասնակիցներին
     */
    getParticipantsByCompetition(competitionId) {
        const participants = this.getParticipants();
        return participants.filter(p => 
            p.registeredCompetitions && p.registeredCompetitions.includes(parseInt(competitionId))
        );
    },

    /**
     * Ստանալ դպրոցի մասնակիցներին
     */
    getParticipantsBySchool(schoolId) {
        const participants = this.getParticipants();
        const school = this.getSchoolById(schoolId);
        if (!school) return [];
        return participants.filter(p => p.school === school.name);
    },

    /**
     * Ավելացնել նոր մասնակից
     */
    addParticipant(participant) {
        const participants = this.getParticipants();
        participant.id = Math.max(...participants.map(p => p.id), 0) + 1;
        participant.registeredCompetitions = participant.registeredCompetitions || [];
        participant.scores = participant.scores || {};
        participants.push(participant);
        localStorage.setItem(this.STORAGE_KEYS.PARTICIPANTS, JSON.stringify(participants));
        return participant;
    },

    /**
     * Թարմացնել մասնակցի տվյալները
     */
    updateParticipant(id, updates) {
        const participants = this.getParticipants();
        const index = participants.findIndex(p => p.id === parseInt(id));
        if (index !== -1) {
            participants[index] = { ...participants[index], ...updates };
            localStorage.setItem(this.STORAGE_KEYS.PARTICIPANTS, JSON.stringify(participants));
            return participants[index];
        }
        return null;
    },

    /**
     * Գրանցել մասնակցին մրցույթին
     */
    registerParticipantForCompetition(participantId, competitionId) {
        const participants = this.getParticipants();
        const index = participants.findIndex(p => p.id === parseInt(participantId));
        if (index !== -1) {
            if (!participants[index].registeredCompetitions) {
                participants[index].registeredCompetitions = [];
            }
            if (!participants[index].registeredCompetitions.includes(parseInt(competitionId))) {
                participants[index].registeredCompetitions.push(parseInt(competitionId));
                localStorage.setItem(this.STORAGE_KEYS.PARTICIPANTS, JSON.stringify(participants));
            }
            return participants[index];
        }
        return null;
    },

    // ==================== Դպրոցներ ====================

    /**
     * Ստանալ բոլոր դպրոցները
     */
    getSchools() {
        const data = localStorage.getItem(this.STORAGE_KEYS.SCHOOLS);
        return data ? JSON.parse(data) : [];
    },

    /**
     * Ստանալ դպրոցը ըստ ID-ի
     */
    getSchoolById(id) {
        const schools = this.getSchools();
        return schools.find(s => s.id === parseInt(id));
    },

    /**
     * Ստանալ դպրոցները ըստ մարզի
     */
    getSchoolsByRegion(region) {
        const schools = this.getSchools();
        return schools.filter(s => s.region === region);
    },

    /**
     * Ավելացնել նոր դպրոց
     */
    addSchool(school) {
        const schools = this.getSchools();
        school.id = Math.max(...schools.map(s => s.id), 0) + 1;
        school.participantsCount = school.participantsCount || 0;
        school.averageScore = school.averageScore || 0;
        schools.push(school);
        localStorage.setItem(this.STORAGE_KEYS.SCHOOLS, JSON.stringify(schools));
        return school;
    },

    // ==================== Արդյունքներ ====================

    /**
     * Ստանալ բոլոր արդյունքները
     */
    getResults() {
        const data = localStorage.getItem(this.STORAGE_KEYS.RESULTS);
        return data ? JSON.parse(data) : [];
    },

    /**
     * Ստանալ մրցույթի արդյունքները
     */
    getResultsByCompetition(competitionId) {
        const results = this.getResults();
        return results
            .filter(r => r.competitionId === parseInt(competitionId))
            .sort((a, b) => a.rank - b.rank);
    },

    /**
     * Ստանալ մասնակցի արդյունքները
     */
    getResultsByParticipant(participantId) {
        const results = this.getResults();
        return results.filter(r => r.participantId === parseInt(participantId));
    },

    /**
     * Ավելացնել արդյունք
     */
    addResult(result) {
        const results = this.getResults();
        results.push(result);
        localStorage.setItem(this.STORAGE_KEYS.RESULTS, JSON.stringify(results));
        return result;
    },

    // ==================== Լուծումներ (Submissions) ====================

    /**
     * Ստանալ բոլոր լուծումները
     */
    getSubmissions() {
        const data = localStorage.getItem('olymp_submissions');
        return data ? JSON.parse(data) : [];
    },

    /**
     * Ստանալ խնդրի լուծումները
     */
    getSubmissionsByProblem(problemId) {
        const submissions = this.getSubmissions();
        return submissions.filter(s => s.problemId === parseInt(problemId));
    },

    /**
     * Ուղարկել պատասխանաթերթիկը
     */
    submitAnswerSheet(submission) {
        // submission = { competitionId, participantId, answers: { problemId: "answer" } }
        const submissions = this.getSubmissions();
        submission.id = Date.now();
        submission.timestamp = new Date().toISOString();
        
        let totalScore = 0;
        const problems = this.getProblemsByCompetition(submission.competitionId);
        
        // Grading logic (Mock)
        submission.results = {};
        problems.forEach(problem => {
             const userAnswer = submission.answers[problem.id];
             const correctAnswer = problem.correctAnswer;
             
             // Simple comparison logic
             let isCorrect = false;
             if (userAnswer && correctAnswer && userAnswer.toString().trim().toLowerCase() === correctAnswer.toString().trim().toLowerCase()) {
                 isCorrect = true;
             }
             
             const points = isCorrect ? problem.points : 0;
             totalScore += points;
             
             submission.results[problem.id] = {
                 userAnswer: userAnswer || '',
                 isCorrect,
                 points
             };
        });
        
        submission.totalScore = totalScore;
        
        submissions.push(submission);
        localStorage.setItem('olymp_submissions', JSON.stringify(submissions));
        return submission;
    },

    /**
     * Ստանալ առաջատարների աղյուսակը
     */
    getLeaderboard(competitionId) {
        const results = this.getResultsByCompetition(competitionId);
        const participants = this.getParticipants();
        
        return results.map(r => {
            const participant = participants.find(p => p.id === r.participantId);
            return {
                ...r,
                participantName: participant ? participant.name : 'Անհայտ մասնակից',
                school: participant ? participant.school : 'Անհայտ դպրոց'
            };
        });
    },

    // ==================== Վիճակագրություն ====================

    /**
     * Ստանալ ընդհանուր վիճակագրությունը
     */
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

    /**
     * Փնտրել մասնակիցներին
     */
    searchParticipants(query) {
        const participants = this.getParticipants();
        const lowerQuery = query.toLowerCase();
        return participants.filter(p => 
            p.name.toLowerCase().includes(lowerQuery) ||
            p.school.toLowerCase().includes(lowerQuery) ||
            p.city.toLowerCase().includes(lowerQuery)
        );
    },

    /**
     * Փնտրել դպրոցները
     */
    searchSchools(query) {
        const schools = this.getSchools();
        const lowerQuery = query.toLowerCase();
        return schools.filter(s => 
            s.name.toLowerCase().includes(lowerQuery) ||
            s.city.toLowerCase().includes(lowerQuery) ||
            s.region.toLowerCase().includes(lowerQuery)
        );
    },

    /**
     * Submit answer sheet (scan)
     */
    uploadAnswerSheet(submission) {
        const submissions = JSON.parse(localStorage.getItem(this.STORAGE_KEYS.SUBMISSIONS) || '[]');
        submission.id = Date.now();
        submissions.push(submission);
        localStorage.setItem(this.STORAGE_KEYS.SUBMISSIONS, JSON.stringify(submissions));
        return submission;
    },

    /**
     * Get pending submissions
     */
    getPendingSubmissions() {
        const submissions = JSON.parse(localStorage.getItem(this.STORAGE_KEYS.SUBMISSIONS) || '[]');
        return submissions.filter(s => s.status === 'pending_review');
    },

    /**
     * Get submission by ID
     */
    getSubmissionById(id) {
        const submissions = JSON.parse(localStorage.getItem(this.STORAGE_KEYS.SUBMISSIONS) || '[]');
        return submissions.find(s => s.id === parseInt(id));
    },

    /**
     * Grade a submission (Mock OMR)
     */
    gradeSubmission(id, extractedAnswers) {
        const submissions = JSON.parse(localStorage.getItem(this.STORAGE_KEYS.SUBMISSIONS) || '[]');
        const index = submissions.findIndex(s => s.id === parseInt(id));
        
        if (index === -1) return null;

        const submission = submissions[index];
        const competitionId = submission.competitionId;
        const problems = this.getProblemsByCompetition(competitionId);
        
        let totalScore = 0;
        const details = [];

        // Grading logic similar to the previous text-based one
        for (const problem of problems) {
            const userAnswer = extractedAnswers[problem.id]; // 1 or "1" or "text"
            let isCorrect = false;
            let score = 0;

            if (userAnswer) {
                // Normalize for comparison
                const normUser = String(userAnswer).trim().toLowerCase();
                const normCorrect = String(problem.correctAnswer).trim().toLowerCase();
                
                if (normUser === normCorrect) {
                    isCorrect = true;
                    score = problem.points;
                }
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

        // Update submission
        submission.status = 'graded';
        submission.score = totalScore;
        submission.details = details;
        
        // Save back
        submissions[index] = submission;
        localStorage.setItem(this.STORAGE_KEYS.SUBMISSIONS, JSON.stringify(submissions));

        // Create a result entry for the Leaderboard
        this.addResult({
            competitionId: competitionId,
            participantId: submission.userId,
            participantName: "Օգտատեր (Demo)", // Mock name
            school: "Demo School",
            score: totalScore,
            rank: 0, // Will be calculated dynamically usually
            details: details
        });

        return submission;
    },


    // ==================== Օգտատեր ====================

    /**
     * Ստանալ ընթացիկ օգտատիրոջը
     */
    getCurrentUser() {
        const data = localStorage.getItem(this.STORAGE_KEYS.CURRENT_USER);
        return data ? JSON.parse(data) : null;
    },

    /**
     * Սահմանել ընթացիկ օգտատիրոջը (մուտք գործել)
     */
    setCurrentUser(user) {
        localStorage.setItem(this.STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
    },

    /**
     * Դուրս գալ
     */
    logout() {
        localStorage.removeItem(this.STORAGE_KEYS.CURRENT_USER);
    }
};

// Սկզբնավորել API-ն
API.init();