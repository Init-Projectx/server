const errorHandler = (err, req, res, next) => {
    let errorMessage = '';
    console.log(err);

    switch (err.name) {
        //Register & Login
        case 'emailAlreadyExist':
            errorMessage = 'Email Already Exist';
            res.status(400).json({ message: errorMessage });
            break;

        case 'userNameAlreadyExist':
            errorMessage = 'Username Already Exist';
            res.status(400).json({ message: errorMessage });
            break;

        case 'passwordToShort':
            errorMessage = 'Password Must Contain At least 8 Character';
            res.status(400).json({ message: errorMessage });
            break;

        case 'invalidCredentials':
            errorMessage = 'Invalid Credentials';
            res.status(400).json({ message: errorMessage });
            break;

        case 'unauthenticated':
            errorMessage = 'Authentication Required';
            res.status(401).json({ message: errorMessage });
            break;

        case 'unauthorized':
            errorMessage = 'Authorization Required'
            res.status(401).json({ message: errorMessage });


        default:
            console.log(err);
            errorMessage = 'Internal Server Error';
            res.status(500).json({ message: errorMessage });
            break;
    }
}

module.exports = errorHandler;