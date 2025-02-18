const getAdminDashboard = (req, res) => {
  res.render("pages/admin/index");
};

module.exports = {
  getAdminDashboard,
};
