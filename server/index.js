var express = require('express')
var app = express() // the main app
const jwt = require('jsonwebtoken');

const credentials = {
    client: {
        id: "fdded31f-8489-42c5-b4c9-25e18f9814bb",
        secret: "MKrZJ_Yc@=hxax6l:bZgVB4SzvbJ4cF8",
    },
    auth: {
        tokenHost: 'https://login.microsoftonline.com',
        authorizePath: 'common/oauth2/v2.0/authorize',
        tokenPath: 'common/oauth2/v2.0/token'
    }
};
const oauth2 = require('simple-oauth2').create(credentials);

/**
 * 
 * 
 * 
 *    Login API
 * 
 * 
 */

app.get('/api/auth', function (req, res) {
    res.redirect(getAuthUrl());
});
app.get('/api/cb', function (req, res) {
    const code = req.query.code;
    getTokenFromCode(code, res).then((token) => {
        res.redirect("/login");
    });
});
router.get('/api/signout', function (req, res, next) {
    clearCookies(res);

    // Redirect to home
    res.redirect('/');
});

/**
 * 
 * 
 *    API 
 * 
 * 
 * 
*/







app.listen(3000);

/**
 * 
 * 
 *   Helper Functions
 * 
 * 
 */
function saveValuesToCookie(token, res) {
    // Parse the identity token
    const user = jwt.decode(token.token.id_token);

    // Save the access token in a cookie
    res.cookie('graph_access_token', token.token.access_token, { maxAge: 3600000, httpOnly: true });
    // Save the user's name in a cookie
    res.cookie('graph_user_name', user.name, { maxAge: 3600000, httpOnly: true });
}
function clearCookies(res) {
    // Clear cookies
    res.clearCookie('graph_access_token', { maxAge: 3600000, httpOnly: true });
    res.clearCookie('graph_user_name', { maxAge: 3600000, httpOnly: true });
    res.clearCookie('graph_refresh_token', { maxAge: 7200000, httpOnly: true });
    res.clearCookie('graph_token_expires', { maxAge: 3600000, httpOnly: true });
}
function getAuthUrl() {
    const returnVal = oauth2.authorizationCode.authorizeURL({
        redirect_uri: process.env.ROOT_URL + "/api/cb",
        scope: "openid profile User.Read tasks.readwrite"
    });
    return returnVal;
}
async function getTokenFromCode(auth_code, res) {

    let result = await oauth2.authorizationCode.getToken({
        code: auth_code,
        redirect_uri: process.env.ROOT_URL + "/api/cb",
        scope: "openid profile User.Read tasks.readwrite"
    });

    const token = oauth2.accessToken.create(result);
    saveValuesToCookie(token, res);
    return token.token.access_token;
}