import { useState, useEffect } from "react";
import {Alert} from "react-native"

// this is a hook to reuse the data from Appwrite

const useAppwrite = (fn) => {

    const [data, setData] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    
    const fetchData = async () => {
        setIsLoading (true);
            
            try {
                const response = await fn (); 
                
                setData(response)
                
            } catch (error) {
                Alert.alert ('Error', error.message)
                
            } finally {
                setIsLoading (false)
            }
        }
        
    useEffect (() => {
        fetchData (); 
        
    }, []);
    
    const refetch = () => fetchData ();
    
    return {data, isLoading, refetch}
}

export default useAppwrite