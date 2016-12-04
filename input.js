var input = document.getElementById('main')
var clear = document.getElementById('clear')
var randomize = document.getElementById('randomize')
var randomizeAll = document.getElementById('randomize-all')
var results = document.getElementById('results')

function updateResults(tabbed, useRandom) {
    var typedWords = input.value.split(' '),
        textBefore = typedWords.length == 1 && typedWords[0] == '' ? ''
            : (typedWords.slice(0, typedWords.length - 1).join(' ') + ' ')
        currentWord = typedWords[typedWords.length - 1]
        possibilitiesObj = {},
        possibilities = []
    while (typedWords.length && typedWords[typedWords.length - 2] == '' &&
           typedWords[typedWords.length - 1] == '') {
        typedWords.pop()
        input.value = typedWords.join(' ')
    }
    results.innerHTML = ''
    if (typedWords.length > 1) {
        for (var i = typedWords.length; i > 1; i--) {
            var applicableWords =
                typedWords.slice(typedWords.length - i,
                                 typedWords.length - 1),
                factor = Math.pow(i, 5) // prefer those with more precision.
            applicableWords = applicableWords.join(' ')
            if (applicableWords in data) {
                for (var x in data[applicableWords]) {
                    if (x.indexOf(currentWord) == 0 || !currentWord) {
                        possibilitiesObj[x] =
                            x in possibilitiesObj
                                ? possibilitiesObj[x] + data[applicableWords][x] * factor
                                : data[applicableWords][x] * factor
                    }
                }
            }
        }
    } else {
        for (var x in data['']) {
            if (x.indexOf(currentWord) == 0 || !currentWord) {
                possibilitiesObj[x] =
                    x in possibilitiesObj
                        ? possibilitiesObj[x] + data[''][x]
                        : data[''][x]
            }
        }
    }
    for (var x in possibilitiesObj) {
        possibilities.push([x, possibilitiesObj[x]])
    }
    possibilities.sort(function(a, b) {return b[1] - a[1]})
    var totalWeights = 0
    for (var x in possibilities)
        totalWeights += possibilities[x][1]
    for (var x in possibilities) {
        var item = document.createElement('li')
        item.innerText = textBefore + possibilities[x][0]
        item.setAttribute('data-new-word', possibilities[x][0])
        item.setAttribute('data-confidence', possibilities[x][1])
        if (x == 0)
            item.setAttribute('data-confidence-bucket', 4)
        else if (possibilities[x][1] / totalWeights > 0.1)
            item.setAttribute('data-confidence-bucket', 3)
        else if (possibilities[x][1] / totalWeights > 0.05)
            item.setAttribute('data-confidence-bucket', 2)
        else if (possibilities[x][1] / totalWeights > 0.02)
            item.setAttribute('data-confidence-bucket', 1)
        else
            item.setAttribute('data-confidence-bucket', 0)

        if (x == 0) {
            item.style.color = 'rgba(0, 0, 0, 1)'
        } else {
            item.style.color =
                'rgba(0, 0, 0, ' +
                (possibilities[x][1] / possibilities[0][1] * .5 + .4) + ')'
        }

        item.addEventListener('click', function(e) {
            input.value = textBefore + e.target.getAttribute('data-new-word') + ' '
            updateResults()
        })
        results.appendChild(item)
    }
    if (tabbed === true && possibilities.length > 0) {
        val = typedWords.slice(0, typedWords.length - 1)
        if (useRandom !== true) {
            val.push(possibilities[0][0])
        } else {
            var selected = Math.floor(Math.random() * totalWeights),
                weightCount = 0
            for (var x in possibilities) {
                weightCount += possibilities[x][1]
                if (weightCount >= selected)
                    break
            }
            val.push(possibilities[x][0])
        }
        input.value = val.join(' ') + ' '
        return updateResults()
    }
    if (input.value.indexOf('.') != -1) {
        var item = document.createElement('li')
        item.classList.add('done')
        item.innerText = input.value
        results.appendChild(item)
    }
    return possibilities.length
}

clear.addEventListener('click', function(e) {
    input.value = ''
    updateResults()
})
randomize.addEventListener('click', function(e) {
    if (input.value.indexOf('.') != -1)
        input.value = ''
    if (updateResults(true, true) == 1)
        updateResults(true, true)
    if (navigator.userAgent.indexOf('Mobile') == -1)
        input.focus()
})
randomizeAll.addEventListener('click', function(e) {
    if (input.value.indexOf('.') != -1)
        input.value = ''
    while(updateResults(true, true)) {}
    if (navigator.userAgent.indexOf('Mobile') == -1)
        input.focus()
})
input.addEventListener('input', updateResults)
input.addEventListener('keydown', function(e) {
    console.log(e)
    if (e.keyCode == 9 || e.keyCode == 32) {
        e.preventDefault()
        if (updateResults(true, false) == 1)
            updateResults(true, false)
    }
})
if (navigator.userAgent.indexOf('Mobile') == -1) {
    window.addEventListener('click', function(e) { input.focus() })
    window.addEventListener('mouseup', function(e) { input.focus() })
}

updateResults()

// using timeout because of safari glitch
setTimeout(function() {input.focus()}, 1)
