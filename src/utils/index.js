/* eslint-disable camelcase */
const mapGetAllData = (song) => ({
  id: song.id,
  title: song.title,
  performer: song.performer,
});

const mapGetSingleData = ({
  id,
  title,
  year,
  performer,
  genre,
  duration,
  inserted_at,
  updated_at,
}) => ({
  id,
  title,
  year,
  performer,
  genre,
  duration,
  insertedAt: inserted_at,
  updatedAt: updated_at,
});

module.exports = { mapGetAllData, mapGetSingleData };
