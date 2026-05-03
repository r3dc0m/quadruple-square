import models from "../models/index.js";
import boardService from "./board.service.js";
import { getStealableCards, botChooseBestCard, executeStealTransaction } from './stealCard.service.js';

const { Game, GameBoard, GameSelectedCard, Card } = models;

export const placeCard = async (gameId, playerId, position, cardId) => {
    const game = await Game.findByPk(gameId);

    if (!game || (game.status !== "active" && game.status !== "waiting_steal")) {
        throw new Error("Game not active");
    }

    if (game.turn !== playerId) {
        throw new Error("Not your turn");
    }

    const selectedCard = await GameSelectedCard.findOne({
        where: {
            game_id: gameId,
            player_id: playerId,
            card_id: cardId,
            is_available: true
        }
    });

    if (!selectedCard) {
        throw new Error("No available cards of this type");
    }

    await selectedCard.update({ is_available: false });

    const boardSlot = await GameBoard.findOne({
        where: { game_id: gameId, position }
    });

    if (!boardSlot || boardSlot.card_id !== null) {
        throw new Error("Position not available");
    }

    await boardSlot.update({
        card_id: cardId,
        owner_id: playerId
    });

    await applyCaptures(gameId, position, playerId);

    const nextPlayer = game.player_1 === playerId ? game.player_2 : game.player_1;
    await game.update({ turn: nextPlayer });

    const endState = await checkGameEnd(gameId);

    if (endState.status === 'waiting_steal') {
        await GameSelectedCard.update(
            { is_available: false },
            {
                where: {
                    game_id: gameId,
                    is_available: true
                }
            }
        );
    }

    return {
        board: await boardService.getFullBoard(gameId),
        endState
    };
};

const applyCaptures = async (gameId, atPosition, playerId) => {
    const board = await GameBoard.findAll({
        where: { game_id: gameId },
        include: [{ model: Card, as: "Card" }]
    });

    const placedSlot = board.find(b => b.position === atPosition);
    if (!placedSlot || !placedSlot.Card) return;

    const placedCard = placedSlot.Card;
    const row = Math.floor(atPosition / 3);
    const col = atPosition % 3;

    const offsets = [
        { dx: 0, dy: -1, myPower: "power_up", rivalPower: "power_down" },
        { dx: 1, dy: 0, myPower: "power_right", rivalPower: "power_left" },
        { dx: 0, dy: 1, myPower: "power_down", rivalPower: "power_up" },
        { dx: -1, dy: 0, myPower: "power_left", rivalPower: "power_right" }
    ];

    for (const off of offsets) {
        const r = row + off.dy;
        const c = col + off.dx;

        if (r < 0 || r > 2 || c < 0 || c > 2) continue;

        const rivalPos = r * 3 + c;
        const rivalSlot = board.find((b) => b.position === rivalPos);

        if (rivalSlot && rivalSlot.card_id !== null && rivalSlot.owner_id !== playerId) {
            const myPower = placedCard[off.myPower];
            const rivalPower = rivalSlot.Card[off.rivalPower];

            if (myPower > rivalPower) {
                await GameBoard.update(
                    { owner_id: playerId },
                    {
                        where: {
                            game_id: gameId,
                            position: rivalPos
                        }
                    }
                );
            }
        }
    }
};

export const checkGameEnd = async (gameId) => {
    const game = await Game.findByPk(gameId);
    const board = await GameBoard.findAll({ where: { game_id: gameId } });

    const totalPlaced = board.filter(slot => slot.card_id !== null).length;
    const p1Count = board.filter(slot => slot.owner_id === game.player_1).length;
    const p2Count = board.filter(slot => slot.owner_id === game.player_2).length;

    if (game.status === 'waiting_steal' && game.winner === game.player_2) {
        const stealable = await getStealableCards(gameId, game.player_1);
        const bestCardId = botChooseBestCard(stealable);

        await executeStealTransaction(gameId, game.player_2, bestCardId);

    }

    if (totalPlaced === 9 && game.status === 'active') {
        let winnerId = (p1Count > p2Count) ? game.player_1 : game.player_2;
        await game.update({ status: 'waiting_steal', winner: winnerId });
        return await checkGameEnd(gameId); //game ends
    }

    return { status: game.status, winnerId: game.winner };
};

