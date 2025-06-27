import {
  Box,
  Container,
  Typography,
  Divider,
} from "@mui/material";
import { useEffect, useState } from "react";

type ShortenedResult = {
  original: string;
  shortUrl: string;
  expiry: string;
};

type ClickMetadata = {
  timestamp: string;
  source: string;
  location: string;
};

export default function StatsPage() {
  const [urls, setUrls] = useState<ShortenedResult[]>([]);
  const [clicks, setClicks] = useState<Record<string, ClickMetadata[]>>({});

  useEffect(() => {
    const data = sessionStorage.getItem("shortenedUrls");
    if (data) {
      const parsed: ShortenedResult[] = JSON.parse(data);
      setUrls(parsed);

      // Fake click metadata for demo
      const clickMap: Record<string, ClickMetadata[]> = {};
      parsed.forEach((url) => {
        clickMap[url.shortUrl] = [
          {
            timestamp: new Date().toLocaleString(),
            source: "Direct",
            location: "India",
          },
          {
            timestamp: new Date().toLocaleString(),
            source: "Facebook",
            location: "USA",
          },
        ];
      });

      setClicks(clickMap);
    }
  }, []);

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>
        Shortened URL Statistics
      </Typography>

      {urls.map((url, idx) => (
        <Box key={idx} sx={{ mb: 4, p: 2, border: "1px solid #ccc", borderRadius: 2 }}>
          <Typography><strong>Original URL:</strong> {url.original}</Typography>
          <Typography><strong>Short URL:</strong> {url.shortUrl}</Typography>
          <Typography><strong>Expires At:</strong> {url.expiry}</Typography>
          <Typography><strong>Total Clicks:</strong> {clicks[url.shortUrl]?.length || 0}</Typography>

          {clicks[url.shortUrl]?.length > 0 && (
            <Box mt={2}>
              <Typography variant="subtitle1">Click Details:</Typography>
              <Divider sx={{ mb: 1 }} />
              {clicks[url.shortUrl].map((click, i) => (
                <Box key={i} sx={{ mb: 1 }}>
                  <Typography>📅 {click.timestamp}</Typography>
                  <Typography>🔗 Source: {click.source}</Typography>
                  <Typography>🌍 Location: {click.location}</Typography>
                  <Divider />
                </Box>
              ))}
            </Box>
          )}
        </Box>
      ))}
    </Container>
  );
}