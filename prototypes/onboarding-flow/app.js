(function () {
  if (!window.React || !window.ReactDOM) {
    document.getElementById("root").innerHTML = [
      '<section class="runtime-error">',
      "<h1>React did not load</h1>",
      "<p>This prototype uses React 18 from a CDN. Check network access, then reload the page.</p>",
      "</section>"
    ].join("");
    return;
  }

  const h = window.React.createElement;
  const React = window.React;
  const ReactDOM = window.ReactDOM;

  const steps = [
    {
      id: "login",
      title: "Login",
      copy: "Start with trust and a low-friction account."
    },
    {
      id: "goal",
      title: "Goal",
      copy: "Choose why bloodwork tracking matters now."
    },
    {
      id: "profile",
      title: "Self profile",
      copy: "Collect only context needed for the first loop."
    },
    {
      id: "upload",
      title: "Upload",
      copy: "Use a demo report for this prototype."
    },
    {
      id: "review",
      title: "Review",
      copy: "Confirm source-linked red and amber markers."
    },
    {
      id: "loop",
      title: "Action loop",
      copy: "Convert markers into focus, retest, and comparison."
    }
  ];

  const riskLabels = {
    red: "Red",
    amber: "Amber",
    green: "In range",
    blue: "Info"
  };

  function classNames() {
    return Array.from(arguments).filter(Boolean).join(" ");
  }

  function App() {
    const [activeStep, setActiveStep] = React.useState(0);
    const [config, setConfig] = React.useState(null);
    const [report, setReport] = React.useState(null);
    const [actionLoop, setActionLoop] = React.useState(null);
    const [loading, setLoading] = React.useState(true);
    const [selectedGoal, setSelectedGoal] = React.useState("action-loop");
    const [profile, setProfile] = React.useState({
      name: "",
      age: "",
      sex: "Male",
      primaryFocus: ""
    });
    const [confirmed, setConfirmed] = React.useState({});
    const [saved, setSaved] = React.useState(false);

    React.useEffect(function () {
      Promise.all([
        fetch("/api/onboarding-config").then((response) => response.json()),
        fetch("/api/demo-report").then((response) => response.json()),
        fetch("/api/action-loop").then((response) => response.json())
      ]).then(function (payloads) {
        const onboardingConfig = payloads[0];
        setConfig(onboardingConfig);
        setReport(payloads[1]);
        setActionLoop(payloads[2]);
        setProfile(onboardingConfig.demoProfile);
        setLoading(false);
      }).catch(function () {
        setLoading(false);
      });
    }, []);

    const completedCount = Object.values(confirmed).filter(Boolean).length;
    const markerCount = report ? report.markers.length : 0;
    const canContinue = getCanContinue(activeStep, {
      selectedGoal,
      profile,
      report,
      markerCount,
      completedCount
    });

    function goNext() {
      if (activeStep < steps.length - 1) {
        setActiveStep(activeStep + 1);
      }
    }

    function goBack() {
      if (activeStep > 0) {
        setActiveStep(activeStep - 1);
      }
    }

    function updateProfile(field, value) {
      setProfile(Object.assign({}, profile, { [field]: value }));
    }

    function toggleMarker(markerId) {
      setConfirmed(Object.assign({}, confirmed, { [markerId]: !confirmed[markerId] }));
    }

    function saveSession() {
      fetch("/api/onboarding-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          goal: selectedGoal,
          profile,
          confirmedMarkerIds: Object.keys(confirmed).filter((id) => confirmed[id])
        })
      }).then(function () {
        setSaved(true);
      });
    }

    if (loading) {
      return h("div", { className: "app" },
        h(Sidebar, { activeStep, completedUntil: activeStep }),
        h("main", { className: "content" },
          h("section", { className: "panel" },
            h("h1", null, "Loading onboarding prototype"),
            h("p", { className: "lede" }, "Fetching anonymized demo data from the local Python server.")
          )
        )
      );
    }

    return h("div", { className: "app" },
      h(Sidebar, { activeStep, completedUntil: activeStep }),
      h("main", { className: "content" },
        h(Header, { activeStep, selectedGoal, completedCount, markerCount }),
        h("section", { className: "panel" },
          h(StepContent, {
            activeStep,
            config,
            selectedGoal,
            setSelectedGoal,
            profile,
            updateProfile,
            report,
            actionLoop,
            confirmed,
            toggleMarker,
            saveSession,
            saved
          }),
          h("div", { className: "actions" },
            h("button", {
              className: "button",
              type: "button",
              onClick: goBack,
              disabled: activeStep === 0
            }, "Back"),
            activeStep < steps.length - 1
              ? h("button", {
                className: "button primary",
                type: "button",
                onClick: goNext,
                disabled: !canContinue
              }, nextLabel(activeStep))
              : h("button", {
                className: "button primary",
                type: "button",
                onClick: saveSession
              }, saved ? "Session saved" : "Save demo session")
          )
        ),
        h("p", { className: "footer-note" },
          "Prototype only. Demo data is anonymized. VitalTrace does not diagnose, prescribe treatment, or replace clinician review."
        )
      )
    );
  }

  function getCanContinue(activeStep, state) {
    if (activeStep === 0) return true;
    if (activeStep === 1) return Boolean(state.selectedGoal);
    if (activeStep === 2) return Boolean(state.profile.name && state.profile.age && state.profile.sex);
    if (activeStep === 3) return Boolean(state.report);
    if (activeStep === 4) return state.completedCount >= Math.min(3, state.markerCount);
    return true;
  }

  function nextLabel(activeStep) {
    const labels = [
      "Start onboarding",
      "Continue to profile",
      "Continue to upload",
      "Review extracted markers",
      "Start action loop"
    ];
    return labels[activeStep] || "Continue";
  }

  function Sidebar(props) {
    return h("aside", { className: "sidebar", "aria-label": "Onboarding progress" },
      h("div", { className: "brand" },
        h("div", { className: "brand-mark", "aria-hidden": "true" }, "VT"),
        h("div", null,
          h("div", { className: "brand-title" }, "VitalTrace"),
          h("div", { className: "brand-subtitle" }, "Onboarding prototype")
        )
      ),
      h("div", { className: "phase-list" },
        steps.map(function (step, index) {
          const status = index === props.activeStep ? "active" : index < props.completedUntil ? "done" : "";
          return h("div", { className: classNames("phase-item", status), key: step.id },
            h("div", { className: "phase-number" }, index + 1),
            h("div", null,
              h("div", { className: "phase-title" }, step.title),
              h("div", { className: "phase-copy" }, step.copy)
            )
          );
        })
      ),
      h("div", { className: "sidebar-note" },
        "The onboarding goal is to reach a reviewed first report quickly, then start the action loop."
      )
    );
  }

  function Header(props) {
    const currentStep = steps[props.activeStep];
    const statusText = props.activeStep < 4
      ? "Setup in progress"
      : props.activeStep === 4
        ? `${props.completedCount}/${props.markerCount} markers confirmed`
        : "Ready for first action loop";

    return h("header", { className: "topbar" },
      h("div", null,
        h("p", { className: "eyebrow" }, "First-time onboarding"),
        h("h1", null, currentStep.title),
        h("p", { className: "lede" },
          "This flow gets a serious self-directed health tracker from login to first reviewed bloodwork loop without asking for unnecessary profile data."
        )
      ),
      h("section", { className: "status-card", "aria-label": "Onboarding status" },
        h("div", { className: "status-label" }, "Current state"),
        h("div", { className: "status-value" }, statusText),
        h("div", { className: "status-copy" }, "Goal: ", props.selectedGoal || "not selected")
      )
    );
  }

  function StepContent(props) {
    if (props.activeStep === 0) return h(LoginStep);
    if (props.activeStep === 1) return h(GoalStep, props);
    if (props.activeStep === 2) return h(ProfileStep, props);
    if (props.activeStep === 3) return h(UploadStep, props);
    if (props.activeStep === 4) return h(ReviewStep, props);
    return h(ActionLoopStep, props);
  }

  function LoginStep() {
    return h(React.Fragment, null,
      h("div", { className: "panel-header" },
        h("div", null,
          h("h2", { className: "panel-title" }, "Login without turning onboarding into paperwork"),
          h("p", { className: "panel-caption" },
            "The first screen should establish privacy, review-gated data, and the fact that this is not medical advice."
          )
        ),
        h("span", { className: "pill blue" }, "Mock login")
      ),
      h("div", { className: "form-grid" },
        h("div", { className: "field" },
          h("label", { htmlFor: "email" }, "Email or phone"),
          h("input", {
            id: "email",
            type: "text",
            defaultValue: "demo@vitaltrace.local",
            "aria-label": "Demo email or phone"
          })
        ),
        h("div", { className: "field" },
          h("label", { htmlFor: "otp" }, "One-time code"),
          h("input", {
            id: "otp",
            type: "text",
            defaultValue: "123456",
            "aria-label": "Demo one-time code"
          })
        ),
        h("div", { className: "field full" },
          h("div", { className: "notice" },
            "Trust boundary: uploaded reports stay review-gated. The product structures data and tracks marker movement; it does not diagnose or prescribe."
          )
        )
      )
    );
  }

  function GoalStep(props) {
    return h(React.Fragment, null,
      h("div", { className: "panel-header" },
        h("div", null,
          h("h2", { className: "panel-title" }, "What are you trying to do with bloodwork?"),
          h("p", { className: "panel-caption" },
            "This sets the product loop. The recommended default is a 12-week action phase because it proves VitalTrace is not just a dashboard."
          )
        ),
        h("span", { className: "pill green" }, "User intent")
      ),
      h("div", { className: "option-grid" },
        props.config.goals.map(function (goal) {
          const selected = props.selectedGoal === goal.id;
          return h("button", {
            key: goal.id,
            type: "button",
            className: classNames("option-card", selected && "selected"),
            onClick: function () { props.setSelectedGoal(goal.id); }
          },
            h("div", { className: "option-title" },
              h("span", null, goal.title),
              selected ? h("span", { className: "pill blue" }, "Selected") : null
            ),
            h("p", { className: "option-copy" }, goal.description)
          );
        })
      )
    );
  }

  function ProfileStep(props) {
    return h(React.Fragment, null,
      h("div", { className: "panel-header" },
        h("div", null,
          h("h2", { className: "panel-title" }, "Create the self profile"),
          h("p", { className: "panel-caption" },
            "Collect only context needed to make the first report meaningful. Deeper medical history can be progressive later."
          )
        ),
        h("span", { className: "pill blue" }, "Self-first")
      ),
      h("div", { className: "form-grid" },
        h("div", { className: "field" },
          h("label", { htmlFor: "name" }, "Name"),
          h("input", {
            id: "name",
            value: props.profile.name,
            onChange: function (event) { props.updateProfile("name", event.target.value); }
          })
        ),
        h("div", { className: "field" },
          h("label", { htmlFor: "age" }, "Age"),
          h("input", {
            id: "age",
            value: props.profile.age,
            onChange: function (event) { props.updateProfile("age", event.target.value); }
          })
        ),
        h("div", { className: "field" },
          h("label", { htmlFor: "sex" }, "Sex for report ranges"),
          h("select", {
            id: "sex",
            value: props.profile.sex,
            onChange: function (event) { props.updateProfile("sex", event.target.value); }
          },
            h("option", null, "Male"),
            h("option", null, "Female"),
            h("option", null, "Not specified")
          )
        ),
        h("div", { className: "field" },
          h("label", { htmlFor: "focus" }, "Current focus"),
          h("input", {
            id: "focus",
            value: props.profile.primaryFocus,
            onChange: function (event) { props.updateProfile("primaryFocus", event.target.value); }
          })
        )
      )
    );
  }

  function UploadStep(props) {
    const report = props.report.report;
    const redCount = props.report.markers.filter(function (marker) { return marker.risk === "red"; }).length;
    const amberCount = props.report.markers.filter(function (marker) { return marker.risk === "amber"; }).length;

    return h(React.Fragment, null,
      h("div", { className: "panel-header" },
        h("div", null,
          h("h2", { className: "panel-title" }, "Upload the first report"),
          h("p", { className: "panel-caption" },
            "The prototype uses a demo report so no personal medical data is needed."
          )
        ),
        h("span", { className: "pill amber" }, "Demo PDF")
      ),
      h("div", { className: "upload-box" },
        h("h3", { className: "upload-title" }, "demo-bloodwork-jan-2026.pdf"),
        h("p", { className: "upload-copy" },
          "Simulated extraction is complete. The next step is human review before any marker becomes official."
        )
      ),
      h("div", { className: "report-summary" },
        h(MiniCard, { label: "Lab", value: report.labName, copy: report.source }),
        h(MiniCard, { label: "Report date", value: report.reportDate, copy: "Baseline report" }),
        h(MiniCard, { label: "OCR confidence", value: report.ocrConfidence, copy: "Source-linked rows available" }),
        h(MiniCard, { label: "Open markers", value: `${redCount} red`, copy: `${amberCount} amber markers also detected` })
      )
    );
  }

  function ReviewStep(props) {
    const completedCount = Object.values(props.confirmed).filter(Boolean).length;
    return h(React.Fragment, null,
      h("div", { className: "panel-header" },
        h("div", null,
          h("h2", { className: "panel-title" }, "Review red and amber markers"),
          h("p", { className: "panel-caption" },
            "Review should be fast: source, confidence, and action relevance are visible on each row."
          )
        ),
        h("span", { className: "pill blue" }, `${completedCount}/${props.report.markers.length} confirmed`)
      ),
      h("div", { className: "review-list" },
        props.report.markers.map(function (marker) {
          return h("article", { className: "review-row", key: marker.id },
            h("div", null,
              h("div", { className: "marker-title" }, marker.name),
              h("div", { className: "marker-subtitle" }, marker.category)
            ),
            h("div", null,
              h("div", { className: "cell-label" }, "Value"),
              h("div", { className: "cell-value" }, marker.value),
              h("div", { className: "cell-note" }, marker.range)
            ),
            h("div", null,
              h("span", { className: classNames("pill", marker.risk) }, riskLabels[marker.risk])
            ),
            h("div", null,
              h("div", { className: "cell-label" }, marker.confidence + " confidence"),
              h("div", { className: "cell-note" }, marker.source),
              h("div", { className: "cell-note" }, marker.issue)
            ),
            h("button", {
              className: classNames("confirm-button", props.confirmed[marker.id] && "active"),
              type: "button",
              onClick: function () { props.toggleMarker(marker.id); }
            }, props.confirmed[marker.id] ? "Confirmed" : "Confirm")
          );
        })
      ),
      h("p", { className: "footer-note" },
        "For the prototype, confirming at least three markers unlocks the action loop. Production would require review policy from the core docs."
      )
    );
  }

  function ActionLoopStep(props) {
    const focusAreas = props.actionLoop.focusAreas;
    return h(React.Fragment, null,
      h("div", { className: "panel-header" },
        h("div", null,
          h("h2", { className: "panel-title" }, "Start the first action loop"),
          h("p", { className: "panel-caption" },
            "The product advantage is what happens after onboarding: focus, context, retest, and comparison."
          )
        ),
        h("span", { className: "pill green" }, props.actionLoop.retestWindow)
      ),
      h("div", { className: "report-summary" },
        h(MiniCard, { label: "Draft score", value: String(props.actionLoop.score.baseline), copy: props.actionLoop.score.message }),
        h(MiniCard, { label: "Open focus areas", value: String(focusAreas.length), copy: "Grouped from reviewed markers" }),
        h(MiniCard, { label: "Retest window", value: props.actionLoop.retestWindow, copy: "Demo planning window" }),
        h(MiniCard, { label: "Next product state", value: "Action phase", copy: "Track context before next report" })
      ),
      h("div", { className: "action-grid" },
        focusAreas.map(function (area) {
          return h("article", { className: "action-card", key: area.title },
            h("h3", null, area.title),
            h("p", null, area.nextStep),
            h("div", { className: "tag-list" },
              area.markers.map(function (marker) {
                return h("span", { className: "tag", key: marker }, marker);
              })
            )
          );
        })
      ),
      h("div", { className: "notice", style: { marginTop: "14px" } },
        "This is the bridge into the existing Action Loop mock: baseline report, lifestyle phase, retest, after report, and proof of marker movement."
      )
    );
  }

  function MiniCard(props) {
    return h("div", { className: "mini-card" },
      h("div", { className: "mini-label" }, props.label),
      h("div", { className: "mini-value" }, props.value),
      h("div", { className: "mini-copy" }, props.copy)
    );
  }

  ReactDOM.createRoot(document.getElementById("root")).render(h(App));
})();
