
import { useEffect, useRef, useState } from 'react'
import { Header } from '../componets/Header'
import { Loading } from '../componets/Loading'

import styles from './css/Results.module.css'

const createMarker = (map, pos, label = '') => {
    const google = window.google
    new google.maps.Marker({
      position: pos,
      label: label,
      map: map
    })
}

export const Results = ({isLoaded, locations}) => {
    const [resultsList, setResultsList] = useState([])
    const google = window.google
    const mapRef = useRef()
    
    useEffect( () => {
        if (google)
            InitMaps()
    }, [google])

    async function InitMaps() {
        let map = CreateMap()
        mapRef.current = map
        let route = await CreateRoute(map)
        let midpoint = CreateMidpoint(route, map)
        createMarker(map, midpoint)
        getNearbyPlaces(map, midpoint, locations.keyword)

    }

    const CreateMap = () =>
        new google.maps.Map(mapRef.current)

    const CreateRoute = async map => {
        const directionsService = new google.maps.DirectionsService()
        const directionsRenderer = new google.maps.DirectionsRenderer()

        directionsRenderer.setMap(map)
        let response = await directionsService.route({
            origin: {placeId: locations.locationA.place_id},
            destination: {placeId: locations.locationB.place_id},
            travelMode: google.maps.TravelMode.DRIVING
        });
        directionsRenderer.setDirections(response)
        return response.routes[0]
    }

    const CreateMidpoint = (route, map) => {
        let steps = route.legs[0].steps
        let halfwayDistance = route.legs[0].distance.value / 2

        let path = getMidPath(steps)
        let distancePath = createDistancePath(path)
        let midPoint = getMidPoint(distancePath)
        //createMarker(map, midPoint.start)
        //createMarker(map, midPoint.mid)
        return midPoint.mid

        function getMidPath(steps) {
            let distanceStart = 0
            for (let step of steps) {
                let distanceEnd = distanceStart + step.distance.value
                if (halfwayDistance > distanceStart && halfwayDistance < distanceEnd) {
                    return {
                        path: step.path,
                        beginDistance: distanceStart
                    }
                }
            distanceStart = distanceEnd
            }
        }

        function createDistancePath({path, beginDistance}) {
            let newPath = []
            for (let i = 0; i < path.length - 1; i++) {
                newPath.push({
                    start: path[i],
                    end: path[i + 1],
                    distance: google.maps.geometry.spherical.computeDistanceBetween(path[i], path[i + 1])
                })
            }
            return {
                distancePath: newPath,
                beginDistance: beginDistance
            }
        }

        function getMidPoint({distancePath, beginDistance}) {
            let distanceStart = beginDistance
            for (let subStep of distancePath) {
                let distanceEnd = distanceStart + subStep.distance
                if (halfwayDistance > distanceStart && halfwayDistance < distanceEnd) {
                    return {
                        start: {
                            lat: subStep.start.lat(),
                            lng: subStep.start.lng()
                        },
                        mid: {
                            lat: (subStep.start.lat() + subStep.end.lat()) / 2,
                            lng: (subStep.start.lng() + subStep.end.lng()) / 2
                        },
                        end: {
                            lat: subStep.end.lat(),
                            lng: subStep.end.lng()
                        }
                    }
                }
                distanceStart = distanceEnd
            }
        }
    }

    const getNearbyPlaces = (map, location, keyword) => {
        let request = {
            location: location,
            rankBy: google.maps.places.RankBy.DISTANCE,
            keyword: keyword
        }

        let service = new google.maps.places.PlacesService(map)
        service.nearbySearch(request, (results, status) => {
            setResultsList(results)
        })
    }

    return (
        <div className={styles.Results}>
            <Header />
            {(google )? (
                <>
                    <div className={styles.mapWrapper}><div ref={mapRef} className={styles.map}></div></div>
                    <PlaceList resultsList={resultsList} mapRef={mapRef}/>
                </>
            ) : (
                <>
                    <Loading />
                </>
            )}
        </div>
    )
}

const PlaceList = ({resultsList, mapRef}) => {
    return (
        <div className={styles.placeList}>
            {resultsList.map((result, index) =>
                <Place result={result} key={index} index={index + 1} mapRef={mapRef}/>
            )}
        </div>
    )
}

const Place = ({result, index, mapRef}) => {
    const {name, vicinity, rating, photos, place_id, geometry} = result
    let imgUrl = photos[0].getUrl()

    useEffect(() => {
        createMarker(mapRef.current, geometry.location, index.toString())
    })

    const handelCenterMap = () => {
        mapRef.current.setZoom(15)
        mapRef.current.panTo(geometry.location)
        
    }

    return  (
        <div className={styles.placeRow}>
            <div className={styles.placeIndex}><div>{`#${index}`}</div></div>
            <img src={imgUrl} className={styles.placePhoto}/>
            <div className={styles.placeText}>
                <h3>{name}</h3>
                <div>{vicinity}</div>
            </div>
            <button className={styles.placeButton} onClick={handelCenterMap}>Center</button>
        </div>
    )
}