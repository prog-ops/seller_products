import app from './app.js';
import db from './config/Database.js';

const PORT = process.env.PORT || 5000;

(async () => {
    try {
        await db.authenticate();
        console.log('Database connected.');
        await db.sync();
        console.log('Models synchronized.');
        app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
    } catch (err) {
        console.error('Failed to start server:', err);
        process.exit(1);
    }
})();
