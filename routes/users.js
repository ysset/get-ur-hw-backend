const app = require('express').Router();
const passport = require('passport');

app.get("/login/success", (req, res) => {
    if (req.user) {
        res.json({
            success: true,
            massage: "OK",
            user: req.user,
            cookies: req.cookies,
        });
    } else {
        throw "Fail"
    }
});

app.get("/login/failed", (req, res) => {
    res.status(401).json({
        success: false,
        massage: "fail",
    });
});

app.get("/logout", (req, res) => {
    req.logout();
    res.redirect("https://hw.hitmarker.pro")
});

app.get("/vkontakte", passport.authenticate("vkontakte"));

app.get(
    "/vkontakte/redirect",
    passport.authenticate("vkontakte", {
        successRedirect: "https://hw.hitmarker.pro",
        failureRedirect: "/auth/login/failed",
    })
);

module.exports = app;
