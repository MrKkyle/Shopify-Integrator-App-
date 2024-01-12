import { createRoot } from 'react-dom/client';
import { flushSync } from 'react-dom';
import {useEffect, useState} from 'react';
import $ from 'jquery';
import Customer_details from '../components/semi-components/customer-details';
import Detailed_customer from '../components/semi-components/Customer/detailed_customer';
import Page1 from '../components/Page1';
import '../CSS/page1.css';


/* Must start with a Caps letter */
function Customers()
{
    const[inputs, setInputs] = useState({});

    const handleChange = (event) =>
    {
        const name = event.target.name;
        const value = event.target.value;
        setInputs(values => ({...values, [name]: value}))
    }

    const SearchCustomer = (event) =>
    {
        event.preventDefault();
        console.log(inputs);
    }

    useEffect(()=> 
    {
        /* Ensures the navbar is set correctly */
        let navigation = document.getElementById("navbar");
        let main = document.querySelector(".main");
        window.onload = function(event)
        {
            navigation.style.left = "0%";
            navigation.style.position = "relative";
            navigation.style.width = "100%";
            main.style.animation = "SlideUp3 1.2s ease-in";
        }

        /*  API  */
        const api_key = localStorage.getItem('api_key');
        $.ajaxSetup
        ({
            headers: { 'Authorization': 'ApiKey ' + api_key}
        });
        $.get("http://localhost:8080/api/customers?page=1", [], [])
        .done(function( _data) 
        {
            console.log(_data);
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
                root.render(_data.map((el, i) => <Customer_details key={`${el.title}_${i}`} Customer_ID={el.id}
                Customer_firstName={el.first_name} Customer_lastName={el.last_name}
                />))
            }
        })
        .fail( function(xhr) 
        {
            alert(xhr.responseText);
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

        /* SEARCH */
        document.getElementById("search").addEventListener("submit", function(e)
        {
            $.get("http://localhost:8080/api/customers/search?q=" + document.getElementsByName("search")[0].value,[],[], 'json')
            .done(function( _data) 
            {
                console.log(_data);

                document.querySelector(".pan-main").remove();
                let div = document.createElement("div");
                div.className = "pan-main";
                div.id = "pan-main";
                let main = document.querySelector(".main-elements");
                main.appendChild(div);
                let root = createRoot(div);

                root.render(_data.map((el, i) => <Customer_details key={`${el.title}_${i}`} Customer_ID={el.id}
                Customer_firstName={el.first_name} Customer_lastName={el.last_name}
                />))

                setTimeout(() =>
                {
                    DetailedView();
                }, 100);
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
                $.get("http://localhost:8080/api/customers?page=1", [], [])
                .done(function( _data) 
                {
                    console.log(_data);
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
                    root.render(_data.map((el, i) => <Customer_details key={`${el.title}_${i}`} Customer_ID={el.id}
                    Customer_firstName={el.first_name} Customer_lastName={el.last_name}
                    />))
                    DetailedView();
                    Pagintation(1);
                })
                .fail( function(xhr) { alert(xhr.responseText); });
            }
        });

        /* When the user clicks on the pan elements show info about that specified pan element */
        function DetailedView()
        {
            let customers = document.querySelector(".customer");
            let pan = document.querySelectorAll(".pan");
            for(let i = 0; i < pan.length; i++)
            {
                pan[i].addEventListener("click", () =>
                {
                    let id = pan[i].querySelector(".p-d-title").innerHTML;
                    console.log(id);
                    /*  API  */
                    const api_key = localStorage.getItem('api_key');
                    $.ajaxSetup({ headers: { 'Authorization': 'ApiKey ' + api_key} });
                    $.get("http://localhost:8080/api/customers/" + id, [], [], 'json')
                    .done(function(_data) 
                    {   
                        console.log(_data);
                        if(document.querySelector(".details") != null)
                        //div already exists, remove it, and create another
                        {

                            document.querySelector(".details").remove();
                            let details = document.createElement('div');
                            details.className = "details";
                            customers.appendChild(details);

                            let rot = createRoot(details);
                            rot.render( <Detailed_customer key={`${_data.title}_${i}`} Customer_ID={_data.id}
                            Customer_firstName={_data.first_name} Customer_lastName={_data.last_name}
                            />)
                        }
                        else 
                        //create new div
                        {
                            let details = document.createElement('details');
                            customers.appendChild(details);
                            let rot = createRoot(details);
                            rot.render( <Detailed_customer key={`${_data.title}_${i}`} Customer_ID={_data.id}
                            Customer_firstName={_data.first_name} Customer_lastName={_data.last_name}
                            />)
                        }
                    })
                    .fail( function(xhr) 
                    {
                        alert(xhr.responseText);
                    });
                    setTimeout(() =>
                    {
                        let main = document.querySelector(".main");
                        let navbar = document.getElementById("navbar");
                        let details = document.querySelector(".details");
                        main.style.animation = "Fadeout 0.5s ease-out";
                        navbar.style.animation = "Fadeout 0.5s ease-out";
                        main.style.display = "none";
                        navbar.style.display = "none";
                        details.style.display = "block";
                    }, 50);
                });
            } 
        }

        /* Script to automatically format the number of elements on each page */
        const content = document.querySelector('.center'); 
        const paginationContainer = document.createElement('div');
        const paginationDiv = document.body.appendChild(paginationContainer);
        paginationContainer.classList.add('pagination');
        content.appendChild(paginationContainer);

        document.querySelector(".pan-main").remove();
        let div = document.createElement("div");
        div.className = "pan-main";
        div.id = "pan-main";
        let _main = document.querySelector(".main-elements");
        _main.appendChild(div);

        function Pagintation(index)
        {

            let ahead = index + 1;
            /*  API  */
            $.get('http://localhost:8080/api/customers?page=' + ahead, [], [])
            .done(function( _data) 
            {
                console.log(_data);
                if(_data == "")
                {
                    let next = document.getElementById("next");
                    next.style.cursor = "not-allowed";
                    next.disabled = true;
                } 
            })
            .fail( function(xhr) { alert(xhr.responseText); });

            /* Check done to remove old elements if they exist */
            if(document.getElementById("next") != null && document.getElementById("prev") != null && document.getElementById("hod") != null)
            //If they exist remove them, and create new based on the new index value
            {
                document.getElementById("next").remove();
                document.getElementById("prev").remove();
                document.getElementById("hod").remove();

                const pageButton = document.createElement('button');
                pageButton.id = "hod";
                pageButton.className = "active";
                pageButton.innerHTML = index;
                paginationDiv.appendChild(pageButton);

                const nextPage = document.createElement('button');
                nextPage.id = "next";
                nextPage.innerHTML = "→";
                paginationDiv.appendChild(nextPage);

                const prevPage = document.createElement('button');
                prevPage.id = "prev";
                prevPage.innerHTML = "←";
                paginationDiv.appendChild(prevPage);
                if(index == 1) { prevPage.disabled = true; prevPage.style.cursor = "not-allowed"; }
                else if(index > 1) { prevPage.style.cursor = "pointer"; prevPage.disabled = false; nextPage.disabled = false; }
                else if(index <= 1) {prevPage.disabled = true; prevPage.style.cursor = "not-allowed"; }

                nextPage.addEventListener("click", () =>
                {
                    index = index + 1;
                    /* Fetches the data from page, based on the page / index value */
                    const page = "http://localhost:8080/api/customers?page=" + index;
                    /*  API  */
                    const api_key = localStorage.getItem('api_key');
                    $.ajaxSetup({ headers: { 'Authorization': 'ApiKey ' + api_key} });
                    $.get(page, [], [])
                    .done(function( _data) 
                    {
                        console.log(_data);
                        document.querySelector(".pan-main").remove();
                        let div = document.createElement("div");
                        div.className = "pan-main";
                        div.id = "pan-main";
                        let main = document.querySelector(".main-elements");
                        main.appendChild(div);
                        let root = createRoot(div);
                        flushSync(() => 
                        { 
                            root.render(_data.map((el, i) => <Customer_details key={`${el.title}_${i}`} Customer_ID={el.id}
                            Customer_firstName={el.first_name} Customer_lastName={el.last_name}
                            />))
                        });
                    })
                    .fail( function(xhr) { alert(xhr.responseText); });

                    let ahead = index + 1;
                    /*  API  */
                    $.get('http://localhost:8080/api/customers?page=' + ahead, [], [])
                    .done(function( _data) 
                    {
                        console.log(_data);
                        if(_data == "")
                        {
                            let next = document.getElementById("next");
                            next.style.cursor = "not-allowed";
                            next.disabled = true;
                        } 
                    })
                    .fail( function(xhr) { alert(xhr.responseText); });

                    Pagintation(index);
                    setTimeout(() => { DetailedView();}, 200);
                });

                prevPage.addEventListener("click", () =>
                {
                    index = index - 1;
                    /* Fetches the data from page, based on the page / index value */
                    const page = "http://localhost:8080/api/customers?page=" + index;

                    /*  API  */
                    const api_key = localStorage.getItem('api_key');
                    $.ajaxSetup({ headers: { 'Authorization': 'ApiKey ' + api_key} });
                    $.get(page, [], [])
                    .done(function( _data) 
                    {
                        console.log(_data);

                        document.querySelector(".pan-main").remove();
                        let div = document.createElement("div");
                        div.className = "pan-main";
                        div.id = "pan-main";
                        let main = document.querySelector(".main-elements");
                        main.appendChild(div);
                        let root = createRoot(div);

                        flushSync(() => 
                        { 
                            root.render(_data.map((el, i) => <Customer_details key={`${el.title}_${i}`} Customer_ID={el.id}
                            Customer_firstName={el.first_name} Customer_lastName={el.last_name}
                            />))
                        });
                    })
                    .fail( function(xhr) { alert(xhr.responseText); });
                    Pagintation(index);
                    setTimeout(() => { DetailedView();}, 200);
                });
            }
            else 
            //If they dont exist create new ones 
            {
                const pageButton = document.createElement('button');
                pageButton.id = "hod";
                pageButton.className = "active";
                pageButton.innerHTML = index;
                paginationDiv.appendChild(pageButton);

                const nextPage = document.createElement('button');
                nextPage.id = "next";
                nextPage.innerHTML = "→";
                paginationDiv.appendChild(nextPage);

                const prevPage = document.createElement('button');
                prevPage.id = "prev";
                prevPage.innerHTML = "←";
                paginationDiv.appendChild(prevPage);

                if(index == 1) { prevPage.disabled = true; prevPage.style.cursor = "not-allowed"; }
                else if(index > 1) { prevPage.style.cursor = "pointer"; prevPage.disabled = false; nextPage.disabled = false; }
                else if(index <= 1) {prevPage.disabled = true; prevPage.style.cursor = "not-allowed"; }
                nextPage.addEventListener("click", () =>
                {
                    index = index + 1;
                    /* Fetches the data from page, based on the page / index value */
                    const page = "http://localhost:8080/api/customers?page=" + index;
                    /*  API  */
                    const api_key = localStorage.getItem('api_key');
                    $.ajaxSetup({ headers: { 'Authorization': 'ApiKey ' + api_key} });
                    $.get(page, [], [])
                    .done(function( _data) 
                    {
                        console.log(_data);
                        document.querySelector(".pan-main").remove();
                        let div = document.createElement("div");
                        div.className = "pan-main";
                        div.id = "pan-main";
                        let main = document.querySelector(".main-elements");
                        main.appendChild(div);
                        let root = createRoot(div);

                        flushSync(() => 
                        { 
                            root.render(_data.map((el, i) => <Customer_details key={`${el.title}_${i}`} Customer_ID={el.id}
                            Customer_firstName={el.first_name} Customer_lastName={el.last_name}
                            />))
                        });
                    })
                    .fail( function(xhr) { alert(xhr.responseText); });
                    Pagintation(index);
                    setTimeout(() => { DetailedView();}, 200);
                });
                prevPage.addEventListener("click", () =>
                {
                    index = index - 1;
                    /* Fetches the data from page, based on the page / index value */
                    const page = "http://localhost:8080/api/customers?page=" + index;

                    /*  API  */
                    const api_key = localStorage.getItem('api_key');
                    $.ajaxSetup({ headers: { 'Authorization': 'ApiKey ' + api_key} });
                    $.get(page, [], [])
                    .done(function( _data) 
                    {
                        console.log(_data);
                        document.querySelector(".pan-main").remove();
                        let div = document.createElement("div");
                        div.className = "pan-main";
                        div.id = "pan-main";
                        let main = document.querySelector(".main-elements");
                        main.appendChild(div);
                        let root = createRoot(div);

                        flushSync(() => 
                        { 
                            root.render(_data.map((el, i) => <Customer_details key={`${el.title}_${i}`} Customer_ID={el.id}
                            Customer_firstName={el.first_name} Customer_lastName={el.last_name}
                            />))
                        });
                    })
                    .fail( function(xhr) { alert(xhr.responseText); });
                    Pagintation(index);
                    setTimeout(() => { DetailedView();}, 200);
                });
            } 
        }
        Pagintation(1);
        setTimeout(() => { DetailedView();}, 200);
        
    }, []);

    return (
        <div className = "customer">
            <div className = "main" style = {{left: '50%', top: '53%', transform: 'translate(-50%, -50%)', 
                    height: '100%', backgroundColor: 'transparent', animation:'SlideUp3 1.2s ease-in', width: '100%'}}>
                <div className = "search">
                    <form id = "search" className = "search-area" autoComplete = 'off' onSubmit={(event) => SearchCustomer(event)}
                    style = {{top: '32px'}}>
                    <input className ="search-area" type="search" placeholder="Search..." 
                        name = "search" value = {inputs.search || ""}  onChange = {handleChange}></input>
                    </form>    
                </div>
                <div className = "main-elements" style ={{top: '52%'}}>
                    <div className = "empty-message">No results found.</div>
                    <div className = "pan-main" id = "pan-main"></div>
                </div>
                <div className = "center" id = "pag"></div>
            </div>

            <Page1 filter_display = "none"/>
            <div className = "details">
                <div className = 'close-button'>&times;</div>
            </div>
            
        </div>
    );
}

export default Customers;