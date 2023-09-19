FROM oven/bun
COPY . .
WORKDIR /app
RUN bun install
 
ARG PORT
EXPOSE ${PORT:-4000}
 
CMD ["bun", "app.js"]