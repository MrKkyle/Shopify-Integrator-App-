import {useEffect, useState} from 'react';
import { flushSync } from 'react-dom';
import { createRoot } from 'react-dom/client';
import Chart from "chart.js/auto";
import Queue_details from './semi-components/queue-details';
import $ from 'jquery';

import '../CSS/page1.css';

import { Filter_Pagintation } from '../JS/Functions/Queue_Functions';
import { DetailedView } from '../JS/Functions/Queue_Functions';

function Page2(props)
{
    useEffect(()=> 
    {
        /* Ensure the model is shown */
        let navbar = document.getElementById("navbar");
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
        let queue_items = document.querySelectorAll(".queue-items");
        let queue_img = document.querySelectorAll(".queue-img");

        filter_button.disabled = true;
        C_filter.disabled = true;

        for(let i = 0 ; i < queue_items.length; i++)
        {
            queue_items[i].style.cursor = "not-allowed";
            //queue_items[i].style.pointerEvents = "none";
        }

        for(let i = 0; i < filter.length; i++)
        {
            /* Filter Onclick */
            filter[i].addEventListener("click", () =>
            {
                for(let i = 0 ; i < queue_items.length; i++)
                {
                    queue_items[i].style.cursor = "pointer";
                    queue_items[i].style.pointerEvents = "";
                    queue_items[i].addEventListener("click", () => 
                    {
                        queue_img[i].style.display = "block";
                        queue_items[i].style.backgroundColor = "rgba(64, 165, 24, 0.7)";

                        filter_button.disabled = false;
                        filter_button.style.cursor = "pointer";

                        for(let i = 0; i < queue_items.length; i++) { queue_items[i].style.pointerEvents = "none"; } 
                    });

                    C_filter.disabled = false;
                    C_filter.style.cursor = "pointer";
                }

                filter_img[i].style.display = "block";
                filter[i].style.backgroundColor = "rgba(64, 165, 24, 0.7)";
                for(let i = 0; i < filter.length; i++) { filter[i].style.pointerEvents = "none"; } 
            });
        }

        /* Clear Filter */
        C_filter.addEventListener("click", () =>
        {
            filter_button.disabled = true;
            C_filter.disabled = true;
            filter_button.style.cursor = "not-allowed";
            C_filter.style.cursor = "not-allowed";

            for(let i = 0; i < filter.length; i++)
            {
                filter_img[i].style.display = "none";
                filter[i].style.backgroundColor = "rgba(61, 61, 61, 0.7)";

                filter[i].style.pointerEvents = "";
                filter[i].style.cursor = "pointer";
            }
            for(let i = 0 ; i < queue_items.length; i++)
            {
                
                queue_items[i].style.cursor = "not-allowed";
                queue_items[i].style.pointerEvents = "none";
                queue_img[i].style.display = "none";
                queue_items[i].style.backgroundColor = "rgba(61, 61, 61, 0.7)";
                
            }
        });

        filter_button.addEventListener("click", () =>
        {
            let next = document.getElementById("next");
            let fi;
            let qi;
            for(let i = 0; i < filter_img.length; i++)
            {
                if(filter_img[i].style.display == "block") { fi = i; }
            }    

            for(let i = 0; i < queue_img.length; i++)
            {
                if(queue_img[i].style.display == "block") { qi = i; }
            } 

            let type = filter_img[fi].nextSibling.className;
            let status = queue_img[qi].nextSibling.className;
            const api_key = localStorage.getItem('api_key');
            $.ajaxSetup({ headers: { 'Authorization': 'ApiKey ' + api_key} });
            $.get("http://api.integrator.com/api/queue/filter?type=" + type + "&status=" + status, [], [], 'json')
            .done(function( _data) 
            {
                console.log(_data);
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
                            root.render(_data.map((el, i) => <Queue_details key={`${el.title}_${i}`}
                            Queue_Type={el.queue_type} Queue_Instruction={el.instruction} Queue_Status={el.status} Queue_ID={el.id}
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
            Filter_Pagintation(1);
        });  

        /* Queue Information Requests */
        let graph_data = {};
        const api_key = localStorage.getItem('api_key');
        $.ajaxSetup({ headers: { 'Authorization': 'ApiKey ' + api_key} });
        $.get("http://api.integrator.com/api/queue/view", [], [], 'json')
        .done(function(_data) 
        {
            console.log(_data);
            graph_data = _data;
        })
        .fail( function(xhr) 
        {
            alert(xhr.responseText);
        });

        
        let ctx = document.getElementById("queue-graph");
        setTimeout(() =>
        {
            
            // FETCH GRAPH
            new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: Object.keys(graph_data),
                    datasets: [{
                        label: 'Queue View',
                        data: Object.values(graph_data),
                        borderWidth: 1,
                        borderColor: "rgb(70 201 159)",
                        backgroundColor: "rgb(70 201 159)",
                        pointRadius: "5",
                    }]
                },
                options: {
                    scales: {
                        y: 
                        {
                            beginAtZero: true
                        }
                    }
                }
            });
        }, 200);

        
        let graph = document.querySelector(".graph");
        setTimeout(() => { graph.style.display = "block"; }, 1200);

        /* Script for the queue-view graph */
        let queue_graph_div = document.querySelector(".queue-view");
        let close_queue = document.getElementById("queue-close");
        let view_graph = document.getElementById("queue_view");
        let main_elements = document.querySelector(".main-elements").children;
        let pagination = document.querySelector(".pagination");
        let _filter = document.querySelector(".filter").children;
        
        view_graph.addEventListener("click", () => 
        {
            navbar.style.left = "0%"; navbar.style.width = "100%";
            search.style.display = "none"; pagination.style.display = "none";
            queue_graph_div.style.display = "block";
            for(let i = 0; i < _filter.length; i++) { _filter[i].style.display = "none"; }
            for(let i = 0; i < main_elements.length; i++) { main_elements[i].style.display = "none"; }
            setTimeout(() => { queue_graph_div.style.animation = "FadeIn 1s ease-in"; }, 1000);

            close_queue.addEventListener("click", () => 
            {
                queue_graph_div.style.animation = "Fadeout 1s ease-out"; navbar.style.left = "30%"; navbar.style.width = "70%";
                for(let i = 0; i < _filter.length; i++) { _filter[i].style.display = "block"; }
                for(let i = 0; i < main_elements.length; i++) { main_elements[i].style.display = "block"; }
                setTimeout(() => {queue_graph_div.style.display = "none"; search.style.display = "none"; pagination.style.display = "block"; }, 1000);
            });
        });
        
    
    }, []);

    return (
        <>
            <div className = "filter" style = {{display: props.filter_display}}>
                <div className = "filter-title"><b>Available Filters:</b></div>
                <div className = "filter-elements" disabled>
                    <div className = "filter-elements-text">Filter By Order</div>
                    <div className = "filter-img"/>
                    <div className = "order"></div>
                </div>
                <div className = "filter-elements" disabled>
                    <div className = "filter-elements-text">Filter By Product</div>
                    <div className = "filter-img"/>
                    <div className = "product"></div>
                </div>
                <div className = "filter-elements" disabled>
                    <div className = "filter-elements-text">Filter By Customer</div>
                    <div className = "filter-img"/>
                    <div className = "customer"></div>
                </div>
                
                <div className = "filter-title"><b>Queue Items</b></div>
                <div className = "queue-items" disabled>
                    <div className = "filter-elements-text">In-Queue</div>
                    <div className = "queue-img"/>
                    <div className = "in-queue"></div>
                </div>
                <div className = "queue-items" disabled>
                    <div className = "filter-elements-text">Failed</div>
                    <div className = "queue-img"/>
                    <div className = "failed"></div>
                </div>
                <div className = "queue-items" disabled>
                    <div className = "filter-elements-text">Processing</div>
                    <div className = "queue-img"/>
                    <div className = "processing"></div>
                </div>
                <div className = "queue-items" disabled>
                    <div className = "filter-elements-text">Completed</div>
                    <div className = "queue-img"/>
                    <div className = "completed"></div>
                </div>
                <br />
                <div id = "button-hold">
                    <button id = "clear_filter"className = "filter-button">Clear Filter</button>
                    <button id = "_filter"className = "filter-button">Filter Results</button>
                </div>
                <br />
                <button id = "queue_view" className = "graph-view">View Graph</button>
            </div>
            <div className = "queue-view">
                <div className = 'close-button' id = "queue-close" style = {{top: '50px'}}>&times;</div>
                <div className="graph g1" style = {{width: '70%', left:'24%', top:'30%', animation: 'none'}}>
                    <canvas id="queue-graph"></canvas>
                </div>
            </div>
        </>
    );
}
Page2.defaultProps = 
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

export default Page2;