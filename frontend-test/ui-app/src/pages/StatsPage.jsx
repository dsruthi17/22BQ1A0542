import React, { useEffect, useState } from "react";
import { Container, Typography, Paper, Button, Divider } from "@mui/material";
import { logEvent } from "../utils/logger";

const accessToken = "your_access_token"; // paste again

const StatsPage = () => {
  const [urls, setUrls] = useState([]);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("shortenedURLs")) || [];
    const enhanced = stored.map((u) => ({
      ...u,
      clicks: u.clicks || [],
    }));
    setUrls(enhanced);

    logEvent("frontend", "info", "page", "Stats page loaded", accessToken);
  }, []);

  const handleMockClick = (index) => {
    const updated = [...urls];
    const now = new Date();
    updated[index].clicks.push({
      time: now.toLocaleString(),
      source: "direct",
      location: "India",
    });

    setUrls(updated);
    localStorage.setItem("shortenedURLs", JSON.stringify(updated));

    logEvent(
      "frontend",
      "info",
      "component",
      `Click recorded on ${updated[index].shortUrl}`,
      accessToken
    );
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        URL Statistics
      </Typography>

      {urls.map((u, i) => (
        <Paper key={i} style={{ padding: 16, marginBottom: 20 }}>
          <Typography variant="body1">
            <strong>Original URL:</strong> {u.longUrl}
          </Typography>
          <Typography variant="body1">
            <strong>Short URL:</strong>{" "}
            <a href={u.shortUrl} target="_blank" rel="noreferrer">
              {u.shortUrl}
            </a>
          </Typography>
          <Typography variant="body2">Expiry: {u.expiry}</Typography>
          <Typography variant="body2">
            Total Clicks: {u.clicks.length}
          </Typography>

          <Button
            onClick={() => handleMockClick(i)}
            variant="outlined"
            size="small"
            sx={{ mt: 1 }}
          >
            Simulate Click
          </Button>

          <Divider sx={{ my: 2 }} />
          <Typography variant="subtitle1">Click Logs:</Typography>
          {u.clicks.length === 0 && <p>No clicks yet.</p>}
          {u.clicks.map((c, idx) => (
            <div key={idx} style={{ marginBottom: 6 }}>
              <small>
                📍 <strong>Time:</strong> {c.time} | <strong>Source:</strong>{" "}
                {c.source} | <strong>Location:</strong> {c.location}
              </small>
            </div>
          ))}
        </Paper>
      ))}
    </Container>
  );
};

export default StatsPage;
