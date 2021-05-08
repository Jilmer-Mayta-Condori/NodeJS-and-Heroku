const express = require('express')
const app = express()
const bodyParser = require('body-parser')

const fecha = new Date()

let persons = [
  {
    id: 1,
    name: 'Arto Hellas',
    number: '040-123456'
  },
  {
    id: 2,
    name: 'Ada Lovelace',
    number: '39-44-5323523'
  },
  {
    id: 3,
    name: 'Dan Abramov',
    number: '21-43-234345'
  },
  {
    id: 4,
    name: 'Mary Poppendick',
    number: '39-23-6423122'
  }
]

// Middleware
app.use((req, res, next) => {
  console.log('estoy en el primer Middleware')
  console.log(req.path)
  console.log(req.method)
  console.log(req.body)
  next()
})

app.get('/', (request, response, next) => {
  response.send('<h1>Bienvenidos a mi pagina con NODEJS</h1>' +
  '<br/><a href="/form"><button>agregar nuevos registros</button></a> <br/>' +
  '<br/><a href="/api/personas"><button>ver registros JSON</button></a>')
  next()
})

// Middleware 3
app.use((req, res, next) => {
  console.log('===> estoy en el tercer Middleware')
  next()
})

app.get('/info', (request, response) => {
  response.send('<h3> Phonebook has info for ' + persons.length + ' people</h3>' +
  '<h3>' + fecha + '</h3>')
})

app.get('/api/personas', (request, response) => {
  response.json(persons)
})

app.get('/api/personas/:id', (request, response) => {
  const id = Number(request.params.id)
  const person = persons.find(person => person.id === id)

  if (person) {
    response.json(person)
  } else {
    response.send('<h3>no existe persona con el id enviado</h3>')
  }
})

app.delete('/api/personas/:id', (request, response) => {
  const id = Number(request.params.id)
  persons = persons.filter(person => person.id !== id)

  response.status(204).end()
})

app.get('/form', (request, response) => {
  response.send('<h1>Bienvenidos a mi formulario con NODEJS</h1>' +
   '<form method="POST" action="/api/personas">' +
   '  <label>Nombre</label><br/>' +
   '    <input type="text" name="name"> <br/><br/>' +
   '  <label>Telefono</label><br/>' +
   '    <input type="text" name="number"> <br/><br/>' +
   '  <button type="submit">Enviar</button>' +
   '</form>')
})

app.use(express.json())

// extended: false significa que parsea solo string (no archivos de imagenes por ejemplo)
app.use(bodyParser.urlencoded({ extended: false }))

app.post('/api/personas', (request, response) => {
  const nombre = request.body.name
  const numero = request.body.number
  const id = Math.floor(Math.random() * (10000 - 1) + 10000)
  let contador = 0

  if (!nombre) {
    contador = 1
  }
  if (!numero) {
    contador = 2
  }
  if (!numero && !nombre) {
    contador = 3
  }
  if (nombre) {
    persons.forEach(element => {
      if (element.name === nombre) {
        contador = 4
      }
    })
  }

  switch (contador) {
    case 1:
      return response.status(400).json({
        NameError: 'el nombre no puede estar vacio'
      })
    case 2:
      return response.status(400).json({
        NumberError: 'el numero no puede estar vacio'
      })
    case 3:
      return response.status(400).json({
        NameError: 'el nombre no puede estar vacio',
        NumberError: 'el numero no puede estar vacio'
      })
    case 4:
      return response.status(400).json({
        NameError: 'el nombre ingresado ya se encuentra en los registro'
      })
  }

  const newPerson = {
    id: id,
    name: nombre,
    number: numero
  }
  persons = [...persons, newPerson]

  response.redirect('/api/personas')
})

// Middleware Final para rutas inexistentes
app.use((req, response, next) => {
  response.status(404).send('<h1 style="color: red;">Error 404</h1>')
  next()
})

// const app = http.createServer((request, response) => {
//   response.writeHead(200, { 'Content-Type': 'application/json' })
//   response.end(JSON.stringify(persons))
// })

const PORT = process.env.PORT

app.listen(PORT)
console.log(`Server running on port ${PORT}`)
