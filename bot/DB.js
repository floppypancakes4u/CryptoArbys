
import fs from 'fs';

let DB = { Pairs: {}, Opportunities: {} };

export function loadDB(exec) {
    fs.readFile('DB.json', 'utf8', function readFileCallback(err, data) {
      if (err) {
        if (err.code == 'ENOENT') {
          console.log('DB.json not detected. Creating.');
          fs.writeFile('DB.json', JSON.stringify(DB, replacer), 'utf8', function () {}); // write it back
        } else {
          console.log(err);
        }

        //console.log(DB);
        //return DB;      
        exec(DB) 
      } else {
        console.log("JSON loaded. Returning the object")
        const loadedDB = JSON.parse(data, reviver); //now it an object
        //return loadedDB;    
        exec(loadedDB);   
      }
    })
}
  
export function saveDB(data) {
    console.log(data)
    const json = JSON.stringify(data, replacer); //convert it back to json
    console.log(json)
    fs.writeFile('DB.json', json, 'utf8', function () {}); // write it back
}

function replacer(key, value) {
    if(value instanceof Map) {
        return {
        dataType: 'Map',
        value: Array.from(value.entries()), // or with spread: value: [...value]
        };
    } else {
        return value;
    }
}

function reviver(key, value) {
    if(typeof value === 'object' && value !== null) {
        if (value.dataType === 'Map') {
        return new Map(value.value);
        }
    }
    return value;
}