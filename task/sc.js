const array1 = [] // массив самих стран
const arrayList = [] // массив обьектов с информациях о странах
// дефолтные свойства, по которым изначально все сортируется
let sortPropertyCases = "TotalCases" 
let sortPropertyDeathes = "Deathes"
let sortPropertyRecovered = "Recovered"

// глобальные данные для мира
const globalCases = document.querySelector('.cases')
const globalDeathes = document.querySelector('.deathes')
const globalRecovered = document.querySelector('.recovered')

// каждый список с общими случаями, смертями и выздоравлениями
const listCases = document.querySelector('.list_of_countries_cases')
const listDeathes = document.querySelector('.list_of_countries_deathes')
const listRecovereds = document.querySelector('.list_of_countries_recovered')

// заголовки, содержащие информацию, которая отражена в списке
const headlineCases = document.querySelector('.headline_cases')
const headlineDeathes = document.querySelector('.headline_deathes')
const headlineRecovereds = document.querySelector('.headline_recovered')

// кнопки перелистывания право
const nextButtonCases = document.querySelector('.right-button-cases')
const nextButtonDeathes = document.querySelector('.right-button-deathes')
const nextButtonRecovered = document.querySelector('.right-button-recovered')

// кнопки перелистывания влево
const prevButtonCases = document.querySelector('.left-button-cases')
const prevButtonDeathes = document.querySelector('.left-button-deathes')
const prevButtonRecovered = document.querySelector('.left-button-recovered')

// свойства, по которым сортируются общие случаи
const propsCases = [
    "TotalCases",
    "TodayCases",
    "TodayCasesPer100th",
    "TotalCasesPer100th"
]

// свойства, по которым сортируются выздоровленные
const propsRecovered = [
    "Recovered",
    "TodayRecovered",
    "TodayRecoveredPer100th",
    "RecoveredPer100th"
]

// свойства, по которым сортируются смерти
const propsDeathes = [
    "Deathes",
    "DeathesPer100th",
    "TodayDeathes",
    "TodayDeathesPer100th"
]

// функция получения информации о стране по API
async function getListCountries(array) {

    for (let i = 0; i < array.length; i++) {

        const countryName = array[i]
        const resu = await fetch(`https://corona.lmao.ninja/v2/countries/${countryName}?yesterday&strict&query%20`);
        const data = await resu.json();
        if (data.message !== 'Country not found or doesn\'t have any cases') {
            arrayList.push({
                Country: data.country,
                TotalCases: data.cases,
                Deathes: data.deaths,
                Recovered: data.recovered,
                Flag: data.countryInfo.flag,
                TodayCases: data.todayCases,
                TodayDeathes: data.todayDeaths,
                TodayRecovered: data.todayRecovered,
                TotalCasesPer100th: Math.floor((data.cases / data.population) * 10 ** 5),
                DeathesPer100th: Math.floor((data.deaths / data.population) * 10 ** 5),
                RecoveredPer100th: Math.floor((data.recovered / data.population) * 10 ** 5),
                TodayCasesPer100th: Math.floor((data.todayCases / data.population) * 10 ** 5),
                TodayDeathesPer100th: Math.floor((data.todayDeaths / data.population) * 10 ** 5),
                TodayRecoveredPer100th: Math.floor((data.todayRecovered / data.population) * 10 ** 5)

            })
        }
    }

    // создаем те самые списки стран 
    createList(arrayList, sortPropertyCases, listCases, headlineCases)
    createList(arrayList, sortPropertyDeathes, listDeathes, headlineDeathes)
    createList(arrayList, sortPropertyRecovered, listRecovereds, headlineRecovereds)

    nextButtonCases.addEventListener('click', () => {
        sortPropertyCases = nextList(sortPropertyCases, propsCases, arrayList, listCases, headlineCases)
    })
    nextButtonDeathes.addEventListener('click', () => {
        sortPropertyDeathes = nextList(sortPropertyDeathes, propsDeathes, arrayList, listDeathes, headlineDeathes)
    })
    nextButtonRecovered.addEventListener('click', () => {
        sortPropertyRecovered = nextList(sortPropertyRecovered, propsRecovered, arrayList, listRecovereds, headlineRecovereds)
    })

    prevButtonCases.addEventListener('click', () => {
        sortPropertyCases = prevList(sortPropertyCases, propsCases, arrayList, listCases, headlineCases)
    })
    prevButtonDeathes.addEventListener('click', () => {
        sortPropertyDeathes = prevList(sortPropertyDeathes, propsDeathes, arrayList, listDeathes, headlineDeathes)
    })
    prevButtonRecovered.addEventListener('click', () => {
        sortPropertyRecovered = prevList(sortPropertyRecovered, propsRecovered, arrayList, listRecovereds, headlineRecovereds)
    })

}
// высчитывание индекса, свойства которое должно вывести следующим
function nextList(prop, arrayProps, array, element, headline) {
    let index = arrayProps.indexOf(prop)
    if (index == arrayProps.length - 1) {
        index = 0
    } else {
        index = index + 1
    }

    createList(array, arrayProps[index], element, headline)

    return arrayProps[index]
}
// высчитывание индекса, свойства которое было до этого 
function prevList(prop, arrayProps, array, element, headline) {
    let index = arrayProps.indexOf(prop)
    if (index === 0) {
        index = arrayProps.length - 1
    } else {
        index -= 1
    }

    createList(array, arrayProps[index], element, headline)

    return arrayProps[index]
}

// получения списка 101 страны из API
async function getAllCountries(array) {
    const resu = await fetch(`https://corona.lmao.ninja/v2/countries/`);
    const data = await resu.json();
    data.sort((prev, next) => next.cases - prev.cases)
    for (let i = 0; i <= 100; i++) {
        array.push(data[i].country)

    }

    getListCountries(array)
}

// получение из API и вывод глобльных данных 
async function getGlobalValues() {
    const resu = await fetch(`https://corona.lmao.ninja/v2/all?yesterday`);
    const data = await resu.json();
    globalCases.innerHTML = data.cases
    globalDeathes.innerHTML = data.deaths
    globalRecovered.innerHTML = data.recovered
}
// получаем список стран
getAllCountries(array1)
// получаем глобальные переменные
getGlobalValues()

// создаем список стран
function createList(array, prop, element, headline) {
    headline.innerHTML = prop
    element.innerHTML = ''
    let sortArray = array.sort((prev, next) => next[prop] - prev[prop])
    const list = document.createElement('ol')
    for (let i = 0; i < sortArray.length; i++) {
        const li = document.createElement('li')
        li.innerHTML = `<span><img src="${sortArray[i].Flag}" alt="" width="70px" height="50px"></span>
                        <span>${sortArray[i].Country}</span>
                        <span>${sortArray[i][prop]}</span>`
        list.append(li)
    }

    element.append(list)

}
