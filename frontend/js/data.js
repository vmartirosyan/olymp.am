/**
 * Data Store for Olympiad Application
 */

class DataStore {
    constructor() {
        this.data = {
            subjects: [
                { id: 'math', name: 'Մաթեմատիկա', icon: '📐' },
                { id: 'physics', name: 'Ֆիզիկա', icon: '🔬' },
                { id: 'chemistry', name: 'Քիմիա', icon: '⚗️' },
                { id: 'biology', name: 'Կենսաբանություն', icon: '🧬' },
                { id: 'informatics', name: 'Ինֆորմատիկա', icon: '💻' }
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
            roles: {
                guest: { id: 'guest', name: 'Հյուր' },
                admin: { id: 'admin', name: 'Ադմինիստրատոր' },
                school_operator: { id: 'school_operator', name: 'Դպրոցի օպերատոր' },
                committee_member: { id: 'committee_member', name: 'Հանձնաժողովի անդամ' }
            },
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

    getRoles() {
        return this.data.roles;
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
            name: "Մաթեմատիկայի օլիմպիադա 2023",
            description: "Հանրապետական մաթեմատիկայի օլիմպիադա ավագ դպրոցի աշակերտների համար",
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
            name: "Ֆիզիկայի մրցույթ 2023",
            description: "Հանրապետական ֆիզիկայի մրցույթ ավագ դպրոցի աշակերտների համար",
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
            name: "Քիմիայի մրցույթ 2023",
            description: "Հանրապետական քիմիայի մրցույթ ավագ դպրոցի աշակերտների համար",
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
            name: "Կենսաբանության օլիմպիադա 2023",
            description: "Հանրապետական կենսաբանության օլիմպիադա ավագ դպրոցի աշակերտների համար",
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
            name: "Ինֆորմատիկայի օլիմպիադա 2023",
            description: "Հանրապետական ինֆորմատիկայի օլիմպիադա ավագ դպրոցի աշակերտների համար",
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
            title: "Քառակուսային հավասարումներ", name: "Քառակուսային հավասարումներ",
            difficulty: "easy", points: 5,
            description: "Լուծեք տրված քառակուսային հավասարումը",
            type: "multiple_choice", correctAnswer: "2"
        },
        {
            id: 2, number: 2, competitionId: 1,
            title: "Թվերի տեսություն", name: "Թվերի տեսություն",
            difficulty: "easy", points: 5,
            description: "Գտեք տրված թվի բոլոր պարզ արտադրիչները",
            type: "multiple_choice", correctAnswer: "3"
        },
        {
            id: 3, number: 3, competitionId: 1,
            title: "Թվաբանական պրոգրեսիաներ", name: "Թվաբանական պրոգրեսիաներ",
            difficulty: "easy", points: 5,
            description: "Գտեք թվաբանական պրոգրեսիայի n-րդ անդամը",
            type: "multiple_choice", correctAnswer: "1"
        },
        {
            id: 4, number: 4, competitionId: 1,
            title: "Հավանականություն", name: "Հավանականություն",
            difficulty: "easy", points: 5,
            description: "Հաշվեք տրված պատահարի հավանականությունը",
            type: "multiple_choice", correctAnswer: "4"
        },
        {
            id: 5, number: 5, competitionId: 1,
            title: "Լոգարիթմներ", name: "Լոգարիթմներ",
            difficulty: "medium", points: 5,
            description: "Պարզեցրեք լոգարիթմական արտահայտությունը",
            type: "multiple_choice", correctAnswer: "2"
        },
        {
            id: 6, number: 6, competitionId: 1,
            title: "Եռանկյունաչափություն", name: "Եռանկյունաչափություն",
            difficulty: "medium", points: 5,
            description: "Գտեք եռանկյունաչափական արտահայտության արժեքը",
            type: "multiple_choice", correctAnswer: "3"
        },
        {
            id: 7, number: 7, competitionId: 1,
            title: "Բազմանդամներ", name: "Բազմանդամներ",
            difficulty: "medium", points: 5,
            description: "Վերլուծեք բազմանդամը արտադրիչների",
            type: "multiple_choice", correctAnswer: "1"
        },
        {
            id: 8, number: 8, competitionId: 1,
            title: "Անհավասարումներ", name: "Անհավասարումներ",
            difficulty: "medium", points: 5,
            description: "Լուծեք անհավասարումների համակարգը",
            type: "multiple_choice", correctAnswer: "4"
        },
        {
            id: 9, number: 9, competitionId: 1,
            title: "Ֆունկցիաներ", name: "Ֆունկցիաներ",
            difficulty: "hard", points: 5,
            description: "Գտեք բարդ ֆունկցիայի որոշման և արժեքների տիրույթները",
            type: "multiple_choice", correctAnswer: "2"
        },
        {
            id: 10, number: 10, competitionId: 1,
            title: "Մատրիցներ", name: "Մատրիցներ",
            difficulty: "hard", points: 5,
            description: "Հաշվեք տրված մատրիցի որոշիչը",
            type: "multiple_choice", correctAnswer: "3"
        },
        // Math Olympiad - Short Answer (questions 11-15)
        {
            id: 11, number: 11, competitionId: 1,
            title: "Երկրաչափական խնդիր", name: "Երկրաչափական խնդիր",
            difficulty: "medium", points: 10,
            description: "Հաշվեք տրված երկրաչափական պատկերի մակերեսը",
            type: "short_answer", correctAnswer: "42"
        },
        {
            id: 12, number: 12, competitionId: 1,
            title: "Կոմբինատորիկա", name: "Կոմբինատորիկա",
            difficulty: "hard", points: 10,
            description: "Քանի՞ եղանակով կարելի է դասավորել օբյեկտները",
            type: "short_answer", correctAnswer: "120"
        },
        {
            id: 13, number: 13, competitionId: 1,
            title: "Դիոֆանտյան հավասարում", name: "Դիոֆանտյան հավասարում",
            difficulty: "hard", points: 10,
            description: "Գտեք հավասարման ամբողջ լուծումը",
            type: "short_answer", correctAnswer: "7"
        },
        {
            id: 14, number: 14, competitionId: 1,
            title: "Հաջորդականության գումար", name: "Հաջորդականության գումար",
            difficulty: "hard", points: 10,
            description: "Գտեք շարքի առաջին n անդամների գումարը",
            type: "short_answer", correctAnswer: "256"
        },
        {
            id: 15, number: 15, competitionId: 1,
            title: "Մոդուլային թվաբանություն", name: "Մոդուլային թվաբանություն",
            difficulty: "hard", points: 10,
            description: "Գտեք բաժանման մնացորդը",
            type: "short_answer", correctAnswer: "3"
        },
        // Physics Challenge problems
        {
            id: 16, number: 1, competitionId: 2,
            title: "Նյուտոնի օրենքներ", name: "Նյուտոնի օրենքներ",
            difficulty: "easy", points: 10,
            description: "Կիրառեք Նյուտոնի օրենքները մեխանիկայի խնդիրները լուծելու համար",
            type: "multiple_choice", correctAnswer: "2"
        },
        {
            id: 17, number: 2, competitionId: 2,
            title: "Ջերմադինամիկա", name: "Ջերմադինամիկա",
            difficulty: "medium", points: 15,
            description: "Հաշվեք ջերմության փոխանցումը տրված համակարգում",
            type: "multiple_choice", correctAnswer: "1"
        }
    ],
    participants: [
        {
            id: 1,
            competitionId: 1,
            name: "Անահիտ Գրիգորյան",
            school: "Երևանի Ֆիզմաթ դպրոց",
            grade: 10,
            score: 95
        },
        {
            id: 2,
            competitionId: 1,
            name: "Դավիթ Սարգսյան",
            school: "Գյումրու թիվ 3 դպրոց",
            grade: 11,
            score: 92
        },
        {
            id: 3,
            competitionId: 1,
            name: "Մարիամ Հովհաննիսյան",
            school: "Վանաձորի ավագ դպրոց",
            grade: 10,
            score: 88
        },
        {
            id: 4,
            competitionId: 1,
            name: "Ալեքսան Պետրոսյան",
            school: "ԵՊՀ Առընթեր դպրոց",
            grade: 12,
            score: 85
        },
        {
            id: 5,
            competitionId: 1,
            name: "Սոնա Խաչատրյան",
            school: "Երևանի Ֆիզմաթ դպրոց",
            grade: 11,
            score: 82
        },
        {
            id: 6,
            competitionId: 2,
            name: "Միքայել Հարությունյան",
            school: "Գյումրու թիվ 3 դպրոց",
            grade: 10,
            score: 90
        },
        {
            id: 7,
            competitionId: 2,
            name: "Էլեն Ավետիսյան",
            school: "Երևանի Ֆիզմաթ դպրոց",
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
