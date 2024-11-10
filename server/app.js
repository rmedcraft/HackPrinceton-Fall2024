import express from 'express';
import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import User from './db.js';  // Import the User model from db.js
import cors from 'cors';
import Anthropic from "@anthropic-ai/sdk";
import dotenv from "dotenv"

const app = express();
const PORT = 3000;

// Allow all origins (for development purposes, you can restrict this to specific origins in production)
app.use(cors({
    origin: 'http://localhost:5173', // Frontend origin
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type'],
}));

app.use(express.json());

// MongoDB connection setup
const mongoURI = 'mongodb+srv://ramshabilal:RsRRPoY9gZCVNjhi@cluster0.siam2zv.mongodb.net/hackprinceton?retryWrites=true&w=majority&appName=Cluster0';
mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connected to MongoDB'))
    .catch(error => console.error('Could not connect to MongoDB:', error));

// Middleware
app.use(express.json());
dotenv.config()

const anthropic = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY
});

// Sample student data with interests
const classList = {
    "Alice": { interests: ["sports", "cartoons"] },
    "Carol": { interests: ["technology", "fashion"] },
    "Bob": { interests: ["music", "gaming"] }
};

// Function to customize the question based on the student's interests
async function getCustomizedQuestion(student, question) {
    try {
        // Define the student's interests
        const interests = classList[student].interests.join(", ");
        const studentName = student;

        console.log("here")
        console.log(studentName, "  ", interests, "  ", question)

        // Format the Claude API message
        const msg = await anthropic.messages.create({
            model: "claude-3-5-haiku-latest",
            max_tokens: 250,
            temperature: 0.1,
            system: "You are a teacher's assistant. You will be provided with a math problem and a student profile, containing information about a student's interests. You will create a custom word problem that aligns with one of the student's interests. Respond with only the completed word problem, not any reasoning you did to arrive at that word problem. ",
            messages: [
                {
                    "role": "user",
                    "content": [
                        {
                            "type": "text",
                            "text": "<examples>\n<example>\n<example_description>\nThis response accurately applies the given math problem to Football, which appears in the list of Zachary's interests. The response is concise and does not include a checklist.\n</example_description>\n<name>\nZachary\n</name>\n<problem>\n6x + 15 = 51\nSolve for x.\n</problem>\n<interest_list>\nOuter Space, Football, Dinosaurs, \n</interest_list>\n<ideal_output>\nA team scored several touchdowns worth 6 points each, plus they already had 15 points from field goals. If they ended with 51 total points, how many touchdowns did they score?\n</ideal_output>\n</example>\n<example>\n<example_description>\nThis response accurately applies the given math problem to Sustainability, which appears in the list of Carol's interests. The response is concise and does not include a checklist.\n</example_description>\n<name>\nCarol\n</name>\n<problem>\n6x + 15 = 51\nSolve for x.\n</problem>\n<interest_list>\nHiking, Computer Programming, Sustainability, \n</interest_list>\n<ideal_output>\nIf each coal plant emits 6 tons of CO2 daily and other sources emit 15 tons daily, how many coal plants are operating if the total daily emissions are 51 tons?\n</ideal_output>\n</example>\n<example>\n<name>\nZara\n</name>\n<problem>\nx - 0.25x = 45\n</problem>\n<interest_list>\nComic Books, Gaming, Anime\n</interest_list>\n<ideal_output>\nA new video game costs x. After a 25% discount, the price is 45. What was the original price?\n</ideal_output>\n</example>\n<example>\n<name>\nMarcus\n</name>\n<problem>\nx + (2x + 5) = 35\n</problem>\n<interest_list>\nChess, Swimming, Basketball\n</interest_list>\n<ideal_output>\nYour team scores x points in the first quarter. In the second quarter, you score twice as many points plus 5. If you scored 35 points total in both quarters, how many points did you score in the first quarter?\n</ideal_output>\n</example>\n<example>\n<name>\nSofia\n</name>\n<problem>\n(8 × 6) + 20 + 100 = x\n</problem>\n<interest_list>\nHiking, Photography, Music Production\n</interest_list>\n<ideal_output>\nYour camera's memory card can store x photos. If each video takes up space equal to 8 photos, and you've stored 6 videos and 20 photos, with 100 spaces still free, what is the total capacity of your memory card?\n</ideal_output>\n</example>\n<example>\n<name>\nJackson\n</name>\n<problem>\n5x + 30 = 280\n</problem>\n<interest_list>\nCreative Writing, Rock Collecting, Guitar Playing\n</interest_list>\n<ideal_output>\nYou practice guitar for x minutes each day. After 5 days, plus an extra 30-minute session, you've practiced for 280 minutes total. How long do you practice each day?\n</ideal_output>\n</example>\n</examples>\n\n"
                        },
                        {
                            "type": "text",
                            "text": `Math Problem:\n{${question}}\n\nStudent Profile:\nName: {${studentName}}\nInterests: {${interests}}`
                        }
                    ]
                },
                {
                    "role": "assistant",
                    "content": [
                        {
                            "type": "text",
                            "text": "I understand what I need to do. I need craft a word problem for that math problem that connects to one of the student's interests in a meaningful way. Would you like me to include any explanation of the word problem in my next message, or just the problem?"
                        }
                    ]
                },
                {
                    "role": "user",
                    "content": [
                        {
                            "type": "text",
                            "text": "Answer with only the word problem please, Claude."
                        }
                    ]
                }
            ]
        });


        // Return the customized question from the API's response
        return msg.content[0].text;

    } catch (error) {
        console.error("Error interacting with Claude API:", error);
        return null;
    }
}

// Routes
// Sign-up route
app.post('/api/signup', async (req, res) => {
    const { username, password } = req.body;

    try {
        // Check if the username already exists
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(400).json({ message: 'Username already exists' });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);
        console.log("here")
        console.log(username, "  ", password, "  ", hashedPassword)
        // Create a new user with empty interests
        const newUser = new User({ username, password: hashedPassword, interests: [] });
        await newUser.save();

        res.status(201).json({ message: 'User created successfully' });
    } catch (error) {
        console.error('Error during sign-up:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Login route
app.post('/api/login', async (req, res) => {
    const { username, password } = req.body;
    console.log("login", username, password)
    try {
        // Check if the user exists
        const user = await User.findOne({ username });
        console.log(user)
        if (!user) {
            console.log("user not found")
            return res.status(400).json({ message: 'User not found' });
        }

        // Compare the hashed password with the input password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        console.log(isPasswordValid);
        if (!isPasswordValid) {
            console.log("invalid password");
            return res.status(400).json({ message: 'Invalid password' });
        }

        // If login is successful, send a response (you can add JWT here for session management)
        res.status(200).json({ message: 'Login successful' });

    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// POST route to handle question customization
app.post('/home', async (req, res) => {
    const { question } = req.body;

    if (!question) {
        return res.status(400).json({ message: "Question is required" });
    }

    const customizedQuestions = {};
    console.log(question)
    for (const student in classList) {
        if (classList.hasOwnProperty(student)) {
            const customizedQuestion = await getCustomizedQuestion(student, question);
            if (customizedQuestion) {
                console.log(student, "  ", customizedQuestion);
                customizedQuestions[student] = customizedQuestion;
            } else {
                return res.status(500).json({ message: `Error generating question for ${student}` });
            }
        }
    }

    console.log("CUSTOMIZED QUESTIONS", customizedQuestions);
    res.status(200).json(customizedQuestions);
});


// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
