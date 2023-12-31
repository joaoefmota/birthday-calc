import React, { useState, useEffect, useMemo, useRef } from "react";
import { AgeProps } from "../types/age";
import AgeShow from "./AgeShow";

function isAgeProp(key: string): key is keyof AgeProps {
  return ["day", "month", "year"].includes(key);
}

export default function Form() {
  const [info, setInfo] = useState<AgeProps>({
    day: "",
    month: "",
    year: "",
  });

  const [dayError, setDayError] = useState(false);
  const [monthError, setMonthError] = useState(false);
  const [yearError, setYearError] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isDisabled, setIsDisabled] = useState(false);
  // Declare a state variable for each input element's error status
  const [errorMessage, setErrorMessage] = useState({
    day: "",
    month: "",
    year: "",
    submit: "",
  });

  const formRef = useRef<HTMLFormElement>(null);

  // Memoize the age calculation
  const age = useMemo(() => {
    // Create a date object for the user's birthday
    const birthday = new Date(
      info.year ? Number(info.year) : 0,
      (info.month ? Number(info.month) : 1) - 1,
      info.day ? Number(info.day) : 1
    );
    // Get the current date
    const now = new Date();
    // Calculate the difference in years
    let years = now.getFullYear() - birthday.getFullYear();
    console.log("years", years);
    // Calculate the difference in months
    let months = now.getMonth() - birthday.getMonth();
    console.log("months", months);
    // Calculate the difference in days
    let days = now.getDate() - birthday.getDate();
    console.log("days", days);
    // Adjust the values if negative
    if (months < 0) {
      years--;
      months += 12;
    }
    if (days < 0) {
      months--;
      days += new Date(
        birthday.getFullYear(),
        birthday.getMonth(),
        0
      ).getDate();
    }
    // Return an object with the age values
    return { years, months, days };
  }, [info]);

  const handleChange = (title: string, value: string) => {
    // Check if title is a valid property name
    if (isAgeProp(title)) {
      // Update the state with the value
      setInfo((prev) => ({ ...prev, [title]: value }));
    }
  };

  const handleBlur = (
    name: string,
    value: string,
    options: {
      min: number;
      max: number;
      errorMessage: string;
      setError: React.Dispatch<React.SetStateAction<boolean>>;
    }
  ) => {
    // Convert the value to a number
    const num = Number(value);
    // Check if the value is a valid number and within the range
    if (!isNaN(num) && num >= options.min && num <= options.max) {
      // If yes, update the state with the value
      setInfo((prev) => ({ ...prev, [name]: value }));
      // Clear any error status
      options.setError(false);
      // Clear any error message
      setErrorMessage((prev) => ({ ...prev, [name]: "" }));
    } else {
      // If no, set an error status and message
      options.setError(true);
      setErrorMessage((prev) => ({ ...prev, [name]: options.errorMessage }));
    }
  };

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    // Prevent the default behavior of the form
    e.preventDefault();
    if (
      dayError ||
      monthError ||
      yearError ||
      !info.day ||
      !info.month ||
      !info.year
    ) {
      // Hide the result and enable the inputs
      setIsVisible(false);
      setIsDisabled(false);
      setErrorMessage((prev) => {
        if (!info.day) {
          return {
            ...prev,
            submit: "Please introduce a valid day",
          };
        } else if (!info.month) {
          return {
            ...prev,
            submit: "Please introduce a valid month",
          };
        } else if (!info.year) {
          return {
            ...prev,
            submit: "Please introduce a valid year",
          };
        }
        return prev;
      });
    } else {
      setIsVisible(true);
      setIsDisabled(true);
      setErrorMessage((prev) => ({
        ...prev,
        submit: "",
      }));
    }
  };

  const resetForm = () => {
    if (formRef.current) {
      formRef.current.reset();
    }
  };

  useEffect(() => {
    console.log("info", info);
  }, [info]);

  const { day, month, year } = info;

  return (
    <div>
      <form onSubmit={onSubmit} ref={formRef}>
        <div>
          <label>Day</label>
          <input
            type="number"
            name="day"
            title="The Day of your birth"
            value={day}
            onChange={(e) => handleChange(e.target.name, e.target.value)}
            onBlur={(e) =>
              handleBlur(e.target.name, e.target.value, {
                min: 1,
                max: 31,
                errorMessage: `Please enter a valid day`,
                setError: setDayError,
              })
            }
            min="1"
            max="31"
            disabled={isDisabled}
          />
        </div>
        <div>
          <label>Month</label>
          <input
            type="number"
            name="month"
            title="The Month of your birth"
            value={month}
            onChange={(e) => handleChange(e.target.name, e.target.value)}
            onBlur={(e) =>
              handleBlur(e.target.name, e.target.value, {
                min: 1,
                max: 12,
                errorMessage: `Please enter a valid month`,
                setError: setMonthError,
              })
            }
            min="1"
            max="12"
            disabled={isDisabled}
          />
        </div>
        <div>
          <label>Year</label>
          <input
            type="number"
            name="year"
            title="The Year of your birth"
            value={year}
            onChange={(e) => handleChange(e.target.name, e.target.value)}
            onBlur={(e) =>
              handleBlur(e.target.name, e.target.value, {
                min: 1900,
                max: new Date().getFullYear(),
                errorMessage: `Please enter a valid year`,
                setError: setYearError,
              })
            }
            min="1900"
            max={new Date().getFullYear()}
            disabled={isDisabled}
          />
        </div>
        {!isVisible && (
          <button type="submit">Calculate how long where you born!</button>
        )}
      </form>
      {dayError && <p>{errorMessage.day}</p>}
      {monthError && <p>{errorMessage.month}</p>}
      {yearError && <p>{errorMessage.year}</p>}
      {errorMessage.submit.length > 0 && <p>{errorMessage.submit}</p>}
      {isVisible && (
        <AgeShow
          age={age}
          isDisabled={setIsDisabled}
          resetForm={resetForm}
          setInfo={setInfo}
          setIsVisible={setIsVisible}
        />
      )}
    </div>
  );
}
