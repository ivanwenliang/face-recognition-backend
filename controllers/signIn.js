const handleSignIn = (req, res, db, bcrypt) => {
    const { email, password } = req.body;
    // Validation for empty sign in
    if (!email || !password) {
        return res.status(400).json('Incorrect Form Submission');
    }
    db.select('email', 'hash').from('login')
        .where('email', '=', email)
        .then(data => {
            // Check hash and given password
            const isValid = bcrypt.compareSync(password, data[0].hash);
            if (isValid) {
                return db.select('*').from('users')
                    .where('email', '=', email)
                    .then(user => {
                        res.json(user[0])
                    })
                    .catch(err => res.status(400).json('Unable to get user'))
            } else {
                res.status(400).json('Wrong Credentials')
            }
        })
        .catch(err => res.status(400).json('Wrong Credentials'))
}

module.exports = {
    handleSignIn: handleSignIn
}