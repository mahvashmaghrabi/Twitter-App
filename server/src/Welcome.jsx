import './welcome.css';
import './modal.css';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Layout from './Layout';


export default function Welcome() {
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    fetch_all_post()
  }, []);

  function fetch_all_post(){
    axios.get('/post')
      .then((res) => {
        console.log('get successful!');
        setPosts(res.data);
      })
      .catch(function(error){ 
        console.log('rejected!!!')
        setIsError(true);
    })
    .finally(function() {
        console.log('loading')
        setIsLoading(false);
    })
  }

  if (isLoading) {
    return (<div>Loading....</div>)
  }

  if(isError) {
    return (<div>Unable to load!</div>)
  }

  return (
   <Layout value={{posts, fetch_all_post}}/>
  );
}
