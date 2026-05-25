# Run the Bookshop project with Docker

## 1. Build and start

```bash
docker compose up --build
```

The Express server will be available at:

```text
http://localhost:5000/
```

## 2. Test Task 1

In another terminal, run:

```bash
curl http://localhost:5000/
```

## 3. Stop the container

```bash
docker compose down
```

## Alternative without Docker Compose

```bash
docker build -t express-book-reviews .
docker run --rm -p 5000:5000 express-book-reviews
```
