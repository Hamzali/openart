# Art

### **Retrieve all art pieces**

**Method:** GET

**URL:** /arts

**Return value:** 
```javascript
[
    {
        "id": "artid1",
        "title": "Art Title 1",
        "description": "Art Description 1",
        "content": "this is the content of the art 1",
        "createdAt": "12/23/2017",
        "artist": "Artist 1"
    },
    {
        "id": "artid2",
        "title": "Art Title 2",
        "description": "Art Description 2",
        "content": "this is the content of the art 2",
        "createdAt": "12/23/2017",
        "artist": "Artist 2"
    },
    {
        "id": "artid3",
        "title": "Art Title 3",
        "description": "Art Description 3",
        "content": "this is the content of the art 3",
        "createdAt": "12/23/2017",
        "artist": "Artist 3"
    },


]
```

### **Retrieve an art piece**

**Method:** GET

**URL:** /arts/:id

**Return values:**
**Return values:** 
```javascript
{
    "id": "artid3",
    "title": "Art Title 3",
    "description": "Art Description 3",
    "content": "this is the content of the art 3",
    "createdAt": "12/23/2017",
    "artist": "Artist 1" 
}
```


### **Create an art piece**

**Method:** POST

**URL:** /arts

**Body:**
```javascript
{
    "title": "An Art Title",
    "description": "An Art Description",
    "content": "this is the content of the art", 
}
```


**Return value:** 
```javascript
{
        "message": "success"
}
```
