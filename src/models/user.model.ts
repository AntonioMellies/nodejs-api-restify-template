import { matchPassword } from './../utils/password.utils';
import * as mongoose from 'mongoose';
import * as restfy from 'restify'
import { hashPassword } from '../utils/password.utils';

export interface User extends mongoose.Document {
    name: string;
    email: string;
    password: string;
    profiles: string;
    active: boolean;
    matchPassword(password: string): boolean;
    hasAny(...profiles: string[]): boolean;
}

const userSchema = new mongoose.Schema<User>({
    name: {
        type: String,
        require: true
    },
    email: {
        type: String,
        unique: true,
        require: true
    },
    password: {
        type: String,
        select: false,
        require: true
    },
    profiles: {
        type: [String]
    },
    active: {
        type: Boolean,
        default: true
    }
})

userSchema.methods.matchPassword = function (password: string): boolean {
    return matchPassword(password, this.password)
}

userSchema.methods.hasAny = function (...profiles: string[]): boolean {
    return profiles.some(profile => this.profiles.indexOf(profile) !== -1)
}

const saveMiddleware = function (next: restfy.Next) {
    const user: User = this
    if (!user.isModified('password')) {
        next();
    } else {
        hashPassword(user, next);
    }
}

const updateMiddleware = function (next: restfy.Next) {
    if (!this.getUpdate()['password']) {
        next();
    } else {
        hashPassword(this.getUpdate(), next);
    }
}

userSchema.pre('save', saveMiddleware)
userSchema.pre('update', updateMiddleware)
userSchema.pre('findOneAndUpdate', updateMiddleware)

export const User = mongoose.model<User>('User', userSchema)