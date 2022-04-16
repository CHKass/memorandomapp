const bcrypt = require("bcryptjs")
const usersCollection = require('../db').db().collection("users")
const validator = require("validator")
const md5 = require("md5")

let User = function(data, getAvatar) {
	this.data = data
	this.errors = []
	if (getAvatar == undefined) {getAvatar = false}
	if (getAvatar) {this.getAvatar()}
}

User.prototype.cleanUp = function() {
	if (typeof(this.data.username) != "string") {this.data.username = ""}
	if (typeof(this.data.email) != "string") {this.data.email = ""}
	if (typeof(this.data.password) != "string") {this.data.password = ""}

// Code to avoid bogus properties being inserted (ie. anything that is not a string eg. a function or an array)
	this.data = {
		username: this.data.username,
		email: this.data.email.trim().toLowerCase(),
		password: this.data.password
	}
}

User.prototype.validate = function() {
	return new Promise(async (resolve, reject) => {
		if (this.data.username == "") {this.errors.push("You must provide a username")}
// Username validation
		if (this.data.username != "" && !validator.isAlphanumeric(this.data.username)) {this.errors.push("The username can only contain letters and numbers")}
// Email validation
		if (!validator.isEmail(this.data.email)) {this.errors.push("You must provide a valide email address")}
	
		if (this.data.password == "") {this.errors.push("You must provide a password")}
// Password validation
		if (this.data.password.length > 0 && this.data.password.length < 8) {this.errors.push("Password should be at least 8 characters long")}
		if (this.data.password.length > 50) {this.errors.push("Password cannot exceed 50 characters")}
// Username validation
		if (this.data.username.length > 0 && this.data.password.length < 3) {this.errors.push("Username should be at least 3 characters long")}
		if (this.data.username.length > 30) {this.errors.push("Username cannot exceed 30 characters")}
	
// Only if username is valid then check to see if it is already taken
		if (this.data.username.length > 2 && this.data.username.length < 31 && validator.isAlphanumeric(this.data.username)) {
			let usernameExists = await usersCollection.findOne({username: this.data.username})
			if (usernameExists) {this.errors.push("That username is already taken")}
		}	
	
// Only if email is valid then check to see if it is already taken
		if (validator.isEmail(this.data.email)) {
			let emailExists = await usersCollection.findOne({email: this.data.email})
			if (emailExists) {this.errors.push("That email is already being used")}
		}	
		resolve()
	})
}

User.prototype.login = function() {
	return new Promise((resolve, reject) => {
		this.cleanUp()
		usersCollection.findOne({username: this.data.username}).then((attemptedUser) => {
			if (attemptedUser && bcrypt.compareSync(this.data.password, attemptedUser.password)) {
				this.data = attemptedUser
				this.getAvatar()
				resolve("Well done, you're through")
			} else {
				reject("Invalid username or password")
			}
		}).catch(function() {
			reject("Please try again later")
		})
	})
}

User.prototype.register = function() {
	return new Promise(async (resolve, reject) => {
// Step One: Validate user data
		this.cleanUp()
		await this.validate()
	
// Step Two: Only if there are no validation errors then save the user data into database
		if (!this.errors.length) {
// Hash user password
			let salt = bcrypt.genSaltSync(10)
			this.data.password = bcrypt.hashSync(this.data.password, salt)
			await usersCollection.insertOne(this.data)
			this.getAvatar()
			resolve()
		} else {
			reject(this.errors)
		}
	})
}

User.prototype.getAvatar = function() {
	this.avatar = `https://gravatar.com/avatar/${md5(this.data.email)}?s=128`
}

User.findByUsername = function(username) {
	return new Promise(function(resolve, reject) {
		if (typeof(username) != "string") {
			reject()
			return
		}
		usersCollection.findOne({username: username}).then(function(userDoc) {
			if (userDoc) {
				userDoc = new User(userDoc, true)
				userDoc = {
					_id: userDoc.data._id,
					username: userDoc.data.username,
					avatar: userDoc.avatar
				}
				resolve(userDoc)
			} else {
				reject()
			}
		}).catch(function() {
			reject()
		})
	})
}

User.doesEmailExist = function(email) {
	return new Promise(async function(resolve, reject) {
		if (typeof(email) != "string") {
			resolve(false)
			return
		}
		let user = await usersCollection.findOne({email: email})
		if (user) {
			resolve(true)
		} else {
			resolve(false)
		}
	})
}

module.exports = User