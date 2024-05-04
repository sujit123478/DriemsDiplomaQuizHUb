const mongoose = require('mongoose');
const examSchema = new mongoose.Schema(
    {
        name: {
            type: 'string',
            required: true
        },
        duration: {
            type: 'number',
            required: true
        },
        category: {
            type: 'string',
            required: true
        },
        totalMark: {
            type: 'number',
            required: true
        },
        passingMark: {
            type: 'number',
            required: true
        },
        questions: {
            type: [mongoose.Schema.Types.ObjectId],
            ref: 'questions',
            required: true
        }

    },{
        timestamps: true
    }
);

const Exam = mongoose.model('exams', examSchema);
module.exports = Exam;