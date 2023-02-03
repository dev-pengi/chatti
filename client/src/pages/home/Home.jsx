import { Box, Container, Text, Tabs, TabList, TabPanels, Tab, TabPanel } from "@chakra-ui/react"
import { useEffect } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import Login from "../../components/Authentication/Login"
import SignUp from "../../components/Authentication/SignUp"
import { ChatState } from "../../Context/ChatProvider"
import './home.css'
const Home = () => {

    const { user } = ChatState()
    const navigate = useNavigate();

    useEffect(() => {
        if (user) navigate('/chats')
    }, [user])

    return (
        <div className="loginContainer">
            <div className="loginBox" >
                <h1 className="title">Chatti</h1>
                <Tabs variant='soft-rounded' colorScheme={"whiteAlpha"}>
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