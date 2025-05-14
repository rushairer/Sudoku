// 全局变量存储数独数据
let solution = [];
let puzzle = [];
let userInput = [];

// 初始化数独网格
function initGrid() {
    const grid = document.getElementById('sudoku-grid');
    grid.innerHTML = '';
    for (let i = 0; i < 36; i++) {
        const cell = document.createElement('div');
        cell.className = 'cell';
        cell.setAttribute('data-index', i);
        cell.contentEditable = true;
        cell.addEventListener('input', handleInput);
        cell.addEventListener('keydown', handleKeyDown);
        grid.appendChild(cell);
    }
}

// 生成新的数独谜题
function generateNewPuzzle() {
    solution = generateSolution();
    puzzle = generatePuzzleFromSolution();
    userInput = [...puzzle];
    displayPuzzle();
}

// 生成完整的数独解决方案
function generateSolution() {
    const grid = Array(36).fill(0);
    fillGrid(grid);
    return grid;
}

// 递归填充数独网格
function fillGrid(grid) {
    for (let i = 0; i < 36; i++) {
        if (grid[i] === 0) {
            const numbers = shuffle([1, 2, 3, 4, 5, 6]);
            for (const num of numbers) {
                if (isValid(grid, i, num)) {
                    grid[i] = num;
                    if (fillGrid(grid)) {
                        return true;
                    }
                    grid[i] = 0;
                }
            }
            return false;
        }
    }
    return true;
}

// 检查数字在当前位置是否有效
function isValid(grid, pos, num) {
    const row = Math.floor(pos / 6);
    const col = pos % 6;
    const blockRow = Math.floor(row / 2);
    const blockCol = Math.floor(col / 3);

    // 检查行
    for (let i = 0; i < 6; i++) {
        if (grid[row * 6 + i] === num && i !== col) {
            return false;
        }
    }

    // 检查列
    for (let i = 0; i < 6; i++) {
        if (grid[i * 6 + col] === num && i !== row) {
            return false;
        }
    }

    // 检查2x3块
    const blockStartRow = blockRow * 2;
    const blockStartCol = blockCol * 3;
    for (let i = 0; i < 2; i++) {
        for (let j = 0; j < 3; j++) {
            const pos = (blockStartRow + i) * 6 + (blockStartCol + j);
            if (grid[pos] === num && pos !== row * 6 + col) {
                return false;
            }
        }
    }

    return true;
}

// 从解决方案生成谜题
function generatePuzzleFromSolution() {
    const puzzle = [...solution];
    const cellsToRemove = 20; // 移除的数字数量，可以调整难度
    const positions = shuffle([...Array(36).keys()]);

    for (let i = 0; i < cellsToRemove; i++) {
        puzzle[positions[i]] = 0;
    }

    return puzzle;
}

// 显示数独谜题
function displayPuzzle() {
    const cells = document.querySelectorAll('.cell');
    cells.forEach((cell, index) => {
        const value = puzzle[index];
        cell.textContent = value || '';
        cell.className = 'cell' + (value ? ' given' : '');
        cell.contentEditable = !value;
    });
}

// 处理用户输入
function handleInput(event) {
    const cell = event.target;
    const index = parseInt(cell.getAttribute('data-index'));
    const value = cell.textContent.trim();

    if (value && (!/^[1-6]$/.test(value) || value === '0')) {
        cell.textContent = '';
        return;
    }

    userInput[index] = value ? parseInt(value) : 0;
    cell.classList.remove('error');
}

// 处理键盘事件
function handleKeyDown(event) {
    if (event.key === 'ArrowUp' || event.key === 'ArrowDown' ||
        event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
        event.preventDefault();
        const currentIndex = parseInt(event.target.getAttribute('data-index'));
        let nextIndex;

        switch (event.key) {
            case 'ArrowUp':
                nextIndex = currentIndex - 6;
                break;
            case 'ArrowDown':
                nextIndex = currentIndex + 6;
                break;
            case 'ArrowLeft':
                nextIndex = currentIndex - 1;
                break;
            case 'ArrowRight':
                nextIndex = currentIndex + 1;
                break;
        }

        if (nextIndex >= 0 && nextIndex < 36) {
            const nextCell = document.querySelector(`[data-index="${nextIndex}"]`);
            if (nextCell && !nextCell.classList.contains('given')) {
                nextCell.focus();
            }
        }
    }
}

// 检查答案
function checkSolution() {
    const cells = document.querySelectorAll('.cell');
    let isCorrect = true;

    cells.forEach((cell, index) => {
        const value = userInput[index];
        if (value !== solution[index]) {
            cell.classList.add('error');
            isCorrect = false;
        } else {
            cell.classList.remove('error');
        }
    });

    if (isCorrect) {
        alert('恭喜！你已经完成了这个数独谜题！');
    }
}

// 显示答案
function showSolution() {
    const cells = document.querySelectorAll('.cell');
    cells.forEach((cell, index) => {
        if (!cell.classList.contains('given')) {
            cell.textContent = solution[index];
            userInput[index] = solution[index];
        }
        cell.classList.remove('error');
    });
}

// 辅助函数：随机打乱数组
function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

// 页面加载时初始化
window.addEventListener('load', () => {
    initGrid();
    generateNewPuzzle();
});