const prisma = require('../prisma');

// Get all treatments
const getAllTreatments = async (req, res) => {
    try {
        const treatments = await prisma.treatment.findMany();
        res.json(treatments);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch treatments' });
    }
};

// Get a single treatment by ID
const getTreatmentById = async (req, res) => {
    const { id } = req.params;
    try {
        const treatment = await prisma.treatment.findUnique({
            where: { Treatment_ID: parseInt(id) }
        });
        if (!treatment) return res.status(404).json({ error: 'Treatment not found' });
        res.json(treatment);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch treatment' });
    }
};

// Create a new treatment
const createTreatment = async (req, res) => {
    const { treatmentName, basePrice } = req.body;
    try {
        const treatment = await prisma.treatment.create({
            data: {
                Treatment_Name: treatmentName,
                Base_Price: basePrice
            }
        });
        res.status(201).json(treatment);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to create treatment' });
    }
};

// Update an existing treatment
const updateTreatment = async (req, res) => {
    const { id } = req.params;
    const { treatmentName, basePrice } = req.body;
    try {
        const treatment = await prisma.treatment.update({
            where: { Treatment_ID: parseInt(id) },
            data: {
                Treatment_Name: treatmentName,
                Base_Price: basePrice
            }
        });
        res.json(treatment);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to update treatment' });
    }
};

module.exports = {
    getAllTreatments,
    getTreatmentById,
    createTreatment,
    updateTreatment
};
