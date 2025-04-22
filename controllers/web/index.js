const getLanding = (req, res) => {
  console.log("is landing");

  return res.render("index", {
    title: "Landing",
  });
};
const getHomepage = (req, res) => {
  return res.render("homepage", {
    title: "Homepage",
  });
};

module.exports = { getLanding, getHomepage };
