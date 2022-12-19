import './welcome.css';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import axios from 'axios';
import { useNavigate} from 'react-router-dom';

export default function Layout(props) {
    const navigate = useNavigate();

    const app_state = props.value;
    const path_name = app_state.username;
    const posts = app_state.posts;
    const description_fetch = app_state.description_fetched;
    const update_descrip_display = app_state.setDescription;
    const fetch = (app_state.fetch_all_post !== undefined)? app_state.fetch_all_post : app_state.fetch_post_for_user;
    const fetch_descrip = app_state.fetch_user_info;
    const [isLogin, setIsLogin] = useState(false);
    const [login_name, setLoginName] = useState("");

    useEffect(() => {
      axios.get('/user/isLoggedIn')
      .then((res) => {
        setIsLogin(true);
        setLoginName(res.data);
      }).catch((err) => {
        console.log(err)
      })
    }, [])


    function showAllPost(){
      const postlist = [];
      posts.forEach((data) => {
        postlist.push(createPostTag(data._id, data.content, data.username, data.created, data.updated))
      })
      return postlist;
    }
  
    function createPostTag(id, content, username, create, update){
      if(path_name !== undefined && isLogin && path_name === login_name){
        return(
          <div>
            <div> 
              id: {id}
              <button className="button delete" onClick={() => onClick_delete_post(id)}>x</button>
            </div>
            <div>
              content: {content}
              <button className="button delete" onClick={() => onClick_content_modal(id)}>~</button>
            </div>
            <div className='name_display' onClick={() => onClick_visit_user(username)}>
                @{username}
            </div>
            <div>create: {create}</div>
            <div>update: {update}</div>
          </div>
        )
      }else{
      return (
        <div>
          <div> 
            id: {id}
          </div>
          <div>
            content: {content}
          </div>
          <div className='name_display' onClick={() => onClick_visit_user(username)}>
              @{username}
          </div>
          <div>create: {create}</div>
          <div>update: {update}</div>
        </div>)
      };
    }
  
    const [modal, setModal] = useState(false);
    const [modal_register_success, setModal_register_success] = useState(false);
    const [modal_login, setModal_login] = useState(false);
    const [modal_post, setModal_post] = useState(false);
    const [modal_description_update, setDescriptionModal] = useState(false);
    const [modal_content_update, setContentModal] = useState(false);
  
    const [name, setName] = useState('');
    const [content, setContent] = useState('');
    const [description, setDescription] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [selected_id, setId] = useState(0);
    
  
    function onClick_description_modal(){
      setDescriptionModal(!modal_description_update);
    }

    function onClick_content_modal(id){
      setContentModal(!modal_content_update)
      setId(id);
    }

    function onClick_Post(){
      setModal_post(!modal_post);
    }

    function onClick_reg_success(){
      setModal_register_success(!modal_register_success);
      setName('');
      setPassword("");
    }
  
    function onClick_home(){
      navigate("/");
    }
  
    function onClick_register() {
      setModal(!modal);
      setPassword("");
      setDescription("");
    }

    function onClick_login(){
        setModal_login(!modal_login);
        setPassword("");
    }

    function update_post_content(event){
      setContent(event.target.value);
    }

    function update_description(event){
      setDescription(event.target.value);
    }

  
    function updateName(event){
      setName(event.target.value);
    }
  
    function updatePassword(event){
      setPassword(event.target.value);
    }

    function onClick_visit_user(input_name){
        navigate("/" + input_name);
        fetch(input_name);
        fetch_descrip(input_name);
    }

    function login(){
        axios.post("/user/authenticate", {
            username: name,
            password: password,
        }).then((res) => {
            console.log("You logged in! " + name)
            setIsLogin(true);
            setLoginName(res.data.username);
            setModal_login(!modal_login);
        }
        ).catch((err) => {
            console.log(err)
        })
    }

    function logout(){
        axios.post("/user/logOut")
            .then(() => {
                location.reload();
            })
    }
  
    function createUser(){
      axios.post("/user/register",{
        username: name,
        password: password,
        description
      })
      .then(() => {
        setModal(!modal);
        setPassword("");
        setModal_register_success(!modal_register_success);
        setError("");
      })
      .catch((err) => {
        const mesg = err.response.data.error;
        console.log(mesg);
        display_error_register(mesg);
      })
    }

    function make_new_post(){
      axios.post("/post", {
        content: content,
        username: login_name,
      })
      .then(() => {
        setModal_post(!modal_post);
        setContent("");
        if(path_name === undefined){
          fetch()
        }else{
          fetch(login_name)
        }

      })
      .catch((err) => {
        console.log(err);
      })
    }

    function post_new_description(){
      axios.post("/user/updateDescription", {
        username: login_name,
        description: description
      })
      .then((res) => {
        console.log(res)
        setDescriptionModal(!modal_description_update);
        update_descrip_display(description);
      })
      .catch((err) => {
        console.log(err)
      })
    }
    
    function onClick_delete_post(id){
      axios.delete("/post/" + id)
        .then(() => {
          fetch(login_name);
        })
        .catch((err) => {
          console.log(err)
        })
    }

    function onClick_update_post(id, content){
      axios.post("/post/updated/" + id, {
        content: content
      })
        .then((res) => {
          fetch(login_name);
          setContentModal(!modal_content_update)
        })
        .catch((err) => {
          console.log(err)
        })
    }

    function display_error_register(err){
        setError(err);
    }

  
    function nav_bar_change(){
        if(isLogin){
            return (
                <>
                    <button className="button post" onClick={onClick_Post}>
                        +
                    </button>
                    
                    <div className='name_display' onClick={() => onClick_visit_user(login_name)} >
                        @{login_name}
                    </div>      
                    <button className="button" onClick={logout}>
                        Log Out
                    </button>
         
                </>
            )

        }else{
            return (
                <>
                    <button className="button" onClick={onClick_login}>
                        Log In
                    </button>
                    <button className="button" onClick={onClick_register} >
                        Sign Up
                    </button>
                </>
            )
        }
    }

    function title(){
      if(path_name === undefined){
        return (
          <p> Project 3 App Welcome Page</p>
        )
      }else if(isLogin && path_name === login_name){
        return (
          <>
            <h2>{path_name}</h2>
            <div>
                Description: {description_fetch}
                <button className="button post" onClick={(onClick_description_modal)} >+</button>
            </div>
          </>
        )
      }else{
        return (
          <>
            <h2>{path_name}</h2>
            <div>Description: {description_fetch}</div>
          </>
        )
      }
    }
  
    return (
      <>
        {modal_content_update && (
          <div className="modal">
            <div onClick={() => onClick_content_modal(0)} className="overlay"></div>
            <div className="modal-content">
              <h2>Update post's content</h2>
              <div className='error_mesg'>
                {error}
              </div>
              <label>Content: </label>
              <div>
                <textarea className='post' type="text" onInput={update_post_content}></textarea>
              </div>
              <button className="close-modal" onClick={() => onClick_content_modal(0)}>
                CLOSE
              </button>
              <button className="mid-modal" onClick={() => onClick_update_post(selected_id, content)}>
                Update
              </button>
            </div>
          </div>
        )}
        
        {modal_description_update && (
          <div className="modal">
            <div onClick={onClick_description_modal} className="overlay"></div>
            <div className="modal-content">
              <h2>Update your Description</h2>
              <div className='error_mesg'>
                {error}
              </div>
              <label>Description: </label>
              <div>
                <textarea className='post' type="text" onInput={update_description}></textarea>
              </div>
              <button className="close-modal" onClick={onClick_description_modal}>
                CLOSE
              </button>
              <button className="mid-modal" onClick={post_new_description}>
                Update
              </button>
            </div>
          </div>
        )}

        {modal_post && (
          <div className="modal">
            <div onClick={onClick_Post} className="overlay"></div>
            <div className="modal-content">
              <h2>Post A New Update!</h2>
              <div className='error_mesg'>
                {error}
              </div>
              <label>Content: </label>
              <div>
                <textarea className='post' type="text" onInput={update_post_content}></textarea>
              </div>
              <button className="close-modal" onClick={onClick_Post}>
                CLOSE
              </button>
              <button className="mid-modal" onClick={make_new_post}>
                Post
              </button>
            </div>
          </div>
        )}


        {modal && (
          <div className="modal">
            <div onClick={onClick_register} className="overlay"></div>
            <div className="modal-content">
              <h2>Register</h2>
              <div className='error_mesg'>
                {error}
              </div>
              <div>
                <label>Username: </label>
                <input type="text" onInput={updateName}></input>
              </div>
              <div>
                <label>Password:  </label>
                <input type="password" onInput={updatePassword}></input>
              </div>
              <label>Description: </label>
              <div>
                <textarea className='post' type="text" onInput={update_description}></textarea>
              </div>
              <button className="close-modal" onClick={onClick_register}>
                CLOSE
              </button>
              <button className="mid-modal" onClick={createUser}>
                Submit
              </button>
            </div>
          </div>
        )}

        {modal_login && (
          <div className="modal">
            <div onClick={onClick_login} className="overlay"></div>
            <div className="modal-content">
              <h2>Log In</h2>
              <div className='error_mesg'>
                {error}
              </div>
              <div>
                <label>Username: </label>
                <input type="text" onInput={updateName}></input>
              </div>
              <div>
                <label>Password:  </label>
                <input type="password" onInput={updatePassword}></input>
              </div>
              <button className="close-modal" onClick={onClick_login}>
                CLOSE
              </button>
              <button className="mid-modal" onClick={login}>
                Submit
              </button>
            </div>
          </div>
        )}
        
        {modal_register_success && (
          <div className="modal">
            <div onClick={onClick_reg_success} className="overlay"></div>
            <div className="modal-content">
              <h2>Successfully Register for {name} !</h2>
              <button className="close-modal" onClick={onClick_reg_success}>
                CLOSE
              </button>
            </div>
          </div>
        )}
  
        <div className='layout'>
          <div className='navbar'>
            <div className='longer'>
              <button className="button" onClick={onClick_home}>
                Home
              </button>
            </div>
            {nav_bar_change()}
          </div>
  
          <div className='info_layout'>
            {title()}
            {showAllPost()}
          </div>
        </ div>
      
      </>
  
    );
  }