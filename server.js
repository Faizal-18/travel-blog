const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const { check, validationResult } = require('express-validator'); // Validation middleware

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
    city: { type: String, required: true },
    pickupLocation: { type: String, required: true },
    dropLocation: { type: String, required: true },
    rating: { type: Number, required: true, min: 1, max: 5 }
});

// Create a model from the schema
const Journey = mongoose.model('Journey', journeySchema);

// POST route to save journey details
app.post('/journey', [
    check('name').not().isEmpty().withMessage('Name is required'),
    check('city').not().isEmpty().withMessage('City is required'),
    check('pickupLocation').not().isEmpty().withMessage('Pickup location is required'),
    check('dropLocation').not().isEmpty().withMessage('Drop location is required'),
    check('rating').isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5')
], async (req, res) => {
    // Validate request
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { name, city, pickupLocation, dropLocation, rating } = req.body;

    try {
        const newJourney = new Journey({
            name,
            city,
            pickupLocation,
            dropLocation,
            rating
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
