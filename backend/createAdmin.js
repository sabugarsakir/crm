import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import validator from 'validator';
import readline from 'readline';
import 'dotenv/config';
import userModel from './models/User.js';

// Setup readline interface for interactive CLI
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const askQuestion = (query) => {
    return new Promise((resolve) => rl.question(query, resolve));
};

const connectDB = async () => {
    const mongoUri = process.env.MONGODB_URI;
    if (!mongoUri) {
        console.error('Error: MONGODB_URI is not defined in the environment variables.');
        process.exit(1);
    }
    try {
        await mongoose.connect(mongoUri);
        console.log('Successfully connected to MongoDB.');
    } catch (error) {
        console.error('Database connection error:', error.message);
        process.exit(1);
    }
};

const main = async () => {
    console.log('=========================================');
    console.log('      FCP ADMIN CREATION UTILITY         ');
    console.log('=========================================\n');

    await connectDB();

    try {
        // 1. Get Name
        let name = '';
        while (!name.trim()) {
            name = await askQuestion('Enter Admin Name: ');
            if (!name.trim()) {
                console.log('Name is required.');
            }
        }

        // 2. Get Email
        let email = '';
        while (true) {
            email = await askQuestion('Enter Admin Email: ');
            if (!email.trim()) {
                console.log('Email is required.');
                continue;
            }
            if (!validator.isEmail(email)) {
                console.log('Invalid email format. Please enter a valid email address.');
                continue;
            }
            // Check if email already exists
            const existingEmail = await userModel.findOne({ email });
            if (existingEmail) {
                console.log('A user with this email already exists.');
                continue;
            }
            break;
        }

        // 3. Get Phone Number
        let numberStr = '';
        let numberValue = null;
        while (true) {
            numberStr = await askQuestion('Enter Admin Phone Number: ');
            if (!numberStr.trim()) {
                console.log('Phone number is required.');
                continue;
            }
            if (!validator.isMobilePhone(numberStr)) {
                console.log('Invalid phone number. Please enter a valid mobile number.');
                continue;
            }
            numberValue = Number(numberStr);
            if (isNaN(numberValue)) {
                console.log('Phone number must be a valid number.');
                continue;
            }
            // Check if phone number already exists
            const existingNumber = await userModel.findOne({ number: numberValue });
            if (existingNumber) {
                console.log('A user with this phone number already exists.');
                continue;
            }
            break;
        }

        // 4. Get Password
        let password = '';
        while (true) {
            password = await askQuestion('Enter Admin Password (min 6 chars): ');
            if (password.length < 6) {
                console.log('Password must be at least 6 characters long.');
                continue;
            }
            break;
        }

        // 5. Get Location
        const locations = ['Bangalore', 'Noida', 'NCR', 'Delhi', 'Hyderabad', 'Other'];
        let location = '';
        while (true) {
            console.log('\nSelect Location:');
            locations.forEach((loc, idx) => {
                console.log(`${idx + 1}. ${loc}`);
            });
            const locChoice = await askQuestion('Enter choice number (1-6): ');
            const choiceIdx = parseInt(locChoice, 10) - 1;
            if (choiceIdx >= 0 && choiceIdx < locations.length) {
                location = locations[choiceIdx];
                break;
            } else {
                console.log('Invalid choice. Please select a number between 1 and 6.');
            }
        }

        console.log('\nCreating Admin user details...');
        // Hash Password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const adminData = {
            name,
            email,
            number: numberValue,
            password: hashedPassword,
            role: 'Admin',
            location,
            isCP: false
        };

        const newAdmin = new userModel(adminData);
        await newAdmin.save();

        console.log('\n=========================================');
        console.log('✔ Admin user created successfully!');
        console.log(`Name:     ${name}`);
        console.log(`Email:    ${email}`);
        console.log(`Phone:    ${numberValue}`);
        console.log(`Role:     Admin`);
        console.log(`Location: ${location}`);
        console.log('=========================================');

    } catch (error) {
        console.error('An error occurred during admin creation:', error);
    } finally {
        rl.close();
        await mongoose.disconnect();
        console.log('Disconnected from MongoDB.');
    }
};

main();
