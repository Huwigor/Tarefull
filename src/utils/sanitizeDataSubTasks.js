
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

  if(trimmedNome.length > 500) {
    return {isValid:false, error:'A Sub Task deve ter no máximo 500 caracteres!'}
  }

  return{isValid:true, error: '', valor: trimmedNome}

}