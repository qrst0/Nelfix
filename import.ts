import * as fs from "fs";
import * as path from "path";
import { parse } from 'csv-parse';

(() => {
  const csvFilePath = path.resolve(__dirname, 'exported2.csv');
  
  const headers = ["title", "desc", "director", "release_year", "genre", "price", "duration", "video_url", "cover_image_url"]
  
  const fileContent = fs.readFileSync(csvFilePath, { encoding: 'utf-8' });
  
  parse(fileContent, {
    delimiter: ',',
    columns: headers,
  }, (error, result) => {
    if (error) {
      console.error(error);
    }
    for(const res of result){
        console.log(res.title)
    }
  });
})();