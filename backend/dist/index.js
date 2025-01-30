"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const prisma_1 = __importDefault(require("./prisma"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = require("jsonwebtoken");
const authMiddleware_1 = require("./middlewares/authMiddleware");
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
dotenv_1.default.config();
const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
    throw new Error('JWT_SECRET environment variable is not defined');
}
const generatejwt = (user) => {
    return (0, jsonwebtoken_1.sign)({ email: user.email }, JWT_SECRET);
};
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, cors_1.default)());
const PORT = 3000;
// Route to create a new user
app.post('/auth/signup', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { password, email, username } = req.body;
        // Check if the email is already taken
        const existingUser = yield prisma_1.default.user.findUnique({
            where: { email }
        });
        if (existingUser) {
            res.status(400).json({ message: 'Email is already in use' });
            return; // Early exit after sending response
        }
        const hashedPassword = yield bcryptjs_1.default.hash(password, 10);
        const user = yield prisma_1.default.user.create({
            data: { email, username, password: hashedPassword }
        });
        const { password: _password } = user, userWithoutPassword = __rest(user, ["password"]);
        res.status(201).json(Object.assign(Object.assign({}, userWithoutPassword), { token: generatejwt(user) }));
    }
    catch (err) {
        res.status(500).json({ message: 'Server error, please try again' });
    }
}));
// Route for user signin
app.post('auth/signin', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield prisma_1.default.user.findUnique({
            where: {
                email: req.body.email
            }
        });
        if (!user) {
            res.status(404).json({ message: 'User not found' });
            return;
        }
        const isPasswordCorrect = yield bcryptjs_1.default.compare(req.body.password, user.password);
        if (!isPasswordCorrect) {
            res.status(400).json({ message: 'Incorrect password' });
            return;
        }
        res.status(200).json({ message: 'Signed in successfully', token: generatejwt(user) });
    }
    catch (err) {
        res.status(500).json({ message: 'Credentials do not match or server error' });
    }
}));
// Protected route to get the current user (me)
app.get('auth/me', authMiddleware_1.authentication, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.user) {
            res.status(401).json({ message: 'Unauthorized' });
            return;
        }
        res.status(200).json(req.user);
    }
    catch (err) {
        next(err);
    }
}));
app.listen(PORT, () => {
    console.log(`Server is running on port: ${PORT}`);
});
