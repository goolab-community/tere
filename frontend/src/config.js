var api_url = null;
if (process.env.REACT_APP_BACKEND_API_ADDRESS === undefined) {
  api_url = `${window.REACT_APP_BACKEND_API_ADDRESS}:` +
                  `${window.REACT_APP_BACKEND_API_PORT}${window.REACT_APP_BACKEND_API_BASE_URL}`;
}else{
  api_url = `${process.env.REACT_APP_BACKEND_API_ADDRESS}:` + 
                  `${process.env.REACT_APP_BACKEND_API_PORT}${process.env.REACT_APP_BACKEND_API_BASE_URL}`;
}

export const API_URL = api_url;