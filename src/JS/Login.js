import {useEffect} from 'react';
import {useState} from "react";
import { createRoot } from 'react-dom/client';
import $ from 'jquery';

import Detailed_User from './Login/detailed_user';
import '../CSS/login.css';
import google_image from '../media/google.png';

function Login()
{
    const[inputs, setInputs] = useState({});

    const handleChange = (event) =>
    {
        const name = event.target.name;
        const value = event.target.value;
        setInputs(values => ({...values, [name]: value}))
    }

    const Login = (event) =>
    {
        event.preventDefault();

        /* Hide the user the information received from the api */
        let re = document.querySelector(".result-container");
        re.style.display = "none";

        let message = document.getElementById("message");
        message.style.display = "block";

        
        $.post("http://api.integrator.com/api/login", JSON.stringify(inputs),[], 'json')
        .done(function( _data) 
        {

            /* Sets the user information for this session */
            localStorage.setItem('api_key', _data.api_key);
            localStorage.setItem('username', inputs.username);

            message.innerHTML = "Login Sucessful";
            message.style.background = "#1a5e12";

            let form = document.getElementById("form1");
            let navbar = document.getElementById("navbar");
            navbar.style.display = "none"; form.style.display = "none";
            
            setTimeout(() =>
            {
                message.innerHTML = "";
                message.style.backgroundColor = "transparent";
                message.style.display = "none";
                window.location.href = '/dashboard';
            }, 2000);
        })
        .fail( function(xhr) 
        {
            message.innerHTML = JSON.parse(xhr.responseText).error;
            message.style.background = "#9f0a0a";
            setTimeout(() =>
            {
                message.innerHTML = "";
                message.style.backgroundColor = "transparent";
                message.style.display = "none";
            }, 1000);
        });
        
    }

    const Register = (event) =>
    {
        event.preventDefault();

        /* Show the user the information received from the api */
        let re = document.querySelector(".result-container");
        let copyText = document.getElementById("myInput");
        let main2 = document.getElementById("main2");
        let message = document.getElementById("message");
        message.style.display = "block";
        
        $.post("http://api.integrator.com/api/register", JSON.stringify(inputs),[], 'json')
        .done(function( _data) 
        {

            let div = document.querySelector(".pre");
            let rot = createRoot(div);
            rot.render( <Detailed_User id={_data.id} name={_data.name} email={_data.email} api_key={_data.api_key} 
                web_token={_data.webhook_token} created={_data.created_at}  updated={_data.updated_at} />) 
                
            copyText.innerHTML = JSON.stringify(_data, null, 2);

            message.innerHTML = "Registration Sucessful";
            message.style.background = "#1a5e12";
            main2.style.animation = "Fadeout 2s ease-out";
            setTimeout(() =>
            {
                main2.style.display = "none";
                re.style.display = "block";
                message.innerHTML = "";
                message.style.backgroundColor = "transparent";
                message.style.display = "none";
            }, 2000);
        })
        .fail( function(xhr) 
        {
            message.innerHTML = JSON.parse(xhr.responseText).error;
            message.style.background = "#9f0a0a";
            setTimeout(() =>
            {
                message.innerHTML = "";
                message.style.backgroundColor = "transparent";
                message.style.display = "none";
            }, 1000);
        });
    }

    const Register_auth = (event) =>
    {
        event.preventDefault();
        let message = document.getElementById("message");
        message.style.display = "block";

        $.post("http://api.integrator.com/api/preregister", JSON.stringify(inputs),[], 'json')
        .done(function( _data) 
        {

            message.innerHTML = "Email sent";
            message.style.background = "#1a5e12";
            setTimeout(() =>
            {
                message.innerHTML = "";
                message.style.backgroundColor = "transparent";
                message.style.display = "none";
            }, 2000);

            /* Adds the proceedings after the user enters his registration info */
            let form2 = document.getElementById("form2");
            let form3 = document.getElementById("form3");
            let return_button2 = document.querySelector(".return-button2");
            let message_1 = document.getElementById("message-1");
            form2.style.animation = "Fadeout ease-out 1s"; form2.style.display = "none";
            form3.style.animation = "FadeIn ease-in 1s"; form3.style.display = "block";
            return_button2.style.display = "block"; 
            message_1.innerHTML = "A Token was sent to the email address: " + inputs.email;

        })
        .fail( function(xhr) 
        { 
            message.innerHTML = JSON.parse(xhr.responseText).error;
            message.style.background = "#9f0a0a";
            setTimeout(() =>
            {
                message.innerHTML = "";
                message.style.backgroundColor = "transparent";
                message.style.display = "none";
            }, 1000);
        }); 
    }

    useEffect(()=> 
    {
        let message = document.getElementById("message");
        window.onload = function(event)
        {
            let form = document.getElementById("form1");
            let navbar = document.getElementById("navbar");
            navbar.style.display = "none"; form.style.display = "none";

            $.ajaxSetup({ xhrFields: { withCredentials: true }, dataType: 'jsonp'});
            /* Check done to see if user's cookie already exists */
            $.get("http://api.integrator.com/api/google/oauth2/login", [], [], 'json')
            .done(function( _data) 
            {

                let rain = document.querySelector(".back-row-toggle"); rain.style.display = "none";

                localStorage.setItem('username', _data.username);
                localStorage.setItem('api_key', _data.api_key);
                
                setTimeout(() => { window.location.href = '/dashboard'; }, 1500);
            })
            .fail( function(xhr) 
            {
                message.innerHTML = "Please login again";
                message.style.background = "#9f0a0a";
                setTimeout(() => { message.innerHTML = ""; message.style.backgroundColor = "transparent"; message.style.display = "none"; }, 2000);
            });
            
        }
        
        /* Google login button */
        let google_button = document.querySelector(".google-btn");
        google_button.addEventListener("click", () =>
        {
            let form = document.getElementById("form1");
            let rain = document.querySelector(".back-row-toggle");
            form.style.animation = "Fadeout 1s ease-out";
            rain.style.animation = "Fadeout 1s ease-out";
            setTimeout(() => 
            {
                form.style.display = "none";
                rain.style.display = "none";
                window.location.href = 'http://api.integrator.com/api/google/login';
            }, 900);
            
        });

        /* Ensure the model is shown */
        let model = document.getElementById("model");
        let navbar = document.getElementById("navbar");
        let form1 = document.getElementById("form1")
        navbar.style.display = "none";
        model.style.display = "block";

        setTimeout(() => { form1.style.display = "block"; setTimeout(() => { form1.style.animation = "FadeIn ease-in 1s"; }, 1000); }, 2000);
        
        /* The swapping of forms */
        let register_button = document.getElementById("reg");
        let return_button = document.querySelector(".return-button");
        let return_button2 = document.querySelector(".return-button2");
        let form2 = document.getElementById("form2");
        let form3 = document.getElementById("form3");
        register_button.addEventListener("click", () =>
        {
            form1.style.animation = "Fadeout ease-out 1s";
            form1.style.display = "none";
            form2.style.animation = "FadeIn ease-in 1s";
            form2.style.display = "block";
            return_button.style.display = "block";
        });

        /* return button swapping of forms */
        return_button.addEventListener("click", () =>
        {
            form2.style.animation = "Fadeout ease-out 1s";
            form2.style.display = "none";
            form1.style.animation = "FadeIn ease-in 1s";
            form1.style.display = "block";
            return_button.style.display = "none";
        });

        /* return button2 swapping of forms */
        return_button2.addEventListener("click", () =>
        {
            form3.style.animation = "Fadeout ease-out 1s";
            form3.style.display = "none";
            form2.style.animation = "FadeIn ease-in 1s";
            form2.style.display = "block";
            return_button2.style.display = "none";
            return_button.style.display = "block";
        });

        /* Proceed button on registration form */
        let clip = document.getElementById("clip");
        clip.addEventListener("click", () =>
        {   
            setTimeout(() =>
            {
                let re = document.querySelector(".result-container");
                let form2 = document.getElementById("form2");

                re.style.animation = "Fadeout 2s ease-out";
                form2.style.animation = "Fadeout 2s ease-out";
                
                setTimeout(() =>{ window.location.reload(); }, 1000);
            }, 1000)
        });


        /* Rain Functions */
        var makeItRain = function() 
        {
            //clear out everything
            $('.rain').empty();
          
            var increment = 0;
            var drops = "";
            var backDrops = "";
          
            while (increment < 100) 
            {

                //couple random numbers to use for various randomizations
                //random number between 98 and 1
                var randoHundo = (Math.floor(Math.random() * (98 - 1 + 1) + 1));
                //random number between 5 and 2
                var randoFiver = (Math.floor(Math.random() * (5 - 2 + 1) + 2));
                //increment
                increment += randoFiver;
                //add in a new raindrop with various randomizations to certain CSS properties
                drops += '<div class="drop" style="left: ' + increment + '%; bottom: ' 
                + (randoFiver + randoFiver - 1 + 100) + '%; animation-delay: 0.' + randoHundo 
                + 's; animation-duration: 0.5' + randoHundo + 's;"><div class="stem" style="animation-delay: 0.' 
                + randoHundo + 's; animation-duration: 0.5' + randoHundo + 's;"></div><div class="splat" style="animation-delay: 0.' 
                + randoHundo + 's; animation-duration: 0.5' + randoHundo + 's;"></div></div>';
                
                backDrops += '<div class="drop" style="right: ' + increment + '%; bottom: ' 
                + (randoFiver + randoFiver - 1 + 100) + '%; animation-delay: 0.' + randoHundo 
                + 's; animation-duration: 0.5' + randoHundo + 's;"><div class="stem" style="animation-delay: 0.' 
                + randoHundo + 's; animation-duration: 0.5' + randoHundo + 's;"></div><div class="splat" style="animation-delay: 0.' 
                + randoHundo + 's; animation-duration: 0.5' + randoHundo + 's;"></div></div>';
            }
          
            $('.rain.front-row').append(drops);
            $('.rain.back-row').append(backDrops);
        }
          
        $('.splat-toggle.toggle').on('click', function() 
        {
            $('body').toggleClass('splat-toggle');
            $('.splat-toggle.toggle').toggleClass('active');
            makeItRain();
        });
          
        $('.back-row-toggle.toggle').on('click', function() 
        {
            $('body').toggleClass('back-row-toggle');
            $('.back-row-toggle.toggle').toggleClass('active');
            makeItRain();
        });
        
        $('.single-toggle.toggle').on('click', function() 
        {
            $('body').toggleClass('single-toggle');
            $('.single-toggle.toggle').toggleClass('active');
            makeItRain();
        });
          
        /* DONT MAKE IT RAIN YET! */
        makeItRain();
    }, []);


    return (
    <>
    <div id = "login">
        <div className = 'modal1' id = "model" style = {{display: 'block', zIndex: '2'}}>
            <div className = "back-row-toggle splat-toggle">
                <div className = "rain front-row"></div>
                <div className = "rain back-row"></div>
                <div className = "toggles">
                    <div className = "splat-toggle toggle active"></div>
                </div>
            </div>

            <form className = 'modal-content' method = 'post' onSubmit={(event) => Login(event)} autoComplete='off' id = 'form1'>
                <div className = 'modal-container' id = "main">

                    <label style = {{fontSize: '18px'}}><b>Welcome. Please login to proceed</b></label>
                    <br /><br /><br />
                    <label><b>Username</b></label>
                    <br />
                    <span><input type = 'text' placeholder = "Name" name = "username" value = {inputs.username || ""}  onChange = {handleChange} required></input></span>
                    <br /><br /><br />
                    <label><b>Password</b></label>
                    <br />
                    <span><input type = 'password' placeholder = "Password" name = "password" value = {inputs.password || ""} onChange = {handleChange} required></input></span>
                    <br /><br />
                    <button className = 'button' type = 'submit'>Proceed</button> <div id = "reg" className = 'text'>Or Register</div>

                    <div className="google-btn">
                        <div className="google-icon-wrapper">
                            <img className="google-icon" src={google_image}/>
                        </div>
                        <p className="btn-text"><b>Sign in with google</b></p>
                    </div>
                </div>
            </form>

            <form style = {{display: 'none'}} className = 'modal-content'  method = 'post' onSubmit={(event) => Register_auth(event)} autoComplete='off' id = 'form2'>
                
                <div className = 'modal-container'>
                <div className = 'return-button'/>
                    <label id = "info" style = {{fontSize: '18px'}}><b><u>Register a New Account</u></b></label>
                    <br /><br /><br />
                    <label><b>Username</b></label>
                    <br />
                    <span><input type = 'text' placeholder = "Name" name = "name" value = {inputs.name || ""}  onChange = {handleChange} required></input></span>
                    <br /><br /><br />
                    <label><b>Email</b></label>
                    <br />
                    <span><input type = 'email' placeholder = "Email" name = "email" value = {inputs.email || ""} onChange = {handleChange} required></input></span>
                    <br /><br />
                    <button id = "proc" className = 'button' type = 'submit'>Send Token</button>
                    <br /><br />
                </div>
            </form>

            <form style = {{display: 'none'}} className = 'modal-content'  method = 'post' onSubmit={(event) => Register(event)} autoComplete='off' id = 'form3'>
                <div className = 'modal-container' id = "main2">
                    <div className = 'reg-portion' id = "reg-portion">
                    <div className = 'return-button2'/>
                        <label style ={{color: 'white'}}><b>Authentication Token</b></label>
                        <br />
                        <div className = "message" id = "message-1">A Token was sent to the email address</div>
                        <br /><br />
                        <label><b>Token</b></label>
                        <br />
                        <span><input type = 'password' placeholder = "Enter Token" name = "token" value = {inputs.token || ""} onChange = {handleChange} required></input></span>
                        <br />
                        <label><b>Password</b></label>
                        <br />
                        <span><input type = 'password' placeholder = "Enter Unique Password" name = "password" value = {inputs.password || ""} onChange = {handleChange} required></input></span>
                        <br /><br /><br />
                        <button className = 'button' id = "reg-auth" type = 'submit'>Register</button>
                    </div>
                </div>
            </form>
            <div className = 'result-container'>
                <div className = 'reg-portion'>
                    <label style ={{color: 'white', fontSize: ' 15px'}}><b>Information Returned</b></label>
                    <div className = "message" style ={{color: 'white'}}>You are recommended to save this information!</div>
                    <br />
                    <pre id = "myInput" style={{display: 'none'}}/>
                    <pre className = "pre"/>
                    <br /><br />
                    <button className = 'button' type = 'button' id = "clip">Proceed</button>
                </div>
            </div>

            <div className = 'info-message' id = 'message' />
        </div>

        
    </div>
    </>
    );
  
};
    
export default Login;