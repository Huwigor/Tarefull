import { useEffect, useState } from 'react';

export default function CountdownTimer({ targetDate }) {
  const [timeLeft, setTimeLeft] = useState({});

  useEffect(() => {
    const intervalId = setInterval(() => {
      updateTimeLeft();
    }, 1000);

    updateTimeLeft(); 

    return () => clearInterval(intervalId); 
  }, [targetDate]);

  const updateTimeLeft = () => {
    const now = new Date();
    const end = new Date(targetDate);
    let diff = end - now;

    if (diff <= 0) {
      setTimeLeft({ expired: true });
      return;
    }

    const secondsIn = {
      year: 31536000000,
      month: 2628000000,
      day: 86400000,
      hour: 3600000,
      minute: 60000,
      second: 1000,
    };

    const years = Math.floor(diff / secondsIn.year);
    diff %= secondsIn.year;

    const months = Math.floor(diff / secondsIn.month);
    diff %= secondsIn.month;

    const days = Math.floor(diff / secondsIn.day);
    diff %= secondsIn.day;

    const hours = Math.floor(diff / secondsIn.hour);
    diff %= secondsIn.hour;

    const minutes = Math.floor(diff / secondsIn.minute);
    diff %= secondsIn.minute;

    const seconds = Math.floor(diff / secondsIn.second);

    setTimeLeft({ years, months, days, hours, minutes, seconds });
  };

  if (timeLeft.expired) return <p>Tempo esgotado</p>;

  return (
    <p>
      {timeLeft.years > 0 && `${timeLeft.years} ano${timeLeft.years > 1 ? 's' : ''}, `}
      {timeLeft.months > 0 && `${timeLeft.months} mês${timeLeft.months > 1 ? 'es' : ''}, `}
      {timeLeft.days > 0 && `${timeLeft.days} dia${timeLeft.days > 1 ? 's' : ''}`} -{' '}
      {String(timeLeft.hours).padStart(2, '0')}:
      {String(timeLeft.minutes).padStart(2, '0')}:
      {String(timeLeft.seconds).padStart(2, '0')}
    </p>
  );
}
