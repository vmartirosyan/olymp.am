/**
 * Mock Data for Olympiad Demo Application
 */

const MockData = {
    subjects: [
        { name: 'Մաթեմատիկա', icon: '📐' },
        { name: 'Ֆիզիկա', icon: '🔬' },
        { name: 'Քիմիա', icon: '⚗️' },
        { name: 'Կենսաբանություն', icon: '🧬' },
        { name: 'Ինֆորմատիկա', icon: '💻' }
    ],
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
            participantsCount: 25,
            averageScore: 83.2
        }
    ],
    grades: [
        { value: 9, label: "9-րդ դասարան" },
        { value: 10, label: "10-րդ դասարան" },
        { value: 11, label: "11-րդ դասարան" },
        { value: 12, label: "12-րդ դասարան" }
    ],
    regions: [
        "Երևան",
        "Շիրակ",
        "Լոռի",
        "Կոտայք",
        "Արմավիր",
        "Արարատ",
        "Արագածոտն",
        "Գեղարքունիք",
        "Վայոց Ձոր",
        "Սյունիք",
        "Տավուշ"
    ],
    competitions: [
        {
            id: 1,
            name: 'Հանրապետական Օլիմպիադա 2026',
            subject: 'Մաթեմատիկա',
            description: 'Դպրոցականների հանրապետական օլիմպիադա մաթեմատիկա առարկայից',
            startDate: '2026-02-15',
            endDate: '2026-02-15',
            registrationDeadline: '2026-02-10',
            status: 'active',
            participants: 156,
            maxParticipants: 500,
            grades: [9, 10, 11, 12],
            duration: 240,
            problems: Array.from({length: 20}, (_, i) => i + 1)
        },
        {
            id: 2,
            name: 'Կենսաբանության Օլիմպիադա 2026',
            subject: 'Կենսաբանություն',
            description: 'Կենսաբանության հանրապետական օլիմպիադայի մարզային փուլ',
            startDate: '2026-01-25',
            endDate: '2026-01-25',
            registrationDeadline: '2026-01-20',
            status: 'upcoming',
            participants: 89,
            maxParticipants: 300,
            grades: [9, 10, 11, 12],
            duration: 180,
            problems: Array.from({length: 20}, (_, i) => i + 1)
        },
        {
            id: 3,
            name: 'Ֆիզիկայի Օլիմպիադա 2025',
            subject: 'Ֆիզիկա',
            description: 'Ֆիզիկայի հանրապետական օլիմպիադա 2025',
            startDate: '2025-12-10',
            endDate: '2025-12-10',
            status: 'completed',
            participants: 234,
            maxParticipants: 400,
            grades: [10, 11, 12],
            duration: 300,
            problems: Array.from({length: 20}, (_, i) => i + 1)
        }
    ],
    problems: [
        {
            id: 1,
            competitionId: 1,
            number: 1,
            title: "Հանրահաշիվ - Քառակուսային հավասարում",
            description: "Գտնել $x^2 - 5x + 6 = 0$ հավասարման արմատների գումարը:",
            type: "multiple_choice",
            options: ["1", "5", "-6", "-5", "6"],
            correctAnswer: "2",
            points: 5,
            difficulty: "easy"
        },
        {
            id: 2,
            competitionId: 1,
            number: 2,
            title: "Երկրաչափություն - Եռանկյուն",
            description: "Ուղղանկյուն եռանկյան էջերն են 3 և 4: Գտնել ներքնաձիգը:",
            type: "multiple_choice",
            options: ["5", "6", "7", "25", "12"],
            correctAnswer: "1",
            points: 5,
            difficulty: "easy"
        },
        {
            id: 3,
            competitionId: 1,
            number: 3,
            title: "Թվաբանություն",
            description: "Քանի՞ պարզ թիվ կա 10-ից 20 միջակայքում:",
            type: "multiple_choice",
            options: ["2", "3", "4", "5", "1"],
            correctAnswer: "3", 
            points: 5,
            difficulty: "medium"
        },
        {
            id: 4,
            competitionId: 1,
            number: 4,
            title: "Ֆունկցիաներ",
            description: "Գտնել $f(x) = 2x + 1$ ֆունկցիայի արժեքը, երբ $x=3$:",
            type: "multiple_choice",
            options: ["6", "7", "5", "8", "4"],
            correctAnswer: "2",
            points: 5,
            difficulty: "easy"
        },
        {
            id: 5,
            competitionId: 1,
            number: 5,
            title: "Տոկոսներ",
            description: "Ապրանքի գինը 1000 դրամ է: Այն թանկացավ 20%-ով: Որքա՞ն դարձավ գինը:",
            type: "multiple_choice",
            options: ["1100", "1200", "1250", "1020", "1150"],
            correctAnswer: "2",
            points: 5,
            difficulty: "easy"
        },
        { id: 6, competitionId: 1, number: 6, title: "Խնդիր 6", description: "...", type: "multiple_choice", options: ["A","B","C","D","E"], correctAnswer: "A", points: 5, difficulty: "medium" },
        { id: 7, competitionId: 1, number: 7, title: "Խնդիր 7", description: "...", type: "multiple_choice", options: ["A","B","C","D","E"], correctAnswer: "A", points: 5, difficulty: "medium" },
        { id: 8, competitionId: 1, number: 8, title: "Խնդիր 8", description: "...", type: "multiple_choice", options: ["A","B","C","D","E"], correctAnswer: "A", points: 5, difficulty: "medium" },
        { id: 9, competitionId: 1, number: 9, title: "Խնդիր 9", description: "...", type: "multiple_choice", options: ["A","B","C","D","E"], correctAnswer: "A", points: 5, difficulty: "medium" },
        { id: 10, competitionId: 1, number: 10, title: "Խնդիր 10", description: "...", type: "multiple_choice", options: ["A","B","C","D","E"], correctAnswer: "A", points: 5, difficulty: "medium" },
        { id: 11, competitionId: 1, number: 11, title: "Խնդիր 11", description: "...", type: "multiple_choice", options: ["A","B","C","D","E"], correctAnswer: "A", points: 5, difficulty: "medium" },
        { id: 12, competitionId: 1, number: 12, title: "Խնդիր 12", description: "...", type: "multiple_choice", options: ["A","B","C","D","E"], correctAnswer: "A", points: 5, difficulty: "medium" },
        { id: 13, competitionId: 1, number: 13, title: "Խնդիր 13", description: "...", type: "multiple_choice", options: ["A","B","C","D","E"], correctAnswer: "A", points: 5, difficulty: "medium" },
        { id: 14, competitionId: 1, number: 14, title: "Խնդիր 14", description: "...", type: "multiple_choice", options: ["A","B","C","D","E"], correctAnswer: "A", points: 5, difficulty: "medium" },
        { id: 15, competitionId: 1, number: 15, title: "Խնդիր 15", description: "...", type: "multiple_choice", options: ["A","B","C","D","E"], correctAnswer: "A", points: 5, difficulty: "medium" },
        {
            id: 16,
            competitionId: 1,
            number: 16,
            title: "Բարդ հավասարում",
            description: "Գտնել $x$-ը, եթե $2^x = 32$:",
            type: "short_answer",
            correctAnswer: "5",
            points: 10,
            difficulty: "medium"
        },
        {
            id: 17,
            competitionId: 1,
            number: 17,
            title: "Երկրաչափություն",
            description: "Գտնել 13 շառավղով շրջանագծի տրամագիծը:",
            type: "short_answer",
            correctAnswer: "26",
            points: 10,
            difficulty: "easy"
        },
        {
            id: 18,
            competitionId: 1,
            number: 18,
            title: "Հավանականություն",
            description: "Զառը նետելիս 7 ընկնելու հավանականությունը:",
            type: "short_answer",
            correctAnswer: "0",
            points: 15,
            difficulty: "hard"
        },
        {
            id: 19,
            competitionId: 1,
            number: 19,
            title: "Քառակուսի",
            description: "12 կողմով քառակուսու մակերեսը:",
            type: "short_answer",
            correctAnswer: "144",
            points: 5,
            difficulty: "easy"
        },
        {
            id: 20,
            competitionId: 1,
            number: 20,
            title: "Վերջին խնդիր",
            description: "$5^2$ հավասար է:",
            type: "short_answer",
            correctAnswer: "25",
            points: 5,
            difficulty: "easy"
        }
    ],
    results: [],
    translations: {},
    participants: [
        {
            id: 101,
            firstName: 'Արմեն',
            lastName: 'Սարգսյան',
            school: 'Երևանի Ֆիզմաթ դպրոց',
            grade: 11,
            email: 'armen.s@example.com',
            registeredCompetitions: [1]
        },
        {
            id: 102,
            firstName: 'Անի',
            lastName: 'Գրիգորյան',
            school: 'Քվանտ վարժարան',
            grade: 10,
            email: 'ani.g@example.com',
            registeredCompetitions: [1]
        },
        {
            id: 103,
            firstName: 'Դավիթ',
            lastName: 'Պետրոսյան',
            school: 'Այբ դպրոց',
            grade: 12,
            email: 'davit.p@example.com',
            registeredCompetitions: [1]
        },
        {
            id: 104,
            firstName: 'Մարիամ',
            lastName: 'Հովհաննիսյան',
            school: 'Շիրակացու ճեմարան',
            grade: 9,
            email: 'mariam.h@example.com',
            registeredCompetitions: [1, 2]
        },
        {
            id: 105,
            firstName: 'Գոռ',
            lastName: 'Ավագյան',
            school: 'Գյումրու Ֆոտոն վարժարան',
            grade: 11,
            email: 'gor.a@example.com',
            registeredCompetitions: [1]
        }
    ],
    submissions: [
        {
            id: 1,
            competitionId: 1,
            participantId: 101,
            answers: {
                1: 'A', 2: 'B', 3: 'C', 4: 'D', 5: 'A', 
                6: 'B', 7: 'C', 8: 'D', 9: 'A', 10: 'B',
                11: 'C', 12: 'D', 13: 'A', 14: 'B', 15: 'C',
                16: 5, 17: 12, 18: 0, 19: 144, 20: 25
            },
            score: 18,
            timestamp: '2026-02-15T14:30:00'
        }
    ],
    // Grading Key (Correct Answers) for Competitions
    // Using a map key: competitionId -> { problemId: correctValue }
    answerKeys: {
        1: {
            1: 'A', 2: 'B', 3: 'C', 4: 'D', 5: 'E',
            6: 'A', 7: 'B', 8: 'C', 9: 'D', 10: 'E',
            11: 'A', 12: 'B', 13: 'C', 14: 'D', 15: 'E',
            16: 5, 17: 12, 18: 0, 19: 144, 20: 25
        }
    },

    // Answer Sheet Form Templates - defines the layout for OMR/OCR processing
    // Coordinates are relative to the anchor markers, not absolute percentages
    formTemplates: {
        // Default template matching the standard school olympiad answer sheet
        'default': {
            name: 'Ստանդարտ Օլիմպիադա 2024',
            paperSize: 'A4',
            // Fiducial markers (black squares) for alignment detection
            // Positions in mm from page edges (matches CSS in printAnswerSheetTemplate)
            anchors: {
                markerSize: 20, // pixels (20px squares)
                topLeft: { fromTop: '15mm', fromLeft: '10mm' },
                topRight: { fromTop: '15mm', fromRight: '10mm' },
                midLeft: { fromTop: '48%', fromLeft: '10mm' },
                bottomLeft: { fromBottom: '15mm', fromLeft: '10mm' },
                bottomRight: { fromBottom: '15mm', fromRight: '10mm' }
            },
            sections: [
                {
                    id: 'mcq',
                    type: 'multiple_choice',
                    label: 'Ընտրովի (1-15)',
                    questions: { start: 1, end: 15 },
                    options: 4,
                    // MCQ checkbox grid - 15 rows (questions), 4 columns (options)
                    // Coordinates are RELATIVE TO ANCHOR BOUNDS (0.0 = top/left anchor, 1.0 = bottom/right anchor)
                    region: {
                        x: 0.142,     // 15.5% from left anchor
                        y: 0.53,      // 52% from top anchor
                        width: 0.28,  // 28% of content width (covers 4 checkbox columns)
                        height: 0.45  // 45% of content height (covers 15 question rows)
                    },
                    grid: {
                        rows: 15,     // 15 questions vertical
                        columns: 4,   // 4 options horizontal (1,2,3,4)
                        cellPadding: 0.08
                    }
                },
                {
                    id: 'short_answer',
                    type: 'handwritten_number',
                    label: 'Կարճ Պատասխան (16-20)',
                    questions: { start: 16, end: 20 },
                    maxDigits: 4,
                    // Short answer input boxes - target the white boxes with handwritten numbers
                    // Coordinates are RELATIVE TO ANCHOR BOUNDS (0.0 = top/left of content area, 1.0 = bottom/right)
                    region: {
                        x: 0.62,      // 58% from left edge of content bounds
                        y: 0.49,      // 46% from top of content bounds (moved up)
                        width: 0.25,  // 25% of content width
                        height: 0.28  // 32% of content height
                    },
                    grid: {
                        rows: 5,
                        columns: 1
                    }
                }
            ]
        }
    }
};

// Export for Node.js environment if needed, otherwise it's a global in browser
if (typeof module !== 'undefined' && module.exports) {
    module.exports = MockData;
}
