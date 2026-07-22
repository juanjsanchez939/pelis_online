print("Ejecutando script de inicialización...");

db = db.getSiblingDB("pelis_online");

db.users.insertOne({
  uuid: "admin-0000-0000-000000000001",
  username: "admin",
  hashedPassword: "$2b$10$giT6l9ls9EQFxSxL95MYuup0tCIB52kLrBfGH62KosR9KFGtx.5JO",
  fullName: "Admin",
  email: "admin@pelisonline.com",
  roles: ["admin"],
});

db.users.insertOne({
  uuid: "user-0000-0000-000000000002",
  username: "usuario",
  hashedPassword: "$2b$10$R4in2eicWMnGGQSuYGAereUQDckn8xXx7W5wJ6ws2VBcSg1XkFgwa",
  fullName: "Usuario Demo",
  email: "usuario@pelisonline.com",
  roles: ["user"],
});

print("Usuarios creados:");
printjson(db.users.find().toArray());
print("Inicialización completada.");
