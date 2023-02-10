import React from "react";

const callouts = [
  {
    name: 'The Malie Hotel',
    description: 'Create an account, book a room, and pay with stripe.',
    imageSrc: '/malie.PNG',
    imageAlt: 'Resort Hotel, Full Stack Project.',
    href: '',
  },
  {
    name: 'Dev Dive',
    description: 'A board for Tech Jobs.',
    imageSrc: '/DevDive.png',
    imageAlt: '',
    href: '#',
  },
  {
    name: 'PrepUrself',
    description: 'A calendar for meal prep.',
    imageSrc: '/prepUrself.png',
    imageAlt: '',
    href: '#',
  },
  {
    name: 'Weather App',
    description: 'Get the weather forcast for any city and save it.',
    imageSrc: 'WeatherApp.png',
    imageAlt: '',
    href: '#',
  },
  {
    name: 'JATE',
    description: 'Just Another Text Editor',
    imageSrc: 'JATE.png',
    imageAlt: '',
    href: 'https://github.com/BluSkreen/Just-Another-Text-Editor',
  },
  {
    name: 'Book Search',
    description: 'Login and save any book you\'re searching for.',
    imageSrc: 'BookSearch.png',
    imageAlt: '',
    href: '#',
  },
]

import { useAppDispatch } from '../redux/hooks';
import { setLocation } from "../redux/location";

const Projects = () => {
    const dispatch = useAppDispatch();
    dispatch(setLocation("projects"));

    return (
        <section className="mt-44 mb-10 w-full h-full flex justify-center">
    <div className="flex content-center">
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto max-w-4xl">
          <h2 className="text-2xl text-center font-bold text-gray-100">Projects</h2>

          <div className="mt-6 space-y-12 md:grid md:grid-cols-2 md:gap-x-6 md:space-y-0 2xl:grid 2xl:grid-cols-3 2xl:gap-x-6 2xl:space-y-0">
            {callouts.map((callout) => (
              <div key={callout.name} className="group relative">
                <div className="relative h-60 w-full overflow-hidden rounded-sm bg-white group-hover:opacity-75 sm:aspect-w-4 sm:aspect-h-1 sm:h-60">
                  <img
                    src={callout.imageSrc}
                    alt={callout.imageAlt}
                    className="h-full w-full object-cover object-center"
                  />
                </div>
                <h3 className="mt-2 text-sm text-gray-400">
                  <a href={callout.href}>
                    <span className="absolute inset-0" />
                    {callout.name}
                  </a>
                </h3>
                <p className="mb-4 text-base font-semibold text-gray-100">{callout.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
        </section>
    );
};
export default Projects;
