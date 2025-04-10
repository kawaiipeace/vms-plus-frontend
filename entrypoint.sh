#!/bin/bash

# Define the path to generate the env-config.js file
ENV_FILE=/app/public/env/env-config.js

# Output environment variables prefixed with NEXT_PUBLIC_
echo "Generating runtime environment variables for the browser..."
echo "window.__ENV__ = {" > $ENV_FILE
env | grep '^NEXT_PUBLIC_CLIENT' | sed -E 's/([^=]*)=(.*)/"\1": "\2",/' >> $ENV_FILE
echo "};" >> $ENV_FILE

# Log the generated file
echo "Generated $ENV_FILE:"
cat $ENV_FILE

# Start the Next.js application
exec node_modules/.bin/next start
