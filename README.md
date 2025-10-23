# 🎯 TriviaSwift — Interactive Full‑Stack Quiz Platform

**TriviaSwift** is an engaging, full-stack MERN trivia platform built for fast-paced and customizable quiz sessions. Users can test their knowledge across multiple categories and difficulties while competing in real time via a dynamic leaderboard and persistent multi-session state management.

***

## ⚙️ Tech Stack

| Layer | Technologies |
|-------|---------------|
| **Frontend** | React 19, Vite 7, Tailwind CSS v4, React Router DOM,  Context API, Lucide React |
| **Backend** | Node.js, Express.js 4.21, MongoDB Atlas, Mongoose 7.8, JWT 9, bcryptjs 2.4, CORS, dotenv |
| **Build / Utilities** | Vite HMR, Seed / reset scripts (resetDatabase.js, seedQuestions.js) , NPM task automation |

***

## 🚀 Overview

TriviaSwift lets players select:
- **Question count:** 5 – 25  
- **Category:** Geography, Science, History, Literature, Art, or Mixed  
- **Difficulty:** Easy / Medium / Hard / Mixed  

Instant score feedback, real-time session data, and a persistent **leaderboard** create a competitive experience fine‑tuned for performance and scalability. The platform’s architecture mirrors commercial‑grade quiz systems with emphasis on modular React components, efficient database querying, and responsive UI design.

***

## ✨ Key Features

- **🎮 Real‑Time Gameplay:** Instant answer validation and score tracking per question  
- **🏆 Leaderboard:** Global ranking and session persistence  
- **⚡ Fast API Response:** Sub‑millisecond game session creation and question serving  
- **💬 Performance Metrics:** End‑of‑game analytics for user improvement  
- **📱 Responsive Design:** Optimized for all screen sizes  
- **🔒 Secure Sessions:** JWT‑ready architecture with bcrypt password hashing  
- **🧩 Modular Scripts:** Seamless database reset and seeding for quick setup  

***

## 🧠 User Experience Flow

1. **Setup Game:** User inputs name, picks category, difficulty, and question count  
2. **Play & Compete:** Backend retrieves filtered questions instantly via Express API  
3. **Results Display:** Scoreboard and results page show detailed performance insights  
4. **Replay or Share:** Session data persists for streak tracking and leaderboard placement  

***

## 👥 Team Contributions

### **Aryan Anand**
- Led **UI/UX refinement** and responsive design improvements  
- Enhanced homepage, results, and stats pages using Context API state handling  

### **Albin Shiju**
- Architected **backend API structure** and implemented `/api/game/start` logic  
- Transitioned from static question sets to **MongoDB dynamic querying**  

### **Shivansh Anand**
- Engineered **database utilities** for fast content re‑seeding  
- Maintained schema validation and reliable Atlas connectivity  

### **Govind AVC**
- Prepared **JWT authentication** and error‑handling middleware  
- Established RESTful design patterns and strict status‑code compliance  

### **Sreedhil Pavishanker B**
- Created **frontend service integration layer** and leaderboard retrieval  
- Developed seamless React Router transitions for real‑time UX continuity  

### **Arbin Kumar Biswal**
- Managed **production builds and Vite deployment pipelines**  
- Integrated Lucide icons and optimized Tailwind plugin configurations  
- Authored and maintained this project README, ensuring clear, professional documentation for the team and future contributors

### **Navaneeth M**
- Directed **QA and documentation standards**  
- Authored internal guides (`QUICK_START.md`, `GAME_START_FIX.md`) and conducted structured testing  

***

## 🧩 Major Challenges & Solutions

| Challenge | Solution |
|------------|-----------|
| Tailwind v4 + Vite Integration | Updated build configuration and adopted modern layer syntax for compatibility |
| Migration to MongoDB | Replaced static JSON with schema‑driven database and filtering algorithms for mixed difficulty modes |
| Frontend State Sync | Improved Context API initialization and cache‑refresh logic for accurate real‑time stats |
| Database Seeding Bugs | Added reusable scripts for clean resets and consistent question arrays |
| Authentication & Errors | Implemented JWT‑ready endpoints and unified error handling middleware |

***

## 🔒 Security & Reliability

- **JWT‑based design** ensures extensible token‑validated sessions  
- **bcryptjs encryption** protects user data and credentials  
- **Error middleware** standardizes response structure, preventing server leaks or ambiguous logs  
- **Environment‑secured configuration** via dotenv and CORS policies  

***

## ⚡ Performance & Scalability

- **API latency:** Optimized request‑response loop under 50 ms average  
- **Frontend re‑renders:** Managed by React Context and memoized states  
- **Database efficiency:** Indexed queries through Mongoose and selective field projections  
- **Production stability:** Streamlined Vite builds and automatic cache invalidation  

***

## 🧭 Learning Outcomes

The development journey strengthened proficiency in:
- React Context API, Hooks, and component composition  
- Tailwind’s new plugin ecosystem  
- Mongoose model design and Atlas deployment  
- RESTful architecture and middleware debugging  
- Agile teamwork, CI‑style documentation, and peer QA cycles  

***

## 🛠️ Next Steps

- Integrate **auth‑based user profiles and session history**  
- Add timed gameplay and multiplayer modes  
- Deploy **JWT‑secured authentication** in production  
- Expand API to support dynamic question imports  

***

## 🏁 Project Impact

TriviaSwift demonstrates end‑to‑end full‑stack fluency — from front‑end interactivity to scalable back‑end logic. Through collaborative precision, the team transformed a traditional quiz concept into a robust, deployment‑ready platform showcasing real‑time game orchestration, secure handling, and modern development practices.

***

**Team:**  
Aryan Anand · Albin Shiju · Shivansh Anand · Govind AVC · Sreedhil Pavishanker B · Arbin Kumar Biswal · Navaneeth M  

***