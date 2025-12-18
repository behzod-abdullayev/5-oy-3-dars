db.createCollection("books");

db.createCollection("authors");

db.createCollection("members");

db.createCollection("orders");

db.createCollection("register");

db.createCollection("adminRegister");

db.createCollection("orders");

db.createCollection("members");

db.createCollection("admins");

// register a'zolar uchun

function register(username, name, age) {
  const existingUser = db.members.findOne({ username: username });

  if (!username || !name || age === undefined) {
    return "username, name and age required";
  }

  age = Number(age);
  if (isNaN(age)) {
    return `age must be a number`;
  }

  if (existingUser) {
    return `The username ${username} already exists. Please choose a different username.`;
  }

  db.members.insertOne({
    username: username,
    name: name,
    age: age,
    memberSince: new Date(),
  });
  return "registered successfully";
}

// register kutubxonaga ishga joylashmoqchilar uchun

function registeradmin(username, password) {
  const existingAdmin = db.admins.findOne({ username: username });

  if (!username || !password) {
    return `username and password required`;
  }

  if (existingAdmin) {
    return `the username ${username} already exist. please choose a different username`;
  }

  db.admins.insertOne({
    username: username,
    password: password,
    sinceWorking: new Date(),
  });
  return `admin registered successfully`;
}

// kitob qoshish
function addOrUpdateBook(password, name, author, genre, publishDate, quantity) {
  if (!password) {
    return "A password is required to add a book";
  }

  const admin = db.admins.findOne({ password: password });
  if (!admin) {
    return "You have a wrong password";
  }

  if (!name || !author || !genre || !publishDate || !quantity) {
    return "name, author, genre, publishDate and quantity are required";
  }

  const inspection = db.books.findOne({ name: name });

  if (inspection) {
    db.books.updateOne({ name: name }, { $inc: { quantity: quantity } });
    console.log("Book quantity updated successfully");
  } else {
    db.books.insertOne({
      name: name,
      author: author,
      genre: genre,
      publishDate: publishDate,
      quantity: quantity,
    });
    console.log("Book added successfully");
  }
}

//kitob sotib olish
function purchaseBook(username, bookTitle, quantity) {
  const user = db.members.findOne({ name: username });
  if (!user) {
    return console.log("You are not registered in the library");
  }

  const book = db.books.findOne({ name: bookTitle });
  if (!book) {
    return console.log(`Book "${bookTitle}" not found`);
  }

  if (book.quantity < quantity) {
    return console.log(
      `Only ${book.quantity} copy(ies) available, cannot purchase ${quantity}`
    );
  }

  db.books.updateOne({ name: bookTitle }, { $inc: { quantity: -quantity } });

  db.orders.insertOne({
    username: username,
    bookTitle: bookTitle,
    quantity: quantity,
    orderDate: new Date(),
  });

  console.log("Purchase successful");
}

