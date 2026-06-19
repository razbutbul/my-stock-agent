import MenuIcon from "@mui/icons-material/Menu";
import AutoGraphOutlinedIcon from "@mui/icons-material/AutoGraphOutlined";
import AccountBalanceWalletOutlinedIcon from "@mui/icons-material/AccountBalanceWalletOutlined";
import QueryStatsOutlinedIcon from "@mui/icons-material/QueryStatsOutlined";
import {
  AppBar,
  Box,
  Container,
  Divider,
  Drawer,
  IconButton,
  Link,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Stack,
  Toolbar,
  Typography,
} from "@mui/material";
import type { ReactNode } from "react";
import { useState } from "react";
import { Link as RouterLink, useLocation } from "react-router-dom";
import { StatusCard } from "./StatusCard";
import { useHealth } from "../hooks/useHealth";

interface AppLayoutProps {
  children: ReactNode;
}

const navItems = [
  {
    label: "ניתוח הזדמנות",
    description: "ניתוח מניה עם AI",
    to: "/",
    icon: QueryStatsOutlinedIcon,
  },
  {
    label: "My Portfolio",
    description: "המניות המועדפות שלך",
    to: "/portfolio",
    icon: AccountBalanceWalletOutlinedIcon,
  },
];

export function AppLayout({ children }: AppLayoutProps) {
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const {
    data: health,
    loading: healthLoading,
    error: healthError,
  } = useHealth();

  const closeMenu = () => setMenuOpen(false);

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "background.default" }}>
      <AppBar
        position="sticky"
        elevation={0}
        sx={{
          bgcolor: "background.default",
          borderBottom: 1,
          borderColor: "divider",
        }}
      >
        <Toolbar sx={{ gap: 1.5, py: 1, direction: "ltr" }}>
          <IconButton
            edge="start"
            color="inherit"
            aria-label="פתח תפריט ניווט"
            onClick={() => setMenuOpen(true)}
          >
            <MenuIcon />
          </IconButton>

          <Box
            sx={{
              flexGrow: 1,
              minWidth: 0,
              direction: "rtl",
              textAlign: "right",
            }}
          >
            <Stack
              direction="row"
              spacing={1.5}
              sx={{ alignItems: "center", justifyContent: "flex-end" }}
            >
              <Box sx={{ minWidth: 0 }}>
                <Typography variant="h6" noWrap>
                  Raz Stocks Insight Agent
                </Typography>
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{ display: { xs: "none", sm: "block" } }}
                >
                  Developed by{" "}
                  <Link
                    href="https://www.linkedin.com/in/raz-butbul-07b465259/"
                    target="_blank"
                    rel="noopener noreferrer"
                    sx={{
                      color: "primary.main",
                      fontWeight: 600,
                      textDecoration: "none",
                      "&:hover": {
                        color: "primary.light",
                        textDecoration: "none",
                      },
                    }}
                  >
                    Raz Butbul
                  </Link>
                </Typography>
              </Box>
              <AutoGraphOutlinedIcon color="primary" />
            </Stack>
          </Box>

          <Box sx={{ display: { xs: "none", md: "block" } }}>
            {!healthLoading && !healthError && health && (
              <StatusCard data={health} />
            )}
            {healthError && (
              <Typography variant="caption" color="error.main">
                שרת לא זמין
              </Typography>
            )}
          </Box>
        </Toolbar>
      </AppBar>

      <Drawer
        anchor="left"
        open={menuOpen}
        onClose={closeMenu}
        slotProps={{
          paper: {
            sx: {
              width: 280,
              bgcolor: "background.default",
              borderInlineEnd: 1,
              borderColor: "divider",
            },
          },
        }}
      >
        <Box sx={{ px: 2, py: 2.5 }}>
          <Typography variant="h6">ניווט</Typography>
          <Typography variant="body2" color="text.secondary">
            בחר מסך
          </Typography>
        </Box>
        <Divider />
        <List sx={{ px: 1, py: 1 }}>
          {navItems.map(({ label, description, to, icon: Icon }) => {
            const active = location.pathname === to;

            return (
              <ListItemButton
                key={to}
                component={RouterLink}
                to={to}
                selected={active}
                onClick={closeMenu}
                sx={{
                  borderRadius: 2,
                  mb: 0.5,
                  "&.Mui-selected": {
                    bgcolor: "rgba(0, 200, 150, 0.12)",
                    "&:hover": { bgcolor: "rgba(0, 200, 150, 0.18)" },
                  },
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 40,
                    color: active ? "primary.main" : "text.secondary",
                  }}
                >
                  <Icon />
                </ListItemIcon>
                <ListItemText
                  primary={label}
                  secondary={description}
                  slotProps={{
                    primary: { sx: { fontWeight: active ? 700 : 500 } },
                  }}
                />
              </ListItemButton>
            );
          })}
        </List>
        <Divider sx={{ mt: "auto" }} />
        <Box sx={{ px: 2, py: 2 }}>
          {!healthLoading && !healthError && health && (
            <StatusCard data={health} />
          )}
          {healthError && (
            <Typography variant="caption" color="error.main">
              שרת לא זמין
            </Typography>
          )}
        </Box>
      </Drawer>

      <Container maxWidth="lg" sx={{ py: { xs: 3, md: 4 } }}>
        {children}
      </Container>
    </Box>
  );
}
