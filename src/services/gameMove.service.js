import models from "../models/index.js";
import boardService from "./board.service.js";

const { Game, GameBoard, GameSelectedCard } = models;

const placeCard = async (gameId, playerId, position, cardId) => {
  const game = await Game.findByPk(gameId);

  if (!game || game.status !== "active") throw new Error("Game not active");
  if (game.turn !== playerId) throw new Error("Not your turn");

  const [updatedCount] = await GameSelectedCard.update(
    { is_available: false },
    {
      where: {
        game_id: gameId,
        player_id: playerId,
        card_id: cardId,
        is_available: true
      }
    }
  );

  if (updatedCount === 0) throw new Error("No available cards of this type");

  const boardPosition = await GameBoard.findOne({
    where: { game_id: gameId, position }
  });

  if (!boardPosition || boardPosition.card_id !== null) {
    throw new Error("Position not available");
  }

  await boardPosition.update({ card_id: cardId, owner_id: playerId });

  const nextPlayer = game.player_1 === playerId ? game.player_2 : game.player_1;
  await game.update({ turn: nextPlayer });

  const endState = await checkGameEnd(gameId);

  return {
    board: await boardService.getFullBoard(gameId),
    endState
  };
};

export const checkGameEnd = async (gameId) => {
    const game = await Game.findByPk(gameId);
    const board = await GameBoard.findAll({ where: { game_id: gameId } });

    const p1Count = board.filter(p => p.owner_id === game.player_1).length;
    const p2Count = board.filter(p => p.owner_id === game.player_2).length;

    let status = game.status;
    let winnerId = game.winner;

    if (p1Count + p2Count === 9) {  //board full
        if (p1Count > p2Count) {
            status = 'waiting_steal';
            winnerId = game.player_1;
        } else if (p2Count > p1Count) {
            status = 'waiting_steal';
            winnerId = game.player_2;
        } else {
            status = 'draw';
        }
        await game.update({ status, winner: winnerId });
    }

    return { 
        status, 
        winnerId, 
        p1Count, 
        p2Count, 
        full: p1Count + p2Count === 9 
    };
};

export default {
    placeCard,
    checkGameEnd
};