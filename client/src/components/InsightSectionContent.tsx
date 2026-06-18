import { Box, List, ListItem, ListItemText, Typography } from '@mui/material';

interface InsightSectionContentProps {
  content: string;
}

function isBulletLine(line: string): boolean {
  return /^[-*•]\s+/.test(line.trim());
}

function stripBullet(line: string): string {
  return line.trim().replace(/^[-*•]\s+/, '');
}

export function InsightSectionContent({ content }: InsightSectionContentProps) {
  const lines = content
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean);

  const bullets = lines.filter(isBulletLine);
  const paragraphs = lines.filter((line) => !isBulletLine(line));

  return (
    <Box>
      {paragraphs.map((paragraph) => (
        <Typography
          key={paragraph}
          variant="body2"
          color="text.secondary"
          sx={{ mb: bullets.length > 0 ? 1.5 : 0, lineHeight: 1.7 }}
        >
          {paragraph}
        </Typography>
      ))}

      {bullets.length > 0 && (
        <List dense disablePadding sx={{ py: 0 }}>
          {bullets.map((bullet) => (
            <ListItem key={bullet} disableGutters sx={{ py: 0.35 }}>
              <ListItemText
                primary={stripBullet(bullet)}
                slotProps={{
                  primary: {
                    variant: 'body2',
                    color: 'text.secondary',
                    sx: { lineHeight: 1.6 },
                  },
                }}
              />
            </ListItem>
          ))}
        </List>
      )}
    </Box>
  );
}
