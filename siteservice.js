exports.isLoggedIn = (req) =>{
    console.log("Problem Here");
    return !!req.session.user;
};