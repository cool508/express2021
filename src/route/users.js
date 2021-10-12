import { Router } from "express";
import board from "../models/board.js";
import db from "../models/index.js";

// // sequelize 연결
// const seq = new sequelize('express', 'root', null, {
//   host: 'localhost',
//   dialect: 'mysql',
//   logging: false
// });

const User = db.User;
const userRouter = Router();

// 유저 가져오기 (전체)
userRouter.get("/", async(req, res) => {
  try {
    const { Op } = sequelize;
    let { name, age } = req.query;

    const findUserQuery = {
      attributes:['id', 'name', 'age']
    }

    if (name && age) {
      findUserQuery['where'] = { name : {[Op.substring]: name}, age}
    } else if (name) {
      findUserQuery['where'] = { name : {[Op.substring]: name} }
    } else if (age) {
      findUserQuery['where'] = { age }
    }

    const result = await User.findAll(findUserQuery);

    res.send({
      count : result.length,
      result : result
    });
  } catch(err) {
    res.status(500).send("서버에 문제 발생. 잠시 후 다시 시도!")
  }
});

//유저 생성
userRouter.post("/", (req, res) => {
  try {
    const createUser = req.body;
    
    if ( !createUser.name || !createUser.age ) {
      res.status(400).send({msg: "입력 요청 값이 잘못됨"});
    }
    
    const user = await User.create({
      name : createUser.name,
      age : parseInt(createUser.age)
    });

    res.status.apply(201).send({
      result : `${createUser.name} 유저가 생성됨`
    });
  } catch (err) {
    res.status(500).send({ msg : "서버에 문제 발생. 잠시 후 다시 시도!"})
  }
});

// 유저 정보 수정
userRouter.put("/:id", (req, res) => {
  try {
    const updateUser = parseInt(req.params.id);
    const updateUserName = req.body.name;
    const updateUserAge = req.body.age;
    const { Op } = sequelize;
    const findUser = await User.findOne({
      where: {
        id : {[Op.eq]: updateUser}
      }
    });

    if (!findUser || (!updateUserName && !updateUserAge)) {
      res.status(400).send("해당 회원이 존재하지 않거나, 입력 요청이 잘못됨");
      return; 
    }
    if (updateUserName) findUser.name = updateUserName;
    if (updateUserAge) findUser.age = updateUserAge;
    
    findUser.save();
    
    res.status(200).send({
      msg : "수정 완료",
      result : findUser
    });
  } catch (err) {
      res.status(500).send("서버에 문제 발생. 잠시 후 다시 시도!");
  }
});

// 유저 삭제
userRouter.delete("/:id", (req, res) => {
  try {
    const deleteUser = parseInt(req.params.id);
    const { Op } = sequelize;
    const findUser = await User.findOne({
      where: {
        id : {[Op.eq]: deleteUser}
      }
    });

    if (!findUser) {
      res.status(400).send("해당 회원이 존재하지 않음");
      return; 
    }

    findUser.destroy();

    res.status(200).send({
      msg : "삭제 완료"
    });
  } catch (err) {
      res.status(500).send("서버에 문제 발생. 잠시 후 다시 시도!");
  }
});

/*
  테스트 API ( CRUD )
  User.findAll();
  User.findOne();
  User.create();
  User.update();
  User.destroy();
*/
userRouter.get("/test/:id", async(req, res) => {
  try {
    // findAll
    const Op = sequelize.Op;
    const userResult = await User.findAll({
      attributes: ['id', 'name', 'age', 'updatedAt'],
      where: {
        /*
        (`user`.`name` LIKE '김%' AND `user`.`age` = 29) 
        or
        (`user`.`name` LIKE '하%' AND `user`.`age` = 29)
        */
        [Op.or] : [{
          [Op.and]: { 
            name: { [Op.startsWith] : "김" },
            age: { [Op.between] : [20, 29] }
          }
        }, {
          [Op.and]: { 
            name: { [Op.startsWith] : "하" },
            age: { [Op.between] : [30, 40] }
          }
        }]
      },
      order : [['age', 'DESC'],['name', 'ASC']]
    });

    const boardResult = await Board.findAll({
      attributes: ['id', 'title', 'updatedAt', 'createdAt'],
      limit: 100
    });
    const user = await User.findOne({
      where : { id: req.params.id}
    });
    const board = await Board.findOne({
      where : { id: req.params.id}
    });
  
    if ( !user || !board ){
    res.status(400).send({ msg: '해당 정보가 존재하지 않습니다' });
    }
    await user.destroy();
    board.title += "test 타이틀 입니다.";
    await board.save();
    
    res.status(200).send({
      board,
      users: {
        count: userResult.length,
        data: userResult
      },
      boards: {
        count: boardResult.length,
        data: boardResult
      }
    });
  } catch (err){
    console.log(err)
    res.status(500).send({msg: "서버에 문제가 발생했습니다. 잠시 후 다시 시도해주세요."})
  }
});

export default userRouter;

/*
userRouter.get("/test/:id", async(req, res) => {
  try {
    const result = await User.create({
      name : "테스트",
      age : 55
    });
    console.log(result.id);
    const findUser = await User.findOne({
      where: {
        id: req.params.id
      }
    });
    findUser.name = "배종범";
    await findUser.save();

    res.status(200).send({findUser})
  } catch(err){
    console.log(err)
    res.status(500).send({msg: "서버에 문제가 발생했습니다. 잠시 후 다시 시도해주세요."})
  }
});
*/