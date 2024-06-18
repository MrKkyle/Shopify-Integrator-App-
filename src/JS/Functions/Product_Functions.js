import { createRoot } from 'react-dom/client';
import $ from 'jquery';
import { flushSync } from 'react-dom';
import Pan_details from '../../components/semi-components/pan-detail';
import Detailed_product from '../../components/semi-components/Product/detailed_product';
import Product_Variants from '../../components/semi-components/Product/product_variants';
import Detailed_Images from '../../components/semi-components/Product/detailed_images';
import Detailed_Images2 from '../../components/semi-components/Product/detailed_images2';
import Detailed_Price from '../../components/semi-components/Product/detailed_prices';
import Detailed_Quantities from '../../components/semi-components/Product/detailed_quantities';
import Detailed_Options from '../../components/semi-components/Product/detailed_options';

export function DetailedView()
{
    let products = document.querySelector(".products")
    let pan = document.querySelectorAll(".pan");

    for(let i = 0; i < pan.length; i++)
    {
        pan[i].addEventListener("click", () =>
        {
            let id = pan[i].querySelector(".p-d-id").innerHTML;
            /*  API  */
            const api_key = localStorage.getItem('api_key');
            $.ajaxSetup({ headers: { 'Authorization': 'ApiKey ' + api_key} });
            $.get("http://api.integrator.com/api/products/" + id, [], [], 'json')
            .done(function(_data) 
            {   
                if(document.querySelector(".details") != null)
                //div already exists, remove it, and create another
                {

                    document.querySelector(".details").remove();
                    let details = document.createElement('div');
                    details.className = "details";
                    products.appendChild(details);

                    let rot = createRoot(details);
                    rot.render( <Detailed_product key={`${_data.title}_${i}`} Product_Title = {_data.title} Product_Category={_data.category} Product_Code={_data.product_code}
                        Product_Type={_data.product_type} Product_Vendor={_data.vendor} Product_ID={_data.id} Product_Activity={_data.active}
                        Product_Options={_data.options.map((el, i) => <Detailed_Options key={`${el.title}_${i}`} Option_Value={el.value} Option_Name = {el.position} />)}
                    />) 
                    /* For some reason it wont pick up the element unless it throw it here */
                    setTimeout(() =>
                    {
                        document.querySelector(".ql-editor").innerHTML = _data.body_html;
                        let _div = details.querySelectorAll(".auto-slideshow-container");
                        for(let i = 0; i < _div.length; i++)
                        {
                            let _root = createRoot(_div[i]);
                            if(i == 0) { _root.render( _data.product_images.map((el, i) => <Detailed_Images key={`${el.title}_${i}`} Image1 = {el.src}/> )) }
                            else { _root.render( _data.product_images.map((el, i) => <Detailed_Images2 key={`${el.title}_${i}`} Image1 = {el.src}/> )) }
                        }
                        let new_div = details.querySelector(".variants"); 
                        let rt = createRoot(new_div);
                        rt.render( _data.variants.map((el, i) => <Product_Variants key={`${el.title}_${i}`} Variant_Title = {el.id}
                        Variant_Barcode={el.barcode} Variant_SKU={el.sku} Variant_UpdateDate={el.updated_at} 
                        Option1={el.option1} Option2={el.option2} Option3={el.option3} 
                        Price={el.variant_price_tiers.map((el, i) => <Detailed_Price key={`${el.title}_${i}`} Price_Name={el.name} Price_Value={el.value}  />)}
                        Quantities={el.variant_quantities.map((el, i) => <Detailed_Quantities key={`${el.title}_${i}`} quantity_value = {el.value} 
                        quantity_name={el.name}/>)}
                        />))
                    }, 20);
                }
                else 
                //create new div
                {
                    let details = document.createElement('details');
                    products.appendChild(details);
                    let rot = createRoot(details);
                    rot.render( <Detailed_product key={`${_data.title}_${i}`} Product_Title = {_data.title} Product_Category={_data.category} Product_Code={_data.product_code}
                        Product_Type={_data.product_type} Product_Vendor={_data.vendor} Product_ID={_data.id} Product_Activity={_data.active}
                        Product_Options={_data.options.map((el, i) => <Detailed_Options key={`${el.title}_${i}`} Option_Value={el.value} Option_Name = {el.position} />)} 
                    />) 
                    /* For some reason it wont pick up the element unless it throw it here */
                    setTimeout(() =>
                    {
                        document.querySelector(".ql-editor").innerHTML = _data.body_html;

                        //details.querySelector("#description").innerHTML = _data.body_html;
                        let _div = details.querySelectorAll(".auto-slideshow-container");
                        for(let i = 0; i < _div.length; i++)
                        {
                            let _root = createRoot(_div[i]);
                            if(i == 0)
                            {
                                _root.render( _data.product_images.map((el, i) => <Detailed_Images key={`${el.title}_${i}`} Image1 = {el.src}/> ))
                            }
                            else 
                            {
                                _root.render( _data.product_images.map((el, i) => <Detailed_Images2 key={`${el.title}_${i}`} Image1 = {el.src}/> ))
                            }
                        }
                        let new_div = details.querySelector(".variants"); 
                        let rt = createRoot(new_div);
                        rt.render( _data.variants.map((el, i) => <Product_Variants key={`${el.title}_${i}`} Variant_Title = {el.id}
                        Variant_Barcode={el.barcode} Variant_SKU={el.sku} Variant_UpdateDate={el.updated_at} 
                        Option1={el.option1} Option2={el.option2} Option3={el.option3} 
                        Price={el.variant_price_tiers.map((el, i) => <Detailed_Price key={`${el.title}_${i}`} Price_Name={el.name} Price_Value={el.value}  />)}
                        Quantities={el.variant_quantities.map((el, i) => <Detailed_Quantities key={`${el.title}_${i}`} quantity_value = {el.value} 
                        quantity_name={el.name}/>)}
                        /> ))
                    }, 20);
                }
            })
            .fail( function(xhr) 
            {
                alert(xhr.responseText);
            });
            setTimeout(() =>
            {
                let filter = document.querySelector(".filter");
                let main = document.querySelector(".main");
                let navbar = document.getElementById("navbar");
                let details = document.querySelector(".details");

                filter.style.animation = "Fadeout 0.5s ease-out";
                main.style.animation = "Fadeout 0.5s ease-out";
                navbar.style.animation = "Fadeout 0.5s ease-out";
                filter.style.display = "none";
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
    $.get('http://api.integrator.com/api/products?page=' + ahead, [], [])
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
            const page = "http://api.integrator.com/api/products?page=" + index;
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
                    root.render(_data.map((el, i) => <Pan_details key={`${el.title}_${i}`} Product_Title={el.title} Product_ID={el.id} Product_Activity={el.active}
                    Product_Type={el.product_type} Product_Code={el.product_code} Product_Category={el.category} Product_Vendor={el.vendor}
                    Product_Image={el.product_images.map((el, i) => el.src)}
                    /> )) 
                });
            })
            .fail( function(xhr) { alert(xhr.responseText); });

            let ahead = index + 1;
            /*  API  */
            $.get('http://api.integrator.com/api/products?page=' + ahead, [], [])
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
            setTimeout(() => { DetailedView();}, 400);
        });

        prevPage.addEventListener("click", () =>
        {
            index = index - 1;
            /* Fetches the data from page, based on the page / index value */
            const page = "http://api.integrator.com/api/products?page=" + index;

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
                    root.render(_data.map((el, i) => <Pan_details key={`${el.title}_${i}`} Product_Title={el.title} Product_ID={el.id} Product_Activity={el.active}
                    Product_Type={el.product_type} Product_Code={el.product_code} Product_Category={el.category} Product_Vendor={el.vendor}
                    Product_Image={el.product_images.map((el, i) => el.src)}
                    /> )) 
                });
            })
            .fail( function(xhr) { alert(xhr.responseText); });
            Pagintation(index);
            setTimeout(() => { DetailedView();}, 400);
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
            const page = "http://api.integrator.com/api/products?page=" + index;
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
                    root.render(_data.map((el, i) => <Pan_details key={`${el.title}_${i}`} Product_Title={el.title} Product_ID={el.id} Product_Activity={el.active}
                    Product_Type={el.product_type} Product_Code={el.product_code} Product_Category={el.category} Product_Vendor={el.vendor}
                    Product_Image={el.product_images.map((el, i) => el.src)}
                    /> ))  
                });
            })
            .fail( function(xhr) { alert(xhr.responseText); });
            Pagintation(index);
            setTimeout(() => { DetailedView();}, 400);
        });
        prevPage.addEventListener("click", () =>
        {
            index = index - 1;
            /* Fetches the data from page, based on the page / index value */
            const page = "http://api.integrator.com/api/products?page=" + index;

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
                    root.render(_data.map((el, i) => <Pan_details key={`${el.title}_${i}`} Product_Title={el.title} Product_ID={el.id} Product_Activity={el.active}
                    Product_Type={el.product_type} Product_Code={el.product_code} Product_Category={el.category} Product_Vendor={el.vendor}
                    Product_Image={el.product_images.map((el, i) => el.src)}
                    /> )) 
                });
            })
            .fail( function(xhr) { alert(xhr.responseText); });
            Pagintation(index);
            setTimeout(() => { DetailedView();}, 400);
        });
    }
}
