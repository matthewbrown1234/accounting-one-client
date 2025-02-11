import {Divider} from "@mui/material";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import GithubIcon from "@mui/icons-material/GitHub";

export default function Footer() {
  return <footer
      style={{
        paddingTop: "17px",
        marginLeft: "233px",
        paddingLeft: "17px",
        paddingRight: "17px",
      }}>
    <Divider/>
    <div style={{
      paddingTop: "5px",
      display: "flex",
      justifyContent: "end",
    }}>
      <a href={"https://www.linkedin.com/in/matthew-brown-0253b080/"}><LinkedInIcon
          color={"primary"}/></a>
      <a href={"https://github.com/matthewbrown1234"}><GithubIcon color={"primary"}/></a>
    </div>
  </footer>
}
