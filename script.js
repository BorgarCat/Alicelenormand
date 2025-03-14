function drawCards() {
    let username = document.getElementById('username').value.trim();
    let question = document.getElementById('question').value.trim();

    if (!username || !question) {
        alert("请输入姓名和问题！");
        return;
    }

    let allCards = Array.from({ length: 36 }, (_, i) => i + 1);
    let shuffled = allCards.sort(() => Math.random() - 0.5); // 重新洗牌

    let topRow = shuffled.slice(0, 3);  // 上 3 张
    let middleRow = shuffled.slice(3, 6); // 中 3 张
    let bottomRow = shuffled.slice(6, 9); // 下 3 张

    let rows = [
        document.getElementById('row1'),
        document.getElementById('row2'),
        document.getElementById('row3')
    ];
    rows.forEach(row => row.innerHTML = ''); // 清空牌桌

    let selectedCards = [...topRow, ...middleRow, ...bottomRow]; // 记录所有选中的牌

    [topRow, middleRow, bottomRow].forEach((group, rowIndex) => {
        group.forEach(card => {
            let img = document.createElement('img');
            img.src = `cards/${card}.png`;
            img.className = 'card';
            img.draggable = true;
            img.dataset.card = card;
            img.addEventListener('click', () => showMeaning(card));
            img.addEventListener('dragstart', dragStart);
            img.addEventListener('dragover', dragOver);
            img.addEventListener('drop', drop);
            rows[rowIndex].appendChild(img);
        });
    });

    saveHistory(username, question, selectedCards);
}

function showMeaning(card) {
    document.getElementById('card-info').innerText = cardMeanings[card] || "未知牌义";
}

function saveHistory(username, question, cards) {
    let history = JSON.parse(localStorage.getItem('history')) || [];
    let timestamp = new Date().toLocaleString();
    let newRecord = { time: timestamp, name: username, question: question, cards: cards };

    history.unshift(newRecord);
    if (history.length > 50) history.pop(); // 只保留50条记录
    localStorage.setItem('history', JSON.stringify(history));

    updateHistoryList();
}

function updateHistoryList() {
    let historyList = document.getElementById('history');
    historyList.innerHTML = '';
    let history = JSON.parse(localStorage.getItem('history')) || [];

    history.forEach(record => {
        let li = document.createElement('li');
        li.innerText = `${record.time} | ${record.name} 问：「${record.question}」 -> 上: ${record.cards.slice(0, 3).join(', ')} | 中: ${record.cards.slice(3, 6).join(', ')} | 下: ${record.cards.slice(6, 9).join(', ')}`;
        historyList.appendChild(li);
    });
}

function clearHistory() {
    localStorage.removeItem('history');
    updateHistoryList();
}

// 拖拽功能
let draggedCard = null;

function dragStart(event) {
    draggedCard = event.target;
}

function dragOver(event) {
    event.preventDefault();
}

function drop(event) {
    event.preventDefault();
    if (draggedCard && event.target.classList.contains('card')) {
        let parent = draggedCard.parentNode;
        let target = event.target;
        parent.replaceChild(draggedCard, target);
        parent.insertBefore(target, draggedCard.nextSibling);
    }
}

// 初始化历史记录
updateHistoryList();
