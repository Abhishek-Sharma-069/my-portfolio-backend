const mongoose = require('mongoose');
require('dotenv').config({ path: './.env' });

const resetDatabase = async () => {
    try {
        console.log('Connecting to MongoDB...');
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        // Drop the existing collection
        console.log('Dropping existing portfoliodatas collection...');
        await mongoose.connection.db.collection('portfoliodatas').drop().catch(() => {
            console.log('Collection portfoliodatas did not exist or could not be dropped');
        });

        console.log('Database reset completed successfully!');
        console.log('You can now run: npm run setup');

    } catch (error) {
        console.error('Error during database reset:', error);
    } finally {
        await mongoose.disconnect();
        console.log('Disconnected from MongoDB.');
    }
};

resetDatabase();


