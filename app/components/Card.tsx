import type { ImgHTMLAttributes } from "react";
import { Button } from "./Button";

export type CardProps = {
  title?: string;
  description?: string;
  imageProps?: ImgHTMLAttributes<HTMLImageElement>;
  button?: {
    label: string;
    to: string;
  };
};

export const Card = ({ title, description, imageProps, button }: CardProps) => {
  return (
    <div className="relative flex-shrink-0 basis-full overflow-hidden bg-gray-100 px-8 py-6 text-center">
      {
        // eslint-disable-next-line jsx-a11y/alt-text
        imageProps && <img className="mb-4" {...imageProps} />
      }
      {title && <div className="mb-2 text-2xl">{title}</div>}
      {description && (
        <div className="mb-4 text-base text-gray-700">{description}</div>
      )}
      {button && <Button to={button.to}>{button.label}</Button>}
    </div>
  );
};
