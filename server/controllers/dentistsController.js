const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

function getAge(dateString) {
    var today = new Date();
    var birthDate = new Date(dateString);
    var age = today.getFullYear() - birthDate.getFullYear();
    var m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }
    return age;
}

const getAllDentists = async (req, res) => {
    const dentists = await prisma.dentist.findMany();
    if (!dentists) return res.status(204).json({ 'message': 'No dentist found.' });
    res.json(dentists);
}
const getDentist = async (req, res) => {
    if (!req?.params?.id) return res.status(400).json({ 'message': 'Dentist ID required.' });

    const dentist = await prisma.dentist.findOne({ _id: req.params.id }).exec();
    if (!dentist) {
        return res.status(204).json({ "message": `No dentist matches ID ${req.params.id}.` });
    }
    res.json(dentist);
}

const createNewDentist = async (req, res) => {
    // if (!req?.body?.firstname || !req?.body?.lastname) {
    //     return res.status(400).json({ 'message': 'First and last names are required' });
    // }

    try {
        const result = await prisma.dentist.create({
            data: {
                DentistSSN: req.body.DentistSSN,
                fName: req.body.fName,
                lName: req.body.lName,        
                birthDate: req.body.birthDate,     
                age: getAge(req.body.age),
                gender: req.body.gender,            
                city: req.body.city,              
                street: req.body.street,            
                phone: req.body.phone,             
                email: req.body.email,             
                specialization: req.body.specialization,    
                dentistProfile: req.body.dentistProfile, 
                workingDays: req.body.workingDays,      //(e.g., "Monday", "Tuesday", etc.).
                workingHours: req.body.workingHours,    //"9:00 AM - 1:00 PM", "2:00 PM - 6:00 PM", etc
                yearsOfExperience: req.body.yearsOfExperience,
                visits: [],     
                procedures: [],       
                diagnosis: [],         
                prescription: []      
            }
        });

        res.status(201).json(result);
    } catch (err) {
        console.error(err);
    }
}

const updateDentist = async (req, res) => {
    if (!req?.body?.id) {
        return res.status(400).json({ 'message': 'ID parameter is required.' });
    }

    const employee = await Employee.findOne({ _id: req.body.id }).exec();
    if (!employee) {
        return res.status(204).json({ "message": `No employee matches ID ${req.body.id}.` });
    }
    if (req.body?.firstname) employee.firstname = req.body.firstname;
    if (req.body?.lastname) employee.lastname = req.body.lastname;
    const result = await employee.save();
    res.json(result);
}

const deleteDentist = async (req, res) => {
    if (!req?.body?.id) return res.status(400).json({ 'message': 'Employee ID required.' });

    const employee = await Employee.findOne({ _id: req.body.id }).exec();
    if (!employee) {
        return res.status(204).json({ "message": `No employee matches ID ${req.body.id}.` });
    }
    const result = await employee.deleteOne(); //{ _id: req.body.id }
    res.json(result);
}

module.exports = {
    getAllDentists,
    getDentist,
    createNewDentist,
    deleteDentist,
    updateDentist
}