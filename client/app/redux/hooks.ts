import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "./store";

export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppSelector = useSelector.withTypes<RootState>();

type TDebouncedProps = {
  searchTerm: string;
  delay: number;
};

export const useDebounced = ({ searchTerm, delay }: TDebouncedProps) => {
  const [debouncedValue, setDebouncedValue] = useState<string>(searchTerm);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(searchTerm);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [delay, searchTerm]);

  return debouncedValue;
};
