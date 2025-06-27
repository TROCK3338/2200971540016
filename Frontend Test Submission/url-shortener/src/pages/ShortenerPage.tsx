import {
  Box,
  Button,
  Container,
  Grid,
  Paper,
  TextField,
  Typography,
  Divider,
  Stack,
} from "@mui/material";
import { useState } from "react";
import { Log } from "../../../../Logging Middleware/logger";
import { useNavigate } from "react-router-dom";

type URLInput = {
  url: string;
  validity?: string;
  shortcode?: string;
};

type ShortenedResult = {
  original: string;
  shortUrl: string;
  expiry: string;
};

export default function ShortenerPage() {
  const [inputs, setInputs] = useState<URLInput[]>([{ url: "" }]);
  const [formErrors, setFormErrors] = useState<string[]>([]);
  const [results, setResults] = useState<ShortenedResult[]>([]);
  const navigate = useNavigate();

  const handleInputChange = (
    index: number,
    field: keyof URLInput,
    value: string
  ) => {
    const updated = [...inputs];
    updated[index][field] = value;
    setInputs(updated);
  };

  const handleAdd = () => {
    if (inputs.length < 5) {
      setInputs([...inputs, { url: "" }]);
      Log("info", "component", "Added new URL input field");
    }
  };

  const isValidURL = (url: string): boolean => {
    try {
      new URL(url);
      return true;
    } catch (_) {
      return false;
    }
  };

  const isAlphanumeric = (text: string) => /^[a-z0-9]+$/i.test(text);

  const handleSubmit = () => {
    const errors: string[] = [];

    inputs.forEach((input, index) => {
      if (!input.url.trim()) {
        errors.push(`URL #${index + 1} is required.`);
        Log("error", "component", `URL #${index + 1} is missing`);
      } else if (!isValidURL(input.url)) {
        errors.push(`URL #${index + 1} is invalid.`);
        Log("error", "component", `URL #${index + 1} is not a valid URL`);
      }

      if (input.validity && isNaN(Number(input.validity))) {
        errors.push(`Validity for URL #${index + 1} must be a number.`);
        Log("warn", "component", `Non-numeric validity in URL #${index + 1}`);
      }

      if (input.shortcode && !isAlphanumeric(input.shortcode)) {
        errors.push(
          `Shortcode for URL #${index + 1} must be alphanumeric.`
        );
        Log(
          "warn",
          "component",
          `Invalid shortcode format in URL #${index + 1}`
        );
      }
    });

    setFormErrors(errors);
    if (errors.length > 0) return;

    Log("info", "component", "All inputs valid. Proceeding to shorten URLs");

    const now = new Date();
    const newResults = inputs.map((input) => {
      const short =
        input.shortcode ||
        Math.random().toString(36).substring(2, 8).toLowerCase();
      const validFor =
        input.validity && !isNaN(Number(input.validity))
          ? parseInt(input.validity)
          : 30;
      const expiry = new Date(now.getTime() + validFor * 60000).toLocaleString();

      return {
        original: input.url,
        shortUrl: `http://localhost:3000/${short}`,
        expiry,
      };
    });

    setResults(newResults);
    localStorage.setItem("shortenedUrls", JSON.stringify(newResults));
    Log("info", "component", "Short URLs generated");
  };

  return (
    <Container maxWidth="md" sx={{ py: 6 }}>
      <Paper elevation={3} sx={{ p: 4, borderRadius: 3 }}>
        <Typography variant="h4" gutterBottom>
          🔗 URL Shortener
        </Typography>

        {formErrors.length > 0 && (
          <Box mb={2}>
            {formErrors.map((err, i) => (
              <Typography key={i} color="error">
                {err}
              </Typography>
            ))}
          </Box>
        )}

        <Stack spacing={3}>
          {inputs.map((input, index) => (
            <Paper key={index} sx={{ p: 3, backgroundColor: "#f9f9f9" }}>
              <Typography variant="subtitle1" gutterBottom>
                URL #{index + 1}
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <TextField
                    label="Original URL"
                    fullWidth
                    required
                    value={input.url}
                    onChange={(e) =>
                      handleInputChange(index, "url", e.target.value)
                    }
                  />
                </Grid>
                <Grid item xs={6} md={3}>
                  <TextField
                    label="Validity (mins)"
                    fullWidth
                    value={input.validity || ""}
                    onChange={(e) =>
                      handleInputChange(index, "validity", e.target.value)
                    }
                  />
                </Grid>
                <Grid item xs={6} md={3}>
                  <TextField
                    label="Custom Shortcode"
                    fullWidth
                    value={input.shortcode || ""}
                    onChange={(e) =>
                      handleInputChange(index, "shortcode", e.target.value)
                    }
                  />
                </Grid>
              </Grid>
            </Paper>
          ))}

          <Box display="flex" justifyContent="space-between" gap={2}>
            <Button
              variant="outlined"
              onClick={handleAdd}
              disabled={inputs.length >= 5}
            >
              ➕ Add URL
            </Button>
            <Button variant="contained" onClick={handleSubmit}>
              🚀 Shorten All
            </Button>
          </Box>
        </Stack>

        {results.length > 0 && (
          <Box mt={5}>
            <Divider sx={{ mb: 2 }} />
            <Typography variant="h6" gutterBottom>
              🎉 Shortened Results
            </Typography>
            <Stack spacing={2}>
              {results.map((res, idx) => (
                <Paper key={idx} sx={{ p: 2, border: "1px solid #ddd" }}>
                  <Typography>
                    <strong>Original:</strong> {res.original}
                  </Typography>
                  <Typography>
                    <strong>Short URL:</strong>{" "}
                    <a
                      href={res.shortUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {res.shortUrl}
                    </a>
                  </Typography>
                  <Typography>
                    <strong>Expires at:</strong> {res.expiry}
                  </Typography>
                </Paper>
              ))}
            </Stack>
          </Box>
        )}
      </Paper>
    </Container>
  );
}
