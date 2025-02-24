const getLanding = (req, res) => {

    if (!req.user || !req.user.role) {
      return res.render("index", {
        title: "Landing",
      });
    }else if (req.user.role == 1 || req.user.role == 2) {
      return res.redirect("/homepage")
    }else{
      return res.redirect("/admin");
    }
};
const getHomepage = (req, res) => {


      res.render("homepage", {
        title: "Homepage",
      });

};

module.exports = {getLanding, getHomepage};
