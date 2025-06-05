const USERS_TABLE_NAME = 'users';

module.exports = function makeUsersDb({pg, generateId, moment}) {
  return Object.freeze({
    addUser,
    getAllUsers,
    getUserById,
    getUserByUsername,
    getUserByEmailId,
    getUserByEmailIdOrPhoneNumber,
    verifyPhoneNumberById,
    verifyEmailIdById,
    updateUserById,
  });

  async function addUser({fullName, username, phoneNumber, emailId, password, imageName, imageUrl}) {
    const query = `INSERT 
                    INTO ${USERS_TABLE_NAME} 
                      (id, full_name, username, phone_number, email, password, image_name, image_url)
                    VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
                    RETURNING id`;

    const id = await generateId({tableName: USERS_TABLE_NAME});

    const values = [id, fullName, username, phoneNumber, emailId, password, imageName, imageUrl];

    const result = await pg.query(query, values);

    return result.rows[0];
  }

  async function getAllUsers() {
    const query = `SELECT *
                    FROM ${USERS_TABLE_NAME}
                    WHERE is_deleted = FALSE`;

    const result = await pg.query(query);

    return result.rows;
  }

  async function getUserById({id}) {
    const query = `SELECT *
                    FROM ${USERS_TABLE_NAME}
                    WHERE id = $1
                      AND is_deleted = FALSE`;

    const values = [id];

    const result = await pg.query(query, values);

    return result.rows[0];
  }

  async function getUserByUsername({username}) {
    const query = `SELECT id, username
                    FROM ${USERS_TABLE_NAME}
                    WHERE username = $1
                      AND is_deleted = FALSE`;

    const values = [username];

    const result = await pg.query(query, values);

    return result.rows[0];
  }

  async function getUserByEmailId({emailId}) {
    const query = `SELECT *
                    FROM ${USERS_TABLE_NAME}
                    WHERE email = $1`;

    const values = [emailId];

    const result = await pg.query(query, values);

    return result.rows[0];
  }

  async function getUserByEmailIdOrPhoneNumber({emailId, phoneNumber}) {
    const query = `SELECT *
                    FROM ${USERS_TABLE_NAME}
                    WHERE (email = $1
                      OR phone_number LIKE '%${phoneNumber}')
                      AND is_deleted = FALSE`;

    const values = [emailId];

    const result = await pg.query(query, values);

    return result.rows[0];
  }

  async function verifyPhoneNumberById({id, isVerified}) {
    const query = `UPDATE ${USERS_TABLE_NAME}
                    SET phone_number_verified = $2,
                      updated_at = $3
                    WHERE id = $1
                      AND is_deleted = FALSE
                    RETURNING *`;

    const values = [id, isVerified, moment().toISOString()];

    const result = await pg.query(query, values);

    return result.rows[0];
  }

  async function verifyEmailIdById({id, isVerified}) {
    const query = `UPDATE ${USERS_TABLE_NAME}
                    SET email_verified = $2,
                      updated_at = $3
                    WHERE id = $1
                      AND is_deleted = FALSE
                    RETURNING *`;

    const values = [id, isVerified, moment().toISOString()];

    const result = await pg.query(query, values);

    return result.rows[0];
  }

  async function updateUserById({id, updateInfo}) {
    updateInfo.updated_at = moment().toISOString();

    const {columns, values} = manipulateJSONData({updateInfo});
    values.push(id);

    const query = `UPDATE ${USERS_TABLE_NAME}
                    SET ${columns}
                    WHERE id=$${values.length}
                      AND is_deleted = FALSE
                    RETURNING *`;

    const result = await pg.query(query, values);

    return result.rows[0];
  }

  function manipulateJSONData({updateInfo}) {
    let columns = '';
    const values = [];

    let i = 1;
    for (const column in updateInfo) {
      if (!columns) {
        columns += ` ${column} = $${i} `;
      } else {
        columns += `, ${column} = $${i} `;
      }

      values.push(updateInfo[column]);
      i++;
    }

    return {columns, values};
  }
};
