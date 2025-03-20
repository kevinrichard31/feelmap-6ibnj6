import React, { useState, useEffect, useRef } from 'react';  // Import useRef
import { IonContent, IonPage, useIonRouter } from '@ionic/react';
import { Geolocation, Position } from '@capacitor/geolocation';
import { useIonViewWillEnter } from '@ionic/react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import markerIcon from '../icons/current.svg';
import { getAllEmotionsWithAuth } from '../utils/api';
import { emotions as emotionData } from '../data/emotions';

const Tab1: React.FC = () => {
  const [coordinates, setCoordinates] = useState<Position | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [emotions, setEmotions] = useState<any[]>([]);
  const routerLink = useIonRouter();
  const mapRef = useRef<L.Map | null>(null);
  const [markers, setMarkers] = useState<L.Marker[]>([]);
  const geoMarkerRef = useRef<L.Marker | null>(null);  // Use useRef for geoMarker

  const initializeMap = () => {
    if (!mapRef.current) {
      mapRef.current = L.map('map', { zoomControl: false }).setView([48.8566, 2.3522], 13);
      L.tileLayer('https://tile.thunderforest.com/atlas/{z}/{x}/{y}.png?apikey=8e6f42fa80cd4449b69d8e3867030188', {
        attribution: '© OpenStreetMap contributors',
      }).addTo(mapRef.current);
    }
  };

  const fetchCoordinates = async () => {
    try {
      const position: Position = await Geolocation.getCurrentPosition({ enableHighAccuracy: true });
      setCoordinates(position);

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
        const emotionIcon = L.icon({
          iconUrl: emotionData.find(e => e.name === emotion.emotionName)?.imageStatic || '/icons/default.svg',
          iconSize: [40, 40]
        });

        const marker = L.marker([emotion.latitude, emotion.longitude], { icon: emotionIcon })
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


  useIonViewWillEnter(() => {
    initializeMap();
    fetchCoordinates();
    fetchEmotions();
  });

  useEffect(() => { addMarkersToMap(); }, [emotions]);

  return (
    <IonPage>
      <IonContent fullscreen>
        {error && <div className="error-message">{error}</div>}
        <div id="map" style={{ height: '100%' }} />
      </IonContent>
    </IonPage>
  );
};

export default Tab1;