import { createRoot } from 'react-dom/client';
import { flushSync } from 'react-dom';
import {useEffect, useState} from 'react';
import $ from 'jquery';
import Page1 from '../components/Page1';
import Pan_details from '../components/semi-components/pan-detail';
import { DetailedView, Pagintation } from './Functions/Product_Functions';

import '../CSS/page1.css';
function Products()
{
    const[inputs, setInputs] = useState({});

    const handleChange = (event) =>
    {
        const name = event.target.name;
        const value = event.target.value;
        setInputs(values => ({...values, [name]: value}))
    }

    const SearchProduct = (event) =>
    {
        event.preventDefault();
    }

    useEffect(()=> 
    {
        /* Ensures the page elements are set correctly */
        let navigation = document.getElementById("navbar");
        let empty_message = document.querySelector('.empty-message');
        navigation.style.left = "30%"; navigation.style.position = "absolute"; navigation.style.width = "70%";
        navigation.style.animation = "MoveLeft 0.8s ease"; navigation.style.display = "block";

        /*  API INITIAL-REQUEST */
        const api_key = localStorage.getItem('api_key');
        $.ajaxSetup({ headers: { 'Authorization': 'ApiKey ' + api_key} });
        $.get("http://api.integrator.com/api/products?page=1", [], [])
        .done(function( _data) 
        {
            if(_data == "")
            {
                empty_message.style.display = "block";
            }
            else 
            {
                let root;
                let pan_main = document.querySelector(".pan-main");
                let div = document.createElement("div");
                pan_main.appendChild(div);

                root = createRoot(div);
                root.render(_data.map((el, i) => <Pan_details key={`${el.title}_${i}`} Product_Title={el.title} Product_ID={el.id} 
                Product_Activity={el.active} Product_Type={el.product_type} Product_Code={el.product_code} Product_Category={el.category}
                Product_Vendor={el.vendor} Product_Image={el.product_images.map((el, i) => el.src)}
                />))
            }
        })
        .fail( function(xhr) { alert(xhr.responseText); });

        /* SEARCH */
        document.getElementById("search").addEventListener("submit", function(e)
        {

            $.get("http://api.integrator.com/api/products/search?q=" + document.getElementsByName("search")[0].value,[],[], 'json')
            .done(function( _data) 
            {
                if(_data.length < 10)
                {
                    let next = document.getElementById("next");
                    next.disabled = true;
                    next.style.cursor = "not-allowed";
                }

                document.querySelector(".pan-main").remove();
                let div = document.createElement("div");
                div.className = "pan-main";
                div.id = "pan-main";
                let main = document.querySelector(".main-elements");
                main.appendChild(div);
                let root = createRoot(div);

                root.render(_data.map((el, i) => <Pan_details key={`${el.title}_${i}`} Product_Title={el.title} Product_ID={el.id} Product_Activity={el.active}
                Product_Type={el.product_type} Product_Code={el.product_code} Product_Category={el.category} Product_Vendor={el.vendor}
                Product_Image={el.product_images.map((el, i) => el.src)}
                /> )) 

                setTimeout(() => { DetailedView(); }, 400);
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
                $.get("http://api.integrator.com/api/products?page=1", [], [])
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
                    root.render(_data.map((el, i) => <Pan_details key={`${el.title}_${i}`} Product_Title={el.title} Product_ID={el.id} Product_Activity={el.active}
                    Product_Type={el.product_type} Product_Code={el.product_code} Product_Category={el.category} Product_Vendor={el.vendor}
                    Product_Image={el.product_images.map((el, i) => el.src)}
                    /> ))
                    setTimeout(() => { DetailedView(); }, 400);
                    Pagintation(1);
                })
                .fail( function(xhr) { alert(xhr.responseText); });
            }
        });


        Pagintation(1);
        setTimeout(() => { DetailedView();}, 400);

        /* Re-Sync function runs every 2 minutes*/
        var timerID = setInterval(function()
        {
            /*  API  */
            const api_key = localStorage.getItem('api_key');
            $.ajaxSetup({ headers: { 'Authorization': 'ApiKey ' + api_key} });
            $.get("http://api.integrator.com/api/products?page=1", [], [])
            .done(function( _data) 
            {
                document.querySelector(".pan-main").remove();
                let div = document.createElement("div");
                div.className = "pan-main";
                div.id = "pan-main";
                let main = document.querySelector(".main-elements");
                main.appendChild(div);
                let root = createRoot(div);

                flushSync(() => 
                { 
                    root.render(_data.map((el, i) => <Pan_details key={`${el.title}_${i}`} Product_Title={el.title} Product_ID={el.id} Product_Activity={el.active}
                    Product_Type={el.product_type} Product_Code={el.product_code} Product_Category={el.category} Product_Vendor={el.vendor}
                    Product_Image={el.product_images.map((el, i) => el.src)}
                    /> )) 
                });
                Pagintation(1);
                setTimeout(() => { DetailedView();}, 300);
            })
            .fail( function(xhr) { alert(xhr.responseText); });
        },  60 * 1000); 

        let C_filter = document.getElementById("clear_filter");
        C_filter.addEventListener("click", () => 
        {
            document.querySelector(".empty-message").style.display = "none";
            let category = document.getElementById("_category"); 
            let type = document.getElementById("_type")
            let vendor = document.getElementById("_vendor");

            category.value = ""; category.style.background = "linear-gradient(to left, rgb(78 78 78 / 61%), rgb(50 50 66 / 43%))";
            type.value = ""; type.style.background = "linear-gradient(to left, rgb(78 78 78 / 61%), rgb(50 50 66 / 43%))";
            vendor.value = ""; vendor.style.background = "linear-gradient(to left, rgb(78 78 78 / 61%), rgb(50 50 66 / 43%))";

            const api_key = localStorage.getItem('api_key');
            $.ajaxSetup({ headers: { 'Authorization': 'ApiKey ' + api_key} });
            $.get("http://api.integrator.com/api/products?page=1", [], [])
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
                if(document.querySelector(".pan-main") != null){ document.querySelector(".pan-main").remove(); }
            
                pan_main = document.createElement('div');
                let main_elements = document.querySelector(".main-elements");
                pan_main.className = "pan-main";
                main_elements.appendChild(pan_main);
                root = createRoot(pan_main);
                root.render(_data.map((el, i) => <Pan_details key={`${el.title}_${i}`} Product_Title={el.title} Product_ID={el.id} Product_Activity={el.active}
                Product_Type={el.product_type} Product_Code={el.product_code} Product_Category={el.category} Product_Vendor={el.vendor}
                Product_Image={el.product_images.map((el, i) => el.src)}
                /> )) 
                setTimeout(() => { DetailedView();}, 300);
                Pagintation(1);
                setInterval(function() 
                {
                    /*  API  */
                    const api_key = localStorage.getItem('api_key');
                    $.ajaxSetup({ headers: { 'Authorization': 'ApiKey ' + api_key} });
                    $.get("http://api.integrator.com/api/products?page=1", [], [])
                    .done(function( _data) 
                    {
                        document.querySelector(".pan-main").remove();
                        let div = document.createElement("div");
                        div.className = "pan-main";
                        div.id = "pan-main";
                        let main = document.querySelector(".main-elements");
                        main.appendChild(div);
                        let root = createRoot(div);
        
                        flushSync(() => 
                        { 
                            root.render(_data.map((el, i) => <Pan_details key={`${el.title}_${i}`} Product_Title={el.title} Product_ID={el.id} Product_Activity={el.active}
                            Product_Type={el.product_type} Product_Code={el.product_code} Product_Category={el.category} Product_Vendor={el.vendor}
                            Product_Image={el.product_images.map((el, i) => el.src)}
                            /> )) 
                        });
                        Pagintation(1);
                        setTimeout(() => { DetailedView();}, 300);
                    })
                    .fail( function(xhr) { alert(xhr.responseText); });
                }, 60 * 1000);
            })
            .fail( function(xhr) { alert(xhr.responseText); });
        });

        /* Local filter onclick to stop the product resync */
        let filter_button = document.getElementById("_filter");
        filter_button.addEventListener("click", () => { clearInterval(timerID); });

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
        <div className = "products">
            <div className = "main">
                <div className = "search">
                    <form className = "search-area" style={{top: '30px'}} id = "search" autoComplete='off' onSubmit={(event) => SearchProduct(event)}>
                        <input className ="search-area" type="search" placeholder="Search..." 
                        name = "search" value = {inputs.search || ""}  onChange = {handleChange}></input>
                    </form>    
                </div>
                <div className = "main-elements" style={{top: '53%'}}>
                    <div className = "empty-message">No results found.</div>
                    <div className = "pan-main" id = "pan-main">

                    </div>
                </div>
                <div className = "center" id = "pag" style ={{top: '45px'}}>
                    <div className = "pagination">
                        <button className = "active" id = "hod"></button>
                        <button id = "next">→</button>
                        <button id = "prev">←</button>
                    </div>
                </div>
            </div>

            <Page1 title = "Products"/>
            <div className = "details">
                <div className = 'close-button'>&times;</div>
            </div>

        </div>
    );
}

export default Products;