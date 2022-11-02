import React, { useState, useEffect } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  useTheme,
  Drawer,
  useMediaQuery,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import { Link } from "react-router-dom";
import MenuIcon from "@mui/icons-material/Menu";

function NavDrawer() {
  const [openDrawer, setOpenDrawer] = useState(false);

  return (
    <>
      <Drawer
        PaperProps={{
          sx: { width: "50%" },
        }}
        open={openDrawer}
        onClose={() => setOpenDrawer(false)}
      >
        <List>
          <Link style={{ textDecoration: "none", color: "black" }} to="/">
            <ListItem onClick={() => setOpenDrawer(false)}>
              <Button color="inherit">
                <ListItemText>Home</ListItemText>
              </Button>
            </ListItem>
          </Link>
          <Link style={{ textDecoration: "none", color: "black" }} to="/blog">
            <ListItem onClick={() => setOpenDrawer(false)}>
              <Button color="inherit">
                <ListItemText>Blog</ListItemText>
              </Button>
            </ListItem>
          </Link>
          <Link style={{ textDecoration: "none", color: "black" }} to="/login">
            <ListItem onClick={() => setOpenDrawer(false)}>
              <Button color="inherit">
                <ListItemText>Login</ListItemText>
              </Button>
            </ListItem>
          </Link>
        </List>
      </Drawer>
      <IconButton
        edge="start"
        color="inherit"
        aria-label="menu"
        sx={{ mr: 2 }}
        onClick={() => setOpenDrawer(!openDrawer)}
      >
        <MenuIcon />
      </IconButton>
    </>
  );
}

export default function Navbar() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [sticky, setSticky] = useState(false);

  useEffect(() => {
    window.addEventListener("scroll", isSticky);
    return () => {
      window.removeEventListener("scroll", isSticky);
    };
  }, []);

  const isSticky = () => {
    const scrollTop = window.scrollY;
    const stickyClass = scrollTop >= 1 ? true : false;
    setSticky(stickyClass);
  };

  return (
    <>
      <AppBar
        elevation={sticky === true ? 2 : 0}
        position={sticky === true ? "sticky" : "static"}
        sx={{ flexGrow: 1, bgcolor: theme.palette.primary.dark }}
      >
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            <Link style={{ textDecoration: "none", color: "white" }} to="/">
              Custom
            </Link>
            {isMobile === false && (
              <>
                <Link style={{ textDecoration: "none", color: "white" }} to="/">
                  <Button
                    style={{ marginLeft: theme.spacing(1) }}
                    color="inherit"
                  >
                    Home
                  </Button>
                </Link>
                <Link
                  style={{ textDecoration: "none", color: "white" }}
                  to="/blog"
                >
                  <Button
                    style={{ marginLeft: theme.spacing(1) }}
                    color="inherit"
                  >
                    Blog
                  </Button>
                </Link>
              </>
            )}
          </Typography>
          <Link style={{ textDecoration: "none", color: "white" }} to="/login">
            <Button color="inherit"> Login</Button>
          </Link>
          {isMobile === true && (
            <>
              <NavDrawer />
            </>
          )}
        </Toolbar>
      </AppBar>
    </>
  );
}
