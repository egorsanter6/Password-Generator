let elementsList = ['length', 'numberOfPasswords', 'overriddenSymbols',
                    'addSymbols', 'exceptSymbols', 'requiredSymbols',
                    'upperCase', 'lowerCase', 'digits',
                    'symbols', 'space', 'generatorBtn',
                    'passwordContainer', 'requiredWord', 'hidePasswords',
                    'randomLength', 'lengthRange', 'myBtn',
                  ]

let elements = {}

for (let i = 0; i < elementsList.length; i++) {
  currentElements = elementsList[i]
  elements[currentElements] = document.getElementById(currentElements)
}

let passwordSymbols = ''
let generatedPasswords = []
let passwordsHidden = false
let generatedLength = ''

const upperCaseLetters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
const lowerCaseLetters = 'abcdefghijklmnopqrstuvwxyz'
const digits = '0123456789'
const symbols = '!"#$%&()*+,-./:;<=>?@[\]^_`{|}~' + "'"
const space = ' '

function updatePasswordSymbols() {
  passwordSymbols = ''

  if (elements['upperCase'].checked) passwordSymbols += upperCaseLetters
  if (elements['lowerCase'].checked) passwordSymbols += lowerCaseLetters
  if (elements['digits'].checked) passwordSymbols += digits
  if (elements['symbols'].checked) passwordSymbols += symbols
  if (elements['space'].checked) passwordSymbols += space
  if (elements['addSymbols'].value) passwordSymbols += elements['addSymbols'].value

  if (elements['exceptSymbols'].value) {
    const sanitizedInput = elements['exceptSymbols'].value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const exclude = new RegExp(`[${sanitizedInput}]`, 'g');
    passwordSymbols = passwordSymbols.replace(exclude, '');
  }

  if (elements['overriddenSymbols'].value) {
    passwordSymbols = elements['overriddenSymbols'].value
  }

  checkFormValidity()
}

function checkFormValidity() {
  let isValid = passwordSymbols !== ''; // Проверяем, есть ли допустимые символы
  elements['generatorBtn'].disabled = !isValid;

  const existingParagraph = document.getElementById('1');
  if (!isValid) {
    // Вывод ошибки, если символы пустые
    elements['requiredSymbols'].disabled = true;
    elements['requiredWord'].disabled = true;
    elements['exceptSymbols'].disabled = true;

    if (!existingParagraph) {
      getError('1', "*Add something to your future password or override your own symbols");
    }
  } else {
    // Убираем ошибку и активируем/деактивируем поля в зависимости от их значений
    if (existingParagraph) {
      existingParagraph.remove();
    }

    elements['requiredSymbols'].disabled = !!elements['exceptSymbols'].value;
    elements['exceptSymbols'].disabled = !!elements['requiredSymbols'].value;
    elements['requiredWord'].disabled = false;
  }
}

function getError(argId, errorText) {
  const existingElement = document.getElementById(argId)
  if (!existingElement) {
    const paragraph = document.createElement('p')
    paragraph.id = argId
    const error = document.createElement('span')
    error.textContent = errorText
    paragraph.appendChild(error)
    elements['myBtn'].append(paragraph)
  }
}

const fieldsToListen = ['upperCase', 'lowerCase', 'digits',
                        'symbols', 'space', 'addSymbols',
                        'exceptSymbols','requiredSymbols', 'requiredWord',
                        'overriddenSymbols',
                      ]

fieldsToListen.forEach(fieldId => {
  elements[fieldId].addEventListener('change', updatePasswordSymbols)
})

elements['overriddenSymbols'].addEventListener('input', function() {
  if (elements['overriddenSymbols'].value) toggleFieldsDisabled(true)
  else toggleFieldsDisabled(false)
})

elements['exceptSymbols'].addEventListener('input', function() {
  checkFormValidity()
})

elements['length'].addEventListener('input', function () {
  lengthChecker('length', 5, 100)
})
elements['numberOfPasswords'].addEventListener('input', function () {
  lengthChecker('length', 1, 20)
})

function lengthChecker(fieldName, firstArg, lastArg) {
  if (elements[fieldName].value < firstArg) elements[fieldName].value = firstArg
  if (elements[fieldName].value > lastArg) elements[fieldName].value = lastArg
}

elements['requiredSymbols'].addEventListener('input', function() {
  checkFormValidity()
  const requiredSymbolsArray = elements['requiredSymbols'].value ? elements['requiredSymbols'].value.split('') : []
  hasInvalidSymbols = requiredSymbolsArray.every(char => passwordSymbols.includes(char))
  let isLengthExceeded
  if (elements['randomLength'].checked) {
    isLengthExceeded = parseInt(elements['lengthRange'].getElementsByTagName('input')[1].value)
  } else {
    isLengthExceeded = parseInt(elements['requiredSymbols'].value.length) > pwdLength()
  }

  let isValid = true

  const existingParagraph = document.getElementById('2')
  if (isLengthExceeded) {
    getError('2', "*You can't have required symbols longer than password's length")
    isValid = false 
  } else {
    if (existingParagraph) existingParagraph.remove()
    }

  const existingParagraph2 = document.getElementById('4')
  if (!hasInvalidSymbols) {
    getError('4', "*Some required symbols are not in the allowed symbols set")
    isValid = false 
  } else {
    if (existingParagraph2) existingParagraph2.remove()
    }
  
  elements['generatorBtn'].disabled = !isValid
  elements['exceptSymbols'].disabled = elements['requiredSymbols'].value ? true : false
})

