import React, { useEffect, useState } from "react";
import axios from "axios";
import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api";

const mapContainerStyle = {
  width: "100%",
  height: "400px",
};

const defaultCenter = {
  lat: 52.4862,
  lng: -1.8904,
};

function App() {
  const [cars, setCars] = useState([]);
  const [search, setSearch] = useState("");
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(100000);

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: "INSERT_YOUR_KEY" // API key
  });

  const fetchCars = () => {
    axios
      .get(`http://localhost:5000/cars?search=${search}&minPrice=${minPrice}&maxPrice=${maxPrice}`)
      .then((res) => setCars(res.data))
      .catch((err) => console.error(err));
  };

  useEffect(() => {
    fetchCars();
  }, [search, minPrice, maxPrice]);

  return (
    <div style={{ fontFamily: "Arial, sans-serif", backgroundColor: "#f4f4f4" }}>
      <header style={{ backgroundColor: "#1f1f1f", padding: "20px" }}>
        <h1 style={{ margin: 0, color: "#38b6ff", fontSize: "32px" }}>Hyre</h1>
      </header>

      <div style={{ padding: "30px", display: "flex", gap: "20px", flexWrap: "wrap" }}>
        <input
          type="text"
          placeholder="Search car make/model"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ padding: "12px", fontSize: "16px", borderRadius: "8px", border: "1px solid #ccc", flex: 1 }}
        />
        <input
          type="number"
          placeholder="Min Price"
          value={minPrice}
          onChange={(e) => setMinPrice(e.target.value)}
          style={{ padding: "12px", fontSize: "16px", borderRadius: "8px", border: "1px solid #ccc", width: "150px" }}
        />
        <input
          type="number"
          placeholder="Max Price"
          value={maxPrice}
          onChange={(e) => setMaxPrice(e.target.value)}
          style={{ padding: "12px", fontSize: "16px", borderRadius: "8px", border: "1px solid #ccc", width: "150px" }}
        />
      </div>

      <main style={{ display: "flex", gap: "30px", padding: "0 30px 50px" }}>
        <div style={{ flex: 1 }}>
          <h2 style={{ color: "#38b6ff" }}>Featured Cars</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: "30px" }}>
            {cars.length === 0 ? (
              <p>No cars found.</p>
            ) : (
              cars.map((car, idx) => (
                <div
                  key={idx}
                  style={{
                    backgroundColor: "#fff",
                    borderRadius: "16px",
                    overflow: "hidden",
                    boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <img
                    src={car.image || `https://source.unsplash.com/800x400/?${car.title}`}
                    alt={car.title}
                    style={{ width: "100%", height: "auto", objectFit: "cover" }}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = `https://source.unsplash.com/800x400/?car`;
                    }}
                  />

                  <div style={{ padding: "20px" }}>
                    <h3 style={{ fontSize: "22px", margin: "0 0 10px" }}>{car.title}</h3>
                    <p style={{ color: "#555", margin: "0 0 5px" }}>{car.location}</p>
                    <p style={{ fontWeight: "bold", fontSize: "18px", margin: "0 0 5px" }}>
                      £{car.price}.00/day
                    </p>
                    <p style={{ fontSize: "14px", color: "#777", margin: 0 }}>
                      📅 Added on {car.dateAdded} at {car.timeAdded}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {isLoaded && (
          <div style={{ flex: 1 }}>
            <h2 style={{ color: "#38b6ff" }}>Map</h2>
            <GoogleMap
              mapContainerStyle={mapContainerStyle}
              center={cars[0] ? { lat: cars[0].latitude, lng: cars[0].longitude } : defaultCenter}
              zoom={12}
            >
              {cars.map((car, idx) => (
                <Marker
                  key={idx}
                  position={{ lat: car.latitude, lng: car.longitude }}
                  title={car.title}
                />
              ))}
            </GoogleMap>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;



