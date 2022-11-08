import React, { useState, useEffect } from "react";
import {
  Avatar,
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
  Paper,
  ListItemText,
} from "@mui/material";
import { Link, useLocation } from "react-router-dom";
import MenuIcon from "@mui/icons-material/Menu";
import { useSelector, useDispatch } from "react-redux";
import { update, remove } from "../state/store/session";
import verify from "../functions/verify";
import logout from "../functions/logout";
import PersonSharpIcon from '@mui/icons-material/PersonSharp';

function ProfileIcon(props) {
  if (props.icon == null)
    return (
      <Avatar sx={{ m: 1, bgcolor: "info.dark" }} component={Paper} elevation={2}>
      <PersonSharpIcon />
      </Avatar>
    );
  else
    return (
      <Avatar sx={{ m: 1, bgcolor: "info.dark" }} src={props.icon} alt="P" />
    );
}

function NavDrawer() {
  const [openDrawer, setOpenDrawer] = useState(false);
  const user = useSelector((state) => state.session.value);

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
                <ListItemText>
                  {user === true ? "logout" : "login"}
                </ListItemText>
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
  const user = useSelector((state) => state.session.value);
  const location = useLocation();
  const dispatch = useDispatch();
  const [session, setSession] = useState(user);

  useEffect(() => {
    window.addEventListener("scroll", isSticky);
    (async function () {
      let valid = await verify();
      setSession(valid);
      dispatch(update(session));
    })();
    return () => {
      window.removeEventListener("scroll", isSticky);
    };
  }, [user, location, session]);

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
          {user === true && (
            <Link
              style={{ textDecoration: "none", color: "white" }}
              to="/dashboard"
            >
            <ProfileIcon />
            </Link>
          )}
          <Link
            style={{ textDecoration: "none", color: "white" }}
            to={user === true ? "/" : "/login"}
            onClick={async () => {
              await logout();
              dispatch(remove());
            }}
          >
            <Button color="inherit">
              {user === true ? "Logout" : "Login"}
            </Button>
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
