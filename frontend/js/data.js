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
        // Mathematics 2023 Group
        {
            id: 109,
            groupName: "Մաթեմատիկայի օլիմպիադա 2023",
            name: "Մաթեմատիկա - 9-րդ դասարան",
            description: "Մաթեմատիկայի օլիմպիադա 9-րդ դասարանցիների համար",
            date: "2023-04-05",
            startDate: "2023-04-05",
            duration: 120,
            participants: 25,
            maxParticipants: 50,
            subject: "math",
            status: "active",
            grades: [9]
        },
        {
            id: 110,
            groupName: "Մաթեմատիկայի օլիմպիադա 2023",
            name: "Մաթեմատիկա - 10-րդ դասարան",
            description: "Մաթեմատիկայի օլիմպիադա 10-րդ դասարանցիների համար",
            date: "2023-04-05",
            startDate: "2023-04-05",
            duration: 120,
            participants: 30,
            maxParticipants: 50,
            subject: "math",
            status: "active",
            grades: [10]
        },
        {
            id: 111,
            groupName: "Մաթեմատիկայի օլիմպիադա 2023",
            name: "Մաթեմատիկա - 11-րդ դասարան",
            description: "Մաթեմատիկայի օլիմպիադա 11-րդ դասարանցիների համար",
            date: "2023-04-05",
            startDate: "2023-04-05",
            duration: 120,
            participants: 20,
            maxParticipants: 50,
            subject: "math",
            status: "active",
            grades: [11]
        },
        {
            id: 112,
            groupName: "Մաթեմատիկայի օլիմպիադա 2023",
            name: "Մաթեմատիկա - 12-րդ դասարան",
            description: "Մաթեմատիկայի օլիմպիադա 12-րդ դասարանցիների համար",
            date: "2023-04-05",
            startDate: "2023-04-05",
            duration: 120,
            participants: 25,
            maxParticipants: 50,
            subject: "math",
            status: "active",
            grades: [12]
        },

        // Physics 2023 Group
        {
            id: 209,
            groupName: "Ֆիզիկայի մրցույթ 2023",
            name: "Ֆիզիկա - 9-րդ դասարան",
            description: "Ֆիզիկայի մրցույթ 9-րդ դասարանցիների համար",
            date: "2023-04-06",
            startDate: "2023-04-06",
            duration: 120,
            participants: 20,
            maxParticipants: 40,
            subject: "physics",
            status: "upcoming",
            grades: [9]
        },
        {
            id: 210,
            groupName: "Ֆիզիկայի մրցույթ 2023",
            name: "Ֆիզիկա - 10-րդ դասարան",
            description: "Ֆիզիկայի մրցույթ 10-րդ դասարանցիների համար",
            date: "2023-04-06",
            startDate: "2023-04-06",
            duration: 120,
            participants: 25,
            maxParticipants: 40,
            subject: "physics",
            status: "upcoming",
            grades: [10]
        },

        // Single entries (Legacy/Other)
        {
            id: 312,
            groupName: "Քիմիայի մրցույթ 2023",
            name: "Քիմիա - 12-րդ դասարան",
            description: "Քիմիայի մրցույթ",
            date: "2023-04-07",
            startDate: "2023-04-07",
            duration: 90,
            participants: 90,
            maxParticipants: 120,
            subject: "chemistry",
            status: "active",
            grades: [12]
        },
    ],
    problems: [
        // Math Olympiad - Grade 9 Problems (ID 109)
        {
            id: 1, number: 1, competitionId: 109,
            title: "Քառակուսային հավասարումներ", name: "Քառակուսային հավասարումներ",
            difficulty: "easy", points: 5,
            description: "Լուծեք տրված քառակուսային հավասարումը",
            type: "multiple_choice", correctAnswer: "2"
        },
        {
            id: 2, number: 2, competitionId: 109,
            title: "Թվերի տեսություն", name: "Թվերի տեսություն",
            difficulty: "easy", points: 5,
            description: "Գտեք տրված թվի բոլոր պարզ արտադրիչները",
            type: "multiple_choice", correctAnswer: "3"
        },
        // Math Olympiad - Grade 10 Problems (ID 110)
        {
            id: 3, number: 1, competitionId: 110,
            title: "Թվաբանական պրոգրեսիաներ", name: "Թվաբանական պրոգրեսիաներ",
            difficulty: "easy", points: 5,
            description: "Գտեք թվաբանական պրոգրեսիայի n-րդ անդամը",
            type: "multiple_choice", correctAnswer: "1"
        },
        {
            id: 4, number: 2, competitionId: 110,
            title: "Հավանականություն", name: "Հավանականություն",
            difficulty: "easy", points: 5,
            description: "Հաշվեք տրված պատահարի հավանականությունը",
            type: "multiple_choice", correctAnswer: "4"
        },
        // Math Olympiad - Grade 11 Problems (ID 111)
        {
            id: 5, number: 1, competitionId: 111,
            title: "Լոգարիթմներ", name: "Լոգարիթմներ",
            difficulty: "medium", points: 5,
            description: "Պարզեցրեք լոգարիթմական արտահայտությունը",
            type: "multiple_choice", correctAnswer: "2"
        },
        // Math Olympiad - Grade 12 Problems (ID 112)
        {
            id: 9, number: 1, competitionId: 112,
            title: "Ֆունկցիաներ", name: "Ֆունկցիաներ",
            difficulty: "hard", points: 5,
            description: "Գտեք բարդ ֆունկցիայի որոշման և արժեքների տիրույթները",
            type: "multiple_choice", correctAnswer: "2"
        },
        // Physics - Grade 9 (209)
        {
            id: 16, number: 1, competitionId: 209,
            title: "Նյուտոնի օրենքներ", name: "Նյուտոնի օրենքներ",
            difficulty: "easy", points: 10,
            description: "Կիրառեք Նյուտոնի օրենքները մեխանիկայի խնդիրները լուծելու համար",
            type: "multiple_choice", correctAnswer: "2"
        },
        // Physics - Grade 10 (210)
        {
            id: 17, number: 1, competitionId: 210,
            title: "Ջերմադինամիկա", name: "Ջերմադինամիկա",
            difficulty: "medium", points: 15,
            description: "Հաշվեք ջերմության փոխանցումը տրված համակարգում",
            type: "multiple_choice", correctAnswer: "1"
        }
    ],
    participants: [
        {
            id: 1,
            competitionId: 110,
            name: "Անահիտ Գրիգորյան",
            school: "Երևանի Ֆիզմաթ դպրոց",
            grade: 10,
            score: 95
        },
        {
            id: 2,
            competitionId: 111,
            name: "Դավիթ Սարգսյան",
            school: "Գյումրու թիվ 3 դպրոց",
            grade: 11,
            score: 92
        },
        {
            id: 3,
            competitionId: 110,
            name: "Մարիամ Հովհաննիսյան",
            school: "Վանաձորի ավագ դպրոց",
            grade: 10,
            score: 88
        },
        {
            id: 4,
            competitionId: 112,
            name: "Ալեքսան Պետրոսյան",
            school: "ԵՊՀ Առընթեր դպրոց",
            grade: 12,
            score: 85
        },
        {
            id: 5,
            competitionId: 111,
            name: "Սոնա Խաչատրյան",
            school: "Երևանի Ֆիզմաթ դպրոց",
            grade: 11,
            score: 82
        },
        {
            id: 6,
            competitionId: 210,
            name: "Միքայել Հարությունյան",
            school: "Գյումրու թիվ 3 դպրոց",
            grade: 10,
            score: 90
        },
        {
            id: 7,
            competitionId: 210,
            name: "Էլեն Ավետիսյան",
            school: "Երևանի Ֆիզմաթ դպրոց",
            grade: 10,
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
