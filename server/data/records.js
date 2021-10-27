import db from '../models/index.js';

export async function createRecords(result) {
  const {event, winnerId, loserId} = result;
  console.log('result : ', result);
  const winnerRecord = await db.Records.findOne({
    where: {
      event,
      userId: winnerId,
    },
  }).then((data) => data.dataValues);
  const loserRecord = await db.Records.findOne({
    where: {event, userId: loserId},
  }).then((data) => data.dataValues);
  console.log('winner : ', winnerRecord, '\n', 'looser : ', loserRecord);

  await db.Records.update(
    {win: `${winnerRecord.win + 1}`},
    {where: {userId: winnerId, event}}
  );
  await db.Records.update(
    {point: `${winnerRecord.point + 3}`},
    {where: {userId: winnerId, event}}
  );
  await db.Records.update(
    {lose: `${loserRecord.lose + 1}`},
    {where: {userId: loserId, event}}
  );
  await db.Records.update(
    {point: `${loserRecord.point + 1}`},
    {where: {userId: loserId, event}}
  );

  const editedWinnerRecord = await db.Records.findOne({
    where: {userId: winnerId, event},
  }).then((data) => data.dataValues);
  const editedLoserRecord = await db.Records.findOne({
    where: {userId: loserId, event},
  }).then((data) => data.dataValues);
  console.log(editedWinnerRecord, editedLoserRecord);
  return {editedWinnerRecord, editedLoserRecord};
}
