import React, { useState, useEffect, useRef } from 'react';  // Import useRef
import { IonContent, IonPage, useIonRouter } from '@ionic/react';
import { Geolocation, Position } from '@capacitor/geolocation';
import { useIonViewWillEnter } from '@ionic/react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import markerIcon from '../icons/current.svg';
import { getAllEmotionsWithAuth } from '../utils/api';
import { emotions as emotionData } from '../data/emotions';
import './Tab1.css';
import { useGeolocationStore } from '../store/geolocation';
import { i } from 'vite/dist/node/types.d-aGj9QkWt';

const Tab1: React.FC = () => {
  const [coordinates, setCoordinates] = useState<Position | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [emotions, setEmotions] = useState<any[]>([]);
  const routerLink = useIonRouter();
  const mapRef = useRef<L.Map | null>(null);
  const [markers, setMarkers] = useState<L.Marker[]>([]);
  const geoMarkerRef = useRef<L.Marker | null>(null);  // Use useRef for geoMarker
  const setGeolocation = useGeolocationStore((state) => state.setGeolocation);
  const { latitude, longitude, updatedAt } = useGeolocationStore((state) => state);
  const [isGeolocationRecent, setIsGeolocationRecent] = useState(false);


  const initializeMap = (isRecent: boolean) => {
    setTimeout(() => {
      console.log("Valeur de isGeolocationRecent dans initializeMap:", isRecent);
      console.log("Latitude:", latitude);
      console.log("Longitude:", longitude);
    }, 2000);
  
    // Coordonnées par défaut (Paris)
    const defaultLat = 48.8566;
    const defaultLng = 2.3522;
  
    // Vérification des coordonnées et sélection des valeurs à utiliser
    const lat = isRecent && latitude ? latitude : defaultLat;
    const lng = isRecent && longitude ? longitude : defaultLng;
  
    if (!mapRef.current) {
      mapRef.current = L.map("map", { zoomControl: false }).setView([lat, lng], 13);
  
      L.tileLayer("https://tile.thunderforest.com/atlas/{z}/{x}/{y}.png?apikey=8e6f42fa80cd4449b69d8e3867030188", {
        attribution: "© OpenStreetMap contributors",
      }).addTo(mapRef.current);
    } else {
      mapRef.current.setView([lat, lng], 13); // Mise à jour si la carte existe déjà
    }
  };
  


  const fetchCoordinates = async () => {
    try {
      const position: Position = await Geolocation.getCurrentPosition({ enableHighAccuracy: true });
      setCoordinates(position);
      setGeolocation(position.coords.latitude, position.coords.longitude);

      // Supprimer l'ancien geoMarker s'il existe
      if (geoMarkerRef.current) {
        geoMarkerRef.current.remove();
        geoMarkerRef.current = null;
      }

      if (mapRef.current) {
        mapRef.current.setView([position.coords.latitude, position.coords.longitude], 13);

        const customIcon = L.icon({ iconUrl: markerIcon, iconSize: [16, 16], iconAnchor: [8, 16] });
        const newGeoMarker = L.marker([position.coords.latitude, position.coords.longitude], { icon: customIcon }).addTo(mapRef.current);
        geoMarkerRef.current = newGeoMarker; // Assign to the ref
      }
    } catch (err) {
      console.error('Error getting location:', err);
      setError('Unable to retrieve your location');
    }
  };

  const fetchEmotions = async () => {
    const userId = localStorage.getItem('userId');
    const password = localStorage.getItem('password');
    if (userId && password) {
      try {
        const fetchedEmotions = await getAllEmotionsWithAuth(userId, password);
        setEmotions(fetchedEmotions.reverse());
      } catch (err) {
        console.error('Error fetching emotions:', err);
      }
    }
  };

  const addMarkersToMap = () => {
    if (mapRef.current) {
      // Supprimer les anciens marqueurs
      markers.forEach(marker => marker.remove());
      setMarkers([]);

      // Ajouter les nouveaux marqueurs
      const newMarkers: L.Marker[] = emotions.map((emotion) => {
        const emotionImage = emotionData.find(e => e.name === emotion.emotionName)?.imageStatic || '/icons/default.svg';
        const placeTypeImage = `/images/places/${emotion.placeTypeId}.svg`;

        // Création d'un icône personnalisé avec les deux images
        const customIcon = L.divIcon({
          className: 'custom-marker',
          html: `
            <div class="marker-container">
              <img src="${emotionImage}" class="marker-emotion" />
              <div class="marker-place-type"><img src="${placeTypeImage}"  class="marker-place-type-icon"/></div>
            </div>
          `,
          iconSize: [40, 40], // Ajuste selon tes besoins
          iconAnchor: [20, 30]
        });

        const marker = L.marker([emotion.latitude, emotion.longitude], { icon: customIcon })
          .addTo(mapRef.current!)
          .on('click', () => routerLink.push(`/emotiondetail/?date=${encodeURIComponent(emotion.emotionDate)}`));

        return marker;
      });

      setMarkers(newMarkers);
    }
  };


  useEffect(() => {
    return () => {
      markers.forEach(marker => marker.remove());
      setMarkers([]);

      // Supprimer le geoMarker lors du démontage du composant
      if (geoMarkerRef.current) {
        geoMarkerRef.current.remove();
        geoMarkerRef.current = null;
      }

      // Optionally, remove the map instance itself
      if (mapRef.current) {
        mapRef.current.remove();  // Supprime la carte Leaflet
        mapRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    console.log('isGeolocationRecent mis à jour:', isGeolocationRecent);
  }, [isGeolocationRecent]);


  useIonViewWillEnter(() => {
    const checkGeolocationAge = () => {
      const now = Date.now();
      const fifteenMinutes = 15 * 60 * 1000;
      const isRecent = updatedAt >= now - fifteenMinutes;

      setIsGeolocationRecent(isRecent);

      return isRecent;
    };

    const isRecent = checkGeolocationAge();

    initializeMap(isRecent); // Passe l'état comme argument

    fetchCoordinates();
    fetchEmotions();
  });


  useEffect(() => { addMarkersToMap(); }, [emotions]);

  return (
    <IonPage>
      <IonContent
        fullscreen
        forceOverscroll={false}
      >
        {error && <div className="error-message">{error}</div>}
        <div id="map" style={{ height: '100%' }} />
      </IonContent>
    </IonPage>
  );
};

export default Tab1;