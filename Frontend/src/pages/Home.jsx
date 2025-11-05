import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";

function Home(props) {
  const location = useLocation();

  useEffect(() => {
    // Robustly wait for target element then scroll (works when element renders after navigation)
    const id = location.hash ? location.hash.replace(/^#/, "") : (location.state && location.state.scrollTo);
    if (!id) return;

    let cancelled = false;
    const start = performance.now();
    const maxWait = 1500; // ms

    const tryScroll = () => {
      if (cancelled) return;
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
        // ensure URL has hash for back/forward UX
        if (!location.hash) window.history.replaceState(null, "", `/home#${id}`);
        return;
      }
      if (performance.now() - start < maxWait) {
        requestAnimationFrame(tryScroll);
      }
    };

    requestAnimationFrame(tryScroll);

    const onHash = () => {
      const newId = window.location.hash.replace(/^#/, "");
      if (!newId) return;
      const el = document.getElementById(newId);
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    };

    window.addEventListener("hashchange", onHash);
    return () => {
      cancelled = true;
      window.removeEventListener("hashchange", onHash);
    };
  }, [location]);

  return (
    <div>
      {/* ...existing code above... */}

      {/* target element for Add Complaint */}
      <section id="complaintSubmission">
        {/* ...complaint submission form / preview... */}
      </section>

      {/* ...existing code below... */}
    </div>
  );
}

export default Home;