import { useEffect, useRef } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { useWeatherContext } from '../../context/weatherContextValue'
import { GlassCard } from '../ui/GlassCard'
import { SectionHeader } from '../ui/SectionHeader'

const ZOOM = 11
const TILE_URL = 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png'
const MAP_INIT_DELAY = 100

const MARKER_HTML =
  '<div style="color:#2b8cee;font-size:32px;filter:drop-shadow(0 2px 4px rgba(0,0,0,0.5));line-height:1" class="material-symbols-outlined">location_on</div>'

export const PrecipitationMap = () => {
  const { weatherState } = useWeatherContext()
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<L.Map | null>(null)
  const markerRef = useRef<L.Marker | null>(null)

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return

    const map = L.map(mapRef.current, {
      zoomControl: true,
      attributionControl: false,
      scrollWheelZoom: false,
    }).setView([0, 0], ZOOM)

    L.tileLayer(TILE_URL, {
      subdomains: 'abcd',
      maxZoom: 19,
    }).addTo(map)

    const icon = L.divIcon({
      className: '',
      html: MARKER_HTML,
      iconSize: [32, 32],
      iconAnchor: [16, 32],
    })

    markerRef.current = L.marker([0, 0], { icon }).addTo(map)
    mapInstanceRef.current = map

    // Leaflet needs a size recalc after layout settles
    const timer = setTimeout(() => {
      if (mapInstanceRef.current) map.invalidateSize()
    }, MAP_INIT_DELAY)

    return () => {
      clearTimeout(timer)
      map.remove()
      mapInstanceRef.current = null
      markerRef.current = null
    }
  }, [])

  useEffect(() => {
    if (!weatherState || !mapInstanceRef.current || !markerRef.current) return
    const { latitude, longitude } = weatherState.location
    mapInstanceRef.current.setView([latitude, longitude], ZOOM)
    markerRef.current.setLatLng([latitude, longitude])
    mapInstanceRef.current.invalidateSize()
  }, [weatherState?.location])

  return (
    <GlassCard className="lg:col-span-2 relative overflow-hidden min-h-[200px] flex flex-col">
      <SectionHeader icon="map">Location</SectionHeader>
      <div className="rounded-xl overflow-hidden border border-white/10 mt-4">
        <div ref={mapRef} style={{ height: 220 }} aria-label="Location map" />
      </div>
    </GlassCard>
  )
}
