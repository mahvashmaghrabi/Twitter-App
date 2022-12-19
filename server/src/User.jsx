import './welcome.css';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import axios from 'axios';
import Layout from './Layout';

export default function User() {
    const params = useParams();
    const [posts, setPosts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isError, setIsError] = useState(false);
    const [description_fetched, setDescription] = useState('');
    const username = params.username;

    useEffect(()=>{

        fetch_post_for_user(username);
        fetch_user_info(username);
    },[])

    function fetch_user_info(username){
        axios.get("/user/" + username)
            .then((res) => {
                setDescription(res.data.description);
            }).catch((err) => {
                console.log(err)
            })
    }

    function fetch_post_for_user(username){
        axios.get("/post/" + username)
        .then((res)=>{
            console.log('get successful! ');
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
        return (<div>Could not find User with username: {username}</div>)
    }

    return (
      <Layout value={{posts, fetch_post_for_user, username, description_fetched, setDescription, fetch_user_info}}/>
    )
}