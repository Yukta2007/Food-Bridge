
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

// Validation patterns
const emailPattern =
  /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

const strongPasswordPattern =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9\s])\S{8,}$/;

const namePattern = /^[A-Za-z]+(?:[ '-][A-Za-z]+)*$/;
const phonePattern = /^\d{10}$/;

const inputClass =
  "w-full rounded-xl border border-[#dce5dc] bg-white px-4 py-3 text-sm text-[#193c2c] outline-none transition placeholder:text-[#9aa69b] focus:border-[#326749] focus:ring-2 focus:ring-[#326749]/10";

const API_URL = (
  import.meta.env.VITE_API_URL || "http://localhost:5000"
).replace(/\/+$/, "");

function Input({
  label,
  name,
  type = "text",
  value,
  onChange,
  placeholder,
  required = false,
  error = "",
  autoComplete,
  inputMode,
  maxLength,
}) {
  return (
    <div className="mb-5">
      <label
        htmlFor={name}
        className="mb-2 block text-sm font-medium text-[#345440]"
      >
        {label}
      </label>

      <input
        id={name}
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        autoComplete={autoComplete}
        inputMode={inputMode}
        maxLength={maxLength}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${name}-error` : undefined}
        className={`${inputClass} ${
          error ? "border-red-400 focus:border-red-500" : ""
        }`}
      />

      {error && (
        <p
          id={`${name}-error`}
          className="mt-1.5 text-xs leading-5 text-red-600"
        >
          {error}
        </p>
      )}
    </div>
  );
}

function Auth() {
  const navigate = useNavigate();

  const [role, setRole] = useState("organizer");
  const [mode, setMode] = useState("login");

  const [form, setForm] = useState({
    fullName: "",
    organizationName: "",
    organizationType: "",
    contactPerson: "",
    email: "",
    phone: "",
    address: "",
    eventCompany: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});

  const isLogin = mode === "login";

  function handleChange(e) {
    const { name, value } = e.target;

    setForm((current) => ({
      ...current,
      [name]:
        name === "phone"
          ? value.replace(/\D/g, "").slice(0, 10)
          : name === "email"
            ? value.trimStart()
            : value,
    }));

    setFieldErrors((current) => ({
      ...current,
      [name]: "",
    }));

    setError("");
    setSuccess("");
  }

  function handleRoleChange(newRole) {
    setRole(newRole);
    setError("");
    setSuccess("");
    setFieldErrors({});
  }

  function handleModeChange(newMode) {
    setMode(newMode);
    setError("");
    setSuccess("");
    setFieldErrors({});
  }

  function validateForm() {
    const errors = {};

    if (mode === "register") {
      if (role === "organizer") {
        if (!form.fullName.trim()) {
          errors.fullName = "Full name is required.";
        } else if (!namePattern.test(form.fullName.trim())) {
          errors.fullName =
            "Use letters, spaces, hyphens or apostrophes only.";
        }

        if (!form.eventCompany.trim()) {
          errors.eventCompany = "Event company is required.";
        }

        if (!phonePattern.test(form.phone)) {
          errors.phone = "Phone number must contain exactly 10 digits.";
        }
      }

      if (role === "organization") {
        if (!form.organizationName.trim()) {
          errors.organizationName = "Organization name is required.";
        }

        if (!form.organizationType) {
          errors.organizationType = "Please select an organization type.";
        }

        if (!form.contactPerson.trim()) {
          errors.contactPerson = "Contact person's name is required.";
        } else if (!namePattern.test(form.contactPerson.trim())) {
          errors.contactPerson =
            "Use letters, spaces, hyphens or apostrophes only.";
        }

        if (!phonePattern.test(form.phone)) {
          errors.phone = "Phone number must contain exactly 10 digits.";
        }

        if (!form.address.trim()) {
          errors.address = "Organization address is required.";
        }
      }
    }

    if (!form.email.trim()) {
      errors.email = "Email is required.";
    } else if (!emailPattern.test(form.email.trim())) {
      errors.email = "Enter a valid email address.";
    }

    if (!form.password) {
      errors.password = "Password is required.";
    } else if (
      mode === "register" &&
      !strongPasswordPattern.test(form.password)
    ) {
      errors.password =
        "Use 8+ characters with uppercase, lowercase, a number and a special character.";
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (loading) return;

    setError("");
    setSuccess("");

    if (!validateForm()) {
      setError("Please correct the highlighted fields.");
      return;
    }

    setLoading(true);

    try {
      const endpointMap = {
        organizer: {
          login: `${API_URL}/api/organizers/login`,
          register: `${API_URL}/api/organizers/register`,
        },
        organization: {
          login: `${API_URL}/api/organizations/login`,
          register: `${API_URL}/api/organizations/register`,
        },
      };

      const endpoint = endpointMap[role]?.[mode];

      if (!endpoint) {
        throw new Error("Invalid account type or authentication mode.");
      }

      let body;

      if (mode === "login") {
        body = {
          email: form.email.trim(),
          password: form.password,
        };
      } else if (role === "organizer") {
        body = {
          fullName: form.fullName.trim(),
          email: form.email.trim(),
          phone: form.phone,
          eventCompany: form.eventCompany.trim(),
          password: form.password,
        };
      } else {
        body = {
          organizationName: form.organizationName.trim(),
          organizationType: form.organizationType,
          contactPerson: form.contactPerson.trim(),
          email: form.email.trim(),
          phone: form.phone,
          address: form.address.trim(),
          password: form.password,
        };
      }

      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(body),
      });

      const responseText = await response.text();
      let data = {};

      if (responseText) {
        try {
          data = JSON.parse(responseText);
        } catch {
          throw new Error(
            `Invalid server response. HTTP status: ${response.status}.`
          );
        }
      }

      if (!response.ok) {
        throw new Error(
          data.message || `Request failed with status ${response.status}.`
        );
      }

      if (mode === "register") {
        setSuccess(
          role === "organizer"
            ? "Organizer account created successfully. You can now sign in."
            : "Organization account created successfully. You can now sign in."
        );

        setForm((current) => ({
          ...current,
          password: "",
        }));

        setFieldErrors({});
        setMode("login");
        return;
      }

      const account =
        role === "organizer"
          ? data.organizer || data.user || data.account
          : data.organization || data.user || data.account;

      const accountId = account?.id || account?._id;

      if (!data.token || !accountId) {
        console.error("Unexpected login response:", data);
        throw new Error(
          "Login response is missing the token or account ID. Check the backend login controller."
        );
      }

      localStorage.setItem("token", data.token);

      if (role === "organizer") {
        localStorage.setItem("organizerId", accountId);
        localStorage.removeItem("organizationId");
        navigate("/organizer/dashboard", { replace: true });
      } else {
        localStorage.setItem("organizationId", accountId);
        localStorage.removeItem("organizerId");
        navigate("/organization/dashboard", { replace: true });
      }
    } catch (err) {
      console.error("AUTH ERROR:", err);

      if (err instanceof TypeError) {
        setError(
          `Cannot connect to the backend at ${API_URL}. Check that the backend is running and VITE_API_URL is configured correctly.`
        );
      } else {
        setError(err.message || "Something went wrong. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#f8f7f2] text-[#193c2c]">
      <nav className="mx-auto flex max-w-[1400px] items-center justify-between px-6 py-6 md:px-12 lg:px-16">
        <Link to="/" className="text-2xl font-bold tracking-[-0.06em]">
          Food<span className="text-[#bd7148]">Bridge</span>
          <span className="ml-2 text-xs font-normal tracking-normal text-[#69776c]">
            food with purpose
          </span>
        </Link>

        <Link
          to="/"
          className="text-sm text-[#69776c] transition hover:text-[#193c2c]"
        >
          ← Back to home
        </Link>
      </nav>

      <section className="px-4 pb-12 pt-4 sm:px-8 lg:px-12 lg:pb-16">
        <div className="mx-auto grid max-w-[1400px] overflow-hidden rounded-[28px] border border-[#e2e7dc] bg-white shadow-sm lg:min-h-[720px] lg:grid-cols-[1fr_0.95fr]">
          {/* Left banner */}
          <div className="relative min-h-[360px] overflow-hidden bg-[#193c2c] lg:min-h-full">
            <img
              src="https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?auto=format&fit=crop&w=1400&q=85"
              alt="Community volunteers coming together to help others"
              className="absolute inset-0 h-full w-full object-cover"
            />

            <div className="absolute inset-0 bg-gradient-to-t from-[#102d20]/95 via-[#193c2c]/35 to-transparent" />

            <div className="absolute left-0 right-0 top-0 p-7 sm:p-10">
              <span className="inline-flex rounded-full border border-white/30 bg-white/10 px-4 py-2 text-[10px] font-medium uppercase tracking-[0.2em] text-white backdrop-blur-sm">
                Good food. Greater good.
              </span>
            </div>

            <div className="absolute bottom-0 left-0 right-0 p-7 sm:p-10 lg:p-14">
              <p className="text-xs uppercase tracking-[0.25em] text-white/70">
                Every meal matters
              </p>

              <h1 className="mt-5 max-w-xl text-5xl font-medium leading-[0.98] tracking-[-0.055em] text-white sm:text-6xl lg:text-7xl">
                Less waste.
                <br />
                <span className="text-[#d9c7a0]">More hope.</span>
              </h1>

              <p className="mt-6 max-w-md text-sm leading-7 text-white/80 sm:text-base">
                Surplus food deserves a second chance. Join a community
                connecting event organizers with organizations that feed
                people in need.
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <span className="rounded-full border border-white/25 px-4 py-2 text-xs text-white/90">
                  Reduce food waste
                </span>
                <span className="rounded-full border border-white/25 px-4 py-2 text-xs text-white/90">
                  Support communities
                </span>
              </div>
            </div>
          </div>

          {/* Authentication form */}
          <div className="px-5 py-9 sm:px-9 sm:py-12 lg:px-12 lg:py-14 xl:px-16">
            <div className="mx-auto max-w-lg">
              <p className="text-xs font-semibold uppercase tracking-[0.23em] text-[#bd7148]">
                {isLogin
                  ? "Welcome to FoodBridge"
                  : "Become part of the change"}
              </p>

              <h2 className="mt-4 text-4xl font-medium leading-tight tracking-[-0.05em] sm:text-5xl">
                {isLogin ? "Welcome back." : "Let's get started."}
              </h2>

              <p className="mt-3 text-sm leading-6 text-[#69776c]">
                {isLogin
                  ? "Sign in to continue making a difference."
                  : "Create an account to help connect food with people who need it."}
              </p>

              {/* Account role */}
              <div className="mt-8">
                <p className="mb-3 text-xs font-medium uppercase tracking-[0.16em] text-[#69776c]">
                  I am joining as
                </p>

                <div className="grid grid-cols-2 gap-2 rounded-2xl bg-[#f0f2e9] p-1.5">
                  {[
                    { value: "organizer", label: "Event Organizer" },
                    { value: "organization", label: "NGO / Organization" },
                  ].map((item) => (
                    <button
                      key={item.value}
                      type="button"
                      onClick={() => handleRoleChange(item.value)}
                      aria-pressed={role === item.value}
                      className={`rounded-xl px-3 py-3 text-sm font-medium transition ${
                        role === item.value
                          ? "bg-[#214d38] text-white shadow-sm"
                          : "text-[#69776c] hover:text-[#193c2c]"
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Login and registration tabs */}
              <div className="mt-7 flex gap-6 border-b border-[#e4e8df]">
                <button
                  type="button"
                  onClick={() => handleModeChange("login")}
                  className={`pb-3 text-sm transition ${
                    isLogin
                      ? "border-b-2 border-[#214d38] font-semibold text-[#193c2c]"
                      : "text-[#8a968b] hover:text-[#193c2c]"
                  }`}
                >
                  Sign in
                </button>

                <button
                  type="button"
                  onClick={() => handleModeChange("register")}
                  className={`pb-3 text-sm transition ${
                    !isLogin
                      ? "border-b-2 border-[#214d38] font-semibold text-[#193c2c]"
                      : "text-[#8a968b] hover:text-[#193c2c]"
                  }`}
                >
                  Create account
                </button>
              </div>

              <form
                onSubmit={handleSubmit}
                noValidate
                className="mt-7"
              >
                {!isLogin && role === "organizer" && (
                  <>
                    <Input
                      label="Full Name"
                      name="fullName"
                      value={form.fullName}
                      onChange={handleChange}
                      placeholder="Your full name"
                      required
                      error={fieldErrors.fullName}
                      autoComplete="name"
                    />

                    <Input
                      label="Event Company"
                      name="eventCompany"
                      value={form.eventCompany}
                      onChange={handleChange}
                      placeholder="Company or event organization"
                      required
                      error={fieldErrors.eventCompany}
                    />

                    <Input
                      label="Phone Number"
                      name="phone"
                      type="tel"
                      inputMode="numeric"
                      maxLength={10}
                      value={form.phone}
                      onChange={handleChange}
                      placeholder="10-digit phone number"
                      required
                      error={fieldErrors.phone}
                    />
                  </>
                )}

                {!isLogin && role === "organization" && (
                  <>
                    <Input
                      label="Organization Name"
                      name="organizationName"
                      value={form.organizationName}
                      onChange={handleChange}
                      placeholder="Organization name"
                      required
                      error={fieldErrors.organizationName}
                    />

                    <div className="mb-5">
                      <label
                        htmlFor="organizationType"
                        className="mb-2 block text-sm font-medium text-[#345440]"
                      >
                        Organization Type
                      </label>

                      <select
                        id="organizationType"
                        name="organizationType"
                        value={form.organizationType}
                        onChange={handleChange}
                        required
                        aria-invalid={Boolean(fieldErrors.organizationType)}
                        className={`${inputClass} ${
                          fieldErrors.organizationType ? "border-red-400" : ""
                        }`}
                      >
                        <option value="">Select type</option>
                        <option value="NGO">NGO</option>
                        <option value="orphanage">Orphanage</option>
                        <option value="old_age_home">Old Age Home</option>
                        <option value="shelter">Shelter</option>
                        <option value="foundation">Foundation</option>
                        <option value="community_kitchen">
                          Community Kitchen
                        </option>
                        <option value="food_bank">Food Bank</option>
                        <option value="other">Other</option>
                      </select>

                      {fieldErrors.organizationType && (
                        <p className="mt-1.5 text-xs text-red-600">
                          {fieldErrors.organizationType}
                        </p>
                      )}
                    </div>

                    <Input
                      label="Contact Person"
                      name="contactPerson"
                      value={form.contactPerson}
                      onChange={handleChange}
                      placeholder="Contact person's name"
                      required
                      error={fieldErrors.contactPerson}
                      autoComplete="name"
                    />

                    <Input
                      label="Phone Number"
                      name="phone"
                      type="tel"
                      inputMode="numeric"
                      maxLength={10}
                      value={form.phone}
                      onChange={handleChange}
                      placeholder="10-digit phone number"
                      required
                      error={fieldErrors.phone}
                    />

                    <Input
                      label="Address"
                      name="address"
                      value={form.address}
                      onChange={handleChange}
                      placeholder="Organization address"
                      required
                      error={fieldErrors.address}
                    />
                  </>
                )}

                <Input
                  label="Email Address"
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  required
                  error={fieldErrors.email}
                  autoComplete="email"
                />

                <Input
                  label="Password"
                  name="password"
                  type="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder={
                    isLogin ? "Enter your password" : "Create a strong password"
                  }
                  required
                  error={fieldErrors.password}
                  autoComplete={isLogin ? "current-password" : "new-password"}
                />

                {!isLogin && (
                  <div className="-mt-1 mb-5 rounded-xl bg-[#f1f4eb] px-4 py-3">
                    <p className="text-xs font-semibold text-[#345440]">
                      Create a strong password
                    </p>
                    <p className="mt-1.5 text-xs leading-5 text-[#69776c]">
                      At least 8 characters, one uppercase letter, one
                      lowercase letter, one number and one special character
                      (such as !, @ or #).
                    </p>
                  </div>
                )}

                {error && (
                  <div
                    role="alert"
                    className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
                  >
                    {error}
                  </div>
                )}

                {success && (
                  <div
                    role="status"
                    className="mb-5 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800"
                  >
                    {success}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="group mt-2 flex w-full items-center justify-between rounded-full bg-[#214d38] px-6 py-4 text-sm font-semibold text-white transition hover:bg-[#193c2c] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <span>
                    {loading
                      ? "Please wait..."
                      : isLogin
                        ? "Sign in to your account"
                        : "Create your account"}
                  </span>

                  <span className="text-lg transition-transform group-hover:translate-x-1">
                    →
                  </span>
                </button>
              </form>

              <p className="mt-6 text-center text-xs leading-5 text-[#849084]">
                Together, we can reduce food waste and help feed communities.
              </p>
            </div>
          </div>
        </div>

        <p className="mt-6 text-center text-xs text-[#849084]">
          FoodBridge · Good food deserves a good destination.
        </p>
      </section>
    </main>
  );
}

export default Auth;
