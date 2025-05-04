const Employee = require('../model/Employee');

const getAllEmployees = async (req, res) => {
    const employees = await Employee.find(); //find() method returns a promise, so we need to use await to get the result
    if (!employees) return res.status(204).json({ 'message': 'No employees found.' });
    res.json(employees); //send the employees to the client
}

const createNewEmployee = async (req, res) => {
    if (!req?.body.firstname || !req?.body.lastname) {
        return res.status(400).json({ 'message': 'Employee data required.' });
    }
    try{
        const result = await Employee.create({
            firstname: req.body.firstname,
            lastname: req.body.lastname
        });
        res.status(201).json(result); //send the employee to the client
    }
    catch (err) {
        console.error(err);
        return res.status(500).json({ 'message': 'Internal server error.' });
    }
}

const updateEmployee = async (req, res) => {
    if(!req?.body.id) {
        return res.status(400).json({ 'message': ' ID is required.' });
    }

    const employee = await Employee.findOne({_id: req.body.id}).exec(); //findOne method returns a promise, so we need to use await to get the result
    if (!employee) {
        return res.status(204).json({ "message": `No Employee Matches ID ${req.body.id}` });
    }
    if(req.body?.firstname) employee.firstname = req.body.firstname;
    if(req.body?.lastname) employee.lastname = req.body.lastname;

    const result = await employee.save(); //save the employee object to the database
    res.json(result); //send the employee to the client
}


const deleteEmployee = async (req, res) => {
    if (!req?.body?.id) return res.status(400).json({ 'message': 'Employee ID required.' });
    const employee = await Employee.findOne({ _id: req.body.id }).exec(); //findOne method returns a promise, so we need to use await to get the result
    if (!employee) {
        return res.status(204).json({ "message": `No Employee Matches ID ${req.body.id}` });
    }
    const result = await employee.deleteOne({ _id: req.body.id }); //deleteOne method returns a promise, so we need to use await to get the result
    res.json(result); //send the employee to the client
}

const getEmployee = async (req, res) => {
    if (!req?.params?.id) return res.status(400).json({ 'message': 'Employee ID required.' });
    const employee = await Employee.findOne({ _id: req.params.id }).exec(); //findOne method returns a promise, so we need to use await to get the result
    if (!employee) {
        return res.status(204).json({ "message": `No Employee Matches ID ${req.body.id}` });
    }
    res.json(employee);
}

module.exports = {
    getAllEmployees,
    createNewEmployee,
    updateEmployee,
    deleteEmployee,
    getEmployee
}