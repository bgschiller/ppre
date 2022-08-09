// import { Link } from "@remix-run/react";

function scrollToTop() {
  document.body.scrollTop = document.documentElement.scrollTop = 0;
}

export function Footer() {
  return (
    <footer className="absolute bottom-0 right-0 left-0 bg-[#f5f5f5]">
      <div className="mh-20 grid grid-cols-6 bg-indigo-200 p-6 leading-8 sm:grid-cols-2 lg:grid-cols-3">
        <div className="col-span-5 grid grid-cols-1 sm:col-span-1 lg:col-span-2 lg:grid-cols-2 lg:flex-row">
          <p className="">&copy; Brian Schiller 2022. All rights reserved.</p>
          {/* <div className="flex flex-col leading-8 sm:flex-row lg:m-auto">
            <Link to="/terms-and-conditions" className="mr-2">
              Terms and conditions
            </Link>
            <Link to="/privacy-policy" className="">
              Privacy policy
            </Link>
          </div> */}
        </div>
        <div className="col-span-1 ml-auto flex items-center leading-8">
          <a href="#top" className="flex " onClick={scrollToTop}>
            <span className="sr-only sm:not-sr-only sm:mr-2">Back to top</span>
            <span
              aria-hidden="true"
              className="flex h-8 w-8 items-center justify-center rounded-full bg-white"
            >
              <svg
                width="11"
                height="15"
                viewBox="0 0 11 15"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M6.68031 14.881H4.89331L4.89331 3.41998L1.99331 6.31998L0.730309 5.05698L5.78731 -1.81198e-05L10.8413 5.05298L9.57831 6.31598L6.67831 3.41598L6.68031 14.881Z"
                  fill="#00223E"
                />
              </svg>
            </span>
          </a>
        </div>
      </div>
    </footer>
  );
}
