import { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { MdAddAPhoto } from "react-icons/md";
import { getAuthToken } from "../utils/auth";
import { createSighting } from "../services/Sightings";
import { useForm } from "react-hook-form";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import marker from "../../public/marker.png";

// Styled Components
const SightingLayout = styled.div`
  display: block;
  position: relative; // Changed from absolute to relative for better layout adjustment
  text-align: center;
  margin-top: 4rem;
  width: 100%;
  padding: 1rem;

  @media (max-width: 768px) {
    margin-top: 2rem;
    padding: 0.5rem;
  }
`;

const H1 = styled.h1`
  color: rgba(148, 158, 160, 1);
  font-size: 4rem;
  font-weight: 300;
  margin-bottom: 1.6rem;

  @media (max-width: 768px) {
    font-size: 2.5rem;
  }
`;

const MapContainer = styled.div`
  z-index: 1;
  height: 40rem;
  width: 100%;
  margin-top: -4rem;
  cursor: pointer;

  @media (max-width: 768px) {
    height: 30rem;
    margin-top: 0;
  }
`;

const Content = styled.div`
  z-index: 2;
  position: relative;
  top: -5rem;
  box-shadow: 0px 15px 30px 0px rgba(0, 0, 0, 0.05);
  margin: 0 2rem 10rem 2rem;
  padding: 2rem;

  @media (max-width: 768px) {
    margin: 1rem;
    padding: 1rem;
    top: 0;
  }
`;

const Row = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 4rem;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 2rem;
  }
`;

const InputWrapper = styled.div`
  position: relative;
  width: 100%;

  @media (max-width: 768px) {
    width: 95%;
  }

  @media (max-width: 400px) {
    width: 90%;
  }
`;

const Input = styled.input`
  height: 3rem;
  border: 1px solid rgba(245, 246, 247, 1);
  border-radius: 3px;
  background-color: rgba(245, 246, 247, 1);
  width: 100%;
  padding: 2.4rem 1.5rem 1rem;
  font-size: 1.6rem;
  position: relative;
  transition: border-color 0.2s;
  font-family: "Ubuntu";

  &:focus {
    outline: none;
    border-color: rgba(223, 145, 134, 1);
  }

  &:focus + label,
  &:not(:placeholder-shown) + label {
    top: 0.6rem;
    font-size: 1.2rem;
    color: rgba(223, 145, 134, 1);
  }
`;

const FloatingLabel = styled.label`
  position: absolute;
  top: 2.4rem;
  left: 1.5rem;
  font-size: 1.6rem;
  color: rgba(150, 150, 150, 1);
  transition: 0.2s ease all;
  pointer-events: none;
`;

const BtnAddPhoto = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 3px;
  border: 1px solid rgba(223, 145, 134, 0.2);
  box-shadow: 0px 15px 30px 0px rgba(223, 145, 134, 0.2);
  width: 35rem;
  color: rgba(223, 145, 134, 1);
  gap: 1rem;
  transition: background-color 0.3s ease, transform 0.2s ease,
    box-shadow 0.3s ease;

  @media (max-width: 768px) {
    width: 15rem;
    height: 6.6rem;
  }
  @media (max-width: 400px) {
    width: 100%;
  }

  &:hover {
    background-color: rgba(223, 145, 134, 0.1);
    box-shadow: 0px 20px 40px 0px rgba(223, 145, 134, 0.4);
    transform: translateY(-2px);
  }
`;

const TextareaWrapper = styled.div`
  position: relative;
  width: 100%;
  margin-top: 2rem;
`;

const InputDescription = styled.textarea`
  width: calc(100% - 3rem);
  height: 10rem;
  background-color: rgba(245, 246, 247, 1);
  border: 1px solid rgba(223, 229, 234, 0.2);
  padding: 2.4rem 1.5rem 1rem;
  font-size: 1.6rem;
  resize: none;
  border-radius: 3px;
  position: relative;

  &:focus {
    outline: none;
    border-color: rgba(223, 145, 134, 1);
  }

  &:focus + label,
  &:not(:placeholder-shown) + label {
    top: 0.6rem;
    font-size: 1.2rem;
    color: rgba(223, 145, 134, 1);
  }
  font-family: "Ubuntu";
`;

const FloatingLabelForTextarea = styled.label`
  position: absolute;
  top: 2.4rem;
  left: 1.5rem;
  font-size: 1.6rem;
  color: rgba(150, 150, 150, 1);
  transition: 0.2s ease all;
  pointer-events: none;
`;

const BtnWrapper = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-top: 2.4rem;
  padding-bottom: 9.6rem;

  @media (max-width: 768px) {
    justify-content: center;
    padding-bottom: 4rem;
  }
