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

module.exports = {
  getCreateEvent,
  getUpdateEvent,
  getEventDetail,
  getBrowseEvent,
  getWishlist,
  getEventList
};
