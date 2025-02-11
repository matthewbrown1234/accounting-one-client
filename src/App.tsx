import {createTheme, CssBaseline, ThemeProvider} from "@mui/material";
import SideNavigationDrawer from "./components/SideNavigationDrawer.tsx";
import ApplicationNavBar from "./components/AppBar.tsx";
import {BrowserRouter, Route, Routes} from "react-router";
import Home from "./pages/Home.tsx";
import AccountEntries from "./pages/AccountEntries.tsx";
import Accounts from "./pages/Accounts.tsx";
import {ReactNode} from "react";
import {colors} from "./globals.tsx";
import Footer from "./components/Footer.tsx";

const AppTheme = ({children}: { children: ReactNode }) => {
  return (
      <ThemeProvider theme={createTheme({
        palette: {
          primary: {
            main: colors.green,
            contrastText: "#fff",
          },
          secondary: {
            main: colors.blue,
            contrastText: "#fff",
          },
          text: {
            secondary: colors.green
          }
        }
      })}>
        {children}
      </ThemeProvider>
  )
}


function App() {
  return (
      <BrowserRouter>
        <AppTheme>
          <CssBaseline enableColorScheme/>
          <div style={{
          }}>
            <ApplicationNavBar/>
            <SideNavigationDrawer/>

            <main style={{
              flex: 1,
              marginLeft: "233px"
            }}>
              <div style={{
                paddingTop: "64px",
                paddingLeft: "17px",
                paddingRight: "17px",
              }}>
                <Routes>
                  <Route index element={<Home/>}/>
                  <Route path="/accounts" element={<Accounts/>}/>
                  <Route path="/account-entries" element={<AccountEntries/>}/>
                </Routes>
              </div>
            </main>
            <Footer />
          </div>
        </AppTheme>
      </BrowserRouter>
  )
}

export default App
