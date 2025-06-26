const mongoose = require('mongoose');
mongoose.connect('mongodb+srv://Pranshu_1404:Pranshu%401404@cluster0.dtyt3.mongodb.net/Course_selling_app?retryWrites=true&w=majority&appName=Cluster0');

const AdminSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true }
});

const UserSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    purchasedCourse: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course'
    }]
});

const CourseSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: String,
    imageLink: String,
    price: { type: String, required: true }
});

const Admin = mongoose.model('Admin', AdminSchema);
const User = mongoose.model('User', UserSchema);
const Course = mongoose.model('Course', CourseSchema);

module.exports = {
    Admin,
    User,
    Course
};