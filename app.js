const express = require ('express');
const ejs = require('ejs');
const bodyParser = require('body-parser');
const mysql = require('mysql2');
const app = express();
const session = require('express-session');
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));
app.set('view engine', 'ejs');

const db = mysql.createConnection({
  host: 'localhost',
  user: 'phpmyadmin',
  password: 'aluno',
  database: 'blog'
});


app.use(session({
    secret: '3673899202',
    resave: false,
    saveUninitialized: true
}));


db.connect((err) => {
    if (err) {
        console.error('Erro ao conectar ao banco de dados:', err);
        throw err;
    }
    console.log('Conexão com o banco de dados MySQL estabelecida.');
});



app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));
// Configurar EJS como o motor de visualização
app.set('view engine', 'ejs');


// Rota para a página de login
app.get('/', (req, res) => {
    // Passe a variável 'req' para o template e use-a nas páginas para renderizar partes do HTML conforme determinada condição
    // Por exemplo de o usuário estive logado, veja este exemplo no arquivo views/partials/header.ejs
    res.render('views/home', { req: req });
    console.log(`${req.session.username ? `Usuário ${req.session.username} logado no IP ${req.connection.remoteAddress}` : 'Usuário não logado.'}  `);
    //console.log(req.connection)
;});

// CREATE
app.post('/submit_post', (req, res) => {
  const { mensagens } = req.body;
  const sql = 'INSERT INTO Postagens (mensagens) VALUES (?)';
  db.query(sql, [mensagens], (err, result) => {
    if (err) throw err;
    res.redirect('/teste');
  });
});

// Página de login
app.get('/login', (req, res) => {
    res.render('login', { req: req });
});

app.get('/home', (req, res) => {
    res.render('home', { req: req });
});

app.get('/incorreta', (req, res) => {
    res.render('incorreta', { req: req });
});
app.get('/teste', (req, res) => {
  res.render('dashboard', { req: req });
});
app.get('/sobre', (req, res) => {
  res.render('sobre', { req: req });
});
app.get('/contato', (req, res) => {
  res.render('contato', { req: req });
});
app.get('/postagem', (req, res) => {
  res.render('postagem', { req: req });
});
app.get('/enviado', (req, res) => {
  res.render('enviado', { req: req });
});

app.get('/about', (req, res) => {
    res.render('about', { req: req })
});

// Rota para processar o formulário de login
app.post('/login', (req, res) => {
    const { username, password } = req.body;

    const query = 'SELECT * FROM login WHERE username = ? AND password =?';

    db.query(query, [username, password], (err, results) => {
        if (err) throw err;

        if (results.length > 0) {
            req.session.loggedin = true;
            req.session.username = username;
            res.redirect('/home');
        } else {
            // res.send('Credenciais incorretas. <a href="/">Tente novamente</a>');
            res.redirect('/incorreta');
        }
    });
});



app.get('/dashboard', (req, res) => {
        //
        //
        //modificação aqui
        if (req.session.loggedin) {
        //res.send(`Bem-vindo, ${req.session.username}!<br><a href="/logout">Sair</a>`);
        res.sendFile(__dirname + 'home');
        } else {
        res.send('Faça login para acessar esta página. <a href="/">Login</a>');
        }
        });




  app.get('/about', (req, res) => {
    db.query('SELECT * FROM login', (err, result) => {
      if (err) throw err;
      res.render('about', { login: result });
    });
  });
  

// UPDATE
app.post('/update/:id', (req, res) => {
  const { id } = req.params;
  const { name, email } = req.body;
  const sql = 'UPDATE login SET name = ?, email = ? WHERE id = ?';
  db.query(sql, [name, email, id], (err, result) => {
    if (err) throw err;
    res.redirect('/');
  });
});


// Rota para fazer logout
app.get('/logout', (req, res) => {
  req.session.destroy(() => {
      res.redirect('/');
  });
});

app.get('/about', (req, res) => {
    res.render('pages/about', { req: req })
});

app.get('/delete2/:id', (req, res) => {
  const { id } = req.params;
  const sql = 'DELETE FROM Postagens WHERE id = ?';
  console.log('Delete post')
  
  db.query(sql, [id], (err, result) => {
    if (err) throw err;
    res.redirect('/teste');
  });
});



// READ
app.get('/teste', (req, res) => {
  db.query('SELECT * FROM Postagens', (err, result) => {
    if (err) throw err;
    res.render('postagem', { Postagens: result });
  });
});
      


app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
