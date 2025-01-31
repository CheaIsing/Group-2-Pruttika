const { handleResponseError } = require("../../utils/handleError");
const { executeQuery } = require("../../utils/dbQuery");
const { sendResponse } = require("../../utils/response");

const followUser = async (req, res) => {
  const followerId = req.user.id;
  const followeeId = req.params.id;

  try {
    
    if (followerId === followeeId) {
      return sendResponse(res, 400, false, "You cannot follow yourself.");
    }

    const checkQuery =
      "SELECT * FROM tbl_follower WHERE follower_id = ? AND followee_id = ?";
    const checkResult = await executeQuery(checkQuery, [
      followerId,
      followeeId,
    ]);

    if (checkResult.length > 0) {
      return sendResponse(
        res,
        400,
        false,
        "You are already following this user."
      );
    }

    const query =
      "INSERT INTO tbl_follower (follower_id, followee_id, created_at, updated_at) VALUES (?, ?, NOW(), NOW())";
    await executeQuery(query, [followerId, followeeId]);

    sendResponse(res, 200, true, "User followed successfully.");
  } catch (error) {
    console.error(error);
    handleResponseError(res, error);
  }
};

const unfollowUser = async (req, res) => {
  const followerId = req.user.id;
  const followeeId = req.params.id;

  try {
    const query =
      "DELETE FROM tbl_follower WHERE follower_id = ? AND followee_id = ?";
    const result = await executeQuery(query, [followerId, followeeId]);

    if (result.affectedRows === 0) {
      return sendResponse(res, 400, false, "You are not following this user.");
    }

    sendResponse(res, 200, true, "User unfollowed successfully.");
  } catch (error) {
    console.log(error);
    handleResponseError(res, error);
  }
};

const getFollowers = async (req, res) => {
  const userId = req.params.id;

  try {
    const query = `
            SELECT u.id, u.eng_name, u.email FROM tbl_follower AS f INNER JOIN tbl_users AS u ON f.follower_id = u.id WHERE f.followee_id = ?
        `;

    const followers = await executeQuery(query, [userId]);

    sendResponse(
      res,
      200,
      true,
      "Followers retrieved successfully.",
      followers
    );
  } catch (error) {
    console.log(error);
    handleResponseError(res, error);
  }
};

const getFollowing = async (req, res) => {
  const userId = req.params.id;

  try {
    const query = `
            SELECT u.id, u.eng_name, u.email FROM tbl_follower AS f INNER JOIN tbl_users AS u ON f.followee_id = u.id WHERE f.follower_id = ?
        `;

    const following = await executeQuery(query, [userId]);

    sendResponse(
      res,
      200,
      true,
      "Following list retrieved successfully.",
      following
    );
  } catch (error) {
    console.log(error);
    handleResponseError(res, error);
  }
};

module.exports = {
  followUser,
  unfollowUser,
  getFollowers,
  getFollowing,
};
