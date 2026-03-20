#!/bin/bash

# Define source logo and desired favicon name
SOURCE_LOGO="src/assets/appLogo.svg"
FAVICON_SVG="favicon.svg"
PUBLIC_FAVICON_PATH="public/$FAVICON_SVG"
HTML_FILE="public/index.html"

# Step 1: Ensure a favicon exists in the public directory.
# If not, create one from the source appLogo.svg.
if [ ! -f "$PUBLIC_FAVICON_PATH" ]; then
    echo "Favicon '$FAVICON_SVG' not found in public directory."
    if [ -f "$SOURCE_LOGO" ]; then
        echo "Creating favicon from '$SOURCE_LOGO'..."
        cp "$SOURCE_LOGO" "$PUBLIC_FAVICON_PATH"
        echo "Favicon created at '$PUBLIC_FAVICON_PATH'."
    else
        echo "Error: Source logo '$SOURCE_LOGO' not found. Cannot create favicon."
        exit 1
    fi
fi

# Step 2: Update index.html to use the SVG favicon.
echo "Updating index.html to use SVG favicon..."
# If a favicon link exists, replace its href. If not, add a new link.
if grep -q '<link rel="icon"' "$HTML_FILE"; then
    sed -i.bak 's|<link rel="icon" href="[^"]*"|<link rel="icon" href="%PUBLIC_URL%/'"$FAVICON_SVG"'"|' "$HTML_FILE"
    echo "Favicon link in $HTML_FILE updated to use $FAVICON_SVG."
else
    sed -i.bak 's#</head>#  <link rel="icon" href="%PUBLIC_URL%/'"$FAVICON_SVG"'" />\n</head>#' "$HTML_FILE"
    echo "Favicon link added to $HTML_FILE."
fi
rm -f "$HTML_FILE.bak"

# Step 2.5: Ensure browser opens on start
ENV_FILE=".env"
if [ ! -f "$ENV_FILE" ] || ! grep -q -s "BROWSER=" "$ENV_FILE"; then
    echo "" >> "$ENV_FILE"
    echo "# Automatically open browser on 'npm start'" >> "$ENV_FILE"
    echo "BROWSER='Google Chrome'" >> "$ENV_FILE"
    echo "Configured project to open browser on start (via .env file)."
fi

# Step 3: Clear Browser Cache
echo "Remember to clear your browser cache to see the updated favicon."

echo "Setup complete. You can now run 'npm start' to see the changes."

