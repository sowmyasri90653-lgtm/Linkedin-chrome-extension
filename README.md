# 🔗 LinkedIn Chrome Extension

A polished Chrome extension that fetches and displays your LinkedIn connections in a clean, responsive dashboard. Built with Vite, Tailwind CSS, and TypeScript for speed and scalability.

---

## 🚀 Features

- 🧠 Scrapes LinkedIn connections from the user's network page
- 📊 Displays connection data in a popup dashboard
- 🎨 Responsive UI powered by Tailwind CSS
- ⚙️ Background script auto-injects content logic
- 🧩 Modular architecture with Vite + TypeScript
- 🗂️ Chrome storage integration for caching

---

## 🛠️ Tech Stack

| Tool        | Purpose                          |
|-------------|----------------------------------|
| Vite        | Fast bundling and dev server     |
| TypeScript  | Type-safe scripting               |
| Tailwind CSS| Utility-first styling             |
| Chrome APIs | Extension logic and permissions  |

---

## 📦 Folder Structure

```plaintext
linkedin-extension/
├── manifest.json
├── src/
│   ├── background.ts
│   ├── content.ts
│   ├── popup/
│   │   ├── popup.html
│   │   ├── popup.ts
│   │   └── popup.css
├── dist/              # Build output
├── assets/
│   └── icons/
├── package.json
├── vite.config.js
├── tailwind.config.js
├── tsconfig.json
├── postcss.config.js
├── .gitignore
├── README.md

🧪 Setup & Development
1. Clone the repo
bash
git clone https://github.com/sowmyasri90653-lgtm/Linkedin-chrome-extension.git
cd Linkedin-chrome-extension
2. Install dependencies
bash
npm install
3. Run dev server
bash
npm run dev
4. Build for production
bash
npm run build
5. Load into Chrome
Go to chrome://extensions

Enable Developer Mode

Click Load unpacked

Select the dist/ folder

📸 Screenshots
<img width="1918" height="761" alt="Screenshot 2025-09-27 124913" src="https://github.com/user-attachments/assets/2bb4eeb1-f6d1-4a2b-8d5e-e2f25e1e45a2" />


📚 Notes
This extension uses content scripts to scrape LinkedIn data. Ensure you're logged in and on the correct page (linkedin.com/mynetwork/invite-connect/connections) before activating.

All scraping is user-initiated and stored locally.

🧁 Credits
Built with ❤️ by Sowmya
 Focused on polish, clarity, and real-world impact.
