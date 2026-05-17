#!/bin/bash
# Manual cookie update helper for UBC Workday MCP
# Usage: ./scripts/update-cookie.sh

echo "UBC Workday Cookie Update Helper"
echo "================================"
echo ""
echo "1. Open Chrome and log in to https://wd10.myworkday.com/ubc"
echo "2. Complete Duo MFA authentication"
echo "3. Open DevTools (F12) → Network tab"
echo "4. Find any request to wd10.myworkday.com"
echo "5. Right-click → Copy → Copy as cURL (bash)"
echo "6. Paste the cookie value below (everything after -b or --cookie)"
echo ""

read -p "Paste cookie string: " COOKIE

if [ -z "$COOKIE" ]; then
    echo "Error: No cookie provided"
    exit 1
fi

# Update .env file
if [ -f .env ]; then
    # Remove old cookie line
    sed -i '/^WORKDAY_COOKIE=/d' .env
    # Add new cookie line
    echo "WORKDAY_COOKIE=$COOKIE" >> .env
    echo ""
    echo "✓ Cookie updated in .env"
    echo "✓ Next run will use new session"
else
    echo "Error: .env file not found"
    exit 1
fi
