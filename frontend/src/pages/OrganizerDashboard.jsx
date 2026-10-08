import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import {
  MapContainer,
  TileLayer,
  Marker,
  useMap,
  useMapEvents,
} from "react-leaflet";

import L from "leaflet";
import "leaflet/dist/leaflet.css";

const API = "http://localhost:5000";

/* ================= LEAFLET ICON ================= */

const markerIcon = new L.Icon({
  iconUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",

  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",

  shadowUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",

  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

/* ================= AUTH ================= */

function authHeaders() {
  const token = localStorage.getItem("token");

  if (!token) {
    throw new Error("Please login again.");
  }

  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
}

/* ================= MAP HELPERS ================= */

function MapCenter({ location }) {
  const map = useMap();

  useEffect(() => {
    if (!location) return;

    map.setView(
      [location.latitude, location.longitude],
      15
    );
  }, [location, map]);

  return null;
}

function MapClick({ onSelect }) {
  useMapEvents({
    click(e) {
      onSelect({
        latitude: e.latlng.lat,
        longitude: e.latlng.lng,
      });
    },
  });

  return null;
}

/* ================= DASHBOARD ================= */

function OrganizerDashboard() {
  const [section, setSection] = useState("overview");
  const navigate = useNavigate();

  function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("organizerId");
    navigate("/auth");
  }

  return (
    <main className="min-h-screen bg-[#f5f1e8] text-[#171717]">
      <nav className="flex items-center justify-between border-b border-[#171717]/10 px-6 py-6 md:px-12">
        <Link
          to="/"
          className="text-2xl font-semibold"
        >
          Food<span className="text-[#8b6f47]">Bridge</span>
        </Link>

        <button
          onClick={logout}
          className="text-sm text-[#171717]/50 hover:text-[#171717]"
        >
          Logout
        </button>
      </nav>

      <div className="mx-auto max-w-7xl px-6 py-12 md:px-12">
        <p className="text-xs uppercase tracking-[0.3em] text-[#171717]/40">
          Organizer
        </p>

        <h1 className="mt-5 text-5xl font-light md:text-7xl">
          Your dashboard.
        </h1>

        <p className="mt-6 max-w-xl text-lg text-[#171717]/55">
          Share surplus food, manage donations and respond
          to organizations requesting food.
        </p>

        <div className="mt-12 flex flex-wrap gap-3 border-b border-[#171717]/10 pb-5">
          {[
            "overview",
            "post",
            "donations",
            "requests",
          ].map((item) => (
            <DashboardButton
              key={item}
              active={section === item}
              onClick={() => setSection(item)}
            >
              {item === "post"
                ? "Post Food"
                : item === "donations"
                ? "My Donations"
                : item.charAt(0).toUpperCase() +
                  item.slice(1)}
            </DashboardButton>
          ))}
        </div>

        <div className="mt-10">
          {section === "overview" && (
            <Overview setSection={setSection} />
          )}

          {section === "post" && <PostFood />}

          {section === "donations" && (
            <MyDonations />
          )}

          {section === "requests" && <Requests />}
        </div>
      </div>
    </main>
  );
}

/* ================= OVERVIEW ================= */

function Overview({ setSection }) {
  const cards = [
    [
      "+",
      "Post food",
      "Share surplus food with nearby organizations.",
      "post",
    ],
    [
      "○",
      "My donations",
      "View your posted food donations.",
      "donations",
    ],
    [
      "✓",
      "Requests",
      "Manage food requests from organizations.",
      "requests",
    ],
  ];

  return (
    <div className="grid gap-6 md:grid-cols-3">
      {cards.map(
        ([symbol, title, description, cardSection]) => (
          <button
            key={title}
            onClick={() => setSection(cardSection)}
            className="min-h-[280px] rounded-[2rem] border border-[#171717]/10 bg-white/40 p-8 text-left transition hover:-translate-y-1"
          >
            <div className="text-5xl text-[#8b6f47]">
              {symbol}
            </div>

            <h2 className="mt-12 text-3xl font-light">
              {title}
            </h2>

            <p className="mt-4 text-sm leading-7 text-[#171717]/50">
              {description}
            </p>

            <p className="mt-8 text-sm text-[#171717]/60">
              Open →
            </p>
          </button>
        )
      )}
    </div>
  );
}

/* ================= POST FOOD ================= */

function PostFood() {
  const [form, setForm] = useState({
    eventName: "",
    eventType: "",
    foodDescription: "",
    foodType: "",
    quantity: "",
    availableFrom: "",
    availableUntil: "",
    pickupLocation: "",
  });

  const [location, setLocation] = useState(null);

  const [searchLocation, setSearchLocation] =
    useState("");

  const [searchLoading, setSearchLoading] =
    useState(false);

  const [locationLoading, setLocationLoading] =
    useState(false);

  const [loading, setLoading] = useState(false);

  const [message, setMessage] = useState("");

  const [error, setError] = useState("");

  function change(e) {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  }

  /* ================= SEARCH LOCATION ================= */

  async function searchMapLocation() {
    const query = searchLocation.trim();

    if (!query) {
      setError("Please enter a location to search.");
      return;
    }

    setSearchLoading(true);
    setError("");
    setMessage("");

    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          query
        )}&limit=1`
      );

      if (!response.ok) {
        throw new Error(
          "Unable to search for this location."
        );
      }

      const results = await response.json();

      if (!results.length) {
        throw new Error(
          "Location not found. Try a more specific place."
        );
      }

      const result = results[0];

      const selectedLocation = {
        latitude: Number(result.lat),
        longitude: Number(result.lon),
      };

      setLocation(selectedLocation);

      setForm((current) => ({
        ...current,
        pickupLocation: result.display_name,
      }));
    } catch (err) {
      setError(err.message);
    } finally {
      setSearchLoading(false);
    }
  }

  /* ================= CURRENT LOCATION ================= */

  function getLocation() {
    setLocationLoading(true);
    setError("");

    if (!navigator.geolocation) {
      setError(
        "Geolocation is not supported by this browser."
      );

      setLocationLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const selectedLocation = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        };

        setLocation(selectedLocation);

        /*
         * Try to get a readable address for the
         * current GPS location.
         */
        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${selectedLocation.latitude}&lon=${selectedLocation.longitude}`
          );

          const data = await response.json();

          if (data.display_name) {
            setForm((current) => ({
              ...current,
              pickupLocation: data.display_name,
            }));
          }
        } catch {
          // GPS still works even if address lookup fails.
        }

        setLocationLoading(false);
      },
      () => {
        setError(
          "Unable to get your current location."
        );

        setLocationLoading(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
      }
    );
  }

  /* ================= MAP LOCATION SELECT ================= */

  function selectMapLocation(selectedLocation) {
    setLocation(selectedLocation);

    setMessage("");

    setError("");

    /*
     * The organizer can click anywhere on the map.
     * The exact coordinates are saved.
     */
    setForm((current) => ({
      ...current,
      pickupLocation: `Selected location (${selectedLocation.latitude.toFixed(
        6
      )}, ${selectedLocation.longitude.toFixed(6)})`,
    }));
  }

  /* ================= MARKER DRAG ================= */

  function handleMarkerDrag(e) {
    const position = e.target.getLatLng();

    const selectedLocation = {
      latitude: position.lat,
      longitude: position.lng,
    };

    setLocation(selectedLocation);

    setForm((current) => ({
      ...current,
      pickupLocation: `Selected location (${position.lat.toFixed(
        6
      )}, ${position.lng.toFixed(6)})`,
    }));
  }

  /* ================= SUBMIT ================= */

  async function submit(e) {
    e.preventDefault();

    setLoading(true);
    setMessage("");
    setError("");

    try {
      if (!localStorage.getItem("token")) {
        throw new Error(
          "Please login as organizer."
        );
      }

      if (!location) {
        throw new Error(
          "Please select the food pickup location on the map."
        );
      }

      if (!form.pickupLocation.trim()) {
        throw new Error(
          "Please enter or select a pickup location."
        );
      }

      const response = await fetch(
        `${API}/api/donations`,
        {
          method: "POST",
          headers: authHeaders(),
          body: JSON.stringify({
            ...form,
            quantity: Number(form.quantity),

            /*
             * IMPORTANT:
             * These coordinates belong to the
             * FOOD PICKUP LOCATION.
             *
             * They are NOT automatically the
             * organizer's current location.
             */
            latitude: location.latitude,
            longitude: location.longitude,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Failed to post donation."
        );
      }

      setMessage(
        "Food donation posted successfully."
      );

      setForm({
        eventName: "",
        eventType: "",
        foodDescription: "",
        foodType: "",
        quantity: "",
        availableFrom: "",
        availableUntil: "",
        pickupLocation: "",
      });

      setSearchLocation("");

      setLocation(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="max-w-4xl">
      <SectionHeading
        eyebrow="New donation"
        title="Post surplus food."
        description="Choose the exact location where organizations can collect the food."
      />

      <form
        onSubmit={submit}
        className="mt-10 rounded-[2rem] border border-[#171717]/10 bg-white/50 p-6 md:p-10"
      >
        <Input
          label="Event Name"
          name="eventName"
          value={form.eventName}
          onChange={change}
          required
        />

        <Input
          label="Event Type"
          name="eventType"
          value={form.eventType}
          onChange={change}
          required
        />

        <Input
          label="Food Description"
          name="foodDescription"
          value={form.foodDescription}
          onChange={change}
          required
        />

        <div className="mb-5">
          <label className="mb-2 block text-sm text-[#171717]/60">
            Food Type
          </label>

          <select
            name="foodType"
            value={form.foodType}
            onChange={change}
            required
            className="w-full rounded-xl border border-[#171717]/15 bg-[#f5f1e8] px-4 py-3"
          >
            <option value="">
              Select food type
            </option>

            <option value="vegetarian">
              Vegetarian
            </option>

            <option value="non_vegetarian">
              Non-vegetarian
            </option>

            <option value="both">
              Both
            </option>
          </select>
        </div>

        <Input
          label="Quantity"
          name="quantity"
          type="number"
          value={form.quantity}
          onChange={change}
          required
        />

        <Input
          label="Available From"
          name="availableFrom"
          type="datetime-local"
          value={form.availableFrom}
          onChange={change}
          required
        />

        <Input
          label="Available Until"
          name="availableUntil"
          type="datetime-local"
          value={form.availableUntil}
          onChange={change}
          required
        />

        {/* ================= LOCATION ================= */}

        <div className="mb-6">
          <label className="mb-2 block text-sm text-[#171717]/60">
            Pickup Location
          </label>

          <div className="flex flex-col gap-3 md:flex-row">
            <input
              type="text"
              value={searchLocation}
              onChange={(e) =>
                setSearchLocation(e.target.value)
              }
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  searchMapLocation();
                }
              }}
              placeholder="Search Goregaon, Mumbai"
              className="flex-1 rounded-xl border border-[#171717]/15 bg-[#f5f1e8] px-4 py-3 outline-none"
            />

            <button
              type="button"
              onClick={searchMapLocation}
              disabled={searchLoading}
              className="rounded-xl bg-[#171717] px-6 py-3 text-sm text-white disabled:opacity-50"
            >
              {searchLoading
                ? "Searching..."
                : "Search"}
            </button>
          </div>

          <p className="mt-2 text-xs text-[#171717]/45">
            Search for the place where the food can be
            collected.
          </p>
        </div>

        {/* ================= MAP ================= */}

        <div className="overflow-hidden rounded-2xl border border-[#171717]/10">
          <MapContainer
            center={[19.076, 72.8777]}
            zoom={11}
            scrollWheelZoom={true}
            className="h-[400px] w-full"
          >
            <TileLayer
              attribution='&copy; OpenStreetMap contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            <MapClick
              onSelect={selectMapLocation}
            />

            <MapCenter location={location} />

            {location && (
              <Marker
                position={[
                  location.latitude,
                  location.longitude,
                ]}
                icon={markerIcon}
                draggable={true}
                eventHandlers={{
                  dragend: handleMarkerDrag,
                }}
              />
            )}
          </MapContainer>
        </div>

        {/* ================= MAP INSTRUCTIONS ================= */}

        <div className="mt-4 rounded-2xl bg-[#f5f1e8] p-5">
          <p className="text-sm font-medium">
            📍 Select food pickup location
          </p>

          <p className="mt-2 text-xs leading-6 text-[#171717]/50">
            Search for a place, click anywhere on the
            map, or drag the marker to the exact pickup
            location.
          </p>

          <button
            type="button"
            onClick={getLocation}
            disabled={locationLoading}
            className="mt-4 rounded-full bg-[#171717] px-5 py-3 text-sm text-white disabled:opacity-50"
          >
            {locationLoading
              ? "Getting location..."
              : "Use my current location"}
          </button>

          {location && (
            <div className="mt-4 rounded-xl bg-white p-4">
              <p className="text-sm font-medium">
                ✓ Pickup location selected
              </p>

              <p className="mt-2 text-xs text-[#171717]/50">
                {form.pickupLocation}
              </p>

              <div className="mt-3 grid gap-2 text-xs text-[#171717]/60 md:grid-cols-2">
                <p>
                  Latitude:{" "}
                  {location.latitude.toFixed(6)}
                </p>

                <p>
                  Longitude:{" "}
                  {location.longitude.toFixed(6)}
                </p>
              </div>
            </div>
          )}
        </div>

        {error && (
          <p className="mt-5 rounded-xl bg-red-50 p-4 text-sm text-red-700">
            {error}
          </p>
        )}

        {message && (
          <p className="mt-5 rounded-xl bg-green-50 p-4 text-sm text-green-700">
            {message}
          </p>
        )}

        <button
          disabled={loading}
          className="mt-6 w-full rounded-full bg-[#171717] px-6 py-4 text-sm text-white disabled:opacity-50"
        >
          {loading
            ? "Posting..."
            : "Post donation →"}
        </button>
      </form>
    </section>
  );
}

