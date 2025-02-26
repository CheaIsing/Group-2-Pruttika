

const getFollowers = (req, res) => {
  res.render("pages/follow/follower", {title: "Follower"});
};
const getFollowing = (req, res) => {
  res.render("pages/follow/following", {title: "Following"});
};

module.exports = {

  getFollowers,
  getFollowing
};
