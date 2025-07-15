import { useEffect, useState } from 'react';

export default function CountdownTimer({ targetDate, dataAtual }) {
  const [timeLeft, setTimeLeft] = useState({});
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const intervalId = setInterval(() => {
      updateProgress();
    }, 1000);

    updateProgress(); 

    return () => clearInterval(intervalId);
  }, [targetDate, dataAtual]);

  const updateProgress = () => {
    const now = new Date();
    const start = new Date(dataAtual); 
    const end = new Date(targetDate);   

    if (isNaN(start) || isNaN(end)) {
      setProgress(0);
      return;
    }

    const totalDuration = end - start;  
    const elapsed = now - start;    

    let percentage = (elapsed / totalDuration) * 100;

    percentage = Math.max(0, Math.min(100, percentage));

    setProgress(percentage);

    updateTimeLeft(now, end);
  };

  const updateTimeLeft = (currentDate, endDate) => {
    let diff = endDate - currentDate;

    if (diff <= 0) {
      setTimeLeft({ expired: true });
      return;
    }

    const secondsIn = {
      day: 86400000,
      hour: 3600000,
      minute: 60000,
      second: 1000,
    };

    const days = Math.floor(diff / secondsIn.day);
    diff %= secondsIn.day;

    const hours = Math.floor(diff / secondsIn.hour);
    diff %= secondsIn.hour;

    const minutes = Math.floor(diff / secondsIn.minute);
    diff %= secondsIn.minute;

    const seconds = Math.floor(diff / secondsIn.second);

    setTimeLeft({ days, hours, minutes, seconds });
  };

  if (timeLeft.expired) return <p className='titleFinish'>Tempo esgotado</p>;

  return (
    <div style={{ position: 'relative', top: '30px' }}>
      <p className='titleProgress'>
        {timeLeft.days > 0 && `${timeLeft.days} dia${timeLeft.days > 1 ? 's' : ''}, `}
        {String(timeLeft.hours).padStart(2, '0')} hrs -{' '}
        {String(timeLeft.minutes).padStart(2, '0')} min -{' '}
        {String(timeLeft.seconds).padStart(2, '0')} seg
      </p>
      
      <div style={{
        width: '100%',
        height: '10px',
        backgroundColor: '#e0e0e0',
        borderRadius: '5px',
        marginTop: '10px',
        overflow: 'hidden'
      }}>
        <div style={{
          width: `${progress}%`,
          height: '100%',
          backgroundColor: progress < 80 ? '#4CAF50' : 
                          progress < 95 ? '#FFC107' : '#F44336',
          transition: 'width 1s linear, background-color 0.5s ease'
        }} />
      </div>
      
      <p style={{
        textAlign: 'center',
        marginTop: '5px',
        fontSize: '0.8em',
        color: '#666'
      }}>
        {progress >= 100 ? 'Tarefa concluída' : `Concluído: ${Math.round(progress)}%`}
      </p>
    </div>
  );
}