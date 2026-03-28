FROM node:slim

# 2. Set the working directory
WORKDIR /usr/src/app

# 3. Copy package files first to leverage Docker cache
# This means 'npm install' only runs if dependencies change
COPY package*.json ./

# 4. Install only production dependencies and clean cache
RUN npm ci --only=production && \
    npm cache clean --force

# 5. Copy the rest of the application source code
COPY . .

# 6. Security: Run as a non-privileged user
# The 'node' user is built into the official Node image
USER node

# 7. Document the port
EXPOSE 3000

# 8. Use the array syntax for CMD
CMD [ "npm", "start" ]
