import { useState, useEffect } from "react";

function CountUp({ end, duration = 2000, suffix = "" }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;

    const increment = end / (duration / 50);

    const interval = setInterval(() => {
      start += increment;

      if (start >= end) {
        setCount(end);
        clearInterval(interval);
      } else {
        setCount(Math.floor(start));
      }
    }, 50);

    return () => clearInterval(interval);
  }, [end, duration]);

  return (
    <>
      {count}
      {suffix}
    </>
  );
}

export default CountUp;