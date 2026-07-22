export class UserMockup {
  static users = [
    {
      id: 1,
      username: 'admin',
      hashedPassword: '$2b$10$teSUseenCaoeaMUpmBpl7unyHN5n6w1ZEnZmgyLNveMBpPZULn.Ge',
      fullName: 'Admin',
      email: 'admin@fake.com',
      roles: ['admin'],
    },
    {
      id: 2,
      username: 'operator',
      hashedPassword: '$2b$10$teSUseenCaoeaMUpmBpl7unyHN5n6w1ZEnZmgyLNveMBpPZULn.Ge',
      fullName: 'Operador',
      email: 'operator@fake.com',
      roles: ['operator'],
    },
    {
      id: 3,
      username: 'juanperez',
      hashedPassword: '$2b$10$g2cwNOfBHnvRy67v52n2lu5.tcd.EqMQdhoKevw0QCWY/8Bmot5iy',
      fullName: 'Juan Perez',
      email: 'juanperez@fake.com',
      roles: ['user'],
    },
  ];

  static async getSingleOrNullByUsername(username) {
    return this.users.find(u => u.username == username);
  }

  static async get() {
    return this.users;
  }
}
