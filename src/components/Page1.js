import {useEffect, useState} from 'react';
import { flushSync } from 'react-dom';
import { createRoot } from 'react-dom/client';
import $ from 'jquery';
import Pan_details from './semi-components/pan-detail';
import '../CSS/page1.css';

import { DetailedView } from '../JS/Functions/Product_Functions';
import { Filter_Pagintation } from '../JS/Functions/Component_Functions';


function Page1(props)
{
    const[inputs, setInputs] = useState({});

    const handleChange = (event) => 
    {
        const name = event.target.name;
        const value = event.target.value;
        setInputs(values => ({...values, [name]: value}))
    }

    const Filter = (event) =>
    {
        event.preventDefault();

        let category = document.querySelector("#_category"); let _category = document.querySelector(".category");
        let type = document.querySelector("#_type"); let _type = document.querySelector(".type");
        let vendor = document.querySelector("#_vendor"); let _vendor = document.querySelector(".vendor");
        
        if(category.value == undefined) {category.value = "";}
        if(type.value == undefined) {type.value = "";}
        if(vendor.value == undefined) {vendor.value = "";}

        _category.innerHTML = category.value; _type.innerHTML = type.value;
        _vendor.innerHTML = vendor.value;


        let filter_input = document.querySelectorAll(".filter-selection-main");
        let navbar = document.querySelector(".navbar"); let main = document.querySelector(".main"); 
        let filter = document.querySelector(".filter");
        for(let i = 0; i < filter_input.length; i++) { filter_input[i].style.display = "none"; }
        let filter_button = document.getElementById("_filter"); let C_filter = document.getElementById("clear_filter");
        filter_button.disabled = false; C_filter.disabled = false;
        filter_button.style.cursor = "pointer"; C_filter.style.cursor = "pointer"; navbar.style.display = "block";
        main.style.display = "block"; filter.style.display = "block";
    }


    useEffect(()=> 
    {
        /* Ensure the model is shown */
        let navbar = document.getElementById("navbar");
        let message = document.getElementById("message");
        navbar.style.display = "block";
        
        /* animation for the search bar */
        let search = document.querySelector(".search-area");
        setTimeout(() =>
        { search.style.opacity = "1"; search.style.animation = "appear 0.8s ease-in"; }, 1000);

        /* animation for the pan elements */
        let pan = document.querySelectorAll(".pan");
        let pag = document.getElementById("pag");
        setTimeout(() =>
        {
            for(let i = 0; i < pan.length; i ++)
            {
                pan[i].style.display = "block";
                pan[i].style.animation = "appear 0.8s ease-in";
            }
            pag.style.display = "block";
            pag.style.animation = "appear 1s ease-in";
        }, 1000);


        /* filter element animation */
        let filters = document.querySelector(".filter").children;
        setTimeout(() =>
        {
            for(let i = 0; i < filters.length; i ++)
            {
                filters[i].style.display = "block";
                filters[i].style.animation = "appear 0.8s ease-in";
            }
        }, 1000);

        /* filter image script to show when clicked on */
        let filter_button = document.getElementById("_filter");
        let filter = document.querySelectorAll(".filter-elements");
        let filter_img = document.querySelectorAll(".filter-img");
        let C_filter = document.getElementById("clear_filter");
        let filter_input = document.querySelectorAll(".filter-selection-main");
        let close = document.querySelectorAll(".close-filter");


        filter_button.disabled = true;
        C_filter.disabled = true;

        for(let i = 0; i < filter.length; i++)
        {
            /* Filter Onclick */
            filter[i].addEventListener("click", () =>
            {
                filter_img[i].style.display = "block";
                filter[i].style.backgroundColor = "rgba(64, 165, 24, 0.7)";
                filter_input[i].style.display = "block";
            });

            /* Filter Close button onclick */
            close[i].addEventListener("click", () =>
            {
                filter_img[i].style.display = "none";
                filter[i].style.background = "linear-gradient(to left, rgb(78 78 78 / 61%), rgb(50 50 66 / 43%))";
                filter_input[i].style.display = "none";
                let element = close[i].parentElement;
                element.querySelector(".input_field").value = "";
            });

            /* Clear Filter */
            C_filter.addEventListener("click", () =>
            {
                filter_img[i].style.display = "none";
                filter[i].style.background = "linear-gradient(to left, rgb(78 78 78 / 61%), rgb(50 50 66 / 43%))";
            });
            
        }

        /* Filter */
        filter_button.addEventListener("click", () =>
        {
            let category = document.querySelector(".category").innerHTML;
            let type = document.querySelector(".type").innerHTML;
            let vendor = document.querySelector(".vendor").innerHTML;
            let next = document.getElementById("next");

            $.get("http://api.integrator.com/api/products/filter?type=" +type + "&" + "vendor="+ vendor +"&category="+category,[], [], 'json')
            .done(function( _data) 
            {
                category = ""; type = ""; vendor = "";
                
                if(_data.length < 10)
                {
                    next.disabled = true;
                    next.style.cursor = "not-allowed";
                }
                if(_data == "")
                {
                    document.querySelector(".pan-main").remove();
                    document.querySelector(".empty-message").style.display = "block";
                }
                else 
                {
                    if(document.querySelector(".pan-main") != null)
                    {
                        document.querySelector(".pan-main").remove();
                        let pan_main = document.createElement('div');
                        let main_elements = document.querySelector(".main-elements");
                        pan_main.className = "pan-main";
                        main_elements.appendChild(pan_main);

                        let root = createRoot(pan_main);
                        flushSync(() => 
                        {
                            root.render(_data.map((el, i) => <Pan_details key={`${el.title}_${i}`} Product_Title={el.title} Product_ID={el.id} Product_Activity={el.active}
                            Product_Type={el.product_type} Product_Code={el.product_code} Product_Category={el.category} Product_Vendor={el.vendor}
                            Product_Image={el.product_images.map((el, i) => el.src)}
                            /> )) 
                        });
                        setTimeout(() => { DetailedView();}, 200);
                    }
                    else 
                    {
                        let pan_main = document.createElement('div');
                        let main_elements = document.querySelector(".main-elements");
                        pan_main.className = "pan-main";
                        main_elements.appendChild(pan_main);

                        let root = createRoot(pan_main);
                        flushSync(() => 
                        {
                            root.render(_data.map((el, i) => <Pan_details key={`${el.title}_${i}`} Product_Title={el.title} Product_ID={el.id} Product_Activity={el.active}
                            Product_Type={el.product_type} Product_Code={el.product_code} Product_Category={el.category} Product_Vendor={el.vendor}
                            Product_Image={el.product_images.map((el, i) => el.src)}
                            /> )) 
                        });
                        setTimeout(() => { DetailedView();}, 200);
                    }
                } 
            })
            .fail( function(xhr) 
            { 
                message.style.display = "block";
                message.innerHTML = JSON.parse(xhr.responseText).error;
                message.style.background = "#9f0a0a";
                setTimeout(() =>
                {
                    message.innerHTML = "";
                    message.style.backgroundColor = "transparent";
                    message.style.display = "none";
                }, 1000);
            });
        });

        filter_button.addEventListener("click", () =>
        {
            Filter_Pagintation(1);
        });

        /* Fetch-Products Button */
        let fetch = document.getElementById("fetch");
        fetch.addEventListener("click", () =>
        {
            fetch.disabled = true;
            fetch.style.cursor = "not-allowed";
            fetch.style.backgroundColor = "rgb(11, 11, 11, 0.55)";

            let message = document.getElementById("message");
            message.style.display = "block";

            const api_key = localStorage.getItem('api_key');
            $.ajaxSetup({ headers: { 'Authorization': 'ApiKey ' + api_key} });
            $.get("http://api.integrator.com/api/shopify/fetch", [], [])
            .done(function( _data) 
            {
                fetch.disabled = false;
                fetch.style.cursor = "pointer";
                fetch.style.backgroundColor = "rgba(61, 61, 61, 0.55)";

                message.innerHTML = "success";
                message.style.background = "#1a5e12";
                setTimeout(() =>
                {
                    message.innerHTML = "";
                    message.style.backgroundColor = "transparent";
                    message.style.display = "none";
                }, 2000);
            })
            .fail( function(xhr) 
            { 
                message.style.display = "block";
                message.innerHTML = JSON.parse(xhr.responseText).error;
                message.style.background = "#9f0a0a";
                setTimeout(() =>
                {
                    message.innerHTML = "";
                    message.style.backgroundColor = "transparent";
                    message.style.display = "none";
                }, 1000);
            }); 
            
        });


        /* Push(SYNC)-Products Button */
        let push = document.getElementById("push");
        push.addEventListener("click", () =>
        {
            push.disabled = true;
            push.style.cursor = "not-allowed";
            push.style.backgroundColor = "rgb(11, 11, 11, 0.55)";

            let message = document.getElementById("message");
            message.style.display = "block";
            
            const api_key = localStorage.getItem('api_key');
            $.ajaxSetup({ headers: { 'Authorization': 'ApiKey ' + api_key} });
            $.post("http://api.integrator.com/api/shopify/sync", [], [])
            .done(function( _data) 
            {
                push.disabled = false;
                push.style.cursor = "pointer";
                push.style.backgroundColor = "rgba(61, 61, 61, 0.55)";

                message.innerHTML = _data.message;
                message.style.background = "#1a5e12";
                setTimeout(() =>
                {
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
        });
    }, []);

    return (
        <>
            <div className = "filter" style = {{display: props.filter_display}}>
                <div className = "filter-title"><b>Available Filters:</b></div>
                <div className = "filter-elements">
                    <div className = "filter-elements-text">Filter By Type</div>
                    <div className = "filter-img"/>
                    <div className = "type"></div>
                </div>
                <div className = "filter-elements">
                    <div className = "filter-elements-text">Filter By Vendor</div>
                    <div className = "filter-img"/>
                    <div className = "vendor"></div>
                </div>
                <div className = "filter-elements">
                    <div className = "filter-elements-text">Filter By Category</div>
                    <div className = "filter-img"/>
                    <div className = "category"></div>
                </div>
                <br/>

                <div id = "button-hold">
                    <button id = "clear_filter"className = "filter-button _filter">Clear Filter</button>
                    <button id = "_filter"className = "filter-button clear">Filter Results</button>
                </div>
                
                <br/><br/>
                <div className = "filter-title"><b>Product Sync</b></div>
                <div className = "fetch-product" id = "fetch"><div className = "filter-elements-text">Fetch Products</div></div>
                <div className = "push-product" id = "push"><div className = "filter-elements-text">Push Products</div></div>

                
            </div>
            <div className = "filter-selection-main">
                <div className = "filter-input">
                    <div className = 'close-filter'>&times;</div>
                    <div className = "filter-selection-title">Filter Type</div>
                    <form method = 'post' onSubmit={(event) => Filter(event)} autoComplete='off'>
                        <span><input className = "input_field" id = "_type" type = 'type' placeholder = "Enter Type" name = "type" required></input></span>
                        <br/><br/><br/>
                        <button className = 'button' type = 'submit'>Confirm</button>
                    </form>

                </div>
            </div>
            <div className = "filter-selection-main">
                <div className = "filter-input">
                    <div className = 'close-filter'>&times;</div>
                    <div className = "filter-selection-title">Filter Vendor</div>
                    <form method = 'post' onSubmit={(event) => Filter(event)} autoComplete='off'>
                        <span><input className = "input_field" id = "_vendor" type = 'vendor' placeholder = "Enter Vendor" name = "vendor"required></input></span>
                        <br/><br/><br/>
                        <button className = 'button' type = 'submit'>Confirm</button>
                    </form>
                </div>
            </div>
            <div className = "filter-selection-main">
                <div className = "filter-input">
                    <div className = 'close-filter'>&times;</div>
                    <div className = "filter-selection-title">Filter Category</div>
                    <form method = 'post' onSubmit={(event) => Filter(event)} autoComplete='off'>
                        <span><input className = "input_field" id = "_category" type = 'type' placeholder = "Enter Category" name = "category" required></input></span>
                        <br/><br/><br/>
                        <button className = 'button' type = 'submit'>Confirm</button>
                    </form>
                </div>
            </div>
            <div className = 'info-message' id = 'message' />
        </>
    );
}
Page1.defaultProps = 
{
    filter_display: 'block', 
    main_display: 'block',
    main_bgc: '',
    main_top: '13%',
    main_left: '51%',
    transform: 'translate(-30%, -6%)',
    width: '70%',
    height: '96%', 
    animation: 'SlideUp2 0.8s ease-in'
};

export default Page1;