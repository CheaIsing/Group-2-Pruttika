const { executeQuery } = require("../../../utils/dbQuery"); 

const getAdminDashboard = async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res.redirect("auth/login"); 
    }

    const userId = req.user.id;
    const sql = "SELECT * FROM tbl_users WHERE id = ?";
    const data = await executeQuery(sql, [userId]);

    if (data.length === 0) {
      return res.redirect("auth/login");
    }

    const user = data[0];
    res.render("pages/admin/index", { user }); 
  } catch (error) {
    console.error(error);
    res.redirect("/login"); 
  }
};

module.exports = {
  getAdminDashboard,
};