elements['requiredWord'].addEventListener('input', function () {
  let isValid = false
  if (elements['requiredWord'].value) {
    elements['exceptSymbols'].disabled = true
    
    let requiredWordLen = elements['requiredWord'].value.length
    
    for (let i = 0; i < requiredWordLen; i++) {
      if (!passwordSymbols.includes(elements['requiredWord'].value[i])) {
        isValid = true
        break;
      }
    }

    const existingParagraph = document.getElementById('3')
    if (parseInt(requiredWordLen) > pwdLength()) {
      if (!existingParagraph) {
        getError('3', "*You can't have required word longer than password's length")
      }
      isValid = true
    } else {
      isValid = false
      if (existingParagraph) existingParagraph.remove()
    }
    
    elements['generatorBtn'].disabled = isValid
  } else {
    elements['generatorBtn'].disabled = isValid
    elements['exceptSymbols'].disabled = false
  }
})

elements['randomLength'].addEventListener('change', function() {
  if (elements['randomLength'].checked) {
    elements['length'].disabled = true

    const firstValue = createValue('firstValue')
    const secondValue = createValue('secondValue')

    elements['lengthRange'].appendChild(firstValue)
    elements['lengthRange'].appendChild(secondValue)

    firstValue.addEventListener('input', function () {
      let first = Number(firstValue.value)
      let second = Number(secondValue.value)

      if (first > second) first = second
      if (first < 5) first = 5
      if (first > 100) first = 100

      firstValue.value = first
    });

    secondValue.addEventListener('input', function () {
      let first = Number(firstValue.value)
      let second = Number(secondValue.value)

      if (second < first) second = first
      if (second < 5) second = 5
      if (second > 100) second = 100

      secondValue.value = second
    })
  } else {
    elements['length'].disabled = false

    const inputElements = elements['lengthRange'].getElementsByTagName('input')
    
    inputElements[1].remove()
    inputElements[1].remove()
  }
})

elements['hidePasswords'].addEventListener('change', togglePasswordsVisibility)

function toggleFieldsDisabled(arg) {
  fieldsList = ['upperCase', 'lowerCase', 'digits',
                'symbols', 'space', 'exceptSymbols',
                'requiredSymbols', 'addSymbols', 'requiredWord'
  ]
  fieldsList.forEach(fieldId => {
    const element = document.getElementById(fieldId)
    element.disabled = arg
  });
}

function createValue(id) {
  value = document.createElement('input')

  value.type = 'number'
  value.min = '5'
  value.max = '100'
  if (id=='firstValue') value.value = '15'
  else if (id=='secondValue') value.value = '30'
  value.id = id
  return value
}

let listElement
elements['generatorBtn'].onclick = function () {
  updatePasswordSymbols()
  elements['passwordContainer'].innerHTML = ''
  generatedPasswords = []
  listElement = document.createElement(elements['numberOfPasswords'].value == 1 ? 'ul' : 'ol')
  
  passwordGenerator(elements['numberOfPasswords'])
  elements['passwordContainer'].appendChild(listElement)
}

function pwdLength() {
  generatedLength = ''
  if (elements['randomLength'].checked) {
    const min = parseInt(elements['lengthRange'].getElementsByTagName('input')[1].value)
    const max = parseInt(elements['lengthRange'].getElementsByTagName('input')[2].value)
    generatedLength = Math.floor(Math.random() * (max - min) + min)
  } else if (elements['length'].value) {
    generatedLength = parseInt(elements['length'].value)
  }
  return generatedLength
}

function passwordGenerator(pwdNum) {
  const requiredSymbolsArray = elements['requiredSymbols'].value ? elements['requiredSymbols'].value.split('') : []

  for (let x = 0; x < pwdNum.value; x++) {
    let generatedPassword
    let myLength = pwdLength()
    let xz = ''
    if (elements['requiredWord'].value) {
      myLength -= parseInt(elements['requiredWord'].value.length)
    }
    do {
      generatedPassword = ''

      for (let i = 0; i < myLength; i++) {
        const randomIndex = Math.floor(Math.random() * passwordSymbols.length)
        generatedPassword += passwordSymbols[randomIndex];
      }
      if (elements['requiredWord'].value) {
        xz = Math.floor(Math.random() * generatedPassword.length)
        generatedPassword = generatedPassword.slice(0, xz) + elements['requiredWord'].value + generatedPassword.slice(xz)
      }

    } while (!requiredSymbolsArray.every(char => generatedPassword.includes(char)))

    generatedPasswords.push(generatedPassword);

    // Создаем элементы
    const passwordItem = document.createElement('li')
    const paragraph = document.createElement('p')
    const toggleCheckbox = document.createElement('input')
    toggleCheckbox.type = 'checkbox'
    toggleCheckbox.checked = elements['hidePasswords'].checked

    const passwordText = document.createElement('span')
    passwordText.textContent = elements['hidePasswords'].checked ? '******' : generatedPassword

    // Обработчик для чекбокса
    toggleCheckbox.addEventListener('change', function () {
      passwordText.textContent = toggleCheckbox.checked ? '******' : generatedPassword
    })

    // Добавляем чекбокс и текст внутрь <p>, а <p> внутрь <li>
    paragraph.appendChild(toggleCheckbox)
    paragraph.appendChild(passwordText)
    passwordItem.appendChild(paragraph)
    listElement.appendChild(passwordItem)
  }
}

function togglePasswordsVisibility() {
  const listItems = elements['passwordContainer'].getElementsByTagName('li');
  passwordsHidden = !passwordsHidden;

  for (let i = 0; i < listItems.length; i++) {
    const passwordText = listItems[i].getElementsByTagName('span')[0];
    const checkbox = listItems[i].getElementsByTagName('input')[0];

    // Обновляем текст пароля и синхронизируем с главным переключателем
    checkbox.checked = passwordsHidden;
    passwordText.textContent = passwordsHidden ? '******' : generatedPasswords[i];
  }
}
