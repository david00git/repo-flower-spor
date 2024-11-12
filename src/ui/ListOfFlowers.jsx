import { useEffect, useState } from "react";
import SearchBar from "./SearchBar";
import { toast } from "react-toastify";

const API_BASE_URL = "https://flowrspot-api.herokuapp.com/api/v1/flowers";

function FlowerList() {
  const [randomFlowers, setRandomFlowers] = useState([]);
  const [displayedFlowers, setDisplayedFlowers] = useState([]);

  useEffect(() => {
    const fetchRandomFlowers = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/random`);
        if (!response.ok) {
          throw new Error("Error fetching random flowers");
        }
        const data = await response.json();
        setRandomFlowers(data.flowers);
        setDisplayedFlowers(data.flowers);
      } catch (error) {
        console.error("Error fetching random flowers:", error);
        toast.error("Error fetching random flowers");
      }
    };

    fetchRandomFlowers();
  }, []);

  const handleSearchResults = (results) => {
    setDisplayedFlowers(results.length > 0 ? results : randomFlowers);
  };

  return (
    <div>
      <SearchBar onSearchResults={handleSearchResults} />
      <h2>Flower List</h2>
      <ul>
        {displayedFlowers.map((flower) => (
          <li key={flower.id}>{flower.name}</li>
        ))}
      </ul>
    </div>
  );
}

export default FlowerList;
