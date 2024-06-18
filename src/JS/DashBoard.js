import {useEffect} from 'react';
import $ from 'jquery';
import Chart from "chart.js/auto";
import '../CSS/dashboard.css';
import image from '../media/icons8-shopify-50 (1).png';
Chart.defaults.color = 'rgb(205, 205, 205)';

function Dashboard()
{

    useEffect(()=> 
    {
        /* Ensures the navbar + model is set correctly */
        let navigation = document.getElementById("navbar");
        let logout = document.getElementById("logout");
        let header = document.querySelector('.header');
        let message = document.getElementById("message");

        let ctx = document.getElementById('shopify_fetch_graph');
        let order_ctx = document.getElementById('shopify_order_graph');
        let graph1 = document.querySelector('.g1');
        let graph2 = document.querySelector('.g2');
        let main = document.querySelector(".container");


        navigation.style.left = "0%"; navigation.style.position = "absolute";
        navigation.style.width = "100%"; navigation.style.display = "block";
        logout.style.display = "block"; 

        const userName = localStorage.getItem('username');
        document.querySelector(".welcome_text").innerHTML = "Welcome back, " + userName;

        /* logout */
        logout.addEventListener("click", () =>
        {
            let container = document.querySelector(".container");

            container.style.animation = "Fadeout 1s ease-out";
            navigation.style.animation = "Fadeout 1s ease-out";

            /* Session Destroy & Logout  */
            const api_key = localStorage.getItem('api_key'); 
            $.ajaxSetup({
                headers: { Authorization: "ApiKey " + api_key },
                xhrFields: { withCredentials: true },
                dataType: "jsonp",
            });           
            $.post("http://api.integrator.com/api/logout", [], [], 'json')
            .done(function( _data) 
            {
                console.log("logout");
            })
            .fail( function(xhr) 
            {
                message.innerHTML = "Failed to logout";
                message.style.background = "#9f0a0a";
                setTimeout(() => { message.innerHTML = ""; message.style.backgroundColor = "transparent"; message.style.display = "none"; }, 2000);
            });  

            localStorage.removeItem("username");
            localStorage.removeItem("api_key");

            /* Return to Login page */
            setTimeout(() => 
            {
                container.style.display = "none";
                navigation.style.display = "none";
                window.location.href = '/';
            }, 900);   
        });

        //Fetch Graph
        let status = document.querySelector(".enabled_status");

        let graph_data = {};
        const api_key = localStorage.getItem('api_key');
        $.ajaxSetup({ headers: { 'Authorization': 'ApiKey ' + api_key} });
        $.get("http://api.integrator.com/api/stats/fetch", [], [], 'json')
        .done(function( _data) 
        {
            if(_data.amounts.length == "" && _data.hours == "")
            {
                status.className = "disabled_status";
                status.title = "Fetch Disabled";
            }
            graph_data = _data;

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

        //Order Graph
        let graph_data2 = {};
        $.get("http://api.integrator.com/api/stats/orders?status=not_paid", [], [], 'json')
        .done(function(_data) 
        {
            if(_data == "")
            {
                status.className = "disabled_status";
            }
            graph_data2 = _data;
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

        let graph_data3 = {};
        $.get("http://api.integrator.com/api/stats/orders?status=paid", [], [], 'json')
        .done(function(_data) 
        {
            graph_data3 = _data;
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
            let order_label;
            if(graph_data2.days == null && graph_data3.days == null)
            {
                order_label = [""];
            }
            else 
            {
                order_label = (graph_data2.days).concat(graph_data3.days);
            }
            

            /* FETCH GRAPH */
            new Chart(ctx, {
                type: 'line',
                data: {
                    labels: graph_data.hours,
                    datasets: [{
                        label: '# of products fetched from Shopify',
                        data: graph_data.amounts,
                        borderWidth: 1,
                        borderColor: "rgba(255, 94, 0, 0.5)",
                        backgroundColor: "orange",
                        color: "red",
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
            
            /* ORDER GRAPH */
            new Chart(order_ctx, {
                type: 'bar',
                data: {
                    labels: order_label,
                    datasets: [{
                        label: 'Paid orders from Shopify (totals)',
                        data: graph_data3.count,
                        borderWidth: 1,
                        borderColor: "rgba(85, 0, 255, 0.5);",
                        backgroundColor: "purple",
                        pointRadius: "5",
                        tension: 0.1,
                        color: "white",
                        fill: false
                    },
                    {
                        label: 'Unpaid orders from Shopify (totals)',
                        data: graph_data2.count,
                        borderWidth: 1,
                        borderColor: "rgba(255,0,0,0.5);",
                        backgroundColor: "red",
                        pointRadius: "5",
                        tension: 0.1,
                        color: "white",
                        fill: false
                    }]
                },
                options: {
                    scales: {
                        y: {
                            beginAtZero: true
                        }
                    }
                }
            });
        }, 200);

        /* Settings Notifications */
        $.get("http://api.integrator.com/api/inventory/warehouse", [], [], 'json')
        .done(function(_data) 
        {
            if(_data == "")
            {
                let bubble = document.createElement("div");
                bubble.className = "bubble bub1";
                bubble.innerHTML = "Warehouse has not been set, proceed to 'Settings' to set";
                bubble.setAttribute("onclick", "window.location.href = '/settings'");
                main.appendChild(bubble);
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

        /* Products Notifications */
        $.get("http://api.integrator.com/api/products?page=1", [], [], 'json')
        .done(function(_data) 
        {
            if(_data == "")
            {
                let bubble = document.createElement("div");
                bubble.className = "bubble bub2";
                bubble.innerHTML = "Products have not been synced from Shopify, proceed to 'Settings'";
                bubble.setAttribute("onclick", "window.location.href = '/settings'");
                main.appendChild(bubble);
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
            let bubble = document.querySelectorAll(".bubble");
            for(let i = 0; i < bubble.length; i++){ bubble[i].style.display = "block"; }
        }, 3200);

        /* Sets the initial Look of the Page */
        setTimeout(() => 
        {
            graph1.style.animation = "appear 1s ease-in";
            graph1.style.display = "block"; graph2.style.animation = "appear 1s ease-in"; graph2.style.display = "block";
        }, 2200);

        setTimeout(() =>
        {
            header.style.animation = "appear 1s ease-in"; header.style.display = "block"; 
            header.style.position = "relative";
        }, 1500);

    }, []);

    return (
        
        <div className = "dashboard" id = "dashboard">
            <div className = "container">
                <div className="header">
                    <div className="fetch_status_text">
                        Fetch Status
                        <div className="enabled_status" title = "Fetch Enabled">
                            <img className="logo" alt = "" src= {image} />
                        </div>
                    </div>
                    <h2 className="welcome_text" />
                    <div className = "logout_button" id = "logout">Logout</div>
                </div>

                <div className="graph g1">
                    <canvas id="shopify_fetch_graph"></canvas>
                </div>

                <div className="graph g2">
                    <canvas id="shopify_order_graph"></canvas>
                </div>
            </div>
            <div className = 'info-message' id = 'message' />
        </div>
        
                
    );
}

export default Dashboard;

