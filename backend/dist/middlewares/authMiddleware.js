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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authentication = void 0;
const jsonwebtoken_1 = require("jsonwebtoken");
const prisma_1 = __importDefault(require("../prisma"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
    throw new Error('JWT_SECRET environment variable is not defined');
}
const authentication = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    // Check if Authorization header exists
    if (!req.header('Authorization')) {
        res.status(401).json({ message: 'Unauthorized' });
        return;
    }
    // Extract the token from the header
    const token = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(' ')[1];
    if (!token) {
        res.status(400).json({ message: 'Token not found' });
        return;
    }
    try {
        // Decode the token
        const decoded = (0, jsonwebtoken_1.verify)(token, JWT_SECRET);
        const user = yield prisma_1.default.user.findUnique({
            where: {
                email: decoded.email,
            },
        });
        if (!user) {
            res.status(404).json({ message: 'User not found' });
            return;
        }
        // Attach the user object to the request
        req.user = user;
        next();
    }
    catch (err) {
        console.error(err); // Log error for debugging purposes
        res.status(401).json({ message: 'Invalid or expired token' });
    }
});
exports.authentication = authentication;
