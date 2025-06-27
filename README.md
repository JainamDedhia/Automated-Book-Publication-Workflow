# 📘 Automated Book Publication Workflow

**A powerful prototype** transforming web chapters into refined, version-controlled content using Python, React, Playwright, Mistral LLMs, and Firebase.

---

## 📝 What It Does

- **Scrapes** chapters from web sources (e.g., Wikisource) and captures full-page screenshots.
- Applies an **AI Writer** layer (Mistral via Ollama) to paraphrase content.
- Refines the text through an **AI Reviewer** pass for clarity, tone, and grammar.
- Supports **human-in-the-loop** editing at every stage for collaboration.
- Stores all versions and metadata in **Firebase Firestore**, enabling traceable content retrieval.
- Includes an optional **React front-end** (demo) to visualize content, versions, and comparison.

---

## 🎥 Demo

**Watch the full walkthrough video ↓**  
[Automated Book Publication Workflow Demo by Jainam Dedhia]([https://github.com/othneildrew/Best-README-Template?utm_source=chatgpt.com](https://www.youtube.com/watch?v=DaUfTYX7nqQ))


---

## 🔧 Technologies & Methods

- **Python** – Core orchestration scripts  
- **React** – Front-end UI (optional visualization)  
- **Playwright + BeautifulSoup** – Web content scraping & screenshot capture  
- **Ollama + Mistral model** – AI-driven rewriting and reviewing  
- **Firebase Firestore** – Storage of versions with context metadata

---

## 🧠 Key Features

1. **Automated scraping** of chapters → text + screenshot → JSON 기록  
2. **Two-stage AI pipeline**: spin + refine for enhanced quality  
3. **Human editing hooks** injected between automated stages  
4. **Fire­store-based versioning**, enabling filterable retrieval  
5. **Optional React demo UI** for viewing and comparing versions

---

## 🚀 Future Roadmap

- Enhance version retrieval using metadata filters (e.g., date, editor, stage)  
- Develop full-featured UI for inline editing and collaborative review  
- Extend pipeline to support multi-chapter or full-book automation  
- Explore reinforcement-learning ranking over version metadata for smart retrieval

---

## 💼 About Me

**Jainam Dedhia** – Software engineering student passionate about AI-powered content automation, full-stack systems, and scalable pipelines.

- 🔗 [LinkedIn](https://www.linkedin.com/in/jainam-dedhia-18a056273/)  

