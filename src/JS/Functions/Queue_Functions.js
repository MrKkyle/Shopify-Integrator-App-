import { createRoot } from 'react-dom/client';
import { flushSync } from 'react-dom';
import $ from 'jquery';
import Queue_details from '../../components/semi-components/queue-details';
import Detailed_queue from '../../components/semi-components/Queue/detailed_queue';


export function DetailedView() 
{
    let queue = document.querySelector(".queue");
    let pan = document.querySelectorAll(".pan");
    let message = document.getElementById("message");
    for(let i = 0; i < pan.length; i++)
    {
        pan[i].addEventListener("click", () =>
        {
            let id = pan[i].querySelector(".p-d-id").innerHTML;
            /*  API  */
            const api_key = localStorage.getItem('api_key');
            $.ajaxSetup({ headers: { 'Authorization': 'ApiKey ' + api_key} });
            $.get("http://api.integrator.com/api/queue/" + id, [], [], 'json')
            .done(function(_data) 
            {   
                if(document.querySelector(".details") != null)
                //div already exists, remove it, and create another
                {

                    document.querySelector(".details").remove();
                    let details = document.createElement('div');
                    details.className = "details";
                    queue.appendChild(details);

                    let rot = createRoot(details);
                    rot.render( <Detailed_queue key={`${_data.title}_${i}`} Queue_Status={_data.status} Queue_Description={_data.description}
                    Queue_Type={_data.queue_type} Queue_Instruction={_data.instruction} Queue_ID={_data.id} Created_At={_data.created_at} 
                    Updated_At={_data.updated_at}
                    />)
                }
                else 
                //create new div
                {
                    let details = document.createElement('details');
                    queue.appendChild(details);
                    let rot = createRoot(details);
                    rot.render( <Detailed_queue key={`${_data.title}_${i}`} Queue_Status={_data.status} Queue_Description={_data.description}
                    Queue_Type={_data.queue_type} Queue_Instruction={_data.instruction} Queue_ID={_data.id} Created_At={_data.created_at} 
                    Updated_At={_data.updated_at}
                    />)
                }
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
    $.get('http://api.integrator.com/api/queue?page=' + ahead, [], [])
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
            const page = "http://api.integrator.com/api/queue?page=" + index;
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
                    root.render(_data.map((el, i) => <Queue_details key={`${el.title}_${i}`} Queue_Updated_At={el.updated_at} Queue_Creation_Date={el.created_at} 
                    Queue_Type={el.queue_type} Queue_Instruction={el.instruction} Queue_Status={el.status} Queue_ID={el.id}
                    /> )) 
                });
            })
            .fail( function(xhr) { alert(xhr.responseText); });

            let ahead = index + 1;
            /*  API  */
            $.get('http://api.integrator.com/api/queue?page=' + ahead, [], [])
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
            const page = "http://api.integrator.com/api/queue?page=" + index;

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
                    root.render(_data.map((el, i) => <Queue_details key={`${el.title}_${i}`} Queue_Updated_At={el.updated_at} Queue_Creation_Date={el.created_at} 
                    Queue_Type={el.queue_type} Queue_Instruction={el.instruction} Queue_Status={el.status} Queue_ID={el.id}
                    /> )) 
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
            const page = "http://api.integrator.com/api/queue?page=" + index;
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
                    root.render(_data.map((el, i) => <Queue_details key={`${el.title}_${i}`} Queue_Updated_At={el.updated_at} Queue_Creation_Date={el.created_at} 
                    Queue_Type={el.queue_type} Queue_Instruction={el.instruction} Queue_Status={el.status} Queue_ID={el.id}
                    /> ))  
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
            const page = "http://api.integrator.com/api/queue?page=" + index;

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
                    root.render(_data.map((el, i) => <Queue_details key={`${el.title}_${i}`} Queue_Updated_At={el.updated_at} Queue_Creation_Date={el.created_at} 
                    Queue_Type={el.queue_type} Queue_Instruction={el.instruction} Queue_Status={el.status} Queue_ID={el.id}
                    />)) 
                });
            })
            .fail( function(xhr) { alert(xhr.responseText); });
            Pagintation(index);
            setTimeout(() => { DetailedView();}, 300);
        });
    }
}

export function Filter_Pagintation(index)
{
    let filter_img = document.querySelectorAll(".filter-img")
    if(index == 1)
    {
        let next = document.getElementById("next");
        let ahead = index + 1;
        for(let i = 0; i < filter_img.length; i++)
        {
            if(filter_img[i].style.display == "block")
            {
                let type = filter_img[i].nextSibling.className;
                const api_key = localStorage.getItem('api_key');
                $.ajaxSetup({ headers: { 'Authorization': 'ApiKey ' + api_key} });
                $.get("http://api.integrator.com/api/queue/filter?type=" + type + "?page="+ ahead, [], [], 'json')
                .done(function( _data) 
                {
                    if(_data.length < 10)
                    {
                        next.disabled = true;
                        next.style.cursor = "not-allowed";
                    }
                    if(_data == "") { let next = document.getElementById("next"); next.style.cursor = "not-allowed"; next.disabled = true; } 
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
                                root.render(_data.map((el, i) => <Queue_details key={`${el.title}_${i}`} 
                                />))
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
                                root.render(_data.map((el, i) => <Queue_details key={`${el.title}_${i}`} 
                                Queue_Type={el.queue_type} Queue_Instruction={el.instruction} Queue_Status={el.status} Queue_ID={el.id}
                                />))
                            });
                            setTimeout(() => { DetailedView();}, 200);
                        }
                    }
                })
                .fail( function(xhr) { alert(xhr.responseText); });
            }
        }
        
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
                    root.render(_data.map((el, i) => <Queue_details key={`${el.title}_${i}`}
                    Queue_Type={el.queue_type} Queue_Instruction={el.instruction} Queue_Status={el.status} Queue_ID={el.id}
                    />))
                });
                
            })
            .fail( function(xhr) { alert(xhr.responseText); });

            let ahead = index + 1;
            /*  API  */
            $.get("http://api.integrator.com/api/products/filter?type=" + type + "&vendor=" + vendor + "&category=" + category + "&page=" + ahead, [], [])
            .done(function( _data) 
            {
                if(_data == "") { let next = document.getElementById("next"); next.style.cursor = "not-allowed"; next.disabled = true; }  
            })
            .fail( function(xhr) { alert(xhr.responseText); });

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
                    root.render(_data.map((el, i) => <Queue_details key={`${el.title}_${i}`}
                    Queue_Type={el.queue_type} Queue_Instruction={el.instruction} Queue_Status={el.status} Queue_ID={el.id}
                    />))
                });

            
            })
            .fail( function(xhr) { alert(xhr.responseText); });
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
                    root.render(_data.map((el, i) => <Queue_details key={`${el.title}_${i}`} Queue_Updated_At={el.updated_at} Queue_Creation_Date={el.created_at} 
                    Queue_Type={el.queue_type} Queue_Instruction={el.instruction} Queue_Status={el.status} Queue_ID={el.id}
                    />)) 
                });

            })
            .fail( function(xhr) { alert(xhr.responseText); });
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
                    root.render(_data.map((el, i) => <Queue_details key={`${el.title}_${i}`}
                    Queue_Type={el.queue_type} Queue_Instruction={el.instruction} Queue_Status={el.status} Queue_ID={el.id}
                    />))
                });
                
            })
            .fail( function(xhr) { alert(xhr.responseText); });
            Filter_Pagintation(index);
            setTimeout(() => { DetailedView();}, 200);
        });
    }
}