# Gebruik een officiële Node.js image
FROM node:18

# Stel de werkdirectory in
WORKDIR /app

# Kopieer package.json en package-lock.json
COPY package*.json ./

# Installeer de dependencies
RUN npm install

# Kopieer de rest van de bestanden
COPY . .

# Stel de poort in waarop de app draait
EXPOSE 3000

# Start de applicatie
CMD ["node", "index.js"]
