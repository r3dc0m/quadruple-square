import models from "../models/index.js";
import db from "../config/db.js";
import bcrypt from 'bcryptjs';

const ADMIN_CONFIG = {
    user_id: 1,
    user_name: process.env.ADMIN_USERNAME || 'admin',
    user_email: process.env.ADMIN_EMAIL || 'admin@quadruple-square.com',
    user_password: await bcrypt.hash(process.env.ADMIN_PASSWORD || 'admin123', 10),
    user_currency: parseInt(process.env.ADMIN_CURRENCY) || 4181,
    when_created: new Date(),
    is_admin: true
};

const seedAll = async () => {
    const { User, Player, Card, PlayerCard } = models;

    console.log("Seeding database...");

    await Player.bulkCreate([
        { player_id: 1, player_name: 'Nimda Eno', is_bot: false },
        { player_id: 2, player_name: 'Resu Aton', is_bot: true }
    ], { ignoreDuplicates: true });

    await User.bulkCreate([
        ADMIN_CONFIG
    ], { ignoreDuplicates: true });

    await Card.bulkCreate([
        { card_id: 1, card_name: 'Anonymous Shire Duck', image_path: 'img/duck1.png', power_up: 1, power_right: 3, power_down: 1, power_left: 5, rarity: 'D' },
        { card_id: 2, card_name: 'Bree Pond Duck', image_path: 'img/duck1.png', power_up: 1, power_right: 4, power_down: 5, power_left: 3, rarity: 'D' },
        { card_id: 3, card_name: 'Wild Anduin Duck', image_path: 'img/duck1.png', power_up: 3, power_right: 1, power_down: 1, power_left: 5, rarity: 'D' },
        { card_id: 4, card_name: 'Hobbiton Farm Duck', image_path: 'img/duck1.png', power_up: 2, power_right: 2, power_down: 5, power_left: 2, rarity: 'D' },
        { card_id: 5, card_name: 'Absent-minded Fangorn Duck', image_path: 'img/duck1.png', power_up: 1, power_right: 5, power_down: 4, power_left: 1, rarity: 'D' },
        { card_id: 6, card_name: 'Rivendell Duck', image_path: 'img/duck1.png', power_up: 3, power_right: 1, power_down: 3, power_left: 5, rarity: 'D' },
        { card_id: 7, card_name: 'Lothlórien Duck', image_path: 'img/duck1.png', power_up: 2, power_right: 6, power_down: 1, power_left: 4, rarity: 'D' },
        { card_id: 8, card_name: 'Elven Messenger Duck', image_path: 'img/duck1.png', power_up: 4, power_right: 4, power_down: 5, power_left: 1, rarity: 'D' },
        { card_id: 9, card_name: 'Rohan Scout Duck', image_path: 'img/duck1.png', power_up: 4, power_right: 3, power_down: 2, power_left: 6, rarity: 'D' },
        { card_id: 10, card_name: 'Gondor Duck', image_path: 'img/duck1.png', power_up: 3, power_right: 5, power_down: 1, power_left: 5, rarity: 'D' },
        { card_id: 11, card_name: 'Grey Havens Duck', image_path: 'img/duck1.png', power_up: 5, power_right: 4, power_down: 4, power_left: 2, rarity: 'D' },
        { card_id: 12, card_name: 'Mordor Night Duck', image_path: 'img/duck1.png', power_up: 5, power_right: 2, power_down: 4, power_left: 5, rarity: 'D' },
        { card_id: 13, card_name: 'Saruman Spy Duck', image_path: 'img/duck1.png', power_up: 4, power_right: 8, power_down: 2, power_left: 1, rarity: 'D' },
        { card_id: 14, card_name: 'Isengard Duck', image_path: 'img/duck1.png', power_up: 7, power_right: 3, power_down: 3, power_left: 5, rarity: 'D' },
        { card_id: 15, card_name: 'Dead Marshes Duck', image_path: 'img/duck1.png', power_up: 6, power_right: 1, power_down: 6, power_left: 4, rarity: 'D' },
        { card_id: 16, card_name: 'Brave Shire Duck', image_path: 'img/duck1.png', power_up: 7, power_right: 2, power_down: 5, power_left: 4, rarity: 'D' },
        { card_id: 17, card_name: 'Sam’s Friend Duck', image_path: 'img/duck1.png', power_up: 8, power_right: 1, power_down: 3, power_left: 6, rarity: 'D' },
        { card_id: 18, card_name: 'Suspicious Gollum Duck', image_path: 'img/duck1.png', power_up: 7, power_right: 7, power_down: 3, power_left: 2, rarity: 'D' },
        { card_id: 19, card_name: 'Nazgûl Witness Duck', image_path: 'img/duck1.png', power_up: 8, power_right: 4, power_down: 1, power_left: 5, rarity: 'D' },
        { card_id: 20, card_name: 'Shelob Survivor Duck', image_path: 'img/duck1.png', power_up: 4, power_right: 8, power_down: 5, power_left: 2, rarity: 'D' },
        { card_id: 21, card_name: 'Gandalf’s Trusted Duck', image_path: 'img/duck1.png', power_up: 1, power_right: 9, power_down: 1, power_left: 9, rarity: 'D' },
        { card_id: 22, card_name: 'Moria Guide Duck', image_path: 'img/duck1.png', power_up: 2, power_right: 7, power_down: 7, power_left: 2, rarity: 'D' },
        { card_id: 23, card_name: 'Helm’s Deep Battle Duck', image_path: 'img/duck1.png', power_up: 1, power_right: 8, power_down: 8, power_left: 1, rarity: 'D' },
        { card_id: 24, card_name: 'Minas Tirith Herald Duck', image_path: 'img/duck1.png', power_up: 8, power_right: 3, power_down: 2, power_left: 7, rarity: 'D' },
        { card_id: 25, card_name: 'Fellowship Duck', image_path: 'img/duck1.png', power_up: 5, power_right: 5, power_down: 9, power_left: 1, rarity: 'D' },
        { card_id: 26, card_name: 'Frodo’s Companion Duck', image_path: 'img/duck1.png', power_up: 3, power_right: 9, power_down: 5, power_left: 3, rarity: 'D' },
        { card_id: 27, card_name: 'Bombadil Philosopher Duck', image_path: 'img/duck1.png', power_up: 9, power_right: 2, power_down: 4, power_left: 5, rarity: 'D' },
        { card_id: 28, card_name: 'Galadriel Radiant Duck', image_path: 'img/duck1.png', power_up: 6, power_right: 3, power_down: 6, power_left: 5, rarity: 'D' },
        { card_id: 29, card_name: 'Legolas Archer Duck', image_path: 'img/duck1.png', power_up: 5, power_right: 6, power_down: 7, power_left: 2, rarity: 'D' },
        { card_id: 30, card_name: 'Gimli Miner Duck', image_path: 'img/duck1.png', power_up: 4, power_right: 7, power_down: 6, power_left: 3, rarity: 'D' },

        { card_id: 31, card_name: 'Aragorn Tracker Duck', image_path: 'img/duck1.png', power_up: 3, power_right: 2, power_down: 5, power_left: 6, rarity: 'C' },
        { card_id: 32, card_name: 'Sam Gardener Duck', image_path: 'img/duck1.png', power_up: 6, power_right: 1, power_down: 8, power_left: 4, rarity: 'C' },
        { card_id: 33, card_name: 'Merry and Pippin Curious Duck', image_path: 'img/duck1.png', power_up: 2, power_right: 4, power_down: 8, power_left: 5, rarity: 'C' },
        { card_id: 34, card_name: 'Ring Witness Duck', image_path: 'img/duck1.png', power_up: 5, power_right: 3, power_down: 7, power_left: 4, rarity: 'C' },
        { card_id: 35, card_name: 'Corruption Resistant Duck', image_path: 'img/duck1.png', power_up: 6, power_right: 4, power_down: 2, power_left: 7, rarity: 'C' },
        { card_id: 36, card_name: 'Dragonfire Duck', image_path: 'img/duck1.png', power_up: 4, power_right: 2, power_down: 9, power_left: 4, rarity: 'C' },
        { card_id: 37, card_name: 'Elrond Wise Duck', image_path: 'img/duck1.png', power_up: 7, power_right: 2, power_down: 5, power_left: 5, rarity: 'C' },
        { card_id: 38, card_name: 'Círdan Ancient Duck', image_path: 'img/duck1.png', power_up: 3, power_right: 7, power_down: 3, power_left: 6, rarity: 'C' },
        { card_id: 39, card_name: 'Sea Crossing Duck', image_path: 'img/duck1.png', power_up: 5, power_right: 4, power_down: 4, power_left: 6, rarity: 'C' },
        { card_id: 40, card_name: 'Second Age Duck', image_path: 'img/duck1.png', power_up: 5, power_right: 3, power_down: 6, power_left: 5, rarity: 'C' },

        { card_id: 41, card_name: 'Celebrimbor Smith Duck', image_path: 'img/duck1.png', power_up: 3, power_right: 5, power_down: 4, power_left: 7, rarity: 'B' },
        { card_id: 42, card_name: 'Sauron Witness Duck', image_path: 'img/duck1.png', power_up: 7, power_right: 1, power_down: 6, power_left: 5, rarity: 'B' },
        { card_id: 43, card_name: 'Barad-dur Infiltrator Duck', image_path: 'img/duck1.png', power_up: 5, power_right: 5, power_down: 7, power_left: 2, rarity: 'B' },
        { card_id: 44, card_name: 'Morgoth Dark Duck', image_path: 'img/duck1.png', power_up: 6, power_right: 4, power_down: 3, power_left: 6, rarity: 'B' },
        { card_id: 45, card_name: 'Deep Time Duck', image_path: 'img/duck1.png', power_up: 7, power_right: 3, power_down: 1, power_left: 8, rarity: 'B' },
        { card_id: 46, card_name: 'Beleriand Legendary Duck', image_path: 'img/duck1.png', power_up: 2, power_right: 6, power_down: 7, power_left: 4, rarity: 'B' },
        { card_id: 47, card_name: 'Luthien Friend Duck', image_path: 'img/duck1.png', power_up: 5, power_right: 2, power_down: 4, power_left: 8, rarity: 'B' },
        { card_id: 48, card_name: 'Beren Helper Duck', image_path: 'img/duck1.png', power_up: 4, power_right: 5, power_down: 8, power_left: 2, rarity: 'B' },
        { card_id: 49, card_name: 'Silmarils Radiant Duck', image_path: 'img/duck1.png', power_up: 9, power_right: 1, power_down: 9, power_left: 1, rarity: 'B' },
        { card_id: 50, card_name: 'Valinor Eternal Duck', image_path: 'img/duck1.png', power_up: 2, power_right: 2, power_down: 8, power_left: 7, rarity: 'B' },
        { card_id: 51, card_name: 'Valar Duck', image_path: 'img/duck1.png', power_up: 1, power_right: 1, power_down: 9, power_left: 8, rarity: 'B' },
        { card_id: 52, card_name: 'Manwë Duck', image_path: 'img/duck1.png', power_up: 7, power_right: 5, power_down: 2, power_left: 5, rarity: 'B' },
        { card_id: 53, card_name: 'Ulmo Duck', image_path: 'img/duck1.png', power_up: 1, power_right: 9, power_down: 5, power_left: 5, rarity: 'B' },
        { card_id: 54, card_name: 'Yavanna Sacred Duck', image_path: 'img/duck1.png', power_up: 3, power_right: 5, power_down: 9, power_left: 3, rarity: 'B' },
        { card_id: 55, card_name: 'Celestial Duck', image_path: 'img/duck1.png', power_up: 5, power_right: 4, power_down: 2, power_left: 9, rarity: 'B' },
        { card_id: 56, card_name: 'Primordial Duck', image_path: 'img/duck1.png', power_up: 5, power_right: 6, power_down: 3, power_left: 6, rarity: 'B' },
        { card_id: 57, card_name: 'Creation Song Duck', image_path: 'img/duck1.png', power_up: 2, power_right: 7, power_down: 6, power_left: 5, rarity: 'B' },
        { card_id: 58, card_name: 'Ainur Music Duck', image_path: 'img/duck1.png', power_up: 3, power_right: 6, power_down: 7, power_left: 4, rarity: 'B' },
        { card_id: 59, card_name: 'Transcendental Duck', image_path: 'img/duck1.png', power_up: 4, power_right: 7, power_down: 6, power_left: 3, rarity: 'B' },
        { card_id: 60, card_name: 'Omnipresent Duck', image_path: 'img/duck1.png', power_up: 5, power_right: 8, power_down: 5, power_left: 2, rarity: 'B' },

        { card_id: 61, card_name: 'Absolute Mythic Duck', image_path: 'img/duck1.png', power_up: 6, power_right: 3, power_down: 4, power_left: 7, rarity: 'A' },
        { card_id: 62, card_name: 'Chosen of Destiny Duck', image_path: 'img/duck1.png', power_up: 7, power_right: 4, power_down: 3, power_left: 6, rarity: 'A' },
        { card_id: 63, card_name: 'Balance Guardian Duck', image_path: 'img/duck1.png', power_up: 8, power_right: 5, power_down: 2, power_left: 5, rarity: 'A' },
        { card_id: 64, card_name: 'Ring Resistant Duck', image_path: 'img/duck1.png', power_up: 9, power_right: 6, power_down: 1, power_left: 4, rarity: 'A' },
        { card_id: 65, card_name: 'Ring Master Duck', image_path: 'img/duck1.png', power_up: 7, power_right: 2, power_down: 8, power_left: 3, rarity: 'A' },
        { card_id: 66, card_name: 'Lord of Ducks', image_path: 'img/duck1.png', power_up: 8, power_right: 3, power_down: 7, power_left: 2, rarity: 'A' },
        { card_id: 67, card_name: 'Supreme Dark Duck', image_path: 'img/duck1.png', power_up: 9, power_right: 4, power_down: 6, power_left: 1, rarity: 'A' },
        { card_id: 68, card_name: 'Supreme Light Duck', image_path: 'img/duck1.png', power_up: 2, power_right: 3, power_down: 9, power_left: 8, rarity: 'A' },
        { card_id: 69, card_name: 'End of Times Duck', image_path: 'img/duck1.png', power_up: 3, power_right: 4, power_down: 8, power_left: 9, rarity: 'A' },
        { card_id: 70, card_name: 'History Reset Duck', image_path: 'img/duck1.png', power_up: 4, power_right: 5, power_down: 7, power_left: 8, rarity: 'A' },
        { card_id: 71, card_name: 'Wisest Duck', image_path: 'img/duck1.png', power_up: 5, power_right: 6, power_down: 6, power_left: 7, rarity: 'A' },
        { card_id: 72, card_name: 'Invincible Duck', image_path: 'img/duck1.png', power_up: 6, power_right: 7, power_down: 5, power_left: 6, rarity: 'A' },
        { card_id: 73, card_name: 'Immortal Duck', image_path: 'img/duck1.png', power_up: 7, power_right: 8, power_down: 4, power_left: 5, rarity: 'A' },
        { card_id: 74, card_name: 'Ultimate Legendary Duck', image_path: 'img/duck1.png', power_up: 8, power_right: 9, power_down: 3, power_left: 4, rarity: 'A' },
        { card_id: 75, card_name: 'Middle Earth Alpha Duck', image_path: 'img/duck1.png', power_up: 9, power_right: 1, power_down: 2, power_left: 9, rarity: 'A' },
        { card_id: 76, card_name: 'Unfathomable Duck', image_path: 'img/duck1.png', power_up: 1, power_right: 2, power_down: 9, power_left: 8, rarity: 'A' },
        { card_id: 77, card_name: 'All Seeing Duck', image_path: 'img/duck1.png', power_up: 2, power_right: 3, power_down: 8, power_left: 9, rarity: 'A' },
        { card_id: 78, card_name: 'All Knowing Duck', image_path: 'img/duck1.png', power_up: 3, power_right: 4, power_down: 7, power_left: 1, rarity: 'A' },
        { card_id: 79, card_name: 'All Deciding Duck', image_path: 'img/duck1.png', power_up: 4, power_right: 5, power_down: 6, power_left: 2, rarity: 'A' },
        { card_id: 80, card_name: 'Hidden Narrator Duck', image_path: 'img/duck1.png', power_up: 5, power_right: 6, power_down: 5, power_left: 3, rarity: 'A' },

        { card_id: 81, card_name: 'World Consciousness Duck', image_path: 'img/duck1.png', power_up: 9, power_right: 9, power_down: 1, power_left: 9, rarity: 'S' },
        { card_id: 82, card_name: 'Meta Historical Duck', image_path: 'img/duck1.png', power_up: 8, power_right: 4, power_down: 5, power_left: 7, rarity: 'S' },
        { card_id: 83, card_name: 'Out of Time Duck', image_path: 'img/duck1.png', power_up: 6, power_right: 7, power_down: 6, power_left: 4, rarity: 'S' },
        { card_id: 84, card_name: 'Secondary Creator Duck', image_path: 'img/duck1.png', power_up: 5, power_right: 3, power_down: 10, power_left: 1, rarity: 'S' },
        { card_id: 85, card_name: 'Archetypal Duck', image_path: 'img/duck1.png', power_up: 9, power_right: 1, power_down: 9, power_left: 5, rarity: 'S' },
        { card_id: 86, card_name: 'Symbol of Destiny Duck', image_path: 'img/duck1.png', power_up: 9, power_right: 5, power_down: 2, power_left: 9, rarity: 'S' },
        { card_id: 87, card_name: 'Final Balance Duck', image_path: 'img/duck1.png', power_up: 8, power_right: 4, power_down: 4, power_left: 10, rarity: 'S' },
        { card_id: 88, card_name: 'Total Transcendent Duck', image_path: 'img/duck1.png', power_up: 5, power_right: 3, power_down: 10, power_left: 8, rarity: 'S' },
        { card_id: 89, card_name: 'Absolute Duck', image_path: 'img/duck1.png', power_up: 7, power_right: 7, power_down: 10, power_left: 1, rarity: 'S' },
        { card_id: 90, card_name: 'Infinite Duck', image_path: 'img/duck1.png', power_up: 8, power_right: 5, power_down: 10, power_left: 3, rarity: 'S' },
        { card_id: 91, card_name: 'Omniscient Duck', image_path: 'img/duck1.png', power_up: 10, power_right: 7, power_down: 1, power_left: 7, rarity: 'S' },
        { card_id: 92, card_name: 'Omnipotent Duck', image_path: 'img/duck1.png', power_up: 7, power_right: 10, power_down: 4, power_left: 6, rarity: 'S' },
        { card_id: 93, card_name: 'Omniduck 😄', image_path: 'img/duck1.png', power_up: 9, power_right: 2, power_down: 10, power_left: 4, rarity: 'S' },
        { card_id: 94, card_name: 'Supreme Arda Duck', image_path: 'img/duck1.png', power_up: 10, power_right: 6, power_down: 7, power_left: 6, rarity: 'S' },
        { card_id: 95, card_name: 'Pond Origin Duck', image_path: 'img/duck1.png', power_up: 9, power_right: 10, power_down: 3, power_left: 8, rarity: 'S' },
        { card_id: 96, card_name: 'Pre Water Duck', image_path: 'img/duck1.png', power_up: 2, power_right: 9, power_down: 10, power_left: 5, rarity: 'S' },
        { card_id: 97, card_name: 'Pre Time Duck', image_path: 'img/duck1.png', power_up: 10, power_right: 2, power_down: 9, power_left: 6, rarity: 'S' },
        { card_id: 98, card_name: 'Original Music Duck', image_path: 'img/duck1.png', power_up: 10, power_right: 8, power_down: 2, power_left: 5, rarity: 'S' },
        { card_id: 99, card_name: 'Pure Idea Duck', image_path: 'img/duck1.png', power_up: 9, power_right: 6, power_down: 8, power_left: 5, rarity: 'S' },
        { card_id: 100, card_name: 'Beyond Canon Duck', image_path: 'img/duck1.png', power_up: 10, power_right: 4, power_down: 3, power_left: 8, rarity: 'S' },
        { card_id: 101, card_name: 'Legendarium Duck', image_path: 'img/duck1.png', power_up: 7, power_right: 8, power_down: 6, power_left: 5, rarity: 'S' },
        { card_id: 102, card_name: 'Ainur Duck', image_path: 'img/duck1.png', power_up: 10, power_right: 10, power_down: 3, power_left: 3, rarity: 'S' },
        { card_id: 103, card_name: 'Ilúvatar Duck', image_path: 'img/duck1.png', power_up: 8, power_right: 7, power_down: 5, power_left: 6, rarity: 'S' },
        { card_id: 104, card_name: 'Creation Echo Duck', image_path: 'img/duck1.png', power_up: 4, power_right: 9, power_down: 7, power_left: 5, rarity: 'S' },
        { card_id: 105, card_name: 'Root of All Duck', image_path: 'img/duck1.png', power_up: 5, power_right: 8, power_down: 6, power_left: 7, rarity: 'S' },
        { card_id: 106, card_name: 'Ultimate Duck', image_path: 'img/duck1.png', power_up: 9, power_right: 3, power_down: 7, power_left: 6, rarity: 'S' },
        { card_id: 107, card_name: 'Final Duck', image_path: 'img/duck1.png', power_up: 6, power_right: 5, power_down: 8, power_left: 7, rarity: 'S' },
        { card_id: 108, card_name: 'Eternal Duck', image_path: 'img/duck1.png', power_up: 2, power_right: 10, power_down: 10, power_left: 4, rarity: 'S' },
        { card_id: 109, card_name: 'Total Duck', image_path: 'img/duck1.png', power_up: 9, power_right: 5, power_down: 10, power_left: 4, rarity: 'S' },
        { card_id: 110, card_name: 'The One Duck 🦆', image_path: 'img/duck1.png', power_up: 10, power_right: 1, power_down: 9, power_left: 9, rarity: 'S' }

    ], { ignoreDuplicates: true });

    await PlayerCard.bulkCreate([
        { player_id: 1, card_id: 1, amount: 34 },
        { player_id: 1, card_id: 2, amount: 13 },
        { player_id: 1, card_id: 3, amount: 21 },
        { player_id: 1, card_id: 5, amount: 5 },
        { player_id: 1, card_id: 8, amount: 13 },
        { player_id: 1, card_id: 102, amount: 1 },
        { player_id: 2, card_id: 1, amount: 1 },
        { player_id: 2, card_id: 6, amount: 1 },
        { player_id: 2, card_id: 7, amount: 1 },
        { player_id: 2, card_id: 8, amount: 1 },
        { player_id: 2, card_id: 9, amount: 1 },
        { player_id: 2, card_id: 55, amount: 1 }
    ], { ignoreDuplicates: true });

    //flush PK maxval in pg so ORM doesn't glitch when creating new records...
    await db.query(`SELECT setval(pg_get_serial_sequence('games', 'game_id'), COALESCE((SELECT MAX(game_id) FROM games), 1))`);
    await db.query(`SELECT setval(pg_get_serial_sequence('users', 'user_id'), COALESCE((SELECT MAX(user_id) FROM users), 1))`);
    await db.query(`SELECT setval(pg_get_serial_sequence('cards', 'card_id'), COALESCE((SELECT MAX(card_id) FROM cards), 1))`);
    await db.query(`SELECT setval(pg_get_serial_sequence('players', 'player_id'), COALESCE((SELECT MAX(player_id) FROM players), 1))`);

    console.log("All seed data inserted successfully!");
};

export default seedAll;