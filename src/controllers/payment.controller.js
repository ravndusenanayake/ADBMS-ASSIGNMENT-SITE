const prisma = require('../prisma');

// Get all payments
const getAllPayments = async (req, res) => {
    try {
        const payments = await prisma.payment.findMany({
            include: {
                Appointment: {
                    include: {
                        Patient: { include: { Person: true } },
                        Dentist: { include: { Person: true } }
                    }
                }
            }
        });
        res.json(payments);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch payments' });
    }
};

// Get a single payment by ID
const getPaymentById = async (req, res) => {
    const { id } = req.params;
    try {
        const payment = await prisma.payment.findUnique({
            where: { Payment_ID: parseInt(id) },
            include: {
                Appointment: {
                    include: {
                        Patient: { include: { Person: true } },
                        Dentist: { include: { Person: true } },
                        Treatments: { include: { Treatment: true } }
                    }
                }
            }
        });
        if (!payment) return res.status(404).json({ error: 'Payment not found' });
        res.json(payment);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch payment' });
    }
};

// Process a payment
const processPayment = async (req, res) => {
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

        // The trigger 'trg_UpdateAppointmentStatus' in DB will set status to 'Completed'.
        // We fetch the updated appointment to confirm.
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
};

module.exports = {
    getAllPayments,
    getPaymentById,
    processPayment
};
