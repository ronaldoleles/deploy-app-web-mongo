const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const Categoria = new Schema({
  nome: {
    type: String,
    required: true
  },
  cpf:{
    type: Number,
    required: true
  },
  telefone:{
    type: Number,
    required: true
  },
  date:{
    type: Date,
    default: Date.now()
  }
})

mongoose.model("categorias", Categoria)