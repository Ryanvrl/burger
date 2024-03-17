async function getCep(adress: string) {
    const response = await fetch(`https://viacep.com.br/ws/${adress}/json`).then(res => {
        if (!res.ok) {
            throw Error('Ocorreu um erro, busque por um cep válido')
        }
        return res.json()
    })
    return response
}





export { getCep }