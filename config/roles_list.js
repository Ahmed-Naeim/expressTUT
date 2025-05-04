const ROLES_LIST = {
    "Admin": 5150, // 5150 is a common number used to refer to someone who is a danger to themselves or others, often used in police codes.
    "Editor": 1984, // 1984 is a reference to George Orwell's dystopian novel about totalitarianism and surveillance.
    "User": 2001,  // 2001 is a reference to the year 2001: A Space Odyssey, a film that explores themes of artificial intelligence and humanity.
};

module.exports = ROLES_LIST; // Exporting the roles list for use in other parts of the application.
// This allows us to define user roles and their corresponding numeric values, which can be used for authorization checks in the application.