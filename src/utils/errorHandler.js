const handleError = (res, playerId, error, pageTitle = "Error", contentView = "new-game-error", status = 500) => {
    console.error(`Error in controller: ${error.message}`);
    res.status(status).render("layout", {
        pageTitle,
        currentPage: "newgame",
        contentView,
        playerId,
        error: error.message
    });
};

export default handleError;