`;

const BtnCrateNewSighting = styled.button`
  background: linear-gradient(270deg, #ecbcb3 0%, #eaa79e 100%);
  box-shadow: 0px 15px 20px 0px rgba(234, 168, 159, 0.2);
  color: white;
  padding: 1.8rem 3rem;
  border-radius: 3px;
  border: 0;
  transition: background 0.3s ease, transform 0.2s ease, box-shadow 0.3s ease;

  @media (max-width: 768px) {
    width: 100%;
    padding: 1.2rem 2rem;
  }

  &:hover {
    background: linear-gradient(270deg, #eaa79e 0%, #e68a7e 100%);
    box-shadow: 0px 20px 40px 0px rgba(234, 168, 159, 0.4);
    transform: translateY(-2px);
  }
`;

// const HiddenFileInput = styled.input`
//   display: none; /* Hide the file input */
// `;

function AddNewSighting({ setTotalSightings, totalSightings }) {
  const mapRef = useRef(null);
  const markerRef = useRef(null);
  const [coords, setCoords] = useState({ lat: "null", lng: "null" });
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");
  const [error, setError] = useState(null);
  const { handleSubmit, reset } = useForm();
  const { id } = useParams();

  const flowerIdNumber = Number(id);

  const navigate = useNavigate();
  // console.log(totalSightings);

  useEffect(() => {
    const getLocation = () => {
      navigator.geolocation.getCurrentPosition(
        function (position) {
          const { latitude, longitude } = position.coords;
          const initialCoords = [latitude, longitude];
          setCoords({ lat: latitude, lng: longitude });

          if (mapRef.current === null) {
            mapRef.current = L.map("map").setView(initialCoords, 15);

            L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
              attribution: "© OpenStreetMap contributors",
            }).addTo(mapRef.current);

            // Create a custom icon for the marker
            const customIcon = L.icon({
              iconUrl: marker, // Path to your image
              iconSize: [30, 40], // Size of the icon
              iconAnchor: [16, 32], // Point of the icon which will correspond to the marker's location
              popupAnchor: [0, -32], // Point from which the popup should open
            });

            // Create and add the marker with custom icon
            markerRef.current = L.marker(initialCoords, {
              icon: customIcon,
            }).addTo(mapRef.current);

            mapRef.current.on("click", function (mapEvent) {
              const { lat, lng } = mapEvent.latlng;
              if (markerRef.current) {
                mapRef.current.removeLayer(markerRef.current);
              }

              // Add the custom marker at the clicked location
              markerRef.current = L.marker([lat, lng], {
                icon: customIcon,
              }).addTo(mapRef.current);
              setCoords({ lat: lat.toFixed(4), lng: lng.toFixed(4) });
              mapRef.current.setView([lat, lng], 15);
              document.getElementById("titleInput").focus();
            });
          }
        },
        function (error) {
          console.error("Error getting location:", error);
        }
      );
    };

    getLocation();

    return () => {
      if (mapRef.current !== null) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  const handleTitleChange = (e) => {
    setTitle(e.target.value.charAt(0).toUpperCase() + e.target.value.slice(1));
  };

  const handleDescriptionChange = (e) => {
    setDescription(
      e.target.value.charAt(0).toUpperCase() + e.target.value.slice(1)
    );
  };

  const onSubmit = async () => {
    setError(null);
    setSuccessMessage("");
    setIsLoading(true);
    const token = getAuthToken();
    const formData = new FormData();

    formData.append("flower_id", flowerIdNumber);
    formData.append("name", title);
    formData.append("description", description);
    formData.append("latitude", coords.lat);
    formData.append("longitude", coords.lng);

    if (selectedFile) {
      formData.append("picture", selectedFile);
    }

    try {
      const response = await createSighting(formData, token);

      if (
        response.status === 200
        // response.status === 201 ||
        // response === 500
      ) {
        setSuccessMessage("Sighting created successfully!");
        reset();
        setImagePreview("");
        setSelectedFile(null);
        toast.success("Sighting created successfully!");
      } else {
        navigate(-1);
        setTotalSightings((prev) => prev + 1);
        console.log("Poslije uvecavanja ", totalSightings);
      }
    } catch (error) {
      console.error("Error creating sighting:", error);
      setError(error.response?.data?.message || "Error creating sighting");
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file);
    if (file) {
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleAddPhotoClick = () => {
    document.getElementById("fileInput").click();
  };

  return (
    <SightingLayout>
      <MapContainer id="map"></MapContainer>
      <Content>
        <H1>Add New Sighting</H1>
        {successMessage && <p style={{ color: "green" }}>{successMessage}</p>}
        {error && <p style={{ color: "red" }}>{error}</p>}
        <form onSubmit={handleSubmit(onSubmit)}>
          <Row>
            <InputWrapper>
              <Input
                id="titleInput"
                type="text"
                value={title}
                onChange={handleTitleChange}
                placeholder=" "
                name="name"
              />
              <FloatingLabel htmlFor="titleInput">
                Title of the sighting
              </FloatingLabel>
            </InputWrapper>

            <InputWrapper>
              <Input
                id="coordsInput"
                type="text"
                value={`${coords.lat}, ${coords.lng}`}
                readOnly
                placeholder=" "
              />
              <FloatingLabel htmlFor="coordsInput">
                Coordinates of the sighting
              </FloatingLabel>
            </InputWrapper>

            <BtnAddPhoto type="button" onClick={handleAddPhotoClick}>
              {!selectedFile && <MdAddAPhoto />}
              {selectedFile ? (
                <img
                  src={imagePreview}
                  alt="Preview"
                  style={{ width: "50px", height: "50px", borderRadius: "3px" }}
                />
              ) : (
                "Add a Photo"
              )}
            </BtnAddPhoto>
            <input
              type="file"
              id="fileInput"
              onChange={handleFileChange}
              style={{ display: "none" }}
              accept="image/*"
            />
          </Row>

          <TextareaWrapper>
            <InputDescription
              id="descriptionInput"
              value={description}
              onChange={handleDescriptionChange}
              placeholder=" "
              required
              name="description"
            />
            <FloatingLabelForTextarea htmlFor="descriptionInput">
              Write a description…
            </FloatingLabelForTextarea>
          </TextareaWrapper>

          <BtnWrapper>
            <BtnCrateNewSighting type="submit" disabled={isLoading}>
              {isLoading ? "Creating..." : "Create New Sighting"}
            </BtnCrateNewSighting>
          </BtnWrapper>
        </form>
      </Content>
    </SightingLayout>
  );
}

AddNewSighting.propTypes = {
  setTotalSightings: PropTypes.func.isRequired,
  totalSightings: PropTypes.number.isRequired,
};

export default AddNewSighting;
