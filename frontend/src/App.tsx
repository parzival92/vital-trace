import { FormEvent, useEffect, useMemo, useState } from "react";

type LoginMode = "otp" | "password";

type LoginState = {
  email: string;
  password: string;
  otp: string;
};

const defaultLogin: LoginState = {
  email: "demo@vitaltrace.local",
  password: "",
  otp: "",
};

const trustStats = [
  {
    value: "Review-gated",
    label: "Draft values stay unofficial until confirmed",
  },
  {
    value: "Source-linked",
    label: "Every marker keeps report evidence",
  },
  {
    value: "Non-diagnostic",
    label: "Tracking and review, not treatment advice",
  },
];

const trendingTopics = [
  {
    category: "Baseline",
    title: "Turn scattered reports into one reviewed timeline",
    copy: "Upload lab PDFs and confirm source-linked observations before they power charts.",
  },
  {
    category: "Future score",
    title: "No fake score before the data is clean",
    copy: "Scoring stays future work until confirmed observations are reliable enough to explain.",
  },
  {
    category: "Action loop",
    title: "Use retests to see what actually moved",
    copy: "Track context between reports, compare marker movement, and prepare sharper doctor discussions.",
  },
];

const markerRows = [
  { name: "HbA1c", value: "6.1%", status: "Red" },
  { name: "LDL-C", value: "162", status: "Red" },
  { name: "hs-CRP", value: "4.8", status: "Red" },
  { name: "Vitamin D", value: "18", status: "Amber" },
];

const privacyNotes = [
  "Lab PDFs are sensitive health data.",
  "Extraction results stay draft until reviewed.",
  "VitalTrace does not diagnose or prescribe.",
];

export function App() {
  const [isSignInOpen, setIsSignInOpen] = useState(false);
  const [mode, setMode] = useState<LoginMode>("otp");
  const [login, setLogin] = useState<LoginState>(defaultLogin);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsSignInOpen(false);
      }
    }

    if (isSignInOpen) {
      document.addEventListener("keydown", handleKeyDown);
      document.body.classList.add("modal-open");
    }

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.classList.remove("modal-open");
    };
  }, [isSignInOpen]);

  const formError = useMemo(() => {
    if (!login.email.trim()) {
      return "Email is required.";
    }

    if (!login.email.includes("@")) {
      return "Enter a valid email for this first login flow.";
    }

    if (mode === "password" && login.password.length < 8) {
      return "Password must be at least 8 characters.";
    }

    if (mode === "otp" && login.otp && login.otp.length !== 6) {
      return "OTP should be 6 digits.";
    }

    return "";
  }, [login.email, login.otp, login.password, mode]);

  const canSubmit = formError === "";

  function updateLogin(field: keyof LoginState, value: string) {
    setSubmitted(false);
    setLogin((current) => ({ ...current, [field]: value }));
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!canSubmit) {
      return;
    }
    setSubmitted(true);
  }

  return (
    <>
      <main className="landing-page" aria-hidden={isSignInOpen ? "true" : undefined}>
        <SiteHeader onSignIn={() => setIsSignInOpen(true)} />
        <TrustStrip />
        <Hero />
        <TrendingSection />
        <ProductLoopSection />
        <SiteFooter />
      </main>

      {isSignInOpen ? (
        <SignInModal
          canSubmit={canSubmit}
          formError={formError}
          login={login}
          mode={mode}
          setMode={setMode}
          submitted={submitted}
          updateLogin={updateLogin}
          handleSubmit={handleSubmit}
          onClose={() => setIsSignInOpen(false)}
        />
      ) : null}
    </>
  );
}

function SiteHeader({ onSignIn }: { onSignIn: () => void }) {
  return (
    <header className="site-header" aria-label="VitalTrace header">
      <a className="brand-row" href="#top" aria-label="VitalTrace home">
        <div className="brand-mark" aria-hidden="true">
          VT
        </div>
        <div>
          <p className="brand-name">VitalTrace</p>
          <p className="brand-subtitle">Trusted bloodwork timelines</p>
        </div>
      </a>

      <nav className="primary-nav" aria-label="Primary navigation">
        <a href="#reports">Reports</a>
        <a href="#markers">Markers</a>
        <a href="#action-loop">Action loop</a>
        <a href="#trust">Trust</a>
      </nav>

      <button className="signin-chip" type="button" onClick={onSignIn}>
        Sign in
      </button>
    </header>
  );
}

function TrustStrip() {
  return (
    <section className="trust-strip" id="trust" aria-label="VitalTrace trust signals">
      {trustStats.map((stat) => (
        <div key={stat.value}>
          <strong>{stat.value}</strong>
          <span>{stat.label}</span>
        </div>
      ))}
    </section>
  );
}

