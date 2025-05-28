import {useState, useEffect} from 'react'

const useFetchData = (url, options) => {
  const [data, setData] = useState([]);
    useEffect(() => {
        if(!url) return
        const fetchData = async () => {
            try {
                const response = await fetch(url, options)
                if (!response.ok) {
                    throw new Error(`HTTP error status: ${response.status}`);
                }
                const json = await response.json()
                setData(json);
            } catch (error) {
                throw new Error(`HTTP error status: ${response.status}`);
            }
        }
        fetchData();
    }, [url, options]);
  return data;
}

export default useFetchData
