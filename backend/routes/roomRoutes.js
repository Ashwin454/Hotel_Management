const express = require("express");
const router = express.Router();
const { editRoom, getAllRooms, deleteRoom} = require("../controller/roomController");

router.route('/edit-room').post(editRoom);
router.route('/getAllRooms').post(getAllRooms);
router.route('/delete-room').post(deleteRoom);

module.exports = router;