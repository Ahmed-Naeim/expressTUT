const verifyRoles = (...allowedRoles) => {
    return (req, res, next) => {
        if (!req?.roles) {
            return res.sendStatus(401); //Unauthorized
        }
        const rolesArray = [...allowedRoles];
        //check if the user has any of the allowed roles
        const result = req.roles
            .map(role => rolesArray.includes(role))
            .find(val => val === true);
        if (!result) {
            return res.sendStatus(401); //Unauthorized
        }
        next();
    };
};
module.exports = verifyRoles;
