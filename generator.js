const length = document.getElementById('length')
const numberOfPasswords = document.getElementById('numberOfPasswords')
const overriddenSymbols = document.getElementById('overriddenSymbols')
const addSymbols = document.getElementById('addSymbols')
const exceptSymbols = document.getElementById('exceptSymbols')
const requiredSymbols = document.getElementById('requiredSymbols')
const upperCase = document.getElementById('upperCase')
const lowerCase = document.getElementById('lowerCase')
const digits = document.getElementById('digits')
const symbols = document.getElementById('symbols')
const space = document.getElementById('space')
const generatorBtn = document.getElementById('generatorBtn')
const passwordContainer = document.getElementById('passwordContainer')
const requiredWord = document.getElementById('requiredWord')
const hidePasswords = document.getElementById('hidePasswords')
const randomLength = document.getElementById('randomLength')
const lengthRange = document.getElementById('lengthRange')

let passwordSymbols = ''
let generatedPasswords = []
let passwordsHidden = false
let generatedLength = ''

const myUpper = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
const myLower = 'abcdefghijklmnopqrstuvwxyz'
const myDigits = '0123456789'
const mySymbols = '!"#$%&()*+,-./:;<=>?@[\]^_`{|}~' + "'"
const mySpace = ' '

function updatePasswordSymbols() {
  passwordSymbols = ''

  if (upperCase.checked) passwordSymbols += myUpper
  if (lowerCase.checked) passwordSymbols += myLower
  if (digits.checked) passwordSymbols += myDigits
  if (symbols.checked) passwordSymbols += mySymbols
  if (space.checked) passwordSymbols += mySpace

  if (addSymbols.value) {
    passwordSymbols += addSymbols.value
  }

  if (exceptSymbols.value) {
    const sanitizedInput = exceptSymbols.value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const exclude = new RegExp(`[${sanitizedInput}]`, 'g');
    passwordSymbols = passwordSymbols.replace(exclude, '');
  }

  if (overriddenSymbols.value) {
    passwordSymbols = overriddenSymbols.value
  }
}

upperCase.addEventListener('change', updatePasswordSymbols)
lowerCase.addEventListener('change', updatePasswordSymbols)
digits.addEventListener('change', updatePasswordSymbols)
symbols.addEventListener('change', updatePasswordSymbols)
space.addEventListener('change', updatePasswordSymbols)
addSymbols.addEventListener('change', updatePasswordSymbols)
exceptSymbols.addEventListener('change', updatePasswordSymbols)
requiredSymbols.addEventListener('change', updatePasswordSymbols)
requiredWord.addEventListener('input', function () {
  updatePasswordSymbols()
  
  let isValid = false
  if (requiredWord.value) {
    exceptSymbols.disabled = true
    
    for (let i = 0; i < requiredWord.value.length; i++) {
      if (!passwordSymbols.includes(requiredWord.value[i])) {
        isValid = true
        break;
      }
    }
    if (parseInt(requiredWord.value.length) > pwdLength()) {
      isValid = true
    } else {
      isValid = false
    }
    
    generatorBtn.disabled = isValid
  } else {
    generatorBtn.disabled = isValid
    exceptSymbols.disabled = false
  }
})

overriddenSymbols.addEventListener('input', function() {
  if (overriddenSymbols.value) {
    upperCase.disabled = true
    lowerCase.disabled = true
    digits.disabled = true
    symbols.disabled = true
    space.disabled = true
    exceptSymbols.disabled = true
    requiredSymbols.disabled = true
    addSymbols.disabled = true
    requiredWord.disabled = true

    updatePasswordSymbols()

  } else {
    upperCase.disabled = false
    lowerCase.disabled = false
    digits.disabled = false
    symbols.disabled = false
    space.disabled = false
    exceptSymbols.disabled = false
    requiredSymbols.disabled = false
    addSymbols.disabled = false
    requiredWord.disabled = false

    updatePasswordSymbols()
  } 
})

exceptSymbols.addEventListener('input', function() {
  if (exceptSymbols.value) {
    requiredSymbols.disabled = true
  } else {
    requiredSymbols.disabled = false
  }
})
requiredSymbols.addEventListener('input', function() {
  updatePasswordSymbols()
  const requiredSymbolsArray = requiredSymbols.value ? requiredSymbols.value.split('') : []
  generatorBtn.disabled = !requiredSymbolsArray.every(char => passwordSymbols.includes(char))
  if (requiredSymbols.value) {
    exceptSymbols.disabled = true
    if (parseInt(requiredSymbols.value.length) > pwdLength()) {
      generatorBtn.disabled = true
    }
  } else {
    exceptSymbols.disabled = false
  }
})

