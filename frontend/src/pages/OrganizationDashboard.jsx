
import { useCallback, useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Circle,
  Polyline,
  useMap,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const API = (
  import.meta.env.VITE_API_URL || "http://localhost:5000"
).replace(/\/+$/, "");

/* ================= API HELPERS ================= */

async function apiRequest(path, options = {}) {
  const token = localStorage.getItem("token");
  const url = `${API}${path.startsWith("/") ? path : `/${path}`}`;

  const headers = {
    Accept: "application/json",
    ...(options.body ? { "Content-Type": "application/json" } : {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  let response;

  try {
    response = await fetch(url, {
      ...options,
      headers,
    });
  } catch (error) {
    console.error("NETWORK ERROR:", error);

    throw new Error(
      "Cannot connect to the backend. Check that your server is running."
    );
  }

  const text = await response.text();
  let data = {};

  if (text.trim()) {
    try {
      data = JSON.parse(text);
    } catch {
      console.error("NON-JSON API RESPONSE:", {
        url,
        status: response.status,
        response: text.slice(0, 500),
      });

      throw new Error(
        `Invalid server response (HTTP ${response.status}). Check the backend route.`
      );
    }
  }

  if (!response.ok) {
    console.error("API ERROR:", {
      url,
      status: response.status,
      data,
    });

    throw new Error(
      data.message ||
        data.error ||
        `Request failed with HTTP ${response.status}.`
    );
  }

  return data;
}

function getCoordinates(location) {
  if (
    location &&
    Number.isFinite(Number(location.latitude)) &&
    Number.isFinite(Number(location.longitude)) &&
    location.latitude !== null &&
    location.longitude !== null
  ) {
    return [Number(location.latitude), Number(location.longitude)];
  }

  if (
    Array.isArray(location?.coordinates) &&
    location.coordinates.length === 2 &&
    location.coordinates.every(
      (coordinate) =>
        coordinate !== null &&
        coordinate !== "" &&
        Number.isFinite(Number(coordinate))
    )
  ) {
    // GeoJSON stores [longitude, latitude].
    return [
      Number(location.coordinates[1]),
      Number(location.coordinates[0]),
    ];
  }

  return null;
}

function getDonationCoordinates(donation) {
  return getCoordinates(donation?.location);
}

/* ================= MAP ICONS ================= */

const organizationIcon = L.divIcon({
  className: "custom-map-icon",
  html: `
    <div class="user-location-marker">
      <div class="user-location-dot"></div>
    </div>
  `,
  iconSize: [46, 46],
  iconAnchor: [23, 23],
});

const foodIcon = L.divIcon({
  className: "custom-map-icon",
  html: `
    <div class="food-location-marker">
      <span>🍲</span>
    </div>
  `,
  iconSize: [48, 48],
  iconAnchor: [24, 24],
});

/* ================= MAP STYLES ================= */

const mapStyles = `
  .custom-map-icon {
    background: transparent !important;
    border: none !important;
  }

  .user-location-marker {
    width: 46px;
    height: 46px;
    border-radius: 50%;
    background: rgba(34, 197, 94, 0.18);
    display: flex;
    align-items: center;
    justify-content: center;
    animation: locationPulse 2s infinite;
  }

  .user-location-dot {
    width: 25px;
    height: 25px;
    border-radius: 50%;
    background: #22c55e;
    border: 4px solid white;
    box-shadow: 0 3px 10px rgba(0,0,0,0.3);
  }

  .food-location-marker {
    width: 44px;
    height: 44px;
    border-radius: 50%;
    background: white;
    border: 3px solid #f97316;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 4px 12px rgba(0,0,0,0.25);
  }

  .food-location-marker span {
    font-size: 24px;
    line-height: 1;
  }

  @keyframes locationPulse {
    0% { box-shadow: 0 0 0 0 rgba(34,197,94,0.45); }
    70% { box-shadow: 0 0 0 15px rgba(34,197,94,0); }
    100% { box-shadow: 0 0 0 0 rgba(34,197,94,0); }
  }

  .leaflet-popup-content-wrapper {
    border-radius: 16px;
  }

  .leaflet-popup-content {
    margin: 14px 16px;
  }

  .leaflet-control-zoom {
    border: none !important;
    box-shadow: 0 4px 15px rgba(0,0,0,0.15) !important;
  }

  .leaflet-control-zoom a {
    border: none !important;
  }
`;

/* ================= MAP VIEW ================= */

function MapView({ organizationPosition, selectedFoodPosition }) {
  const map = useMap();

  useEffect(() => {
    if (organizationPosition && selectedFoodPosition) {
      map.fitBounds(
        L.latLngBounds([organizationPosition, selectedFoodPosition]),
        { padding: [70, 70], maxZoom: 15 }
      );
    } else if (organizationPosition) {
      map.setView(organizationPosition, 14, { animate: true });
    }
  }, [organizationPosition, selectedFoodPosition, map]);

  return null;
}

/* ================= DRIVING ROUTE ================= */

function FoodRoute({ from, to }) {
  const [route, setRoute] = useState([]);

  useEffect(() => {
    if (!from || !to) {
      setRoute([]);
      return;
    }

    let cancelled = false;

    async function loadRoute() {
      try {
        const url =
          `https://router.project-osrm.org/route/v1/driving/` +
          `${from[1]},${from[0]};${to[1]},${to[0]}` +
          `?overview=full&geometries=geojson`;

        const response = await fetch(url);

        if (!response.ok) {
          throw new Error("Driving route could not be loaded.");
        }

        const data = await response.json();

        if (!cancelled && data.routes?.length) {
          setRoute(
            data.routes[0].geometry.coordinates.map(([lng, lat]) => [
              lat,
              lng,
            ])
          );
        } else if (!cancelled) {
          setRoute([]);
        }
      } catch (error) {
        console.error("ROUTE ERROR:", error);
        if (!cancelled) setRoute([]);
      }
    }

    loadRoute();

    return () => {
      cancelled = true;
    };
  }, [from, to]);

  if (!route.length) return null;

  return (
    <>
      <Polyline
        positions={route}
        pathOptions={{
          color: "white",
          weight: 8,
          opacity: 0.9,
          lineCap: "round",
          lineJoin: "round",
        }}
      />
      <Polyline
        positions={route}
        pathOptions={{
          color: "#f97316",
          weight: 5,
          opacity: 0.95,
          lineCap: "round",
          lineJoin: "round",
        }}
      />
    </>
  );
}

/* ================= MAIN DASHBOARD ================= */

function OrganizationDashboard() {
  const [activeSection, setActiveSection] = useState("overview");
  const navigate = useNavigate();

  function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("organizationId");
    navigate("/auth");
  }

  return (
    <main className="min-h-screen bg-[#f5f1e8] text-[#171717]">
      <style>{mapStyles}</style>

      <nav className="flex items-center justify-between border-b border-[#171717]/10 px-6 py-6 md:px-12 lg:px-16">
        <Link
          to="/"
          className="text-2xl font-semibold tracking-[-0.04em]"
        >
          Food<span className="text-[#8b6f47]">Bridge</span>
        </Link>

        <button
          type="button"
          onClick={logout}
          className="text-sm text-[#171717]/50 transition hover:text-[#171717]"
        >
          Logout
        </button>
      </nav>

      <div className="mx-auto max-w-7xl px-6 py-12 md:px-12 lg:px-16">
        <section>
          <p className="text-xs uppercase tracking-[0.3em] text-[#171717]/40">
            Organization
          </p>

          <h1 className="mt-5 text-5xl font-light tracking-[-0.05em] md:text-7xl">
            Find surplus food.
          </h1>

          <p className="mt-6 max-w-xl text-lg leading-8 text-[#171717]/55">
            Discover nearby food donations and request surplus food from
            organizers.
          </p>
        </section>

        <div className="mt-12 flex flex-wrap gap-3 border-b border-[#171717]/10 pb-5">
          {[
            ["overview", "Overview"],
            ["nearby", "Nearby Food"],
            ["requests", "My Requests"],
          ].map(([value, label]) => (
            <DashboardButton
              key={value}
              active={activeSection === value}
              onClick={() => setActiveSection(value)}
            >
              {label}
            </DashboardButton>
          ))}
        </div>

        <div className="mt-10">
          {activeSection === "overview" && (
            <Overview setActiveSection={setActiveSection} />
          )}
          {activeSection === "nearby" && <NearbyFood />}
          {activeSection === "requests" && <MyRequests />}
        </div>
      </div>
    </main>
  );
}

/* ================= OVERVIEW ================= */

function Overview({ setActiveSection }) {
  return (
    <section className="grid gap-6 md:grid-cols-2">
      <DashboardCard
        symbol="◎"
        title="Nearby food"
        description="Find surplus food available near your organization."
        action="Find food →"
        onClick={() => setActiveSection("nearby")}
      />

      <DashboardCard
        symbol="→"
        title="My requests"
        description="Track the food donations you have requested."
        action="View requests →"
        onClick={() => setActiveSection("requests")}
      />

      <DashboardCard
        symbol="⌖"
        title="Location"
        description="Use your current location to find nearby donations."
        action="Find nearby food →"
        onClick={() => setActiveSection("nearby")}
      />
    </section>
  );
}

/* ================= NEARBY FOOD ================= */

function NearbyFood() {
  const [position, setPosition] = useState(null);
  const [radius, setRadius] = useState(10000);
  const [donations, setDonations] = useState([]);
  const [selectedFood, setSelectedFood] = useState(null);
  const [loading, setLoading] = useState(false);
  const [locationLoading, setLocationLoading] = useState(false);
  const [error, setError] = useState("");
  const [locationMessage, setLocationMessage] = useState("");
  const [requestLoading, setRequestLoading] = useState(null);
  const [requestMessage, setRequestMessage] = useState("");
  const [requestError, setRequestError] = useState("");

  const latitude = position?.[0] ?? null;
  const longitude = position?.[1] ?? null;

  function getCurrentLocation() {
    setLocationLoading(true);
    setError("");
    setLocationMessage("");

    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser.");
      setLocationLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        setPosition([coords.latitude, coords.longitude]);
        setLocationMessage("Your current location has been captured.");
        setLocationLoading(false);
      },
      (err) => {
        const messages = {
          1: "Location permission was denied. Please allow location access.",
          2: "Your location could not be determined.",
          3: "Location request timed out. Please try again.",
        };

        setError(messages[err.code] || "Unable to get your location.");
        setLocationLoading(false);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  }

  useEffect(() => {
    if (latitude === null || longitude === null) return;

    let cancelled = false;

    async function loadNearbyFood() {
      setLoading(true);
      setError("");

      try {
        const query = new URLSearchParams({
          latitude: String(latitude),
          longitude: String(longitude),
          radius: String(radius),
        });

        const data = await apiRequest(
          `/api/donations/nearby?${query.toString()}`
        );

        const items = Array.isArray(data)
          ? data
          : Array.isArray(data.donations)
            ? data.donations
            : [];

        if (!cancelled) {
          setDonations(items);

          setSelectedFood((current) =>
            current && items.some((item) => item._id === current._id)
              ? items.find((item) => item._id === current._id)
              : null
          );
        }
      } catch (err) {
        console.error("NEARBY FOOD ERROR:", err);
        if (!cancelled) setError(err.message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadNearbyFood();

    return () => {
      cancelled = true;
    };
  }, [latitude, longitude, radius]);

  async function requestFood(donation) {
    setRequestLoading(donation._id);
    setRequestMessage("");
    setRequestError("");

    try {
      const token = localStorage.getItem("token");
      const organizationId = localStorage.getItem("organizationId");

      if (!token) {
        throw new Error("Please log in before requesting food.");
      }

      if (!organizationId) {
        throw new Error(
          "Organization ID is missing. Log in again using your organization account."
        );
      }

      if (!donation?._id) {
        throw new Error("The selected donation has no valid ID.");
      }

      const result = await apiRequest("/api/requests", {
        method: "POST",
        body: JSON.stringify({
          donationId: donation._id,
          organizationId,
        }),
      });

      setRequestMessage(
        result.message || "Food request submitted successfully."
      );

      setDonations((current) =>
        current.filter((item) => item._id !== donation._id)
      );
      setSelectedFood((current) =>
        current?._id === donation._id ? null : current
      );
    } catch (err) {
      console.error("REQUEST FOOD ERROR:", err);
      setRequestError(err.message || "Unable to create the food request.");
    } finally {
      setRequestLoading(null);
    }
  }

  const selectedFoodPosition = getDonationCoordinates(selectedFood);

  return (
    <section>
      <SectionHeading
        eyebrow="Nearby"
        title="Available food."
        description="Find surplus food donations near your current location."
      />

      <div className="mt-10 rounded-[2rem] border border-[#171717]/10 bg-white/50 p-6 md:p-8">
        <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-medium">Your location</p>
            <p className="mt-1 text-xs leading-5 text-[#171717]/50">
              Your browser GPS location is used to find nearby donations.
            </p>
          </div>

          <button
            type="button"
            onClick={getCurrentLocation}
            disabled={locationLoading}
            className="rounded-full bg-[#171717] px-5 py-3 text-sm text-white transition hover:-translate-y-0.5 disabled:opacity-50"
          >
            {locationLoading ? "Getting location..." : "Use my current location"}
          </button>
        </div>

        {locationMessage && (
          <div className="mt-5 rounded-xl bg-green-50 p-4 text-sm text-green-700">
            ✓ {locationMessage}
          </div>
        )}

        {position && (
          <div className="mt-5 rounded-xl bg-[#f5f1e8] p-4 text-xs text-[#171717]/60">
            <p>
              Latitude: <strong className="text-[#171717]">{latitude.toFixed(6)}</strong>
            </p>
            <p className="mt-1">
              Longitude: <strong className="text-[#171717]">{longitude.toFixed(6)}</strong>
            </p>
          </div>
        )}

        <div className="mt-6">
          <label
            htmlFor="search-radius"
            className="mb-2 block text-sm text-[#171717]/60"
          >
            Search radius
          </label>

          <select
            id="search-radius"
            value={radius}
            onChange={(event) => setRadius(Number(event.target.value))}
            className="rounded-xl border border-[#171717]/15 bg-[#f5f1e8] px-4 py-3 outline-none"
          >
            <option value={5000}>5 km</option>
            <option value={10000}>10 km</option>
            <option value={20000}>20 km</option>
            <option value={50000}>50 km</option>
          </select>
        </div>
      </div>

      {error && <MessageBox type="error">{error}</MessageBox>}
      {requestMessage && <MessageBox type="success">{requestMessage}</MessageBox>}
      {requestError && <MessageBox type="error">{requestError}</MessageBox>}

      {position && (
        <div className="mt-10">
          <p className="text-xs uppercase tracking-[0.2em] text-[#171717]/40">
            Live map
          </p>
          <p className="mt-1 text-sm text-[#171717]/50">
            Select a food marker to see the driving route.
          </p>

          <div
            className="mt-4 overflow-hidden rounded-[2rem] border border-[#171717]/10 bg-white"
            style={{ height: 480 }}
          >
            <MapContainer
              center={position}
              zoom={14}
              scrollWheelZoom
              style={{ height: "100%", width: "100%" }}
            >
              <TileLayer
                attribution="&copy; OpenStreetMap contributors"
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />

              <MapView
                organizationPosition={position}
                selectedFoodPosition={selectedFoodPosition}
              />

              <Marker position={position} icon={organizationIcon}>
                <Popup>
                  <strong>Your organization</strong>
                  <p className="mt-1 text-xs text-gray-500">
                    Current GPS location
                  </p>
                </Popup>
              </Marker>

              <Circle
                center={position}
                radius={radius}
                pathOptions={{
                  color: "#8b6f47",
                  weight: 1.5,
                  fillColor: "#8b6f47",
                  fillOpacity: 0.06,
                }}
              />

              {donations.map((donation) => {
                const coordinates = getDonationCoordinates(donation);
                if (!coordinates) return null;

                return (
                  <Marker
                    key={donation._id}
                    position={coordinates}
                    icon={foodIcon}
                    eventHandlers={{
                      click: () => setSelectedFood(donation),
                    }}
                  >
                    <Popup>
                      <div className="min-w-[200px]">
                        <strong>{donation.eventName}</strong>
                        <p className="mt-2 text-xs text-gray-500">
                          {donation.foodDescription}
                        </p>
                        {donation.distanceKm !== undefined && (
                          <p className="mt-2 text-xs">
                            Distance: {donation.distanceKm} km
                          </p>
                        )}
                        <button
                          type="button"
                          onClick={() => setSelectedFood(donation)}
                          className="mt-3 text-xs font-medium text-orange-600"
                        >
                          Show route →
                        </button>
                      </div>
                    </Popup>
                  </Marker>
                );
              })}

              {selectedFoodPosition && (
                <FoodRoute from={position} to={selectedFoodPosition} />
              )}
            </MapContainer>
          </div>
        </div>
      )}

      <div className="mt-10">
        {loading && (
          <p className="text-[#171717]/50">Finding nearby food...</p>
        )}

        {!position && !loading && (
          <EmptyState
            title="Location required."
            description='Click "Use my current location" to find nearby food.'
          />
        )}

        {position && !loading && donations.length === 0 && !error && (
          <EmptyState
            title="No available food found nearby."
            description="Try increasing the search radius."
          />
        )}

        <div className="grid gap-5 md:grid-cols-2">
          {donations.map((donation) => {
            const coordinates = getDonationCoordinates(donation);

            return (
              <div
                key={donation._id}
                className={`rounded-[2rem] border bg-white/50 p-7 transition ${
                  selectedFood?._id === donation._id
                    ? "border-orange-400 shadow-lg"
                    : "border-[#171717]/10"
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-xs uppercase tracking-[0.2em] text-[#171717]/40">
                      Food Donation
                    </p>
                    <h3 className="mt-2 text-2xl font-light">
                      {donation.eventName}
                    </h3>
                  </div>

                  <span className="rounded-full bg-[#d8c6a7] px-3 py-1 text-xs">
                    {donation.status || "AVAILABLE"}
                  </span>
                </div>

                <div className="mt-6 space-y-2 text-sm text-[#171717]/55">
                  <p>
                    <strong className="text-[#171717]">Event:</strong>{" "}
                    {donation.eventType}
                  </p>
                  <p>
                    <strong className="text-[#171717]">Food:</strong>{" "}
                    {donation.foodDescription}
                  </p>
                  <p>
                    <strong className="text-[#171717]">Food type:</strong>{" "}
                    {donation.foodType}
                  </p>
                  <p>
                    <strong className="text-[#171717]">Quantity:</strong>{" "}
                    {donation.quantity}
                  </p>
                  <p>
                    <strong className="text-[#171717]">Pickup:</strong>{" "}
                    {donation.pickupLocation}
                  </p>
                  {donation.distanceKm !== undefined && (
                    <p>
                      <strong className="text-[#171717]">Distance:</strong>{" "}
                      {donation.distanceKm} km
                    </p>
                  )}
                </div>

                {coordinates && (
                  <div className="mt-5 rounded-2xl bg-[#f5f1e8] p-4">
                    <p className="text-sm font-medium">📍 Food location</p>
                    <a
                      href={`https://www.google.com/maps?q=${coordinates[0]},${coordinates[1]}`}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-3 inline-block text-xs font-medium text-[#8b6f47]"
                    >
                      Open location →
                    </a>
                  </div>
                )}

                <div className="mt-7 flex gap-3">
                  <button
                    type="button"
                    onClick={() => setSelectedFood(donation)}
                    className="flex-1 rounded-full border border-[#171717]/15 px-4 py-3 text-sm"
                  >
                    View on Map
                  </button>

                  <button
                    type="button"
                    onClick={() => requestFood(donation)}
                    disabled={requestLoading === donation._id}
                    className="flex-1 rounded-full bg-[#171717] px-4 py-3 text-sm text-white disabled:opacity-50"
                  >
                    {requestLoading === donation._id
                      ? "Requesting..."
                      : "Request Food"}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ================= MY REQUESTS ================= */

function MyRequests() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionLoading, setActionLoading] = useState(null);
  const [trackingId, setTrackingId] = useState(null);
  const [trackingVersion, setTrackingVersion] = useState(0);
  const [trackingMessage, setTrackingMessage] = useState("");
  const [trackingError, setTrackingError] = useState("");

  const watchIds = useRef({});
  const requestsRef = useRef([]);

  useEffect(() => {
    requestsRef.current = requests;
  }, [requests]);

  const stopTracking = useCallback((requestId) => {
    const watchId = watchIds.current[requestId];

    if (watchId !== undefined) {
      navigator.geolocation.clearWatch(watchId);
      delete watchIds.current[requestId];
      setTrackingVersion((version) => version + 1);
    }
  }, []);

  useEffect(() => {
    return () => {
      Object.values(watchIds.current).forEach((watchId) => {
        navigator.geolocation.clearWatch(watchId);
      });
      watchIds.current = {};
    };
  }, []);

  /* ================= LOAD REQUESTS ================= */

  const loadRequests = useCallback(async (showLoading = true) => {
    try {
      if (showLoading) setLoading(true);
      setError("");

      const token = localStorage.getItem("token");
      const organizationId = localStorage.getItem("organizationId");

      if (!token || !organizationId) {
        throw new Error(
          "Please log in as an organization. Your session or organization ID is missing."
        );
      }

      const data = await apiRequest(
        `/api/requests/organization/${encodeURIComponent(organizationId)}`
      );

      const items = Array.isArray(data)
        ? data
        : Array.isArray(data.requests)
          ? data.requests
          : [];

      setRequests(items);
    } catch (err) {
      console.error("LOAD REQUESTS ERROR:", err);
      setError(err.message);
    } finally {
      if (showLoading) setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadRequests();

    const interval = setInterval(() => {
      loadRequests(false);
    }, 10000);

    return () => clearInterval(interval);
  }, [loadRequests]);

  /* ================= UPDATE LIVE LOCATION ================= */

  async function sendLocation(requestId, latitude, longitude) {
    const data = await apiRequest(`/api/requests/${requestId}/location`, {
      method: "PATCH",
      body: JSON.stringify({ latitude, longitude }),
    });

    setRequests((current) =>
      current.map((request) =>
        request._id === requestId
          ? {
              ...request,
              ...(data.request || {}),
              pickupLocation:
                data.request?.pickupLocation || {
                  latitude,
                  longitude,
                },
              lastLocationUpdate:
                data.request?.lastLocationUpdate ||
                new Date().toISOString(),
            }
          : request
      )
    );
  }

  /* ================= START GPS WATCHER ================= */

  function startLiveTracking(requestId) {
    if (watchIds.current[requestId] !== undefined) return;

    if (!navigator.geolocation) {
      setTrackingError("Geolocation is not supported by your browser.");
      return;
    }

    const watchId = navigator.geolocation.watchPosition(
      async ({ coords }) => {
        try {
          await sendLocation(
            requestId,
            coords.latitude,
            coords.longitude
          );
          setTrackingError("");
        } catch (err) {
          console.error("LIVE LOCATION ERROR:", err);
          setTrackingError(err.message);
        }
      },
      (err) => {
        const messages = {
          1: "Location permission was denied. Please allow location access.",
          2: "Your location could not be determined.",
          3: "GPS update timed out. Waiting for another update...",
        };

        setTrackingError(
          messages[err.code] || "Live location could not be updated."
        );
      },
      {
        enableHighAccuracy: true,
        maximumAge: 5000,
        timeout: 10000,
      }
    );

    watchIds.current[requestId] = watchId;
    setTrackingVersion((version) => version + 1);
  }

  /* ================= START PICKUP ================= */

  function startPickup(request) {
    setTrackingError("");
    setTrackingMessage("");

    if (!navigator.geolocation) {
      setTrackingError("Geolocation is not supported by your browser.");
      return;
    }

    if (watchIds.current[request._id] !== undefined) {
      setTrackingMessage("Live tracking is already active.");
      return;
    }

    setTrackingId(request._id);

    navigator.geolocation.getCurrentPosition(
      async ({ coords }) => {
        try {
          const data = await apiRequest(
            `/api/requests/${request._id}/start-pickup`,
            {
              method: "PATCH",
              body: JSON.stringify({
                latitude: coords.latitude,
                longitude: coords.longitude,
              }),
            }
          );

          setRequests((current) =>
            current.map((item) =>
              item._id === request._id
                ? {
                    ...item,
                    ...(data.request || {}),
                    status: data.request?.status || "PICKUP_STARTED",
                  }
                : item
            )
          );

          setTrackingMessage(
            data.message || "Pickup started successfully."
          );

          startLiveTracking(request._id);
        } catch (err) {
          console.error("START PICKUP ERROR:", err);
          setTrackingError(err.message);
        } finally {
          setTrackingId(null);
        }
      },
      (err) => {
        const messages = {
          1: "Location permission was denied.",
          2: "Your location could not be determined.",
          3: "Location request timed out. Please try again.",
        };

        setTrackingError(
          messages[err.code] || "Unable to get your current location."
        );
        setTrackingId(null);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  }

  /* ================= RESUME TRACKING ================= */

  function resumeTracking(request) {
    setTrackingError("");
    setTrackingMessage("Live location tracking resumed.");
    startLiveTracking(request._id);
  }

  /* ================= COLLECT / COMPLETE ================= */

  async function updateRequestStatus(request, action) {
    setActionLoading(`${request._id}-${action}`);
    setTrackingError("");
    setTrackingMessage("");

    try {
      const data = await apiRequest(
        `/api/requests/${request._id}/${action}`,
        { method: "PATCH" }
      );

      const fallbackStatus =
        action === "collect" ? "COLLECTED" : "COMPLETED";

      setRequests((current) =>
        current.map((item) =>
          item._id === request._id
            ? {
                ...item,
                ...(data.request || {}),
                status: data.request?.status || fallbackStatus,
              }
            : item
        )
      );

      stopTracking(request._id);

      setTrackingMessage(
        data.message ||
          (action === "collect"
            ? "Donation marked as collected."
            : "Donation completed successfully.")
      );

      await loadRequests(false);
    } catch (err) {
      console.error(`${action.toUpperCase()} REQUEST ERROR:`, err);
      setTrackingError(err.message);
    } finally {
      setActionLoading(null);
    }
  }

  return (
    <section>
      <SectionHeading
        eyebrow="Your activity"
        title="My requests."
        description="Track food donations requested by your organization."
      />

      {trackingMessage && (
        <MessageBox type="success">{trackingMessage}</MessageBox>
      )}

      {trackingError && (
        <MessageBox type="error">{trackingError}</MessageBox>
      )}

      {loading && (
        <p className="mt-10 text-[#171717]/50">Loading requests...</p>
      )}

      {error && <MessageBox type="error">{error}</MessageBox>}

      {!loading && !error && requests.length === 0 && (
        <EmptyState
          title="No requests yet."
          description="Food requests from your organization will appear here."
        />
      )}

      <div className="mt-10 grid gap-5 md:grid-cols-2">
        {requests.map((request) => {
          const donation = request.donationId;
          const trackingActive =
            trackingVersion >= 0 &&
            watchIds.current[request._id] !== undefined;

          const pickupCoordinates = getCoordinates(
            request.pickupLocation
          );

          const isBusy =
            trackingId === request._id ||
            actionLoading === `${request._id}-collect` ||
            actionLoading === `${request._id}-complete`;

          const statusClasses = {
            REQUESTED: "bg-amber-100 text-amber-800",
            ACCEPTED: "bg-green-100 text-green-700",
            REJECTED: "bg-red-100 text-red-700",
            PICKUP_STARTED: "bg-orange-100 text-orange-800",
            COLLECTED: "bg-blue-100 text-blue-800",
            COMPLETED: "bg-emerald-100 text-emerald-800",
          };

          return (
            <div
              key={request._id}
              className="rounded-[2rem] border border-[#171717]/10 bg-white/50 p-7"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-[#171717]/40">
                    Food Request
                  </p>
                  <h3 className="mt-2 text-2xl font-light">
                    {donation?.eventName || "Food Donation"}
                  </h3>
                </div>

                <span
                  className={`shrink-0 rounded-full px-3 py-1 text-xs ${
                    statusClasses[request.status] ||
                    "bg-[#d8c6a7] text-[#171717]"
                  }`}
                >
                  {(request.status || "REQUESTED").replace(/_/g, " ")}
                </span>
              </div>

              {donation && (
                <div className="mt-6 space-y-2 text-sm text-[#171717]/55">
                  <p>
                    <strong className="text-[#171717]">Food:</strong>{" "}
                    {donation.foodDescription}
                  </p>
                  <p>
                    <strong className="text-[#171717]">Food type:</strong>{" "}
                    {donation.foodType}
                  </p>
                  <p>
                    <strong className="text-[#171717]">Quantity:</strong>{" "}
                    {donation.quantity}
                  </p>
                  <p>
                    <strong className="text-[#171717]">Pickup:</strong>{" "}
                    {donation.pickupLocation}
                  </p>

                  {getDonationCoordinates(donation) && (
                    <a
                      href={`https://www.google.com/maps?q=${getDonationCoordinates(donation).join(",")}`}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-3 inline-block text-xs font-medium text-[#8b6f47]"
                    >
                      Open organizer's food location →
                    </a>
                  )}
                </div>
              )}

              {request.status === "REQUESTED" && (
                <div className="mt-7 rounded-xl bg-amber-50 p-4 text-sm text-amber-800">
                  Waiting for the organizer to accept your request.
                </div>
              )}

              {request.status === "ACCEPTED" && (
                <div className="mt-7">
                  <p className="mb-3 text-sm text-[#171717]/50">
                    Your request has been accepted. Start pickup to share your
                    live location.
                  </p>

                  <button
                    type="button"
                    onClick={() => startPickup(request)}
                    disabled={isBusy}
                    className="w-full rounded-full bg-[#171717] px-5 py-3 text-sm text-white disabled:opacity-50"
                  >
                    {trackingId === request._id
                      ? "Starting pickup..."
                      : "Start Pickup"}
                  </button>
                </div>
              )}

              {request.status === "PICKUP_STARTED" && (
                <div className="mt-7 space-y-3">
                  {trackingActive ? (
                    <div className="rounded-2xl bg-green-50 p-4 text-sm text-green-700">
                      <p className="font-medium">Live tracking active</p>
                      <p className="mt-1 text-xs">
                        Your GPS position is being sent to the backend.
                      </p>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => resumeTracking(request)}
                      disabled={isBusy}
                      className="w-full rounded-full border border-[#171717]/15 px-5 py-3 text-sm disabled:opacity-50"
                    >
                      Resume Live Tracking
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={() => updateRequestStatus(request, "collect")}
                    disabled={isBusy}
                    className="w-full rounded-full bg-[#171717] px-5 py-3 text-sm text-white disabled:opacity-50"
                  >
                    {actionLoading === `${request._id}-collect`
                      ? "Updating..."
                      : "Mark as Collected"}
                  </button>
                </div>
              )}

              {request.status === "COLLECTED" && (
                <div className="mt-7">
                  <p className="mb-3 rounded-xl bg-blue-50 p-4 text-sm text-blue-800">
                    Food has been collected. Complete the request when the
                    handover is finished.
                  </p>

                  <button
                    type="button"
                    onClick={() => updateRequestStatus(request, "complete")}
                    disabled={isBusy}
                    className="w-full rounded-full bg-[#171717] px-5 py-3 text-sm text-white disabled:opacity-50"
                  >
                    {actionLoading === `${request._id}-complete`
                      ? "Updating..."
                      : "Mark as Completed"}
                  </button>
                </div>
              )}

              {request.status === "COMPLETED" && (
                <div className="mt-7 rounded-xl bg-green-50 p-4 text-sm text-green-700">
                  ✓ This food request has been completed.
                </div>
              )}

              {request.status === "REJECTED" && (
                <div className="mt-7 rounded-xl bg-red-50 p-4 text-sm text-red-700">
                  This request was rejected by the organizer.
                </div>
              )}

              {pickupCoordinates && (
                <div className="mt-5 rounded-2xl border border-[#171717]/10 bg-[#f5f1e8] p-4 text-xs text-[#171717]/60">
                  <p className="font-medium text-[#171717]">
                    Last shared pickup location
                  </p>
                  <p className="mt-2">
                    Latitude: {pickupCoordinates[0]}
                  </p>
                  <p className="mt-1">
                    Longitude: {pickupCoordinates[1]}
                  </p>

                  {request.lastLocationUpdate && (
                    <p className="mt-2 text-[#171717]/40">
                      Last updated:{" "}
                      {new Date(
                        request.lastLocationUpdate
                      ).toLocaleTimeString()}
                    </p>
                  )}

                  <a
                    href={`https://www.google.com/maps?q=${pickupCoordinates.join(",")}`}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-3 inline-block font-medium text-[#8b6f47]"
                  >
                    View shared location →
                  </a>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}

/* ================= REUSABLE COMPONENTS ================= */

function DashboardButton({ children, active, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full px-5 py-3 text-sm transition ${
        active
          ? "bg-[#171717] text-white"
          : "border border-[#171717]/10 text-[#171717]/50 hover:border-[#171717]/30 hover:text-[#171717]"
      }`}
    >
      {children}
    </button>
  );
}

function DashboardCard({ symbol, title, description, action, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="group min-h-[320px] rounded-[2rem] border border-[#171717]/10 bg-white/40 p-8 text-left transition hover:-translate-y-1 hover:bg-white/70 md:p-10"
    >
      <div className="flex h-full flex-col justify-between">
        <div>
          <div className="text-5xl font-light text-[#8b6f47]">{symbol}</div>
          <h2 className="mt-16 text-3xl font-light tracking-[-0.03em]">
            {title}
          </h2>
          <p className="mt-4 max-w-sm text-sm leading-7 text-[#171717]/50">
            {description}
          </p>
        </div>
        <p className="mt-8 text-sm text-[#171717]/60 transition group-hover:text-[#171717]">
          {action}
        </p>
      </div>
    </button>
  );
}

function SectionHeading({ eyebrow, title, description }) {
  return (
    <div>
      <p className="text-xs uppercase tracking-[0.25em] text-[#171717]/40">
        {eyebrow}
      </p>
      <h2 className="mt-4 text-4xl font-light tracking-[-0.04em] md:text-6xl">
        {title}
      </h2>
      <p className="mt-4 max-w-xl text-[#171717]/50">{description}</p>
    </div>
  );
}

function MessageBox({ type = "error", children }) {
  const styles =
    type === "success"
      ? "bg-green-50 text-green-700"
      : "bg-red-50 text-red-700";

  return (
    <div className={`mt-6 rounded-xl p-4 text-sm ${styles}`}>
      {children}
    </div>
  );
}

function EmptyState({ title, description }) {
  return (
    <div className="mt-10 rounded-[2rem] border border-[#171717]/10 bg-white/50 p-10">
      <p className="text-lg">{title}</p>
      <p className="mt-2 text-sm text-[#171717]/50">{description}</p>
    </div>
  );
}

export default OrganizationDashboard;
