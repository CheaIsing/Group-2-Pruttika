const getCreateEvent = (req, res) => {
  res.render("pages/event/create-event", {title: "Create Event"});
};
const getUpdateEvent = (req, res) => {
  res.render("pages/event/update-event", {title: "Update Event"});
};

module.exports = {
  getCreateEvent,
  getUpdateEvent
};
