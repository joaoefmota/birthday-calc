import { AgeMemo } from "../types/age";

export default function AgeShow({
  age,
  isDisabled,
  resetForm,
  setInfo,
  setIsVisible,
}: AgeMemo) {
  const { years, months, days } = age;
  const handleReset = () => {
    resetForm();
  };
  return (
    <div className="result">
      <p>{years > 1 ? `${years} years` : `${years} year`}</p>
      <p>{months > 1 ? `${months} months` : `${months} month`}</p>
      <p>{days > 1 ? `${days} days` : `${days} day`}</p>
      <button
        onClick={() => {
          isDisabled(false);
          handleReset;
          setInfo({ day: "", month: "", year: "" });
          setIsVisible(false);
        }}
      >
        Change Values 😊
      </button>
    </div>
  );
}