hidePasswords.addEventListener('change', togglePasswordsVisibility)

randomLength.addEventListener('change', function() {
  if (randomLength.checked) {
    length.disabled = true

    const firstValue = document.createElement('input')

    firstValue.type = 'number'
    firstValue.min = '5'
    firstValue.max = '100'
    firstValue.value= '15'

    const secondValue = document.createElement('input')

    secondValue.type = 'number'
    secondValue.min = '5'
    secondValue.max = '100'
    secondValue.value= '30'

    
    
    lengthRange.appendChild(firstValue)
    lengthRange.appendChild(secondValue)
    firstValue.addEventListener('input', function () {
      if (firstValue.value < 5) firstValue.value = 5
      if (firstValue.value > 100) firstValue.value = 100
      if (firstValue.value > secondValue.value) firstValue = 5
    })
    secondValue.addEventListener('input', function () {
      if (secondValue.value < 5) secondValue.value = 5
      if (secondValue.value > 100) secondValue.value = 100
      // if (secondValue.value > secondValue.value) firstValue = 5
    })
  } else {
    length.disabled = false
    if (lengthRange.getElementsByTagName('input')) {
      inputElements = lengthRange.getElementsByTagName('input')
      inputElements[1].remove()
      inputElements[1].remove()
    }
  }
})

length.addEventListener('input', function () {
  if (length.value < 5) length.value = 5
  if (length.value > 100) length.value = 100
})
numberOfPasswords.addEventListener('input', function () {
  if (numberOfPasswords.value < 1) numberOfPasswords.value = 1
  if (numberOfPasswords.value > 20) numberOfPasswords.value = 20
})

let listElement
generatorBtn.onclick = function () {
  updatePasswordSymbols()
  passwordContainer.innerHTML = ''
  generatedPasswords = []
  listElement = document.createElement(numberOfPasswords.value == 1 ? 'ul' : 'ol')
  
  passwordGenerator(numberOfPasswords)
  passwordContainer.appendChild(listElement)
}

function pwdLength() {
  generatedLength = ''
  if (randomLength.checked) {
    const min = parseInt(lengthRange.getElementsByTagName('input')[1].value)
    const max = parseInt(lengthRange.getElementsByTagName('input')[2].value)
    generatedLength = Math.floor(Math.random() * (max - min) + min)
  } else if (length.value) {
    generatedLength = parseInt(length.value)
  }
  return generatedLength
}

function passwordGenerator(pwdNum) {
  const requiredSymbolsArray = requiredSymbols.value ? requiredSymbols.value.split('') : []

  for (let x = 0; x < pwdNum.value; x++) {
    let generatedPassword
    let myLength = pwdLength()
    let xz = ''
    if (requiredWord.value) {
      myLength -= parseInt(requiredWord.value.length)
    }
    do {
      generatedPassword = ''
      
      for (let i = 0; i < myLength; i++) {
        const randomIndex = Math.floor(Math.random() * passwordSymbols.length)
        generatedPassword += passwordSymbols[randomIndex];
      }
      if (requiredWord.value) {
        xz = Math.floor(Math.random() * generatedPassword.length)
        generatedPassword = generatedPassword.slice(0, xz) + requiredWord.value + generatedPassword.slice(xz)
      }
      
    } while (!requiredSymbolsArray.every(char => generatedPassword.includes(char)))
    
    generatedPasswords.push(generatedPassword)
    const newParagraph = document.createElement('p')
    const passwordItem = document.createElement('li')
    if (hidePasswords.checked) passwordItem.textContent = '******'
    else passwordItem.textContent = generatedPasswords[x]

    newParagraph.appendChild(passwordItem)
    listElement.appendChild(newParagraph)
  }
}

function togglePasswordsVisibility() {
  const listItems = passwordContainer.getElementsByTagName('li')
  passwordsHidden = !passwordsHidden

  for (let i = 0; i < listItems.length; i++) {
    listItems[i].textContent = passwordsHidden ? '******' : generatedPasswords[i]
  }
}