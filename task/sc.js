const array1 = [] // массив самих стран
const arrayList = [] // массив обьектов с информациях о странах
let sortProperty = "TotalCases"

const props = [
    "TotalCases",
    "Deathes",
    "Recovered",
    "TodayCases",
    "TodayDeathes",
    "TodayRecovered",
    "TotalCasesPer100th",
    "RecoveredPer100th",
    "DeathesPer100th",
    "TodayCasesPer100th",
    "TodayDeathesPer100th",
    "TodayRecoveredPer100th"

]
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

    createList(arrayList, sortProperty)
    document.querySelector('.right-button').addEventListener('click', () => {
        console.log('right')
        let index_right = props.indexOf(sortProperty)
        console.log('dddd', index_right)

        if (index_right == props.length - 1) {
            index_right = 0
        } else {
            index_right = index_right + 1
        }
        console.log(index_right)
        sortProperty = props[index_right]
        console.log(sortProperty)
        createList(arrayList, sortProperty)
    })
    document.querySelector('.left-button').addEventListener('click', () => {
        console.log('left')
        let index = props.indexOf(sortProperty)
        if (index === 0) {
            index = props.length - 1
        } else {
            index -= 1
        }

        sortProperty = props[index]
        createList(arrayList, sortProperty)
    })



}

async function getAllCountries(array) {
    const resu = await fetch(`https://corona.lmao.ninja/v2/countries/`);
    const data = await resu.json();
    console.log(data)
    data.sort((prev, next) => next.cases - prev.cases)
    for (let i = 0; i <= 100; i++) {
        array.push(data[i].country)

    }

    getListCountries(array)
}

getAllCountries(array1)

function createList(array, prop) {
    document.querySelector('.headline').innerHTML = prop
    const listCountries = document.querySelector('.list_of_countries')
    listCountries.innerHTML = ''
    let sortArray = array.sort((prev, next) => next[prop] - prev[prop])


    const list = document.createElement('ol')
    for (let i = 0; i < sortArray.length; i++) {
        const li = document.createElement('li')
        li.innerHTML = `<span><img src="${sortArray[i].Flag}" alt="" width="70px" height="50px"></span>
                        <span>${sortArray[i].Country}</span>
                        <span>${sortArray[i][prop]}</span>`
        list.append(li)
    }

    listCountries.append(list)

}