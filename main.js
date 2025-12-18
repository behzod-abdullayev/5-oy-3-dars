db.createCollection("books");

db.createCollection("authors");

db.createCollection("members");

db.createCollection("orders");

db.createCollection("register");

db.createCollection("adminRegister");

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
  if (!password) return "A password is required to add a book";

  const admin = db.admins.findOne({ password: password });
  if (!admin) return "You have a wrong password";

  if (!name || !author || !genre || !publishDate || !quantity) {
    return "name, author, genre, publishDate and quantity are required";
  }

  quantity = Number(quantity);
  if (isNaN(quantity) || quantity <= 0) {
    return "Quantity must be a positive number";
  }

  const book = db.books.findOne({ name: name });

  if (book) {
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
  quantity = Number(quantity);
  if (isNaN(quantity) || quantity <= 0) {
    return console.log("Quantity must be a positive number");
  }

  const user = db.members.findOne({ name: username });
  if (!user) return console.log("You are not registered in the library");

  const book = db.books.findOne({ name: bookTitle });
  if (!book) return console.log(`Book "${bookTitle}" not found`);

  if (book.quantity < quantity) {
    return console.log(`Only ${book.quantity} copy(ies) available, cannot purchase ${quantity}`);
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

// most ordered
function mostOrderedBookSimple() {
  const orders = db.orders.find().toArray();

  if (orders.length === 0) {
    console.log("No orders yet");
    return null;
  }

  const counts = {};

  orders.forEach((order) => {
    if (!counts[order.bookTitle]) counts[order.bookTitle] = 0;
    counts[order.bookTitle] += Number(order.quantity);
  });

  let mostOrdered = null;
  let maxQuantity = 0;

  for (const book in counts) {
    if (counts[book] > maxQuantity) {
      maxQuantity = counts[book];
      mostOrdered = book;
    }
  }

  console.log(`Most ordered book: ${mostOrdered} (${maxQuantity} copies)`);
  return { bookTitle: mostOrdered, totalOrdered: maxQuantity };
}


// azolarni yosh bo'yicha guruhlash
function membersGroupedByAge() {
  const result = db.members
    .aggregate([
      {
        $group: {
          _id: "$age",
          members: { $push: "$name" },
        },
      },
      { $sort: { _id: 1 } },
    ])
    .toArray();

  console.log(result);
  return result;
}


//kitoblarni janr boyicha guruhlash
function booksGroupedByGenre() {
  const result = db.books
    .aggregate([
      {
        $group: {
          _id: "$genre",
          books: { $push: "$name" },
        },
      },
      { $sort: { _id: 1 } },
    ])
    .toArray();

  console.log(result);
  return result;
}


//jami a'zolar sonini ko'rsatadigan funksiya
function totalMembers() {
  const count = db.members.countDocuments();
  console.log(`Total members: ${count}`);
  return count;
}


// eng faol a'zo
function mostActiveMember() {
  const result = db.orders
    .aggregate([
      { $group: { _id: "$username", totalOrders: { $sum: Number("$quantity") } } },
      { $sort: { totalOrders: -1 } },
      { $limit: 1 },
    ])
    .toArray();

  if (result.length > 0) {
    console.log(`Most active member: ${result[0]._id} (${result[0].totalOrders} books)`);
    return result[0];
  } else {
    console.log("No orders yet");
    return null;
  }
}



//register adminda parol jasu qoyilsa addbook qilgan paytda parol joyiga jasur deb yozib qoysa boladi ayni pastdagi addorupdate faqat jasur nomli parolga ega admin mavjud bolsa ishlaydi agar yangi admin qoshilsa boshqa yangi adminning paroli ham bolishi mumkin
registeradmin("jasur", "jasur")



//kitob qoshish
addOrUpdateBook("jasur", "Do It Today: Overcome Procrastination, Improve Productivity, and Achieve More Meaningful Things", "Darius Foroux", "Productivity, Self-Help", "01.01.2019", "145");

addOrUpdateBook("jasur", "Rich Dad Poor Dad", "Robert Kiyosaki", "Personal Finance, Self-Help, Business/Investing", "01.04.2000", "33"); 

addOrUpdateBook("jasur", "Atomic Habits", "James Clear", "Self-Help, Personal Development", "16.10.2018", "500");

addOrUpdateBook("jasur", "Think and Grow Rich", "Napoleon Hill", "Success, Personal Finance", "01.05.1937", "400");

addOrUpdateBook("jasur", "The 7 Habits of Highly Effective People", "Stephen R. Covey", "Leadership, Self-Help", "15.08.1989", "420");

addOrUpdateBook("jasur", "The Power of Now", "Eckhart Tolle", "Spirituality, Mindfulness", "01.01.1997", "300");

addOrUpdateBook("jasur", "Who Will Cry When You Die?", "Robin Sharma", "Self-Help, Personal Growth", "09.10.1999", "120");



// a'zo ro'yxatdan o'tkazish
register("alice01", "Alice", 25);
register("bob02", "Bob", 30);
register("charlie03", "Charlie", 22);
register("diana04", "Diana", 24);
register("edward05", "Edward", 32);
register("fiona06", "Fiona", 31);
register("george07", "George", 32);
register("hannah08", "Hannah", 24);
register("ian09", "Ian", 29);
register("julia10", "Julia", 31);

// Kitoblarni sotib olish
purchaseBook("Alice", "Atomic Habits", 2);
purchaseBook("Alice", "Rich Dad Poor Dad", 1);
purchaseBook("Alice", "Atomic Habits", 1);

purchaseBook("Bob", "Do It Today: Overcome Procrastination, Improve Productivity, and Achieve More Meaningful Things", 1);
purchaseBook("Bob", "Think and Grow Rich", 2);

purchaseBook("Charlie", "The Power of Now", 1);
purchaseBook("Charlie", "Who Will Cry When You Die?", 2);

purchaseBook("Diana", "The 7 Habits of Highly Effective People", 1);
purchaseBook("Diana", "Atomic Habits", 2);
purchaseBook("Diana", "Rich Dad Poor Dad", 1);

purchaseBook("Edward", "Think and Grow Rich", 3);

purchaseBook("Fiona", "Atomic Habits", 2);
purchaseBook("Fiona", "The Power of Now", 1);

purchaseBook("George", "Who Will Cry When You Die?", 1);
purchaseBook("George", "Do It Today: Overcome Procrastination, Improve Productivity, and Achieve More Meaningful Things", 2);

purchaseBook("Hannah", "Rich Dad Poor Dad", 2);
purchaseBook("Hannah", "The 7 Habits of Highly Effective People", 1);

purchaseBook("Ian", "Atomic Habits", 1);
purchaseBook("Ian", "Think and Grow Rich", 2);
purchaseBook("Ian", "The Power of Now", 1);

purchaseBook("Julia", "Who Will Cry When You Die?", 3);
purchaseBook("Julia", "The 7 Habits of Highly Effective People", 2);


