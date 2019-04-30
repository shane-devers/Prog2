const tokenSignIn = async function(req){
    const {OAuth2Client} = require('google-auth-library');
    const client = new OAuth2Client('845596870958-sjnd8u9h2togiqlj0e3r7ofg59lc23nr.apps.googleusercontent.com');
    async function verify() {
        const ticket = await client.verifyIdToken({
            idToken: req.body.idtoken,
            audience: '845596870958-sjnd8u9h2togiqlj0e3r7ofg59lc23nr.apps.googleusercontent.com',  // Specify the CLIENT_ID of the app that accesses the backend
            // Or, if multiple clients access the backend:
            //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
        });
        const payload = ticket.getPayload();
        const userid = payload['sub'];
        console.log(payload);
        console.log('Userid'+userid);
        // If request specified a G Suite domain:
        //const domain = payload['hd'];
    }
    try {
        await verify();
        return true;
    } catch(error) {
        return false;
    }
}

module.exports.tokenSignIn = tokenSignIn;