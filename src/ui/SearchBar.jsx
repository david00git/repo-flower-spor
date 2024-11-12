import { useState, useEffect } from "react";
import styled from "styled-components";
import { FaSearch } from "react-icons/fa";
import { toast } from "react-toastify";
import PropTypes from "prop-types";

const breakpoints = {
  mobile: "414px",
  tablet: "768px",
  desktop: "1024px",
};

const SearchContainer = styled.div`
  position: relative;
  width: 45rem;
  margin-top: 4.5rem;
  color: rgba(148, 158, 160, 1);

  @media (max-width: ${breakpoints.desktop}) {
    width: 35rem;
  }

  @media (max-width: ${breakpoints.tablet}) {
    width: 25rem;
    margin-top: 3rem;
  }

  @media (max-width: 500px) {
    width: 20rem;
  }

  @media (max-width: ${breakpoints.mobile}) {
    width: 15rem;
  }
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 1.4rem 3rem 1.4rem 1.5rem;
  font-size: 1.4rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  outline: none;

  &:focus {
    border-color: #007bff;
  }

  &::placeholder {
    color: #a3a3a3;
    font-weight: 300;
  }

  @media (max-width: ${breakpoints.desktop}) {
    font-size: 1.3rem;
    padding: 1.2rem 2.5rem 1.2rem 1.3rem;
  }

  @media (max-width: ${breakpoints.tablet}) {
    font-size: 1.2rem;
    padding: 1rem 2rem 1rem 1.2rem;
  }
`;

const SearchIcon = styled(FaSearch)`
  position: absolute;
  right: -2rem;
  top: 50%;
  transform: translateY(-50%);
  color: rgba(223, 145, 134, 1);
  width: 1.5rem;
  height: 1.5rem;

  @media (max-width: ${breakpoints.desktop}) {
    width: 1.4rem;
    height: 1.4rem;
  }

  @media (max-width: ${breakpoints.tablet}) {
    width: 1.2rem;
    height: 1.2rem;
  }
`;
const API_BASE_URL =
  "https://flowrspot-api.herokuapp.com/api/v1/flowers/search";

function SearchBar({ onSearchResults }) {
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState(query);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(query);
    }, 300);
    return () => {
      clearTimeout(handler);
    };
  }, [query]);

  useEffect(() => {
    if (debouncedQuery.trim() === "") {
      onSearchResults([]);
      return;
    }

    const fetchSearchResults = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}?query=${debouncedQuery}`);
        if (!response.ok) {
          throw new Error("Error fetching search results");
        }
        const data = await response.json();
        onSearchResults(data.flowers);
      } catch (error) {
        console.error("Error fetching search results:", error);
        toast.error("Error fetching search results");
      }
    };

    fetchSearchResults();
  }, [debouncedQuery, onSearchResults]);

  const handleChange = (event) => {
    const value = event.target.value;

    const capitalizedValue = value.charAt(0).toUpperCase() + value.slice(1);
    setQuery(capitalizedValue);
  };

  return (
    <SearchContainer>
      <SearchInput
        type="text"
        value={query}
        placeholder="Search for flowers..."
        onChange={handleChange}
      />
      <SearchIcon />
    </SearchContainer>
  );
}

SearchBar.propTypes = {
  onSearchResults: PropTypes.func.isRequired,
};

export default SearchBar;
