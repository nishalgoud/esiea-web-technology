const Role = require('../src/models/Role');

exports.up = async function() {
  // Define roles and permissions
  const roles = [
    { name: 'admin', permissions: ['read', 'write', 'delete'] },
    { name: 'editor', permissions: ['read', 'write'] },
    { name: 'viewer', permissions: ['read'] },
  ];

  // Save each role to the database
  for (const role of roles) {
    const existingRole = await Role.findOne({ name: role.name });
    if (!existingRole) {
      const newRole = new Role(role);
      await newRole.save();
      console.log(`Saved ${role.name} role successfully.`);
    }
  }
}

exports.down = async function() {
  // In the `down` function you should reverse the changes made in the `up` function.:2018
  // In this case, we could delete the roles we created:

  await Role.deleteMany({ name: { $in: ['admin', 'editor', 'viewer'] } });
}

exports.config = {
  transaction: false, // This should be true if your MongoDB supports transactions
};
