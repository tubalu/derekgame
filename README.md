# Derek's Minesweeper

A modern, aesthetically pleasing Minesweeper game built with Node.js. Featuring a premium dark mode design, smooth animations, and classic gameplay mechanics.

![Minesweeper Preview](https://via.placeholder.com/800x450.png?text=Minesweeper+Premium+UI)

## Features

- **Premium UI**: Glassmorphism, vibrant colors, and smooth micro-animations.
- **Classic Mechanics**:
  - Left-click to reveal cells.
  - Right-click to flag suspected mines.
  - Intelligent flood-fill reveal for empty areas.
  - "First-click safe" logic (you never hit a mine on your first move).
- **Game Info**:
  - Live timer.
  - Remaining mine counter.
  - Reset button with dynamic emotional icons (↻, 💀, 😎).

## Setup and Running

### Prerequisites

- [Node.js](https://nodejs.org/) installed on your machine.

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/tubalu/derekgame.git
   cd derekgame
   ```

2. (Optional) Install dependencies if you modify the server to use Express:
   ```bash
   npm install
   ```

### Running Locally

Run the server using Node.js:

```bash
node server.js
```

Then open your browser and navigate to:
[http://localhost:3000](http://localhost:3000)

## How to Play

1. **Left Click**: Reveal a cell. If it's a mine, the game ends. If it's safe, a number will appear showing how many mines are adjacent to that cell.
2. **Right Click**: Place a flag on a cell where you suspect a mine is hidden.
3. **Objective**: Reveal all non-mine cells to win the game!

## Project Structure

- `server.js`: Lightweight Node.js server using native `http` module.
- `public/`: Frontend assets.
  - `index.html`: Structure and SEO-friendly tags.
  - `style.css`: Premium CSS styling and animations.
  - `game.js`: Core game logic and state management.

## License

This project is licensed under the ISC License.
