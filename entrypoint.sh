#!/bin/sh

cat <<EOF > /app/public/env.js
window.__ENV__ = {
  NEXT_PUBLIC_PANEL_URL: "${NEXT_PUBLIC_PANEL_URL:-http://localhost:3000}"
};
EOF

exec node server.js
