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
exports.createRateLimiter = exports.generateJwt = void 0;
exports.isAccountLocked = isAccountLocked;
exports.handleFailedLogin = handleFailedLogin;
exports.resetFailedAttempts = resetFailedAttempts;
const jsonwebtoken_1 = require("jsonwebtoken");
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const prisma_1 = __importDefault(require("../../prisma"));
const date_fns_1 = require("date-fns");
const MAX_FAILED_ATTEMPTS = 5;
const LOCKOUT_DURATION_MINUTES = 15;
const generateJwt = (user) => {
    return (0, jsonwebtoken_1.sign)({ email: user.email }, process.env.JWT_SECRET, { expiresIn: '1h' });
};
exports.generateJwt = generateJwt;
const createRateLimiter = (windowMs, maxRequests, message) => {
    return (0, express_rate_limit_1.default)({
        windowMs,
        max: maxRequests,
        message,
    });
};
exports.createRateLimiter = createRateLimiter;
// CHECKING THE USER
function isAccountLocked(email) {
    return __awaiter(this, void 0, void 0, function* () {
        const user = yield prisma_1.default.user.findUnique({ where: { email } });
        if (!user)
            return false;
        if (user.lockoutUntil && (0, date_fns_1.isAfter)(new Date(), user.lockoutUntil)) {
            yield prisma_1.default.user.update({
                where: { email },
                data: { failedLoginAttempts: 0, lockoutUntil: null },
            });
            return false;
        }
        user.lockoutUntil && (0, date_fns_1.isAfter)(user.lockoutUntil, new Date());
    });
}
//  COUNT FOR FAILED LOGIN ATTEMPTS
function handleFailedLogin(email) {
    return __awaiter(this, void 0, void 0, function* () {
        const user = yield prisma_1.default.user.findUnique({ where: { email } });
        if (!user)
            return;
        const failedAttempts = user.failedLoginAttempts + 1;
        if (failedAttempts >= MAX_FAILED_ATTEMPTS) {
            yield prisma_1.default.user.update({
                where: { email },
                data: {
                    failedLoginAttempts: failedAttempts,
                    lockoutUntil: (0, date_fns_1.addMinutes)(new Date(), LOCKOUT_DURATION_MINUTES),
                },
            });
        }
        else {
            yield prisma_1.default.user.update({
                where: { email },
                data: { failedLoginAttempts: failedAttempts },
            });
        }
    });
}
// TO RESET THE LOGIN ATTEMPTS WHEN THE USER SIGNS IN
function resetFailedAttempts(email) {
    return __awaiter(this, void 0, void 0, function* () {
        yield prisma_1.default.user.update({
            where: { email },
            data: { failedLoginAttempts: 0, lockoutUntil: null },
        });
    });
}
