import React, { useState, useEffect, useRef } from 'react';
import './CarUI.css';
import './DefaultStyles.css';  // Import the shared CSS
import "bootstrap-icons/font/bootstrap-icons.css";

function CarUI({ onSelectCar, selectedCarId, carInfoUpdated, onCreateVehicle }) {
    const [message, setMessage] = useState('');
    const [carList, setCarList] = useState([]);

    const searchRef = useRef(null);

    var bp = require('./Path.js');

    useEffect(() => {
        searchCars(searchRef.current.value);
    }, [carInfoUpdated]);

    const searchCars = async (searchTerm) => {
        const userId = JSON.parse(localStorage.getItem('user_data')).id;

        const obj = { userId, search: searchTerm };
        const js = JSON.stringify(obj);

        try {
            const response = await fetch(bp.buildPath('api/searchcars'), {
                method: 'POST',
                body: js,
                headers: { 'Content-Type': 'application/json' },
            });

            const res = await response.json();
            if (res.error.length > 0) {
                setMessage("API Error:" + res.error);
            } else {
                setCarList(res.results);
            }
        } catch (e) {
            setMessage(e.toString());
        }
    };

    const deleteCar = async (carId) => {
        if (!window.confirm('Are you sure you want to delete this car?')) {
            return;
        }

        const userId = JSON.parse(localStorage.getItem('user_data')).id;
        const obj = { userId, carId };
        const js = JSON.stringify(obj);

        try {
            const response = await fetch(bp.buildPath('api/deletecar'), {
                method: 'POST',
                body: js,
                headers: { 'Content-Type': 'application/json' },
            });

            const res = await response.json();
            if (res.error.length > 0) {
                setMessage("API Error:" + res.error);
            } else {
                setMessage('Car has been deleted');
                searchCars(searchRef.current.value); // Refresh the car list with the current search term
                onSelectCar(null); // Hide car info page
            }
        } catch (e) {
            setMessage(e.toString());
        }
    };

    const handleSearchChange = () => {
        const searchTerm = searchRef.current.value;
        searchCars(searchTerm); // Trigger search on input change
    };

    const handleSelectCar = (carId) => {
        const selectedCar = carList.find(car => car.carId === carId);
        const updatedCarList = [selectedCar, ...carList.filter(car => car.carId !== carId)];
        setCarList(updatedCarList);
        onSelectCar(carId);
    };

    return (
        <div className="car-ui-container">
            <div className="search-add-section">
                <div className="search-container">
                    <i className="bi bi-search"></i>
                    <input
                        type="text"
                        placeholder="Search Vehicles..."
                        ref={searchRef}
                        onChange={handleSearchChange} />
                </div>
                <button className="button-custom default-button" type="button" onClick={onCreateVehicle}>
                    <i class="bi bi-plus" />
                    ADD VEHICLE
                </button>
            </div>

            <br />

            <div className="car-lists">
                {carList.map((car) => (
                    <div key={car.carId} className="car-box" onClick={() => handleSelectCar(car.carId)}>
                        <h2>
                            {car.year} {car.make}
                        </h2>
                        <h3>
                            {car.color} {car.model}
                        </h3>
                        <br></br>
                        <div className="odo-container">
                            ODO: {car.odometer}
                        </div>
                        <div className="bottom-right-buttons">
                            <button aria-label="Delete Vehicle" className="icon-button" onClick={(e) => { e.stopPropagation(); deleteCar(car.carId); }}><i className="bi bi-trash"></i></button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default CarUI;
