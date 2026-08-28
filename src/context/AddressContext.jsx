/* eslint-disable react-refresh/only-export-components */
import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
const AddressContext = createContext(null);

const ADDRESSES_KEY =
  "smartstore_addresses";

const SELECTED_ADDRESS_KEY =
  "smartstore_selected_address";

const CURRENT_LOCATION_KEY =
  "smartstore_current_location";


/* ============================================================
   READ JSON SAFELY
============================================================ */

function readStorage(key, fallback) {
  try {
    const value =
      localStorage.getItem(key);

    if (!value) {
      return fallback;
    }

    const parsed =
      JSON.parse(value);

    return parsed ?? fallback;
  } catch {
    return fallback;
  }
}


/* ============================================================
   ADDRESS ID
============================================================ */

function createAddressId() {
  return `address_${Date.now()}_${Math.random()
    .toString(36)
    .slice(2, 9)}`;
}


/* ============================================================
   ADDRESS CONTEXT
============================================================ */

export function AddressProvider({
  children,
}) {

  const [
    addresses,
    setAddresses,
  ] = useState(() =>
    readStorage(
      ADDRESSES_KEY,
      []
    )
  );


  const [
    selectedAddressId,
    setSelectedAddressId,
  ] = useState(() =>
    readStorage(
      SELECTED_ADDRESS_KEY,
      null
    )
  );


  const [
    currentLocation,
    setCurrentLocation,
  ] = useState(() =>
    readStorage(
      CURRENT_LOCATION_KEY,
      null
    )
  );


  const [
    detectingLocation,
    setDetectingLocation,
  ] = useState(false);


  const [
    locationError,
    setLocationError,
  ] = useState("");


  /* ==========================================================
     SAVE ADDRESSES
  ========================================================== */

  useEffect(() => {
    try {
      localStorage.setItem(
        ADDRESSES_KEY,
        JSON.stringify(addresses)
      );

      window.dispatchEvent(
        new Event(
          "addressesUpdated"
        )
      );
    } catch {
      // Ignore storage errors
    }
  }, [
    addresses,
  ]);


  /* ==========================================================
     SAVE SELECTED ADDRESS
  ========================================================== */

  useEffect(() => {
    try {
      if (
        selectedAddressId
      ) {
        localStorage.setItem(
          SELECTED_ADDRESS_KEY,
          JSON.stringify(
            selectedAddressId
          )
        );
      } else {
        localStorage.removeItem(
          SELECTED_ADDRESS_KEY
        );
      }

      window.dispatchEvent(
        new Event(
          "selectedAddressUpdated"
        )
      );
    } catch {
      // Ignore storage errors
    }
  }, [
    selectedAddressId,
  ]);


  /* ==========================================================
     SAVE CURRENT LOCATION
  ========================================================== */

  useEffect(() => {
    try {
      if (
        currentLocation
      ) {
        localStorage.setItem(
          CURRENT_LOCATION_KEY,
          JSON.stringify(
            currentLocation
          )
        );
      } else {
        localStorage.removeItem(
          CURRENT_LOCATION_KEY
        );
      }
    } catch {
      // Ignore storage errors
    }
  }, [
    currentLocation,
  ]);


  /* ==========================================================
     SELECTED ADDRESS
  ========================================================== */

  const selectedAddress =
    useMemo(() => {

      if (
        !selectedAddressId
      ) {
        return null;
      }

      return (
        addresses.find(
          (address) =>
            String(
              address.id
            ) ===
            String(
              selectedAddressId
            )
        ) || null
      );

    }, [
      addresses,
      selectedAddressId,
    ]);


  /* ==========================================================
     ADD ADDRESS
  ========================================================== */

  const addAddress = (
    address
  ) => {

    if (!address) {
      return null;
    }


    const newAddress = {
      ...address,

      id:
        address.id ||
        createAddressId(),

      createdAt:
        address.createdAt ||
        new Date().toISOString(),

      updatedAt:
        new Date().toISOString(),
    };


    setAddresses(
      (current) => [
        ...current,
        newAddress,
      ]
    );


    /*
     * Automatically select the newly added
     * address.
     */

    setSelectedAddressId(
      newAddress.id
    );


    return newAddress;
  };


  /* ==========================================================
     UPDATE ADDRESS
  ========================================================== */

  const updateAddress = (
    addressId,
    updatedAddress
  ) => {

    if (
      !addressId ||
      !updatedAddress
    ) {
      return;
    }


    setAddresses(
      (current) =>
        current.map(
          (address) => {

            if (
              String(
                address.id
              ) !==
              String(
                addressId
              )
            ) {
              return address;
            }


            return {
              ...address,
              ...updatedAddress,
              id: address.id,
              updatedAt:
                new Date().toISOString(),
            };
          }
        )
    );
  };


  /* ==========================================================
     REMOVE ADDRESS
  ========================================================== */

  const removeAddress = (
    addressId
  ) => {

    if (!addressId) {
      return;
    }


    setAddresses(
      (current) =>
        current.filter(
          (address) =>
            String(
              address.id
            ) !==
            String(
              addressId
            )
        )
    );


    /*
     * If the deleted address was selected,
     * automatically select another saved
     * address if available.
     */

    setSelectedAddressId(
      (currentSelected) => {

        if (
          String(
            currentSelected
          ) !==
          String(
            addressId
          )
        ) {
          return currentSelected;
        }


        const remaining =
          addresses.filter(
            (address) =>
              String(
                address.id
              ) !==
              String(
                addressId
              )
          );


        return remaining.length >
          0
          ? remaining[0].id
          : null;
      }
    );
  };


  /* ==========================================================
     SELECT ADDRESS
  ========================================================== */

  const selectAddress = (
    addressId
  ) => {

    const exists =
      addresses.some(
        (address) =>
          String(
            address.id
          ) ===
          String(
            addressId
          )
      );


    if (!exists) {
      return;
    }


    setSelectedAddressId(
      addressId
    );
  };


  /* ==========================================================
     CLEAR SELECTED ADDRESS
  ========================================================== */

  const clearSelectedAddress =
    () => {
      setSelectedAddressId(
        null
      );
    };


  /* ==========================================================
     CURRENT LOCATION
     
     Browser gives latitude/longitude.
     We do NOT invent a street address.
  ========================================================== */

  const detectCurrentLocation =
    () => {

      setLocationError("");


      if (
        !navigator.geolocation
      ) {
        setLocationError(
          "Location detection is not supported by this browser."
        );

        return;
      }


      setDetectingLocation(
        true
      );


      navigator.geolocation.getCurrentPosition(
        (position) => {

          const location = {
            latitude:
              position.coords.latitude,

            longitude:
              position.coords.longitude,

            accuracy:
              position.coords.accuracy,

            detectedAt:
              new Date().toISOString(),
          };


          setCurrentLocation(
            location
          );


          setDetectingLocation(
            false
          );
        },

        (error) => {

          let message =
            "Unable to detect your current location.";


          if (
            error.code ===
            error.PERMISSION_DENIED
          ) {
            message =
              "Location permission was denied. Please allow location access in your browser.";
          }


          if (
            error.code ===
            error.POSITION_UNAVAILABLE
          ) {
            message =
              "Your current location is unavailable.";
          }


          if (
            error.code ===
            error.TIMEOUT
          ) {
            message =
              "Location detection timed out. Please try again.";
          }


          setLocationError(
            message
          );


          setDetectingLocation(
            false
          );
        },

        {
          enableHighAccuracy:
            true,

          timeout:
            10000,

          maximumAge:
            300000,
        }
      );
    };


  /* ==========================================================
     CLEAR CURRENT LOCATION
  ========================================================== */

  const clearCurrentLocation =
    () => {
      setCurrentLocation(
        null
      );

      setLocationError(
        ""
      );
    };


  /* ==========================================================
     GET SELECTED ADDRESS
  ========================================================== */

  const getSelectedAddress =
    () => {
      return selectedAddress;
    };


  /* ==========================================================
     GET ADDRESS DISPLAY TEXT
  ========================================================== */

  const getAddressDisplay =
    () => {

      if (
        selectedAddress
      ) {

        const parts = [
          selectedAddress.address,
          selectedAddress.city,
          selectedAddress.state,
        ].filter(Boolean);


        return (
          parts.join(", ") ||
          "Selected address"
        );
      }


      if (
        currentLocation
      ) {
        return "Current location";
      }


      return "Select delivery address";
    };


  /* ==========================================================
     VALUE
  ========================================================== */

  const value =
    useMemo(
      () => ({
        addresses,

        selectedAddressId,

        selectedAddress,

        currentLocation,

        detectingLocation,

        locationError,

        addAddress,

        updateAddress,

        removeAddress,

        selectAddress,

        clearSelectedAddress,

        detectCurrentLocation,

        clearCurrentLocation,

        getSelectedAddress,

        getAddressDisplay,
      }),
      [
        addresses,
        selectedAddressId,
        selectedAddress,
        currentLocation,
        detectingLocation,
        locationError,
      ]
    );


  return (
    <AddressContext.Provider
      value={value}
    >
      {children}
    </AddressContext.Provider>
  );
}


/* ============================================================
   HOOK
============================================================ */

export function useAddress() {

  const context =
    useContext(
      AddressContext
    );


  if (!context) {
    throw new Error(
      "useAddress must be used inside AddressProvider"
    );
  }


  return context;
}


export default AddressContext;