export interface AgeProps {
  day: number | string;
  month: number | string;
  year: number | string;
}

export interface AgeMemo {
  age: { years: number; months: number; days: number };
  isDisabled: (value: boolean) => void;
  setInfo: React.Dispatch<React.SetStateAction<AgeProps>>;
  resetForm: useRef<HTMLFormElement>;
  setIsVisible: (value: boolean) => void;
}
