import { useWindowSize } from "./util";
import useEmblaCarousel from "embla-carousel-react";
import type { ReactNode } from "react";
import { useCallback, useEffect, useState } from "react";
import {
  ArrowNarrowLeftIcon,
  ArrowNarrowRightIcon,
} from "@heroicons/react/outline";
import React from "react";

export interface GridProps {
  className?: string;
  children: ReactNode;
  cols: number;
  gridClassName?: string;
  carousel?: boolean;
  carouselDisableBreakpoint?: number;
}

interface CarouselProps {
  children: ReactNode;
  className?: string;
  carouselOptions?: CarouselOptions;
}

interface CarouselOptions {
  carouselDisableBreakpoint?: number;
  activeSlideDotColor?: string;
  inactiveSlideDotColor?: string;
  overrideCarouselClassNames?: CarouselClassNames;
}

interface CarouselClassNames {
  slides?: string;
  controls?: string;
  left?: string;
  right?: string;
  currentSlideWrapper?: string;
  currentSlideDot?: string;
}

export const Grid = ({
  className = "",
  children,
  cols,
  gridClassName,
  carousel = false,
}: GridProps) => {
  const { width } = useWindowSize();
  const carouselDisableBreakpoint = 640;
  // You can't string concat with tailwind classes, so we have to list out the full class names and pick one
  // This is so the tailwind compiler picks up the class names to include in the built CSS file
  const gridClasses = [
    "gap-3",
    "gap-3 grid-cols-1",
    "gap-3 grid-cols-1 sm:grid-cols-2",
    "gap-3 grid-cols-1 sm:grid-cols-2 md:grid-cols-3",
    "gap-3 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4",
    "gap-3 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5",
    "gap-3 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6",
    "gap-3 grid-cols-1 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7",
    "gap-3 grid-cols-2 sm:grid-cols-4 md:grid-cols-4 lg:grid-cols-8",
  ];

  if (carousel && width && width < carouselDisableBreakpoint) {
    return (
      <Carousel
        carouselOptions={{ carouselDisableBreakpoint }}
        className={className}
      >
        {children}
      </Carousel>
    );
  } else {
    return (
      <div className={`overflow-hidden ${className} `}>
        <div className={`grid ${gridClassName || gridClasses[cols]}`}>
          {children}
        </div>
      </div>
    );
  }
};

const Carousel = ({
  children,
  className = "",
  carouselOptions = {},
}: CarouselProps) => {
  const {
    activeSlideDotColor = "black",
    inactiveSlideDotColor = "lightgray",
    overrideCarouselClassNames,
  } = carouselOptions;
  const [emblaRef, emblaApi] = useEmblaCarousel();
  const [slideCount, setSlideCount] = useState(0);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [areSlidesBefore, setAreSlidesBefore] = useState(false);
  const [areSlidesAfter, setAreSlidesAfter] = useState(true);

  const carouselLeft = useCallback(() => {
    emblaApi?.scrollPrev();
  }, [emblaApi]);

  const carouselRight = useCallback(() => {
    emblaApi?.scrollNext();
  }, [emblaApi]);

  const carouselTo = useCallback(
    (index) => {
      emblaApi?.scrollTo(index);
    },
    [emblaApi]
  );

  // Monitor children props to re-count number of carousel slides
  useEffect(() => {
    if (React.isValidElement(children)) {
      // children is an element, so we'll assume it's a fragment containing our actual children
      setSlideCount(React.Children.count(children.props.children));
    } else {
      // children is not an element, so it's probably an array of elements instead
      setSlideCount(React.Children.count(children));
    }
  }, [children]);

  useEffect(() => {
    if (emblaApi) {
      emblaApi.on("select", () => {
        setCurrentSlide(emblaApi.selectedScrollSnap());
        setAreSlidesBefore(emblaApi.canScrollPrev());
        setAreSlidesAfter(emblaApi.canScrollNext());
      });
    }
  }, [emblaApi]);

  return (
    <div
      className={`grid-carousel overflow-hidden ${className}`}
      ref={emblaRef}
    >
      <div className={overrideCarouselClassNames?.slides || "slides flex"}>
        {children}
      </div>
      <div
        className={
          overrideCarouselClassNames?.controls ||
          "controls mt-3 grid grid-cols-3"
        }
      >
        <div>
          <button
            aria-label="Previous slide"
            style={areSlidesBefore ? {} : { display: "none" }}
            onClick={carouselLeft}
            className={
              overrideCarouselClassNames?.left || "left block w-12 py-3 pr-6"
            }
          >
            <ArrowNarrowLeftIcon />
          </button>
        </div>
        <div
          className={
            overrideCarouselClassNames?.currentSlideWrapper || "m-auto mt-2"
          }
        >
          {[...Array(slideCount)].map((e, i) => (
            <button
              key={i}
              aria-label={`Go to slide ${i + 1}`}
              onClick={() => carouselTo(i)}
            >
              <svg
                className={
                  overrideCarouselClassNames?.currentSlideDot || "w-6 p-2"
                }
                viewBox="0 0 40 40"
                xmlns="http://www.w3.org/2000/svg"
              >
                <circle
                  cx="20"
                  cy="20"
                  r="20"
                  fill={
                    currentSlide === i
                      ? activeSlideDotColor
                      : inactiveSlideDotColor
                  }
                />
              </svg>
            </button>
          ))}
        </div>
        <div>
          <button
            aria-label="Next slide"
            style={areSlidesAfter ? {} : { display: "none" }}
            onClick={carouselRight}
            className={
              overrideCarouselClassNames?.right ||
              "right ml-auto block w-12 py-3 pl-6"
            }
          >
            <ArrowNarrowRightIcon />
          </button>
        </div>
      </div>
    </div>
  );
};
