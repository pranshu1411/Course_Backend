const { Router } = require("express");
const router = Router();
const userMiddleware = require("../middleware/user");
const { User, Course } = require("../db/index.js");
const { generateToken, hashPassword, verifyPassword } = require("../index");

// User Routes
router.post('/signup', async (req, res) => {
    const { username, password } = req.body;

    const hashedPassword = await hashPassword(password);
    await User.create({ username, password: hashedPassword });

    res.json({ message: "New user created successfully" });
});

router.post('/signin', async (req, res) => {
    const { username, password } = req.body;

    const user = await User.findOne({ username });
    if (!user) {
        return res.status(411).json({ message: "Incorrect username or password." });
    }

    const isMatch = await verifyPassword(password, user.password);
    if (!isMatch) {
        return res.status(411).json({ message: "Incorrect username or password." });
    }

    const token = generateToken({ id: user._id, email: "", username: user.username });
    res.json({ token });
});

router.get('/courses', async (req, res) => {
    const response = await Course.find({});
    res.json({ courses: response });
});

router.post('/courses/:courseId', userMiddleware, async (req, res) => {
    const username = req.user.username;
    const courseId = req.params.courseId;

    await User.updateOne({ username }, { "$push": { purchasedCourse: courseId } });
    res.json({ message: "Purchase completed." });
});

router.get('/purchasedCourses', userMiddleware, async (req, res) => {
    const user = await User.findOne({ username: req.user.username });

    const courses = await Course.find({ _id: { "$in": user.purchasedCourse } });
    res.json({ courses });
});

module.exports = router;