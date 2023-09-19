FROM oven/bun
WORKDIR /
COPY . .
RUN bun install
 
ARG PORT
EXPOSE ${PORT:-4000}
 
CMD ["bun", "app.js"]