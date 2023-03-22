# OnlineStoreDB
This is a web application for users to register, log in, post items, search for items, and leave reviews on items. The application is built with React.js, Express.js, and MySQL.

Getting Started
To get started with the project, follow these steps:

Clone the repository to your local machine.

Install the necessary dependencies by running npm install in both the root directory and the client directory.

Set up a MySQL database by importing the schema.sql file located in the root directory.

Set up the .env file by filling in the necessary values for the following environment variables:

DB_HOST
DB_USER
DB_PASSWORD
DB_DATABASE
PORT
Start the server by running npm start in the root directory.

Start the client by running npm start in the client directory.

User Registration and Login
Users can register for an account by filling out the registration form with their username, password, first name, last name, and email. The application checks for duplicate usernames and emails and prevents SQL injection attacks.

After registering, users can log in using their username and password.

Post Items
Logged in users can post up to 3 items per day by filling out a form with the item's title, description, category, and price. The item ID is generated automatically using the autoincrement feature of MySQL.

Search for Items
Users can search for items by entering a category in a search form. The application returns all items with that category in a table.

Leave Reviews on Items
Users can leave reviews on items by selecting an item from the search results and filling out a form with their rating (excellent, good, fair, or poor) and a description. Users cannot leave a review for their own items, and they can leave at most 3 reviews per day.

Functionality
The application includes the following functionality:

User registration and login with SQL injection prevention.
Posting items with automatic ID generation and a limit of 3 items per day per user.
Searching for items by category.
Leaving reviews on items with a limit of 3 reviews per day per user and preventing users from reviewing their own items.
Listing the most expensive items in each category.
Listing the users who posted at least two items that are posted on the same day, one has a category of X, and another has a category of Y.
Listing all the items posted by a user with only "excellent" or "good" reviews.
Listing the users who posted the most number of items since 5/1/2020 (inclusive).
Listing the other users who are favorited by both users X and Y.
Listing all the users who never posted any "excellent" items.
Listing all the users who never posted a "poor" review.
Listing all the users who posted some reviews, but each of them is "poor".
Listing those users such that each item they posted so far never received any "poor" reviews.
Listing a user pair (A, B) such that they always gave each other "excellent" reviews for every single item they posted.
