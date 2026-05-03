import { FormEvent, useEffect, useMemo, useState } from "react";

type LoginState = {
  email: string;
};

type AppScreen = "landing" | "dashboard";
type Tone = "green" | "amber" | "red" | "blue" | "neutral";

const defaultLogin: LoginState = {
  email: "",
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

const dashboardNav = [
  { label: "Dashboard", token: "D", active: true },
  { label: "Reports", token: "R" },
  { label: "Review Center", token: "C", badge: "4" },
  { label: "Biomarkers", token: "B" },
  { label: "Trends", token: "T" },
  { label: "Insights", token: "I" },
  { label: "Family", token: "F", badge: "New" },
  { label: "Settings", token: "S" },
];

const statusCards: Array<{ label: string; value: string; helper: string; tone: Tone }> = [
  { label: "Clean draft", value: "61", helper: "Source-linked rows", tone: "green" },
  { label: "Needs review", value: "4", helper: "Unit/range checks", tone: "amber" },
  { label: "Out of lab range", value: "4", helper: "Before confirmation", tone: "red" },
  { label: "Official changes", value: "0", helper: "Blocked until review", tone: "blue" },
];

const trendCards: Array<{
  label: string;
  unit: string;
  value: string;
  status: string;
  tone: Tone;
  previous: string;
  latest: string;
  points: string;
}> = [
  {
    label: "HbA1c",
    unit: "%",
    value: "5.4",
    status: "Stable optimal",
    tone: "green",
    previous: "5.1",
    latest: "5.4",
    points: "8,24 28,42 48,48 68,44 88,53 108,60",
  },
  {
    label: "LDL Cholesterol",
    unit: "mg/dL",
    value: "116",
    status: "Optimal",
    tone: "green",
    previous: "131",
    latest: "116",
    points: "8,20 28,34 48,41 68,44 88,51 108,54",
  },
  {
    label: "Serum Creatinine",
    unit: "mg/dL",
    value: "0.90",
    status: "Optimal",
    tone: "green",
    previous: "0.88",
    latest: "0.90",
    points: "8,22 28,38 48,46 68,36 88,32 108,45",
  },
  {
    label: "Vitamin D",
    unit: "ng/mL",
    value: "22.4",
    status: "Borderline",
    tone: "amber",
    previous: "18.6",
    latest: "22.4",
    points: "8,24 28,48 48,52 68,54 88,40 108,30",
  },
  {
    label: "MCV",
    unit: "fL",
    value: "106.6",
    status: "Review",
    tone: "red",
    previous: "96.9",
    latest: "106.6",
    points: "8,52 28,44 48,38 68,31 88,24 108,16",
  },
];

const changeRows: Array<{
  marker: string;
  direction: "up" | "down" | "flat";
  status: string;
  detail: string;
  tone: Tone;
  range: string;
}> = [
  {
    marker: "HbA1c",
    direction: "flat",
    status: "Stable optimal",
    detail: "5.4% now vs 5.1% three months ago",
    tone: "green",
    range: "< 5.7 normal range",
  },
  {
    marker: "MCV",
    direction: "up",
    status: "Needs evidence review",
    detail: "106.6 fL now vs 96.9 fL three months ago",
    tone: "red",
    range: "Source row and unit require confirmation",
  },
  {
    marker: "Triglycerides",
    direction: "down",
    status: "Improved",
    detail: "112 mg/dL now vs 152 mg/dL three months ago",
    tone: "green",
    range: "< 150 lab target",
  },
];

const quickActions = [
  { title: "Upload New Report", copy: "Add a lab PDF", token: "UP" },
  { title: "Review Center", copy: "4 fields need confirmation", token: "RC" },
  { title: "Biomarkers", copy: "Browse canonical markers", token: "BM" },
  { title: "Trends", copy: "Compare over time", token: "TR" },
];

const privacyNotes = [
  "Uploaded reports stay private.",
  "Extracted values remain draft until reviewed.",
  "VitalTrace does not diagnose or prescribe.",
];

const onboardingSteps = [
  "Create self profile",
  "Upload first report",
  "Review extracted values",
];

export function App() {
  const [screen, setScreen] = useState<AppScreen>("landing");
  const [isSignInOpen, setIsSignInOpen] = useState(false);
  const [login, setLogin] = useState<LoginState>(defaultLogin);

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
      return "";
    }

    if (!login.email.includes("@")) {
      return "Enter a valid email to continue.";
    }

    return "";
  }, [login.email]);

  const canSubmit = login.email.trim() !== "" && formError === "";

  function updateLogin(field: keyof LoginState, value: string) {
    setLogin((current) => ({ ...current, [field]: value }));
  }

  function enterDashboard() {
    setIsSignInOpen(false);
    setScreen("dashboard");
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!canSubmit) {
      return;
    }
    enterDashboard();
  }

  if (screen === "dashboard") {
    return <Dashboard onBackToLanding={() => setScreen("landing")} />;
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
          updateLogin={updateLogin}
          handleSubmit={handleSubmit}
          onAuthenticated={enterDashboard}
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

function Dashboard({ onBackToLanding }: { onBackToLanding: () => void }) {
  return (
    <main className="dashboard-shell">
      <aside className="dashboard-sidebar" aria-label="VitalTrace app navigation">
        <div className="dashboard-brand">
          <div className="dashboard-logo" aria-hidden="true">
            VT
          </div>
          <span>VitalTrace</span>
        </div>

        <nav className="dashboard-nav" aria-label="Dashboard navigation">
          {dashboardNav.map((item) => (
            <button className={item.active ? "active" : ""} type="button" key={item.label}>
              <span aria-hidden="true">{item.token}</span>
              <strong>{item.label}</strong>
              {item.badge ? <em>{item.badge}</em> : null}
            </button>
          ))}
        </nav>

        <div className="upgrade-panel">
          <strong>Source-linked intelligence</strong>
          <p>Compare retests only after values are reviewed and confirmed.</p>
          <button type="button">View proof loop</button>
        </div>

        <div className="dashboard-user">
          <span aria-hidden="true">A</span>
          <div>
            <strong>Arjun Mehta</strong>
            <small>Self profile</small>
          </div>
        </div>
      </aside>

      <section className="dashboard-main">
        <DashboardTopbar onBackToLanding={onBackToLanding} />
        <div className="dashboard-layout">
          <section className="dashboard-content" aria-label="Health dashboard">
            <ReviewBanner />
            <StatusSnapshot />
            <TrendSection />
            <ChangeSection />
          </section>
          <DashboardRail />
        </div>
        <footer className="dashboard-footnote">
          <span>Data is encrypted locally in this mock. Production reports remain draft until review.</span>
          <button type="button">Privacy boundary</button>
        </footer>
      </section>
    </main>
  );
}

function DashboardTopbar({ onBackToLanding }: { onBackToLanding: () => void }) {
  return (
    <header className="dashboard-topbar">
      <div>
        <p>Good evening, Arjun</p>
        <span>Here is your review-gated bloodwork workspace.</span>
      </div>

      <div className="profile-switcher" aria-label="Profile switcher">
        <button className="selected" type="button">
          <span>A</span>
          Self
        </button>
        <button type="button">
          <span>M</span>
          Mom
        </button>
        <button type="button">
          <span>D</span>
          Dad
        </button>
        <button type="button" aria-label="Add profile">
          +
        </button>
      </div>

      <div className="dashboard-actions">
        <button className="upload-button" type="button">
          Upload Report
        </button>
        <button className="utility-button" type="button" aria-label="Notifications">
          N
        </button>
        <button className="utility-button" type="button" aria-label="Help">
          ?
        </button>
        <button className="utility-button" type="button" onClick={onBackToLanding}>
          Exit
        </button>
      </div>
    </header>
  );
}

function ReviewBanner() {
  return (
    <section className="review-banner" aria-label="Report ready for review">
      <div className="report-icon" aria-hidden="true">
        <span />
      </div>
      <div>
        <h1>Your report is ready for review</h1>
        <p>65 draft observations from a 16-page PDF need confirmation before updating the timeline.</p>
      </div>
      <div className="report-meta">
        <span>12 May 2026</span>
        <span>Demo Diagnostics</span>
      </div>
      <div className="banner-actions">
        <button className="primary-dashboard-action" type="button">
          Review evidence
        </button>
        <button className="ghost-dashboard-action" type="button">
          More
        </button>
      </div>
    </section>
  );
}

function StatusSnapshot() {
  return (
    <section className="dashboard-panel" aria-labelledby="status-title">
      <div className="panel-heading">
        <div>
          <h2 id="status-title">Current status snapshot</h2>
          <p>Draft lab-range view, separated from official timeline status.</p>
        </div>
        <span>65 draft biomarkers</span>
      </div>

      <div className="status-grid">
        <div className="status-ring-card">
          <div className="status-ring" aria-label="65 total biomarkers">
            <strong>65</strong>
            <span>Total</span>
          </div>
        </div>
        {statusCards.map((card) => (
          <article className={`status-card ${card.tone}`} key={card.label}>
            <span>{card.value}</span>
            <strong>{card.label}</strong>
            <small>{card.helper}</small>
          </article>
        ))}
      </div>
    </section>
  );
}

function TrendSection() {
  return (
    <section className="dashboard-panel" aria-labelledby="trends-title">
      <div className="panel-heading">
        <div>
          <h2 id="trends-title">Key biomarker trends</h2>
          <p>Demo values use confirmed history plus the current draft report.</p>
        </div>
        <button type="button">View all</button>
      </div>

      <div className="trend-grid">
        {trendCards.map((card) => (
          <article className={`trend-card ${card.tone}`} key={card.label}>
            <div>
              <span>
                {card.label} <small>({card.unit})</small>
              </span>
              <em>{card.status}</em>
            </div>
            <strong>{card.value}</strong>
            <TrendSparkline points={card.points} tone={card.tone} />
            <footer>
              <span>{card.previous}</span>
              <span>{card.latest}</span>
            </footer>
          </article>
        ))}
      </div>
    </section>
  );
}

function TrendSparkline({ points, tone }: { points: string; tone: Tone }) {
  const lastPoint = points.split(" ").slice(-1)[0] ?? "108,34";
  const lastY = lastPoint.split(",")[1] ?? "34";

  return (
    <svg className={`sparkline ${tone}`} viewBox="0 0 116 68" role="img" aria-label="Trend line">
      <polyline points={points} />
      <circle cx="108" cy={lastY} r="3" />
    </svg>
  );
}

function ChangeSection() {
  return (
    <section className="dashboard-panel" aria-labelledby="changes-title">
      <div className="panel-heading">
        <div>
          <h2 id="changes-title">What changed since last report?</h2>
          <p>Changes stay non-diagnostic until review and clinician discussion where needed.</p>
        </div>
        <button type="button">View all</button>
      </div>

      <div className="change-list">
        {changeRows.map((row) => (
          <article className={`change-row ${row.tone}`} key={row.marker}>
            <span aria-hidden="true">{row.direction === "up" ? "UP" : row.direction === "down" ? "DN" : "OK"}</span>
            <div>
              <strong>{row.marker}</strong>
              <em>{row.status}</em>
            </div>
            <p>{row.detail}</p>
            <small>{row.range}</small>
          </article>
        ))}
      </div>
    </section>
  );
}

function DashboardRail() {
  return (
    <aside className="dashboard-rail" aria-label="Report and quick actions">
      <section className="rail-panel">
        <div className="panel-heading">
          <h2>Latest report</h2>
          <button type="button">View all</button>
        </div>
        <div className="latest-report-row">
          <div className="pdf-chip" aria-hidden="true">
            PDF
          </div>
          <div>
            <strong>Demo Diagnostics Ltd.</strong>
            <span>12 May 2026 · 9:42 AM</span>
          </div>
          <em>Needs review</em>
        </div>
        <div className="report-mini-stats">
          <div>
            <strong>65</strong>
            <span>Draft rows</span>
          </div>
          <div>
            <strong>4</strong>
            <span>Review flags</span>
          </div>
          <div>
            <strong>0</strong>
            <span>Auto official</span>
          </div>
        </div>
        <button className="wide-rail-button" type="button">
          View report details
        </button>
      </section>

      <section className="rail-panel">
        <h2>Quick actions</h2>
        <div className="quick-action-list">
          {quickActions.map((action) => (
            <button type="button" key={action.title}>
              <span aria-hidden="true">{action.token}</span>
              <strong>{action.title}</strong>
              <small>{action.copy}</small>
            </button>
          ))}
        </div>
      </section>

      <section className="rail-panel insight-panel">
        <h2>Need help understanding results?</h2>
        <p>Educational summaries appear after values are reviewed. VitalTrace does not diagnose.</p>
        <button type="button">Explore safe insights</button>
      </section>
    </aside>
  );
}

type SignInModalProps = {
  canSubmit: boolean;
  formError: string;
  login: LoginState;
  updateLogin: (field: keyof LoginState, value: string) => void;
  handleSubmit: (event: FormEvent<HTMLFormElement>) => void;
  onAuthenticated: () => void;
  onClose: () => void;
};

function SignInModal({
  canSubmit,
  formError,
  login,
  updateLogin,
  handleSubmit,
  onAuthenticated,
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
          Access private bloodwork timelines. Report values stay draft until you review and confirm
          the source evidence.
        </p>

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

          {formError ? <p className="form-error">{formError}</p> : null}

          <button className="primary-action" type="submit" disabled={!canSubmit}>
            Continue with email
          </button>
        </form>

        <div className="modal-divider">
          <span>Or continue with</span>
        </div>

        <div className="social-actions" aria-label="Mock social sign in options">
          <button type="button" onClick={onAuthenticated}>
            <span className="provider-mark google">G</span>
            Google
          </button>
          <button type="button" onClick={onAuthenticated}>
            <span className="provider-mark">A</span>
            Apple
          </button>
        </div>

        <div className="signin-path" aria-label="After sign in">
          <span>After sign in</span>
          <ol>
            {onboardingSteps.map((step) => (
              <li key={step}>{step}</li>
            ))}
          </ol>
        </div>

        <div className="modal-boundary">
          {privacyNotes.map((note) => (
            <span key={note}>{note}</span>
          ))}
        </div>
      </section>
    </div>
  );
}
