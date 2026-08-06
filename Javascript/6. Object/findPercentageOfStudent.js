const students = [
    { name: 'sudhir', subject: 'English', marks: 50 },
    { name: 'sudhir', subject: 'Science', marks: 70 },
    { name: 'sudhir', subject: 'Maths', marks: 40 },
    { name: 'Sagar', subject: 'English', marks: 43 },
    { name: 'Sagar', subject: 'Science', marks: 80 },
    { name: 'Sagar', subject: 'Maths', marks: 60 }
];

// Function to calculate percentages for each student
const calculatePercentages = (students) => {
    const studentResults = {};

    // Group marks by student
    students.forEach(({ name, marks }) => {
        if (!studentResults[name]) {
            studentResults[name] = { totalMarks: 0, subjectCount: 0 };
        }
        studentResults[name].totalMarks += marks;
        studentResults[name].subjectCount++;
    });

    // Calculate percentage for each student
    return Object.entries(studentResults).map(([name, { totalMarks, subjectCount }]) => ({
        name,
        totalMarks,
        percentage: ((totalMarks / (subjectCount * 100)) * 100).toFixed(2) + '%'
    }));
};

// Call the function and log the results
const percentages = calculatePercentages(students);
console.log(percentages);


/********************************** */

const students = [
    { name: 'sudhir', subject: 'English', marks: 50 },
    { name: 'sudhir', subject: 'Science', marks: 70 },
    { name: 'sudhir', subject: 'Maths', marks: 40 },
    { name: 'Sagar', subject: 'English', marks: 43 },
    { name: 'Sagar', subject: 'Science', marks: 80 },
    { name: 'Sagar', subject: 'Maths', marks: 60 }
];

// Function to calculate percentages for each student
const calculatePercentages = (students) => {
    const studentResults = {};

    students.forEach(({ name, marks }) => {
        if (!studentResults[name]) studentResults[name] = { totalMarks: 0, subjectCount: 0 };
        studentResults[name].totalMarks += marks;
        studentResults[name].subjectCount++;
    });

    return Object.keys(studentResults).map(name => {
        const { totalMarks, subjectCount } = studentResults[name];
        return { name, percentage: ((totalMarks / (subjectCount * 100)) * 100).toFixed(2) + '%' };
    });
};

console.log(calculatePercentages(students));
