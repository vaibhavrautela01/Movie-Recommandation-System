/* eslint-disable react-refresh/only-export-components */
import React, { useState, useEffect } from "react";

import "./Componenthistory.css";

import axios from "axios";

export let forceUpdateHistory = () => {};

function Componenthistory() {
 
 
    const [history, setHistory] = useState([]);

 
    const fetchHistory = async () => {
    try 
    {
      const res = await axios.get("http://127.0.0.1:5000/history");
      setHistory(res.data);
    } 
    catch (err) 
    {
      console.error("Error fetching history:", err);
    }
  
};

  useEffect(() => {

    fetchHistory();

    forceUpdateHistory = fetchHistory;

}, []);

  return (
    <div className="history-container">
      <h2 className="history-title">Search History (From Database)</h2>

      {history.length > 0 ? (

<ul className="history-list">

          {history.map((item, index) => (

<li key={index} className="history-item">
              
              <b>Preference:</b> {item.user_input} <br />
              
              <b>Movies:</b>
            
              <ul className="movies-list"> {item.recommended_movies.map((m, i) => (<li key={i}>{i + 1}. {m}</li>))}</ul>
            
              <small className="timestamp">{new Date(item.timestamp).toLocaleString()}</small>
            
            </li>

          ))}
          
        </ul>
      ) 
      : 
      (
        <p className="no-history">No Data.</p>
      )
      }
    </div>
  );
}

export default Componenthistory;
