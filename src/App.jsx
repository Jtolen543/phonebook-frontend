import { useState, useEffect } from 'react'
import services from './persons.jsx'
import './index.css'

const Filter = ({persons, setFiltered}) => {
  const [search, setSearch] = useState('')

  function handleSearchChange (event) {
    const newSearch = event.target.value
    setSearch(newSearch)
    if (newSearch !== '') {
      const newPersons = [...persons].filter((person) => person.name.includes(newSearch))
      setFiltered(newPersons)
    }
    else {
      setFiltered([...persons])
    } 

  }
  return (
    <div>filter shown with name: <input value={search} onChange={handleSearchChange}/></div>
  )
}

const PersonForm = ({persons, setFiltered , setPersons, setMessage, setStyle}) => {
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')

  function handleNameChange (event) {
    setNewName(event.target.value)
  }

  function handleNumberChange (event) {
    setNewNumber(event.target.value)
  }

  function handlePopup (message, className) {
    setMessage(message)
    setStyle(className)
    setTimeout(() => {
      setMessage('')
      setStyle('')
    }, 3000)
  }

  function handleFormSubmit (event) {
    event.preventDefault()
    let newPersons = [...persons]
    let result = newPersons.filter((person) => person.name === newName)
    if (result.length !== 0) {
      let bool = window.confirm(`${newName} is already added to the phonebook, replace the old number with a new one?`)
      if (bool) {
        services.update(result[0].id, {...result[0], number:newNumber}).then((updatedPerson) => {
          setPersons([...persons].map((person) => person.id !== updatedPerson.id ? person : updatedPerson))
          setFiltered([...persons].map((person) => person.id !== updatedPerson.id ? person : updatedPerson))
          handlePopup(`Updated ${newName} number to ${newNumber}`, 'message-body success-body')
        })
        .catch((error) => {
          setPersons([...persons].map((person) => person.id !== updatedPerson.id ? person : updatedPerson))
          setFiltered([...persons].map((person) => person.id !== updatedPerson.id ? person : updatedPerson))
          handlePopup(`Information of ${newName} has already been removed from the server`, 'message-body error-body')
        })
      }
      setNewName('')
      setNewNumber('')
      return
    }
    result = newPersons.filter((person) => person.number === newNumber && newNumber !== '')
    if (result.length !== 0) alert(`${newNumber} is already added to the phonebook`)
    else {
      services.create({name: newName, number: newNumber}).then((newPersons) => {
        setPersons([...persons, newPersons])
        setFiltered([...persons, newPersons])
      })
      handlePopup(`Added ${newName}`, 'message-body success-body')
      setNewName('')
      setNewNumber('')

    }
  }

  return (
    <form onSubmit={handleFormSubmit}>
      <div>
        <h1>Add a New</h1>
        <div>name: <input value={newName} onChange={handleNameChange}/></div>
        <div>number: <input value={newNumber} onChange={handleNumberChange}/></div>
      </div>
      <div>
        <button type="submit">add</button>
      </div>
    </form>
  )
}

const Person = ({persons, filtered, setFiltered, setPersons}) => {

  const handleDelete = (id) => {
    const confirmDelete = window.confirm('Are you sure you want to delete?')
    if (confirmDelete) {
      services.remove(id).then(() => {
        setFiltered([...filtered].filter((person) => person.id !== id))
        setPersons([...persons].filter((person) => person.id !== id))
      })
    }
  }

  return (
    <>
      <div>{filtered.map((person) => {
        return (<div key={person.id}>{person.name}: {person.number}  <button onClick={()=> handleDelete(person.id)}>delete</button></div>)
      })}
      </div>
    </>
  )
}

const App = () => {
  const [persons, setPersons] = useState([])
  const [filtered, setFiltered] = useState([])
  const [message, setMessage] = useState('')
  const [style, setStyle] = useState('')

  useEffect(() => {
    services.getAll().then((initialPersons) => {
      setPersons(initialPersons)
      setFiltered(initialPersons)
    })
  }, [])
  

  return (
    <div>
      <h2>Phonebook</h2>
      <Filter persons={persons} filtered={filtered} setFiltered={setFiltered}></Filter>
      <h2 className={`${style}`}>{message}</h2>
      <PersonForm persons={persons} setPersons={setPersons} setMessage={setMessage} setStyle={setStyle} setFiltered={setFiltered}></PersonForm>
      <h2>Numbers</h2>
      <Person persons={persons} filtered={filtered} setFiltered={setFiltered} setPersons={setPersons}></Person>
    </div>
  )
}

