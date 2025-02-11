import {Typography} from "@mui/material";


export default function Home() {
  return (
    <div>
      <Typography fontSize={"x-large"} component={"h5"} style={{
        paddingTop: "5px",
        paddingBottom: "5px",
      }}>Home</Typography>
      <Typography fontSize={"large"}>
        👋 Hello, my name is Matthew Brown. Feel free to look around. I have my LinkedIn, and GitHub linked in the footer.
      </Typography>
    </div>
  )
}
