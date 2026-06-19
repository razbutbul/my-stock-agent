import AutoGraphOutlinedIcon from '@mui/icons-material/AutoGraphOutlined';
import AccountBalanceWalletOutlinedIcon from '@mui/icons-material/AccountBalanceWalletOutlined';
import QueryStatsOutlinedIcon from '@mui/icons-material/QueryStatsOutlined';
import {
  AppBar,
  Box,
  Button,
  Container,
  Link,
  Stack,
  Toolbar,
  Typography,
} from '@mui/material';
import type { ReactNode } from 'react';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import { StatusCard } from './StatusCard';
import { useHealth } from '../hooks/useHealth';

interface AppLayoutProps {
  children: ReactNode;
}

const navItems = [
  { label: 'ניתוח', to: '/', icon: QueryStatsOutlinedIcon },
  { label: 'My Portfolio', to: '/portfolio', icon: AccountBalanceWalletOutlinedIcon },
];

export function AppLayout({ children }: AppLayoutProps) {
  const location = useLocation();
  const {
    data: health,
    loading: healthLoading,
    error: healthError,
  } = useHealth();

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      <AppBar position="sticky" elevation={0} color="transparent">
        <Toolbar
          sx={{
            borderBottom: 1,
            borderColor: 'divider',
            flexWrap: 'wrap',
            gap: 1.5,
            py: 1,
          }}
        >
          <AutoGraphOutlinedIcon color="primary" sx={{ ml: 1 }} />
          <Box sx={{ flexGrow: 1, minWidth: 200 }}>
            <Typography variant="h6">Smart Stock Insight Agent</Typography>
            <Typography variant="caption" color="text.secondary">
              Developed by{' '}
              <Link
                href="https://www.linkedin.com/in/raz-butbul-07b465259/"
                target="_blank"
                rel="noopener noreferrer"
                sx={{
                  color: 'primary.main',
                  fontWeight: 600,
                  textDecoration: 'none',
                  transition: 'color 0.2s ease',
                  '&:hover': {
                    color: 'primary.light',
                    textDecoration: 'none',
                  },
                }}
              >
                Raz Butbul
              </Link>
            </Typography>
          </Box>

          <Stack direction="row" spacing={1.5} sx={{ flexWrap: 'wrap' }}>
            {navItems.map(({ label, to, icon: Icon }) => {
              const active = location.pathname === to;

              return (
                <Button
                  key={to}
                  component={RouterLink}
                  to={to}
                  variant="text"
                  color="inherit"
                  startIcon={<Icon color={active ? 'primary' : 'inherit'} />}
                  sx={{
                    color: active ? 'primary.main' : 'text.secondary',
                    fontWeight: active ? 700 : 500,
                    whiteSpace: 'nowrap',
                  }}
                >
                  {label}
                </Button>
              );
            })}
          </Stack>

          {!healthLoading && !healthError && health && <StatusCard data={health} />}
          {healthError && (
            <Typography variant="caption" color="error.main">
              שרת לא זמין
            </Typography>
          )}
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ py: { xs: 3, md: 4 } }}>
        {children}
      </Container>
    </Box>
  );
}
