const { executeQuery } = require("../../../utils/dbQuery");

const getAdminDashboard = async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res.redirect("auth/login");
    }

    const userId = req.user.id;

    const userSql = "SELECT * FROM tbl_users WHERE id = ?";
    const userData = await executeQuery(userSql, [userId]);

    if (userData.length === 0) {
      return res.redirect("auth/login");
    }

    const totalUsersSql = "SELECT COUNT(*) AS totalUsers FROM tbl_users";
    const totalEventsSql = "SELECT COUNT(*) AS totalEvents FROM tbl_event";
    const totalCategoriesSql =
      "SELECT COUNT(*) AS totalCategories FROM tbl_category";
    const totalTicketsSql = "SELECT COUNT(*) AS totalTickets FROM tbl_ticket";

    const [totalUsers] = await executeQuery(totalUsersSql);
    const [totalEvents] = await executeQuery(totalEventsSql);
    const [totalCategories] = await executeQuery(totalCategoriesSql);
    const [totalTickets] = await executeQuery(totalTicketsSql);

    const recentEventSql =
      "SELECT * FROM tbl_event ORDER BY created_at DESC LIMIT 1";
    const [recentEvent] = await executeQuery(recentEventSql);

    const ticketCategoriesSql = "SELECT * FROM tbl_category";
    const ticketCategories = await executeQuery(ticketCategoriesSql);

    res.render("pages/admin/index", {
      user: userData[0], 
      totalUsers: totalUsers.totalUsers || 0,
      totalEvents: totalEvents.totalEvents || 0,
      totalCategories: totalCategories.totalCategories || 0,
      totalTickets: totalTickets.totalTickets || 0, 
      recentEvent: recentEvent || null,
      ticketCategories: ticketCategories || [],
    });
  } catch (error) {
    console.error(error);
    res.redirect("/login?error=true");
  }
};

module.exports = {
  getAdminDashboard,
};
