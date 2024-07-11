const errorHandler = (err, req, res, next) => {
    console.log(err);

    if (err.name === 'notFound') {
        res.status(404).json({ message: err.message });
    } else if (err.name === 'exist') {
        res.status(400).json({ message: err.message });
    } else if (err.name === 'invalidCredentials') {
        res.status(401).json({ message: err.message });
    } else if (err.name === 'Unauthenticated') {
        res.status(401).json({ message: err.message });
    } else if (err.name === 'Unauthorized') {
        res.status(403).json({ message: err.message });
    } else if (err.name === 'invalidInput') {
        res.status(400).json({ message: err.message });
    } else if (err.name === 'failedToCreate') {
        res.status(400).json({ message: err.message });
    } else if (err.name === 'failedToUpdate') {
        res.status(400).json({ message: err.message });
    } else if (err.name === 'failedToDelete') {
        res.status(400).json({ message: err.message });
    } else {
        res.status(500).json({ message: 'Internal Server Error'});
    }
}

module.exports = errorHandler;