const express = require('express')
const app = express()
const port = 3000
const methodOverride = require('method-override');
const bodyParser = require('body-parser');
const expressSanitizer = require('express-sanitizer');
const mongoose = require('mongoose')

mongoose.connect('mongodb://localhost:27017/Blog_App', {useNewUrlParser: true, useUnifiedTopology: true});
app.use(express.static('public'));
app.set('view engine' , 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(methodOverride('_method'));
app.use(expressSanitizer());

var blogSchema = new mongoose.Schema({
	title: String,
	image: String,
	body: String,
	created: {type: Date, default: Date.now}
});

var Blog = mongoose.model('Blog', blogSchema);

// Blog.create({
// 	title: 'Dog',
// 	image: 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1049&q=80',
// 	body : 'Cute Dog'
// })

app.get('/', (req, res) => {
  res.redirect('/blog')
})

app.get('/blog', function(req, res){
	Blog.find({}, function(err, blogs){
		if(err){
			console.log('Error!');
		} else{
			res.render('index', {blogs: blogs});
		}
	})
})

app.get('/blog/new', function(req, res){
	res.render('new');
});

app.post('/blog', function(req, res){
	req.body.blog.body = req.sanitize(req.body.blog.body)
	Blog.create(req.body.blog, function(err, newBlog){
		if(err){
			res.render('new');
		} else{
			res.redirect('/blog');
		}
	})
})

app.get('/blog/:id', function(req, res){
	Blog.findById(req.params.id, function(err, foundBlog){
		if(err){
			res.redirect('/blog');
		} else{
			res.render('show', {blog: foundBlog});
		}
	})
})

app.get('/blog/:id/edit', function(req, res){
	Blog.findById(req.params.id, function(err, foundBlog){
		if(err){
			res.redirect('/blog');
		} else{
			res.render('edit', {blog: foundBlog});
		}
	})
})

app.put('/blog/:id', function(req, res){
	req.body.blog.body = req.sanitize(req.body.blog.body)
	Blog.findByIdAndUpdate(req.params.id, req.body.blog, function(err, updateBlog){
		if(err){
			res.redirect('/blog');
		} else{
			res.redirect('/blog/' + req.params.id);
		}
	})
})

app.delete('/blog/:id', function(req, res){
	Blog.findByIdAndRemove(req.params.id, function(err, deleteBlog){
		if(err){
			res.redirect('/blog');
		}else{
			res.redirect('/blog');
		}
	})
})

app.listen(port, () => {
  console.log(`Blog app server started at http://localhost:${port}`)
})