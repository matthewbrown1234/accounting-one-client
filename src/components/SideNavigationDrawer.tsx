import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar
} from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import BusinessIcon from "@mui/icons-material/Business";
import FormatListNumberedIcon from "@mui/icons-material/FormatListNumbered";
import {Link} from "react-router";
import {colors} from "../globals.tsx";

export const drawerWidth = 240;

export default function SideNavigationDrawer() {
  return <Drawer variant={"permanent"} anchor={"left"} sx={{
    width: drawerWidth,
    flexShrink: 0,
    '& .MuiDrawer-paper': {
      width: drawerWidth,
      boxSizing: 'border-box',
    },
  }}>
    <Toolbar/>
    <div style={{overflow: "auto", color: colors.green}}>
      <List>
        <ListItem disablePadding>
          <ListItemButton component={Link} to={"/"}>
            <ListItemIcon>
              <HomeIcon color={"primary"}/>
            </ListItemIcon>
            <ListItemText primary={"Home"}/>
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
          <ListItemButton component={Link} to={"/accounts"}>
            <ListItemIcon>
              <BusinessIcon color={"primary"}/>
            </ListItemIcon>
            <ListItemText primary={"Accounts"}/>
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
          <ListItemButton component={Link} to={"/account-entries"}>
            <ListItemIcon>
              <FormatListNumberedIcon color={"primary"}/>
            </ListItemIcon>
            <ListItemText primary={"Account Entries"}/>
          </ListItemButton>
        </ListItem>
      </List>
    </div>
  </Drawer>
}
