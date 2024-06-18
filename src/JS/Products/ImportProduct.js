import {useEffect, useState} from 'react';
import { createRoot } from 'react-dom/client';
import $ from 'jquery';
import '../../CSS/login.css';
import Output_Table from './Import-components/output-table';


function Import_Product()
{
    const [file, setFile] = useState();

    const fileReader = new FileReader();

    const handleOnChange = (e) => 
    {
        setFile(e.target.files[0]);
    };
    const handleOnSubmit = (e) => 
    {
        e.preventDefault();
        if (file) 
        {
            fileReader.onload = function (event) 
            {
                const csvOutput = event.target.result;
            };
            fileReader.readAsText(file);
            console.log(file);
            const formData = new FormData();
            formData.append('file', file);
            const api_key = localStorage.getItem('api_key');
            console.log(formData);
            
            let output_div = document.querySelector('.output');
            $.ajaxSetup({ headers: { 'Authorization': 'ApiKey ' + api_key}, processData: false, contentType: "multipart/form-data", method: 'post', crossDomain: true, contentType: false});
            $.post("http://api.integrator.com/api/products/import", formData, [])
            .done(function( _data) 
            {
                console.log(_data);
                output_div.style.display = "block";
                if(document.querySelector(".output-table") != null)
                //div already exists, remove it, and create another
                {
                    document.querySelector(".output-table").remove();
                    let output = document.querySelector(".output");
                    let div = document.createElement("div");
                    output.appendChild(div);
                    let root = createRoot(div);
                    root.render( <Output_Table key={`${_data.title}_${_data.length}`} failed={_data.fail_counter} processed={_data.processed_counter}
                    products_added={_data.products_added} products_updated={_data.products_updated} variants_added={_data.variants_added} 
                    variants_updated={_data.variants_updated}
                    />)
                }
                else 
                {
                    let output = document.querySelector(".output");
                    let div = document.createElement("div");
                    output.appendChild(div);
                    let root = createRoot(div);
                    root.render( <Output_Table key={`${_data.title}_${_data.length}`} failed={_data.fail_counter} processed={_data.processed_counter}
                    products_added={_data.products_added} products_updated={_data.products_updated} variants_added={_data.variants_added} 
                    variants_updated={_data.variants_updated}
                    />)
                }
            })
            .fail( function(xhr) 
            {
                console.log(xhr.responseText);
                console.log("failed");
            });
        }
    };

    useEffect(() =>
    {
        /* Fix any incorrect elements */
        let navigation = document.getElementById("navbar"); let modal = document.getElementById("model");
        let modal_content = document.querySelector(".modal-content");
        navigation.style.zIndex = "3"; modal_content.style.display = "block";
        modal.style.display = "block";
        navigation.style.animation = "MoveRight 1.2s ease"; navigation.style.position = "fixed";
        navigation.style.left = "0%"; navigation.style.width = "100%"; navigation.style.display = "block";

    }, []);

    return (
        <>
            <div className = 'modal1' id = "model" style={{zIndex: '2', background:'linear-gradient(to bottom, #202020c7, #111119f0)'}}>

                <form className = 'modal-content' style ={{backgroundColor: 'none'}} method = 'post' autoComplete='off' id = 'form1'>

                    <div style = {{position: 'relative', top: '25%'}}>

                        <label style = {{fontSize: '18px',color: 'white', textDecoration:'underline'}}>
                            <b>Import Product</b> 
                            <i className = "info_icon" 
                            title='Ensure that your imported CSV file has the relative columns and information, to avoid any errors'></i>
                        </label>
                        <br /><br /><br />
                        <label style = {{color: 'white'}}><b>Imports customized products to the application</b></label>
                        <br /><br /><br />

                        <input style = {{color: 'white'}} type="file" id = "file-upload-button" name = "file" accept={".csv"} onChange={handleOnChange}/>
                        <br /><br />
                        <button className = "button" onClick={(e) => { handleOnSubmit(e); }}>IMPORT CSV</button>
                    </div>

                    <div className = "output">
                        <table className = "output-table"></table>
                    </div>
                      
                </form>
                
            </div>  
        </>
    );
};

export default Import_Product;

/*

*/