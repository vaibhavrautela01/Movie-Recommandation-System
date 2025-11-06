import { useState } from "react";
import axios from "axios";
import "./Createmovie.css";
import { forceUpdateHistory } from "../History/Componenthistory";

function Createmovie() {
  const [preference, setPreference] = useState("");

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!preference) return alert("Please enter your movie preference");

    setLoading(true);
    const API = "https://movie-recommandation-system-2n59.onrender.com";

    try {
      await axios.post(
        `${API}/recommend`,
        { preference },
        { headers: { "Content-Type": "application/json" } }
      );

      forceUpdateHistory();
      setPreference("");
    } catch (err) {
      console.error(err);
      alert("Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="main-container">
      <h1 className="title">Movie Recommendation</h1>

      <form className="form" onSubmit={handleSubmit}>
        <input
          className="input-box"
          type="text"
          value={preference}
          onChange={(e) => setPreference(e.target.value)}
          placeholder="e.g., action movies with strong female lead"
        />
        <button className="submit-btn" type="submit">
          {loading ? "wait..." : "Submit"}
        </button>
      </form>
    </div>
  );
}

export default Createmovie;
