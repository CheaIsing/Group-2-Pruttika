const getErrorPage = (req, res) => {
  res.render("pages/static/404", { title: "404" });
};
const getPolicy = (req, res) => {
  res.render("pages/static/policy", { title: "Private Policy" });
};
const getTerms = (req, res) => {
  res.render("pages/static/termOfservice", { title: "Term Of Service" });
};
const getAbout = (req, res) => {
  res.render("pages/static/aboutus", { title: "About Us" });
};
const getContact = (req, res) => {
  res.render("pages/static/contactus", { title: "Contact Us" });
};
const getFaq = (req, res) => {
  res.render("pages/static/faq", { title: "FAQs" });
};

module.exports = { getErrorPage, getPolicy, getTerms,getAbout, getContact, getFaq };
