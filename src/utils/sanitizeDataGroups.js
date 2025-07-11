
export function validarNome(nome){

  const trimmedNome = nome.trim()

  const scriptRegex = /<script[\s>]/i
  if(scriptRegex.test(trimmedNome)){
    return {isValid:false, error:'O grupo contém caracteres inválidos!'}
  }

  const sqlRegex = /('|--|\b(SELECT|UPDATE|DELETE|INSERT|DROP|UNION|OR|AND)\b)/gi
  if(sqlRegex.test(trimmedNome)){
    return {isValid:false, error:'O grupo contém caracteres inválidos!'}
  }

  if(trimmedNome.length === 0){
    return {isValid:false, error:'O nome do grupo é obrigatório!'}
  }

  if(trimmedNome.length > 50) {
    return {isValid:false, error:'O grupo deve ter no máximo 50 caracteres!'}
  }

  return{isValid:true, error: '', valor: trimmedNome}

}