import { Header } from '../componets/Header'
import { Loading } from '../componets/Loading'
import AboutImg from '../assets/svg/site-about.svg'
import midpoint from '../assets/png/midpoint.png'
import personA from '../assets/png/personA.png'
import personB from '../assets/png/personB.png'

import styles from './css/Home.module.css'
import { useEffect, useRef, useState } from 'react'
import { useHistory } from 'react-router-dom'

export const Home = ({ isLoaded, setLocations }) => {
    return (
        <div className={styles.Home}>
            <Header />
            <div className={styles.HomeWrapper}>
                {isLoaded ? (
                    <>
                        <div className={styles.siteAbout}>
                            <img src={AboutImg} />
                            <p className={styles.aboutText}>MeetHalfway helps you find an equal distant location where you can meet. Enter two locations and a point of interest and find your perfect meeting location. </p>
                        </div>
                        <Menu setLocations={setLocations} />
                    </>
                ) : (
                    <>
                        <Loading />
                    </>
                )}
            </div>
        </div>
    )
}

const Menu = ({setLocations}) => {
    const locationA = useRef()
    const locationB = useRef()

    const google = window.google
    const history = useHistory()

    const initAutocomplete = (location, setLocations)=> {
        let autocomplete = new google.maps.places.Autocomplete(location, {
            ComponentRestrictions: {country: ['us', 'ca']},
            fields: ["place_id"],
        })
        autocomplete.addListener('place_changed', () => {
            setLocations(prevLocations => ({
                ...prevLocations,
                [location.id]: autocomplete.getPlace()
            }))
        })
    }

    const handelSubmit = event => {
        event.preventDefault()
        history.push('/Results')
    }

    const handelKeywordChange = event => {
        setLocations(prevLocations => ({
            ...prevLocations,
            keyword: event.target.value
        }))
    }

    useEffect(() => {
        initAutocomplete(locationA.current, setLocations)
        initAutocomplete(locationB.current, setLocations)
    })

    return (
        <form className={styles.siteMenu} onSubmit={handelSubmit} >
            <h2>Find the Halfway Point</h2>
            <label className={styles.menuItem} >Person <img src={personA} className={styles.personIcon} /></label>
            <input className={styles.menuItem} type='text' id='locationA' ref={locationA} />
            <label className={styles.menuItem} >Person <img src={personB} className={styles.personIcon} /></label>
            <input className={styles.menuItem} type='text' id='locationB' ref={locationB} />
            <label className={styles.menuItem} >Point of Interest <img src={midpoint} className={styles.midpointIcon} /></label>
            <input className={styles.menuItem} type='text' onChange={handelKeywordChange} />
            <input className={styles.submitButton} type='submit' value="Meet Halfway!"/>
        </form>
    )
}