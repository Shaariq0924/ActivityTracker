# Activity Tracker

**Activity Tracker** is a modular, high-performance, and visually intuitive daily workflow ecosystem designed to track habits, manage strict operational tasks, log internal reflections, and provide deep analytics into human performance.

Built with **Next.js**, **Tailwind CSS**, and **Framer Motion**, it delivers a seamless, deep-glassmorphism aesthetic paired with fluid micro-interactions.

---

## 🚀 Key Features

### 1. **Flow Hub (`/flow`)**
The central command node for your daily systems.
- **Dynamic Habit Tracking:** Visualizes 28-31 day timelines (dynamically calculating leap years and month boundaries) with streak calculations. Active safety guards ensure you can only log data for the current day.
- **Task Management:** Real-time priority-based task tracking with visual progress metrology.
- **Reflective Journaling:** Emotion tagging, templated reflections, and win-logging combined into an expanding archive.
- **Edu Vault:** A knowledge repository linking study insights directly to strategic goals.

### 2. **Performance Metrology (`/insights`)**
A dedicated analytics interface for aggregate behavioral data analysis.
- **Cyclic Activity Heatmap:** GitHub-style contribution squares dynamically representing your activity saturation across the month.
- **Peak Performance Day Computation:** Dynamically identifies the exact day you hit maximum objective throughput.
- **System Entropy Analysis:** Real-time consistency classification (Low/Medium/High Entropy) based on your average habit fulfillment metrics.
- **Operational Efficiency:** Percentage-based global readouts indexing your completed tasks vs active load.

### 3. **Deep Work Environments**
- **Focus Sessions (`/focus`):** Dedicated deeply immersive timers and workflow states to achieve flow.
- **Targets (`/targets`):** Macro-level goal structuring connected to your daily habits.

---

## 🛠 Tech Stack
- **Framework:** Next.js (React)
- **Styling:** Tailwind CSS + Custom Vanilla CSS Variables
- **Animations:** Framer Motion
- **Authentication:** NextAuth.js (Custom Providers)
- **Database/Backend:** Firebase / Next.js API Routes
- **Icons:** FontAwesome

---

## ⚙️ Local Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Shaariq0924/ActivityTracker.git
   cd ActivityTracker/frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure Environment Variables:**
   Create a `.env.local` file in the `frontend` directory and provide the necessary NextAuth/Firebase keys.

4. **Boot up the Dev Server:**
   ```bash
   npm run dev
   ```

Visit `http://localhost:3000` to access the portal.

---

## 📝 License
This project is proprietary and built for personal optimization.
