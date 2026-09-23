export interface Project {
  name: string;
  description: string;
  image: string;
  imageAlt: string;
  tech: string[];
  repo?: string;
  live?: string;
}

export const projects: Project[] = [
  {
    name: "SocketPoker",
    description: "Real-time multiplayer poker backed by a C++ WebSocket server.",
    image: "",
    imageAlt: "",
    tech: ["C++20", "uWebSockets", "React", "TypeScript", "Supabase"],
  },
  {
    name: "The Malie Hotel",
    description: "Create an account, book a room, and pay with Stripe.",
    image: "/Malie.webp",
    imageAlt: "The Malie Hotel booking site home page",
    tech: ["React", "GraphQL", "MongoDB", "Stripe", "Tailwind"],
    repo: "https://github.com/BluSkreen/malie-hotel",
  },
  {
    name: "Dev Dive",
    description: "A job board for tech jobs. Create an account or search postings.",
    image: "/DevDive.webp",
    imageAlt: "Dev Dive job board search page",
    tech: ["Express", "MySQL", "Sequelize", "Handlebars"],
    repo: "https://github.com/BluSkreen/DevDive",
  },
  {
    name: "PrepUrself",
    description: "A meal prep calendar with recipe search.",
    image: "/prepUrself.webp",
    imageAlt: "PrepUrself meal planning calendar",
    tech: ["JavaScript", "REST APIs"],
    repo: "https://github.com/bencha27/prepUrself",
  },
  {
    name: "Weather App",
    description: "Get the forecast for any city and save your searches.",
    image: "/WeatherApp.webp",
    imageAlt: "Weather dashboard with a city search and a list of past cities",
    tech: ["JavaScript", "OpenWeather API"],
    repo: "https://github.com/BluSkreen/weather-dashboard",
    live: "https://blu-forecast.netlify.app/",
  },
  {
    name: "JATE",
    description: "Just Another Text Editor, an installable offline PWA.",
    image: "/JATE.webp",
    imageAlt: "JATE text editor window",
    tech: ["Webpack", "IndexedDB", "PWA"],
    repo: "https://github.com/BluSkreen/Just-Another-Text-Editor",
  },
  {
    name: "Book Search",
    description: "Search the Google Books API, log in, and save the books you find.",
    image: "/BookSearch.webp",
    imageAlt: "Book search results page",
    tech: ["MERN", "GraphQL", "Apollo"],
    repo: "https://github.com/BluSkreen/MERN-Book-Search",
  },
];
