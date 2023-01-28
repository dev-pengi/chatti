import { Box, Button, Text } from '@chakra-ui/react';
import { useState } from 'react'
import { FaSearch } from "react-icons/fa";
import './style.css'

const SideDrawer = () => {
    const [search, setSearch] = useState("")
    const [results, setResults] = useState([])
    const [loading, setLoading] = useState(false)
    const [loadingChat, setLoadingChat] = useState(false)



    return (
        <div className='top-bar'>
            <Button variant="ghost">
                <FaSearch />
                <Text display={{ base: 'none', md: 'flex' }} px="3">
                    Search user
                </Text>
            </Button>
            <h1>Chatti</h1>
        </div>
    )
}

export default SideDrawer