// const retrieveCountries = () => {
//   let url = "https://studies.cs.helsinki.fi/restcountries/api/all"
//   return axios.get(url).then(response => response.data)
// }

// const retrieveWeather = (capital) => {
//   let url = `https://api.openweathermap.org/data/2.5/weather?q=${capital}&appid=1f317d02e3506692781594074d79a64f`
//   return axios.get(url).then(response => response.data)
// }

// const Filter = ({countries, setFiltered}) => {
//   const [search, setSearch] = useState('')

//   function handleSearchChange (event) {
//     const newSearch = event.target.value
//     setSearch(newSearch)
//     if (newSearch !== '') {
//       const newCountries = [...countries].filter((country) => country.name.common.includes(newSearch))
//       setFiltered(newCountries)
//     }
//     else {
//       setFiltered([...countries])
//     } 

//   }
//   return (
//     <div>find countries <input value={search} onChange={handleSearchChange}></input></div>
//   )
// }

// const DisplayCountryInfo = ({country}) => {
//   return (
//     <>
//       <div key={country.name.common}>
//         <h1>{country.name.common}</h1>
//         <div>Capital: {country.capital[0]}</div>
//         <div>Population: {country.population}</div>
//         <h2>languages</h2>
//         <ul>{Object.values(country.languages).map((language) => {
//           return <li key={language}>{language}</li>
//         })}</ul>
//         <img src={country.flags.png} alt="flag" width="200" height="200"></img>
//       </div>
//     </>
//   )
// }

// const DisplayWeatherInfo = ({capital}) => {
//   const [weather, setWeather] = useState({})
//   // useEffect(() => {
//   //   retrieveWeather(capital).then((initialWeather) => {
//   //     setWeather(initialWeather)
//   //   })
//   // }, [])

//   retrieveWeather(capital).then((initialWeather) => {
//     setWeather(initialWeather)
//   })

//   return (
//     <>
//       <h2>Weather in {capital}</h2>
//       <div><b>temperature:</b> {weather.main ? ((weather.main.temp - 270).toFixed(1)) + " Celcius" : ''}</div>
//       <div><b>wind:</b> {weather.wind ? weather.wind.speed + " m/s" : ''}</div>
//     </>
//   )
// }

// const CountryInfo = ({country}) => {
//   const [show, setShow] = useState(false)
//   const handleShow = () => {
//     setShow(!show)
//   }

//   const getInfo = () => {
//     return (
//     <>
//       <DisplayCountryInfo country={country}></DisplayCountryInfo>
//       <DisplayWeatherInfo capital={country.capital[0]}></DisplayWeatherInfo>
//     </>
//   )
//   }


//   return (
//     <>
//       <button onClick={handleShow}>{show ? 'hide': 'show'}</button>
//       <div>{show ? getInfo() : ''}</div>
//     </>
//   )
// }

// const App = () => {
//   const [countries, setCountries] = useState([])
//   const [filtered, setFiltered] = useState([])

//   useEffect(() => {
//     retrieveCountries().then((initialCountries) => {
//       setCountries(initialCountries)
//       setFiltered(initialCountries)
//     })
//   }, [])

//   function handleChanges() {
//     if (filtered.length > 10) {
//       return <div>Too many matches, specify another filter</div>
//     }
//     else if (filtered.length > 1 && filtered.length <= 10) {
//       return <div>{filtered.map((country) => {
//         return <div key={country.name.common}>{country.name.common} <CountryInfo country={country}></CountryInfo></div>
//       })}</div>
//     }
//     else if (filtered.length === 1 || filtered.map((country) => country.name.common).includes("United States")) {
//       return <div>{filtered.map((country) => {
//         return <DisplayCountryInfo country={country}></DisplayCountryInfo>
//       })}</div>
//     }
//     else {
//       return <div>No matches</div>
//     }
//   }
  
//   return (
//     <>
//       <Filter countries={countries} setFiltered={setFiltered}></Filter>
//       {handleChanges()}
//     </>
    
//   )
// }

export default App