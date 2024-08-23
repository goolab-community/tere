#!/bin/sh

# Inject environment variables into a JavaScript file
echo "window.REACT_APP_BACKEND_API_BASE_URL='$REACT_APP_BACKEND_API_BASE_URL';" > /usr/share/nginx/html/env-config.js
echo "window.REACT_APP_BACKEND_API_ADDRESS='$REACT_APP_BACKEND_API_ADDRESS';" >> /usr/share/nginx/html/env-config.js
echo "window.REACT_APP_BACKEND_API_PORT='$REACT_APP_BACKEND_API_PORT';" >> /usr/share/nginx/html/env-config.js

echo "- Injected environment variables -"
echo " ................................ "
echo $REACT_APP_BACKEND_API_BASE_URL
echo $REACT_APP_BACKEND_API_ADDRESS
echo $REACT_APP_BACKEND_API_PORT
echo "Contents of env-config.js:"
cat /usr/share/nginx/html/env-config.js
echo " ................................ "
