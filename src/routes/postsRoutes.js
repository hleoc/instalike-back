import express from "express";
import multer from "multer";
import cors from "cors";
import { listarPosts, postarNovoPost, uploadImagem, atualizarNovoPost } from "../controlles/postsController.js";

const corsOptions = {
    origin: "http://localhost:8000",
    optionsSuccessStatus: 200,
};

const upload = multer({dest: "./uploads"});

const routes = (app) => {
    //Permite que o servidor interprete requisiçao com body no formato JSON
    app.use(express.json());

    app.use(cors(corsOptions));

    //Rota para buscar todos os posts
    app.get("/posts", listarPosts);

    //declaraçao da funçao
    function buscarPostPorId(id) {
        return posts.findIndex((post) => {//metodo findIndex para entrar no array
            return post.id === Number(id);
        });
    };

    app.get("/posts/:id", (req, res) => {//:id é só colocar no navegador o id
        const index = buscarPostPorId(req.params.id);//executar a funçao
        res.status(200).json(posts[index]);//converte para o formato json
    });

    //rota para criar um post
    app.post("/posts", postarNovoPost);

    app.post("/upload", upload.single("imagem"), uploadImagem);

    app.put("/upload/:id", atualizarNovoPost);
}

export default routes;
