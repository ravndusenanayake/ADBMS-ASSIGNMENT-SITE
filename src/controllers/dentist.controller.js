const prisma = require('../prisma');

// Get all dentists
const getAllDentists = async (req, res) => {
    try {
        const dentists = await prisma.dentist.findMany({
            include: {
                Person: true
            }
        });
        res.json(dentists);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch dentists' });
    }
};

// Get a single dentist by ID
const getDentistById = async (req, res) => {
    const { id } = req.params;
    try {
        const dentist = await prisma.dentist.findUnique({
            where: { Dentist_ID: parseInt(id) },
            include: {
                Person: true,
                Appointments: {
                    include: {
                        Patient: { include: { Person: true } }
                    }
                }
            }
        });
        if (!dentist) return res.status(404).json({ error: 'Dentist not found' });
        res.json(dentist);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch dentist' });
    }
};

// Create a new dentist
const createDentist = async (req, res) => {
    const { firstName, lastName, nic, contactNumber, address, slmcRegNo, specialization } = req.body;
    try {
        const result = await prisma.$transaction(async (prisma) => {
            const person = await prisma.person.create({
                data: {
                    First_Name: firstName,
                    Last_Name: lastName,
                    NIC: nic,
                    Contact_Number: contactNumber,
                    Address: address,
                    Person_Type: 'Dentist'
                }
            });

            const dentist = await prisma.dentist.create({
                data: {
                    Dentist_ID: person.Person_ID,
                    SLMC_Reg_No: slmcRegNo,
                    Specialization: specialization
                }
            });

            return { ...dentist, Person: person };
        });

        res.status(201).json(result);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to create dentist' });
    }
};

module.exports = {
    getAllDentists,
    getDentistById,
    createDentist
};
