import {
  HashRouter as Router,
  Switch,
  Route,
  Link
} from 'react-router-dom'
import { Loader } from '@googlemaps/js-api-loader'
import { useEffect, useReducer, useState } from 'react'

import { Home } from './sections/Home'
import { Results } from './sections/Results'

import styles from './App.module.css'

const usePersistedState = (key, defaultValue) => {
  const [state, setState] = useState(
    () => JSON.parse(localStorage.getItem(key)) || defaultValue
  )
  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(state))
  }, [key, state])
  return [state, setState]
}

function App() {
  const [isLoaded, setIsLoaded] = useState(false)
  const [locations, setLocations] = usePersistedState('bob', {
    locationA: {},
    locationB: {},
    keyword: null
  })

  const loader = new Loader({
    apiKey: process.env.REACT_APP_API_KEY,
    version: "beta",
    libraries: ["places"]
  })

  useEffect(() => {
    loader.load().then(() => {
      setIsLoaded(true)
    })
    
  }, [])

  return (
    <div className={styles.App}>
      <Router>
        <Switch>
          <Route exact path='/'>
            <Home isLoaded={isLoaded} setLocations={setLocations}/>
          </Route>
          <Route exact path='/results'>
            <Results isLoaded={isLoaded} locations={locations}/>
          </Route>
        </Switch>
      </Router>
    </div>
  );
}

export default App;