function Hero() {
  return (
    <section className="hero" id="top">
      <div className="hero-copy">
        <p className="eyebrow">For serious self-directed health trackers</p>
        <h1>Turn messy lab reports into trusted bloodwork timelines.</h1>
        <p>
          VitalTrace structures lab PDFs into source-linked observations you can review, confirm,
          and compare across retests. No fake health score before the data is clean.
        </p>
      </div>

      <div className="hero-visual" aria-label="Bloodwork review preview">
        <div className="visual-topline">
          <span>Report review</span>
          <strong>4 markers need attention</strong>
        </div>
        <div className="review-card">
          <span>Timeline status</span>
          <strong>Baseline needs review</strong>
          <small>Charts use confirmed observations only</small>
        </div>
        <div className="marker-table">
          {markerRows.map((marker) => (
            <div className="marker-row" key={marker.name}>
              <span>{marker.name}</span>
              <strong>{marker.value}</strong>
              <em className={marker.status.toLowerCase()}>{marker.status}</em>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function TrendingSection() {
  return (
    <section className="content-section" id="reports">
      <div className="section-heading">
        <p className="eyebrow">Product thesis</p>
        <h2>Built around the repeat bloodwork workflow.</h2>
      </div>
      <div className="topic-grid">
        {trendingTopics.map((topic) => (
          <article className="topic-card" key={topic.title}>
            <span>{topic.category}</span>
            <h3>{topic.title}</h3>
            <p>{topic.copy}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

function ProductLoopSection() {
  return (
    <section className="loop-section" id="action-loop">
      <div className="loop-copy">
        <p className="eyebrow">Bloodwork action loop</p>
        <h2>Red markers should create a reviewable next step.</h2>
        <p>
          VitalTrace does not tell the user what treatment to follow. It helps track confirmed
          values, context, retests, and marker movement so effort can be checked against biology.
        </p>
      </div>
      <div className="loop-steps" id="markers">
        <article>
          <span>01</span>
          <strong>Confirm baseline</strong>
          <p>Review source-linked markers before anything becomes official.</p>
        </article>
        <article>
          <span>02</span>
          <strong>Track context</strong>
          <p>Record lifestyle context between reports without turning it into medical advice.</p>
        </article>
        <article>
          <span>03</span>
          <strong>Compare retest</strong>
          <p>Compare confirmed values and keep unresolved markers visible for doctor discussion.</p>
        </article>
      </div>
    </section>
  );
}

function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="footer-emblem" aria-hidden="true">
        VT
      </div>
      <p>© 2026 VitalTrace. Reviewed bloodwork timelines for serious self-directed health trackers.</p>
    </footer>
  );
}

type SignInModalProps = {
  canSubmit: boolean;
  formError: string;
  login: LoginState;
  mode: LoginMode;
  setMode: (mode: LoginMode) => void;
  submitted: boolean;
  updateLogin: (field: keyof LoginState, value: string) => void;
  handleSubmit: (event: FormEvent<HTMLFormElement>) => void;
  onClose: () => void;
};

function SignInModal({
  canSubmit,
  formError,
  login,
  mode,
  setMode,
  submitted,
  updateLogin,
  handleSubmit,
  onClose,
}: SignInModalProps) {
  return (
    <div className="modal-layer" role="presentation">
      <button className="modal-scrim" type="button" aria-label="Close sign in" onClick={onClose} />
      <section
        className="signin-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="signin-title"
      >
        <button className="close-button" type="button" aria-label="Close sign in" onClick={onClose}>
          <span aria-hidden="true">x</span>
        </button>

        <div className="modal-brand" aria-hidden="true">
          VT
        </div>
        <h2 id="signin-title">Sign in to VitalTrace</h2>
        <p className="terms-copy">
          Sign in to continue. VitalTrace is a non-diagnostic tracking product; report values must
          be reviewed before they become official.
        </p>

        <div className="social-actions" aria-label="Mock social sign in options">
          <button type="button">
            <span className="provider-mark">A</span>
            Continue with Apple
          </button>
          <button type="button">
            <span className="provider-mark google">G</span>
            Continue with Google
          </button>
        </div>

        <div className="modal-divider">
          <span>Email sign in</span>
        </div>

        <div className="mode-control" role="tablist" aria-label="Login method">
          <button
            type="button"
            role="tab"
            aria-selected={mode === "otp"}
            className={mode === "otp" ? "active" : ""}
            onClick={() => setMode("otp")}
          >
            Email OTP
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={mode === "password"}
            className={mode === "password" ? "active" : ""}
            onClick={() => setMode("password")}
          >
            Password
          </button>
        </div>

        <form className="login-form" onSubmit={handleSubmit} noValidate>
          <label className="field">
            <span>Email</span>
            <input
              type="email"
              autoComplete="email"
              value={login.email}
              onChange={(event) => updateLogin("email", event.target.value)}
              placeholder="you@example.com"
            />
          </label>

          {mode === "otp" ? (
            <label className="field">
              <span>One-time code</span>
              <input
                type="text"
                inputMode="numeric"
                autoComplete="one-time-code"
                value={login.otp}
                onChange={(event) => updateLogin("otp", event.target.value.replace(/\D/g, "").slice(0, 6))}
                placeholder="Enter 6-digit code"
              />
              <small>Leave blank to request a new code.</small>
            </label>
          ) : (
            <label className="field">
              <span>Password</span>
              <input
                type="password"
                autoComplete="current-password"
                value={login.password}
                onChange={(event) => updateLogin("password", event.target.value)}
                placeholder="At least 8 characters"
              />
            </label>
          )}

          {formError ? <p className="form-error">{formError}</p> : null}

          <button className="primary-action" type="submit" disabled={!canSubmit}>
            {mode === "otp" && !login.otp ? "Send code" : "Continue"}
          </button>

          {submitted ? (
            <div className="success-box" role="status">
              <strong>{mode === "otp" && !login.otp ? "Code request ready" : "Login accepted"}</strong>
              <span>Next step: onboarding and first report review.</span>
            </div>
          ) : null}
        </form>

        <div className="privacy-card modal-privacy">
          <h3>Privacy boundary</h3>
          <ul>
            {privacyNotes.map((note) => (
              <li key={note}>{note}</li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  );
}
