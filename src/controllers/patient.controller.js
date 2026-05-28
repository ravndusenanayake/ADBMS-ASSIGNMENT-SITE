const prisma = require('../prisma');

// Get all patients
const getAllPatients = async (req, res) => {
    try {
        const patients = await prisma.patient.findMany({
            include: {
                Person: true
            }
        });
        res.json(patients);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch patients' });
    }
};

// Get a single patient by ID
const getPatientById = async (req, res) => {
    const { id } = req.params;
    try {
        const patient = await prisma.patient.findUnique({
            where: { Patient_ID: parseInt(id) },
            include: {
                Person: true,
                Appointments: {
                    include: {
                        Dentist: { include: { Person: true } }
                    }
                }
            }
        });
        if (!patient) return res.status(404).json({ error: 'Patient not found' });
        res.json(patient);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch patient' });
    }
};

// Create a new patient
const createPatient = async (req, res) => {
    const { firstName, lastName, nic, contactNumber, address, dateOfBirth, bloodGroup, allergies } = req.body;
    try {
        // Create Person and Patient in a transaction
        const result = await prisma.$transaction(async (prisma) => {
            const person = await prisma.person.create({
                data: {
                    First_Name: firstName,
                    Last_Name: lastName,
                    NIC: nic,
                    Contact_Number: contactNumber,
                    Address: address,
                    Person_Type: 'Patient'
                }
            });

            const patient = await prisma.patient.create({
                data: {
                    Patient_ID: person.Person_ID,
                    Date_of_Birth: new Date(dateOfBirth),
                    Blood_Group: bloodGroup,
                    Allergies: allergies
                }
            });

            return { ...patient, Person: person };
        });

        res.status(201).json(result);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to create patient' });
    }
};

module.exports = {
    getAllPatients,
    getPatientById,
    createPatient
};
