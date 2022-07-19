import { Link } from "@remix-run/react";

export type ButtonProps = {
  className?: string;
  children: string;
  to: string;
};

export const buttonClasses =
  "inline-block bg-indigo-600 py-3 px-5 text-white hover:bg-indigo-500";

export const Button = ({ className = "", children, to }: ButtonProps) => {
  return (
    <Link to={to} className={`${buttonClasses} ${className}`}>
      {children}
    </Link>
  );
};
