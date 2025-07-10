import { useState, useEffect } from "react";
import { useRouter } from "next/router";

interface UsePageTransitionReturn {
  isTransitioning: boolean;
  transitionDirection: "forward" | "backward" | null;
  startTransition: (href: string, direction?: "forward" | "backward") => void;
}

export const usePageTransition = (): UsePageTransitionReturn => {
  const router = useRouter();
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [transitionDirection, setTransitionDirection] = useState<
    "forward" | "backward" | null
  >(null);

  useEffect(() => {
    const handleStart = () => {
      setIsTransitioning(true);
    };

    const handleComplete = () => {
      setTimeout(() => {
        setIsTransitioning(false);
        setTransitionDirection(null);
      }, 300);
    };

    const handleError = () => {
      setIsTransitioning(false);
      setTransitionDirection(null);
    };

    router.events.on("routeChangeStart", handleStart);
    router.events.on("routeChangeComplete", handleComplete);
    router.events.on("routeChangeError", handleError);

    return () => {
      router.events.off("routeChangeStart", handleStart);
      router.events.off("routeChangeComplete", handleComplete);
      router.events.off("routeChangeError", handleError);
    };
  }, [router]);

  const startTransition = (
    href: string,
    direction: "forward" | "backward" = "forward",
  ) => {
    setTransitionDirection(direction);
    setIsTransitioning(true);

    setTimeout(() => {
      router.push(href);
    }, 150);
  };

  return {
    isTransitioning,
    transitionDirection,
    startTransition,
  };
};
