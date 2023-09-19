FROM oven/bun
WORKDIR /BACKEND
COPY . .
RUN bun install
 
ARG PORT
EXPOSE ${PORT:-4000}
 
CMD ["bun", "app.js"]