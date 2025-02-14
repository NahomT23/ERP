"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
const authRoutes_1 = __importDefault(require("./routes/authRoute/authRoutes"));
const salesRoute_1 = __importDefault(require("./routes/salesRoute/salesRoute"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = 5000;
app.use((0, cors_1.default)({
    origin: '*',
    credentials: true,
}));
app.use(express_1.default.json());
app.options('*', (0, cors_1.default)()); // Handle preflight requests for all routes
app.use('/auth/', authRoutes_1.default);
app.use('/sale/', salesRoute_1.default);
app.listen(PORT, () => {
    console.log(`Server is running on port: ${PORT}`);
});
