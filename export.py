import requests
import json
import csv

token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEsInVzZXJuYW1lIjoiYWRtaW4iLCJhZG0iOnRydWUsImV4cCI6MTcyNTU0MjU4NDY5OX0=.htiCnSHuGkrGN53ji/h5Bt0ip+Hmo4JpyaXPxFp4qlo="

headers = {'Authorization': 'Bearer ' + token}


response = requests.get('http://localhost:3000/films?q=', headers=headers)

response = json.loads(response.text)

res = []

# res.append(["title", "desc", "director", "release_year", "genre", "price", "duration", "video_url", "cover_image_url"])

for singularData in response['data']:
    id = singularData['id']
    takeSingular = requests.get('http://localhost:3000/films/'+id, headers=headers)
    takeSingular = json.loads(takeSingular.text)
    takeSingular = takeSingular['data']
    title = takeSingular['title'] 
    desc = takeSingular['description']
    director = takeSingular['director']
    release_year = takeSingular['release_year']
    genres = ",".join(takeSingular['genre'])
    price = takeSingular['price']
    duration = takeSingular['duration']
    video_url = takeSingular['video_url']
    cover_image_url = takeSingular['cover_image_url']
    
    if not cover_image_url:
        cover_image_url = ''
    
    temp = [title, desc, director, str(release_year), genres, str(price), str(duration), video_url, cover_image_url]
    res.append(temp)

    
with open('exported.csv', 'w', encoding='utf-8-sig', newline='') as csvfile:
    writer = csv.writer(csvfile, quotechar='"', delimiter=',', quoting=csv.QUOTE_ALL)
    writer.writerows(res)