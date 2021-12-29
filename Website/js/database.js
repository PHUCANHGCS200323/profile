var db = window.openDatabase("Rabbit store", "1.0", "RB Store", 200000);


function log(type, message) {
  var current_time = new Date();
  console.log(`${current_time} [${type}] ${message}`);
}

function fetch_transaction_success(name) {
  log(`INFO`, `Insert "${name}" successfully.`);
}

function table_transaction_success(table) {
  log(`INFO`, `Create table "${table}" successfully.`);
}

function transaction_error(tx, error) {
  log(`ERROR`, `SQL Error ${error.code}: ${error.message}.`);
}

function initialize_database() {
  db.transaction(function (tx) {
    var query = `CREATE TABLE IF NOT EXISTS city (
        id INTEGER PRIMARY KEY,
        name TEXT UNIQUE NOT NULL
      )`;

    tx.executeSql(query, [], table_transaction_success(`city`), transaction_error);

    query = `CREATE TABLE IF NOT EXISTS district (
        id INTEGER PRIMARY KEY,
        name TEXT NOT NULL,
        city_id INTEGER NOT NULL,
        FOREIGN KEY (city_id) REFERENCES city(id)
      )`;

    tx.executeSql(query, [], table_transaction_success(`district`), transaction_error);

    query = `CREATE TABLE IF NOT EXISTS ward (
        id INTEGER PRIMARY KEY,
        name TEXT NOT NULL,
        district_id INTEGER NOT NULL,
        FOREIGN KEY (district_id) REFERENCES district(id)
      )`;

    tx.executeSql(query, [], table_transaction_success(`ward`), transaction_error);

    query = `CREATE TABLE IF NOT EXISTS account (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        first_name TEXT NULL,
        last_name TEXT NULL,
        birthday REAL NULL,
        phone TEXT NULL,
        street TEXT NULL,
        ward_id INTEGER NULL,
        district_id INTEGER NULL,
        city_id INTEGER NULL,
        status INTEGER NOT NULL,
        FOREIGN KEY (city_id) REFERENCES city(id)
      )`;

    tx.executeSql(query, [], table_transaction_success(`account`), transaction_error);

    var query = `CREATE TABLE IF NOT EXISTS category (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT UNIQUE NOT NULL,
        description TEXT NULL,
        parent_id INTEGER NULL,
        FOREIGN KEY (parent_id) REFERENCES category(id)
      )`;

    tx.executeSql(query, [], table_transaction_success(`category`), transaction_error);

    var query = `CREATE TABLE IF NOT EXISTS product (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT UNIQUE NOT NULL,
        description TEXT NULL,
        price REAL NOT NULL,
        category_id INTEGER NULL,
        img TEXT NULL,
        FOREIGN KEY (category_id) REFERENCES category(id)
      )`;

    tx.executeSql(query, [], table_transaction_success(`product`), transaction_error);

    var query = `CREATE TABLE IF NOT EXISTS cart (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        account_id INTEGER NOT NULL,
        product_id INTEGER NOT NULL,
        quantity INTEGER NOT NULL,
        FOREIGN KEY (account_id) REFERENCES account(id),
        FOREIGN KEY (product_id) REFERENCES product(id)
      )`;

    tx.executeSql(query, [], table_transaction_success(`cart`), transaction_error);
  });
}

function fetch_database() {
  db.transaction(function (tx) {
    var query = `INSERT INTO category (name) VALUES(?,?)`;
    tx.executeSql(query, ["Shoes"], fetch_transaction_success("Shoes"), transaction_error);
    tx.executeSql(query, ["Clothes"], fetch_transaction_success("Clothes"), transaction_error);
    tx.executeSql(query, ["Accessries"], fetch_transaction_success("Accessries"), transaction_error);
    tx.executeSql(query, ["Football boot"], fetch_transaction_success("Football boot"), transaction_error);

    query = `INSERT INTO account (username, password, status) VALUES (?,?,1)`;
    tx.executeSql(query, ["phucanh@gmail.com", "190202"], fetch_transaction_success("phucanh@gmail.com"), transaction_error);

    query = `INSERT INTO product (name, img, price, category_id) VALUES(?,?,?,?)`;
    tx.executeSql(query, ["Air Jordan 7 Retro 1", "/images/shoe/1.jpeg", 1200000, 1], fetch_transaction_success("Product 01"), transaction_error);
    tx.executeSql(query, ["Air Jordan 7 Retro 2", "/images/shoe/2.jpeg", 1200000, 1], fetch_transaction_success("Product 02"), transaction_error);
    tx.executeSql(query, ["Air Jordan 7 Retro 3", "/images/shoe/3.jpeg", 1200000, 4], fetch_transaction_success("Product 03"), transaction_error);
    tx.executeSql(query, ["Air Jordan 7 Retro 4", "/images/shoe/4.jpeg", 5000000, 1], fetch_transaction_success("Product 04"), transaction_error);
    tx.executeSql(query, ["Air Jordan 7 Retro 6", "/images/shoe/6.jpeg", 3400000, 2], fetch_transaction_success("Product 06"), transaction_error);
    tx.executeSql(query, ["Air Jordan 7 Retro 7", "/images/shoe/13.jpeg", 6500000, 2], fetch_transaction_success("Product 07"), transaction_error);
    tx.executeSql(query, ["Air Jordan 7 Retro 8", "/images/shoe/14.jpeg", 3000000, 3], fetch_transaction_success("Product 08"), transaction_error);
    tx.executeSql(query, ["Air Jordan 7 Retro 9", "/images/shoe/9.jpeg", 4000000, 3], fetch_transaction_success("Product 09"), transaction_error);
    tx.executeSql(query, ["Air Jordan 7 Retro 10", "/images/shoe/16.jpeg", 5000000, 3], fetch_transaction_success("Product 10"), transaction_error);
    tx.executeSql(query, ["Air Jordan 7 Retro 11", "/images/shoe/15.jpeg", 7000000, 3], fetch_transaction_success("Product 11"), transaction_error);
    tx.executeSql(query, ["Air Jordan 7 Retro 12", "/images/shoe/12.jpeg", 4000000, 3], fetch_transaction_success("Product 12"), transaction_error);
  });
}