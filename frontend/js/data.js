/**
 * Data Store for Olympiad Application
 */

class DataStore {
    constructor() {
        this.data = {
            subjects: [
                { name: 'Մաթեմատիկա', icon: '📐' },
                { name: 'Ֆիզիկա', icon: '🔬' },
                { name: 'Քիմիա', icon: '⚗️' },
                { name: 'Կենսաբանություն', icon: '🧬' },
                { name: 'Ինֆորմատիկա', icon: '💻' }
            ],
            grades: [
                { value: 8, label: '8-րդ դասարան' },
                { value: 9, label: '9-րդ դասարան' },
                { value: 10, label: '10-րդ դասարան' },
                { value: 11, label: '11-րդ դասարան' },
                { value: 12, label: '12-րդ դասարան' }
            ],
            regions: [
                'Երևան',
                'Շիրակ',
                'Լոռի',
                'Գյումրի',
                'Վանաձոր'
            ],
            translations: {
                // Armenian translations
                'home': 'Գլխավոր',
                'competitions': 'Մրցույթներ',
                'problems': 'Խնդիրներ',
                'participants': 'Մասնակիցներ',
                'results': 'Արդյունքներ',
                'schools': 'Դպրոցներ',
                'about': 'Մեր մասին',
                'editor': 'Խմբագրիչ',
                'grading': 'Գնահատում'
            },
            formTemplates: {
                'default': {
                    name: 'Standard Olympiad',
                    subject: 'math',
                    pageSize: 'A4',
                    sections: [
                        {
                            type: 'header',
                            region: { x: 0.05, y: 0.02, width: 0.9, height: 0.08 }
                        },
                        {
                            type: 'participant_info',
                            region: { x: 0.05, y: 0.10, width: 0.9, height: 0.12 }
                        },
                        {
                            type: 'multiple_choice',
                            region: { x: 0.165, y: 0.585, width: 0.25, height: 0.30 },
                            questions: { start: 1, end: 10 },
                            options: 4,
                            grid: { rows: 10, columns: 4, cellPadding: 0.15 }
                        },
                        {
                            type: 'open_answer',
                            region: { x: 0.57, y: 0.545, width: 0.30, height: 0.275 },
                            questions: { start: 11, end: 15 }
                        }
                    ],
                    optionLabels: ['A', 'B', 'C', 'D', 'E']
                }
            }
        };
    }

    // Getters for static data
    getSubjects() {
        return this.data.subjects;
    }

    getGrades() {
        return this.data.grades;
    }

    getRegions() {
        return this.data.regions;
    }

    getTranslations() {
        return this.data.translations;
    }

    // Form templates management
    getFormTemplates() {
        return this.data.formTemplates;
    }

    setFormTemplate(key, template) {
        this.data.formTemplates[key] = template;
    }

    getFormTemplate(key) {
        return this.data.formTemplates[key];
    }
}

// Create singleton instance
const dataStore = new DataStore();

