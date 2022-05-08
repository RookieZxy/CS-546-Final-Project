# CS 546 Web Programming I Final Project: YouTape

Our application operates as a movie recommended board. Users are allowed to search for movies by categories and names, have a look at essential information before paying for the ticket and leave a score/comment after watching it. The purpose is to build a platform that users can rely on when hesitating about movie tonight, and a community that users can discuss everything of a movie. 

## Built with

HTML, CSS, Bootstrap, Express, Node.js, and MongoDB.

## How to Setup

Clone the repo 'git clone https://github.com/RookieZxy/CS-546-Final-Project'

Run 'npm install' to install the required dependencies for our project.

Then run 'npm run seed' to run the task of seeding the database.

(Initial user: admin, password: 123456)

## Executing Program

Run 'npm run start' to run the application. Then navigate to http://localhost:3000/ to view the website.

## How the Application Works

Upon loading the website, the first page will be the home page.

A non-authenticated user will be able to view the list of movies, and the individual page of each movie. Only an authenticated user will be able to upload new movie, view or edit their profile, make comment and rate for movie.

In addition, an administrator will be able to manage users and review movies.

## Additional Extra Features

- Users can see their comments on the user page
- Administrator can delete comments
- share to social media (like Facebook, Instagram, Twitter, etc. )
- If users upload a movie, they can see the administrator's review progress.
- Administrator can delete movies

## API Keys

This web application integrates the IMDB API. In order to run the application properly, request API keys from the IMDB API (https://imdb-api.com/). Then insert those keys into the appropriate variables in the 'config/settings.json'.

## Authors

- Junjie Chen

- Xiangyu Zhou

- An Sun

- Yuankai Ma

- Ming Tang 

## GitHub Link
- https://github.com/RookieZxy/CS-546-Final-Project
