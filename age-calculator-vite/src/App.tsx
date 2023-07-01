import { useEffect, useMemo, useState } from "react";
import "./App.css";

interface AgeProps {
  day: number | undefined;
  month: number | undefined;
  year: number | undefined;
}

function App() {
  const [info, setInfo] = useState<AgeProps>({
    day: undefined,
    month: undefined,
    year: undefined,
  });

  // const [time, setTime] = useState({year: 0,month: 0,day: 0,});

  const [isVisible, setIsVisible] = useState(false);
  const [error, setError] = useState(false);
  const [isDisabled, setIsDisabled] = useState(false);

  const handleChange = (title: string, value: string) => {
    const num = Number(value);
    switch (title) {
      case "Month":
        if (num >= 1 && num <= 12) {
          setInfo((prev) => ({ ...prev, [title]: value }));
        }
        break;
      case "Day":
        if (num >= 1 && num <= 31) {
          setInfo((prev) => ({ ...prev, [title]: value }));
        }
        break;
      case "Year":
        if (num >= 1900) {
          setInfo((prev) => ({ ...prev, [title]: value }));
        }
        break;
    }
  };

  const handleClick = () => {
    setIsVisible(true);
    setIsDisabled(true);
  };

  const handleBlur = (title: string, value: string) => {
    // Converte o valor para um número
    const num = parseInt(value);
    // Verifica se o valor é um número válido
    if (!isNaN(num)) {
      // Verifica se o título é "Month" e se o valor está entre 1 e 12
      if (title === "Month" && num >= 1 && num <= 12) {
        // Se sim, atualiza o estado com o valor
        setInfo((prev) => ({ ...prev, [title]: value }));
      }
      // Verifica se o título é "Day" e se o valor está entre 1 e 31
      if (title === "Day" && num >= 1 && num <= 31) {
        // Se sim, atualiza o estado com o valor
        setInfo((prev) => ({ ...prev, [title]: value }));
      }
      // Verifica se o título é "Year" e se o valor é maior ou igual a 1900
      if (title === "Year" && num >= 1900) {
        // Se sim, atualiza o estado com o valor
        setInfo((prev) => ({ ...prev, [title]: value }));
      }
    }
  };

  // Memoize the age calculation
  const age = useMemo(() => {
    // Create a date object for the user's birthday
    const birthday = new Date(info.year!, info.month! - 1, info.day!);
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
              onBlur={(e) => {
                const value = Number(e.target.value);
                if (value < 1 || value > 31) {
                  setError(true);
                  e.target.focus();
                } else {
                  setError(false);
                  handleBlur(e.target.name, e.target.value);
                }
              }}
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
              value={info.month}
              onChange={(e) => handleChange(e.target.name, e.target.value)}
              onBlur={(e) => {
                const value = Number(e.target.value);
                if (
                  value < 1 ||
                  value > 12 ||
                  (info.year === new Date().getFullYear() &&
                    value > new Date().getMonth())
                ) {
                  setError(true);
                  e.target.focus();
                } else {
                  setError(false);
                  handleBlur(e.target.name, e.target.value);
                }
              }}
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
              value={info.year}
              onChange={(e) => handleChange(e.target.name, e.target.value)}
              onBlur={(e) => {
                const value = Number(e.target.value);
                if (value < 1900 || value > new Date().getFullYear()) {
                  setError(true);
                  e.target.focus();
                } else {
                  setError(false);
                  handleBlur(e.target.name, e.target.value);
                }
              }}
              min="1900"
              max={new Date().getFullYear()}
              disabled={isDisabled}
            />
          </div>
          {error && <p>Please introduce a valid number</p>}
          {!isVisible && (
            <button type="button" onClick={handleClick}>
              Calculate how long where you born!
            </button>
          )}
        </form>
      </div>
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
