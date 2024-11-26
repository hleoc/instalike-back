import { getTodosPosts, criarPost, atualizarPost } from "../models/postsModel.js";
import fs from "fs";
import gerarDescricaoComGemini from "../services/geminiService.js"

export async function listarPosts(req, res) {
    //chama a funçao para buscar os posts
    const posts = await getTodosPosts();
    res.status(200).json(posts);//converte para o formato json
}

export async function postarNovoPost(req, res) {
    const novoPost = req.body;

    //tratamento de exceçao
    try {
        const postCriado = await criarPost(novoPost);
        res.status(200).json(postCriado);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({"Erro": "Falha na requisição"});
    }
}

export async function uploadImagem(req, res) {
    const novoPost = {
        descricao: "",
        imgUrl: req.file.originalname,
        alt: ""
    };

    //tratamento de exceçao
    try {
        // Cria um novo post no banco de dados e aguarda a conclusão da operação.
        const postCriado = await criarPost(novoPost);
    
        // Constrói o caminho completo para a imagem, utilizando o ID do post criado.
        const imagemAtualizada = `uploads/${postCriado.insertedId}.png`;
    
        // Renomeia o arquivo da imagem temporária para o novo nome, movendo-o para a pasta "uploads".
        fs.renameSync(req.file.path, imagemAtualizada);
    
        // Retorna o post criado com status 200 (sucesso).
        res.status(200).json(postCriado);
    } catch (error) {
        // Captura qualquer erro que possa ocorrer durante a execução do bloco try.
        console.error(error.message);
    
        // Retorna uma mensagem de erro genérica com status 500 (erro interno do servidor).
        res.status(500).json({"Erro": "Falha na requisição"});
    }
}

export async function atualizarNovoPost(req, res) {
    const id = req.params.id;
    const urlImagem = `http://localhost:3000/${id}.png`;
    

    //tratamento de exceçao
    try {
        const imgBuffer = fs.readFileSync(`uploads/${id}.png`);
        const descricao = await gerarDescricaoComGemini(imgBuffer);

        const post = {
            imgUrl: urlImagem,
            descricao: descricao,
            alt: req.body.alt
        }

        const postCriado = await atualizarPost(id, post);
        res.status(200).json(postCriado);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({"Erro": "Falha na requisição"});
    }
}