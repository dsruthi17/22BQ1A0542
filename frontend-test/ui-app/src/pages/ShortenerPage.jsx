// src/pages/ShortenerPage.jsx
import React, { useState } from "react";
import {
  Container,
  Typography,
  TextField,
  Button,
  Grid,
  Paper,
} from "@mui/material";
import { v4 as uuidv4 } from "uuid";
import { logEvent } from "../utils/logger";

const accessToken =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiYXVkIjoiaHR0cDovLzIwLjI0NC41Ni4xNDQvZXZhbHVhdGlvbi1zZXJ2aWNlIiwiZW1haWwiOiIyMmJxMWEwNTQyQHZ2aXQubmV0IiwiZXhwIjoxNzU0MDI4MTA0LCJpYXQiOjE3NTQwMjcyMDQsImlzcyI6IkFmZm9yZCBNZWRpY2FsIFRlY2hub2xvZ2llcyBQcml2YXRlIExpbWl0ZWQiLCJqdGkiOiIxNTFkNTljYS1jNTM3LTQwNTUtYjhkNS1mYzM1ODI2NzA1M2EiLCJsb2NhbGUiOiJlbi1JTiIsIm5hbWUiOiJkYW1hcmxhIHNydXRoaSBzcmVlIiwic3ViIjoiNmY5MTIyYmItZmY4Zi00MGY1LWJlNjAtZDM3MmJkYzMxMzU5In0sImVtYWlsIjoiMjJicTFhMDU0MkB2dml0Lm5ldCIsIm5hbWUiOiJkYW1hcmxhIHNydXRoaSBzcmVlIiwicm9sbE5vIjoiMjJicTFhMDU0MiIsImFjY2Vzc0NvZGUiOiJQblZCRlYiLCJjbGllbnRJRCI6IjZmOTEyMmJiLWZmOGYtNDBmNS1iZTYwLWQzNzJiZGMzMTM1OSIsImNsaWVudFNlY3JldCI6IktjR0h2eFlUSHZqQ2VGRGMifQ.Wrm1TdeTOMTEZndsQ8CeGFIrgUtHKl3hCP7fVNKo0n8";

const ShortenerPage = () => {
  const [inputs, setInputs] = useState([
    { longUrl: "", shortcode: "", validity: "" },
  ]);
  const [results, setResults] = useState([]);

  const handleChange = (index, field, value) => {
    const updated = [...inputs];
    updated[index][field] = value;
    setInputs(updated);
  };

  const addInput = () => {
    if (inputs.length < 5) {
      setInputs([...inputs, { longUrl: "", shortcode: "", validity: "" }]);
    }
  };

  const isValidUrl = (url) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const handleSubmit = async () => {
    const newResults = [];

    for (let i = 0; i < inputs.length; i++) {
      const { longUrl, shortcode, validity } = inputs[i];

      if (!isValidUrl(longUrl)) {
        alert(`Invalid URL at row ${i + 1}`);
        logEvent(
          "frontend",
          "error",
          "component",
          `Invalid URL at row ${i + 1}`,
          accessToken
        );
        continue;
      }

      const short = shortcode || uuidv4().slice(0, 6);
      const validFor = validity ? parseInt(validity) : 30;
      const now = new Date();
      const expiry = new Date(now.getTime() + validFor * 60000);

      newResults.push({
        shortUrl: `http://localhost:3000/${short}`,
        longUrl,
        expiry: expiry.toLocaleString(),
      });

      logEvent(
        "frontend",
        "info",
        "component",
        `Shortened URL created for row ${i + 1}`,
        accessToken
      );
    }

    setResults(newResults);
    const previous = JSON.parse(localStorage.getItem("shortenedURLs")) || [];
    const combined = [...previous, ...newResults];
    localStorage.setItem("shortenedURLs", JSON.stringify(combined));
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        URL Shortener
      </Typography>

      {inputs.map((input, index) => (
        <Paper key={index} style={{ padding: 16, marginBottom: 10 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Long URL"
                fullWidth
                value={input.longUrl}
                onChange={(e) => handleChange(index, "longUrl", e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={3}>
              <TextField
                label="Preferred Shortcode (optional)"
                fullWidth
                value={input.shortcode}
                onChange={(e) =>
                  handleChange(index, "shortcode", e.target.value)
                }
              />
            </Grid>
            <Grid item xs={12} sm={3}>
              <TextField
                label="Validity (mins)"
                fullWidth
                type="number"
                value={input.validity}
                onChange={(e) =>
                  handleChange(index, "validity", e.target.value)
                }
              />
            </Grid>
          </Grid>
        </Paper>
      ))}

      <Button onClick={addInput} disabled={inputs.length >= 5}>
        + Add More
      </Button>
      <br />
      <br />
      <Button variant="contained" color="primary" onClick={handleSubmit}>
        Shorten URLs
      </Button>

      <Typography variant="h5" mt={4}>
        Results
      </Typography>
      {results.map((result, idx) => (
        <Paper key={idx} style={{ padding: 10, margin: 10 }}>
          <p>Original URL: {result.longUrl}</p>
          <p>
            Short URL:{" "}
            <a href={result.shortUrl} target="_blank" rel="noreferrer">
              {result.shortUrl}
            </a>
          </p>
          <p>Expires At: {result.expiry}</p>
        </Paper>
      ))}
    </Container>
  );
};

export default ShortenerPage;
