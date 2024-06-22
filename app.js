const express=require('express')
const app=express()
const bodyParser=require('body-parser')
const jsonParser=bodyParser.json()
const fs=require('fs')
const ejs = require('ejs')
const mongoose=require('mongoose')
const Task=require('./task_schema')
// const url='mongodb+srv://shourya:bPOjBD3sVi4T3TAt@cluster0.wbqch.mongodb.net/mydata?retryWrites=true&w=majority'
const url='mongodb+srv://joel:qazxsw@cluster0.dgtvvwd.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0'

mongoose.connect(url).then(() => console.log('Connected to MongoDB')).catch(err => console.error('Failed to connect to MongoDB', err));

const hostname='127.0.0.1'

app.use(express.static(__dirname + '/public'));

app.use('/static', express.static('static'));   //for static filer
app.set('view engine', 'html');  
app.engine('html', ejs.renderFile );   

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))

app.get('/', (req, res)=>{
    res.render('index');
} )


app.post('/add', jsonParser, (req,res)=>{
    console.log('add invoked')
    const data= new Task({
        _id: new mongoose.Types.ObjectId(),
        title:req.body.title,
        description: req.body.description,
        dueDate: req.body.dueDate
    })
    data.save().then(result=>{
        res.status(201).json(result)
        console.log(result)
    }).catch(err=>res.status(500))
})

app.get('/task', async (req, res) => {
    try {
      const tasks = await Task.find();
      res.json(tasks);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching tasks', error });
    }
  });


  // PUT request to update a task
app.put('/tasks/:id', async (req, res) => {
    const taskId = req.params.id;
    const taskUpdate ={
        title:req.body.title,
        description: req.body.description,
        dueDate: req.body.dueDate
    };

    try {
        // Update task in MongoDB
        const updatedTask = await Task.findByIdAndUpdate(taskId, taskUpdate, { new: true });

        if (!updatedTask) {
            return res.status(404).json({ message: 'Task not found' });
        }

        res.status(200).json({ message: 'Task updated successfully', task: updatedTask });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});


app.delete('/tasks/:id', async (req, res) => {
    const idToDelete = req.params.id;

    try {
      // Convert idToDelete to ObjectId if it's not already
  
      // Delete the document with the specified _id
      const result = await Task.deleteOne({ _id: idToDelete });
      if (result.deletedCount === 1) {
        res.status(204).send(); // Successfully deleted
      } else {
        res.status(404).json({ error: 'Document not found' });
      }
    } catch (err) {
      console.error('Error deleting document:', err);
      res.status(500).json({ error: 'Internal server error' });
    }
  });



    

app.listen(3001, hostname, ()=>{
    console.log(`listening at http://${hostname}:3001`)
})