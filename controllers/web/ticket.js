const getMyTickets = (req, res) => {
  res.render("pages/ticket/my-ticket", { title: "My Tickets" });
};
const getBuyTickets = (req, res) => {
  res.render("pages/ticket/buy-ticket", { title: "Purchase Ticket" });
};

module.exports = { getMyTickets, getBuyTickets };
