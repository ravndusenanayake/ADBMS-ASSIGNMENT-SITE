const prisma = require('../prisma');

// Get all appointments
const getAllAppointments = async (req, res) => {
    try {
        const appointments = await prisma.appointment.findMany({
            include: {
                Patient: { include: { Person: true } },
                Dentist: { include: { Person: true } },
                Treatments: { include: { Treatment: true } }
            }
        });
        res.json(appointments);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch appointments' });
    }
};

// Get a single appointment by ID
const getAppointmentById = async (req, res) => {
    const { id } = req.params;
    try {
        const appointment = await prisma.appointment.findUnique({
            where: { Appointment_ID: parseInt(id) },
            include: {
                Patient: { include: { Person: true } },
                Dentist: { include: { Person: true } },
                Treatments: { include: { Treatment: true } }
            }
        });
        if (!appointment) return res.status(404).json({ error: 'Appointment not found' });
        res.json(appointment);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch appointment' });
    }
};

// Create a new appointment
const createAppointment = async (req, res) => {
    const { date, time, patientId, dentistId, treatmentIds } = req.body;
    try {
        const appointment = await prisma.$transaction(async (prisma) => {
            const newAppointment = await prisma.appointment.create({
                data: {
                    Date: new Date(date),
                    Time: new Date(`${date}T${time}`),
                    Patient_ID: patientId,
                    Dentist_ID: dentistId,
                    Status: 'Pending'
                }
            });

            if (treatmentIds && Array.isArray(treatmentIds) && treatmentIds.length > 0) {
                const treatmentData = treatmentIds.map(treatmentId => ({
                    Appointment_ID: newAppointment.Appointment_ID,
                    Treatment_ID: parseInt(treatmentId)
                }));
                await prisma.appointment_Treatment.createMany({
                    data: treatmentData
                });
            }

            return newAppointment;
        });

        res.status(201).json(appointment);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to create appointment' });
    }
};

// Update appointment status
const updateAppointmentStatus = async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    try {
        const appointment = await prisma.appointment.update({
            where: { Appointment_ID: parseInt(id) },
            data: { Status: status }
        });
        res.json(appointment);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to update appointment status' });
    }
};

// Add treatments to appointment
const addTreatmentsToAppointment = async (req, res) => {
    const { id } = req.params;
    const { treatmentIds } = req.body; // Array of treatment IDs
    try {
        const data = treatmentIds.map(treatmentId => ({
            Appointment_ID: parseInt(id),
            Treatment_ID: treatmentId
        }));
        
        // Use createMany to insert multiple Treatment_Appointment records
        await prisma.appointment_Treatment.createMany({
            data
        });

        res.status(201).json({ message: 'Treatments added successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to add treatments to appointment' });
    }
};

module.exports = {
    getAllAppointments,
    getAppointmentById,
    createAppointment,
    updateAppointmentStatus,
    addTreatmentsToAppointment
};
