# AI Tools Web Platform  
**Web Application Development – Assignment 1 & 2**

## 📌 Project Overview
This project is a **web platform for browsing, filtering, and managing Artificial Intelligence (AI) tools**.  
It was developed as part of the university course **Web Application Development** and combines the solutions of **Assignment 1 & 2** into a single, fully functional application.

- **Assignment 1** focused on building a structured, responsive website using **HTML and CSS**
- **Assignment 2** extended the project with **JavaScript interactivity** and a custom **Node.js + Express backend**

The second assignment **directly builds upon the first**, enhancing it with dynamic content, form validation, server-side logic, and a REST API.

---

## 🧱 Tech Stack
- HTML5  
- CSS3 (responsive design, media queries)  
- JavaScript (ES6+)  
- Node.js  
- Express.js  
- CSV file as a data source  
- REST API  

---

## 🗂️ Project Structure
```text
/
├── server.js
├── html/
│   ├── index.html
│   ├── aboutAuthor.html
│   ├── documentation.html
│   ├── details.html
│   └── ...
├── css/
│   └── *.css
├── js/
│   ├── client/
│   │   ├── *.js
│   └── server/
│       └── *.js
├── resources/
│   ├── images/
│   └── other/
├── tools.csv
└── README.md



---

## 🌐 Features

### Frontend
- Multi-page web application (home, author, documentation, details)
- CSS-based carousel enhanced with JavaScript
- FAQ section implemented using a table
- Responsive layout (desktop & mobile friendly)
- Image gallery with lightbox modal
- Client-side form validation using JavaScript and regular expressions
- Dynamic text expansion (“read more” functionality)
- Active navigation highlighting via JavaScript

### Backend
- Custom Node.js + Express web server
- Serving static HTML, CSS, JS, and resource files
- Dynamic page: `/tools`
- Tool details page: `/tools/details`
- Data persistence via a CSV file
- Fully implemented REST API:
  - GET `/api/tools`
  - POST `/api/tools`
  - GET `/api/tools/:name`
  - PUT `/api/tools/:name`
  - DELETE `/api/tools/:name`

---

## 🎓 Academic Context

This project was developed exclusively for educational purposes as part of coursework at the
Faculty of Organization and Informatics.

All functional, structural, and technical requirements defined in the assignment specifications have been fully implemented.

---

## 👤 Author

Marin Prusac
Faculty of Organization and Informatics
Course: Web Application Development
Academic Year: 2023/2024

---

## 🧠 GitHub Metadata
Topics
html css javascript nodejs express rest-api web-platform academic-project
