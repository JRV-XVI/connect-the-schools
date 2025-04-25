
// Define base URL for API calls
const URL_BASE = 'http://localhost:4001/api'; // Replace with your actual API base URL

/**
 * Performs a GET request to the specified endpoint
 * @param {string} endpoint - API endpoint to call
 * @returns {Promise} - Response data
 */
const get = async (endpoint) => {
    try {
        const response = await fetch(`${URL_BASE}${endpoint}`);
        if(response.ok) {
            return await response.json();
        } else {
            throw new Error(`Error: ${response.status} ${response.statusText}`);
        }
    } catch (error) {
        console.error('Error en la petición GET:', error);
        throw {
            message: 'Error en la petición GET',
            originalError: error
        };
    }
};

/**
 * Performs a POST request with data to the specified endpoint
 * @param {string} endpoint - API endpoint to call
 * @param {object} data - Data to send in request body
 * @returns {Promise} - Response data
 */
const post = async (endpoint, data = null) => {
    const requestOptions = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        }
    };
    
    if (data) {
        requestOptions.body = JSON.stringify(data);
    }
    
    try {
        const response = await fetch(`${URL_BASE}${endpoint}`, requestOptions);
        if(response.ok) {
            return await response.json();
        } else {
            throw new Error(`Error: ${response.status} ${response.statusText}`);
        }
    } catch (error) {
        console.error('Error en la petición POST:', error);
        throw {
            message: 'Error en la petición POST',
            originalError: error
        };
    }
};

/**
 * Performs a PUT request to the specified endpoint
 * @param {string} endpoint - API endpoint to call
 * @param {object} data - Data to send in request body
 * @returns {Promise} - Response data
 */
const put = async (endpoint, data) => {
    const requestOptions = {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    };
    
    try {
        const response = await fetch(`${URL_BASE}${endpoint}`, requestOptions);
        if(response.ok) {
            return await response.json();
        } else {
            throw new Error(`Error: ${response.status} ${response.statusText}`);
        }
    } catch (error) {
        console.error('Error en la petición PUT:', error);
        throw {
            message: 'Error en la petición PUT',
            originalError: error
        };
    }
};

/**
 * Performs a DELETE request to the specified endpoint
 * @param {string} endpoint - API endpoint to call
 * @returns {Promise} - Response data
 */
const del = async (endpoint) => {
    const requestOptions = {
        method: 'DELETE'
    };
    
    try {
        const response = await fetch(`${URL_BASE}${endpoint}`, requestOptions);
        if(response.ok) {
            return await response.json();
        } else {
            throw new Error(`Error: ${response.status} ${response.statusText}`);
        }
    } catch (error) {
        console.error('Error en la petición DELETE:', error);
        throw {
            message: 'Error en la petición DELETE',
            originalError: error
        };
    }
};

export { get, post, put, del };