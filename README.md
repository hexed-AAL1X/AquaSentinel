<a id="readme-top"></a>
<!-- SHIELDS -->
<img src="https://github.com/AnderMendoza/AnderMendoza/raw/main/assets/line-neon.gif" width="100%">
<p align='center'> 
  <img alt="GitHub Repo contributors" src="https://img.shields.io/github/contributors/hexed-AAL1X/AquaSentinel?style=for-the-badge">&nbsp;
  <img alt="GitHub Repo forks" src="https://img.shields.io/github/forks/hexed-AAL1X/AquaSentinel?style=for-the-badge">&nbsp;
  <img alt="GitHub Repo stars" src="https://img.shields.io/github/stars/hexed-AAL1X/AquaSentinel?style=for-the-badge">&nbsp;
  <img alt="GitHub Repo issues" src="https://img.shields.io/github/issues/hexed-AAL1X/AquaSentinel?style=for-the-badge">&nbsp;
</p>

<!-- PROJECT LOGO -->
<br>
<div align="center">
   <img src="public/logo.png" alt="Logo" width="320">
   <h3 align="center">AquaSentinel</h3>
   <p align="center">
     Real-time river water quality monitoring for the Amazon
     <br>
     <a href="https://github.com/hexed-AAL1X/AquaSentinel"><strong>Explore the docs »</strong></a>
     <br>
     <br>
     <a href="https://github.com/hexed-AAL1X/AquaSentinel">View Demo</a>
     ·
     <a href="https://github.com/hexed-AAL1X/AquaSentinel/issues/new?labels=bug&template=bug-report---.md">Report Bug</a>
     ·
     <a href="https://github.com/hexed-AAL1X/AquaSentinel/issues/new?labels=enhancement&template=feature-request---.md">Request Feature</a>
   </p>
</div>

<!-- TABLE OF CONTENTS -->
<details>
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-the-proyect">About The Project</a>
      <ul>
        <li>
          <a href="#built-with">Built With</a>
        </li>
      </ul>
    </li>
    <li><a href="#important-notices">Important Notices</a></li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#prerequisites">Prerequisites</a></li>
        <li><a href="#installation">Installation</a></li>
      </ul>
    </li>
    <li>
      <a href="#contributing">Contributing</a>
      <ul>
        <li>
          <a href="#top-contributors">Top Contributors</a>
        </li>
      </ul>
    </li>
    <li><a href="#contact">Contact</a></li>
  </ol>
</details>
<br>

<!-- ABOUT THE PROJECT -->
<a id="about-the-proyect"></a>***About The Project***
<img src="https://user-images.githubusercontent.com/73097560/115834477-dbab4500-a447-11eb-908a-139a6edaec5c.gif">

<div align="center">
  <img src="public/assets/images/dashboard.png" alt="AquaSentinel Dashboard" width="900">
</div>

AquaSentinel is a web platform for monitoring river water quality and detecting mercury contamination linked to illegal mining in Madre de Dios. The frontend delivers dashboards, alerts, maps, and sensor health views so teams can protect public health and Amazonian biodiversity with continuous 24/7 visibility.

Here's why:

* Illegal mining releases more than 180 tons of mercury per year in the region — AquaSentinel turns sensor data into clear, actionable insight.
* The UI covers rivers, mines, sensor maintenance, anomaly detection, and reports in a single responsive experience.
* Built as a modern Next.js app with JWT auth, live charts, and Mapbox-powered geography.

Of course, this is an evolving release. Upcoming updates will keep refining performance, visualizations, and operational workflows.

