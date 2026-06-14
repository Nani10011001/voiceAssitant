import express from "express";
import cors from "cors";
const app = express();
const serverStart = () => {
    try {
        app.listen(4000, () => console.log("server is running successfully"));
    }
    catch (error) {
        console.log(error);
        process.exit(1);
    }
};
serverStart();
//# sourceMappingURL=index.js.map