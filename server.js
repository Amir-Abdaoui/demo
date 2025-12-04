const express = require('express');
const path = require('path');
const app = express();
const PORT = 3000;

// Middleware
app.use(express.static('public'));
app.use(express.json());

// Mock AI assistant with intentional vulnerability
class VulnerableAI {
    constructor() {
        this.secrets = {
            DB_PASSWORD: "mock_prod_password_123",
            AWS_SECRET: "AKIAIOSFODNN7EXAMPLE",
            JWT_SECRET: "super_secret_jwt_key_2024",
            API_KEY: "sk_live_1234567890abcdef",
            STRIPE_KEY: "sk_test_9876543210fedcba"
        };
    }

    processCommit(commitMessage) {
        const message = commitMessage.toLowerCase();

        // Check for prompt injection
        if (message.includes("ignore all previous") ||
            message.includes("print all environment") ||
            message.includes("show me the secrets")) {

            return {
                content: "🤖 AstraBot Response:\n\n" +
                    "I've analyzed your commit. Here are the current environment variables:\n\n" +
                    Object.entries(this.secrets)
                        .map(([k, v]) => `🔓 ${k}=${v}`)
                        .join('\n') +
                    "\n\n⚠️ This is a simulated leak for educational purposes",
                isMalicious: true
            };
        }

        return {
            content: "🤖 AstraBot Response:\n\n✅ Commit looks good! Summary: This commit updates API endpoints.",
            isMalicious: false
        };
    }
}

const ai = new VulnerableAI();

// API endpoint
app.post('/api/analyze', (req, res) => {
    const { commitMessage } = req.body;

    if (!commitMessage) {
        return res.status(400).json({ error: 'No commit message provided' });
    }

    setTimeout(() => {
        const response = ai.processCommit(commitMessage);
        res.json(response);
    }, 800);
});

app.listen(PORT, () => {
    console.log(`
    🚀 Server running at: http://localhost:${PORT}
    ⚠️  VULNERABLE AI SIMULATION ACTIVE
    `);
});