/* ================= MY DONATIONS ================= */

function MyDonations() {
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function load() {
      try {
        const id =
          localStorage.getItem("organizerId");

        if (
          !id ||
          !localStorage.getItem("token")
        ) {
          throw new Error(
            "Please login as organizer."
          );
        }

        const response = await fetch(
          `${API}/api/donations/organizer/${id}`,
          {
            headers: authHeaders(),
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.message ||
              "Failed to load donations."
          );
        }

        setDonations(data);
      } catch (err) {
        console.error(err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  return (
    <section>
      <SectionHeading
        eyebrow="Your activity"
        title="My donations."
        description="Food donations posted by your account."
      />

      {loading && (
        <p className="mt-10 text-[#171717]/50">
          Loading...
        </p>
      )}

      {error && (
        <p className="mt-10 rounded-xl bg-red-50 p-4 text-sm text-red-700">
          {error}
        </p>
      )}

      {!loading &&
        !error &&
        donations.length === 0 && (
          <p className="mt-10 text-[#171717]/50">
            No donations yet.
          </p>
        )}

      <div className="mt-10 grid gap-5 md:grid-cols-2">
        {donations.map((donation) => {
          const coordinates =
            donation.location?.coordinates;

          return (
            <div
              key={donation._id}
              className="rounded-[2rem] border border-[#171717]/10 bg-white/50 p-7"
            >
              <div className="flex justify-between gap-4">
                <h3 className="text-2xl font-light">
                  {donation.eventName}
                </h3>

                <span className="rounded-full bg-[#d8c6a7] px-3 py-1 text-xs">
                  {donation.status}
                </span>
              </div>

              <div className="mt-5 space-y-2 text-sm text-[#171717]/55">
                <p>
                  Food: {donation.foodDescription}
                </p>

                <p>
                  Type: {donation.foodType}
                </p>

                <p>
                  Quantity: {donation.quantity}
                </p>

                <p>
                  Pickup: {donation.pickupLocation}
                </p>
              </div>

              {coordinates?.length === 2 && (
                <div className="mt-5 rounded-2xl bg-[#f5f1e8] p-4">
                  <p className="text-sm font-medium">
                    📍 Food GPS location
                  </p>

                  <p className="mt-2 text-xs text-[#171717]/50">
                    This is the location organizations
                    use to find your food.
                  </p>

                  <p className="mt-3 text-xs text-[#171717]/60">
                    Latitude: {coordinates[1]}
                  </p>

                  <p className="mt-1 text-xs text-[#171717]/60">
                    Longitude: {coordinates[0]}
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
            </div>
          );
        })}
      </div>
    </section>
  );
}

/* ================= REQUESTS ================= */

function Requests() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [tracking, setTracking] = useState({});
  const [selectedTracking, setSelectedTracking] =
    useState(null);

  useEffect(() => {
    async function load() {
      try {
        const id =
          localStorage.getItem("organizerId");

        if (
          !id ||
          !localStorage.getItem("token")
        ) {
          throw new Error(
            "Please login as organizer."
          );
        }

        const response = await fetch(
          `${API}/api/requests/organizer/${id}`,
          {
            headers: authHeaders(),
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.message ||
              "Failed to load requests."
          );
        }

        setRequests(data);
      } catch (err) {
        console.error(err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  async function updateRequest(id, action) {
    try {
      const response = await fetch(
        `${API}/api/requests/${id}/${action}`,
        {
          method: "PATCH",
          headers: authHeaders(),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Action failed."
        );
      }

      setRequests((items) =>
        items.map((item) =>
          item._id === id
            ? {
                ...item,
                status:
                  data.request.status,
                acceptedAt:
                  data.request.acceptedAt,
              }
            : item
        )
      );
    } catch (err) {
      alert(err.message);
    }
  }

  async function loadTracking(requestId) {
    try {
      const response = await fetch(
        `${API}/api/requests/${requestId}/tracking`,
        {
          headers: authHeaders(),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Failed to load tracking."
        );
      }

      setTracking((current) => ({
        ...current,
        [requestId]:
          data.request || data,
      }));

      setSelectedTracking(requestId);
    } catch (err) {
      alert(err.message);
    }
  }

  return (
    <section>
      <SectionHeading
        eyebrow="Incoming"
        title="Food requests."
        description="Organizations requesting your surplus food."
      />

      {loading && (
        <p className="mt-10 text-[#171717]/50">
          Loading...
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
          <p className="mt-10 text-[#171717]/50">
            No requests yet.
          </p>
        )}

      <div className="mt-10 grid gap-5 md:grid-cols-2">
        {requests.map((request) => {
          const organization =
            request.organizationId;

          const food = request.donationId;

          const foodCoordinates =
            food?.location?.coordinates;

          const trackingData =
            tracking[request._id];

          const liveCoordinates =
            trackingData?.pickupLocation
              ?.coordinates ||
            request.pickupLocation
              ?.coordinates;

          return (
            <div
              key={request._id}
              className="rounded-[2rem] border border-[#171717]/10 bg-white/50 p-7"
            >
              <div className="flex justify-between gap-4">
                <h3 className="text-2xl font-light">
                  {organization?.organizationName ||
                    "Organization"}
                </h3>

                <span
                  className={`rounded-full px-3 py-1 text-xs ${
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

              {/* ORGANIZATION DETAILS */}

              <div className="mt-6 space-y-2 text-sm text-[#171717]/60">
                <p>
                  Type:{" "}
                  {organization?.organizationType ||
                    "N/A"}
                </p>

                <p>
                  Contact:{" "}
                  {organization?.contactPerson ||
                    "N/A"}
                </p>

                <p>
                  Phone:{" "}
                  {organization?.phone || "N/A"}
                </p>

                <p>
                  Email:{" "}
                  {organization?.email || "N/A"}
                </p>

                <p>
                  Address:{" "}
                  {organization?.address || "N/A"}
                </p>
              </div>

              {/* FOOD DETAILS */}

              {food && (
                <div className="mt-5 rounded-2xl bg-[#f5f1e8] p-5">
                  <p className="text-xs uppercase tracking-[0.2em] text-[#171717]/40">
                    Requested Food
                  </p>

                  <div className="mt-3 space-y-2 text-sm text-[#171717]/60">
                    <p>
                      Food:{" "}
                      {food.foodDescription}
                    </p>

                    <p>
                      Type: {food.foodType}
                    </p>

                    <p>
                      Quantity: {food.quantity}
                    </p>

                    <p>
                      Pickup:{" "}
                      {food.pickupLocation}
                    </p>
                  </div>

                  {/* FOOD LOCATION */}

                  {foodCoordinates?.length ===
                    2 && (
                    <div className="mt-4 rounded-xl bg-white p-4">
                      <p className="text-sm font-medium">
                        📍 Food pickup location
                      </p>

                      <p className="mt-2 text-xs text-[#171717]/50">
                        This is where the food is
                        available.
                      </p>

                      <p className="mt-3 text-xs text-[#171717]/60">
                        Latitude:{" "}
                        {foodCoordinates[1]}
                      </p>

                      <p className="mt-1 text-xs text-[#171717]/60">
                        Longitude:{" "}
                        {foodCoordinates[0]}
                      </p>

                      <a
                        href={`https://www.google.com/maps?q=${foodCoordinates[1]},${foodCoordinates[0]}`}
                        target="_blank"
                        rel="noreferrer"
                        className="mt-4 inline-block rounded-full bg-[#171717] px-4 py-2 text-xs text-white"
                      >
                        Open Food Location →
                      </a>
                    </div>
                  )}
                </div>
              )}

              {/* ACCEPT / REJECT */}

              {request.status ===
                "REQUESTED" && (
                <div className="mt-7 flex gap-3">
                  <button
                    onClick={() =>
                      updateRequest(
                        request._id,
                        "accept"
                      )
                    }
                    className="flex-1 rounded-full bg-[#171717] px-5 py-3 text-sm text-white"
                  >
                    Accept
                  </button>

                  <button
                    onClick={() =>
                      updateRequest(
                        request._id,
                        "reject"
                      )
                    }
                    className="flex-1 rounded-full border border-[#171717]/15 px-5 py-3 text-sm"
                  >
                    Reject
                  </button>
                </div>
              )}

              {/* LIVE ORGANIZATION LOCATION */}

              {request.status ===
                "ACCEPTED" && (
                <div className="mt-7">
                  <p className="mb-3 text-xs uppercase tracking-[0.2em] text-[#171717]/40">
                    Organization Tracking
                  </p>

                  {liveCoordinates?.length ===
                  2 ? (
                    <>
                      <button
                        onClick={() =>
                          loadTracking(
                            request._id
                          )
                        }
                        className="w-full rounded-full bg-[#171717] px-5 py-3 text-sm text-white"
                      >
                        Refresh Live Location
                      </button>

                      {selectedTracking ===
                        request._id && (
                        <div className="mt-5 rounded-2xl bg-green-50 p-5">
                          <p className="text-sm font-medium text-green-700">
                            🟢 Organization location
                            available
                          </p>

                          <p className="mt-3 text-xs text-green-800/70">
                            Latitude:{" "}
                            {
                              liveCoordinates[1]
                            }
                          </p>

                          <p className="mt-1 text-xs text-green-800/70">
                            Longitude:{" "}
                            {
                              liveCoordinates[0]
                            }
                          </p>

                          {trackingData?.lastLocationUpdate && (
                            <p className="mt-3 text-xs text-green-800/50">
                              Last update:{" "}
                              {new Date(
                                trackingData.lastLocationUpdate
                              ).toLocaleTimeString()}
                            </p>
                          )}

                          <a
                            href={`https://www.google.com/maps?q=${liveCoordinates[1]},${liveCoordinates[0]}`}
                            target="_blank"
                            rel="noreferrer"
                            className="mt-4 inline-block rounded-full bg-green-700 px-4 py-2 text-xs text-white"
                          >
                            Open Live Location →
                          </a>
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="rounded-2xl bg-[#f5f1e8] p-5 text-sm text-[#171717]/55">
                      Waiting for the organization
                      to start pickup and share its
                      live GPS location.
                    </div>
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
      onClick={onClick}
      className={`rounded-full px-5 py-3 text-sm ${
        active
          ? "bg-[#171717] text-white"
          : "border border-[#171717]/10 text-[#171717]/50"
      }`}
    >
      {children}
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

      <h2 className="mt-4 text-4xl font-light md:text-6xl">
        {title}
      </h2>

      <p className="mt-4 max-w-xl text-[#171717]/50">
        {description}
      </p>
    </div>
  );
}

function Input({
  label,
  name,
  type = "text",
  value,
  onChange,
  placeholder,
  required,
}) {
  return (
    <div className="mb-5">
      <label className="mb-2 block text-sm text-[#171717]/60">
        {label}
      </label>

      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        className="w-full rounded-xl border border-[#171717]/15 bg-[#f5f1e8] px-4 py-3 outline-none"
      />
    </div>
  );
}

export default OrganizerDashboard;