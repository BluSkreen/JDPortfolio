import React from "react";

const callouts = [
  {
    name: 'The Malie Hotel',
    description: 'Create an account, book a room, and pay with stripe.',
    imageSrc: '/malie.PNG',
    imageAlt: 'Resort Hotel, Full Stack Project.',
    href: '#',
  },
  {
    name: 'Self-Improvement',
    description: 'Journals and note-taking',
    imageSrc: 'https://tailwindui.com/img/ecommerce-images/home-page-02-edition-02.jpg',
    imageAlt: 'Wood table with porcelain mug, leather journal, brass pen, leather key ring, and a houseplant.',
    href: '#',
  },
  {
    name: 'Travel',
    description: 'Daily commute essentials',
    imageSrc: 'https://tailwindui.com/img/ecommerce-images/home-page-02-edition-03.jpg',
    imageAlt: 'Collection of four insulated travel bottles on wooden shelf.',
    href: '#',
  },
]

const Projects = () => {

    return (
        <section className="mt-44 w-full h-full flex justify-center">
    <div className="flex content-center">
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto max-w-2xl">
          <h2 className="text-2xl font-bold text-gray-100">Collections</h2>

          <div className="mt-6 space-y-12 lg:grid lg:grid-cols-3 lg:gap-x-6 lg:space-y-0">
            {callouts.map((callout) => (
              <div key={callout.name} className="group relative">
                <div className="relative h-80 w-full overflow-hidden rounded-lg bg-white group-hover:opacity-75 sm:aspect-w-2 sm:aspect-h-1 sm:h-64 lg:aspect-w-1 lg:aspect-h-1">
                  <img
                    src={callout.imageSrc}
                    alt={callout.imageAlt}
                    className="h-full w-full object-cover object-center"
                  />
                </div>
                <h3 className="mt-6 text-sm text-gray-400">
                  <a href={callout.href}>
                    <span className="absolute inset-0" />
                    {callout.name}
                  </a>
                </h3>
                <p className="text-base font-semibold text-gray-100">{callout.description}</p>
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
