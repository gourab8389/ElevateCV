const data = [
        {
        name: "Github",
        url: "https://github.com/gourab8389"
        },
        {
        name: "LinkedIn",
        url: "https://www.linkedin.com/in/gourab-dey-7b8b531b3/"
        },
]

const Footer = () => {
  return (
    <div className="w-full max-w-6xl px-5 md:px-10 flex md:flex-row flex-col items-center justify-between py-5 mx-auto border-t border-gray-200">
        <div className="flex items-center">
                <h1>Made by Gourab Dey</h1>
        </div>
      <div className="flex items-center">
        <span className="text-sm text-gray-500">© 2021 ElevateCV. All rights reserved.</span>
      </div>
      <div className="flex items-center gap-2">
        {data.map((item, index) => (
          <a
            key={index}
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 hover:text-blue-700"
          >
            {item.name}
          </a>
        ))}
      </div>
    </div>
  )
}

export default Footer
