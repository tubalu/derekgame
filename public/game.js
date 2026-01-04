document.addEventListener('DOMContentLoaded', () => {
    const ROWS = 10;
    const COLS = 10;
    const MINES = 10;
    let board = [];
    let gameOver = false;
    let mineCount = MINES;
    let timer = 0;
    let timerInterval = null;
    let firstClick = true;
    let revealedCount = 0;

    const gameBoard = document.getElementById('game-board');
    const mineCountDisplay = document.getElementById('mine-count');
    const timerDisplay = document.getElementById('timer');
    const resetBtn = document.getElementById('reset-btn');

    function initGame() {
        clearInterval(timerInterval);
        timer = 0;
        gameOver = false;
        firstClick = true;
        revealedCount = 0;
        mineCount = MINES;
        updateDisplay();
        createBoard();
        resetBtn.innerHTML = '<span class="icon">↻</span>';
    }

    function createBoard() {
        gameBoard.innerHTML = '';
        board = [];
        for (let i = 0; i < ROWS * COLS; i++) {
            const cell = document.createElement('div');
            cell.classList.add('cell');
            cell.dataset.index = i;
            cell.addEventListener('click', handleLeftClick);
            cell.addEventListener('contextmenu', handleRightClick);
            gameBoard.appendChild(cell);
            board.push({
                element: cell,
                index: i,
                isMine: false,
                isRevealed: false,
                isFlagged: false,
                neighborMines: 0
            });
        }
    }

    function placeMines(excludeIndex) {
        let minesPlaced = 0;
        while (minesPlaced < MINES) {
            const randomIndex = Math.floor(Math.random() * (ROWS * COLS));
            if (randomIndex !== excludeIndex && !board[randomIndex].isMine) {
                board[randomIndex].isMine = true;
                minesPlaced++;
            }
        }
        calculateNumbers();
    }

    function calculateNumbers() {
        for (let i = 0; i < board.length; i++) {
            if (board[i].isMine) continue;
            const neighbors = getNeighbors(i);
            board[i].neighborMines = neighbors.filter(n => board[n].isMine).length;
        }
    }

    function getNeighbors(index) {
        const neighbors = [];
        const row = Math.floor(index / COLS);
        const col = index % COLS;

        for (let r = row - 1; r <= row + 1; r++) {
            for (let c = col - 1; c <= col + 1; c++) {
                if (r >= 0 && r < ROWS && c >= 0 && c < COLS) {
                    const neighborIndex = r * COLS + c;
                    if (neighborIndex !== index) {
                        neighbors.push(neighborIndex);
                    }
                }
            }
        }
        return neighbors;
    }

    function handleLeftClick(e) {
        if (gameOver) return;
        const index = parseInt(e.target.dataset.index);
        const cell = board[index];

        if (cell.isFlagged || cell.isRevealed) return;

        if (firstClick) {
            startTimer();
            placeMines(index);
            firstClick = false;
        }

        if (cell.isMine) {
            gameOver = true;
            revealMines();
            cell.element.style.backgroundColor = '#ff4444';
            resetBtn.innerHTML = '<span class="icon">💀</span>';
            clearInterval(timerInterval);
            return;
        }

        revealCell(index);
        checkWin();
    }

    function handleRightClick(e) {
        e.preventDefault();
        if (gameOver) return;
        const index = parseInt(e.target.dataset.index);
        const cell = board[index];

        if (cell.isRevealed) return;

        if (cell.isFlagged) {
            cell.isFlagged = false;
            cell.element.classList.remove('flag');
            mineCount++;
        } else {
            if (mineCount > 0) {
                cell.isFlagged = true;
                cell.element.classList.add('flag');
                mineCount--;
            }
        }
        updateDisplay();
    }

    function revealCell(index) {
        const cell = board[index];
        if (cell.isRevealed || cell.isFlagged) return;

        cell.isRevealed = true;
        cell.element.classList.add('revealed');
        revealedCount++;

        if (cell.neighborMines > 0) {
            cell.element.textContent = cell.neighborMines;
            cell.element.setAttribute('data-value', cell.neighborMines);
            const span = document.createElement('span');
            span.textContent = cell.neighborMines;
            cell.element.innerHTML = '';
            cell.element.appendChild(span);
        } else {
            // Flood fill
            const neighbors = getNeighbors(index);
            neighbors.forEach(n => {
                if (!board[n].isRevealed && !board[n].isMine) {
                    revealCell(n);
                }
            });
        }
    }

    function revealMines() {
        board.forEach(cell => {
            if (cell.isMine) {
                cell.element.classList.add('mine');
                cell.element.innerHTML = '💣';
            }
        });
    }

    function checkWin() {
        if (revealedCount === (ROWS * COLS) - MINES) {
            gameOver = true;
            clearInterval(timerInterval);
            mineCount = 0;
            updateDisplay();
            resetBtn.innerHTML = '<span class="icon">😎</span>';
            // Flag all remaining mines
            board.forEach(cell => {
                if (cell.isMine) {
                    cell.element.classList.add('flag');
                }
            });
        }
    }

    function startTimer() {
        timerInterval = setInterval(() => {
            timer++;
            updateDisplay();
        }, 1000);
    }

    function updateDisplay() {
        mineCountDisplay.textContent = mineCount.toString().padStart(3, '0');
        timerDisplay.textContent = timer.toString().padStart(3, '0');
    }

    resetBtn.addEventListener('click', initGame);

    initGame();

    // --- Navigation Logic ---
    const navMinesweeper = document.getElementById('nav-minesweeper');
    const navTodo = document.getElementById('nav-todo');
    const viewMinesweeper = document.getElementById('view-minesweeper');
    const viewTodo = document.getElementById('view-todo');

    function switchView(view) {
        if (view === 'minesweeper') {
            viewMinesweeper.classList.remove('hidden');
            viewTodo.classList.add('hidden');
            navMinesweeper.classList.add('active');
            navTodo.classList.remove('active');
        } else {
            viewMinesweeper.classList.add('hidden');
            viewTodo.classList.remove('hidden');
            navMinesweeper.classList.remove('active');
            navTodo.classList.add('active');
        }
    }

    navMinesweeper.addEventListener('click', () => switchView('minesweeper'));
    navTodo.addEventListener('click', () => switchView('todo'));

    // --- Todo List Logic ---
    const todoInput = document.getElementById('todo-input');
    const addTodoBtn = document.getElementById('add-todo-btn');
    const todoList = document.getElementById('todo-list');

    let todos = JSON.parse(localStorage.getItem('minesweeper-todos')) || [];

    function saveTodos() {
        localStorage.setItem('minesweeper-todos', JSON.stringify(todos));
    }

    function renderTodos() {
        todoList.innerHTML = '';
        todos.forEach((todo, index) => {
            const li = document.createElement('li');
            if (todo.completed) li.classList.add('completed');

            li.innerHTML = `
                <span class="todo-text">${todo.text}</span>
                <button class="delete-todo-btn" data-index="${index}">×</button>
            `;

            li.querySelector('.todo-text').addEventListener('click', () => {
                todos[index].completed = !todos[index].completed;
                saveTodos();
                renderTodos();
            });

            li.querySelector('.delete-todo-btn').addEventListener('click', (e) => {
                e.stopPropagation();
                todos.splice(index, 1);
                saveTodos();
                renderTodos();
            });

            todoList.appendChild(li);
        });
    }

    function addTodo() {
        const text = todoInput.value.trim();
        if (text) {
            todos.push({ text, completed: false });
            todoInput.value = '';
            saveTodos();
            renderTodos();
        }
    }

    addTodoBtn.addEventListener('click', addTodo);
    todoInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') addTodo();
    });

    renderTodos();
});
