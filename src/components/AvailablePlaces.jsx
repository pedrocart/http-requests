import { useState, useEffect } from 'react';
import ErrorPage from './Error.jsx';
import { sortPlacesByDistance } from '../loc.js';
import { fetchAvailablePlaces } from '../http.js';

import Places from './Places.jsx';

const places = localStorage.getItem('places');

export default function AvailablePlaces({ onSelectPlace }) {
   // When Fetching data we usually use these 3 states
   // 1. isFetching: to show a loading spinner
   // 2. availablePlaces: to store the fetched data
   // 3. error: to store any error that occurs during fetching
   const [isFetching, setIsFetching] = useState(false);
   const [availablePlaces, setAvaiablePlaces] = useState([]);
   const [error, setError] = useState();

   useEffect(() => {
      async function fetchPlaces() {
         setIsFetching(true);

         try {
            const places = await fetchAvailablePlaces();

            navigator.geolocation.getCurrentPosition((position) => {
               const sortedPlaces = sortPlacesByDistance(places, position.coords.latitude, position.coords.longitude);
               setAvaiablePlaces(sortedPlaces);
               setIsFetching(false);
            });

            
         } catch (error) { 
            setError(
               {
                  message: error.message || 'Could not fetch places, please try again later.'
               }
            );
            setIsFetching(false);
         }

         
      };

      fetchPlaces();
   }, []);

   if (error) {
      return (
         <ErrorPage
            title="An error occurred!"
            message={error.message}
         />
      );
   }

   return (
      <Places
         title="Available Places"
         places={availablePlaces}
         isLoading={isFetching}
         loadingText="Fetching place data..."
         fallbackText="No places available."
         onSelectPlace={onSelectPlace}
      />
   );
}
