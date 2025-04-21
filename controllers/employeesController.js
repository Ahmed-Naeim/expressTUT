const data = {
    employees: require('../model/employees.json'),
    setEmployees: (data)=> {this.employees = data}
};

const getAllEmployees = (req, res) => {
    res.json(data.employees);
};

const createNewEmployee = (req, res) =>{
    const newEmployee = {
        id: data.employees[data.employees.length - 1].id + 1 || 1,
        firstname: req.body.firstname,
        lastname: req.body.lastname
    };
    
    if(!newEmployee.firstname || !newEmployee.lastname){
        return res.status(400).json({'message': 'First and Last names are required.'});
    };

    data.setEmployees([...data.employees, newEmployee]);
    res.status(201).json(data.employees);
};

const updateEmployee = (req, res)=>{
    const employee = data.employees.find(emp => emp.id === parseInt(req.body.id));
    if(!employee){
        return res.status(400).json({"message": `Employee ID ${req.body.id} not found`});
    }

    if(req.body.firstname) employee.firstname = req.body.firstname;
    if(req.body.lastname) employee.firstname.lastIndexOf = req.body.lastname;

    //filtered array to remove the existing data which have the same id (old data) to update it
    const filteredArray = data.employees.filter(emp => emp.id !== parseInt(req.body.id));
    //add the new updated data
    const unsortedArray = [...filteredArray, employee];

    //sort the data to get the updated id in its place then use the method setEmployees to apply it
    data.setEmployees(unsortedArray.sort((a,b)=> a.id > b.id ? 1 : a.id < b.id ? -1 : 0));
    //return the response with the new updated data
    res.json(data.employees);
};

const deleteEmployee = (req, res) =>{
    const employee = data.employees.find(emp => emp,id === parseInt(req.body.id));

    if(!employee){
        return res.status(400).json({"message": `Employee ID ${req.body.id} not found`});
    }

    //filter the array of data without the deleted data
    const filteredArray = data.employees.filter(emp => emp.id !== parseInt(req.body.id));

    data.setEmployees([...filteredArray]);
    res.json(data.employees);
};

const getEmployee = (req, res) =>{
    const employee = data.employees.find(emp => emp.id === parseInt(req.body.id));
    if(!employee){
        return res.status(400).json({"message": `Employee ID ${req.body.id} not found`});
    }
    res.json(employee);
};

module.exports = {
    getAllEmployees,
    createNewEmployee,
    updateEmployee,
    deleteEmployee,
    getEmployee
};

