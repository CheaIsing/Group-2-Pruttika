const getCreateEvent = (req, res) => {
  res.render("pages/event/create-event", {title: "Create Event"});
};

module.exports = {
  getCreateEvent,
};
