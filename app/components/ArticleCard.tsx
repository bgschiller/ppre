import type { ImgHTMLAttributes } from "react";
import { Button } from "./Button";
import { Link } from "@remix-run/react";

export type ArticleCardProps = {
  imageProps?: ImgHTMLAttributes<HTMLImageElement>;
  category?: {
    label: string;
    to: string;
  };
  date: string;
  title: string;
  buttonTo: string;
};

export const ArticleCard = ({
  imageProps,
  category,
  date,
  title,
  buttonTo,
}: ArticleCardProps) => {
  return (
    <div className="relative flex-shrink-0 basis-full overflow-hidden">
      {
        // eslint-disable-next-line jsx-a11y/alt-text
        imageProps && <img {...imageProps} />
      }
      <div className="p-4 lg:p-8">
        <div className="mb-5">
          {category && (
            <Link
              to={category.to}
              className="mr-4 rounded-full bg-black px-4 py-1 text-sm text-white"
            >
              {category.label}
            </Link>
          )}
          <span className="text-sm">{date}</span>
        </div>
        <div className="mb-6 text-2xl">{title}</div>
        <Button to={buttonTo}>Read more</Button>
      </div>
    </div>
  );
};
