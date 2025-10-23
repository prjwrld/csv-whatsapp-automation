# CSV WhatsApp Automation  

Ever wished your spreadsheet could slide into DMs for you? This project does just that. It's a React and TypeScript app that reads a CSV of contacts, lets you pick the phone column, and then fires up WhatsApp chats for each person. You craft one message, and the app handles the repetitive clicking.  

## How It Works  

1. Upload your CSV file of contacts.  
2. Tell the app which column has the phone numbers.  
3. Write the message you want to send.  
4. Sit back as the app opens a WhatsApp chat for each number in a pop up friendly flow.  

Behind the scenes it's built with Vite, React and TypeScript, so it's fast and easy to hack on. Think of it as your own messaging assistant that never gets tired.  

## Features  

- CSV import: drop in a CSV and you're good to go.  
- Column selection: choose the column that holds the phone numbers, no guesswork.  
- Message template: write a single message and reuse it for every contact.  
- Automated chat launching: opens each chat one after another so you can send with a click.  
- Built for speed: uses React with Vite and TypeScript for a snappy dev experience.  

## Getting Started  

To run the app locally you'll need Node.js installed.  

1. Install dependencies with `npm install`.  
2. If you're using the Gemini API, create a `.env.local` file and set `GEMINI_API_KEY` to your Contem API key.  
3. Run the app with `npm run dev`.  

Feel free to riff on the code, add personalization tokens, or integrate more platforms. This repo is a clean starting point for building out automations that blend tech with real world hustle.
