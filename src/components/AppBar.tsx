import {AppBar, Toolbar, Typography} from "@mui/material";

export default function ApplicationNavBar() {
  return (<AppBar position={"fixed"} sx={{zIndex: (theme) => theme.zIndex.drawer + 1, color: "#fff", background: "#00bb7e"}}>
    <Toolbar>
      <Typography variant="h6" component="div" noWrap>
        Accounting One
      </Typography>
    </Toolbar>
  </AppBar>);
}
