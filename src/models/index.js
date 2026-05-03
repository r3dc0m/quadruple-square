import db from "../config/db.js";
import UserModel from "./User.model.js";
import PlayerModel from "./Player.model.js";
import CardModel from "./Card.model.js";
import GameModel from "./Game.model.js";
import GameBoardModel from "./GameBoard.model.js";
import GameSelectedCardModel from "./GameSelectedCard.model.js";
import PlayerCardModel from "./PlayerCard.model.js";

const models = {
    User: UserModel(db),
    Player: PlayerModel(db),
    Card: CardModel(db),
    Game: GameModel(db),
    GameBoard: GameBoardModel(db),
    GameSelectedCard: GameSelectedCardModel(db),
    PlayerCard: PlayerCardModel(db),
};

models.User.belongsTo(models.Player, { foreignKey: "user_id", targetKey: "player_id" });
models.Player.hasOne(models.User, { foreignKey: "user_id", sourceKey: "player_id" });

models.Game.belongsTo(models.Player, {
    as: "Player1",
    foreignKey: "player_1",
    targetKey: "player_id",
});
models.Game.belongsTo(models.Player, {
    as: "Player2",
    foreignKey: "player_2",
    targetKey: "player_id",
});

models.GameBoard.belongsTo(models.Game, {
    foreignKey: "game_id",
});
models.Game.hasMany(models.GameBoard, {
    foreignKey: "game_id",
});

models.GameSelectedCard.belongsTo(models.Game, {
    foreignKey: "game_id",
});
models.GameSelectedCard.belongsTo(models.Player, {
    foreignKey: "player_id",
});
models.Player.hasMany(models.GameSelectedCard, {
    foreignKey: "player_id",
});

models.PlayerCard.belongsTo(models.Player, { foreignKey: "player_id" });
models.Player.hasMany(models.PlayerCard, { foreignKey: "player_id" });

models.PlayerCard.belongsTo(models.Card, { foreignKey: "card_id" });
models.Card.hasMany(models.PlayerCard, { foreignKey: "card_id" });

models.GameSelectedCard.belongsTo(models.Card, { foreignKey: "card_id" });
models.Card.hasMany(models.GameSelectedCard, { foreignKey: "card_id" });

models.GameBoard.belongsTo(models.Card, {
    foreignKey: "card_id",
    as: "Card"
});

models.Card.hasMany(models.GameBoard, {
    foreignKey: "card_id"
});

export default models;
export { db as sequelize };