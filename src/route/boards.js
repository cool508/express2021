import { Router } from "express";
import db from "../models/index.js";

const Board = db.Board;

const boardRouter = Router();

//게시글 전체 조회
boardRouter.get("/getList", async (req, res) => {
  try {
    const findBoardList = await Board.findAll();
    res.send({
      count: findBoardList.length,
      boards: findBoardList
    })
  } catch (err) {
    res.status(500).send("서버에 문제가 발생했습니다. 잠시 후 다시 시도해주세요.");
  }
});

// 전체 게시글 및 특정 게시글 조회
boardRouter.get("/", async (req, res) => {
  try {
    const { Op } = sequelize;
    let {id, title, content} = req.query;

    const findBoardQuery = {
      attributes: ['id', 'title', 'content']
    }
    if (id && title && content){
      findBoardQuery['where'] = { id, title: {[Op.substring]: title}, content: {[Op.substring]: content} }
    } else if (id){
      findBoardQuery['where'] = {id}
    } else if (title){
      findBoardQuery['where'] = { title: {[Op.substring]: title} } 
    } else if (content){
      findBoardQuery['where'] = { content: {[Op.substring]: content} }
    }

    const result = await Board.findAll(findBoardQuery);
    res.send({
      count: result.length,
      result : result
    });
  } catch (err){
    res.status(500).send("서버에 문제가 발생했습니다. 잠시 후 다시 시도해주세요.");
  }
});


//게시글 생성
boardRouter.post("/", (req, res) => {
  try {
    const createBoard = req.body;
    
    if (!createBoard.title || !createBoard.content){
      res.status(400).send("입력 요청이 잘못되었습니다.");
      return; 
    }

    const result = await Board.create({
      title: createBoard.title,
      content: createBoard.content
    });

    res.status(201).send({
      result : `작성을 완료했습니다.`,
      content: result
    });
  } catch (err){
      res.status(500).send("서버에 문제가 발생했습니다. 잠시 후 다시 시도해주세요.");
  }
});

// 게시글 수정
boardRouter.put("/:id", async (req, res) => {
  try {
    const updateBoardId = parseInt(req.params.id);
    const updateTitle = req.body.title;
    const updateContent = req.body.content;
    const { Op } = sequelize;
    const findBoard = await Board.findOne({
      where: {
        id : {[Op.eq]: updateBoardId}
      }
    });

    if (!findBoard || (!updateTitle && !updateContent)){
      res.status(400).send("해당 게시글이 존재하지 않거나, 입력 요청이 잘못되었습니다.");
      return; 
    }

    if (updateTitle) findBoard.title = updateTitle;
    if (updateContent) findBoard.content = updateContent;
    findBoard.save();
    res.status(200).send({
      msg : "수정을 완료하였습니다.",
      result : findBoard
    });
  } catch (err){
    res.status(500).send("서버에 문제가 발생했습니다. 잠시 후 다시 시도해주세요.");
  }
});

//게시글 삭제
boardRouter.delete("/:id", (req, res) => {
  try {
    const deleteBoardId = parseInt(req.params.id);
    const { Op } = sequelize;
    const findBoard = await Board.findOne({
      where: {
        id : {[Op.eq]: deleteBoardId}
      }
    });

    if (!findBoard){
      res.status(400).send("해당 회원이 존재하지 않습니다.");
      return; 
    }

    findBoard.destroy();
    res.status(200).send({
      msg : "삭제를 완료하였습니다."
    });
  } catch (err){
      res.status(500).send("서버에 문제가 발생했습니다. 잠시 후 다시 시도해주세요.");
  }
});

export default boardRouter;