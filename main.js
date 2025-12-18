db.createCollection("books");

db.createCollection("authors");

db.createCollection("members");

db.createCollection("orders");

db.books.insertMany([
  {
    name: "Do It Today: Overcome Procrastination, Improve Productivity, and Achieve More Meaningful Things",
    authors: "Darius Foroux",
    genre: "Productivity, Self-Help",
    publication: "01.01.2019",
    quantity: 145,
  },
  {
    name: "Atomic Habits",
    authors: "James Clear",
    genre: "Self-Help, Personal Development",
    publication: "16.10.2018",
    quantity: 500,
  },
  {
    name: "Think and Grow Rich",
    authors: "Napoleon Hill",
    genre: "Success, Personal Finance",
    publication: "01.05.1937",
    quantity: 400,
  },
  {
    name: "The 7 Habits of Highly Effective People",
    authors: "Stephen R. Covey",
    genre: "Leadership, Self-Help",
    publication: "15.08.1989",
    quantity: 420,
  },
  {
    name: "The Power of Now",
    authors: "Eckhart Tolle",
    genre: "Spirituality, Mindfulness",
    publication: "01.01.1997",
    quantity: 300,
  },
  {
    name: "Who Will Cry When You Die?",
    authors: "Robin Sharma",
    genre: "Self-Help, Personal Growth",
    publication: "09.10.1999",
    quantity: 120,
  },
]);

db.members.insertMany([
  { name: "Behzod", age: 24, memberSince: "April 2024" },
  { name: "Aziz", age: 22, memberSince: "January 2023" },
  { name: "Dilshod", age: 27, memberSince: "June 2022" },
  { name: "Madina", age: 21, memberSince: "September 2024" },
  { name: "Sardor", age: 30, memberSince: "March 2021" },

  { name: "Jasur", age: 26, memberSince: "February 2022" },
  { name: "Umid", age: 28, memberSince: "July 2020" },
  { name: "Akmal", age: 35, memberSince: "November 2019" },
  { name: "Shohjahon", age: 23, memberSince: "August 2023" },
  { name: "Farruh", age: 29, memberSince: "May 2021" },

  { name: "Islom", age: 31, memberSince: "December 2020" },
  { name: "Bobur", age: 25, memberSince: "October 2022" },
  { name: "Sanjar", age: 27, memberSince: "June 2021" },
  { name: "Shahzod", age: 34, memberSince: "April 2018" },
  { name: "Rustam", age: 38, memberSince: "January 2017" },

  { name: "Kamron", age: 21, memberSince: "September 2024" },
  { name: "Mirjalol", age: 24, memberSince: "March 2023" },
  { name: "Oybek", age: 32, memberSince: "February 2020" },
  { name: "Anvar", age: 36, memberSince: "May 2019" },
  { name: "Bekzod", age: 28, memberSince: "July 2022" },

  { name: "Nodir", age: 33, memberSince: "August 2021" },
  { name: "Shukhrat", age: 40, memberSince: "June 2016" },
  { name: "Zafar", age: 29, memberSince: "November 2022" },
  { name: "Elyor", age: 22, memberSince: "January 2024" },
  { name: "Javohir", age: 26, memberSince: "October 2021" },
]);

//purchasing



function purchasing(name, bookTitle, quantity) {
  const member = db.members.findOne({ name: name });
  if (!member) {
    console.log("You are not a member of our library");
    return;
  }

  const book = db.books.findOne({ name: bookTitle });
  if (!book) {
    console.log(`We don't have a book named "${bookTitle}"`);
    return;
  }

  if (book.quantity < quantity) {
    console.log(`You can't purchase more than ${book.quantity}`);
    return;
  }

  db.books.updateOne(
    { name: bookTitle },
    { $inc: { quantity: -quantity } }
  );

  console.log("Purchase successful");
}




