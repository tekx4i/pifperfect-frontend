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
  const [states, setStates] = useState([])
  // const [region, setRegion] = useState([])

  const [selectedIndustry, setSelectedIndustry] = useState(null);

  const { REACT_APP_API_URL } = process.env

  const [regions, setRegions] = useState([
    "East Asia and Pacific",
    "Europe and Central Asia",
    "Latin America and Caribbean",
    "Middle East and North Africa",
    "North America",
    "South Asia",
    "Sub-Saharan Africa"
  ]);

  const options = useMemo(() => countryList().getData(), []);
  // Fetch country from localStorage and set it as the default value
  useEffect(() => {
    const storedCountry = JSON.parse(localStorage.getItem("userInfo"))?.country;

    if (storedCountry) {
      const countryOption = options.find(option => option.label === storedCountry);
      if (countryOption) {
        setCountry(countryOption);
      }
    }
  }, [options]);


  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    if (userInfo?.zipCode) {
      setValue("zipcode", userInfo.zipCode);  // Set the zipcode value from localStorage
    }
  }, [setValue]);


  useEffect(() => {
    const storedUser = localStorage.getItem("userInfo");

    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);
  
  // ----------
  // useEffect(() => {
  //   // Retrieve city from localStorage
  //   const storedCity = JSON.parse(localStorage.getItem("userInfo"))?.city;
  //   if (storedCity) {
  //     // Set the default value for the select field
  //     setValue("city", storedCity);
  //   }
  // }, [setValue]);

  // User Edit

  const editUser = async (data) => {
    try {
      const url = `${REACT_APP_API_URL}users/${user.id}`;
      const formData = new FormData();
      formData.append("language", data.language);
      formData.append("country", country.label);
      formData.append("state", data.state);
      formData.append("city", data.city);
      formData.append("zipCode", data.zipcode);
      formData.append("region", data.region)

      // if (images.length > 0) {
      //   formData.append("image", images[0].file);
      // }

      const response = await apiPut(url, formData, localStorage.getItem("token"));
      if (response.success) {

        const updatedUser = {
          ...user,
          firstName: data.first_name,
          lastName: data.last_name,
          email: data.email,
          phone: data.phone,
          address: data.address,
          country: country.label,
          city: data.city,
          zipCode: data.zipcode,
          state:data.state,
          region:data.region
          
          // image: images.length > 0 ? images[0].file : user.image,
        };
        
        setSelectedIndustry("data.state");


        localStorage.setItem("userInfo", JSON.stringify(updatedUser));
        setUser(updatedUser);
        reset();
      }
      setIsLoading(false);
    } catch (error) {
      console.error("Error editing product:", error);
    }
  };

  const changeHandler = (value) => {
    setCountry(value);
    setCities([]); // Reset cities when country changes
    setValue("city", ""); // Reset city field when country changes
  };


  // getCities
  const getCities = async () => {
    try {
      setIsLoading(true);
      const url = `https://countriesnow.space/api/v0.1/countries/cities`;
      const params = { country: country.label };
      const response = await apiPost(url, params);
      if (response) {
        setCities(response.data);
        setIsLoading(false);
      }


      // Pre-select the first city after cities are loaded

      setValue("city", "SELECT");
      if (response.data.length > 0) {
      }
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  };


  useEffect(() => {
    if (country) {
      getCities();
    }
  }, [country]);


  // getCities


  // getStates
  const getStates = async () => {
    try {
      setIsLoading(true);
      const url = `https://countriesnow.space/api/v0.1/countries/states`;
      const params = { country: country.label };
      const response = await apiPost(url, params);

      if (response) {
        setStates(response.data.states);
        setIsLoading(false);
        setSelectedIndustry("companyData.industry");

      }

      // Pre-select the first city after cities are loaded

      if (response.data.length > 0) {
        setValue("city", response.data[0]);
        
      }
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (country) {
      getStates();
      
    }
  }, [country]);


  // getStates


  useEffect(() => {
    const storedCity = JSON.parse(localStorage.getItem("userInfo"))?.city;
  
    if (storedCity && cities.length > 0) {
      const isCityValid = cities.includes(storedCity); // Check if city exists in the fetched list
      if (isCityValid) {
        setValue("city", storedCity);
      }
    }
  }, [cities, setValue]);
  
  
  useEffect(() => {
    const storedState = JSON.parse(localStorage.getItem("userInfo"))?.state;
    if (storedState && states.length > 0) {
      // Ensure states list is available before setting the value
      const isStateValid = states.some(state => state.name === storedState);
      if (isStateValid) {
        setValue("state", storedState);
      }
    }
  }, [states, setValue]);

  
  useEffect(() => {
    const storedRegion = JSON.parse(localStorage.getItem("userInfo"))?.region;
  
    if (storedRegion && regions.includes(storedRegion)) {
      setValue("region", storedRegion); // Set default value if valid
    }
  }, [regions, setValue]);
  

  return (
    <div className="language-region-settings">
      <form onSubmit={handleSubmit(editUser)}>
        <h5>Choose Your Language</h5>
        <div className="row">
          <div className="col-md-12">
            <select className="form-select" {...register("language")}>
              <option>English</option>
            </select>
          </div>
        </div>
        <hr className="ctm-hr" />

        <div className="row">
          <div className="col-md-6">
            <select className="form-select" {...register("region")}>
              {
                regions.map((region) => (

                  <option value={region}>{region}</option>
                ))
              }
            </select>
          </div>
          <div className="col-md-6">
            <Select
              options={options}
              value={country}
              onChange={changeHandler}
            />
          </div>
          <div className="col-md-6">
            <select className="form-select" {...register("state")} >
              {isLoading ? (
                <option>Loading...</option>
              ) : (
                states?.map((state, index) => (
                  <option key={index} value={state.name}>


                    {state.name}
                  </option>
                ))
              )}
            </select>
          </div>
          <div className="col-md-6">
            <select className="form-select" {...register("city")}>
            
              {isLoading ? (
                <option>Loading...</option>
              ) : (
                cities?.map((city, index) => (
                  
                  <option key={index} value={city}>

                    {city}
                  </option>
                ))
              )}
            </select>
          </div>
          <div className="col-md-6">
            <input
              className="form-control"
              placeholder="Enter Zip Code"
              {...register("zipcode")}
              defaultValue={localStorage.getItem("userInfo").zipCode}
            />
          </div>
        </div>
        <div className="submit-btns">
          <button className="custom_submit_btn">
            <ReactSVG src={refreshIcon} /> Save Changes
          </button>
        </div>
      </form>
    </div>
  );
};

export default LanguageRegion;
