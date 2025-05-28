import React, { useState, useEffect, useMemo } from "react";
import { ReactSVG } from "react-svg";
import refreshIcon from "../../../../assets/newImages/refresh-2.svg";
import { useForm } from "react-hook-form";
import Select from 'react-select';
import countryList from 'react-select-country-list';
import { apiPost, apiPut } from "../../../../CustomHooks/useAuth";

const LanguageRegion = () => {

    const [cities, setCities] = useState([]);
    const [country, setCountry] = useState(null);  // Initially set to null
    const [isLoading, setIsLoading] = useState(false);
    const { register, handleSubmit, formState: { errors }, reset, setValue, watch } = useForm();
    const [user, setUser] = useState({});
    // const [region, setRegion] = useState([])


    const { REACT_APP_API_URL } = process.env

    useEffect(() => {
        // Get user info from local storage
        const storedUser = localStorage.getItem("userInfo");
        if (storedUser) {
            setUser(JSON.parse(storedUser)); // Parse the JSON string
        }
    }, []);


    return (
        <div className="language-region-settings">
            <form >
                <h5>Registered Email Address</h5>

                <hr className="ctm-hr" />

                <div className="row">


                    <div className="col-md-12">
                        <input
                            type="email"
                            className="form-control"
                            placeholder="Enter Your Email"
                            {...register("email")}
                            defaultValue={user.email}
                            disabled
                        />
                    </div>
                </div>
                <div className="submit-btns">
                    <button  className="custom_submit_btn" disabled>
                        <ReactSVG src={refreshIcon} /> Save Changes
                    </button>
                </div>
            </form>
        </div>
    );
};

export default LanguageRegion;
