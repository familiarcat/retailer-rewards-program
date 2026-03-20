#!/bin/bash

# Define the favicon file name
FAVICON="favicon.ico"

# Step 1: Check favicon file location
if [ ! -f "public/$FAVICON" ]; then
    echo "Favicon not found in the public directory. Please ensure $FAVICON is present."
    exit 1
fi

# Step 2: Update index.html with favicon link
HTML_FILE="public/index.html"

echo "Updating index.html with favicon link..."
if grep -q "<link rel=\"icon\"" "$HTML_FILE"; then
    echo "Favicon link already exists in $HTML_FILE."
else
    echo "<link rel=\"icon\" href=\"%PUBLIC_URL%/$FAVICON\" />" >> "$HTML_FILE"
    echo "Favicon link added to $HTML_FILE."
fi

# Step 3: Clear Browser Cache
echo "Remember to clear your browser cache to see the updated favicon."

# Step 4: Suggest checking Favicon Format
echo "Ensure your favicon is in the .ico format. If not, consider using a favicon generator."

# Step 5: Restart Local Server with notification
echo "Restarting the development server..."
npm start

echo "All steps completed. Please verify the favicon in your browser."