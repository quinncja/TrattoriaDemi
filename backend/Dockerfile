FROM oven/bun
COPY . .
WORKDIR /
RUN bun install
 
ARG PORT
EXPOSE ${PORT:-4000}
 
CMD ["bun", "app.js"]