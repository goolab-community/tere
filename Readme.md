# Tere

  The project started to organize some orders around stray animal rescue and welfare. 


## Table of Contents

- [About](#about)
- [Tech Stack](#tech-stack)
- [Use Cases](#usecases)
- [Prerequisites](#prerequisites)
- [Clone the Repository](#clonetherepository)
- [Environment Variables](#environment-variables)
- [Build and Run](#build_and_run)
- [Database Setup](#database-setup)
- [Minio Setup](#miniosetup)
- [Running Tests](#running-tests)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [License](#license)

## About

 We see all mess around social network groups, and day to day, it became clear that we need to change something about it. Random people in social networks organize multiple activities, like:
Gathering money to buy food or cover medical expenses, rescue, find and relocate, etcetera. But all this isn't easy to do if you don't have the right tools around your hand. 
 I thought I could do something about it but didn't take a step forward until I met the happiest, kindest, and friendliest dog I had ever seen on the street. When I first saw her,
I immediately noticed how social and friendly she was.
She even adopted puppies from another dog; I named her Teresa, Tere, in short. Later, I decided to adopt her, and after some time, I started this project with the help of my friends.

I hope this project impacts lives too dependent on humans to leave and gives you endless loyalty and love.

## Tech Stack

- **Frontend**: [React](https://reactjs.org/)
- **Backend**: [FastAPI](https://fastapi.tiangolo.com/)
- **Database**: [PostgreSQL](https://www.postgresql.org/)
- **Object Storage**: Cloud Storage, Minio
- **Env**: Docker, Docker Compose, etc.


## Use Cases

View mode
---------

1. When the user opens the app, it automatically goes to the current location.
2. The user can inspect markers on a map.
3. When a user clicks a marker, it opens a popup with images, videos, and detailed info associated with the animal. 
4. The app has animals list view page
5. The app has an animal history page
6. The user can differentiate markers with colors: 
	 - Red - injured, or urgent
	 - Yellow -  hungry
	 - Blue -  attention needed, no personal caretaker
	 - Green - everything is right, have someone who cares
7. When you click a tag, it opens a popup window with animal detail info and a history link.
8. When you click on the link, you go to a history page, where history is filtered by animal ID.
9. The animal history page displays any accident or feed history. You can add new history by clicking on the add event button and filling in the appropriate field in a modal; submitting it will change the status of an animal, such as from hungry to needs feed recently. Based on the last event type. 

Register animal
---------------
When you click on a place in a map, it opens a popup with blank fields. When you click the register new animal link, a new animal register modal opens up. You fill in all fields and click submit. 


Tables
-------

### users
    id: int, decimal
    firstname: str
    lastname: str
    sex: enum
    age: int
    image_link: str (images are located on the private cloud)
    personal_id: str, null
    phone: str
    address: str

### animals:
    id: int, decimal 
    species: enum
    sex: enum, null
    breed_id: foreign key to the breeds table
    tag_id: str, null
    rfid_code: str, null
    age_year: int, null
    age_month: int, null
    age_year_from: int, null
    age_month_from: int, null
    age_year_to: int, null
    age_month_to: int, null
    name: str, null
    description: str, null
    media_id: foreign key to the media table
    latitude:  float
    longitude: float
    address: str, null
    last_event_id: foreign key to the history table

### caretakers_animals:
    id: int, decimal
    caretaker_id: foreign key to the users table
    animal_id: foreign key to animals table

### breeds: 
    id: int, decimal
    species: enum
    name: str

### history:
    id: int, decimal
    automatic: bool (if it is from autocheck)
    event_type: enum (fed, hospital_care, hungry) 
    animal_id: enum
    date: datetime
    user_id: foreign key to user
    description: str, null

### media:
    id: int, decimal
    animal_id: foreign key to animals 
    Image_link: str, null
    Video_link: str, null
    date: datetime
    description: str, null
    history_id: foreign key to history


Airflow scheduler
---------------------
The system periodically checks/ iterates over animals (airflow pipeline), finds that the animal has not fed for more than two days, sets the status to hungry, and adds a new event in the history with an auto check as an event type.


## Prerequisites

Make sure you have Docker and docker-compose installed

### Clone the Repository

```bash
git clone https://github.com/goolab-community/tere.git
cd tere
```
## Environment Variables

### Local environment
Prepare ENV files for local development with the following backend environment variables

```conf
DB_NAME=<your_database_name>
DB_USER=<database_default_username>
DB_PASSWORD=<database_default_user_password>

DB_HOST=<database_service_name>
DB_PORT=5432
DB_CONNECTION_TYPE=local

# fastapi settings
API_SECRET_KEY=<some_random_key_for_backend_api>
ACCESS_TOKEN_EXPIRE_MINUTES=30
BASE_URL=/api/v1

# frontend
FRONTEND_APP_ADDRESS=localhost
FRONTEND_APP_PORT=8080

DEV_TYPE="local"
# Minio address in docker-compose network
MINIO_ADDRESS=tere-minio
# First Create minio bucket, named for example: "tere-media-bucket" with minio web interface
# Access key and secret key is set on minio web interface
MINIO_ACCESS_KEY=<your_minio_access_key>
MINIO_SECRET_KEY=<your_minio_secret_key>
# Your local IP address
HOST_IP=<your_local_ip_address>
```
Save it into the .env file


ENV file for frontend environment variables

```conf
REACT_APP_DB_CONNECTION_TYPE=local

REACT_APP_BACKEND_API_BASE_URL=/api/v1
REACT_APP_BACKEND_API_ADDRESS=http://localhost
REACT_APP_BACKEND_API_PORT=8000
PORT=8080
HTTP_PROXY="http://<your_local_ip_address>:8080"
```

Save it into the .app_env

### Cloud Resource environment

Prepare ENV files for GCP.
The following environment variables are required to use GCP CloudSQL and  Cloud Storage.

```conf
DB_NAME=<your_database_name>
DB_USER=<database_default_username>
DB_PASSWORD=<database_default_user_password>

DB_HOST=<cloudsql-proxy-service-name>
DB_PORT=5432
DB_CONNECTION_TYPE=local

# fastapi settings
API_SECRET_KEY=<some_random_key_for_backend_api>
ACCESS_TOKEN_EXPIRE_MINUTES=30
BASE_URL=/api/v1

# frontend
FRONTEND_APP_ADDRESS=localhost
FRONTEND_APP_PORT=8080
```
Save it into the .env file

ENV file for frontend environment variables
```conf
REACT_APP_DB_CONNECTION_TYPE=local

REACT_APP_BACKEND_API_BASE_URL=/api/v1
REACT_APP_BACKEND_API_ADDRESS=http://localhost
REACT_APP_BACKEND_API_PORT=8000
PORT=8080
```

### minio
Connect minio with:
```bash
mc alias set myminio http://tere-minio:9000 minio-tere minio-teremere
```

## Build and Run

### Build
```bash
docker-compose build
```

### Run
```bash
docker-compose up
```

### Stop and clear volumes

Stop all containers 
```bash
docker-compose stop
```

Remove all volumes
```bash
docker-compose down -v
```

## Database Setup
To add connection to PgAdmin, access to:

http://localhost:5050/

use default PgAdmin credentials:
login: tere@tere.ge
password: tere

### Add database
From the left side menu, right-click and choose Register > Sever...
In the "Register - Server" modal, fill in appropriate fields like:
- Name - In the General tab, name it whatever you like
- In the connection tab, fill in the database port; it's 5432 by default
- In the Maintenance database, Fill database name you set in the .env file
- In username, fill in the database user name you set in the .env file
- In the password, fill in the database user password you set in the .env file
Click submit, database will appear in left side menu

## Minio Setup

Minio web interface is accessible from: 

http://localhost:9001/login

login with default username and password: 
username: minio-tere 
password: minio-teremere

### Create default bucket
Click on the Object Browser tab and click to Create a bucket, name bucket: tere-media-bucket
The newly created bucket will appear in the left-side menu.

### Add access key and password for minio
Click on Access Keys, and click Create access key. As you can see, the access key and secret key are generated automatically for you. Copy these keys into a .env file with variable names like:
```
MINIO_ACCESS_KEY=<your_minio_access_key>
MINIO_SECRET_KEY=<your_minio_secret_key>
```
After creating you newly created key appears in list.

### Minio Access IP
To access a Minio service from frontend and set a proxy to overcome the CORS policy, Set your local IP address
in .env file like:
 HOST_IP=<your-local-ip-address>

## License
This project is licensed under the MIT License - see the LICENSE file for details.
