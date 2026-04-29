import db from "../config/db.js";

import UserModel from "./User.model.js";
import BotModel from "./Bot.model.js";
import CardModel from "./Card.model.js";
import GameModel from "./Game.model.js";
import GameBoardModel from "./GameBoard.model.js";
import GameSelectedCardModel from "./GameSelectedCard.model.js";
import PlayerCardModel from "./PlayerCard.model.js";

const models = {
    User: UserModel(db),
    Bot: BotModel(db),
    Card: CardModel(db),
    Game: GameModel(db),
    GameBoard: GameBoardModel(db),
    GameSelectedCard: GameSelectedCardModel(db),
    PlayerCard: PlayerCardModel(db),
};

models.Game.belongsTo(models.User, { foreignKey: "user_id" });

models.Game.belongsTo(models.Bot, { foreignKey: "bot_id" });

models.PlayerCard.belongsTo(models.Card, { foreignKey: "card_id" });

models.PlayerCard.belongsTo(models.User, { foreignKey: "user_id" });
models.User.hasMany(models.PlayerCard, { foreignKey: "user_id" });

models.PlayerCard.belongsTo(models.Bot, { foreignKey: "bot_id" });
models.Bot.hasMany(models.PlayerCard, { foreignKey: "bot_id" });

models.GameBoard.belongsTo(models.Game, { foreignKey: "game_id" });

models.GameSelectedCard.belongsTo(models.Game, { foreignKey: "game_id" });

export default models;
