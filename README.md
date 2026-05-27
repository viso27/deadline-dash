# 🎓 Deadline Dash

> A fast-paced endless runner about surviving college — dodge assignments, coffee cups, WiFi dead zones, and professors before your deadline hits zero.

![Made with React](https://img.shields.io/badge/React-18-61dafb?style=flat-square&logo=react)
![Vite](https://img.shields.io/badge/Vite-5-646cff?style=flat-square&logo=vite)
![TailwindCSS](https://img.shields.io/badge/Tailwind-CSS-38bdf8?style=flat-square&logo=tailwindcss)
![Deployed on Vercel](https://img.shields.io/badge/Deployed-Vercel-000?style=flat-square&logo=vercel)

---

## 🎮 Gameplay

Single tap to jump. Survive as long as possible without hitting obstacles. The longer you survive, the faster it gets.

| Control | Action |
|---|---|
| `Tap / Click` | Jump |
| `Space` | Jump |
| `↑ Arrow` | Jump |

### Obstacles

| Obstacle | Description |
|---|---|
| 📄 Assignment Sheet | Marked DUE! Flying at you |
| ☕ Coffee Cup | Spilled all over the path |
| 📡 WiFi Dead Zone | No signal, no escape |
| 👨‍🏫 Professor | The final boss |

### Random Events

- 📢 **Lab Cancelled!** — Speed slows down (breathe)
- ⚡ **Assignment Due in 5min!** — Speed spikes hard
- ☕ **Free Coffee!** — Slow mo bonus
- 📶 **WiFi Restored!** — Brief relief
- 😤 **Prof is Watching!** — Panic mode

### Combo System

Dodge obstacles back-to-back to build your combo multiplier. Hit 5x and your character glows yellow in flow state.

---

## 🛠 Tech Stack

- **React 18** — UI and game state
- **Vite** — Build tool
- **Tailwind CSS** — Styling
- **CSS Animations** — Pixel art sprite, ground scroll, shake effects
- **requestAnimationFrame** — Smooth 60fps game loop
- **localStorage** — High score persistence

---

## 🚀 Run Locally

```bash
git clone https://github.com/viso27/deadline-dash.git
cd deadline-dash
npm install
npm run dev
```

Open `http://localhost:5173`

---

## 🌐 Live Demo

[Play Deadline Dash →](https://deadline-dash.vercel.app)

---

Built for Snippet Frontend Internship — Round 1 Build Challenge.
