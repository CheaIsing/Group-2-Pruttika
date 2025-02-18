const getCreateEvent = (req, res) => {
  res.render("pages/event/create-event", {title: "Create Event"});
};
const getUpdateEvent = (req, res) => {
  res.render("pages/event/update-event", {title: "Update Event"});
};
const getEventDetail = (req, res)=>{
  res.render("pages/event/eventdetails", {title: "Event Detail"});
}

module.exports = {
  getCreateEvent,
  getUpdateEvent,
  getEventDetail
};
