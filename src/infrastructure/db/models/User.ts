import mongoose from "mongoose";
import bcrypt from "bcrypt";

const Schema = mongoose.Schema;


const friendSchema = new Schema({
    userId: {type: Schema.Types.ObjectId, ref: 'User'}
},{
    _id: false
})

const userSchema = new Schema({
    name: {type: String, required: true, trim: true},
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    friends: {type: [friendSchema], default: []}
}, {timestamps: true});


userSchema.pre('save', async function (next) {
    if(!this.isModified('password')) return next();
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt)
    next();
});

userSchema.methods.comparePassword = async function (plain: string) {
    return await bcrypt.compare(plain, this.password);
}


const User = mongoose.model('User', userSchema);
export default User;