import { createRoot } from 'react-dom/client';
import { flushSync } from 'react-dom';
import {useEffect, useState} from 'react';
import Page1 from '../components/Page1';
import $ from 'jquery';
import Order_details from '../components/semi-components/order-details';
import '../CSS/page1.css';

import { DetailedView, Pagintation } from './Functions/Order_Functions';

/* Must start with a Caps letter */
function Orders()
{
    const[inputs, setInputs] = useState({});

    const handleChange = (event) =>
    {
        const name = event.target.name;
        const value = event.target.value;
        setInputs(values => ({...values, [name]: value}))
    }

    const SearchOrder = (event) =>
    {
        event.preventDefault();
    }

    useEffect(()=> 
    {
        /* Ensures the navbar is set correctly */
        let navigation = document.getElementById("navbar");
        let main = document.querySelector(".main");
        navigation.style.left = "0%"; navigation.style.position = "relative"; navigation.style.width = "100%";
        main.style.animation = "SlideUp3 1.2s ease-in"; navigation.style.display = "block";

        /*  API  */
        const api_key = localStorage.getItem('api_key');
        $.ajaxSetup
        ({
            headers: { 'Authorization': 'ApiKey ' + api_key}
        });
        $.get("http://api.integrator.com/api/orders?page=1", [], [])
        .done(function( _data) 
        {
            if(_data == "")
            {
                document.querySelector(".empty-message").style.display = "block";
            }
            else 
            {
                let root;
                let pan_main = document.querySelector(".pan-main");
                let div = document.createElement("div");
                pan_main.appendChild(div);

                root = createRoot(div);
                root.render(_data.map((el, i) => <Order_details key={`${el.title}_${i}`} Order_WebCode={el.web_code}
                Order_firstName={el.customer.first_name} Order_lastName={el.customer.last_name} Order_ID = {el.id}
                />))
            }
        })
        .fail( function(xhr) 
        {
            alert(xhr.responseText);
        });

        /* SEARCH */
        document.getElementById("search").addEventListener("submit", function(e)
        {

            $.get("http://api.integrator.com/api/orders/search?q=" + document.getElementsByName("search")[0].value,[],[], 'json')
            .done(function( _data) 
            {

                document.querySelector(".pan-main").remove();
                let div = document.createElement("div");
                div.className = "pan-main";
                div.id = "pan-main";
                let main = document.querySelector(".main-elements");
                main.appendChild(div);
                let root = createRoot(div);

                root.render(_data.map((el, i) => <Order_details key={`${el.title}_${i}`} Order_WebCode={el.web_code}
                Order_firstName={el.customer.first_name} Order_lastName={el.customer.last_name} Order_ID = {el.id}
                />)) 

                setTimeout(() =>{ DetailedView(); }, 100);
            })
            .fail( function(xhr) { alert(xhr.responseText); });
        });

        /* When the user clicks the X on the search bar */
        document.getElementById("search").addEventListener("search", function(event) 
        {
            if(document.getElementsByName("search")[0].value == "")
            {
                const api_key = localStorage.getItem('api_key');
                $.ajaxSetup({ headers: { 'Authorization': 'ApiKey ' + api_key} });
                $.get("http://api.integrator.com/api/orders?page=1", [], [])
                .done(function( _data) 
                {
                    let filter_button = document.getElementById("_filter");
                    let C_filter = document.getElementById("clear_filter");
                    filter_button.disabled = true;
                    C_filter.disabled = true;
                    filter_button.style.cursor = "not-allowed";
                    C_filter.style.cursor = "not-allowed";

                    let root;
                    let pan_main;
                    document.querySelector(".pan-main").remove();
                    pan_main = document.createElement('div');
                    let main_elements = document.querySelector(".main-elements");
                    pan_main.className = "pan-main";
                    main_elements.appendChild(pan_main);
                    root = createRoot(pan_main);
                    root.render(_data.map((el, i) => <Order_details key={`${el.title}_${i}`} Order_WebCode={el.web_code}
                    Order_firstName={el.customer.first_name} Order_lastName={el.customer.last_name} Order_ID = {el.id}
                    />))
                    DetailedView();
                    Pagintation(1);
                })
                .fail( function(xhr) { alert(xhr.responseText); });
            }
        });

        /* When the user clicks on the return button */
        let close = document.querySelector(".close-button");
        let filter = document.querySelector(".filter");
        let navbar = document.getElementById("navbar");
        let details = document.querySelector(".details");

        close.addEventListener("click", ()=> 
        {
            close.style.display = "none";
            details.style.animation = "Fadeout 0.5s ease-out";
            main.style.animation = "FadeIn ease-in 0.5s";
            filter.style.animation = "FadeIn ease-in 0.5s";
            navbar.style.animation = "FadeIn ease-in 0.5s";

            details.style.display = "none";
            navbar.style.display = "block";
            main.style.display = "block";
        });

        Pagintation(1);
        setTimeout(() => { DetailedView();}, 300);

        /* Re-Sync function runs every 30 seconds minutes*/
        var timerID = setInterval(function() 
        {
            /*  API  */
            const api_key = localStorage.getItem('api_key');
            $.ajaxSetup({ headers: { 'Authorization': 'ApiKey ' + api_key} });
            $.get("http://api.integrator.com/api/order?page=1", [], [])
            .done(function( _data) 
            {
                document.querySelector(".pan-main").remove();
                let div = document.createElement("div");
                div.className = "pan-main";
                div.id = "pan-main";
                let main = document.querySelector(".main-elements");
                main.appendChild(div);
                let root = createRoot(div);

                flushSync(() => { root.render(_data.map((el, i) => <Order_details key={`${el.title}_${i}`} /> )) });
                setTimeout(() => { DetailedView();}, 300);
                Pagintation(1);
            })
            .fail( function(xhr) { alert(xhr.responseText); });

        }, 60 * 1000); 
        
        /*  Clicking on the dropdowns clears the timeout */
        let dropdown = document.querySelectorAll(".dropdown");
        for(let i = 0; i < dropdown.length; i++)
        {
            dropdown[i].addEventListener("click", () => 
            {
                clearInterval(timerID);
            });
        }

    }, []);

    return (
        <div className = "orders">
            <div className = "main" style = {{left: '50%', top: '53%', transform: 'translate(-50%, -50%)', 
                height: '100%', backgroundColor: 'transparent', animation:'SlideUp3 1.2s ease-in', width: '100%'}}>

                <div className = "search" onSubmit={(event) => SearchOrder(event)}>
                    <form id = "search" className = "search-area" autoComplete='off' style = {{top:'32px'}}>
                    <input className ="search-area" type="search" placeholder="Search..." 
                        name = "search" value = {inputs.search || ""}  onChange = {handleChange}></input>
                    </form>    
                </div>
                <div className = "main-elements" style ={{top: '52%'}}>
                    <div className = "empty-message">No results found.</div>
                    <div className = "pan-main" id = "pan-main"></div>
                </div>
                <div className = "center" id = "pag" style ={{top: '38px'}}>
                    <div className = "pagination">
                        <button className = "active" id = "hod"></button>
                        <button id = "next">→</button>
                        <button id = "prev">←</button>
                    </div>
                </div>
            </div>

            <Page1 filter_display = "none"/>
            <div className = "details">
                <div className = 'close-button'>&times;</div>
            </div>
            
        </div>
    );
}

export default Orders;