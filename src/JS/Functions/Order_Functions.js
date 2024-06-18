import { createRoot } from 'react-dom/client';
import { flushSync } from 'react-dom';
import $ from 'jquery';
import Order_details from '../../components/semi-components/order-details';
import Detailed_order from '../../components/semi-components/Order/detailed_order';
import Detailed_Table_View from '../../components/semi-components/Order/detailed_table_view';
import Detailed_table from '../../components/semi-components/Order/detailed_table';
import Detailed_Address from '../../components/semi-components/Order/detailed_address';

export function DetailedView() 
{
    let orders = document.querySelector(".orders");
    let pan = document.querySelectorAll(".pan");
    for(let i = 0; i < pan.length; i++)
    {
        pan[i].addEventListener("click", () =>
        {
            let id = pan[i].querySelector(".p-d-id").innerHTML;
            /*  API  */
            const api_key = localStorage.getItem('api_key');
            $.ajaxSetup({ headers: { 'Authorization': 'ApiKey ' + api_key} });
            $.get("http://api.integrator.com/api/orders/" + id, [], [], 'json')
            .done(function(_data) 
            {   

                if(document.querySelector(".details") != null)
                //div already exists, remove it, and create another
                {
                    document.querySelector(".details").remove();
                    let details = document.createElement('div');
                    details.className = "details";
                    orders.appendChild(details);

                    let rot = createRoot(details);
                    rot.render(<Detailed_order key={`${_data.title}_${i}`}
                    firstName={_data.customer.first_name} lastName={_data.customer.last_name} Order_Title={_data.web_code} 
                    />)

                    /* For some reason it wont pick up the element unless it throw it here */
                    setTimeout(() =>
                    {
                        let _div = details.querySelector("#detailed_table_view");
                        let div_ = details.querySelector("#detailed_table");
                        let rt = createRoot(_div);
                        let _rt = createRoot(div_);
                        if(_data.shipping_lines == "")
                        {
                            rt.render(<Detailed_Table_View key={`${_data.title}_${i}`} Sub_Total={_data.order_total} Tax_Percent={((_data.tax_total)/(_data.order_total))*100}
                            Tax_Amount={_data.tax_total} Shipping_Type={''} Shipping_Amount={''} 
                            Total={parseFloat(_data.order_total) + parseFloat(_data.tax_total)}
                            />)
                            _rt.render(_data.line_items.map((el, i) => <Detailed_table  key={`${_data.title}_${i}`} Order_SKU={el.sku} 
                            Quantity={el.qty} Barcode={el.barcode} Order_Price={el.price}
                            />))

                            let address = document.getElementById("address");
                            let rt_ = createRoot(address);
                            rt_.render(_data.customer.addresses.map((el, i) => <Detailed_Address key={`${_data.title}_${i}`}
                            Address_Name={el.address_type.charAt(0).toUpperCase() + el.address_type.slice(1)} Address1={el.address_1} Address2={el.address_2} 
                            Address3 ={el.city} Address4={el.suburb} Address5={el.postal_code}
                            />))
                        }
                        else 
                        {
                            rt.render(<Detailed_Table_View key={`${_data.title}_${i}`} Sub_Total={_data.order_total} Tax_Percent={((_data.tax_total)/(_data.order_total))*100}
                            Tax_Amount={_data.tax_total} Shipping_Type={_data.shipping_lines[0].sku} Shipping_Amount={_data.shipping_lines[0].price} 
                            Total={parseFloat(_data.order_total) + parseFloat(_data.tax_total) + parseFloat(_data.shipping_lines[0].price)}
                            />)
                            _rt.render(_data.line_items.map((el, i) => <Detailed_table  key={`${_data.title}_${i}`} Order_SKU={el.sku} 
                            Quantity={el.qty} Barcode={el.barcode} Order_Price={el.price}
                            />))

                            let address = document.getElementById("address");
                            let rt_ = createRoot(address);
                            rt_.render(_data.customer.addresses.map((el, i) => <Detailed_Address key={`${_data.title}_${i}`}
                            Address_Name={el.address_type.charAt(0).toUpperCase() + el.address_type.slice(1)} Address1={el.address_1} Address2={el.address_2} 
                            Address3 ={el.city} Address4={el.suburb} Address5={el.postal_code}
                            />))
                        }
                    }, 10);    
                }
                else 
                //create new div
                {
                    let details = document.querySelector(".details");
                    let _div = details.querySelector("#detailed_table_view");
                    let div_ = details.querySelector("#detailed_table");
                    let rt = createRoot(_div);
                    let _rt = createRoot(div_);
                    if(_data.shipping_lines == "")
                    {
                        rt.render(<Detailed_Table_View key={`${_data.title}_${i}`} Sub_Total={_data.order_total} Tax_Percent={((_data.tax_total)/(_data.order_total))*100}
                        Tax_Amount={_data.tax_total} Shipping_Type={''} Shipping_Amount={''} 
                        Total={parseFloat(_data.order_total) + parseFloat(_data.tax_total)}
                        />)
                        _rt.render(_data.line_items.map((el, i) => <Detailed_table  key={`${_data.title}_${i}`} Order_SKU={el.sku} 
                        Quantity={el.qty} Barcode={el.barcode} Order_Price={el.price}
                        />))

                        let address = document.getElementById("address");
                        let rt_ = createRoot(address);
                        rt_.render(_data.customer.addresses.map((el, i) => <Detailed_Address key={`${_data.title}_${i}`}
                        Address_Name={el.address_type.charAt(0).toUpperCase() + el.address_type.slice(1)} Address1={el.address_1} Address2={el.address_2} 
                        Address3 ={el.city} Address4={el.suburb} Address5={el.postal_code}
                        />))
                    }
                    else 
                    {
                        rt.render(<Detailed_Table_View key={`${_data.title}_${i}`} Sub_Total={_data.order_total} Tax_Percent={((_data.tax_total)/(_data.order_total))*100}
                        Tax_Amount={_data.tax_total} Shipping_Type={_data.shipping_lines[0].sku} Shipping_Amount={_data.shipping_lines[0].price} 
                        Total={parseFloat(_data.order_total) + parseFloat(_data.tax_total) + parseFloat(_data.shipping_lines[0].price)}
                        />)
                        _rt.render(_data.line_items.map((el, i) => <Detailed_table  key={`${_data.title}_${i}`} Order_SKU={el.sku} 
                        Quantity={el.qty} Barcode={el.barcode} Order_Price={el.price}
                        />))

                        let address = document.getElementById("address");
                        let rt_ = createRoot(address);
                        rt_.render(_data.customer.addresses.map((el, i) => <Detailed_Address key={`${_data.title}_${i}`}
                        Address_Name={el.address_type.charAt(0).toUpperCase() + el.address_type.slice(1)} Address1={el.address_1} Address2={el.address_2} 
                        Address3 ={el.city} Address4={el.suburb} Address5={el.postal_code}
                        />))
                    }
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
    $.get('http://api.integrator.com/api/orders?page=' + ahead, [], [])
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

        /*
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
        */

        if(index == 1) { prevPage.disabled = true; prevPage.style.cursor = "not-allowed"; }
        else if(index > 1) { prevPage.style.cursor = "pointer"; prevPage.disabled = false; nextPage.disabled = false; }
        else if(index <= 1) {prevPage.disabled = true; prevPage.style.cursor = "not-allowed"; }
        

        nextPage.addEventListener("click", () =>
        {
            index = index + 1;
            /* Fetches the data from page, based on the page / index value */
            const page = "http://api.integrator.com/api/order?page=" + index;
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
                    root.render(_data.map((el, i) => <Order_details key={`${el.title}_${i}`} /> ))
                });
            })
            .fail( function(xhr) { alert(xhr.responseText); });

            let ahead = index + 1;
            /*  API  */
            $.get('http://api.integrator.com/api/order?page=' + ahead, [], [])
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
            const page = "http://api.integrator.com/api/order?page=" + index;

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
                    root.render(_data.map((el, i) => <Order_details key={`${el.title}_${i}`} /> )) 
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
            const page = "http://api.integrator.com/api/order?page=" + index;
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
                    root.render(_data.map((el, i) => <Order_details key={`${el.title}_${i}`} /> ))
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
            const page = "http://api.integrator.com/api/order?page=" + index;

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
                    root.render(_data.map((el, i) => <Order_details key={`${el.title}_${i}`} /> ))
                });
            })
            .fail( function(xhr) { alert(xhr.responseText); });
            Pagintation(index);
            setTimeout(() => { DetailedView();}, 300);
        });
    }
}


