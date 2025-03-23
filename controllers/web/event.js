const getCreateEvent = (req, res) => {
  res.render("pages/event/create-event", {title: "Create Event", active : "event"});
};
const getUpdateEvent = (req, res) => {
  res.render("pages/event/update-event", {title: "Update Event", active: "event"});
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
  res.render("pages/event/event", {title: "Manage Event", active : "event"});
}

const getRequestEventList = (req, res)=>{
  res.render("pages/event/event-request", {title: "Request Ticket", active : "request"});
}

const getRequestTicketList = (req, res)=>{
  res.render("pages/event/request-ticket-list", {title: "Request Ticket List", active : "request"});
}

const getCheckInTicketList = (req, res)=>{
  res.render("pages/event/checkin-ticket-list", {title: "Check-In Ticket List", active : "checkin"});
}

const getRequestTransaction = (req, res)=>{
  res.render("pages/event/request-transaction", {title: "Request Transaction", active : "request"});
}

const getCheckInEventList = (req, res)=>{
  res.render("pages/event/event-checkin", {title: "Check In Ticket", active : "checkin"});
}

const getSummaryData = (req, res) => {
  res.render("pages/event/summary", {title: "Summary Event", active : "event"});
}

const getEventManageDetail = (req, res) => {
  res.render("pages/event/event-manage-detail", {title: "Event Detail"});
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
  getCheckInEventList,
  getSummaryData,
  getEventManageDetail
};
