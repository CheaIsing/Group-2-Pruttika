const { executeQuery } = require("../../../utils/dbQuery");
const { handleResponseError } = require("../../../utils/handleError");
const { sendResponse } = require("../../../utils/response");

const displayAllOrganizer = async (req, res) => {
    try {
        const query = "SELECT * FROM tbl_organizer_req WHERE status = 2";

        const data = executeQuery(query);
        sendResponse(res, 200, true, "Display all organzer", data);
    } catch (error) {
        console.log(error);
        handleResponseError(res, error);
    }
};

module.exports = {
    displayAllOrganizer,
}