const { PORT } = require("../config/config.js");
const connectDB = require("../config/db.js");
const app = require("./app.js");

const StartServer = async () => {
    try {
        const res = await connectDB();

        if (res) {
            app.listen(PORT, () => {
                console.log(`Server Start on PORT ${PORT}`);
            })
        }
    } catch (error) {
        if (error.name === 'MongooseServerSelectionError') {
            console.error('Server Selection Error: Unable to connect to MongoDB');
            console.error('Check if your MongoDB URI is correct or DB is running');
        } else {
            console.error('MongoDB Connection Error:', error.message);
        }

    }
}

StartServer();