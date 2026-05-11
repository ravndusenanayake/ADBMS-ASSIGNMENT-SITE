const express = require('express');
const { PrismaClient } = require('@prisma/client');
const cors = require('cors');
require('dotenv').config();

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// 1. GET ALL APPOINTMENTS
// Includes full details of Patients and Dentists (joining with the Person table)
app.get('/api/appointments', async (req, res) => {
    try {
        const appointments = await prisma.appointment.findMany({
            include: {
                Patient: {
                    include: { Person: true }
                },
                Dentist: {
                    include: { Person: true }
                },
                Treatments: {
                    include: { Treatment: true }
                }
            }
        });
        res.json(appointments);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch appointments' });
    }
});

// 2. CREATE NEW APPOINTMENT
app.post('/api/appointments', async (req, res) => {
    const { date, time, patientId, dentistId } = req.body;
    try {
        const newAppointment = await prisma.appointment.create({
            data: {
                Date: new Date(date),
                Time: new Date(`${date}T${time}`),
                Patient_ID: patientId,
                Dentist_ID: dentistId,
                Status: 'Pending'
            }
        });
        res.status(201).json(newAppointment);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to create appointment' });
    }
});

// 3. PROCESS PAYMENT
// Note: This endpoint will automatically trigger the SQL Server Trigger 
// 'trg_UpdateAppointmentStatus' to update the appointment to 'Completed'.
app.post('/api/payments', async (req, res) => {
    const { amount, paymentMethod, appointmentId } = req.body;
    try {
        const payment = await prisma.payment.create({
            data: {
                Amount: amount,
                Payment_Method: paymentMethod,
                Appointment_ID: appointmentId,
                Date: new Date()
            }
        });

        // After the trigger runs in the DB, let's fetch the updated appointment
        const updatedAppointment = await prisma.appointment.findUnique({
            where: { Appointment_ID: appointmentId }
        });

        res.status(201).json({
            message: 'Payment processed successfully',
            payment,
            updatedAppointmentStatus: updatedAppointment.Status
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to process payment' });
    }
});

// Health Check
app.get('/', (req, res) => res.send('LumiSmile API is running...'));

app.listen(PORT, () => {
    console.log(`🚀 Server is running on http://localhost:${PORT}`);
});
