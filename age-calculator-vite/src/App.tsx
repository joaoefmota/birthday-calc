import { SetStateAction, useEffect, useMemo, useState } from "react";
import "./App.css";

interface AgeProps {
  day: number | undefined;
  month: number | undefined;
  year: number | undefined;
}

function isAgeProp(key: string): key is keyof AgeProps {
  return ["day", "month", "year"].includes(key);
}

function App() {
  const [info, setInfo] = useState<AgeProps>({
    day: undefined,
    month: undefined,
    year: undefined,
  });
  const [dayError, setDayError] = useState(false);
  const [monthError, setMonthError] = useState(false);
  const [yearError, setYearError] = useState(false);

  // const [time, setTime] = useState({year: 0,month: 0,day: 0,});

  const [isVisible, setIsVisible] = useState(false);
  // const [isError, setIsError] = useState(false);
  const [isDisabled, setIsDisabled] = useState(false);
  // Declare a state variable for each input element's error status
  const [errorMessage, setErrorMessage] = useState({
    day: "",
    month: "",
    year: "",
  });

  const handleChange = (title: string, value: string) => {
    // Check if title is a valid property name
    if (isAgeProp(title)) {
      // Update the state with the value
      setInfo((prev) => ({ ...prev, [title]: value }));
    }
  };

  const handleClick = () => {
    // Declare a variable to store the key of the non-undefined property
    let nonUndefinedKey: keyof AgeProps | null = null;
    // Loop over the keys of the info object
    for (const key in info) {
      // Check if the value of the property is not undefined
      if (info[key as keyof AgeProps] !== undefined) {
        // Set the variable to the key
        nonUndefinedKey = key as keyof AgeProps;
        // Exit the loop
        break;
      }
    }
    // Set the states based on the variable
    setIsVisible(nonUndefinedKey !== null);
    setIsDisabled(nonUndefinedKey !== null);
  };

  /* 
  const handleClick = () => {
  // Get an array of the values of the info object
  const values = Object.values(info);
  // Check if any value is not undefined
  const hasNonUndefinedValue = values.some((value) => value !== undefined);
  // Set the states based on the result
  setIsVisible(hasNonUndefinedValue);
  setIsDisabled(hasNonUndefinedValue);
};
  */

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

  // Memoize the age calculation
  const age = useMemo(() => {
    // Create a date object for the user's birthday
    const birthday = new Date(
      info.year ?? 0,
      (info.month ?? 1) - 1,
      info.day ?? 1
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

  useEffect(() => {
    console.log("info", info);
  }, [info]);

  return (
    <div className="card">
      <h1>Age Calculator App</h1>
      <div className="topInput">
        <form>
          <div>
            <label>Day</label>
            <input
              type="number"
              name="day"
              title="The Day of your birth"
              value={info.day}
              onChange={(e) => handleChange(e.target.name, e.target.value)}
              onBlur={(e) =>
                handleBlur(e.target.name, e.target.value, {
                  min: 1,
                  max: 31,
                  errorMessage: `Please enter a valid day for ${
                    info.month ?? ""
                  }/${info.year ?? ""}`,
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
              value={info.month}
              onChange={(e) => handleChange(e.target.name, e.target.value)}
              onBlur={(e) =>
                handleBlur(e.target.name, e.target.value, {
                  min: 1,
                  max: 12,
                  errorMessage: `Please enter a valid month for ${
                    info.month ?? ""
                  }/${info.year ?? ""}`,
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
              value={info.year}
              onChange={(e) => handleChange(e.target.name, e.target.value)}
              onBlur={(e) =>
                handleBlur(e.target.name, e.target.value, {
                  min: 1900,
                  max: new Date().getFullYear(),
                  errorMessage: `Please enter a valid year for ${
                    info.month ?? ""
                  }/${info.year ?? ""}`,
                  setError: setYearError,
                })
              }
              min="1900"
              max={new Date().getFullYear()}
              disabled={isDisabled}
            />
          </div>

          {!isVisible && (
            <button type="button" onClick={handleClick}>
              Calculate how long where you born!
            </button>
          )}
        </form>
      </div>
      {dayError && <p>{errorMessage.day}</p>}
      {monthError && <p>{errorMessage.month}</p>}
      {yearError && <p>{errorMessage.year}</p>}
      {isVisible && (
        <div className="result">
          <p>{age.years} years</p>
          <p>
            {age.months > 1 ? `${age.months} months` : `${age.months} month`}
          </p>
          <p>{age.days} days</p>
        </div>
      )}
    </div>
  );
}

export default App;
