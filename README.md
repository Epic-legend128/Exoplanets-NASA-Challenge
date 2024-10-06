# H-Exo-Plorers - Chronicles of Exoplanets Exploration

## Overview
Welcome to the official repository for **H-Exo-Plorers**! This project was developed as part of the NASA Hackathon at H Farm, where we chose the challenge **"Chronicles of Exoplanets Exploration"**.

Our product is an interactive web-based tool that allows users to explore exoplanets in a 3D environment. The key features of the website include a home page with general information, an "About Us" page with team details and contact information, and most importantly, a fully navigable **3D map of exoplanets**. Users can click on any exoplanet to view detailed information and search for specific planets using a dropdown menu. Additionally, the website has a login/logout system that provides access to a Gemini-powered chatbot capable of answering questions about the exoplanets.

## Features
- **Homepage**: General information about the project.
- **About Us**: Details about the team and how to contact us.
- **3D Exoplanet Map**: 
  - Navigate space and click on exoplanets to view information.
  - Search for planets using a dropdown menu.
  - Explore a 3D representation of space using *Three.js*.
- **Gemini-Powered Chatbot**: 
  - Accessible after login.
  - Provides answers to questions about the exoplanets based on available data.
- **Login/Logout System**: User authentication for chatbot access.
- **3D Planet Models**: 
  - Some exoplanet surfaces are modeled in Blender, though the full implementation is still in progress.

## Tech Stack
- **Frontend**: 
  - EJS (Embedded JavaScript Templates)
  - JavaScript (with *Three.js* for 3D rendering)
  - CSS for styling
- **Backend**:
  - Node.js
  - Packages used (via npm):
  
- **3D Modeling**: Blender (used to create planet models)

## Known Limitations
3D planetary environments on the surface itself are still a work in progress due to time constraints. The current implementation does not fully reflect the detailed surface environments of the exoplanets.

## How to Run
1. Clone the repository:
```bash
  git clone https://github.com/your-repo-name/h-exo-plorers.git
```
2. Install dependencies
   ```bash
   npm install
   ```
3. Start the application
```bash
npm start
```
4. Navigate to http://localhost:3000 in your browser to access the website.
