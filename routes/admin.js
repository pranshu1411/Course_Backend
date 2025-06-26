const { Router } = require("express");
const adminMiddleware = require("../middleware/admin");
const router = Router();
const { Admin, Course } = require("../db/index.js");
const { generateToken, hashPassword, verifyPassword } = require("../index");

// Admin Routes
router.post('/signup', async (req, res) => {
    const { username, password } = req.body;

    const hashedPassword = await hashPassword(password);
    await Admin.create({ username, password: hashedPassword });

    res.json({ message: 'New admin created successfully.' });
});

router.post('/signin', async (req, res) => {
    const { username, password } = req.body;

    const user = await Admin.findOne({ username });
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

router.post('/courses', adminMiddleware, async (req, res) => {
    const { title, imageLink, description, price } = req.body;

    const newCourse = await Course.create({ title, description, imageLink, price });
    res.json({ message: "New course created successfully", courseId: newCourse._id });
});

router.get('/courses', adminMiddleware, async (req, res) => {
    const response = await Course.find({});
    res.json({ courses: response });
});

module.exports = router;