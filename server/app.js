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
            model: "claude-3-5-sonnet-20241022", // Use the model you need
            max_tokens: 250,
            temperature: 0, // Set to 0 for deterministic answers
            system: "You are a teacher's assistant. You will be provided with a question and a student profile, containing information about the student's interests. You will create a custom version of the question that aligns with one of the student's interests.",
            messages: [
                {
                    "role": "user",
                    "content": [
                        {
                            "type": "text",
                            "text": `
                <examples>
                  <example>
                    <example_description>
                      This response accurately applies the question to one of the student's interests.
                    </example_description>
                    <problem>
                      ${question}
                    </problem>
                    <name>
                      ${student}
                    </name>
                    <interest_list>
                      ${interests}
                    </interest_list>
                    <ideal_output>
                      // The Claude API will customize this for the student's interests.
                    </ideal_output>
                  </example>
                </examples>
              `
                        },
                        {
                            "type": "text",
                            "text": `Question: ${question}\nStudent Profile:\nName: ${student}\nInterests: ${interests}`
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
