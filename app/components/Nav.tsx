import { Button } from "./Button";
import logoImage from "./stories/assets/logo.svg";
import { MenuIcon, XIcon } from "@heroicons/react/solid";
import { Popover } from "@headlessui/react";
import { Link } from "@remix-run/react";

const links = [
  { name: "Home", href: "/" },
  { name: "About Us", href: "/about-us" },
  { name: "Blog", href: "/blog" },
  { name: "Store", href: "/store" },
  { name: "Search", href: "/search" },
];

export type NavProps = {
  sticky?: boolean;
};

export function Nav({ sticky = false }: NavProps) {
  return (
    <Popover
      as="nav"
      className={`flex justify-between bg-white p-2 ${
        sticky ? "sticky top-0 z-50" : ""
      }`}
    >
      <div className="leading-[40px]">
        <Link className="bolder text-xl" to="/">
          Planned Pattern of Regular Eating
        </Link>
      </div>
      <div className="">
        <span className="hidden lg:inline">
          {links.map((link) => (
            <Link key={link.name} to={link.href} className="p-3">
              {link.name}
            </Link>
          ))}
        </span>
        <Popover.Button
          className="ml-4 inline-block w-10 cursor-pointer align-top lg:hidden"
          aria-label="Open navigation menu"
        >
          <MenuIcon />
        </Popover.Button>
      </div>
      <Popover.Overlay className="fixed inset-0 bg-black opacity-40" />
      <Popover.Panel className="absolute top-0 right-14 left-0 z-10 h-screen bg-white">
        <Popover.Button
          className="float-right m-2 w-10 cursor-pointer"
          aria-label="Close navigation menu"
        >
          <XIcon />
        </Popover.Button>
        {links.map((link) => (
          <Popover.Button
            key={link.name}
            as={Link}
            to={link.href}
            className="m-5 block"
          >
            {link.name}
          </Popover.Button>
        ))}
        <Popover.Button as={Link} to="/contact-us" className="m-5 block">
          Contact Us
        </Popover.Button>
      </Popover.Panel>
    </Popover>
  );
}
