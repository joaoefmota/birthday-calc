export interface AgeProps {
  day: number | undefined;
  month: number | undefined;
  year: number | undefined;
}

export interface AgeMemo {
  age: { years: number; months: number; days: number };
  isDisabled: (value: boolean) => void;
}
