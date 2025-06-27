import {
  Box,
  Button,
  Container,
  Grid,
  Paper,
  TextField,
  Typography,
  Divider,
  Chip,
  useTheme
} from "@mui/material";
import { useState } from "react";
import { Log } from "../../../Logging Middleware/logger";
import { motion } from "framer-motion";

import ContentCopyIcon from "@mui/icons-material/ContentCopy";

import { useNavigate } from "react-router-dom";

const gradientBg = {
  background: "linear-gradient(to right, #e0eafc, #cfdef3)",
  minHeight: "100vh",
  py: 6,
};

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
        errors.push(`Shortcode for URL #${index + 1} must be alphanumeric.`);
        Log("warn", "component", `Invalid shortcode format in URL #${index + 1}`);
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
    Log("info", "component", "Short URLs generated");
    localStorage.setItem("shortenedUrls", JSON.stringify(newResults));
  };

  return (
    <Box sx={gradientBg}>
      <Container maxWidth="md">
        <Paper elevation={5} sx={{ p: 5, borderRadius: 4, backgroundColor: "#ffffffcc" }}>
          <Typography variant="h4" gutterBottom sx={{ fontWeight: 600 }}>
            🔗 SnapURL
          </Typography>
          <Divider sx={{ mb: 3 }} />

          {formErrors.length > 0 && (
            <Box mb={2}>
              {formErrors.map((err, i) => (
                <Typography key={i} color="error">
                  {err}
                </Typography>
              ))}
            </Box>
          )}

          {inputs.map((input, index) => (
            <Box
              key={index}
              sx={{
                mb: 3,
                p: 2,
                border: "1px solid #ccc",
                borderRadius: 2,
                backgroundColor: "#fdfdfd",
              }}
            >
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
            </Box>
          ))}

          <Box display="flex" gap={2} mb={4}>
            <Button
              variant="outlined"
              onClick={handleAdd}
              disabled={inputs.length >= 5}
            >
              Add Another URL
            </Button>
            <Button variant="contained" onClick={handleSubmit}>
              Shorten URLs
            </Button>
          </Box>

          {results.length > 0 && (
            <Box mt={4}>
              <Typography variant="h6" gutterBottom>
                🎉 Shortened Results
              </Typography>
              <Divider sx={{ mb: 2 }} />
              {results.map((res, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: idx * 0.05 }}
                >
                  <Paper
                    elevation={3}
                    sx={{
                      p: 2,
                      borderRadius: 2,
                      mb: 2,
                      backgroundColor: "#fafafa",
                      borderLeft: "6px solid #1976d2",
                    }}
                  >
                    <Typography sx={{ wordBreak: "break-word" }}>
                      <strong>Original:</strong> {res.original}
                    </Typography>
                    <Typography>
                      <strong>Short URL:</strong>{" "}
                      <a href={res.shortUrl} target="_blank" rel="noopener noreferrer">
                        {res.shortUrl}
                      </a>
                    </Typography>
                    <Chip
                      label={`Expires at: ${res.expiry}`}
                      color="warning"
                      variant="outlined"
                      sx={{ mt: 1 }}
                    />
                  </Paper>
                </motion.div>
              ))}
            </Box>
          )}
        </Paper>
      </Container>
    </Box>
  );
}