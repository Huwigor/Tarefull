import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import '../css/Home.css'

const comments = [
  "Organize seu dia em minutos e conquiste mais tempo para o que realmente importa!",
  "Planeje com inteligência, viva com liberdade!",
  "Transforme sua rotina com um clique!"
];

export default function MainContent() {

  const Navigate = useNavigate()

  function MakeTask(){
    Navigate('/MakeTask')
  }

  const [index, setIndex] = useState(0);
  const [fade, setFade] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setFade(false); 
      setTimeout(() => {
        setIndex((prevIndex) => (prevIndex + 1) % comments.length);
        setFade(true); 
      }, 500);
    }, 4000); 

    return () => clearInterval(interval);
  }, []);

  return (
    <div className={`mainContentHome`}>
      <div className={`mainTxtHome`}>
        <p className={`fadeSlide ${fade ? 'show' : 'hide'}`}>
          {comments[index]}
        </p>
      </div>
        <button onClick={MakeTask}>Começar</button>
    </div>
  );
}