<a id="built-with"></a> 
### Built With
* ![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=next.js&logoColor=white)&nbsp;
* ![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)&nbsp;
* ![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)&nbsp;
* ![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)&nbsp;
* ![Axios](https://img.shields.io/badge/Axios-5A29E4?style=for-the-badge&logo=axios&logoColor=white)&nbsp;
* ![Mapbox](https://img.shields.io/badge/Mapbox-000000?style=for-the-badge&logo=mapbox&logoColor=white)&nbsp;
* ![Git](https://img.shields.io/badge/GIT-E44C30?style=for-the-badge&logo=git&logoColor=white)&nbsp;
<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- IMPORTANT NOTICES -->
<a id="important-notices"></a>***Important Notices***
<img src="https://user-images.githubusercontent.com/73097560/115834477-dbab4500-a447-11eb-908a-139a6edaec5c.gif">

> [!NOTE]  
> To install and run AquaSentinel, make sure you have the following:
> 
> | Requirement        | Description                                                                                       |
> |--------------------|---------------------------------------------------------------------------------------------------|
> | Operative System    | ![Linux](https://img.shields.io/badge/Linux-FCC624?style=for-the-badge&logo=linux&logoColor=black&color=black) ![Windows](https://img.shields.io/badge/Windows-0078D6?style=for-the-badge&logo=windows&logoColor=white&color=black) ![macOS](https://img.shields.io/badge/macOS-000000?style=for-the-badge&logo=apple&logoColor=white&color=black) |
> | Runtime             | ![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white&color=black) |
> | Package Manager     | ![npm](https://img.shields.io/badge/npm-CB3837?style=for-the-badge&logo=npm&logoColor=white&color=black) |
> | Backend             | REST API available and CORS configured |
 
> [!IMPORTANT]\
> We are a small team, but we are committed to improving AquaSentinel. Expect continuous updates to strengthen monitoring accuracy, UI performance, and field operations support.
<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- GETTING STARTED -->
<a id="getting-started"></a>***Getting Started***
<img src="https://user-images.githubusercontent.com/73097560/115834477-dbab4500-a447-11eb-908a-139a6edaec5c.gif">
These are instructions on how to configure your project locally. To get a local copy up and running, follow these simple example steps.

<a id="prerequisites"></a>
### Prerequisites
These are the items needed to use the software and how to install them:
* [Node.js](https://nodejs.org/) 18+ (LTS recommended)
* npm (bundled with Node.js)
* A running AquaSentinel API (or a compatible REST backend)

<a id="installation"></a>
### Installation
_Below is an example of how to install and configure AquaSentinel on your local machine._

1. Clone the repository
   ```sh
   git clone https://github.com/hexed-AAL1X/AquaSentinel.git
   ```
2. Navigate to the project directory
   ```sh
   cd AquaSentinel
   ```
3. Install dependencies
   ```sh
   npm install
   ```
4. Create a `.env.local` file in the project root with your values:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost/api
   NEXT_PUBLIC_MAPBOX_TOKEN=your_mapbox_token
   ```
5. Run the development server
   ```sh
   npm run dev
   ```
6. Open [http://localhost:3000](http://localhost:3000) in your browser

7. (Optional) Change the Git remote URL to prevent accidental pushes to the base project
   ```sh
   git remote set-url origin https://github.com/tu_usuario/AquaSentinel
   git remote -v #confirm the changes
   ```

### Production
```sh
npm run build
npm start
```
<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- CONTRIBUTING -->
<a id="contributing"></a>***Contributing***
<img src="https://user-images.githubusercontent.com/73097560/115834477-dbab4500-a447-11eb-908a-139a6edaec5c.gif">
Contributions are what make the open source community an amazing place to learn, be inspired, and create. Any contribution you wish to make is very welcome!

If you have a suggestion to improve the project, you can fork the repository and open a pull request.
Don't forget to give the project a star! Thanks for contributing!

1. Fork the project.
2. Create a branch for your improvement (`git checkout -b feature/NewImprovement`).
3. Make your changes and commit (`git commit -m 'Add New Improvement'`).
4. Push your changes to the branch (`git push origin feature/NewImprovement`).
5. Open a pull request.

<a id="top-contributors"></a>
### Top contributors:
<div align="center">
  <a href="https://github.com/hexed-AAL1X"><img src="https://github.com/hexed-AAL1X.png" alt="hexed-AAL1X" width="150" height="150" style="border-radius: 50%; border: 2px solid #000;"/></a>
</div>
<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- CONTACT -->
<a id="contact"></a>***Contact***
<img src="https://user-images.githubusercontent.com/73097560/115834477-dbab4500-a447-11eb-908a-139a6edaec5c.gif">
<p align="center">
  <a href="mailto:hexed_aal1x.ops@proton.me"><img src="https://img.shields.io/badge/Gmail-D14836?style=for-the-badge&logo=gmail&logoColor=white&color=black" /></a>
  <a href="https://www.instagram.com/hexed_aal1x"><img src="https://img.shields.io/badge/instagram-%2312100E.svg?&style=for-the-badge&logo=instagram&logoColor=white&color=black" /></a>
  <a href="https://www.linkedin.com/in/leonardo-bravo-4120b8228/"><img src="https://img.shields.io/badge/linkedin-%2312100E.svg?&style=for-the-badge&logo=linkedin&logoColor=white&color=black" /></a>
</p>
<p align="right">(<a href="#readme-top">back to top</a>)</p>
