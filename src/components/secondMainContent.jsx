import imgOne from '../assets/imgMainOne.png'

export default function SecondMain(){
    return(
        <>
        <div className='secondMainContent'>
          <div data-aos='slide-right' className='mainTxtSecond'>
            <p>Grandes projetos nascem de pequenas ações. Organize-se em grupos, transforme metas em tarefas e tarefas em passos alcançáveis. Sozinho você vai rápido, mas juntos vamos mais longe!</p>
          </div>
          <div data-aos='slide-left' className='mainImgSecond'>
            <img src={imgOne} alt="" />
           </div>
        </div>
        </>
    )
}