import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

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

  function handleChange(e) {
    const { name, value } = e.target;

    setForm((current) => ({
      ...current,
      [name]: value,
    }));
  }

  function handleRoleChange(newRole) {
    setRole(newRole);
    setError("");
    setSuccess("");
  }

  function handleModeChange(newMode) {
    setMode(newMode);
    setError("");
    setSuccess("");
  }

  async function handleSubmit(e) {
    e.preventDefault();

    setError("");
    setSuccess("");
    setLoading(true);

    try {
      let endpoint = "";

      if (role === "organizer") {
        endpoint =
          mode === "login"
            ? "http://localhost:5000/api/organizers/login"
            : "http://localhost:5000/api/organizers/register";
      } else {
        endpoint =
          mode === "login"
            ? "http://localhost:5000/api/organizations/login"
            : "http://localhost:5000/api/organizations/register";
      }

      let body;

      if (mode === "login") {
        body = {
          email: form.email,
          password: form.password,
        };
      } else if (role === "organizer") {
        body = {
          fullName: form.fullName,
          email: form.email,
          phone: form.phone,
          eventCompany: form.eventCompany,
          password: form.password,
        };
      } else {
        body = {
          organizationName: form.organizationName,
          organizationType: form.organizationType,
          contactPerson: form.contactPerson,
          email: form.email,
          phone: form.phone,
          address: form.address,
          password: form.password,
        };
      }

      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Something went wrong."
        );
      }

      /* ================= LOGIN ================= */

      if (mode === "login") {
        localStorage.setItem("token", data.token);

        if (role === "organizer") {
          localStorage.setItem(
            "organizerId",
            data.organizer.id
          );

          navigate("/organizer/dashboard");
        } else {
          localStorage.setItem(
            "organizationId",
            data.organization.id
          );

          navigate("/organization/dashboard");
        }

        return;
      }

      /* ================= REGISTRATION ================= */

      if (role === "organizer") {
        setSuccess(
          "Organizer account created successfully."
        );

        setTimeout(() => {
          setMode("login");
        }, 800);
      } else {
        setSuccess(
          "Organization account created successfully."
        );

        setTimeout(() => {
          setMode("login");
        }, 800);
      }
    } catch (err) {
      console.error("AUTH ERROR:", err);

      setError(
        err.message || "Something went wrong."
      );
    } finally {
      setLoading(false);
    }
  }

  const isLogin = mode === "login";

  return (
    <main className="min-h-screen bg-[#f5f1e8] text-[#171717]">

      {/* Navigation */}

      <nav className="flex items-center justify-between px-6 py-6 md:px-12 lg:px-16">

        <Link
          to="/"
          className="text-2xl font-semibold tracking-[-0.04em]"
        >
          Food<span className="text-[#8b6f47]">
            Bridge
          </span>
        </Link>

        <Link
          to="/"
          className="text-sm text-[#171717]/50 transition hover:text-[#171717]"
        >
          Back to home
        </Link>

      </nav>


      {/* Main */}

      <section className="px-6 pb-20 pt-10 md:px-12 md:pt-16 lg:px-16">

        <div className="mx-auto max-w-6xl">

          <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">

            {/* Left side */}

            <div className="pt-4">

              <p className="text-xs uppercase tracking-[0.3em] text-[#171717]/40">
                FoodBridge
              </p>

              <h1 className="mt-6 text-6xl font-light leading-[0.9] tracking-[-0.06em] md:text-8xl">
                {isLogin ? "Welcome" : "Join"}
                <br />

                <span className="text-[#8b6f47]">
                  FoodBridge.
                </span>
              </h1>

              <p className="mt-8 max-w-md text-lg leading-8 text-[#171717]/55">
                {isLogin
                  ? "Continue your FoodBridge journey and help connect surplus food with people who need it."
                  : "Create your account and become part of a simpler way to redistribute surplus food."}
              </p>

            </div>


            {/* Right side */}

            <div className="rounded-[2rem] border border-[#171717]/10 bg-white/50 p-6 md:p-10">

              {/* Role */}

              <div>

                <p className="mb-3 text-xs uppercase tracking-[0.2em] text-[#171717]/40">
                  I am a
                </p>

                <div className="grid grid-cols-2 gap-2 rounded-full bg-[#e9e2d5] p-1">

                  <button
                    type="button"
                    onClick={() =>
                      handleRoleChange("organizer")
                    }
                    className={`rounded-full px-5 py-3 text-sm transition ${role === "organizer"
                        ? "bg-[#171717] text-white"
                        : "text-[#171717]/50"
                      }`}
                  >
                    Organizer
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      handleRoleChange("organization")
                    }
                    className={`rounded-full px-5 py-3 text-sm transition ${role === "organization"
                        ? "bg-[#171717] text-white"
                        : "text-[#171717]/50"
                      }`}
                  >
                    Organization
                  </button>

                </div>

              </div>


              {/* Mode */}

              <div className="mt-8 flex gap-6 border-b border-[#171717]/10">

                <button
                  type="button"
                  onClick={() =>
                    handleModeChange("login")
                  }
                  className={`pb-4 text-sm ${isLogin
                      ? "border-b-2 border-[#171717] font-medium"
                      : "text-[#171717]/40"
                    }`}
                >
                  Login
                </button>

                <button
                  type="button"
                  onClick={() =>
                    handleModeChange("register")
                  }
                  className={`pb-4 text-sm ${!isLogin
                      ? "border-b-2 border-[#171717] font-medium"
                      : "text-[#171717]/40"
                    }`}
                >
                  Create account
                </button>

              </div>


              {/* Form */}

              <form
                onSubmit={handleSubmit}
                className="mt-8"
              >

                {/* ORGANIZER CREATE ACCOUNT */}

                {!isLogin &&
                  role === "organizer" && (
                    <>
                      <Input
                        label="Full Name"
                        name="fullName"
                        value={form.fullName}
                        onChange={handleChange}
                        placeholder="Your full name"
                        required
                      />

                      <Input
                        label="Event Company"
                        name="eventCompany"
                        value={form.eventCompany}
                        onChange={handleChange}
                        placeholder="Company or event organization"
                        required
                      />

                      <Input
                        label="Phone"
                        name="phone"
                        value={form.phone}
                        onChange={handleChange}
                        placeholder="Phone number"
                        required
                      />
                    </>
                  )}


                {/* ORGANIZATION CREATE ACCOUNT */}

                {!isLogin &&
                  role === "organization" && (
                    <>
                      <Input
                        label="Organization Name"
                        name="organizationName"
                        value={form.organizationName}
                        onChange={handleChange}
                        placeholder="Organization name"
                        required
                      />

                      <div className="mb-5">

                        <label className="mb-2 block text-sm text-[#171717]/60">
                          Organization Type
                        </label>

                        <select
                          name="organizationType"
                          value={form.organizationType}
                          onChange={handleChange}
                          required
                          className="w-full rounded-xl border border-[#171717]/15 bg-[#f5f1e8] px-4 py-3 outline-none"
                        >
                          <option value="">
                            Select type
                          </option>

                          <option value="NGO">
                            NGO
                          </option>

                          <option value="orphanage">
                            Orphanage
                          </option>

                          <option value="old_age_home">
                            Old Age Home
                          </option>

                          <option value="shelter">
                            Shelter
                          </option>

                          <option value="foundation">
                            Foundation
                          </option>

                          <option value="community_kitchen">
                            Community Kitchen
                          </option>

                          <option value="food_bank">
                            Food Bank
                          </option>

                          <option value="other">
                            Other
                          </option>
                        </select>

                      </div>

                      <Input
                        label="Contact Person"
                        name="contactPerson"
                        value={form.contactPerson}
                        onChange={handleChange}
                        placeholder="Contact person's name"
                        required
                      />

                      <Input
                        label="Phone"
                        name="phone"
                        value={form.phone}
                        onChange={handleChange}
                        placeholder="Phone number"
                        required
                      />

                      <Input
                        label="Address"
                        name="address"
                        value={form.address}
                        onChange={handleChange}
                        placeholder="Organization address"
                        required
                      />
                    </>
                  )}


                {/* EMAIL */}

                <Input
                  label="Email"
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  required
                />


                {/* PASSWORD */}

                <Input
                  label="Password"
                  name="password"
                  type="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  required
                />


                {/* ERROR */}

                {error && (
                  <div className="mb-5 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
                    {error}
                  </div>
                )}


                {/* SUCCESS */}

                {success && (
                  <div className="mb-5 rounded-xl bg-green-50 px-4 py-3 text-sm text-green-700">
                    {success}
                  </div>
                )}


                {/* SUBMIT */}

                <button
                  type="submit"
                  disabled={loading}
                  className="group flex w-full items-center justify-between rounded-full bg-[#171717] px-6 py-4 text-sm font-medium text-white transition hover:-translate-y-0.5 disabled:opacity-50"
                >
                  <span>
                    {loading
                      ? "Please wait..."
                      : isLogin
                        ? "Login"
                        : "Create account"}
                  </span>

                  <span className="transition-transform group-hover:translate-x-1">
                    →
                  </span>
                </button>

              </form>

            </div>

          </div>

        </div>

      </section>

    </main>
  );
}


/* Input component */

function Input({
  label,
  name,
  type = "text",
  value,
  onChange,
  placeholder,
  required = false,
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
        className="w-full rounded-xl border border-[#171717]/15 bg-[#f5f1e8] px-4 py-3 text-[#171717] outline-none transition placeholder:text-[#171717]/25 focus:border-[#8b6f47]"
      />

    </div>
  );
}

export default Auth;