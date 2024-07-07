const findAll = async (req, res, next) => {}

const findOne = async (req, res, next) => {}

const updateStatus = async (req, res, next) => {}

// Bisa handle payment by midtrans || manual
const payment = async (req, res, next) => {}

// menerima webhook dari midtrans
const handleNotification = async (req, res, next) => {}


module.exports = {findAll, findOne, updateStatus, payment, handleNotification};