// Legacy MockData for backward compatibility (will be removed)
const MockData = {
    subjects: dataStore.getSubjects(),
    grades: dataStore.getGrades(),
    regions: dataStore.getRegions(),
    translations: dataStore.getTranslations(),
    formTemplates: dataStore.getFormTemplates(),

    // Legacy data for initialization
    schools: [
        {
            id: 1,
            name: "Երևանի Ֆիզմաթ դպրոց",
            city: "Երևան",
            region: "Երևան",
            phone: "+374 10 264585",
            email: "physmath@example.com",
            participantsCount: 45,
            averageScore: 88.5
        },
        {
            id: 2,
            name: "Երևանի Քվանտ վարժարան",
            city: "Երևան",
            region: "Երևան",
            phone: "+374 10 274433",
            email: "quant@example.com",
            participantsCount: 32,
            averageScore: 85.2
        },
        {
            id: 3,
            name: "Շիրակացու ճեմարան",
            city: "Երևան",
            region: "Երևան",
            phone: "+374 10 440263",
            email: "shirakatsy@example.com",
            participantsCount: 28,
            averageScore: 84.0
        },
        {
            id: 4,
            name: "Այբ դպրոց",
            city: "Երևան",
            region: "Երևան",
            phone: "+374 10 523631",
            email: "ayb@example.com",
            participantsCount: 30,
            averageScore: 86.5
        },
        {
            id: 5,
            name: "Երևանի թիվ 29 դպրոց",
            city: "Երևան",
            region: "Երևան",
            phone: "+374 10 292929",
            email: "school29@example.com",
            participantsCount: 15,
            averageScore: 78.4
        },
        {
            id: 6,
            name: "Գյումրու Ֆոտոն վարժարան",
            city: "Գյումրի",
            region: "Շիրակ",
            phone: "+374 312 34567",
            email: "photon@example.com",
            participantsCount: 20,
            averageScore: 82.1
        },
        {
            id: 7,
            name: "Վանաձորի Էվրիկա դպրոց",
            city: "Վանաձոր",
            region: "Լոռի",
            phone: "+374 322 12345",
            email: "evrika@example.com",
            participantsCount: 18,
            averageScore: 80.5
        },
        {
            id: 8,
            name: "ՀԱՊՀ Ավագ դպրոց",
            city: "Երևան",
            region: "Երևան",
            phone: "+374 10 555555",
            email: "polytech@example.com",
            participantsCount: 12,
            averageScore: 79.8
        },
        {
            id: 9,
            name: "ԵՊՀ Առընթեր դպրոց",
            city: "Երևան",
            region: "Երևան",
            phone: "+374 10 666666",
            email: "ysu_school@example.com",
        }
    ],
    competitions: [
        {
            id: 1,
            name: "Mathematics Olympiad 2023",
            description: "National mathematics competition for high school students",
            date: "2023-04-05",
            startDate: "2023-04-05",
            duration: 120,
            participants: 100,
            maxParticipants: 150,
            subject: "math",
            status: "active",
            grades: [9, 10, 11, 12],
            participantsCount: 100,
            averageScore: 85.3
        },
        {
            id: 2,
            name: "Physics Challenge 2023",
            description: "National physics competition for high school students",
            date: "2023-04-06",
            startDate: "2023-04-06",
            duration: 120,
            participants: 95,
            maxParticipants: 150,
            subject: "physics",
            status: "upcoming",
            grades: [10, 11, 12],
            participantsCount: 95,
            averageScore: 83.7
        },
        {
            id: 3,
            name: "Chemistry Contest 2023",
            description: "National chemistry competition for high school students",
            date: "2023-04-07",
            startDate: "2023-04-07",
            duration: 90,
            participants: 90,
            maxParticipants: 120,
            subject: "chemistry",
            status: "active",
            grades: [10, 11, 12],
            participantsCount: 90,
            averageScore: 82.4
        },
        {
            id: 4,
            name: "Biology Olympiad 2023",
            description: "National biology competition for high school students",
            date: "2023-04-08",
            startDate: "2023-04-08",
            duration: 90,
            participants: 85,
            maxParticipants: 100,
            subject: "biology",
            status: "completed",
            grades: [9, 10, 11],
            participantsCount: 85,
            averageScore: 81.2
        },
        {
            id: 5,
            name: "Informatics Olympiad 2023",
            description: "National informatics competition for high school students",
            date: "2023-04-09",
            startDate: "2023-04-09",
            duration: 180,
            participants: 80,
            maxParticipants: 100,
            subject: "informatics",
            status: "completed",
            grades: [10, 11, 12],
            participantsCount: 80,
            averageScore: 80.1
        }
    ],
    problems: [
        // Math Olympiad - MCQ (questions 1-10)
        {
            id: 1, number: 1, competitionId: 1,
            title: "Quadratic Equations", name: "Quadratic Equations",
            difficulty: "easy", points: 5,
            description: "Solve the following quadratic equation",
            type: "multiple_choice", correctAnswer: "2"
        },
        {
            id: 2, number: 2, competitionId: 1,
            title: "Number Theory", name: "Number Theory",
            difficulty: "easy", points: 5,
            description: "Find all prime factors of the given number",
            type: "multiple_choice", correctAnswer: "3"
        },
        {
            id: 3, number: 3, competitionId: 1,
            title: "Arithmetic Sequences", name: "Arithmetic Sequences",
            difficulty: "easy", points: 5,
            description: "Find the nth term of the arithmetic sequence",
            type: "multiple_choice", correctAnswer: "1"
        },
        {
            id: 4, number: 4, competitionId: 1,
            title: "Probability", name: "Probability",
            difficulty: "easy", points: 5,
            description: "Calculate the probability of the given event",
            type: "multiple_choice", correctAnswer: "4"
        },
        {
            id: 5, number: 5, competitionId: 1,
            title: "Logarithms", name: "Logarithms",
            difficulty: "medium", points: 5,
            description: "Simplify the logarithmic expression",
            type: "multiple_choice", correctAnswer: "2"
        },
        {
            id: 6, number: 6, competitionId: 1,
            title: "Trigonometry", name: "Trigonometry",
            difficulty: "medium", points: 5,
            description: "Find the value of the trigonometric expression",
            type: "multiple_choice", correctAnswer: "3"
        },
        {
            id: 7, number: 7, competitionId: 1,
            title: "Polynomials", name: "Polynomials",
            difficulty: "medium", points: 5,
            description: "Factor the given polynomial",
            type: "multiple_choice", correctAnswer: "1"
        },
        {
            id: 8, number: 8, competitionId: 1,
            title: "Inequalities", name: "Inequalities",
            difficulty: "medium", points: 5,
            description: "Solve the system of inequalities",
            type: "multiple_choice", correctAnswer: "4"
        },
        {
            id: 9, number: 9, competitionId: 1,
            title: "Functions", name: "Functions",
            difficulty: "hard", points: 5,
            description: "Find the domain and range of the composite function",
            type: "multiple_choice", correctAnswer: "2"
        },
        {
            id: 10, number: 10, competitionId: 1,
            title: "Matrices", name: "Matrices",
            difficulty: "hard", points: 5,
            description: "Compute the determinant of the given matrix",
            type: "multiple_choice", correctAnswer: "3"
        },
        // Math Olympiad - Short Answer (questions 11-15)
        {
            id: 11, number: 11, competitionId: 1,
            title: "Geometry Problem", name: "Geometry Problem",
            difficulty: "medium", points: 10,
            description: "Calculate the area of the given geometric figure",
            type: "short_answer", correctAnswer: "42"
        },
        {
            id: 12, number: 12, competitionId: 1,
            title: "Combinatorics", name: "Combinatorics",
            difficulty: "hard", points: 10,
            description: "How many ways can you arrange the objects?",
            type: "short_answer", correctAnswer: "120"
        },
        {
            id: 13, number: 13, competitionId: 1,
            title: "Diophantine Equation", name: "Diophantine Equation",
            difficulty: "hard", points: 10,
            description: "Find the integer solution to the equation",
            type: "short_answer", correctAnswer: "7"
        },
        {
            id: 14, number: 14, competitionId: 1,
            title: "Sequence Sum", name: "Sequence Sum",
            difficulty: "hard", points: 10,
            description: "Find the sum of the first n terms of the series",
            type: "short_answer", correctAnswer: "256"
        },
        {
            id: 15, number: 15, competitionId: 1,
            title: "Modular Arithmetic", name: "Modular Arithmetic",
            difficulty: "hard", points: 10,
            description: "Find the remainder when dividing",
            type: "short_answer", correctAnswer: "3"
        },
        // Physics Challenge problems
        {
            id: 16, number: 1, competitionId: 2,
            title: "Newton's Laws", name: "Newton's Laws",
            difficulty: "easy", points: 10,
            description: "Apply Newton's laws to solve mechanics problems",
            type: "multiple_choice", correctAnswer: "2"
        },
        {
            id: 17, number: 2, competitionId: 2,
            title: "Thermodynamics", name: "Thermodynamics",
            difficulty: "medium", points: 15,
            description: "Calculate heat transfer in the given system",
            type: "multiple_choice", correctAnswer: "1"
        }
    ],
    participants: [
        {
            id: 1,
            competitionId: 1,
            name: "Anna Smith",
            school: "Yerevan Physics-Math School",
            grade: 10,
            score: 95
        },
        {
            id: 2,
            competitionId: 1,
            name: "David Johnson",
            school: "Gyumri School #3",
            grade: 11,
            score: 92
        },
        {
            id: 3,
            competitionId: 1,
            name: "Maria Garcia",
            school: "Vanadzor High School",
            grade: 10,
            score: 88
        },
        {
            id: 4,
            competitionId: 1,
            name: "Alex Brown",
            school: "Yerevan State University School",
            grade: 12,
            score: 85
        },
        {
            id: 5,
            competitionId: 1,
            name: "Sarah Wilson",
            school: "Yerevan Physics-Math School",
            grade: 11,
            score: 82
        },
        {
            id: 6,
            competitionId: 2,
            name: "Michael Lee",
            school: "Gyumri School #3",
            grade: 10,
            score: 90
        },
        {
            id: 7,
            competitionId: 2,
            name: "Emily Davis",
            school: "Yerevan Physics-Math School",
            grade: 11,
            score: 87
        }
    ],
    results: [
        {
            id: 1,
            name: "Արմենտ Արմենտյան",
            school: "Երևանի Ֆիզմաթ դպրոց",
            subject: "Մաթեմատիկա",
            score: 95
        },
        {
            id: 2,
            name: "Արմենտ Արմենտյան",
            school: "Երևանի Ֆիզմաթ դպրոց",
            subject: "Ֆիզիկա",
            score: 90
        },
        {
            id: 3,
            name: "Արմենտ Արմենտյան",
            school: "Երևանի Ֆիզմաթ դպրոց",
            subject: "Քիմիա",
            score: 85
        },
        {
            id: 4,
            name: "Արմենտ Արմենտյան",
            school: "Երևանի Ֆիզմաթ դպրոց",
            subject: "Կենսաբանություն",
            score: 80
        },
        {
            id: 5,
            name: "Արմենտ Արմենտյան",
            school: "Երևանի Ֆիզմաթ դպրոց",
            subject: "Ինֆորմատիկա",
            score: 75
        }
    ]
};

// Global exports for browser environment
window.DataStore = dataStore;
window.MockData = MockData;
