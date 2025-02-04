const { executeQuery } = require("../../../utils/dbQuery");
const { handleResponseError } = require("../../../utils/handleError");
const { sendResponse } = require("../../../utils/response");
const bcrypt = require("bcrypt");

const changeEmail = async (req, res) => {
    const { email } = req.body;
    const userId = req.user.id;

    try {
        const query = "UPDATE tbl_users SET email = ? WHERE id = ?";

        await executeQuery(query, [email, userId]);

        sendResponse(res, 200, true, "Updated email successfully.");
    } catch (error) {
        console.log(error);
        handleResponseError(res, error);
    }
}

const changePassword = async (req, res) => {
    const { oldPass, newPass, passConfirm  } = req.body;
    const userId = req.user.id;

    try {
        const query = "SELECT password FROM tbl_users WHERE id = ?";

        const data = await executeQuery(query, [userId]);

        if (data.length === 0) {
            sendResponse(res, 404, false, "User not found.");
        }

        const storedHashedPass = data[0].password;
        const isMatch = bcrypt.compare(oldPass, storedHashedPass);

        if (!isMatch) {
            sendResponse(res, 401, false, "Old password is incorrect.");
        }

        if (newPass !== passConfirm) {
            sendResponse(res, 401, false, "Password do not match.");
        }

        const newHashedPass = await bcrypt.hash(newPass, 10);

        const updateQuery = "UPDATE tbl_users SET password = ? WHERE id = ?";

        await executeQuery(updateQuery, [newHashedPass, userId]);

        sendResponse(res, 200, true, "Updated password successfully");
    } catch (error) {
        console.log(error);
        handleResponseError(res, error);
    }

}

module.exports = {
    changeEmail,
    changePassword
}