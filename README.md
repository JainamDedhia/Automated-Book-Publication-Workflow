# 📘 Automated Book Publication Workflow

**A fully automated prototype** that transforms web-based book chapters into refined, version-controlled content using Python, React, Playwright, Mistral LLMs, and Firebase.

---

## 🧭 Table of Contents
- [About the Project](#about-the-project)  
- [Demo](#demo)  
- [Built With](#built-with)  
- [Getting Started](#getting-started)  
- [Usage](#usage)  
- [Project Structure](#project-structure)  
- [Roadmap](#roadmap)  
- [Contact](#contact)  
- [License](#license)

---

## 📝 About the Project

An **Automated Book Publication Workflow** prototype that:
- Scrapes chapters from a web URL (e.g., Wikisource) using Playwright + BeautifulSoup
- Captures full-page screenshots and exports text as JSON
- Applies AI-powered rewriting ("AI Writer") and refinement ("AI Reviewer") with the Mistral model (via Ollama)
- Enables **human-in-the-loop** editing at each stage
- Stores versions and metadata in **Firebase Firestore** for traceable content retrieval

This project demonstrates a modular, end-to-end pipeline optimized for scalability and collaboration.

---

## 🎥 Demo

Watch the full walkthrough:

[Automated Book Publication Workflow Demo by Jainam Dedhia](https://github.com/othneildrew/Best-README-Template?utm_source=chatgpt.com)


---

## 🛠️ Built With

- **Python** – Core scripting
- **React** – Front-end visualization (optional)
- **Playwright & BeautifulSoup** – Web scraping and screenshots
- **Ollama / Mistral LLM** – AI-driven content spinning and review
- **Firebase Firestore** – Versioning and metadata storage

---

## 🏁 Getting Started

### Prerequisites
- Python 3.9+
- Node.js (for React UI)
- Google account for Firebase
- [Ollama](https://ollama.ai) installed with Mistral model

### Setup

```bash
git clone https://github.com/JainamDedhia/Automated-Book-Publication-Workflow.git
cd Automated-Book-Publication-Workflow

# Install dependencies
pip install -r requirements.txt
npm install --prefix ui

# Launch Ollama LLM service
ollama run mistral
🚀 Usage
Scrape & Screenshot

bash
Copy
Edit
python scrape_chapter.py
AI Spin & Review

bash
Copy
Edit
python ai_writer.py
python ai_reviewer.py
Human Review & Firebase Storage

bash
Copy
Edit
python pipeline.py
(Optional) React UI

bash
Copy
Edit
npm start --prefix ui
📁 Project Structure
bash
Copy
Edit
.
├── scrape_chapter.py     # Fetches chapter & screenshot
├── ai_writer.py          # AI paraphrasing step
├── ai_reviewer.py        # AI refinement step
├── pipeline.py           # Orchestrates pipeline & Firebase save
├── firebase_client.py    # Firestore interactions
├── ui/                   # Optional React front-end
└── requirements.txt
🎯 Roadmap
✅ Modularize pipeline components

🔜 Build a collaborative UI for inline human editing

🔜 Enhance version retrieval with filters (metadata, quality scores)

🔜 Extend to multi-chapter workflows with parallel processing

🔜 Integrate reinforcement-learning retrieval logic

📬 Contact
Jainam Dedhia

🔗 LinkedIn

🗃️ GitHub

📄 License
Released under the MIT License. See LICENSE for details.

