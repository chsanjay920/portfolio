import { Component } from '@angular/core';

@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.css'],
})
export class ProjectsComponent {
  Projects: any = [
    {
      link: 'https://github.com/chsanjay920/ProjectManagement',
      Name: 'Project Management System',
      image: './assets/images/projects/project_management.jpg',
    },
    {
      link: 'https://github.com/chsanjay920/videoChatApplication',
      Name: 'Video Chatting Application (Web RTC)',
      image: './assets/images/projects/video_chatting.jpg',
    },
    {
      link: 'https://github.com/chsanjay920/EmployeeManagementSystem',
      Name: 'Employee Management System',
      image: './assets/images/projects/employee_management.jpg',
    },
    {
      link: 'https://kahoot-clone-dun.vercel.app/',
      Name: 'Kahoot Live Quize Application Clone',
      image: './assets/images/projects/kahoot.png',
    },
    {
      link: 'https://maze-generator-by-sanjay.vercel.app/',
      Name: 'Maze Generator',
      image: './assets/images/projects/maze_generator.png',
    },
    {
      link: 'https://github.com/chsanjay920/Review-analysis',
      Name: 'Review Analysis Application',
      image: './assets/images/projects/review_analysis.jpg',
    },
    {
      link: 'https://image-gallery-ui.vercel.app/',
      Name: 'Image Gallery',
      image: './assets/images/projects/image_gallery.avif',
    },
    {
      link: 'https://chess-zeta-red.vercel.app/',
      Name: 'Chess Game',
      image: './assets/images/projects/chess_game.jpg',
    },
    {
      link: 'https://github.com/chsanjay920/expression_detection_deepface',
      Name: 'Expression Detection (Python)',
      image: './assets/images/projects/expression_detection.jpg',
    },
    {
      link: 'https://github.com/chsanjay920/LocationTrackingApp',
      Name: 'Live Location Tracking Application',
      image: './assets/images/projects/location_tracking.avif',
    },
    {
      link: 'https://voice-assistant-main-java-script.vercel.app/',
      Name: 'Browser Voice Assistant',
      image: './assets/images/projects/voiceassistant.jpg',
    },
    {
      link: 'https://sudoku-solver-by-sanjay.vercel.app/',
      Name: 'Sudoku Solver (backtracking)',
      image: './assets/images/projects/sudoku.png',
    },
    {
      link: 'https://tic-tac-toe-by-sanjay.vercel.app/',
      Name: 'tic-tac-toe AI player (Min-Max)',
      image: './assets/images/projects/tictactoe.png',
    },
    {
      link: 'https://bingo-by-sanjay.netlify.app/',
      Name: 'BINGO using (Web-Sockets)',
      image: './assets/images/projects/bingo.png',
    },
    {
      link: 'https://secret-chat-black.vercel.app/',
      Name: 'Anonymous chat app',
      image: './assets/images/projects/anonymouschat.jpg',
    },
    {
      link: 'https://github.com/chsanjay920/wubble-chatting',
      Name: 'Random people chat app',
      image: './assets/images/projects/chatting.png',
    },
    {
      link: 'https://github.com/chsanjay920/django-eshop',
      Name: 'ECOMMERCE (DJANGO)',
      image: './assets/images/projects/ecommerce.jpg',
    },
    {
      link: 'https://rock-paper-scissors-by-sanjay.vercel.app/',
      Name: 'ROCK-PAPER-SCISSORS',
      image: './assets/images/projects/rps.jpg',
    },
    {
      link: 'https://github.com/chsanjay920/Banking-Application',
      Name: 'E-BANKING APPLICATION',
      image: './assets/images/projects/ebanking.jpg',
    },
    {
      link: 'https://github.com/chsanjay920/Banking-Application',
      Name: 'COVID-SERVICES',
      image: './assets/images/projects/covid.jpg',
    },
    {
      link: 'https://spsprodeus24.vssps.visualstudio.com/_signin?realm=innovativesoftwaresolutions.visualstudio.com&reply_to=https%3A%2F%2Finnovativesoftwaresolutions.visualstudio.com%2F_git%2FDSR%2520web%2520project&redirect=1&hid=5a786bdd-d630-424e-a18d-09d1aef5fd4a&context=eyJodCI6MiwiaGlkIjoiNjU4YzNhMjEtMzYzMi00NWQ5LWEwNDYtZDcyMTgwMDE0ODYwIiwicXMiOnt9LCJyciI6IiIsInZoIjoiIiwiY3YiOiIiLCJjcyI6IiJ90#ctx=eyJTaWduSW5Db29raWVEb21haW5zIjpbImh0dHBzOi8vbG9naW4ubWljcm9zb2Z0b25saW5lLmNvbSIsImh0dHBzOi8vbG9naW4ubWljcm9zb2Z0b25saW5lLmNvbSJdfQ2',
      Name: 'BHEL-G Document Generator',
      image: './assets/images/projects/Bhel2.png',
    },
    {
      link: 'https://github.com/chsanjay920/traffic-density-detection',
      Name: 'Traffic-Mangement (Tensorflow.js)',
      image: './assets/images/projects/traffic.jpg',
    },
    {
      link: 'https://github.com/chsanjay920/scanner-application',
      Name: 'Fujitsu Scanner project',
      image: './assets/images/projects/scanner.jpg',
    },
    {
      link: 'https://github.com/chsanjay920',
      Name: 'More Projects on GitHub',
      image: './assets/images/projects/github.png',
    },
  ];
}
