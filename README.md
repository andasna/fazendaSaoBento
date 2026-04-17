<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/65062b11-13e9-4909-976b-e4e396930164

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`

## Deploy on Vercel

1. Connect your GitHub repository to Vercel.
2. In the Vercel project settings, add an environment variable:
   - Key: `GEMINI_API_KEY`
   - Value: `Your Gemini API Key`
3. Vercel will automatically detect Vite and build the project.
4. The included `vercel.json` ensures that client-side routing works correctly.

