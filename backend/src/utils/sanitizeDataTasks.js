
export function validarNome(nome){

  const trimmedNome = nome.trim()

  const scriptRegex = /<script[\s>]/i
  if(scriptRegex.test(trimmedNome)){
    return {isValid:false, error:'A Task contém caracteres inválidos!'}
  }

  const sqlRegex = /('|--|\b(SELECT|UPDATE|DELETE|INSERT|DROP|UNION|OR|AND)\b)/gi
  if(sqlRegex.test(trimmedNome)){
    return {isValid:false, error:'A Task contém caracteres inválidos!'}
  }

  if(trimmedNome.length === 0){
    return {isValid:false, error:'O nome da task é obrigatório!'}
  }

  if(trimmedNome.length > 100) {
    return {isValid:false, error:'A Task deve ter no máximo 100 caracteres!'}
  }

  return{isValid:true, error: '', valor: trimmedNome}

}