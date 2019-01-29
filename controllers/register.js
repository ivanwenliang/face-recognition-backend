const handleRegister = (req, res, db, bcrypt) => {
    const { email, name, password } = req.body;
    // Login validation 
    // Form fields must not be empty
    if (!email || !name || !password) {
        return res.status(400).json('Incorrect Form Submission');
    }
    // Hash password with bcrypt
    const hash = bcrypt.hashSync(password);
        // Transactions for consistent data
        db.transaction(trx => {
            trx.insert({
                hash: hash,
                email: email
            })
            .into('login')
            .returning('email')
            .then(loginEmail => {
                return trx('users')
                    .returning('*')
                    .insert({
                        email: loginEmail[0],
                        name: name,
                        joined: new Date()
                    })
                    .then(user => {
                        res.json(user[0]);
                    })
            })
            // If success, then commit all changes
            .then(trx.commit)
            // Else rollback changes
            .catch(trx.rollback)
        })
        .catch(err => res.status(400).json('Unable to register'))
}

module.exports = {
    handleRegister: handleRegister
};