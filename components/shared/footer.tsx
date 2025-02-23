import React from 'react';
import { Github, Linkedin } from 'lucide-react';

const data = [
  {
    name: "Github",
    url: "https://github.com/gourab8389",
    icon: <Github className="w-5 h-5" />
  },
  {
    name: "LinkedIn",
    url: "https://www.linkedin.com/in/gourab-dey-7b8b531b3/",
    icon: <Linkedin className="w-5 h-5" />
  }
];

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full border-t border-gray-200 bg-white">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Creator section */}
          <div className="flex items-center">
            <p className="text-lg font-semibold text-gray-800 hover:text-gray-600 transition-colors">
              Made with ❤️ by Gourab Dey
            </p>
          </div>

          {/* Copyright section */}
          <div className="order-3 md:order-2">
            <p className="text-sm text-gray-500">
              © {currentYear} ElevateCV. All rights reserved.
            </p>
          </div>

          {/* Social links */}
          <div className="order-2 md:order-3 flex items-center gap-4">
            {data.map((item, index) => (
              <a
                key={index}
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 rounded-lg text-gray-600 hover:text-blue-600 hover:bg-blue-50 transition-all duration-300"
                aria-label={item.name}
              >
                {item.icon}
                <span className="text-sm font-medium">{item.name}</span>
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;