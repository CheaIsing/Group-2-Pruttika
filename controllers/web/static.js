const getErrorPage = (req, res)=>{
    res.render("pages/static/404", {title: "404"})
}

module.exports = {getErrorPage}