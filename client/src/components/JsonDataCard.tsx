import { Box, Card, CardContent, Typography } from "@mui/material";

interface JsonDataCardProps {
  data: unknown;
}

export function JsonDataCard({ data }: JsonDataCardProps) {
  return (
    <Card variant="outlined">
      <CardContent>
        <Typography
          variant="caption"
          color="text.secondary"
          sx={{ mb: 1, display: "block" }}
        ></Typography>
        <Box
          component="pre"
          sx={{
            m: 0,
            p: 1.5,
            borderRadius: 2,
            bgcolor: "rgba(255,255,255,0.03)",
            border: "1px solid rgba(255,255,255,0.06)",
            overflow: "auto",
            maxHeight: 420,
            fontSize: "0.78rem",
            lineHeight: 1.5,
            whiteSpace: "pre-wrap",
            wordBreak: "break-word",
          }}
        >
          {JSON.stringify(data, null, 2)}
        </Box>
      </CardContent>
    </Card>
  );
}
