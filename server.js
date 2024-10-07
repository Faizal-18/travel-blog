const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = 5000;

// Middleware
app.use(bodyParser.json());
app.use(cors());

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/mydb1', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('MongoDB Connected'))
.catch(err => console.log(err));

// Define a schema for the journey data
const journeySchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    mobile: { type: String, required: true },
    city: { type: String, required: true },
    pickupLocation: { type: String, required: true },
    dropLocation: { type: String, required: true },
    rating: { type: Number, required: true },
    paymentMethod: { type: String, required: true },
    transactionId: { type: String }
});

// Create a model from the schema
const Journey = mongoose.model('Journey', journeySchema);

// POST route to save journey details
app.post('/journey', async (req, res) => {
    const {
        name, email, mobile, city,
        pickupLocation, dropLocation, rating,
        paymentMethod, transactionId
    } = req.body;

    // Validate the required fields
    if (!name || !email || !mobile || !city || !pickupLocation || !dropLocation || !rating || !paymentMethod) {
        return res.status(400).json({ error: 'Please provide all required fields.' });
    }

    try {
        const newJourney = new Journey({
            name,
            email,
            mobile,
            city,
            pickupLocation,
            dropLocation,
            rating,
            paymentMethod,
            transactionId: paymentMethod === 'Online' ? transactionId : null  // Store transactionId only for online payments
        });

        await newJourney.save();
        res.status(201).json({ message: 'Journey saved successfully!' });
    } catch (err) {
        res.status(500).json({ error: 'Failed to save journey' });
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
