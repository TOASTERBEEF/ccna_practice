# CCNA Mastery Pro

Comprehensive Cisco Certified Network Associate (CCNA) exam preparation platform.

## Key Features

- **Readiness Tracker**: A dynamic progression system that tracks your "Preparation Score" based on platform activity and manual calibration.
- **Lab Challenges**: Hands-on missions inspired by Jeremy's IT Lab, covering EtherChannel, OSPF, Port Security, and more.
- **AI Mentor**: Chat with an AI-powered CCNP instructor for clarifications on any CCNA topic.
- **Topology Builder**: Design your network diagrams with a lightweight, Packet Tracer-like interactive canvas.
- **IOS Config Lab**: Practice Cisco CLI commands in a simulated environment.
- **Practice Quiz**: Test your knowledge with an expansive question bank, customizable by difficulty and domain focus.
- **Persistence**: Your progress, scores, and explored domains are automatically saved to your browser's local storage.

## Technology Stack

- **Frontend**: React 19 + TypeScript
- **Bundler**: Vite
- **Styling**: Tailwind CSS 4
- **Animations**: Motion (Framer Motion)
- **Canvas**: Konva + React-Konva
- **AI**: Google Gemini API (@google/genai)

## Hosting on GitHub

To host this project on GitHub:

1. Create a new repository on GitHub.
2. Export the project from Google AI Studio Build.
3. Push the code to your repository:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin <your-repo-url>
   git push -u origin main
   ```
4. **Environment Variables**: For the AI Mentor to work, you'll need to set up a `GEMINI_API_KEY` in your hosting provider's environment variables.

## Development

Install dependencies:
```bash
npm install
```

Start the development server:
```bash
npm run dev
```
