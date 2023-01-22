import { Box, Container, Text, Tabs, TabList, TabPanels, Tab, TabPanel } from "@chakra-ui/react"
import Login from "../../components/Authentication/Login"
import SignUp from "../../components/Authentication/SignUp"
import './home.css'
const Home = () => {
    return (
        <div className="loginContainer">
            <div className="titleBox">
                <h1>Talk A-live</h1>
            </div>
            <div className="loginBox" >
                <Tabs variant='soft-rounded' >
                    <TabList mb="1em">
                        <Tab marginLeft="12px" width="100%">Login</Tab>
                        <Tab marginRight="12px" width="100%">Sign up</Tab>
                    </TabList>
                    <TabPanels>
                        <TabPanel>
                            <Login />
                        </TabPanel>
                        <TabPanel>
                            <SignUp />
                        </TabPanel>
                    </TabPanels>
                </Tabs>
            </div>
        </div>
    )
}

export default Home