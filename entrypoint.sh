#!/bin/sh

# Write dynamic env file to public/env.js
cat <<EOF > /usr/src/app/public/env.js
window.__ENV__ = {
  NEXT_PUBLIC_PANEL_URL: "${NEXT_PUBLIC_PANEL_URL:-http://localhost:3000}"
};
EOF

# Start your app
exec yarn start
