const getNotification = (req, res)=>{
    res.render("pages/notification/notification", { title: "Notification" });
}

module.exports = { getNotification };