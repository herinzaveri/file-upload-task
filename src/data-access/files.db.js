const FILES_TABLE_NAME = 'files';

module.exports = function makeFilesDb({pg, generateId, moment}) {
  return Object.freeze({
    addFile,
    getFileByIdAndUserId,
  });

  async function addFile({userId, filename, path, title, description, status}) {
    const query = `INSERT 
                    INTO ${FILES_TABLE_NAME} 
                      (id, user_id, original_filename, storage_path, title, description, status)
                    VALUES ($1,$2,$3,$4,$5,$6,$7)
                    RETURNING *`;

    const id = await generateId({tableName: FILES_TABLE_NAME});

    const values = [id, userId, filename, path, title, description, status];

    const result = await pg.query(query, values);

    return result.rows[0];
  }

  async function getFileByIdAndUserId({id, userId}) {
    const query = `SELECT *
                    FROM ${FILES_TABLE_NAME}
                    WHERE id = $1
                      AND user_id = $2`;

    const values = [id, userId];

    const result = await pg.query(query, values);

    return result.rows[0];
  }
};
