To create a new PostgreSQL database and the necessary tables for your protein data project through the `psql` command line interface, follow these steps. First, ensure you have PostgreSQL installed and the `psql` tool is accessible from your terminal or command prompt.

### Step 0: Set up Postgres

The following steps help with setting up a postgres instance running on port 5432. The following steps are for setting up postgres database within a docker container on a centos machine. Commands might change depending on your OS. For most operating systems once you have docker installed, you can skip the initial steps and begin from pulling the postgres image and starting the database.
```
sudo yum update -y
sudo yum install -y docker
sudo service docker start
sudo usermod -a -G docker ec2-user
newgrp docker
docker ps
docker pull postgres:15
docker run --name postgres -p 5432:5432 -e POSTGRES_PASSWORD=postgres -d postgres:15
```

The following steps explain how to set up the table structure for the app. Either you can follow the following steps if you have the `psql` cli installed or you can use PgAdmin GUI tool to connect to the database running on 5432 and set up the table structure. 

### Step 1: Log into PostgreSQL
Open your terminal or command prompt and log into the PostgreSQL database as a superuser (often `postgres`), or as any user that has sufficient privileges to create databases and tables:

```bash
psql -U postgres
```

Replace `postgres` with your PostgreSQL superuser username if different.

### Step 2: Create a New Database
Once logged in, create a new database using the SQL `CREATE DATABASE` command. Replace `yourdatabase` with the name you want for your database:

```sql
CREATE DATABASE proteinData;
```

### Step 3: Connect to Your New Database
Connect to the database you just created to begin creating tables:

```sql
\c proteinData
```

### Step 4: Create the Required Tables
Now, execute the following SQL command to create a table with the appropriate schema, including JSONB fields for storing complex data types:

```sql
CREATE TABLE protein_data (
    entry VARCHAR PRIMARY KEY,
    organisms VARCHAR,
    length INT,
    first_seen DATE,
    last_seen DATE,
    organism_id VARCHAR,
    protein_names TEXT,
    sequence TEXT,
    pfam TEXT,
    smart TEXT,
    amino_acid_composition JSONB,
    avg_hydrophobicity FLOAT,
    secondary_structure JSONB
);
```

This table definition includes:
- Standard fields for basic protein attributes (e.g., `entry`, `organisms`, `length`).
- JSONB fields for complex data types (`amino_acid_composition`, `secondary_structure`), allowing flexibility in storing structured data.

### Step 5: Confirm Table Creation
After running the `CREATE TABLE` command, you can check that the table was created successfully by listing all tables in your database:

```sql
\dt
```

This command will show all tables in the current database, and you should see `protein_data` listed.

### Step 6: Exit psql
Once you are done setting up your database and table, you can exit the `psql` interface:

```sql
\q
```

### Additional Considerations
- Ensure your PostgreSQL server is configured to allow connections from your application, particularly regarding host, port, and authentication settings in your `pg_hba.conf` and `postgresql.conf` files.
- Consider setting up additional indexes on your `protein_data` table for any fields that you will frequently query or filter by to improve performance.

This setup provides a robust foundation for storing and retrieving your protein data efficiently, leveraging PostgreSQL's powerful features like JSONB for complex data types.
