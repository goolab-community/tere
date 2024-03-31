# Stray animal monitoring api


## app docs is located at

http://localhost:8080/docs


# Frontend

## install packages
yarn add react-router-dom axios


# Use Cases

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
    bread_id: foreign key to the breads table
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
