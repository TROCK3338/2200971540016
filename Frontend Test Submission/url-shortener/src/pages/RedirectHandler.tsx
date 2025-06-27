import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Log } from "../logging/logger";

interface ShortenedResult {
  original: string;
  shortUrl: string;
  expiry: string;
}

export default function RedirectHandler() {
  const { shortcode } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (!shortcode) {
      Log("error", "page", "No shortcode provided in URL");
      alert("Invalid short URL.");
      navigate("/");
      return;
    }

    const stored = localStorage.getItem("shortenedUrls");
    if (!stored) {
      Log("error", "page", "No shortened URLs found in session");
      alert("No short URL data found.");
      navigate("/");
      return;
    }

    const links: ShortenedResult[] = JSON.parse(stored);
    const matched = links.find((link) =>
      link.shortUrl.endsWith(`/${shortcode}`)
    );

    if (!matched) {
      Log("warn", "page", `Shortcode '${shortcode}' not matched`);
      alert("Short URL not found.");
      navigate("/");
      return;
    }

    const expiryTime = new Date(matched.expiry).getTime();
    if (Date.now() > expiryTime) {
      Log("info", "page", `Shortcode '${shortcode}' is expired`);
      alert("This short URL has expired.");
      navigate("/");
      return;
    }

    Log("info", "page", `Redirecting to '${matched.original}' from shortcode '${shortcode}'`);
    window.location.href = matched.original;
  }, [shortcode, navigate]);

  return <p>Redirecting...</p>;
}