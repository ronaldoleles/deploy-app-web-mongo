const express = require("express")
const { redirect } = require("express/lib/response")
const router = express.Router()
const mongoose = require("mongoose")
require("../models/Categoria")
const Categoria = mongoose.model("categorias")
const{eAdmin} = require("../helpers/eAdmin")

router.get('/',eAdmin,(req,res)=>{
  res.render("admin/index")
})

router.get('/posts',eAdmin,(req,res)=>{
  res.send("Pagina de posts")
})


mongoose.Promise = global.Promise;
router.get('/categorias', eAdmin,(req, res) => {
  Categoria.find().sort({date:'desc'}).then((categorias) => {
      res.render('./admin/categorias', {categorias: categorias.map(categoria => categoria.toJSON())})    
  }).catch((err) => {
      console.log("Erro listar categorias! : " + err)
  });
})


router.get("/categorias/add",eAdmin,(req,res)=>{
  res.render("admin/addcategorias")
})
 
router.post('/categorias/nova',eAdmin,(req,res)=>{

  var erros = []

  if(!req.body.nome || typeof req.body.nome == undefined || req.body.nome == null || req.body.nome.length<10){
    erros.push({texto: "Nome inválido!"})
  }
  if(req.body.cpf.length < 11 || req.body.cpf.length > 11){
    erros.push({texto: "CPF inválido!"})
  }
  if(req.body.telefone.length < 9 || req.body.cpf.length > 12){
    erros.push({texto: "Telefone inválido!"})
  }
  if(erros.length > 0)
  { 
    res.render("admin/addcategorias",{erros: erros})
  }else{
     const novaCategoria = {
      nome: req.body.nome,
      cpf: req.body.cpf,
     telefone: req.body.telefone
  }
    new Categoria(novaCategoria).save().then(()=>{
      req.flash("success_msg","Funcionario cadastrado com sucesso!")
      res.redirect("/admin/categorias")
     
   }).catch((err)=>{
      req.flash("error_msg", "Erro ao cadastrar funcionário!! Tente novamente")
      res.redirect("/admin")
    })
  }
})


router.get("/categorias/edit/:id",eAdmin,(req,res)=>{
  //res.send("ROTA PARA EDIIÇÃO DE FUNCIONARIO")
  Categoria.findOne({_id: req.params.id}).lean().then((categoria)=>{
    res.render("admin/editcategorias", {categoria: categoria})
  }).catch((err)=>{
    req.flash("error_msg","Este funcionario não existe")
    res.redirect("/admin/categorias")
  })
})

router.post("/categorias/edit",eAdmin,(req,res)=>{
  Categoria.findOne({_id:req.body.id}).then((categoria)=>{
    categoria.nome = req.body.nome
    categoria.cpf = req.body.cpf

    categoria.telefone = req.body.telefone
    categoria.save().then(()=>{
        req.flash("success_msg","Funcionario editado com sucesso")
        res.redirect("/admin/categorias")
    }).catch((err)=>{
      req.flash("error_msg","Erro ao salvar edição!")
      res.redirect("/admin/categorias")
    })
  }).catch((err)=>{
    req.flash("error_msg","Erro ao salvar edição!")
    res.redirect("/admin/categorias")
  })
})

module.exports = router