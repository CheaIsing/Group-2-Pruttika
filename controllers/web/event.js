const getCreateEvent = (req, res) => {
  res.render("pages/event/create-event", {title: "Create Event"});
};
const getUpdateEvent = (req, res) => {
  res.render("pages/event/update-event", {title: "Update Event"});
};
const getEventDetail = (req, res)=>{
  res.render("pages/event/eventdetails", {title: "Event Detail"});
}

const getBrowseEvent = (req, res)=>{
  res.render("pages/event/browse-event", {title: "Browse Event"});
}

const getWishlist = (req, res)=>{
  res.render("pages/event/wishlist", {title: "Wishlist"});
}

const getEventList = (req, res)=>{
  res.render("pages/event/event", {title: "Manage Event"});
}

const getRequestEventList = (req, res)=>{
  res.render("pages/event/event-request", {title: "Request Ticket"});
}

const getRequestTicketList = (req, res)=>{
  res.render("pages/event/request-ticket-list", {title: "Request Ticket List"});
}

const getCheckInTicketList = (req, res)=>{
  res.render("pages/event/checkin-ticket-list", {title: "Check-In Ticket List"});
}

const getRequestTransaction = (req, res)=>{
  res.render("pages/event/request-transaction", {title: "Request Transaction"});
}

const getCheckInEventList = (req, res)=>{
  res.render("pages/event/event-checkin", {title: "Check In Ticket"});
}

module.exports = {
  getCreateEvent,
  getUpdateEvent,
  getEventDetail,
  getBrowseEvent,
  getWishlist,
  getEventList,
  getRequestEventList,
  getRequestTicketList,
  getCheckInTicketList,
  getRequestTransaction,
  getCheckInEventList
};
