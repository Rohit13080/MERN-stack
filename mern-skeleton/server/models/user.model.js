import mongoose from 'mongoose'
const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        required: 'Name is required'
        },
    email: {
        type: String,
        trim: true,
        unique: 'Email already exists',
        match: [/.+\@.+\..+/, 'Please fill a valid email address'],
        required: 'Email is required'
        },
    created: {
        type: Date,
        default: Date.now
    },
    updated: Date,
    hashed_password: {
        type: String,
        required: "Password is required"
    },
    salt: String               
 })
/*The password string that's provided by the user is not stored directly in the user
document. Instead, it is handled as a virtual field.
When the password value is received on user creation or update, it is encrypted into
a new hashed value and set to the hashed_password field, along with the
unique salt value in the salt field. */
UserSchema.virtual('password')
            .set(function(password){
                this._password=password
                this.salt=this.makeSalt()
                this.hashed_password=this.encryptPassword(password)
            })
            .get(function(){
                return this._password
            })

/* the password validation criteria simple in our application and ensure that a password value is provided and it has a length of at least six characters when a
new user is created or an existing password is updated. We achieve this by adding
custom validation to check the password value before Mongoose attempts to store the
hashed_password value */
UserSchema.path('hashed_password').validate(function(v){
    if (this._password && this._password.length < 6){
        this.invalidate('password','Password must be at least 6 characters.')
    }
    if (this.isNew && !this._password){
        this.invalidate('password','Password is required')
    }
},null)


UserSchema.methods = {
    authenticate: function(plainText){
        /*This method is called to verify sign-in attempts by
        matching the user-provided password text with the hashed_password
        stored in the database for a specific user.  */
        return this.encryptPassword(plainText)===this.hashed_password
    
    },
    encryptPassword: function(password){
        /*This method is used to generate an encrypted hash
        from the plain-text password and a unique salt value using the crypto
        module from Node. */
        if(!password) return ''
        try {
            return crypto
                .createHmac('sha1',this.salt)
                .update(password)
                .digest('hex')
        } catch (err){
            return '' 
        }
    },
    makeSalt: function(){
        /*This method generates a unique and random salt value using
        the current timestamp at execution and Math.random(). */
        return Math.round((new Date().valueOf()*Math.random()))+''
    }
}
export default mongoose.model('User',UserSchema)