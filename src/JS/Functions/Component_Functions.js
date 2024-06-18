import { flushSync } from 'react-dom';
import { createRoot } from 'react-dom/client';

import $ from 'jquery';
import Pan_details from '../../components/semi-components/pan-detail';

import { DetailedView } from './Product_Functions';

export function Filter_Pagintation(index)
{
    let message = document.getElementById("message");
    if(index == 1)
    {
        let category = document.querySelector(".category").innerHTML;
        let type = document.querySelector(".type").innerHTML;
        let vendor = document.querySelector(".vendor").innerHTML;
        let ahead = index + 1;
        $.get("http://api.integrator.com/api/products/filter?type=" + type + "&vendor=" + vendor + "&category=" + category + "&page=" + ahead, [], [])
        .done(function( _data) 
        {
            if(_data == "") { let next = document.getElementById("next"); next.style.cursor = "not-allowed"; next.disabled = true; } 
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
    }

    /* Check done to remove old elements if they exist */
    if(document.getElementById("next") != null && document.getElementById("prev") != null && document.getElementById("hod") != null)
    //If they exist remove them, and create new based on the new index value
    {
        let nextPage = document.getElementById("next");
        let prevPage = document.getElementById("prev");
        let pageButton = document.getElementById("hod");
        pageButton.innerHTML = index;

        if(index == 1) { prevPage.disabled = true; prevPage.style.cursor = "not-allowed"; }
        else if(index > 1) { prevPage.style.cursor = "pointer"; prevPage.disabled = false; nextPage.disabled = false; }
        else if(index <= 1) {prevPage.disabled = true; prevPage.style.cursor = "not-allowed"; }

        nextPage.addEventListener("click", () =>
        {
            let category = document.querySelector(".category").innerHTML;
            let type = document.querySelector(".type").innerHTML;
            let vendor = document.querySelector(".vendor").innerHTML;

            index = index + 1;
            /*  API  */
            const api_key = localStorage.getItem('api_key');
            $.ajaxSetup({ headers: { 'Authorization': 'ApiKey ' + api_key} });
            $.get("http://api.integrator.com/api/products/filter?type=" + type + "&vendor=" + vendor + "&category=" + category + "&page=" + index, [], [])
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

            let ahead = index + 1;
            /*  API  */
            $.get("http://api.integrator.com/api/products/filter?type=" + type + "&vendor=" + vendor + "&category=" + category + "&page=" + ahead, [], [])
            .done(function( _data) 
            {
                if(_data == "") { let next = document.getElementById("next"); next.style.cursor = "not-allowed"; next.disabled = true; }  
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

            Filter_Pagintation(index);
            setTimeout(() => { DetailedView();}, 200);
        });


        prevPage.addEventListener("click", () =>
        {
            let category = document.querySelector(".category").innerHTML;
            let type = document.querySelector(".type").innerHTML;
            let vendor = document.querySelector(".vendor").innerHTML;
            index = index - 1;
            const api_key = localStorage.getItem('api_key');
            $.ajaxSetup({ headers: { 'Authorization': 'ApiKey ' + api_key} });
            $.get("http://api.integrator.com/api/products/filter?type=" + type + "&vendor=" + vendor + "&category=" + category + "&page=" + index, [], [])
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
            Filter_Pagintation(index);
            setTimeout(() => { DetailedView();}, 200);
        });
    }
    else 
    //If they dont exist create new ones 
    {
        let nextPage = document.getElementById("next");
        let prevPage = document.getElementById("prev");
        let pageButton = document.getElementById("hod");
        pageButton.innerHTML = index;

        if(index == 1) { prevPage.disabled = true; prevPage.style.cursor = "not-allowed"; }
        else if(index > 1) { prevPage.style.cursor = "pointer"; prevPage.disabled = false; nextPage.disabled = false; }
        else if(index <= 1) {prevPage.disabled = true; prevPage.style.cursor = "not-allowed"; }

        nextPage.addEventListener("click", () =>
        {
            let category = document.querySelector(".category").innerHTML;
            let type = document.querySelector(".type").innerHTML;
            let vendor = document.querySelector(".vendor").innerHTML;

            index = index + 1;

            const api_key = localStorage.getItem('api_key');
            $.ajaxSetup({ headers: { 'Authorization': 'ApiKey ' + api_key} });
            $.get("http://api.integrator.com/api/products/filter?type=" + type + "&vendor=" + vendor + "&category=" + category + "&page=" + index, [], [])
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
            Filter_Pagintation(index);
            setTimeout(() => { DetailedView();}, 200);
        });

        prevPage.addEventListener("click", () =>
        {
            let category = document.querySelector(".category").innerHTML;
            let type = document.querySelector(".type").innerHTML;
            let vendor = document.querySelector(".vendor").innerHTML;
            index = index - 1;

            const api_key = localStorage.getItem('api_key');
            $.ajaxSetup({ headers: { 'Authorization': 'ApiKey ' + api_key} });
            $.get("http://api.integrator.com/api/products/filter?type=" + type + "&vendor=" + vendor + "&category=" + category + "&page=" + index, [], [])
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
            Filter_Pagintation(index);
            setTimeout(() => { DetailedView();}, 200);
        });
    } 
}