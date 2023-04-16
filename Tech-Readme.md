## Redis storage

1. Users => stored as hashmap { userId : userData }
2. Rooms => stored as individual sets
   1. key roomId:123 has { userId1, userId2, userId3 }
