const mainForm = document.querySelector('#main')
const formSimulator = document.querySelector('#formSimulator')
const errosMsgs = document.querySelectorAll('.erroMensager')
const inputName = document.querySelector('#name')
const inputMensalidade = document.querySelector('#monthFees')
const txJuros = document.querySelector('#interestRates')
const tmp = document.querySelector('#time')
const buttonForm = document.querySelector('#buttonForm')
const buttonRefresh = document.querySelector('#buttonRefresh')

function createTime() {
    for(let i = 0; i < 24; i++) {
        tmp.innerHTML += `<option value="${i+1}"> ${i+1} mês(es)</option>`
    }
}

function resultado(res) {
    let resultado = parseFloat(res.result).toFixed(2)
    return `
    <div class="resultado">
        <article>
            <h2>Olá <span>${inputName.value}</span>!</h2>
            <p>
                Juntando <span>R$ ${inputMensalidade.value}</span> todo mês, 
                você terá <span>R$ ${resultado}</span> em <span>${tmp.value} meses</span>
                sob uma taxa de juros de <span>${txJuros.value}%</span> ao mês.
            </p>
        </article>
        <button onClick="window.location.reload()" id="buttonRefresh">Simular Novamente</button>
    </div>
    `
}

function changeContent(result) {
    formSimulator.remove()
    mainForm.innerHTML += resultado(result)
}

function bindEvents() {
    buttonForm.onclick = onclick_Simulated
}

function jsonConvert(response) {
    return response.json()
}

function onclick_Simulated(e) {
    e.preventDefault()
    let missingInput = false
    let interest_Rates = parseFloat(txJuros.value.replace(',','.'))/100
    

    if(!inputName.value) {
        errosMsgs[0].classList.remove('hidden')
        inputName.parentElement.classList.add('border')
        missingInput = true
    } else {
        errosMsgs[0].classList.add('hidden')
        inputName.parentElement.classList.remove('border')
    }

    if(!inputMensalidade.value){
        errosMsgs[1].classList.remove('hidden')
        inputMensalidade.parentElement.classList.add('border')
        missingInput = true
    } else {
        errosMsgs[1].classList.add('hidden')
        inputMensalidade.parentElement.classList.remove('border')
    }

    if(!interest_Rates) {
        errosMsgs[2].classList.remove('hidden')
        txJuros.parentElement.classList.add('border')
        missingInput = true
    } else {
        errosMsgs[2].classList.add('hidden')
        txJuros.parentElement.classList.remove('border')
    }

    if(tmp.value == "") {
        errosMsgs[3].classList.remove('hidden')
        tmp.parentElement.classList.add('border')
        missingInput = true
    } else {
        errosMsgs[3].classList.add('hidden')
        tmp.parentElement.classList.remove('border')
    }

    if(!missingInput) {
        return fetch('http://api.mathjs.org/v4/', {
            method:"POST",
            body: JSON.stringify({
                "expr": `${inputMensalidade.value} * (((1 + ${interest_Rates}) ^ ${tmp.value} - 1) / ${interest_Rates}) `
            })
        })
        .then(jsonConvert)
        .then(changeContent)
    }
}

bindEvents()
createTime()