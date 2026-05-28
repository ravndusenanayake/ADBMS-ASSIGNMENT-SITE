const express = require('express');
const cors = require('cors');
require('dotenv').config();

// Import Routes
const patientRoutes = require('./src/routes/patient.routes');
const dentistRoutes = require('./src/routes/dentist.routes');
const treatmentRoutes = require('./src/routes/treatment.routes');
const appointmentRoutes = require('./src/routes/appointment.routes');
const paymentRoutes = require('./src/routes/payment.routes');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// API Routes
app.use('/api/patients', patientRoutes);
app.use('/api/dentists', dentistRoutes);
app.use('/api/treatments', treatmentRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/payments', paymentRoutes);

// Global Error Handler Middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong!', details: err.message });
});

// Health Check
app.get('/', (req, res) => res.send('LumiSmile API is running...'));

app.listen(PORT, () => {
    console.log(`🚀 Server is running on http://localhost:${PORT}`);
});
