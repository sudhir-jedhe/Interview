To run **PostgreSQL** using Docker Compose, you need to create a `docker-compose.yml` file and start it via the terminal.

---

### Step 1: Create a `docker-compose.yml` file

Create a file named `docker-compose.yml` in your project folder with the following configuration:

```yaml
services:
  postgres:
    image: postgres:16-alpine
    container_name: postgres_container
    restart: always
    environment:
      POSTGRES_USER: myuser
      POSTGRES_PASSWORD: mypassword
      POSTGRES_DB: mydb
    ports:
      - "5432:5432"
    volumes:
      - pgdata:/var/lib/postgresql/data

volumes:
  pgdata:

```

---

### Step 2: Start the Container

Open your terminal in the same directory as your `docker-compose.yml` file and run:

```bash
docker compose up -d

```

* `-d` runs the container in detached mode (in the background).
* Docker will automatically pull the official PostgreSQL image, create a persistent volume (`pgdata`) so your database data isn't lost when stopped, and expose it on port `5432`.

---

### Step 3: Connect to PostgreSQL

You can connect to your new PostgreSQL instance using any database client (like DBeaver, pgAdmin, or VS Code extension) or directly via the command line:

* **Host:** `localhost`
* **Port:** `5432`
* **Database:** `mydb`
* **Username:** `myuser`
* **Password:** `mypassword`

#### Connect via Docker CLI

If you want to open the interactive `psql` shell directly inside the running container:

```bash
docker exec -it postgres_container psql -U myuser -d mydb

```

---

### Useful Docker Compose Commands

* **View logs (to check if Postgres is ready):**

```bash
docker compose logs -f

```

* **Stop the database:**

```bash
docker compose stop

```

* **Stop and remove containers (data remains safe in the volume):**

```bash
docker compose down

```
