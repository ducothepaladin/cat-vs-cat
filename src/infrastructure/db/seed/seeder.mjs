import mongoose from 'mongoose';
import dotenv from "dotenv";

dotenv.config();

const userSchema = new mongoose.Schema({
    email: String,
    name: String,
    password: String,
});

const User = mongoose.model('User', userSchema);

async function main() {
    await mongoose.connect(process.env.DATABASE_URL);

    const users = [
        { email: 'carol@example.com', name: 'Carol', password: 'password123' },
        { email: 'dave@example.com', name: 'Dave', password: 'password123' },
        { email: 'eve@example.com', name: 'Eve', password: 'password123' },
    ];

    for (const user of users) {
        await User.updateOne(
            { email: user.email },
            { $setOnInsert: user },
            { upsert: true }
        );
    }

    console.log('User seeding completed.');
    await mongoose.disconnect();
}

main().catch((e) => {
    console.error(e);
    process.exit(1);
});
