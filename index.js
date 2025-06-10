
import { log } from 'console';
import express from 'express';
import fs from 'fs';
const app=express();
app.use(express.json());
const usersFile='./users.json'
 const data = fs.readFileSync(usersFile,'utf-8');
  const users = JSON.parse(data);
//To write to a file
function writeTOFile(){
    fs.writeFileSync(usersFile, JSON.stringify(users, null, 2), 'utf-8');
}
  //Add User
  function setUsers(adduser){
    users.push({id:users.length+1,...adduser})
     writeTOFile()
   
  }

  //update user
  function update(updateUser,index){
    const { name, age, email}=updateUser;
  if (name) users[index].name = name;
  if (age) users[index].age = age;
  if (email) users[index].email = email;
    writeTOFile()
  }
  //Delete user
  function deleteUser(index){
    users.splice(index,1);
    console.log(users);
    writeTOFile();
  }
  //Get all users by name
  function getUserByName(name){
    return users.filter((item)=>item.name==name)
  }
  //Get users Minimum Age
  function getMinAge(num){
    return users.filter((item)=>item.age>=num)
  }

  app.post('/user',(req,res)=>{
    console.log(req.body);
    const newUser=req.body
    
    if(users.find((user)=>user.email===newUser.email)){
        return res.status(400).send({ "message": "Email already exists." });
    }
    setUsers(newUser)
    res.status(201).send({"message": "User added successfully." } )
  })

  app.patch('/user/:id',(req,res)=>{
    const index=users.findIndex((user)=>user.id==req.params.id)
    if(index!==-1){
        update(req.body,index)
      return  res.status(200).send({ "message": `User ${Object.keys(req.body)} updated successfully.`} )
    }
    res.status(404).send({"message": "User ID not found." } )
  })
  app.delete('/user{/:id}',(req,res)=>{

    //id equals the first true

  const id=req.params.id||req.body.id
   const index=users.findIndex((user)=>user.id==id)
   if (index!==-1) {
    deleteUser(index);
   return res.status(200).send({"message": "User delete successfully." })
   }
    return res.status(400).send({"message": "User ID not found." } )
  })

 app.get('/user/getByName',(req,res)=>{
  const {name}=req.query
  if (users.find((user)=>user.name===name)) {
   return res.status(200).send({"message":{"status":200,"user":getUserByName(name)}})
    
  }
 res.status(404).send({"message": "User Name not found." } )
 })
  
  app.get('/user',(req,res)=>{  
   if (users.length<1) {
   return res.status(404).send({"message": "User Name not found." })
   }
   return res.status(200).send({"message":{"status":200,"user":users}})
  })

  app.get('/user/filter',(req,res)=>{
    const {minAge}=req.query
    const getUsers=getMinAge(minAge)
    if (!minAge || isNaN(minAge)||minAge <= 0) {
      return res.status(400).json({ message: 'minAge must be provided as a number in the query.' });
    }else if(getUsers.length>=1){
      return res.status(200).send({"message":{"status":200,"user":getUsers}})
    }
    res.send({"message":"not user found"})
  })

  app.get('/user/:id',(req,res)=>{
    let index=users.findIndex((user)=>user.id==req.params.id)
    if (index!==-1) {
     return res.status(200).send({"user":users[index]})
    }
    res.status(404).send({"message": "User ID not found." } )
  })
  app.use((req,res)=>{
    res.status(404).send({message: "Page Not Found"}) 
  })
app.listen(3000, () => {
  console.log('Server running on port 3000');
});