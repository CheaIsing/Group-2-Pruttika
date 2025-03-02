const { handleResponseError } = require("../../utils/handleError");
const { executeQuery } = require("../../utils/dbQuery");
const { sendResponse } = require("../../utils/response");
const { use } = require("i18next");

const followUser = async (req, res) => {
  const followerId = req.user.id; 
  const followeeId = req.params.id; 

  try {
    if (followerId == followeeId) {
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

const removeFollower = async (req, res) => {
  const followeeId = req.user.id; 
  const followerId = req.params.id;

  try {
    const query =
      "DELETE FROM tbl_follower WHERE followee_id = ? AND follower_id = ?";
    const result = await executeQuery(query, [followeeId, followerId]);

    if (result.affectedRows === 0) {
      return sendResponse(res, 400, false, "This user is not follow you");
    }

    sendResponse(res, 200, true, "Remove this user from follower successfully.");
  } catch (error) {
    console.log(error);
    handleResponseError(res, error);
  }
};

const getFollowers = async (req, res) => {
  const userId = req.params.id; // Logged-in user

  try {
    const query = `
      SELECT u.id, u.eng_name AS user_name, u.email AS user_email ,u.role,u.avatar , tor.organization_name ,tor.business_email
      FROM tbl_follower f
      INNER JOIN tbl_users u ON f.follower_id = u.id
      LEFT JOIN tbl_organizer tor ON u.id=tor.user_id
      WHERE f.followee_id = ? AND f.follower_id != ?
    `; 

    const followers = await executeQuery(query, [userId, userId]);
    const role={
      1:"Guest",
      2:"Organizer",
      3:"Admin"
    }

    const followerList=[];
    followers.forEach(item => {
      followerList.push({
        id:item.id,
        name:item.user_name,
        email: item.email,
        avatar: item.avatar,
        role: role[item.role],
        organizer:{
          name: item.organization_name,
          business_email:item.business_email
        }
      })
    });

    sendResponse(
      res,
      200,
      true,
      "Followers retrieved successfully.",
      followerList
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
      SELECT f.followee_id , u.eng_name AS user_name, u.email AS user_email ,u.role,u.avatar , tor.organization_name ,tor.business_email
      FROM tbl_follower f
      INNER JOIN tbl_users u ON f.follower_id = u.id
      LEFT JOIN tbl_organizer tor ON u.id=tor.user_id
      WHERE f.follower_id = ? AND f.followee_id != ?`; 

    const following = await executeQuery(query, [userId, userId]);

    // if (following.length === 0) {
    //   return sendResponse(res, 404, false, "You are not following anyone.");
    // }

    const role={
      1:"Guest",
      2:"Organizer",
      3:"Admin"
    }

    const followingList=[];
    following.forEach(item => {
      followingList.push({
        id:item.followee_id,
        name:item.user_name,
        email: item.email,
        avatar: item.avatar,
        role: role[item.role],
        organizer:{
          name: item.organization_name,
          business_email :item.business_email
        }
      })
    });

    sendResponse(
      res,
      200,
      true,
      "Following list retrieved successfully.",
      followingList
    );
  } catch (error) {
    console.log(error);
    handleResponseError(res, error);
  }
};

module.exports = {
  followUser,
  unfollowUser,
  removeFollower,
  getFollowers,
  getFollowing,
};
