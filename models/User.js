class User {
    constructor(fullName, birthDate, phone, document, job, authKey) {
        this.fullName = fullName;
        this.birthDate = birthDate;
        this.phone = phone;
        this.document = document; 
        this.job = job; 
        this.authKey = authKey;
    }
}

module.exports = User;