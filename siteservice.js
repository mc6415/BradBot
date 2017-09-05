exports.isLoggedIn = (req) =>{
    return !!req.session.user;
};