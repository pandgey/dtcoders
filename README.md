# BizTown — DT Coders | Unihack Team

A browser-based app that turns your business metrics into a living city. As your revenue, customers, profit margin, and expenses change, so does your city — bigger buildings, denser streets, and cranes on the skyline.

## Features

- **Live city visualisation** — revenue drives city size, customers drive density, margin drives building height and quality, expenses add construction cranes
- **Business health score** — derived from your four metrics; reflected in the sky (clear night = thriving, storm = struggling)
- **Data import** — drag and drop a CSV, TSV, JSON, or TXT file; the app auto-detects column names and scales values to the city
- **XP & levelling system** — earn XP by adjusting sliders, importing data, and hitting health milestones; level up through titles from Dreamer to Owner
- **Profile page** — tracks your level, XP progress, stats (cities built, files imported, milestones reached), and a snapshot of your last city state

## How the City is Built

| Metric | Real-world range | Effect |
|---|---|---|
| Revenue | $0 – $500,000 | City width / number of buildings |
| Customers | 0 – 5,000 | Building density |
| Profit Margin | 0 – 100% | Building height and quality |
| Expenses | $0 – $250,000 | Number of construction cranes |

City health is calculated as:

```
health = (revenue + customers + margin − expenses) / 3
```

| Health | Status | Sky |
|---|---|---|
| > 65 | Thriving | Deep blue, crescent moon |
| 35–65 | Growing | Mid blue |
| < 35 | Struggling | Purple, storm cloud with lightning |

## XP System

| Action | XP |
|---|---|
| Moving a slider | +10 |
| Importing a file | +15 |
| Health first crosses into Thriving | +50 |
| Each milestone reached (20 / 40 / 60 / 80 / 95) | +25 |

Level formula: `level = floor(sqrt(totalXP / 10))`

## File Import

Supports CSV, TSV, JSON, and TXT. Column names are matched case-insensitively against common aliases:

- **Revenue** — `revenue`, `sales`, `turnover`, `income`, ...
- **Customers** — `customers`, `users`, `clients`, `subscribers`, ...
- **Margin** — `margin`, `profitmargin`, `grossmargin`, `profit`, ...
- **Expenses** — `expenses`, `costs`, `expenditure`, `opex`, ...

For multi-row files, values are averaged across all rows. You can review and tweak parsed values before applying them to the city.

## Tech Stack

- Vanilla HTML, CSS, JavaScript
- Canvas API for rendering
- Node.js + Express (serves the frontend and routes `/profile`)
- `localStorage` for persistence (no database required)

## Installation & Setup

### Prerequisites

- [Node.js](https://nodejs.org/) v18 or later (includes npm)

---

### macOS

1. **Install Node.js** — download the macOS installer from [nodejs.org](https://nodejs.org/), or use Homebrew:
   ```bash
   brew install node
   ```

2. **Clone the repo and install dependencies:**
   ```bash
   git clone https://github.com/your-org/dtcoders.git
   cd dtcoders
   npm install
   ```

3. **Start the server:**
   ```bash
   node server.js
   ```

4. Open [http://localhost:8080](http://localhost:8080) in your browser.

---

### Windows

1. **Install Node.js** — download the Windows installer (`.msi`) from [nodejs.org](https://nodejs.org/) and run it.

2. **Clone the repo and install dependencies** (in Command Prompt or PowerShell):
   ```cmd
   git clone https://github.com/your-org/dtcoders.git
   cd dtcoders
   npm install
   ```

3. **Start the server:**
   ```cmd
   node server.js
   ```

4. Open [http://localhost:8080](http://localhost:8080) in your browser.

---

### Linux

1. **Install Node.js** — use your distro's package manager, for example on Ubuntu/Debian:
   ```bash
   sudo pacman -Syu
   sudo pacman -S nodejs npm
   ```
   Or use [nvm](https://github.com/nvm-sh/nvm) for version management:
   ```bash
   nvm install --lts
   ```

2. **Clone the repo and install dependencies:**
   ```bash
   git clone https://github.com/your-org/dtcoders.git
   cd dtcoders
   npm install
   ```

3. **Start the server:**
   ```bash
   node server.js
   ```

4. Open [http://localhost:8080](http://localhost:8080) in your browser.

---

## How to Use

1. **Adjust the sliders** — set your Revenue, Customers, Profit Margin, and Expenses. The city updates in real time as you move them.

2. **Import your data** — click **Import Data** (or drag a file onto the page) to load a CSV, TSV, JSON, or TXT file. The app detects your column names automatically. Review the parsed values and click **Apply to City**.

3. **Watch your city** — the skyline, building density, weather, and sky all reflect your business health. Construction cranes appear when expenses are high.

4. **Earn XP** — you gain XP by adjusting sliders, importing files, hitting the Thriving health threshold, and reaching city milestones. Your level and progress are shown on the Profile page.

5. **View your profile** — click the **Profile** button (top right) to see your level, XP bar, title, and stats. You can also edit your display name and role there.
