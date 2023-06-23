import { useEffect, useMemo, useState } from "react";
import "./App.css";

interface AgeProps {
  day: string;
  month: string;
  year: string;
}

function App() {
  const [info, setInfo] = useState<AgeProps>({
    day: "",
    month: "",
    year: "",
  });

  // const [time, setTime] = useState({year: 0,month: 0,day: 0,});

  const [isVisible, setIsVisible] = useState(false);

  const handleChange = (title: string, value: string) => {
    if (value.length <= max_length) {
      setInfo((prev) => ({ ...prev, [title]: value }));
    }
  };

  const handleClick = () => {
    setIsVisible(true);
  };

  // Memoize the age calculation
  const age = useMemo(() => {
    // Create a date object for the user's birthday
    const birthday = new Date(
      parseInt(info.year),
      parseInt(info.month) - 1,
      parseInt(info.day)
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

  /* 
  const getTime = () => {
    const now = new Date();
    const start = new Date(now.getFullYear(), 0, 0);
    console.log("start get full year", start);
    const diff =
      now -
      start +
      (start.getTimezoneOffset() - now.getTimezoneOffset()) * 60 * 1000;
    const oneDay = 1000 * 60 * 60 * 24;
    const day = Math.floor(diff / oneDay);
    console.log("Day of year: " + day);
    setTime((prev) => ({
      ...prev,
      day: day,
      month: now.getUTCMonth(),
      year: now.getUTCFullYear(),
    }));
  };
  */

  useEffect(() => {
    console.log("info", info);
  }, [info]);

  const max_length = 30;
  const maximumReached = 0 >= max_length;
  const numRemaining = max_length - 0;

  return (
    <div className="card">
      <h1>Age Calculator App</h1>
      <div className="topInput">
        <form
          onSubmit={(e) => {
            e.preventDefault();
          }}
        >
          <div>
            <label>Day</label>
            <input
              type="number"
              name="day"
              value={info.day}
              onChange={(e) => handleChange(e.target.name, e.target.value)}
              min="1"
              max="31"
            />
          </div>
          <div>
            <label>Month</label>
            <input
              type="number"
              name="month"
              value={info.month}
              onChange={(e) => handleChange(e.target.name, e.target.value)}
              min="1"
              max="12"
            />
          </div>
          <div>
            <label>Year</label>
            <input
              type="number"
              name="year"
              value={info.year}
              onChange={(e) => handleChange(e.target.name, e.target.value)}
              min="1900"
              max={new Date().getFullYear()}
            />
          </div>
          <button type="button" onClick={handleClick}>
            Calculate how long where you born!
          </button>
        </form>
      </div>
      {isVisible && (
        <div className="result">
          <p>{age.years} years</p>
          <p>{age.months} months</p>
          <p>{age.days} days</p>
        </div>
      )}
    </div>
  );
}

export default App;
