import { createRoot } from 'react-dom/client';
import { flushSync } from 'react-dom';
import $ from 'jquery';
import Customer_details from '../../components/semi-components/customer-details';
import Detailed_customer from '../../components/semi-components/Customer/detailed_customer';
import Detailed_shipping from '../../components/semi-components/Customer/detailed_shipping';


export function DetailedView() 
{
    let customers = document.querySelector(".customer");
    let pan = document.querySelectorAll(".pan");
    for(let i = 0; i < pan.length; i++)
    {
        pan[i].addEventListener("click", () =>
        {
            let id = pan[i].querySelector(".p-d-title").innerHTML;
            /*  API  */
            const api_key = localStorage.getItem('api_key');
            $.ajaxSetup({ headers: { 'Authorization': 'ApiKey ' + api_key} });
            $.get("http://api.integrator.com/api/customers/" + id, [], [], 'json')
            .done(function(_data) 
            {   
                if(document.querySelector(".details") != null)
                //div already exists, remove it, and create another
                {

                    document.querySelector(".details").remove();
                    let details = document.createElement('div');
                    details.className = "details";
                    customers.appendChild(details);

                    let rot = createRoot(details);
                    rot.render( <Detailed_customer key={`${_data.title}_${i}`} Customer_ID={_data.id}
                    Customer_firstName={_data.first_name} Customer_lastName={_data.last_name} Customer_Phone={_data.phone}
                    Customer_address={_data.addresses.map((el, i) => <Detailed_shipping key={`${el.title}_${i}`} 
                    Address_type={el.address_type[0].toUpperCase() + el.address_type.slice(1)} Shipping1 = {el.address_1} Shipping2 = {el.address_2}
                    Shipping3 = {el.city} Shipping4 = {el.province} Shipping5 = {el.postal_code} />)}
                    />)
                }
                else 
                //create new div
                {
                    let details = document.createElement('details');
                    customers.appendChild(details);
                    let rot = createRoot(details);
                    rot.render( <Detailed_customer key={`${_data.title}_${i}`} Customer_ID={_data.id}
                    Customer_firstName={_data.first_name} Customer_lastName={_data.last_name} Customer_Phone={_data.phone}
                    Customer_address={_data.addresses.map((el, i) => <Detailed_shipping key={`${el.title}_${i}`} 
                    Address_type={el.address_type[0].toUpperCase() + el.address_type.slice(1)} Shipping1 = {el.address_1} Shipping2 = {el.address_2}
                    Shipping3 = {el.city} Shipping4 = {el.province} Shipping5 = {el.postal_code} />)}
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

export function Pagintation(index) 
{
    let ahead = index + 1;
    /*  API  */
    $.get('http://api.integrator.com/api/customers?page=' + ahead, [], [])
    .done(function( _data) 
    {
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

        let nextPage = document.getElementById("next");
        let prevPage = document.getElementById("prev");
        let pageButton = document.getElementById("hod");
        pageButton.innerHTML = index;

        if(index == 1) { prevPage.disabled = true; prevPage.style.cursor = "not-allowed"; }
        else if(index > 1) { prevPage.style.cursor = "pointer"; prevPage.disabled = false; nextPage.disabled = false; }
        else if(index <= 1) {prevPage.disabled = true; prevPage.style.cursor = "not-allowed"; }
        

        nextPage.addEventListener("click", () =>
        {
            index = index + 1;
            /* Fetches the data from page, based on the page / index value */
            const page = "http://api.integrator.com/api/customers?page=" + index;
            /*  API  */
            const api_key = localStorage.getItem('api_key');
            $.ajaxSetup({ headers: { 'Authorization': 'ApiKey ' + api_key} });
            $.get(page, [], [])
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
                    root.render(_data.map((el, i) => <Customer_details key={`${el.title}_${i}`} Customer_ID={el.id}
                    Customer_firstName={el.first_name} Customer_lastName={el.last_name} Customer_Phone={el.phone}
                    />))
                });
            })
            .fail( function(xhr) { alert(xhr.responseText); });

            let ahead = index + 1;
            /*  API  */
            $.get('http://api.integrator.com/api/customers?page=' + ahead, [], [])
            .done(function( _data) 
            {
                if(_data == "")
                {
                    let next = document.getElementById("next");
                    next.style.cursor = "not-allowed";
                    next.disabled = true;
                } 
            })
            .fail( function(xhr) { alert(xhr.responseText); });

            Pagintation(index);
            setTimeout(() => { DetailedView();}, 300);
        });

        prevPage.addEventListener("click", () =>
        {
            index = index - 1;
            /* Fetches the data from page, based on the page / index value */
            const page = "http://api.integrator.com/api/customers?page=" + index;

            /*  API  */
            const api_key = localStorage.getItem('api_key');
            $.ajaxSetup({ headers: { 'Authorization': 'ApiKey ' + api_key} });
            $.get(page, [], [])
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
                    root.render(_data.map((el, i) => <Customer_details key={`${el.title}_${i}`} Customer_ID={el.id}
                    Customer_firstName={el.first_name} Customer_lastName={el.last_name} Customer_Phone={el.phone}
                    />))
                });
            })
            .fail( function(xhr) { alert(xhr.responseText); });
            Pagintation(index);
            setTimeout(() => { DetailedView();}, 300);
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
            index = index + 1;
            /* Fetches the data from page, based on the page / index value */
            const page = "http://api.integrator.com/api/customers?page=" + index;
            /*  API  */
            const api_key = localStorage.getItem('api_key');
            $.ajaxSetup({ headers: { 'Authorization': 'ApiKey ' + api_key} });
            $.get(page, [], [])
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
                    root.render(_data.map((el, i) => <Customer_details key={`${el.title}_${i}`} Customer_ID={el.id}
                    Customer_firstName={el.first_name} Customer_lastName={el.last_name} Customer_Phone={el.phone}
                    />)) 
                });
            })
            .fail( function(xhr) { alert(xhr.responseText); });
            Pagintation(index);
            setTimeout(() => { DetailedView();}, 300);
        });
        prevPage.addEventListener("click", () =>
        {
            index = index - 1;
            /* Fetches the data from page, based on the page / index value */
            const page = "http://api.integrator.com/api/customers?page=" + index;

            /*  API  */
            const api_key = localStorage.getItem('api_key');
            $.ajaxSetup({ headers: { 'Authorization': 'ApiKey ' + api_key} });
            $.get(page, [], [])
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
                    root.render(_data.map((el, i) => <Customer_details key={`${el.title}_${i}`} Customer_ID={el.id}
                    Customer_firstName={el.first_name} Customer_lastName={el.last_name} Customer_Phone={el.phone}
                    />))
                });
            })
            .fail( function(xhr) { alert(xhr.responseText); });
            Pagintation(index);
            setTimeout(() => { DetailedView();}, 300);
        });
    }
}