export const botMove = async (gameId) => {
    const game = await Game.findByPk(gameId);

    if (!game || game.status !== "active") {
        return null;
    }

    const botId = game.turn;
    if (!botId || botId !== game.player_2) {
        return null;
    }

    const board = await GameBoard.findAll({ where: { game_id: gameId } });
    const availablePositions = board.filter((pos) => pos.card_id === null);

    if (availablePositions.length === 0) {
        return null;
    }

    const botCards = await GameSelectedCard.findAll({
        where: { game_id: gameId, player_id: botId, is_available: true },
        include: [{ model: Card, attributes: ["card_id", "power_up", "power_right", "power_down", "power_left"] }]
    });

    if (botCards.length === 0) {
        await Game.update({ status: 'finished', winner: game.player_1 }, { where: { game_id: gameId } });
        return null;
    }

    const bestPlay = findBestBotMove(board, availablePositions, botCards, game);
    return bestPlay ? { position: bestPlay.position, cardId: bestPlay.cardId } : null;
};

function findBestBotMove(fullBoard, availablePositions, botCards, game) {
    const { player_1, player_2 } = game;

    const corners = [0, 2, 6, 8];
    const edges = [1, 3, 5, 7];
    const center = 4;

    let best = null;
    let maxCaptures = -1;

    for (const pos of availablePositions) {
        const position = pos.position;

        for (const card of botCards) {
            const cardData = card.Card;
            if (!cardData) continue;

            const captures = countCapturesAt(fullBoard, position, cardData, player_1, player_2);

            const isCorner = corners.includes(position);
            const isCenter = position === center;

            if (captures > maxCaptures) {
                best = { position, cardId: card.card_id };
                maxCaptures = captures;
            } else if (captures === maxCaptures && best) {
                const wasCorner = corners.includes(best.position);
                const willBeCorner = isCorner;

                if (!wasCorner && willBeCorner) {
                    best = { position, cardId: card.card_id };
                } else if (!isCorner && isCenter && position === center) {
                    best = { position, cardId: card.card_id };
                }
            }
        }
    }

    if (maxCaptures === 0) {
        const cornerPlay = availablePositions.find((pos) => corners.includes(pos.position));
        if (cornerPlay) {
            return { position: cornerPlay.position, cardId: botCards[0].card_id };
        }

        const edgePlay = availablePositions.find((pos) => edges.includes(pos.position));
        if (edgePlay) {
            return { position: edgePlay.position, cardId: botCards[0].card_id };
        }

        const anyPlay = availablePositions[0];
        return { position: anyPlay.position, cardId: botCards[0].card_id };
    }

    return best;
}

function countCapturesAt(board, atPosition, card, humanId, botId) {
    const cardValues = {
        power_up: card.power_up,
        power_right: card.power_right,
        power_down: card.power_down,
        power_left: card.power_left
    };

    const offsets = [
        { dir: "up", dx: 0, dy: -1, power: cardValues.power_up, rivalPowerKey: "power_down" },
        { dir: "right", dx: 1, dy: 0, power: cardValues.power_right, rivalPowerKey: "power_left" },
        { dir: "down", dx: 0, dy: 1, power: cardValues.power_down, rivalPowerKey: "power_up" },
        { dir: "left", dx: -1, dy: 0, power: cardValues.power_left, rivalPowerKey: "power_right" }
    ];

    let captures = 0;

    const row = Math.floor(atPosition / 3);
    const col = atPosition % 3;

    for (const off of offsets) {
        const r = row + off.dy;
        const c = col + off.dx;

        if (r < 0 || r > 2 || c < 0 || c > 2) continue;

        const rivalPos = r * 3 + c;
        const rivalSlot = board.find((b) => b.position === rivalPos);

        if (!rivalSlot || rivalSlot.card_id === null) continue;
        if (rivalSlot.owner_id !== humanId) continue;

        const rivalPowerStr = off.rivalPowerKey;
        const rivalPower = rivalSlot.Card ? rivalSlot.Card[rivalPowerStr] : 0;

        if (off.power > rivalPower) {
            captures++;
        }
    }

    return captures;
}

export default {
    placeCard,
    checkGameEnd,
    botMove
};