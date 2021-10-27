import Sequelize from 'sequelize';
import db from '../models/index.js';
const Op = Sequelize.Op

export async function findByType(type) {
  if (type === 'all') {
    return db.Docs.findAll();
  }
  const result = await db.Docs.findAll({
    where: {
      type: type,
    },
  }).catch((err) => console.log(err));

  return result;
}

export async function findByEvent(data, event) {
  if (event === 'all') {
    return data;
  }
  return data.filter((post) => post.dataValues.event === event);
}

export async function findByTitle(data, title) {
  if (title === 'all') {
    return data;
  }
  return data.filter((post) => post.dataValues.title.includes(title));
}

export async function findByPlace(data, place) {
  if (place === 'all') {
    return data;
  }
  return data.filter((post) => post.dataValues.place.includes(place));
}

export async function countLike(data) {
  const docId = data.map((el) => el.id)
  const likeList = await db.Users_Docs.findAll({
    where: {
      docId: {
        [Op.in]: docId
      }
    }
  }).catch(err => console.log(err))

  const result = {}
  for(let i = 0; i < likeList.length; i++) {
    if(result[likeList[i].docId] === undefined) {
      result[likeList[i].docId] = 1
    } else {
      result[likeList[i].docId]++
    }
  }
  return result
}

export async function findByImg(data) {
  const docId = data.map((el) => el.id)
  const docList = await db.Docs_Images.findAll({
    where: {
      docId: {
        [Op.in]: docId
      }
    }
  }).catch(err => console.log(err))
  const imgId = docList.map((el) => el.imgId)
  const imgList = await db.Images.findAll({
    where: {
      id: {
        [Op.in]: imgId
      }
    }
  }).catch(err => console.log(err))

  const result = {}
  for(let i = 0; i < docList.length; i++) {
    for(let j = 0; j < imgList.length; j++) {
      if(result[docList[i].docId] === undefined && docList[i].imgId === imgList[j].id) {
        result[docList[i].docId] = [imgList[j].link]
      } else if (docList[i].imgId === imgList[j].id){
          result[docList[i].docId].push(imgList[j].link)
      }
    }
  }
  return result
}

export async function findByHost(hostId) {
  const result = await db.Docs.findAll({
    where: {
      userId: hostId
    }
  }).catch(err => console.log(err))
  return result
}

export async function findByGuest(guestId) {
  const participant = await db.Entries.findAll({
    where: {
      userId: guestId,
      status: '확정'
    }
  }).catch(err => console.log(err))
  const parDocId = participant.map((el) => el.dataValues.docId)
  const result = await db.Docs.findAll({
    where: {
      id: {
        [Op.in]: parDocId
      }
    }
  }).catch(err => console.log(err))
  return result
}

export async function validUser(id) {
  const result = await db.Users.findOne({
    where: {
      id: id
    }
  }).catch(err => console.log(err))
  return result
}

export async function findById(id) {
  try {
    return db.Docs.findOne({
      where: {id},
    }).then((data) => data.dataValues);
  } catch {
    return null;
  }
}

export async function validEvent(event) {
  return (
    event === 'all' ||
    event === 'tennis' ||
    event === 'pingpong' ||
    event === 'squash' ||
    event === 'badminton'
  );
}

export async function validType(type) {
  return (
    type === 'all' ||
    type === 'trade' ||
    type === 'match' ||
    type === 'tounarment'
  );
}