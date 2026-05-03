class GameClient {
  constructor(playerId, gameId) {
    this.playerId = playerId;
    this.gameId = gameId;
    this.gameState = null;
    this.draggedCardId = null;
  }

  async init() {
    try {
      await this.loadGameState();
      this.renderAll();
      this.bindEvents();
    } catch (error) {
      console.error('Init error:', error);
      document.getElementById('turnIndicator').textContent = 'Error loading game';
    }
  }

  async loadGameState() {
    const response = await fetch(`/api/${this.playerId}/${this.gameId}/status/full-state`);
    if (!response.ok) throw new Error(await response.text());
    this.gameState = await response.json();
  }

  renderAll() {
    this.renderBoard();
    this.renderHands();
    this.updateUI();
    if (this.gameState.stealableCards.length > 0) {
      this.renderStealPhase();
    }
  }

  renderBoard() {
    const container = document.getElementById('gameBoard');
    container.innerHTML = '';

    this.gameState.board.forEach(slot => {
      const div = document.createElement('article');
      div.className = `card ${slot.Card ?
        `${slot.Card.rarity.toLowerCase()} ${slot.owner_id === this.playerId ? 'p1' : 'p2'}` :
        'empty-slot drop-zone'}`;

      if (slot.Card) {
        div.innerHTML = this.renderCard(slot.Card);
      } else {
        div.innerHTML = '<div class="empty-shadow"></div>';
        div.dataset.position = slot.position;
        div.dataset.gameId = this.gameId;
        div.addEventListener('drop', (e) => this.dropCard(e));
        div.addEventListener('dragover', (e) => e.preventDefault());
      }

      container.appendChild(div);
    });
  }

  renderHands() {
    const p1Container = document.getElementById('player1Hand');
    p1Container.innerHTML = '';
    this.gameState.player1Hand.forEach(row => {
      const div = document.createElement('div');
      div.className = `card ${row.Card.rarity.toLowerCase()} p1`;
      div.draggable = true;
      div.dataset.cardId = row.Card.card_id;
      div.addEventListener('dragstart', (e) => this.dragStart(e));
      div.innerHTML = this.renderCard(row.Card);
      p1Container.appendChild(div);
    });

    const p2Container = document.getElementById('player2Hand');
    p2Container.innerHTML = '';
    this.gameState.player2Hand.forEach(row => {
      const div = document.createElement('div');
      div.className = `card ${row.Card.rarity.toLowerCase()} p2`;
      div.innerHTML = this.renderCard(row.Card);
      p2Container.appendChild(div);
    });
  }

  renderCard(card) {
    return `
      <img src="/img/${card.image_path.split('/').pop()}" alt="${card.card_name}" 
           onerror="this.src='/img/duckfault.jpg'">
      <div class="power">
        <span class="power-up">${card.power_up}</span>
        <span class="power-right">${card.power_right}</span>
        <span class="power-down">${card.power_down}</span>
        <span class="power-left">${card.power_left}</span>
      </div>
      <div class="card-info">
        <h2>${card.card_name}</h2>
      </div>
    `;
  }

  updateUI() {
    const scoreEl = document.getElementById('score');
    const turnEl = document.getElementById('turnIndicator');

    scoreEl.textContent = `${this.gameState.game.Player1.player_name} ${this.gameState.p1Count} - ${this.gameState.p2Count} ${this.gameState.game.Player2.player_name}`;

    const isMyTurn = this.gameState.game.turn === this.playerId;
    turnEl.textContent = isMyTurn ? 'Your turn' : this.gameState.game.Player2.player_name;
    turnEl.className = `turn ${isMyTurn ? 'my-turn' : ''}`;
  }

  renderStealPhase() {
    document.getElementById('stealContainer').style.display = 'block';
    const container = document.getElementById('stealableList');

    container.innerHTML = this.gameState.stealableCards.map(item => {
      const card = item.Card;
      return `
      <div class="card ${card.rarity.toLowerCase()} selectable" 
           onclick="window.gameApp.performSteal(${item.card_id})">
        <img src="/img/${card.image_path.split('/').pop()}" 
             alt="${card.card_name}" 
             onerror="this.onerror=null; this.src='/img/duckfault.jpg';">
        <div class="power">
          <span class="power-up">${card.power_up}</span>
          <span class="power-right">${card.power_right}</span>
          <span class="power-down">${card.power_down}</span>
          <span class="power-left">${card.power_left}</span>
        </div>
        <div class="card-info">
          <h2>${card.card_name}</h2>
        </div>
      </div>
    `;
    }).join('');
  }

  dragStart(e) {
    this.draggedCardId = e.target.closest('[data-card-id]').dataset.cardId;
    e.dataTransfer.setData('text', this.draggedCardId);
  }

  async dropCard(e) {
    e.preventDefault();
    const position = e.target.closest('.drop-zone').dataset.position;

    try {
      const response = await fetch(`/api/${this.playerId}/${this.gameId}/move`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ position: parseInt(position), cardId: parseInt(this.draggedCardId) })
      });

      if (response.ok) {
        window.location.reload();
      } else {
        const error = await response.json();
        alert(error.error || 'Move failed');
      }
    } catch (err) {
      alert('Network error: ' + err.message);
    }
  }

  async performSteal(cardId) {
    try {
      const response = await fetch(`/api/${this.playerId}/${this.gameId}/steal`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cardId })
      });

      if (response.ok) {
        window.location.href = `/players/${this.playerId}/newgame`;
      } else {
        const error = await response.json();
        alert(error.error || 'Steal failed');
      }
    } catch (err) {
      alert('Network error: ' + err.message);
    }
  }

  bindEvents() {

    if (this.gameState.game.turn !== this.playerId) {
      setInterval(() => this.checkGameUpdates(), 30000);
    }
  }

  async checkGameUpdates() {
    await this.loadGameState();
    this.renderAll();
  }
}