const getRequestTickets = (req, res) => {
  res.render("pages/ticket/requestTicket", { title: "Request Ticket" });
};

module.exports = { getRequestTickets };
