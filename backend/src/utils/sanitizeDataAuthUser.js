
export function validarNome(nome){

  const trimmedNome = nome.trim()

  const scriptRegex = /<script[\s>]/i
  if(scriptRegex.test(trimmedNome)){
    return {isValid:false, error:'O nome contém caracteres inválidos!'}
  }

  const sqlRegex = /('|--|\b(SELECT|UPDATE|DELETE|INSERT|DROP|UNION|OR|AND)\b)/gi
  if(sqlRegex.test(trimmedNome)){
    return {isValid:false, error:'O nome contém caracteres inválidos!'}
  }

  if(trimmedNome.length === 0){
    return {isValid:false, error:'O nome é obrigatório!'}
  }

  if(trimmedNome.length < 8) {
    return {isValid:false, error:'O nome deve ter ao menos 8 caracteres!'}
  }

  if(trimmedNome.length > 20) {
    return {isValid:false, error:'O nome deve ter no máximo 20 caracteres!'}
  }

  return{isValid:true, error: '', valor: trimmedNome}

}


export function validarEmail(email){

  const trimmedEmail = email.trim()

  const scriptRegex = /<script[\s>]/i
  if(scriptRegex.test(trimmedEmail)){
    return {isValid:false, error:'O email contém caracteres inválidos!'}
  }

  if(trimmedEmail.length === 0){
    return {isValid:false, error: 'O email é obrigatório!'}
  }

  if(trimmedEmail.length > 100){
    return {isValid: false, error: 'O email só pode ter até 100 caracteres!'}
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

  if(!emailRegex.test(trimmedEmail)){
    return {isValid: false, error: 'Formato de email inválido!'}
  }

  const gmailRegex = /^[^\s@]+@gmail\.com$/i

  if (!gmailRegex.test(trimmedEmail)) {
    return { isValid: false, error: "O e-mail deve ser um endereço Gmail válido!" }
  }

  return{ isValid:true, error: '', valor: trimmedEmail}
  
}


export function validarSenha(senha){

  const trimmedSenha = senha.trim()

  const scriptRegex = /<script[\s>]/i
  if(scriptRegex.test(trimmedSenha)){
    return {isValid:false, error:'A senha contém caracteres inválidos!'}
  }

  const sqlRegex = /('|--|\b(SELECT|UPDATE|DELETE|INSERT|DROP|UNION|OR|AND)\b)/gi
  if(sqlRegex.test(trimmedSenha)){
    return {isValid:false, error:'A senha contém caracteres inválidos!'}
  }

  if(trimmedSenha.length === 0){
    return {isValid:false, error: 'A senha é obrigatória!'}
  }

  const hasUpperCase = /[A-Z]/.test(trimmedSenha);
  const hasSymbol = /[^A-Za-z0-9]/.test(trimmedSenha);
  const hasLength = trimmedSenha.length >= 8 && trimmedSenha.length <= 20;

  if (!hasLength) {
    return { isValid: false, error: 'A senha deve ter entre 8 a 20 caracteres!' };
  }
  if (!hasUpperCase) {
    return { isValid: false, error: 'A senha deve ter pelo menos uma letra maiúscula!' };
  }
  if (!hasSymbol) {
    return { isValid: false, error: 'A senha deve ter ao menos um símbolo!' };
  }

  return { isValid:true, error: '', valor: trimmedSenha }

}


