import { useEffect, useRef, useState } from "react";
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

const API = "http://localhost:5000";

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
    0% {
      box-shadow: 0 0 0 0 rgba(34,197,94,0.45);
    }

    70% {
      box-shadow: 0 0 0 15px rgba(34,197,94,0);
    }

    100% {
      box-shadow: 0 0 0 0 rgba(34,197,94,0);
    }
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

function MapView({
  organizationPosition,
  selectedFoodPosition,
}) {
  const map = useMap();

  useEffect(() => {
    if (
      organizationPosition &&
      selectedFoodPosition
    ) {
      const bounds = L.latLngBounds([
        organizationPosition,
        selectedFoodPosition,
      ]);

      map.fitBounds(bounds, {
        padding: [70, 70],
        maxZoom: 15,
      });

      return;
    }

    if (organizationPosition) {
      map.setView(
        organizationPosition,
        14,
        {
          animate: true,
        }
      );
    }
  }, [
    organizationPosition,
    selectedFoodPosition,
    map,
  ]);

  return null;
}

/* ================= ROUTE ================= */

function FoodRoute({ from, to }) {
  const [route, setRoute] = useState([]);
  const [routeError, setRouteError] =
    useState(false);

  useEffect(() => {
    if (!from || !to) {
      setRoute([]);
      setRouteError(false);
      return;
    }

    let cancelled = false;

    async function loadRoute() {
      try {
        setRouteError(false);

        const url =
          `https://router.project-osrm.org/route/v1/driving/` +
          `${from[1]},${from[0]};${to[1]},${to[0]}` +
          `?overview=full&geometries=geojson`;

        const response = await fetch(url);

        if (!response.ok) {
          throw new Error(
            "Route request failed."
          );
        }

        const data = await response.json();

        if (
          !cancelled &&
          data.routes?.length
        ) {
          const points =
            data.routes[0].geometry.coordinates.map(
              ([lng, lat]) => [lat, lng]
            );

          setRoute(points);
        } else if (!cancelled) {
          setRoute([]);
          setRouteError(true);
        }
      } catch (error) {
        console.error(
          "Route error:",
          error
        );

        if (!cancelled) {
          setRoute([]);
          setRouteError(true);
        }
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
  const [activeSection, setActiveSection] =
    useState("overview");

  const navigate = useNavigate();

  function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem(
      "organizationId"
    );

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
          Food<span className="text-[#8b6f47]">
            Bridge
          </span>
        </Link>

        <button
          onClick={logout}
          className="text-sm text-[#171717]/50 hover:text-[#171717]"
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
            Discover nearby food donations and
            request surplus food from organizers.
          </p>
        </section>

        <div className="mt-12 flex flex-wrap gap-3 border-b border-[#171717]/10 pb-5">
          <DashboardButton
            active={
              activeSection === "overview"
            }
            onClick={() =>
              setActiveSection("overview")
            }
          >
            Overview
          </DashboardButton>

          <DashboardButton
            active={
              activeSection === "nearby"
            }
            onClick={() =>
              setActiveSection("nearby")
            }
          >
            Nearby Food
          </DashboardButton>

          <DashboardButton
            active={
              activeSection === "requests"
            }
            onClick={() =>
              setActiveSection("requests")
            }
          >
            My Requests
          </DashboardButton>
        </div>

        <div className="mt-10">
          {activeSection === "overview" && (
            <Overview
              setActiveSection={
                setActiveSection
              }
            />
          )}

          {activeSection === "nearby" && (
            <NearbyFood />
          )}

          {activeSection === "requests" && (
            <MyRequests />
          )}
        </div>
      </div>
    </main>
  );
}

/* ================= OVERVIEW ================= */

function Overview({ setActiveSection }) {
  return (
    <section>
      <div className="grid gap-6 md:grid-cols-3">
        <DashboardCard
          symbol="◎"
          title="Nearby food"
          description="Find surplus food available near your organization."
          action="Find food →"
          onClick={() =>
            setActiveSection("nearby")
          }
        />

        <DashboardCard
          symbol="→"
          title="My requests"
          description="Track the food donations you have requested."
          action="View requests →"
          onClick={() =>
            setActiveSection("requests")
          }
        />

        <DashboardCard
          symbol="⌖"
          title="Location"
          description="Use your current location to find nearby donations."
          action="Find nearby food →"
          onClick={() =>
            setActiveSection("nearby")
          }
        />
      </div>
    </section>
  );
}

/* ================= NEARBY FOOD ================= */

function NearbyFood() {
  const [latitude, setLatitude] =
    useState(null);

  const [longitude, setLongitude] =
    useState(null);

  const [radius, setRadius] =
    useState(10000);

  const [donations, setDonations] =
    useState([]);

  const [selectedFood, setSelectedFood] =
    useState(null);

  const [loading, setLoading] =
    useState(false);

  const [locationLoading, setLocationLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  const [locationMessage, setLocationMessage] =
    useState("");

  const [requestLoading, setRequestLoading] =
    useState(null);

  const [requestMessage, setRequestMessage] =
    useState("");

  const [requestError, setRequestError] =
    useState("");

  function getCurrentLocation() {
    setLocationLoading(true);
    setError("");
    setLocationMessage("");

    if (!navigator.geolocation) {
      setError(
        "Geolocation is not supported by your browser."
      );

      setLocationLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat =
          position.coords.latitude;

        const lng =
          position.coords.longitude;

        console.log(
          "ORGANIZATION LOCATION:",
          lat,
          lng
        );

        setLatitude(lat);
        setLongitude(lng);

        setLocationMessage(
          "Your current location has been captured."
        );

        setLocationLoading(false);
      },

      (locationError) => {
        console.error(
          "LOCATION ERROR:",
          locationError
        );

        if (locationError.code === 1) {
          setError(
            "Location permission was denied. Please allow location access."
          );
        } else if (
          locationError.code === 2
        ) {
          setError(
            "Your location could not be determined."
          );
        } else if (
          locationError.code === 3
        ) {
          setError(
            "Location request timed out. Please try again."
          );
        } else {
          setError(
            "Unable to get your location."
          );
        }

        setLocationLoading(false);
      },

      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  }

  useEffect(() => {
    if (
      latitude === null ||
      longitude === null
    ) {
      return;
    }

    let cancelled = false;

    async function loadNearbyFood() {
      setLoading(true);
      setError("");

      try {
        const token =
          localStorage.getItem("token");

        if (!token) {
          throw new Error(
            "Please login as an organization."
          );
        }

        const url =
          `${API}/api/donations/nearby` +
          `?latitude=${latitude}` +
          `&longitude=${longitude}` +
          `&radius=${radius}`;

        const response = await fetch(url, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.message ||
              "Failed to load nearby food."
          );
        }

        if (!cancelled) {
          setDonations(
            Array.isArray(data)
              ? data
              : []
          );

          setSelectedFood((current) => {
            if (!current) return null;

            const stillExists =
              Array.isArray(data) &&
              data.some(
                (item) =>
                  item._id === current._id
              );

            return stillExists
              ? current
              : null;
          });
        }
      } catch (err) {
        console.error(
          "NEARBY FOOD ERROR:",
          err
        );

        if (!cancelled) {
          setError(err.message);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
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
      const token =
        localStorage.getItem("token");

      const organizationId =
        localStorage.getItem(
          "organizationId"
        );

      if (!token || !organizationId) {
        throw new Error(
          "Please login as an organization."
        );
      }

      const response = await fetch(
        `${API}/api/requests`,
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
            Authorization: `Bearer ${token}`,
          },

          body: JSON.stringify({
            donationId: donation._id,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Failed to create request."
        );
      }

      setRequestMessage(
        "Food request sent successfully."
      );

      setSelectedFood(null);

      /*
       * The donation becomes REQUESTED
       * after the request is created.
       *
       * Therefore remove it from the
       * AVAILABLE list immediately.
       */
      setDonations((current) =>
        current.filter(
          (item) =>
            item._id !== donation._id
        )
      );
    } catch (err) {
      console.error(
        "REQUEST FOOD ERROR:",
        err
      );

      setRequestError(err.message);
    } finally {
      setRequestLoading(null);
    }
  }

  const organizationPosition =
    latitude !== null &&
    longitude !== null
      ? [latitude, longitude]
      : null;

  const selectedFoodPosition =
    selectedFood?.location?.coordinates
      ?.length === 2
      ? [
          selectedFood.location.coordinates[1],
          selectedFood.location.coordinates[0],
        ]
      : null;

  return (
    <section>
      <SectionHeading
        eyebrow="Nearby"
        title="Available food."
        description="Find surplus food donations near your current location."
      />

      {/* LOCATION CONTROLS */}

      <div className="mt-10 rounded-[2rem] border border-[#171717]/10 bg-white/50 p-6 md:p-8">
        <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-medium">
              Your location
            </p>

            <p className="mt-1 text-xs leading-5 text-[#171717]/50">
              Your browser GPS location is used
              to find nearby donations.
            </p>
          </div>

          <button
            onClick={getCurrentLocation}
            disabled={locationLoading}
            className="rounded-full bg-[#171717] px-5 py-3 text-sm text-white disabled:opacity-50"
          >
            {locationLoading
              ? "Getting location..."
              : "Use my current location"}
          </button>
        </div>

        {locationMessage && (
          <div className="mt-5 rounded-xl bg-green-50 p-4 text-sm text-green-700">
            ✓ {locationMessage}
          </div>
        )}

        {organizationPosition && (
          <div className="mt-5 rounded-xl bg-[#f5f1e8] p-4 text-xs text-[#171717]/60">
            <p>
              Latitude:{" "}
              <strong className="text-[#171717]">
                {latitude.toFixed(6)}
              </strong>
            </p>

            <p className="mt-1">
              Longitude:{" "}
              <strong className="text-[#171717]">
                {longitude.toFixed(6)}
              </strong>
            </p>
          </div>
        )}

        <div className="mt-6">
          <label className="mb-2 block text-sm text-[#171717]/60">
            Search radius
          </label>

          <select
            value={radius}
            onChange={(e) =>
              setRadius(
                Number(e.target.value)
              )
            }
            className="rounded-xl border border-[#171717]/15 bg-[#f5f1e8] px-4 py-3 outline-none"
          >
            <option value={5000}>
              5 km
            </option>

            <option value={10000}>
              10 km
            </option>

            <option value={20000}>
              20 km
            </option>

            <option value={50000}>
              50 km
            </option>
          </select>
        </div>
      </div>

      {error && (
        <div className="mt-6 rounded-xl bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      {requestMessage && (
        <div className="mt-6 rounded-xl bg-green-50 p-4 text-sm text-green-700">
          ✓ {requestMessage}
        </div>
      )}

      {requestError && (
        <div className="mt-6 rounded-xl bg-red-50 p-4 text-sm text-red-700">
          {requestError}
        </div>
      )}

      {/* MAP */}

      {organizationPosition && (
        <div className="mt-10">
          <div className="mb-4">
            <p className="text-xs uppercase tracking-[0.2em] text-[#171717]/40">
              Live map
            </p>

            <p className="mt-1 text-sm text-[#171717]/50">
              Select a food marker to see the
              driving route.
            </p>
          </div>

          <div
            className="overflow-hidden rounded-[2rem] border border-[#171717]/10 bg-white"
            style={{
              height: "480px",
            }}
          >
            <MapContainer
              center={organizationPosition}
              zoom={14}
              scrollWheelZoom
              zoomControl
              style={{
                height: "100%",
                width: "100%",
              }}
            >
              <TileLayer
                attribution="&copy; OpenStreetMap contributors"
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />

              <MapView
                organizationPosition={
                  organizationPosition
                }
                selectedFoodPosition={
                  selectedFoodPosition
                }
              />

              {/* ORGANIZATION */}

              <Marker
                position={
                  organizationPosition
                }
                icon={organizationIcon}
              >
                <Popup>
                  <div className="text-center">
                    <div className="font-semibold">
                      🟢 Your organization
                    </div>

                    <div className="mt-1 text-xs text-gray-500">
                      Current GPS location
                    </div>
                  </div>
                </Popup>
              </Marker>

              {/* SEARCH RADIUS */}

              <Circle
                center={
                  organizationPosition
                }
                radius={radius}
                pathOptions={{
                  color: "#8b6f47",
                  weight: 1.5,
                  fillColor: "#8b6f47",
                  fillOpacity: 0.06,
                }}
              />

              {/* FOOD MARKERS */}

              {donations.map((donation) => {
                const coordinates =
                  donation.location
                    ?.coordinates;

                if (
                  !coordinates ||
                  coordinates.length !== 2
                ) {
                  return null;
                }

                const [lng, lat] =
                  coordinates;

                return (
                  <Marker
                    key={donation._id}
                    position={[lat, lng]}
                    icon={foodIcon}
                    eventHandlers={{
                      click: () =>
                        setSelectedFood(
                          donation
                        ),
                    }}
                  >
                    <Popup>
                      <div className="min-w-[200px]">
                        <div className="flex items-center gap-2">
                          <span className="text-xl">
                            🍲
                          </span>

                          <strong>
                            {donation.eventName}
                          </strong>
                        </div>

                        <p className="mt-2 text-xs text-gray-500">
                          {
                            donation.foodDescription
                          }
                        </p>

                        {donation.distanceKm !==
                          undefined && (
                          <p className="mt-2 text-xs">
                            Distance:{" "}
                            {
                              donation.distanceKm
                            }{" "}
                            km
                          </p>
                        )}

                        <button
                          type="button"
                          onClick={() =>
                            setSelectedFood(
                              donation
                            )
                          }
                          className="mt-3 text-xs font-medium text-orange-600"
                        >
                          Show route →
                        </button>
                      </div>
                    </Popup>
                  </Marker>
                );
              })}

              {/* ROUTE */}

              {selectedFoodPosition && (
                <FoodRoute
                  from={
                    organizationPosition
                  }
                  to={selectedFoodPosition}
                />
              )}
            </MapContainer>
          </div>
        </div>
      )}

      {/* SELECTED FOOD */}

      {selectedFood && (
        <div className="mt-5 rounded-[2rem] border border-orange-200 bg-orange-50/60 p-6">
          <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-orange-600">
                Selected food
              </p>

              <p className="mt-2 text-xl font-medium">
                🍲 {selectedFood.eventName}
              </p>

              <p className="mt-1 text-sm text-[#171717]/50">
                Route from your current location
                to the organizer's food location
                is shown on the map.
              </p>

              {selectedFood.location
                ?.coordinates?.length === 2 && (
                <a
                  href={`https://www.google.com/maps?q=${selectedFood.location.coordinates[1]},${selectedFood.location.coordinates[0]}`}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-4 inline-block text-sm font-medium text-[#8b6f47]"
                >
                  Open food location →
                </a>
              )}
            </div>

            <button
              type="button"
              onClick={() =>
                setSelectedFood(null)
              }
              className="rounded-full border border-[#171717]/10 px-5 py-2 text-sm"
            >
              Clear route
            </button>
          </div>
        </div>
      )}

      {/* DONATIONS */}

      <div className="mt-10">
        {loading && (
          <p className="text-[#171717]/50">
            Finding nearby food...
          </p>
        )}

        {!loading &&
          organizationPosition &&
          donations.length === 0 && (
            <div className="rounded-[2rem] border border-[#171717]/10 bg-white/50 p-10">
              <p className="text-lg">
                No available food found nearby.
              </p>

              <p className="mt-2 text-sm text-[#171717]/50">
                Try increasing the search radius.
              </p>
            </div>
          )}

        {!organizationPosition &&
          !loading && (
            <div className="rounded-[2rem] border border-[#171717]/10 bg-white/50 p-10">
              <p className="text-lg">
                Location required.
              </p>

              <p className="mt-2 text-sm text-[#171717]/50">
                Click "Use my current location" to
                find nearby food.
              </p>
            </div>
          )}

        <div className="grid gap-5 md:grid-cols-2">
          {donations.map((donation) => {
            const coordinates =
              donation.location?.coordinates;

            return (
              <div
                key={donation._id}
                className={`rounded-[2rem] border bg-white/50 p-7 transition ${
                  selectedFood?._id ===
                  donation._id
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
                    AVAILABLE
                  </span>
                </div>

                <div className="mt-6 space-y-2 text-sm text-[#171717]/55">
                  <p>
                    <strong className="text-[#171717]">
                      Event:
                    </strong>{" "}
                    {donation.eventType}
                  </p>

                  <p>
                    <strong className="text-[#171717]">
                      Food:
                    </strong>{" "}
                    {donation.foodDescription}
                  </p>

                  <p>
                    <strong className="text-[#171717]">
                      Food type:
                    </strong>{" "}
                    {donation.foodType}
                  </p>

                  <p>
                    <strong className="text-[#171717]">
                      Quantity:
                    </strong>{" "}
                    {donation.quantity}
                  </p>

                  <p>
                    <strong className="text-[#171717]">
                      Pickup:
                    </strong>{" "}
                    {donation.pickupLocation}
                  </p>

                  {donation.distanceKm !==
                    undefined && (
                    <p>
                      <strong className="text-[#171717]">
                        Distance:
                      </strong>{" "}
                      {donation.distanceKm} km
                    </p>
                  )}
                </div>

                {coordinates?.length === 2 && (
                  <div className="mt-5 rounded-2xl bg-[#f5f1e8] p-4">
                    <p className="text-sm font-medium">
                      📍 Food location
                    </p>

                    <a
                      href={`https://www.google.com/maps?q=${coordinates[1]},${coordinates[0]}`}
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
                    onClick={() =>
                      setSelectedFood(
                        donation
                      )
                    }
                    className="flex-1 rounded-full border border-[#171717]/15 px-5 py-3 text-sm"
                  >
                    View on Map
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      requestFood(
                        donation
                      )
                    }
                    disabled={
                      requestLoading ===
                      donation._id
                    }
                    className="flex-1 rounded-full bg-[#171717] px-5 py-3 text-sm text-white disabled:opacity-50"
                  >
                    {requestLoading ===
                    donation._id
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
  const [requests, setRequests] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [trackingId, setTrackingId] =
    useState(null);

  const [trackingMessage, setTrackingMessage] =
    useState("");

  const [trackingError, setTrackingError] =
    useState("");

  const watchIds = useRef({});

  /* ================= CLEANUP GPS ================= */

  useEffect(() => {
    return () => {
      Object.values(
        watchIds.current
      ).forEach((watchId) => {
        navigator.geolocation.clearWatch(
          watchId
        );
      });

      watchIds.current = {};
    };
  }, []);

  /* ================= LOAD REQUESTS ================= */

  async function loadRequests() {
    try {
      setLoading(true);
      setError("");

      const token =
        localStorage.getItem("token");

      const organizationId =
        localStorage.getItem(
          "organizationId"
        );

      if (!token || !organizationId) {
        throw new Error(
          "Please login as an organization."
        );
      }

      const response = await fetch(
        `${API}/api/requests/organization/${organizationId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Failed to load requests."
        );
      }

      setRequests(
        Array.isArray(data) ? data : []
      );
    } catch (err) {
      console.error(
        "LOAD REQUESTS ERROR:",
        err
      );

      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadRequests();
  }, []);

  /* ================= SEND LOCATION ================= */

  async function sendLocation(
    requestId,
    latitude,
    longitude
  ) {
    const token =
      localStorage.getItem("token");

    if (!token) {
      throw new Error(
        "Please login again."
      );
    }

    const response = await fetch(
      `${API}/api/requests/${requestId}/location`,
      {
        method: "PATCH",

        headers: {
          "Content-Type":
            "application/json",
          Authorization: `Bearer ${token}`,
        },

        body: JSON.stringify({
          latitude,
          longitude,
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.message ||
          "Failed to update location."
      );
    }

    setRequests((current) =>
      current.map((item) =>
        item._id === requestId
          ? {
              ...item,
              pickupLocation: {
                type: "Point",
                coordinates: [
                  longitude,
                  latitude,
                ],
              },
              lastLocationUpdate:
                new Date().toISOString(),
            }
          : item
      )
    );
  }

  /* ================= LIVE TRACKING ================= */

  function startLiveTracking(requestId) {
    if (
      watchIds.current[requestId] !==
      undefined
    ) {
      return;
    }

    if (!navigator.geolocation) {
      setTrackingError(
        "Geolocation is not supported by your browser."
      );
      return;
    }

    const watchId =
      navigator.geolocation.watchPosition(
        async (position) => {
          try {
            await sendLocation(
              requestId,
              position.coords.latitude,
              position.coords.longitude
            );

            setTrackingError("");
          } catch (error) {
            console.error(
              "LIVE LOCATION ERROR:",
              error
            );

            setTrackingError(
              error.message
            );
          }
        },

        (locationError) => {
          console.error(
            "GPS WATCH ERROR:",
            locationError
          );

          if (
            locationError.code === 1
          ) {
            setTrackingError(
              "Location permission was denied. Live tracking stopped."
            );
          } else if (
            locationError.code === 2
          ) {
            setTrackingError(
              "Your location could not be determined."
            );
          } else if (
            locationError.code === 3
          ) {
            setTrackingError(
              "GPS update timed out. Trying again..."
            );
          } else {
            setTrackingError(
              "Live location could not be updated."
            );
          }
        },

        {
          enableHighAccuracy: true,
          maximumAge: 5000,
          timeout: 10000,
        }
      );

    watchIds.current[requestId] =
      watchId;
  }

  /* ================= START PICKUP ================= */

  function startPickup(request) {
    setTrackingError("");
    setTrackingMessage("");

    if (!navigator.geolocation) {
      setTrackingError(
        "Geolocation is not supported by your browser."
      );
      return;
    }

    if (
      watchIds.current[request._id] !==
      undefined
    ) {
      setTrackingMessage(
        "Live tracking is already active."
      );
      return;
    }

    setTrackingId(request._id);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const latitude =
            position.coords.latitude;

          const longitude =
            position.coords.longitude;

          const token =
            localStorage.getItem("token");

          if (!token) {
            throw new Error(
              "Please login again."
            );
          }

          const response = await fetch(
            `${API}/api/requests/${request._id}/start-pickup`,
            {
              method: "PATCH",

              headers: {
                "Content-Type":
                  "application/json",
                Authorization: `Bearer ${token}`,
              },

              body: JSON.stringify({
                latitude,
                longitude,
              }),
            }
          );

          const data =
            await response.json();

          if (!response.ok) {
            throw new Error(
              data.message ||
                "Failed to start pickup."
            );
          }

          setRequests((current) =>
            current.map((item) =>
              item._id === request._id
                ? {
                    ...item,
                    pickupStartedAt:
                      data.request
                        ?.pickupStartedAt ||
                      new Date().toISOString(),
                    pickupLocation: {
                      type: "Point",
                      coordinates: [
                        longitude,
                        latitude,
                      ],
                    },
                    lastLocationUpdate:
                      new Date().toISOString(),
                  }
                : item
            )
          );

          setTrackingMessage(
            "Pickup started. Live location tracking is active."
          );

          startLiveTracking(
            request._id
          );
        } catch (error) {
          console.error(
            "START PICKUP ERROR:",
            error
          );

          setTrackingError(
            error.message
          );
        } finally {
          setTrackingId(null);
        }
      },

      (locationError) => {
        console.error(
          "START PICKUP LOCATION ERROR:",
          locationError
        );

        setTrackingId(null);

        if (locationError.code === 1) {
          setTrackingError(
            "Location permission was denied."
          );
        } else if (
          locationError.code === 2
        ) {
          setTrackingError(
            "Your location could not be determined."
          );
        } else if (
          locationError.code === 3
        ) {
          setTrackingError(
            "Location request timed out."
          );
        } else {
          setTrackingError(
            "Unable to get your current location."
          );
        }
      },

      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  }

  /* ================= RESUME TRACKING ================= */

  function resumeTracking(request) {
    setTrackingError("");

    setTrackingMessage(
      "Live location tracking resumed."
    );

    startLiveTracking(request._id);
  }

  return (
    <section>
      <SectionHeading
        eyebrow="Your activity"
        title="My requests."
        description="Track food donations requested by your organization."
      />

      {trackingMessage && (
        <div className="mt-6 rounded-xl bg-green-50 p-4 text-sm text-green-700">
          ✓ {trackingMessage}
        </div>
      )}

      {trackingError && (
        <div className="mt-6 rounded-xl bg-red-50 p-4 text-sm text-red-700">
          {trackingError}
        </div>
      )}

      {loading && (
        <p className="mt-10 text-[#171717]/50">
          Loading requests...
        </p>
      )}

      {error && (
        <p className="mt-10 rounded-xl bg-red-50 p-4 text-sm text-red-700">
          {error}
        </p>
      )}

      {!loading &&
        !error &&
        requests.length === 0 && (
          <div className="mt-10 rounded-[2rem] border border-[#171717]/10 bg-white/50 p-10">
            <p className="text-lg">
              No requests yet.
            </p>

            <p className="mt-2 text-sm text-[#171717]/50">
              Food requests from your organization
              will appear here.
            </p>
          </div>
        )}

      <div className="mt-10 grid gap-5 md:grid-cols-2">
        {requests.map((request) => {
          const donation =
            request.donationId;

          const foodCoordinates =
            donation?.location?.coordinates;

          const trackingActive =
            watchIds.current[
              request._id
            ] !== undefined;

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
                    {donation?.eventName ||
                      "Food Donation"}
                  </h3>
                </div>

                <span
                  className={`shrink-0 rounded-full px-3 py-1 text-xs ${
                    request.status ===
                    "ACCEPTED"
                      ? "bg-green-100 text-green-700"
                      : request.status ===
                        "REJECTED"
                      ? "bg-red-100 text-red-700"
                      : "bg-[#d8c6a7]"
                  }`}
                >
                  {request.status}
                </span>
              </div>

              {donation && (
                <div className="mt-6 space-y-2 text-sm text-[#171717]/55">
                  <p>
                    <strong className="text-[#171717]">
                      Food:
                    </strong>{" "}
                    {
                      donation.foodDescription
                    }
                  </p>

                  <p>
                    <strong className="text-[#171717]">
                      Food type:
                    </strong>{" "}
                    {donation.foodType}
                  </p>

                  <p>
                    <strong className="text-[#171717]">
                      Quantity:
                    </strong>{" "}
                    {donation.quantity}
                  </p>

                  <p>
                    <strong className="text-[#171717]">
                      Pickup:
                    </strong>{" "}
                    {donation.pickupLocation}
                  </p>

                  {foodCoordinates?.length ===
                    2 && (
                    <div className="mt-4 rounded-2xl bg-[#f5f1e8] p-4">
                      <p className="font-medium text-[#171717]">
                        📍 Organizer food location
                      </p>

                      <p className="mt-2 text-xs text-[#171717]/50">
                        This is where the food is
                        available.
                      </p>

                      <a
                        href={`https://www.google.com/maps?q=${foodCoordinates[1]},${foodCoordinates[0]}`}
                        target="_blank"
                        rel="noreferrer"
                        className="mt-3 inline-block text-xs font-medium text-[#8b6f47]"
                      >
                        Open food location →
                      </a>
                    </div>
                  )}
                </div>
              )}

              {/* ACCEPTED */}

              {request.status ===
                "ACCEPTED" && (
                <div className="mt-7">
                  {!request.pickupStartedAt ? (
                    <button
                      type="button"
                      onClick={() =>
                        startPickup(
                          request
                        )
                      }
                      disabled={
                        trackingId ===
                        request._id
                      }
                      className="w-full rounded-full bg-[#171717] px-5 py-3 text-sm text-white disabled:opacity-50"
                    >
                      {trackingId ===
                      request._id
                        ? "Starting pickup..."
                        : "Start Pickup"}
                    </button>
                  ) : trackingActive ? (
                    <div className="rounded-2xl bg-green-50 p-4 text-sm text-green-700">
                      <p className="font-medium">
                        🟢 Live tracking active
                      </p>

                      <p className="mt-1 text-xs">
                        Your current GPS location
                        is being shared with the
                        organizer.
                      </p>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() =>
                        resumeTracking(
                          request
                        )
                      }
                      className="w-full rounded-full bg-[#171717] px-5 py-3 text-sm text-white"
                    >
                      Resume Live Tracking
                    </button>
                  )}
                </div>
              )}

              {/* CURRENT ORGANIZATION LOCATION */}

              {request.pickupLocation
                ?.coordinates?.length ===
                2 && (
                <div className="mt-5 rounded-2xl border border-[#171717]/10 bg-[#f5f1e8] p-4 text-xs text-[#171717]/60">
                  <p className="font-medium text-[#171717]">
                    Your current pickup location
                  </p>

                  <p className="mt-2">
                    Latitude:{" "}
                    {
                      request
                        .pickupLocation
                        .coordinates[1]
                    }
                  </p>

                  <p className="mt-1">
                    Longitude:{" "}
                    {
                      request
                        .pickupLocation
                        .coordinates[0]
                    }
                  </p>

                  {request.lastLocationUpdate && (
                    <p className="mt-2 text-[#171717]/40">
                      Last updated:{" "}
                      {new Date(
                        request.lastLocationUpdate
                      ).toLocaleTimeString()}
                    </p>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}

/* ================= SMALL COMPONENTS ================= */

function DashboardButton({
  children,
  active,
  onClick,
}) {
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

function DashboardCard({
  symbol,
  title,
  description,
  action,
  onClick,
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="group min-h-[320px] rounded-[2rem] border border-[#171717]/10 bg-white/40 p-8 text-left transition hover:-translate-y-1 hover:bg-white/70 md:p-10"
    >
      <div className="flex h-full flex-col justify-between">
        <div>
          <div className="text-5xl font-light text-[#8b6f47]">
            {symbol}
          </div>

          <h2 className="mt-16 text-3xl font-light tracking-[-0.03em]">
            {title}
          </h2>

          <p className="mt-4 max-w-sm text-sm leading-7 text-[#171717]/50">
            {description}
          </p>
        </div>

        <p className="mt-8 text-sm text-[#171717]/60">
          {action}
        </p>
      </div>
    </button>
  );
}

function SectionHeading({
  eyebrow,
  title,
  description,
}) {
  return (
    <div>
      <p className="text-xs uppercase tracking-[0.25em] text-[#171717]/40">
        {eyebrow}
      </p>

      <h2 className="mt-4 text-4xl font-light tracking-[-0.04em] md:text-6xl">
        {title}
      </h2>

      <p className="mt-4 max-w-xl text-[#171717]/50">
        {description}
      </p>
    </div>
  );
}

export default OrganizationDashboard;