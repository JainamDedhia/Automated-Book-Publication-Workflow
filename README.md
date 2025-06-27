# 📘 Automated Book Publication Workflow

**A working prototype** for an end-to-end automated publishing pipeline—built with Python, React, Playwright, Mistral LLMs, and Firebase.

---

## 🚀 Overview

This project automates the process of turning web content into refined, versioned chapters:

1. **Playwright + BeautifulSoup**: Scrapes chapter content from a web URL and captures a screenshot.  
2. **Mistral LLM via Ollama**: Performs an "AI Writer" pass to paraphrase, followed by an "AI Reviewer" pass for refinement.  
3. **Human-in-the-Loop**: Enables human edits/comments at every stage via interactive pipeline hooks.  
4. **Firebase Firestore**: Stores every version with metadata (timestamp, stage, reviewer).  
5. **React Front‑end**: (Optional/demo) Visualizes scraped content, AI outputs, and version history.

---

## 🎥 Demo Video

Watch the full project walkthrough here:

➡️ **[YouTube Demo Video]([YOUR_YOUTUBE_LINK_HERE](https://www.youtube.com/watch?v=DaUfTYX7nqQ))**

---

## 🛠️ Project Setup

### Requirements
- Python 3.9+
- Node.js (for React UI)
- Google account (for Firebase)
- [Ollama](https://ollama.ai) with Mistral model

### Getting Started

```bash
git clone https://github.com/JainamDedhia/Automated-Book-Publication-Workflow.git
cd Automated-Book-Publication-Workflow

# Python & dependencies
pip install -r requirements.txt

# Start Ollama Mistral model
ollama run mistral

# Run the scraper + AI pipeline
python pipeline.py

# (Optional) React UI setup
cd ui && npm install && npm start
